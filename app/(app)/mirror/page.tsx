import { PageShell } from "@/components/layout/PageShell";
import { MirrorClient } from "@/components/lenses/MirrorClient";

export default function MirrorPage() {
  return (
    <PageShell
      title="Mirror"
      subtitle="Ask the organisation a question. Answers draw from its corpus and cite their sources."
      maxWidth="prose"
    >
      <MirrorClient />
    </PageShell>
  );
}
