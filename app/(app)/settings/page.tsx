import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { InviteForm } from "@/components/lenses/InviteForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    include: {
      organisation: {
        include: {
          memberships: { include: { user: { select: { name: true, email: true } } } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  if (!membership) redirect("/dashboard");

  const org = membership.organisation;
  const isAdmin = membership.role === "ADMIN";

  return (
    <PageShell title="Settings" subtitle={org.name} maxWidth="prose">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-base font-normal" style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif" }}>
              Organisation
            </h2>
          </CardHeader>
          <CardBody>
            <dl className="text-sm flex flex-col gap-2" style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              <div className="flex justify-between">
                <dt style={{ color: "#8C8478" }}>Name</dt>
                <dd style={{ color: "#1A1816" }}>{org.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "#8C8478" }}>Slug</dt>
                <dd style={{ color: "#1A1816" }}>{org.slug}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "#8C8478" }}>Created</dt>
                <dd style={{ color: "#1A1816" }}>{format(new Date(org.createdAt), "d MMMM yyyy")}</dd>
              </div>
              <div className="flex justify-between">
                <dt style={{ color: "#8C8478" }}>Your role</dt>
                <dd style={{ color: "#1A1816" }}>{membership.role === "ADMIN" ? "Admin" : "Member"}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-normal" style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif" }}>
              Members ({org.memberships.length})
            </h2>
          </CardHeader>
          <CardBody className="!p-0">
            <ul>
              {org.memberships.map((m, i) => (
                <li
                  key={m.id}
                  className={`px-6 py-3 flex items-center justify-between ${i < org.memberships.length - 1 ? "border-b border-[#D6CFC0]/60" : ""}`}
                >
                  <div>
                    <p className="text-sm" style={{ color: "#1A1816", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                      {m.user.name || m.user.email}
                    </p>
                    {m.user.name && (
                      <p className="text-xs" style={{ color: "#8C8478", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                        {m.user.email}
                      </p>
                    )}
                  </div>
                  <Badge variant={m.role === "ADMIN" ? "anchor" : "default"}>
                    {m.role === "ADMIN" ? "Admin" : "Member"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <h2 className="text-base font-normal" style={{ fontFamily: "var(--font-garamond), EB Garamond, Georgia, serif" }}>
                Invite a member
              </h2>
            </CardHeader>
            <CardBody>
              <InviteForm organisationId={org.id} />
            </CardBody>
          </Card>
        )}

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm"
            style={{
              color: "#9C4221",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
              textUnderlineOffset: "3px",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </PageShell>
  );
}
