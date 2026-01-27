exports.handler = async function () {
  const EXEC_URL = "https://script.google.com/macros/s/AKfycbwF2IqDTG0F5acy4K1mtBRMZg1AOp3RMHzYwHEtZcZmRV8Jbpb2_ETe4Mpnkgp-lxmy/exec";
  // Example: https://script.google.com/macros/s/AKfycbXXXX/exec

  try {
    const r = await fetch(EXEC_URL, { cache: "no-store" });
    const body = await r.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      },
      body
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

