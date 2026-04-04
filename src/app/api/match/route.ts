import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const state = await req.json();
    const userId = state.clerkId || `user_${Date.now()}`;

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

    // THE FIX: Correct TigerGraph edge nesting order!
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
        User: {               // 1. Source Vertex Type
          [userId]: {         // 2. Source Vertex ID
            HAS_INTEREST: {   // 3. Edge Type
              Interest: interestEdges // 4. Target Vertex Type & Data
            }
          }
        }
      }
    };

    // Step 2 — Upsert user into TigerGraph
    const upsertRes = await fetch(`${process.env.TG_ENDPOINT}/restpp/graph/weave`, {
      method: "POST",
      headers,
      body: JSON.stringify(tgPayload)
    });
    const upsertData = await upsertRes.json();
    console.log("UPSERT RESULT:", JSON.stringify(upsertData));

    // Step 3 — Check if interests actually exist in the graph (Debugging)
    const interestCheckRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/Interest?limit=5`,
      { method: "GET", headers }
    );
    const interestCheck = await interestCheckRes.json();
    console.log("INTERESTS IN GRAPH:", JSON.stringify(interestCheck));

    // Step 4 — Check HAS_INTEREST edges for this user (Fixed URL formatting)
    const edgeCheckRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave/edges/User/${userId}/HAS_INTEREST`,
      { method: "GET", headers }
    );
    const edgeCheck = await edgeCheckRes.json();
    console.log("EDGES FOR USER:", JSON.stringify(edgeCheck));

    // Step 5 — Run the actual match query
    const matchRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/query/weave/findBestMatch?user_id=${userId}`,
      { method: "GET", headers }
    );
    const matchData = await matchRes.json();
    console.log("FULL MATCH RESPONSE:", JSON.stringify(matchData, null, 2));

    // Step 6 — Check result for a true algorithmic match
    if (
      matchData.results &&
      matchData.results.length > 0 &&
      matchData.results[0].Top &&
      matchData.results[0].Top.length > 0
    ) {
      const matchedUserId = matchData.results[0].Top[0].v_id;
      // Depending on your query output, the score might be nested in attributes
      const matchScore = matchData.results[0].Top[0].attributes?.score || 
                         matchData.results[0]["@@scores"]?.[matchedUserId] || 85;

      // Fetch their full profile
      const profileRes = await fetch(
        `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User/${matchedUserId}`,
        { method: "GET", headers }
      );
      const profileData = await profileRes.json();
      console.log("MATCHED PROFILE:", JSON.stringify(profileData));

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

    // Step 7 — Fallback: grab any other user if no algorithmic match is found
    console.log("QUERY RETURNED EMPTY — running fallback");
    const fallbackRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User?limit=20`,
      { method: "GET", headers }
    );
    const fallbackData = await fallbackRes.json();
    
    // Safety check in case fallback fails entirely
    if (!fallbackData.results || !Array.isArray(fallbackData.results)) {
       return NextResponse.json({ success: true, match: [] });
    }

    // Filter out the current user
    const otherUsers = fallbackData.results.filter(
      (u: { v_id: string }) => u.v_id !== userId
    );

    if (otherUsers.length === 0) {
      return NextResponse.json({ success: true, match: [] });
    }

    // Return the first available person as a wildcard match
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