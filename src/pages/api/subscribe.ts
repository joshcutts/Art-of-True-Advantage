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

    const groupId = "189550789194155637";

    // Step 1: Create or update subscriber record
    const subResponse = await fetch(
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
          status: "active",
        }),
      },
    );

    const subData = await subResponse.json();

    if (!subResponse.ok) {
      return new Response(
        JSON.stringify({ error: subData.message || "Subscription failed" }),
        { status: 400 },
      );
    }

    const subscriberId = subData.data?.id;

    // Step 2: Explicitly attach subscriber to group to guarantee trigger dispatch
    if (subscriberId) {
      const groupResponse = await fetch(
        `https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${groupId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      if (!groupResponse.ok) {
        console.error("Failed to assign group:", await groupResponse.json());
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
