import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Receive the state from the frontend
    const state = await req.json();
    
    // 2. Generate a unique ID for this new user
    const userId = `user_${Date.now()}`; 

    // 3. Format the interests into TigerGraph's Edge structure
    const interestEdges: Record<string, { passion_score: { value: number } }> = {};
    
    state.interests.forEach((interest: string) => {
      interestEdges[interest] = { passion_score: { value: 5 } };
    });

    // 4. Build the exact payload TigerGraph expects for insertion
    const tgPayload = {
      vertices: {
        User: {
          [userId]: {
            nickname: { value: state.nickname || state.name },
            city: { value: state.city },
            energy: { value: state.energy },
            mood: { value: state.mood },
            schedule: { value: state.schedule },
            depth: { value: state.depth },
            genre: { value: state.genre },
            friendship_type: { value: state.friendship },
            bio: { value: state.bio }
          }
        }
      },
      edges: {
        HAS_INTEREST: {
          User: {
            [userId]: {
              Interest: interestEdges
            }
          }
        }
      }
    };

    // 5. Send the new user data to TigerGraph (UPSERT)
    await fetch(`${process.env.TG_ENDPOINT}/restpp/graph/weave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Notice we are using GSQL-Secret here because you generated a Secret Token!
        "Authorization": `GSQL-Secret ${process.env.TG_TOKEN}` 
      },
      body: JSON.stringify(tgPayload)
    });

    // 6. Run your findBestMatch query for this new user
    const queryRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/query/weave/findBestMatch?user_id=${userId}`, 
      {
        method: "GET",
        headers: {
          "Authorization": `GSQL-Secret ${process.env.TG_TOKEN}`
        }
      }
    );

    const matchData = await queryRes.json();

    // 7. Send the results back to the frontend
    return NextResponse.json({ success: true, match: matchData.results });

  } catch (error) {
    console.error("Match error:", error);
    return NextResponse.json({ success: false, error: "Failed to find match" }, { status: 500 });
  }
}