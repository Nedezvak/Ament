import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export default async function InvitePage({
  params,
}: {
  params: { token: string };
}) {
  const invite = await db.invite.findUnique({
    where: { token: params.token },
    include: { organisation: true },
  });

  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F4EFE4" }}>
        <Logo size="lg" className="mb-8" />
        <p
          className="text-lg"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", fontStyle: "italic", color: "#8C8478" }}
        >
          This invitation is no longer valid.
        </p>
      </div>
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    // Redirect to login, then back here
    redirect(`/login?callbackUrl=/invite/${params.token}`);
  }

  // Verify email matches
  if (session.user.email?.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: "#F4EFE4" }}>
        <Logo size="lg" className="mb-8" />
        <p
          className="text-lg max-w-md"
          style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif", fontStyle: "italic", color: "#8C8478" }}
        >
          This invitation was sent to {invite.email}, but you are signed in as {session.user.email}.
          Please sign in with the invited email address.
        </p>
      </div>
    );
  }

  // Accept the invite
  await db.$transaction(async (tx) => {
    const existing = await tx.membership.findUnique({
      where: { userId_organisationId: { userId: session.user!.id!, organisationId: invite.organisationId } },
    });

    if (!existing) {
      await tx.membership.create({
        data: {
          userId: session.user!.id!,
          organisationId: invite.organisationId,
          role: invite.role,
        },
      });
    }

    await tx.invite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });
  });

  redirect("/dashboard");
}
