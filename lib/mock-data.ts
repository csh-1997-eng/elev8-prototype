import { Profile, Community, Thread, Comment, CommunityMembership, CommunityReputation } from "./types";

// ── Profiles ──────────────────────────────────────────────
export const MOCK_PROFILES: Profile[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    username: "cole",
    display_name: "Cole Hoffman",
    bio: "Builder. Applied AI engineer. Trying to make the internet less extractive.",
    avatar_url: null,
    rac_score: 142,
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    username: "alex_r",
    display_name: "Alex Rivera",
    bio: "Philosophy nerd. Thinks about systems and incentives.",
    avatar_url: null,
    rac_score: 87,
    created_at: "2025-02-01T12:00:00Z",
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    username: "priya_k",
    display_name: "Priya Kumar",
    bio: "Full-stack dev. Obsessed with clean UI.",
    avatar_url: null,
    rac_score: 63,
    created_at: "2025-02-10T08:00:00Z",
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    username: "marcus_j",
    display_name: "Marcus Johnson",
    bio: "Crypto & DeFi researcher. Base chain maximalist.",
    avatar_url: null,
    rac_score: 105,
    created_at: "2025-03-01T14:00:00Z",
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    username: "sarah_l",
    display_name: "Sarah Lin",
    bio: "Product designer at a startup. Minimalism enthusiast.",
    avatar_url: null,
    rac_score: 51,
    created_at: "2025-03-15T09:00:00Z",
  },
];

// The "logged in" user for mock mode
export const MOCK_CURRENT_USER = MOCK_PROFILES[0];

// ── Communities ───────────────────────────────────────────
export const MOCK_COMMUNITIES: Community[] = [
  {
    id: "c0mm-0001-4000-8000-000000000001",
    name: "Technology",
    slug: "technology",
    description: "Software, hardware, AI, and everything in between.",
    icon_url: null,
    created_by: MOCK_PROFILES[0].id,
    member_count: 1243,
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "c0mm-0002-4000-8000-000000000002",
    name: "Philosophy",
    slug: "philosophy",
    description: "Big questions, clear thinking, honest debate.",
    icon_url: null,
    created_by: MOCK_PROFILES[1].id,
    member_count: 876,
    created_at: "2025-01-22T10:00:00Z",
  },
  {
    id: "c0mm-0003-4000-8000-000000000003",
    name: "Design",
    slug: "design",
    description: "UI, UX, product design, and visual craft.",
    icon_url: null,
    created_by: MOCK_PROFILES[4].id,
    member_count: 654,
    created_at: "2025-01-25T10:00:00Z",
  },
  {
    id: "c0mm-0004-4000-8000-000000000004",
    name: "Crypto & Web3",
    slug: "crypto",
    description: "Blockchain, DeFi, DAOs, and the decentralized future.",
    icon_url: null,
    created_by: MOCK_PROFILES[3].id,
    member_count: 2105,
    created_at: "2025-02-01T10:00:00Z",
  },
  {
    id: "c0mm-0005-4000-8000-000000000005",
    name: "Startups",
    slug: "startups",
    description: "Building companies, fundraising, and growth.",
    icon_url: null,
    created_by: MOCK_PROFILES[0].id,
    member_count: 1587,
    created_at: "2025-02-05T10:00:00Z",
  },
  {
    id: "c0mm-0006-4000-8000-000000000006",
    name: "Science",
    slug: "science",
    description: "Research, discoveries, and the scientific method.",
    icon_url: null,
    created_by: MOCK_PROFILES[2].id,
    member_count: 932,
    created_at: "2025-02-10T10:00:00Z",
  },
];

