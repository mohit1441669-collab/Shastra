// netlify/functions/chat.js
// Node 18+ native fetch — no dependencies needed

exports.handler = async function(event, context) {
  // Increase timeout headroom
  context.callbackWaitsForEmptyEventLoop = false;

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "ANTHROPIC_API_KEY is not set. Go to Netlify → Site configuration → Environment variables → add ANTHROPIC_API_KEY → redeploy."
      }),
    };
  }

  // Parse request body safely
  let reqBody;
  try {
    reqBody = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid request body: " + e.message }),
    };
  }

  // Call Anthropic API
  let anthropicRes;
  try {
    anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: reqBody.model || "claude-sonnet-4-20250514",
        max_tokens: reqBody.max_tokens || 1200,
        messages: reqBody.messages || [],
      }),
    });
  } catch (e) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to reach Anthropic API: " + e.message }),
    };
  }

  // Read response body as text first (safer than .json() directly)
  let responseText;
  try {
    responseText = await anthropicRes.text();
  } catch (e) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to read Anthropic response: " + e.message }),
    };
  }

  // Parse the text as JSON
  let responseData;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Anthropic returned non-JSON response",
        raw: responseText.slice(0, 500),
      }),
    };
  }

  return {
    statusCode: anthropicRes.ok ? 200 : anthropicRes.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(responseData),
  };
};
