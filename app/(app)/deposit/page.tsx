import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/PageShell";
import { DepositForm } from "@/components/lenses/DepositForm";

export default async function DepositPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    orderBy: { joinedAt: "asc" },
  });

  if (!membership) redirect("/dashboard");

  const prompts = await db.prompt.findMany({
    where: {
      organisationId: membership.organisationId,
      isActive: true,
    },
    orderBy: { category: "asc" },
  });

  return (
    <PageShell
      title="Deposit"
      subtitle="Add your thought to the corpus."
      maxWidth="prose"
    >
      <DepositForm prompts={prompts} />
    </PageShell>
  );
}
