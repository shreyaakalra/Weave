import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const state = await req.json();
    const userId = state.clerkId || `user_${Date.now()}`;
    
    // NEW: Grab the seenIds from the frontend (default to empty array if none exist)
    const seenIds = state.seenIds || [];

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `GSQL-Secret ${process.env.TG_TOKEN}`
    };

    // Step 1 — Format interests
    const interestEdges: Record<string, { passion_score: { value: number } }> = {};
    if (state.interests && Array.isArray(state.interests)) {
      state.interests.forEach((interest: string) => {
        interestEdges[interest] = { passion_score: { value: 5 } };
      });
    }

    // Step 2 — Format TigerGraph Payload with CORRECT edge nesting
    const tgPayload = {
      vertices: {
        User: {
          [userId]: {
            nickname:        { value: state.nickname || state.name },
            city:            { value: state.city },
            energy:          { value: state.energy },
            mood:            { value: state.mood },
            schedule:        { value: state.schedule },
            depth:           { value: state.depth },
            genre:           { value: state.genre },
            friendship_type: { value: state.friendship },
            bio:             { value: state.bio }
          }
        }
      },
      edges: {
        User: {               
          [userId]: {         
            HAS_INTEREST: {   
              Interest: interestEdges 
            }
          }
        }
      }
    };

    // Step 3 — Upsert user into TigerGraph
    const upsertRes = await fetch(`${process.env.TG_ENDPOINT}/restpp/graph/weave`, {
      method: "POST",
      headers,
      body: JSON.stringify(tgPayload)
    });
    const upsertData = await upsertRes.json();
    console.log("UPSERT RESULT:", JSON.stringify(upsertData));

    // Step 4 — Run the actual match query
    const matchRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/query/weave/findBestMatch?user_id=${userId}`,
      { method: "GET", headers }
    );
    const matchData = await matchRes.json();

    // Step 5 — Filter algorithmic matches
    if (
      matchData.results &&
      matchData.results.length > 0 &&
      matchData.results[0].Top &&
      matchData.results[0].Top.length > 0
    ) {
      
      // THE FIX: Filter out the user themselves AND anyone in the seenIds list
      const validMatches = matchData.results[0].Top.filter(
        (m: { v_id: string }) => m.v_id !== userId && !seenIds.includes(m.v_id)
      );

      // If we still have matches left after filtering out the ones we've seen:
      if (validMatches.length > 0) {
        const matchedUserId = validMatches[0].v_id;
        const matchScore = validMatches[0].attributes?.score || 
                           matchData.results[0]["@@scores"]?.[matchedUserId] || 85;

        // Fetch their full profile
        const profileRes = await fetch(
          `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User/${matchedUserId}`,
          { method: "GET", headers }
        );
        const profileData = await profileRes.json();
        const matchedProfile = profileData.results?.[0];

        return NextResponse.json({
          success: true,
          match: [{
            v_id: matchedUserId,
            attributes: {
              ...matchedProfile?.attributes,
              score: matchScore
            }
          }]
        });
      }
    }

    // Step 6 — Fallback: grab any other user if no algorithmic match is found 
    // (Or if we filtered out all the algorithmic matches because we've seen them already)
    console.log("QUERY RETURNED EMPTY OR ALL SEEN — running fallback");
    const fallbackRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User?limit=20`,
      { method: "GET", headers }
    );
    const fallbackData = await fallbackRes.json();
    
    // Safety check
    if (!fallbackData.results || !Array.isArray(fallbackData.results)) {
       return NextResponse.json({ success: true, match: [] });
    }

    // THE FIX: Filter the fallback users too! Remove current user and anyone already seen.
    const otherUsers = fallbackData.results.filter(
      (u: { v_id: string }) => u.v_id !== userId && !seenIds.includes(u.v_id)
    );

    // If they have literally swiped through every single person in the database:
    if (otherUsers.length === 0) {
      return NextResponse.json({ success: true, match: [] });
    }

    // Return the next available person
    const fallbackUser = otherUsers[0];
    return NextResponse.json({
      success: true,
      match: [{
        v_id: fallbackUser.v_id,
        attributes: {
          ...fallbackUser.attributes,
          score: 72 // Override score to indicate a fallback match
        }
      }]
    });

  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to find match" },
      { status: 500 }
    );
  }
}