import { PageShell } from "@/components/layout/PageShell";
import { InheritanceClient } from "@/components/lenses/InheritanceClient";

export default function InheritancePage() {
  return (
    <PageShell
      title="Inheritance"
      subtitle="What this organisation believes and how it reasons — for the newly arrived."
      maxWidth="prose"
    >
      <InheritanceClient />
    </PageShell>
  );
}
