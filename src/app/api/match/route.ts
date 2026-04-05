import { NextResponse } from "next/server";

interface TigerGraphVertex {
  v_id: string;
  attributes: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const state = await req.json();
    const userId = state.clerkId || `user_${Date.now()}`;
    const seenIds: string[] = state.seenIds || [];

    const headers = {
      "Content-Type": "application/json",
      Authorization: `GSQL-Secret ${process.env.TG_TOKEN}`,
    };

    console.log("🔍 MATCH REQUEST for user:", userId, "seenIds:", seenIds.length);

    // 1. Upsert the user
    const interestEdges: Record<string, { passion_score: { value: number } }> = {};
    if (state.interests && Array.isArray(state.interests)) {
      state.interests.forEach((interest: string) => {
        interestEdges[interest] = { passion_score: { value: 5 } };
      });
    }

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
            bio: { value: state.bio },
          },
        },
      },
      edges: {
        User: {
          [userId]: {
            HAS_INTEREST: { Interest: interestEdges },
          },
        },
      },
    };

    await fetch(`${process.env.TG_ENDPOINT}/restpp/graph/weave`, {
      method: "POST",
      headers,
      body: JSON.stringify(tgPayload),
    });

    // 2. Try smart algorithmic match first
    let targetId: string | null = null;
    let targetScore = 85;

    const matchRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/query/weave/findBestMatch?user_id=${userId}`,
      { method: "GET", headers }
    );
    const matchData = await matchRes.json();

    if (matchData.results?.[0]?.Top?.length > 0) {
      const validNew = matchData.results[0].Top.filter(
        (m: { v_id: string }) => m.v_id !== userId && !seenIds.includes(m.v_id)
      );

      if (validNew.length > 0) {
        targetId = validNew[0].v_id;
        targetScore = validNew[0].attributes?.score || 85;
        console.log("✅ Found smart algorithmic match:", targetId);
      }
    }

    // 3. If no new smart match → fall back to full user list
    if (!targetId) {
      console.log("⚠️ No new algorithmic match → falling back to user list");
      const listRes = await fetch(
        `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User?limit=100`,
        { method: "GET", headers }
      );
      const listData = await listRes.json();

      if (listData.results?.length > 0) {
        const allUsers: TigerGraphVertex[] = listData.results;

        const newUsers = allUsers.filter(
          (u) => u.v_id !== userId && !seenIds.includes(u.v_id)
        );

        if (newUsers.length > 0) {
          targetId = newUsers[0].v_id;
          targetScore = 72;
          console.log("✅ Fallback: picked new user", targetId);
        } else if (seenIds.length > 0) {
          const randomSeenId = seenIds[Math.floor(Math.random() * seenIds.length)];
          targetId = randomSeenId;
          targetScore = 60;
          console.log("🔄 REMATCH: picked previous user", targetId);
        }
      }
    }

    // 4. Final safety net (should almost never happen)
    if (!targetId) {
      console.error("❌ NO OTHER USERS IN TIGERGRAPH AT ALL");
      return NextResponse.json({ success: true, match: [] });
    }

    // 5. ALWAYS fetch the full profile for the chosen user (clean & consistent)
    const profileRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User/${targetId}`,
      { method: "GET", headers }
    );
    const profileData = await profileRes.json();

    const matchedProfile = profileData.results?.[0] as TigerGraphVertex | undefined;

    if (!matchedProfile) {
      console.error("❌ Profile fetch failed for target:", targetId);
      return NextResponse.json({ success: true, match: [] });
    }

    console.log("🚀 RETURNING MATCH:", targetId, "score:", targetScore);

    return NextResponse.json({
      success: true,
      match: [
        {
          v_id: targetId,
          attributes: {
            ...matchedProfile.attributes,
            score: targetScore,
          },
        },
      ],
    });
  } catch (error) {
    console.error("💥 MATCH API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to find match" },
      { status: 500 }
    );
  }
}