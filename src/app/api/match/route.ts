import { NextResponse } from "next/server";

interface TigerGraphVertex {
  v_id: string;
  attributes: Record<string, unknown>;
}

// ─── Match quality tiers — surfaced to the client so the UI can reflect reality
type MatchTier = "algorithmic" | "fallback" | "rematch";

export async function POST(req: Request) {
  try {
    const state = await req.json();
    const userId: string = state.clerkId || `user_${Date.now()}`;
    const seenIds: string[] = Array.isArray(state.seenIds) ? state.seenIds : [];

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `GSQL-Secret ${process.env.TG_TOKEN}`,
    };

    console.log("🔍 MATCH REQUEST for user:", userId, "seenIds:", seenIds.length);

    // ── 1. Upsert the current user ──────────────────────────────────────────
    const interestEdges: Record<string, { passion_score: { value: number } }> = {};
    if (Array.isArray(state.interests)) {
      for (const interest of state.interests as string[]) {
        interestEdges[interest] = { passion_score: { value: 5 } };
      }
    }

    const tgPayload = {
      vertices: {
        User: {
          [userId]: {
            nickname:        { value: state.nickname || state.name || "" },
            city:            { value: state.city || "" },
            energy:          { value: state.energy || "" },
            mood:            { value: state.mood || "" },
            schedule:        { value: state.schedule || "" },
            depth:           { value: state.depth || "" },
            genre:           { value: state.genre || "" },
            friendship_type: { value: state.friendship || "" },
            bio:             { value: state.bio || "" },
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

    const upsertRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave`,
      { method: "POST", headers, body: JSON.stringify(tgPayload) }
    );
    if (!upsertRes.ok) {
      console.warn("⚠️ User upsert returned non-OK:", upsertRes.status);
    }

    // ── 2. Try algorithmic match ────────────────────────────────────────────
    let targetId: string | null = null;
    let targetScore = 85;
    let matchTier: MatchTier = "algorithmic";

    try {
      const matchRes = await fetch(
        `${process.env.TG_ENDPOINT}/restpp/query/weave/findBestMatch?user_id=${encodeURIComponent(userId)}`,
        { method: "GET", headers }
      );
      const matchData = await matchRes.json();

      const topMatches: Array<{ v_id: string; attributes?: { score?: number } }> =
        matchData.results?.[0]?.Top ?? [];

      // Filter out self and already-seen users
      const validMatches = topMatches.filter(
        (m) => m.v_id !== userId && !seenIds.includes(m.v_id)
      );

      if (validMatches.length > 0) {
        targetId    = validMatches[0].v_id;
        targetScore = validMatches[0].attributes?.score ?? 85;
        console.log("✅ Algorithmic match found:", targetId, "score:", targetScore);
      }
    } catch (err) {
      console.warn("⚠️ Algorithmic match query failed:", err);
    }

    // ── 3. Fallback: pick any unseen user ───────────────────────────────────
    if (!targetId) {
      matchTier = "fallback";
      console.log("⚠️ No algorithmic match → falling back to user list");

      try {
        const listRes = await fetch(
          `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User?limit=100`,
          { method: "GET", headers }
        );
        const listData = await listRes.json();
        const allUsers: TigerGraphVertex[] = listData.results ?? [];

        const unseenUsers = allUsers.filter(
          (u) => u.v_id !== userId && !seenIds.includes(u.v_id)
        );

        if (unseenUsers.length > 0) {
          // Pick a random unseen user rather than always the first one,
          // so repeated fallbacks feel varied.
          const pick = unseenUsers[Math.floor(Math.random() * unseenUsers.length)];
          targetId    = pick.v_id;
          targetScore = 72;
          console.log("✅ Fallback: picked unseen user", targetId);
        } else if (seenIds.length > 0) {
          // All users have been seen — allow a rematch
          matchTier   = "rematch";
          targetId    = seenIds[Math.floor(Math.random() * seenIds.length)];
          targetScore = 60;
          console.log("🔄 Rematch: picked previously-seen user", targetId);
        }
      } catch (err) {
        console.error("❌ User list fetch failed:", err);
      }
    }

    // ── 4. Safety net — no other users exist at all ─────────────────────────
    if (!targetId) {
      console.error("❌ No other users in TigerGraph");
      return NextResponse.json({ success: true, match: [] });
    }

    // ── 5. Fetch the full profile for the chosen user ───────────────────────
    const profileRes = await fetch(
      `${process.env.TG_ENDPOINT}/restpp/graph/weave/vertices/User/${encodeURIComponent(targetId)}`,
      { method: "GET", headers }
    );
    const profileData = await profileRes.json();
    const matchedProfile = profileData.results?.[0] as TigerGraphVertex | undefined;

    if (!matchedProfile) {
      console.error("❌ Profile fetch failed for target:", targetId);
      return NextResponse.json({ success: true, match: [] });
    }

    console.log("🚀 Returning match:", targetId, "tier:", matchTier, "score:", targetScore);

    return NextResponse.json({
      success: true,
      match: [
        {
          v_id: targetId,
          matchTier,           // ← now surfaced so the UI can show honest context
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