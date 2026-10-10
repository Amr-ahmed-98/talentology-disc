import { z } from "zod";

export const submitSchema = z.object({
    rankings: z.array(
        z.object({
            groupId: z.string(),
            wordIds: z.array(z.string()).length(4),
        }),
    ),
});