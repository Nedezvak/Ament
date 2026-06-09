// ament — shared TypeScript types
// These mirror the Prisma schema but are safe to import in client components.

export type MemberRole = "ADMIN" | "MEMBER";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  organisationId: string;
  role: MemberRole;
  joinedAt: string;
  user: UserProfile;
}

export interface Prompt {
  id: string;
  text: string;
  category: string | null;
  organisationId: string | null;
}

export interface Deposition {
  id: string;
  organisationId: string;
  authorId: string;
  promptId: string | null;
  body: string;        // HTML
  bodyPlain: string;
  themes: string[];
  isAnchor: boolean;
  anchorLabel: string | null;
  period: string | null;
  createdAt: string;
  author: UserProfile;
  prompt: Prompt | null;
}

export interface Essay {
  id: string;
  organisationId: string;
  period: string;
  title: string;
  body: string;  // HTML
  depositionIds: string[];
  generatedAt: string;
}

// API response shapes

export interface MirrorResponse {
  answer: string;
  citedDepositionIds: string[];
  isCorpusThin: boolean;
}

export interface SeamResponse {
  tension: string;
  hasGenuineTension: boolean;
  citedDepositionIds: string[];
}

export interface InheritanceResponse {
  briefing: string;
  depositionCount: number;
  anchorCount: number;
}
