import { NextResponse } from "next/server";

export async function GET() {
  try {
    // We just ask TigerGraph for its endpoints to prove we are active
    const res = await fetch(`${process.env.TG_ENDPOINT}/restpp/endpoints`, {
      method: "GET",
      headers: {
        "Authorization": `GSQL-Secret ${process.env.TG_TOKEN}`
      }
    });

    if (res.ok) {
      console.log("⏰ Keep-alive ping successful. TigerGraph is awake.");
      return NextResponse.json({ success: true, status: "awake" });
    } else {
      return NextResponse.json({ success: false, status: "failed to wake" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ping failed" }, { status: 500 });
  }
}