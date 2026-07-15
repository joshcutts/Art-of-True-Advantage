const prerender = false;
const POST = async ({ request }) => {
  try {
    const { email, name } = await request.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400
      });
    }
    const apiKey = undefined                                  ;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server key misconfigured" }),
        { status: 500 }
      );
    }
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          email,
          fields: {
            name: name || ""
          },
          status: "active"
          // Sets them as active immediately
        })
      }
    );
    if (!response.ok) {
      const errData = await response.json();
      return new Response(
        JSON.stringify({ error: errData.message || "Subscription failed" }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
