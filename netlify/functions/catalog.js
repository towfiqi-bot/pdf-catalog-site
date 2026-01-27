const EXEC_URL =
  "https://script.google.com/macros/s/AKfycbwF2IqDTG0F5acy4K1mtBRMZg1AOp3RMHzYwHEtZcZmRV8Jbpb2_ETe4Mpnkgp-lxmy/exec";

exports.handler = async function (event) {
  try {
    const qs = event.queryStringParameters || {};
    let url = EXEC_URL;

    // If the website calls /catalog?refresh=1, trigger rebuild via Apps Script
    if (qs.refresh === "1") {
      const key = process.env.INDEX_REFRESH_KEY;
      if (!key) {
        return {
          statusCode: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Missing env var INDEX_REFRESH_KEY" }),
        };
      }
      url = `${EXEC_URL}?refresh=1&key=${encodeURIComponent(key)}`;
    }

    const r = await fetch(url, { cache: "no-store" });
    const body = await r.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || String(err) }),
    };
  }
};
