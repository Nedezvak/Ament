import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email(),
  organisationId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = InviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email, organisationId } = parsed.data;

    // Confirm requester is admin of this org
    const membership = await db.membership.findUnique({
      where: { userId_organisationId: { userId: session.user.id, organisationId } },
      include: { organisation: true },
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can invite members" }, { status: 403 });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invite = await db.invite.create({
      data: {
        email,
        organisationId,
        invitedById: session.user.id,
        expiresAt,
      },
    });

    // Send invite email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const inviteUrl = `${process.env.NEXTAUTH_URL}/invite/${invite.token}`;
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@ament.app",
          to: email,
          subject: `You've been invited to ${membership.organisation.name} on ament`,
          html: `<p>You have been invited to join <strong>${membership.organisation.name}</strong> on ament.</p>
                 <p><a href="${inviteUrl}">Accept invitation</a></p>
                 <p>This invitation expires in 7 days.</p>`,
        });
      } catch (emailErr) {
        console.error("Failed to send invite email:", emailErr);
        // Don't fail the request — invite record exists; admin can share link manually
      }
    }

    return NextResponse.json({ invite });
  } catch (err) {
    console.error("POST /api/invites error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
