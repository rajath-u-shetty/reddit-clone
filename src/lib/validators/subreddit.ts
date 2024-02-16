import { z } from "zod";

export const subredditvalidator = z.object({
    name: z.string().min(3).max(21),
})

export const subredditsubscriptionvalidator = z.object({
    subredditId: z.string()
})

export type CreateSubredditPayload = z.infer<typeof subredditvalidator>
export type SubscribeToSubredditPayload = z.infer<typeof subredditsubscriptionvalidator>