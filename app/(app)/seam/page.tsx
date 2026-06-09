import { PageShell } from "@/components/layout/PageShell";
import { SeamClient } from "@/components/lenses/SeamClient";

export default function SeamPage() {
  return (
    <PageShell
      title="Seam"
      subtitle="Surface genuine tension inside the corpus. Named, not resolved."
      maxWidth="prose"
    >
      <SeamClient />
    </PageShell>
  );
}
