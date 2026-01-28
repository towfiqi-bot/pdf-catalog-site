const EXEC_URL =
  "https://script.google.com/macros/s/AKfycbwF2IqDTG0F5acy4K1mtBRMZg1AOp3RMHzYwHEtZcZmRV8Jbpb2_ETe4Mpnkgp-lxmy/exec";

exports.handler = async function (event) {
  try {
    const qs = event.queryStringParameters || {};
    const isRefresh = qs.refresh === "1";

    let url = EXEC_URL;

    // If website calls /catalog?refresh=1, trigger rebuild via Apps Script
    if (isRefresh) {
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

    // Always fetch origin fresh; caching happens at CDN via response headers below
    const r = await fetch(url, { cache: "no-store" });
    const body = await r.text();

    // Cache normal catalog responses briefly; NEVER cache refresh/rebuild
    const cacheControl = isRefresh
      ? "no-store, no-cache, must-revalidate, max-age=0"
      : "public, max-age=60, s-maxage=300, stale-while-revalidate=86400";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": cacheControl,
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
