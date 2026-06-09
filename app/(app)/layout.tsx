import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AppNav } from "@/components/layout/AppNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get the user's organisation
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: { organisation: true },
    orderBy: { joinedAt: "asc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <AppNav orgName={membership?.organisation.name} />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
