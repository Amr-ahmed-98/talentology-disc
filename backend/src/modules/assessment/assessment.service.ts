import type { AssessmentResult, Participant } from "../../generated/prisma/client";
import { HttpError } from "../../lib/http-error";
import { prisma } from "../../lib/prisma";
import { groups, profiles } from "./assessment.data";
import {
    DIMENSION_LABELS,
    type GroupRanking,
    type PublicGroup,
    type Scores,
} from "./assessment.types";
import {
    getProfileCode,
    rankDimensions,
    scoreRankings,
    validateRankings,
} from "./scoring";

type ParticipantWithResult = Participant & { result: AssessmentResult | null };

async function findParticipant(token: string): Promise<ParticipantWithResult> {
    const participant = await prisma.participant.findUnique({
        where: { inviteToken: token },
        include: { result: true },
    });
    if (!participant) throw new HttpError(404, "Invalid invite link");
    return participant;
}

function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}


function toPublicGroups(): PublicGroup[] {
    return groups.map((group) => ({
        id: group.id,
        words: shuffle(group.words).map(({ id, text, textAr }) => ({ id, text, textAr })),
    }));
}

export function resultScores(result: AssessmentResult): Scores {
    return { D: result.scoreD, I: result.scoreI, S: result.scoreS, C: result.scoreC };
}

export function buildReport(participant: Participant, result: AssessmentResult) {
    const scores = resultScores(result);

    const profile = profiles.find((p) => p.code === result.profileCode);
    if (!profile) throw new Error(`Missing profile: ${result.profileCode}`);

    return {
        participant: { id: participant.id, name: participant.name, email: participant.email },
        completedAt: result.completedAt,
        scores,
        ranking: rankDimensions(scores).map((dimension) => ({
            dimension,
            label: DIMENSION_LABELS[dimension],
            score: scores[dimension],
        })),
        profile,
    };
}

export async function getAssessment(token: string) {
    const participant = await findParticipant(token);
    const completed = participant.result !== null;

    return {
        participantName: participant.name,
        completed,
        groups: completed ? [] : toPublicGroups(),
    };
}

export async function submitAssessment(token: string, rankings: GroupRanking[]) {
    const participant = await findParticipant(token);
    if (participant.result) throw new HttpError(409, "Assessment already completed");

    validateRankings(rankings, groups);
    const scores = scoreRankings(rankings, groups);

    const result = await prisma.assessmentResult.create({
        data: {
            participantId: participant.id,
            scoreD: scores.D,
            scoreI: scores.I,
            scoreS: scores.S,
            scoreC: scores.C,
            profileCode: getProfileCode(rankDimensions(scores)),
            rankings,
        },
    });

    return buildReport(participant, result);
}

export async function getResult(token: string) {
    const participant = await findParticipant(token);
    if (!participant.result) throw new HttpError(404, "Assessment not completed yet");

    return buildReport(participant, participant.result);
}