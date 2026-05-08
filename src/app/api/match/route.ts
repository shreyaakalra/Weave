// ── 2. Try algorithmic match (The 10-Second Polling Room) ────────────────
    let targetId: string | null = null;
    let targetScore = 85;
    let matchTier: MatchTier = "algorithmic";

    // Loop 5 times, waiting 2 seconds each time (10 seconds total)
    for (let attempt = 0; attempt < 5; attempt++) {
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
          targetId = validMatches[0].v_id;
          targetScore = validMatches[0].attributes?.score ?? 85;
          console.log(`✅ Algorithmic match found on attempt ${attempt + 1}:`, targetId);
          break; // We found them! Break out of the loop immediately.
        }
      } catch (err) {
        console.warn(`⚠️ Algorithmic match query failed on attempt ${attempt + 1}:`, err);
      }

      // If we didn't find anyone, and this isn't our last attempt, wait 2 seconds.
      if (!targetId && attempt < 4) {
        console.log(`⏳ No match found yet. Waiting 2s (Attempt ${attempt + 1}/5)...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }