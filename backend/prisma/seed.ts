import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { groups } from "../src/modules/assessment/assessment.data";
import type { GroupRanking } from "../src/modules/assessment/assessment.types";
import {
    getProfileCode,
    rankDimensions,
    scoreRankings,
} from "../src/modules/assessment/scoring";

const DEMO_PASSWORD = "Password123!";

// `lean` is the tendency of the demo answers; participants without it stay pending.
const PARTICIPANTS = [
    { name: "Omar Hassan", email: "omar.hassan@example.com", lean: "DI" },
    { name: "Layla Ahmed", email: "layla.ahmed@example.com", lean: "SC" },
    { name: "Youssef Nabil", email: "youssef.nabil@example.com", lean: "CD" },
    { name: "Nour Khaled", email: "nour.khaled@example.com", lean: "IS" },
    { name: "Karim Adel", email: "karim.adel@example.com", lean: "DC" },
    { name: "Salma Mostafa", email: "salma.mostafa@example.com", lean: "SI" },
    { name: "Hana Ibrahim", email: "hana.ibrahim@example.com", lean: "ID" },
    { name: "Ali Samir", email: "ali.samir@example.com" },
    { name: "Mariam Tarek", email: "mariam.tarek@example.com" },
    { name: "Ziad Fawzy", email: "ziad.fawzy@example.com" },
];

/** Small deterministic PRNG so the demo data is identical on every run. */
function mulberry32(seed: number) {
    let state = seed;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function leanWeight(dimension: string, lean: string): number {
    const index = lean.indexOf(dimension);
    return index === -1 ? 0 : 2 - index;
}

function buildResult(lean: string, seed: number) {
    const random = mulberry32(seed);
    const rankings: GroupRanking[] = groups.map((group) => ({
        groupId: group.id,
        wordIds: group.words
            .map((word) => ({ id: word.id, weight: leanWeight(word.dimension, lean) + random() * 1.5 }))
            .sort((a, b) => b.weight - a.weight)
            .map((word) => word.id),
    }));

    const scores = scoreRankings(rankings, groups);
    return {
        scoreD: scores.D,
        scoreI: scores.I,
        scoreS: scores.S,
        scoreC: scores.C,
        profileCode: getProfileCode(rankDimensions(scores)),
        rankings,
    };
}

async function main() {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    await prisma.participant.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.createMany({
        data: [
            { name: "Sara Facilitator", email: "facilitator@talentology.test", passwordHash, role: "FACILITATOR" },
            { name: "Mona Manager", email: "manager@talentology.test", passwordHash, role: "MANAGER" },
        ],
    });

    for (const [index, { name, email, lean }] of PARTICIPANTS.entries()) {
        await prisma.participant.create({
            data: {
                name,
                email,
                ...(lean && { result: { create: buildResult(lean, index + 1) } }),
            },
        });
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());