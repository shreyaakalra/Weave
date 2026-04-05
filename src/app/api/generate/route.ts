import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const prompts = {
  bucketlist: (interests1: string, interests2: string) => `
You are helping two people become better friends. Based on their shared interests, generate a bucket list of 8 fun activities they should do together. Mix easy/quick things with bigger adventures.

Person A interests: ${interests1}
Person B interests: ${interests2}

Return ONLY a valid JSON array, no markdown, no explanation, no code fences:
[{ "emoji": "🎯", "title": "Short title", "desc": "One sentence description", "difficulty": "Easy" }, ...]

difficulty must be exactly one of: Easy, Medium, Adventure`,

  icebreakers: (interests1: string, interests2: string) => `
You are helping two people who just matched on a friendship app start a conversation. Based on their interests, generate 6 specific fun icebreaker questions — not generic ones. Make them feel natural and interest-specific.

Person A interests: ${interests1}
Person B interests: ${interests2}

Return ONLY a valid JSON array, no markdown, no explanation, no code fences:
[{ "emoji": "💬", "prompt": "The icebreaker question here", "tag": "OneWordCategory" }, ...]`,
};

export async function POST(req: NextRequest) {
  try {
    const { type, interests1, interests2 } = await req.json();

    if (!type || !prompts[type as keyof typeof prompts]) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const prompt = prompts[type as keyof typeof prompts](
      interests1?.join(", ") || "general",
      interests2?.join(", ") || "general"
    );

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const items = JSON.parse(clean);

    return NextResponse.json({ items });
  } catch (err) {
    console.error("Generate route error:", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}