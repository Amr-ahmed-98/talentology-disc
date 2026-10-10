import { prisma } from "../../lib/prisma";
import { profiles } from "../assessment/assessment.data";
import { participantStatus } from "../participants/participants.service";

const round = (value: number | null) => Math.round((value ?? 0) * 10) / 10;

export async function getSummary() {
    const [participants, averages, distribution] = await Promise.all([
        prisma.participant.findMany({
            select: { id: true, name: true, result: { select: { profileCode: true } } },
            orderBy: { name: "asc" },
        }),
        prisma.assessmentResult.aggregate({
            _avg: { scoreD: true, scoreI: true, scoreS: true, scoreC: true },
        }),
        prisma.assessmentResult.groupBy({
            by: ["profileCode"],
            _count: { _all: true },
        }),
    ]);

    const totalInvited = participants.length;
    const completed = participants.filter((p) => p.result).length;

    return {
        totalInvited,
        completed,
        pending: totalInvited - completed,
        completionPercentage: totalInvited === 0 ? 0 : Math.round((completed / totalInvited) * 100),
        profileDistribution: distribution
            .map(({ profileCode, _count }) => ({
                code: profileCode,
                name: profiles.find((p) => p.code === profileCode)?.name ?? profileCode,
                count: _count._all,
            }))
            .sort((a, b) => b.count - a.count),
        averageScores: {
            D: round(averages._avg.scoreD),
            I: round(averages._avg.scoreI),
            S: round(averages._avg.scoreS),
            C: round(averages._avg.scoreC),
        },
        participants: participants.map((p) => ({
            id: p.id,
            name: p.name,
            status: participantStatus(p.result),
            profileCode: p.result?.profileCode ?? null,
        })),
    };
}