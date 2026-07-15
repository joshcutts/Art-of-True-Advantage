import type { APIRoute } from "astro";

// Tell Astro NOT to pre-render this endpoint to static HTML
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = import.meta.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error("Missing MAILERLITE_API_KEY environment variable.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Call the MailerLite v3 API to search for the subscriber by email
    const response = await fetch(
      `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ active: false, message: "Subscriber not found" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = await response.json();
    const isSubscribed = result.data?.status === "active";

    return new Response(JSON.stringify({ active: isSubscribed }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in verification API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
