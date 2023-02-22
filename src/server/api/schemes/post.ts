import {z} from 'zod'

export type PostSchemes = {
    create: z.input<typeof postSchemes.create>
    delete: z.input<typeof postSchemes.delete>
    update: z.input<typeof postSchemes.update>
    report: z.input<typeof postSchemes.report>
}

export const postBase = {
    id: z.string().cuid(),
    content: z.string(),
    userId: z.string().cuid(),
}

export const postSchemes = {
    report: z.object({
        postId: postBase.id,
        reason: z.string().max(255)
    }),
    like: z.object({
        postId: postBase.id
    }),
    create: z.object({
        threadId: z.string().cuid(),
        content: postBase.content,
    }),
    delete: z.object({
        id: postBase.id
    }),
    update: z.object({
        id: postBase.id,
        content: postBase.content
    })
}
