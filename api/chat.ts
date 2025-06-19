export default async function handler(req: Request): Promise<Response> {
  const body = await req.json();

  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!openRouterKey) {
    return new Response("No OpenRouter API key found", { status: 401 });
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openRouterKey}`
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: body.messages
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