// ── Threads ───────────────────────────────────────────────
export const MOCK_THREADS: Thread[] = [
  {
    id: "thrd-0001-4000-8000-000000000001",
    title: "Why I think attention-based monetization is broken",
    body: "Social media companies optimize for engagement, not value. The content that gets the most likes isn't necessarily the best content — it's the most provocative. What if we could align financial incentives with actual content quality? I've been thinking about replacing likes with a token that represents real ownership in the platform...",
    community_id: MOCK_COMMUNITIES[0].id,
    author_id: MOCK_PROFILES[0].id,
    thread_type: "question",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 47,
    comment_count: 12,
    created_at: "2025-12-01T14:30:00Z",
    author: MOCK_PROFILES[0],
    community: MOCK_COMMUNITIES[0],
  },
  {
    id: "thrd-0002-4000-8000-000000000002",
    title: "The paradox of value in digital spaces",
    body: "We assign value to physical goods based on scarcity and utility. But digital content can be infinitely reproduced. So how do we create a system where quality content is genuinely valued? Is blockchain the answer, or are we just recreating the same problems with new technology?",
    community_id: MOCK_COMMUNITIES[1].id,
    author_id: MOCK_PROFILES[1].id,
    thread_type: "question",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 34,
    comment_count: 8,
    created_at: "2025-11-28T09:15:00Z",
    author: MOCK_PROFILES[1],
    community: MOCK_COMMUNITIES[1],
  },
  {
    id: "thrd-0003-4000-8000-000000000003",
    title: "Designing for trust: lessons from Apple's UI philosophy",
    body: "Apple's design language communicates reliability through simplicity. Every unnecessary element they remove increases user trust. When building social platforms, this principle is even more important — users need to trust where their money and attention go.",
    community_id: MOCK_COMMUNITIES[2].id,
    author_id: MOCK_PROFILES[4].id,
    thread_type: "discussion",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 28,
    comment_count: 5,
    created_at: "2025-11-25T16:45:00Z",
    author: MOCK_PROFILES[4],
    community: MOCK_COMMUNITIES[2],
  },
  {
    id: "thrd-0004-4000-8000-000000000004",
    title: "Base L2 is quietly becoming the best chain for consumer apps",
    body: "Low fees, Coinbase backing, growing ecosystem. If you're building a consumer-facing crypto app, Base should be your default choice. Here's why the transaction costs and developer experience make it ideal for microtransactions like content tipping...",
    community_id: MOCK_COMMUNITIES[3].id,
    author_id: MOCK_PROFILES[3].id,
    thread_type: "discussion",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 63,
    comment_count: 19,
    created_at: "2025-11-20T11:00:00Z",
    author: MOCK_PROFILES[3],
    community: MOCK_COMMUNITIES[3],
  },
  {
    id: "thrd-0005-4000-8000-000000000005",
    title: "How to validate a social app idea without building the whole thing",
    body: "Most social apps fail because they try to build everything at once. Start with a single interaction loop. For us, that means: post → comment → upvote. Get that feeling right first, then layer on complexity.",
    community_id: MOCK_COMMUNITIES[4].id,
    author_id: MOCK_PROFILES[0].id,
    thread_type: "question",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 41,
    comment_count: 7,
    created_at: "2025-11-18T13:20:00Z",
    author: MOCK_PROFILES[0],
    community: MOCK_COMMUNITIES[4],
  },
  {
    id: "thrd-0006-4000-8000-000000000006",
    title: "The neuroscience of doom scrolling and how to design against it",
    body: "Variable ratio reinforcement schedules are what make social media addictive. But what if the reward mechanism was tied to quality rather than quantity? A platform where you get rewarded for thoughtful engagement, not just screen time.",
    community_id: MOCK_COMMUNITIES[5].id,
    author_id: MOCK_PROFILES[2].id,
    thread_type: "question",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 55,
    comment_count: 14,
    created_at: "2025-11-15T10:30:00Z",
    author: MOCK_PROFILES[2],
    community: MOCK_COMMUNITIES[5],
  },
  {
    id: "thrd-0007-4000-8000-000000000007",
    title: "Should community moderators be compensated with tokens?",
    body: "Moderators are the backbone of any community platform, but they're almost never compensated. If we have a native token, allocating a percentage to active moderators could solve this. Thoughts on the incentive design?",
    community_id: MOCK_COMMUNITIES[3].id,
    author_id: MOCK_PROFILES[1].id,
    thread_type: "question",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 29,
    comment_count: 11,
    created_at: "2025-11-12T15:45:00Z",
    author: MOCK_PROFILES[1],
    community: MOCK_COMMUNITIES[3],
  },
  {
    id: "thrd-0008-4000-8000-000000000008",
    title: "Minimal viable product vs minimal lovable product",
    body: "MVPs get you to market fast. But for social apps, the experience needs to feel good from day one. Nobody wants to join a community that feels broken. I'd argue we need an MLP — something people actually enjoy using, even if it's limited in scope.",
    community_id: MOCK_COMMUNITIES[4].id,
    author_id: MOCK_PROFILES[4].id,
    thread_type: "discussion",
    question_type: null,
    question_type_locked: false,
    status: "open",
    accepted_answer_id: null,
    upvotes: 38,
    comment_count: 6,
    created_at: "2025-11-10T08:00:00Z",
    author: MOCK_PROFILES[4],
    community: MOCK_COMMUNITIES[4],
  },
];

