import OpenAI from "openai";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { message, history } = JSON.parse(event.body || "{}");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const input = [
      { role: "system", content: "You are the default narrator for a Bronze-Age roleplay world. Be vivid, concise, and stay in-world." },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message || "" }
    ];

    const r = await openai.responses.create({ model: "gpt-5", input });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: r.output_text || "…" })
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ reply: "Sorry, I hit a snag." }) };
  }
}
