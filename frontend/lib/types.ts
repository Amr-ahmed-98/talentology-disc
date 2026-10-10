export type Dimension = "D" | "I" | "S" | "C";
export type Scores = Record<Dimension, number>;
export type Role = "FACILITATOR" | "MANAGER";
export type ParticipantStatus = "COMPLETED" | "PENDING";

export interface PublicWord {
    id: string;
    text: string;
    textAr: string;
}

export interface PublicGroup {
    id: string;
    words: PublicWord[];
}

export interface AssessmentData {
    participantName: string;
    completed: boolean;
    groups: PublicGroup[];
}

export interface GroupRanking {
    groupId: string;
    wordIds: string[];
}

export interface Profile {
    code: string;
    name: string;
    nameAr: string;
    keywords: string[];
    description: string;
}

export interface Report {
    participant: { id: string; name: string; email: string };
    completedAt: string;
    scores: Scores;
    ranking: { dimension: Dimension; label: string; score: number }[];
    profile: Profile;
}


export interface Session {
    token: string;
    user: { id: string; name: string; email: string; role: Role };
}


export interface ParticipantRow {
    id: string;
    name: string;
    email: string;
    inviteToken: string;
    status: ParticipantStatus;
    profileCode: string | null;
    scores: Scores | null;
    completedAt: string | null;
}

export interface DashboardSummary {
    totalInvited: number;
    completed: number;
    pending: number;
    completionPercentage: number;
    profileDistribution: { code: string; name: string; count: number }[];
    averageScores: Scores;
    participants: {
        id: string;
        name: string;
        status: ParticipantStatus;
        profileCode: string | null;
    }[];
}