// ── Comments ──────────────────────────────────────────────
export const MOCK_COMMENTS: Comment[] = [
  {
    id: "cmnt-0001-4000-8000-000000000001",
    body: "This is exactly what I've been thinking. The attention economy rewards outrage, not insight. A token-based system could flip those incentives if designed correctly.",
    thread_id: MOCK_THREADS[0].id,
    author_id: MOCK_PROFILES[1].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 12,
    created_at: "2025-12-01T15:00:00Z",
    author: MOCK_PROFILES[1],
  },
  {
    id: "cmnt-0002-4000-8000-000000000002",
    body: "How do you prevent whales from just buying influence though? That's the problem with most token-based governance.",
    thread_id: MOCK_THREADS[0].id,
    author_id: MOCK_PROFILES[3].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 8,
    created_at: "2025-12-01T15:30:00Z",
    author: MOCK_PROFILES[3],
  },
  {
    id: "cmnt-0003-4000-8000-000000000003",
    body: "Great point. I think quadratic voting or reputation-weighted tokens could help. One token ≠ one vote.",
    thread_id: MOCK_THREADS[0].id,
    author_id: MOCK_PROFILES[0].id,
    parent_id: "cmnt-0002-4000-8000-000000000002",
    is_accepted: false,
    upvotes: 15,
    created_at: "2025-12-01T16:00:00Z",
    author: MOCK_PROFILES[0],
  },
  {
    id: "cmnt-0004-4000-8000-000000000004",
    body: "Blockchain adds a verifiable layer, but the real innovation has to be in the incentive design, not the technology itself.",
    thread_id: MOCK_THREADS[1].id,
    author_id: MOCK_PROFILES[2].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 6,
    created_at: "2025-11-28T10:00:00Z",
    author: MOCK_PROFILES[2],
  },
  {
    id: "cmnt-0005-4000-8000-000000000005",
    body: "The gas fees on Base are practically zero now. I tipped someone 0.50 USDC and the fee was less than a cent.",
    thread_id: MOCK_THREADS[3].id,
    author_id: MOCK_PROFILES[0].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 22,
    created_at: "2025-11-20T12:00:00Z",
    author: MOCK_PROFILES[0],
  },
  {
    id: "cmnt-0006-4000-8000-000000000006",
    body: "Agreed on MLP over MVP. Reddit felt special early on because of the culture, not the features. Get the vibe right first.",
    thread_id: MOCK_THREADS[7].id,
    author_id: MOCK_PROFILES[2].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 9,
    created_at: "2025-11-10T09:30:00Z",
    author: MOCK_PROFILES[2],
  },
  {
    id: "cmnt-0007-4000-8000-000000000007",
    body: "This Apple design philosophy translates so well to trust-based platforms. Less noise = more confidence in the content.",
    thread_id: MOCK_THREADS[2].id,
    author_id: MOCK_PROFILES[0].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 7,
    created_at: "2025-11-25T17:30:00Z",
    author: MOCK_PROFILES[0],
  },
  {
    id: "cmnt-0008-4000-8000-000000000008",
    body: "Compensating moderators is a no-brainer if you have a native token. The hard part is measuring 'good moderation' without gamifying it.",
    thread_id: MOCK_THREADS[6].id,
    author_id: MOCK_PROFILES[4].id,
    parent_id: null,
    is_accepted: false,
    upvotes: 11,
    created_at: "2025-11-12T16:30:00Z",
    author: MOCK_PROFILES[4],
  },
];

