import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    const apiKey = import.meta.env.MAILERLITE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server key misconfigured" }),
        { status: 500 },
      );
    }

    // Add/upsert the subscriber in MailerLite v3
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: name || "",
          },
          status: "active", // Sets them as active immediately
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json();
      return new Response(
        JSON.stringify({ error: errData.message || "Subscription failed" }),
        { status: 400 },
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
