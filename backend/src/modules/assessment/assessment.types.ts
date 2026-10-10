export const DIMENSIONS = ["D", "I", "S", "C"] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export type Scores = Record<Dimension, number>;

export interface Word {
    id: string;
    text: string;
    textAr: string;
    dimension: Dimension;
}

export interface Group {
    id: string;
    words: Word[];
}

export interface Profile {
    code: string;
    name: string;
    nameAr: string;
    keywords: string[];
    description: string;
}


export type GroupRanking = {
    groupId: string;
    wordIds: string[];
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
    D: "Dominance",
    I: "Influence",
    S: "Steadiness",
    C: "Compliance",
};


export type PublicGroup = {
    id: string;
    words: Pick<Word, "id" | "text" | "textAr">[];
};