// ── Community Memberships ─────────────────────────────────
export const MOCK_MEMBERSHIPS: CommunityMembership[] = [
  // Cole: Technology (admin), Startups (admin), Crypto
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[0].id, role: "admin", status: "active", created_at: "2025-01-20T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[4].id, profile_id: MOCK_PROFILES[0].id, role: "admin", status: "active", created_at: "2025-02-05T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[3].id, profile_id: MOCK_PROFILES[0].id, role: "member", status: "active", created_at: "2025-02-15T10:00:00Z" },
  // Alex: Philosophy (admin), Crypto, Technology
  { community_id: MOCK_COMMUNITIES[1].id, profile_id: MOCK_PROFILES[1].id, role: "admin", status: "active", created_at: "2025-01-22T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[3].id, profile_id: MOCK_PROFILES[1].id, role: "member", status: "active", created_at: "2025-02-10T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[1].id, role: "member", status: "active", created_at: "2025-02-12T10:00:00Z" },
  // Priya: Science (admin), Design, Technology
  { community_id: MOCK_COMMUNITIES[5].id, profile_id: MOCK_PROFILES[2].id, role: "admin", status: "active", created_at: "2025-02-10T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[2].id, profile_id: MOCK_PROFILES[2].id, role: "member", status: "active", created_at: "2025-02-15T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[2].id, role: "member", status: "active", created_at: "2025-02-18T10:00:00Z" },
  // Marcus: Crypto (admin), Technology, Startups
  { community_id: MOCK_COMMUNITIES[3].id, profile_id: MOCK_PROFILES[3].id, role: "admin", status: "active", created_at: "2025-02-01T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[3].id, role: "member", status: "active", created_at: "2025-02-05T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[4].id, profile_id: MOCK_PROFILES[3].id, role: "member", status: "active", created_at: "2025-02-20T10:00:00Z" },
  // Sarah: Design (admin), Startups, Science
  { community_id: MOCK_COMMUNITIES[2].id, profile_id: MOCK_PROFILES[4].id, role: "admin", status: "active", created_at: "2025-01-25T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[4].id, profile_id: MOCK_PROFILES[4].id, role: "member", status: "active", created_at: "2025-02-10T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[5].id, profile_id: MOCK_PROFILES[4].id, role: "member", status: "active", created_at: "2025-02-22T10:00:00Z" },
];

// ── Community Reputation ──────────────────────────────────
export const MOCK_REPUTATION: CommunityReputation[] = [
  // Cole: Technology 72, Startups 45, Crypto 25
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[0].id, score: 72, answers_accepted: 5, oracle_agreements: 0, vote_accuracy: 0.82, updated_at: "2025-12-01T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[4].id, profile_id: MOCK_PROFILES[0].id, score: 45, answers_accepted: 3, oracle_agreements: 0, vote_accuracy: 0.75, updated_at: "2025-12-01T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[3].id, profile_id: MOCK_PROFILES[0].id, score: 25, answers_accepted: 1, oracle_agreements: 0, vote_accuracy: 0.60, updated_at: "2025-11-20T10:00:00Z" },
  // Alex: Philosophy 52, Crypto 20, Technology 15
  { community_id: MOCK_COMMUNITIES[1].id, profile_id: MOCK_PROFILES[1].id, score: 52, answers_accepted: 4, oracle_agreements: 0, vote_accuracy: 0.78, updated_at: "2025-11-28T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[3].id, profile_id: MOCK_PROFILES[1].id, score: 20, answers_accepted: 1, oracle_agreements: 0, vote_accuracy: 0.65, updated_at: "2025-11-25T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[1].id, score: 15, answers_accepted: 1, oracle_agreements: 0, vote_accuracy: 0.70, updated_at: "2025-11-20T10:00:00Z" },
  // Priya: Science 38, Design 15, Technology 10
  { community_id: MOCK_COMMUNITIES[5].id, profile_id: MOCK_PROFILES[2].id, score: 38, answers_accepted: 3, oracle_agreements: 0, vote_accuracy: 0.85, updated_at: "2025-11-15T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[2].id, profile_id: MOCK_PROFILES[2].id, score: 15, answers_accepted: 1, oracle_agreements: 0, vote_accuracy: 0.72, updated_at: "2025-11-10T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[2].id, score: 10, answers_accepted: 0, oracle_agreements: 0, vote_accuracy: 0.68, updated_at: "2025-11-05T10:00:00Z" },
  // Marcus: Crypto 65, Technology 25, Startups 15
  { community_id: MOCK_COMMUNITIES[3].id, profile_id: MOCK_PROFILES[3].id, score: 65, answers_accepted: 6, oracle_agreements: 0, vote_accuracy: 0.88, updated_at: "2025-11-20T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[0].id, profile_id: MOCK_PROFILES[3].id, score: 25, answers_accepted: 2, oracle_agreements: 0, vote_accuracy: 0.74, updated_at: "2025-11-15T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[4].id, profile_id: MOCK_PROFILES[3].id, score: 15, answers_accepted: 1, oracle_agreements: 0, vote_accuracy: 0.70, updated_at: "2025-11-10T10:00:00Z" },
  // Sarah: Design 35, Startups 10, Science 6
  { community_id: MOCK_COMMUNITIES[2].id, profile_id: MOCK_PROFILES[4].id, score: 35, answers_accepted: 3, oracle_agreements: 0, vote_accuracy: 0.80, updated_at: "2025-11-25T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[4].id, profile_id: MOCK_PROFILES[4].id, score: 10, answers_accepted: 1, oracle_agreements: 0, vote_accuracy: 0.65, updated_at: "2025-11-12T10:00:00Z" },
  { community_id: MOCK_COMMUNITIES[5].id, profile_id: MOCK_PROFILES[4].id, score: 6, answers_accepted: 0, oracle_agreements: 0, vote_accuracy: 0.55, updated_at: "2025-11-08T10:00:00Z" },
];

