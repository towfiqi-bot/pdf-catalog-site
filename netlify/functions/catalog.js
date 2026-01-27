exports.handler = async function () {
  const EXEC_URL = "https://script.google.com/macros/s/AKfycbwMkpBHO-pShCbr2bLhKWa7RPN_4m_qILzUcESaEph7iE8yLQDP44bBmUEFkHDeX6iA/exec";
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
