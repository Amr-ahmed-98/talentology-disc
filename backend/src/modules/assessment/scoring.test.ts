import { describe, expect, it } from "vitest";
import { groups, profiles } from "./assessment.data";
import { DIMENSIONS, type Dimension, type Group, type GroupRanking } from "./assessment.types";
import {
    InvalidRankingError,
    getProfileCode,
    rankDimensions,
    scoreRankings,
    validateRankings,
} from "./scoring";

const COLUMN_ORDER: Dimension[] = ["C", "D", "S", "I"];

function makeGroup(id: string): Group {
    return {
        id,
        words: COLUMN_ORDER.map((dimension, i) => ({
            id: `${id}-w${i + 1}`,
            text: `Word ${i + 1}`,
            textAr: "",
            dimension,
        })),
    };
}

function ranking(groupId: string, order: number[]): GroupRanking {
    return { groupId, wordIds: order.map((n) => `${groupId}-w${n}`) };
}

const sampleGroups = [makeGroup("g1"), makeGroup("g2")];
// w2 = D, w4 = I, w1 = C, w3 = S
const dFirstRankings = [ranking("g1", [2, 4, 1, 3]), ranking("g2", [2, 4, 1, 3])];

describe("scoreRankings", () => {
    it("gives 4, 3, 2, 1 points by rank and adds them per dimension", () => {
        expect(scoreRankings(dFirstRankings, sampleGroups)).toEqual({ D: 8, I: 6, S: 2, C: 4 });
    });

    it("awards 10 points per group in total", () => {
        const scores = scoreRankings(dFirstRankings, sampleGroups);
        const total = Object.values(scores).reduce((sum, n) => sum + n, 0);
        expect(total).toBe(20);
    });

    it("rejects an unknown word", () => {
        const bad = [{ groupId: "g1", wordIds: ["x", "g1-w1", "g1-w2", "g1-w3"] }];
        expect(() => scoreRankings(bad, sampleGroups)).toThrow(InvalidRankingError);
    });
});

describe("rankDimensions", () => {
    it("sorts from highest to lowest score", () => {
        expect(rankDimensions({ D: 8, I: 6, S: 2, C: 4 })).toEqual(["D", "I", "C", "S"]);
    });

    it("breaks ties in the order D, I, S, C", () => {
        expect(rankDimensions({ D: 5, I: 5, S: 5, C: 5 })).toEqual(["D", "I", "S", "C"]);
    });
});

describe("getProfileCode", () => {
    it("joins the two highest dimensions", () => {
        expect(getProfileCode(["D", "I", "C", "S"])).toBe("DI");
    });
});

describe("validateRankings", () => {
    it("accepts a complete valid answer", () => {
        expect(() => validateRankings(dFirstRankings, sampleGroups)).not.toThrow();
    });

    it("rejects a missing group", () => {
        expect(() => validateRankings([dFirstRankings[0]], sampleGroups)).toThrow(InvalidRankingError);
    });

    it("rejects a repeated word", () => {
        const bad = [dFirstRankings[0], ranking("g2", [2, 2, 1, 3])];
        expect(() => validateRankings(bad, sampleGroups)).toThrow(InvalidRankingError);
    });

    it("rejects a repeated group", () => {
        const bad = [dFirstRankings[0], dFirstRankings[0]];
        expect(() => validateRankings(bad, sampleGroups)).toThrow(InvalidRankingError);
    });
});

describe("assessment data", () => {
    it("has 14 groups of 4 words, one per dimension", () => {
        expect(groups).toHaveLength(14);
        for (const group of groups) {
            expect(group.words.map((w) => w.dimension).sort()).toEqual(["C", "D", "I", "S"]);
        }
    });

    it("has a profile for every ordered pair of dimensions", () => {
        const codes = DIMENSIONS.flatMap((a) =>
            DIMENSIONS.filter((b) => b !== a).map((b) => `${a}${b}`),
        );
        expect(codes).toHaveLength(12);
        for (const code of codes) {
            expect(profiles.some((p) => p.code === code)).toBe(true);
        }
    });

    it("scores the file order of every group as C 56, D 42, S 28, I 14", () => {
        const fileOrder = groups.map((g) => ({ groupId: g.id, wordIds: g.words.map((w) => w.id) }));
        expect(scoreRankings(fileOrder, groups)).toEqual({ C: 56, D: 42, S: 28, I: 14 });
    });
});