// ── Helper functions ──────────────────────────────────────
export function getThreadsByCommunity(slug: string): Thread[] {
  const community = MOCK_COMMUNITIES.find((c) => c.slug === slug);
  if (!community) return [];
  return MOCK_THREADS.filter((t) => t.community_id === community.id);
}

export function getThreadById(id: string): Thread | undefined {
  return MOCK_THREADS.find((t) => t.id === id);
}

export function getCommentsByThread(threadId: string): Comment[] {
  return MOCK_COMMENTS.filter((c) => c.thread_id === threadId);
}

export function getCommunityBySlug(slug: string): Community | undefined {
  return MOCK_COMMUNITIES.find((c) => c.slug === slug);
}

export function getProfileById(id: string): Profile | undefined {
  return MOCK_PROFILES.find((p) => p.id === id);
}

export function getThreadsByAuthor(authorId: string): Thread[] {
  return MOCK_THREADS.filter((t) => t.author_id === authorId);
}

export function getMembershipsByProfile(profileId: string): CommunityMembership[] {
  return MOCK_MEMBERSHIPS
    .filter((m) => m.profile_id === profileId && m.status === "active")
    .map((m) => ({
      ...m,
      community: MOCK_COMMUNITIES.find((c) => c.id === m.community_id),
    }));
}

export function getMembershipByCommunityAndProfile(communityId: string, profileId: string): CommunityMembership | undefined {
  return MOCK_MEMBERSHIPS.find(
    (m) => m.community_id === communityId && m.profile_id === profileId && m.status === "active"
  );
}

export function getReputationByProfile(profileId: string): CommunityReputation[] {
  return MOCK_REPUTATION
    .filter((r) => r.profile_id === profileId)
    .map((r) => ({
      ...r,
      community: MOCK_COMMUNITIES.find((c) => c.id === r.community_id),
    }));
}

export function getCommunityLeaderboard(communityId: string): (CommunityReputation & { profile: Profile })[] {
  return MOCK_REPUTATION
    .filter((r) => r.community_id === communityId && r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => ({
      ...r,
      profile: MOCK_PROFILES.find((p) => p.id === r.profile_id)!,
    }));
}

export function getVoterWeight(communityId: string, profileId: string): number {
  const rep = MOCK_REPUTATION.find(
    (r) => r.community_id === communityId && r.profile_id === profileId
  );
  return rep?.vote_accuracy ?? 1.0;
}