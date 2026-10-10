import {
    DIMENSIONS,
    type Dimension,
    type Group,
    type GroupRanking,
    type Scores,
} from "./assessment.types";

/** Points for the 1st, 2nd, 3rd and 4th ranked word. */
const POINTS_BY_RANK = [4, 3, 2, 1] as const;

export class InvalidRankingError extends Error { }

/** Every group must be ranked exactly once, using each of its words exactly once. */
export function validateRankings(rankings: GroupRanking[], groups: Group[]): void {
    if (rankings.length !== groups.length) {
        throw new InvalidRankingError("Every group must be ranked");
    }

    const seen = new Set<string>();
    for (const { groupId, wordIds } of rankings) {
        const group = groups.find((g) => g.id === groupId);
        if (!group || seen.has(groupId)) {
            throw new InvalidRankingError(`Invalid group: ${groupId}`);
        }
        seen.add(groupId);

        const expected = group.words.map((w) => w.id).sort();
        const actual = [...wordIds].sort();
        if (expected.length !== actual.length || expected.some((id, i) => id !== actual[i])) {
            throw new InvalidRankingError(`Invalid ranking for group: ${groupId}`);
        }
    }
}

export function scoreRankings(rankings: GroupRanking[], groups: Group[]): Scores {
    const dimensionByWord = new Map(
        groups.flatMap((g) => g.words.map((w) => [w.id, w.dimension] as const)),
    );

    const scores: Scores = { D: 0, I: 0, S: 0, C: 0 };
    for (const { wordIds } of rankings) {
        wordIds.forEach((wordId, rank) => {
            const dimension = dimensionByWord.get(wordId);
            if (!dimension) throw new InvalidRankingError(`Unknown word: ${wordId}`);
            scores[dimension] += POINTS_BY_RANK[rank];
        });
    }
    return scores;
}

/** Highest to lowest. Ties keep the fixed order D, I, S, C. */
export function rankDimensions(scores: Scores): Dimension[] {
    return [...DIMENSIONS].sort((a, b) => scores[b] - scores[a]);
}

/** The two highest dimensions, e.g. "DI". */
export function getProfileCode(rankedDimensions: Dimension[]): string {
    return rankedDimensions.slice(0, 2).join("");
}