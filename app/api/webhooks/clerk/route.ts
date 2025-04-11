import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Log helper
const log = (message: string, data?: unknown) => {
  console.log(
    `[CLERK WEBHOOK] ${message}`,
    data ? JSON.stringify(data, null, 2) : ""
  );
};

// This endpoint needs to be public - Clerk needs to be able to reach it
export async function POST(req: Request) {
  log("Webhook received");

  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      log("Error: WEBHOOK_SECRET not found");
      return NextResponse.json(
        { error: "Missing webhook secret" },
        { status: 500 }
      );
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    log("Headers received", { svix_id, svix_timestamp, svix_signature });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      log("Error: Missing svix headers");
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await req.json();
    log("Request body", payload);

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(JSON.stringify(payload), {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      log("Webhook verified", { type: evt.type });
    } catch (err) {
      log("Webhook verification failed", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        username,
        image_url,
      } = evt.data;

      log("Processing user data", {
        id,
        email: email_addresses?.[0]?.email_address,
        first_name,
        last_name,
        username,
        image_url,
      });

      const email = email_addresses?.[0]?.email_address;

      if (!email) {
        log("Error: No email found");
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }

      try {
        const user = await prisma.user.upsert({
          where: { clerkId: id },
          update: {
            email,
            name:
              first_name && last_name
                ? `${first_name} ${last_name}`
                : first_name || last_name || "Anonymous",
            username: username || email.split("@")[0],
            avatarUrl: image_url,
          },
          create: {
            clerkId: id,
            email,
            name:
              first_name && last_name
                ? `${first_name} ${last_name}`
                : first_name || last_name || "Anonymous",
            username: username || email.split("@")[0],
            avatarUrl: image_url,
          },
        });

        log("User successfully synced", user);
        revalidatePath(`/profile/${id}`);

        return NextResponse.json({ success: true, user }, { status: 200 });
      } catch (err) {
        log("Database error", err);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    log("Unexpected error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
