import { threadBase } from './thread'
import {z} from 'zod'

export type PostSchemes = {
    create: z.input<typeof postSchemes.create>
    delete: z.input<typeof postSchemes.delete>
    update: z.input<typeof postSchemes.update>
}

export const postBase = {
    id: z.string().cuid(),
    content: z.string().max(5000),
    userId: z.string().cuid(),
}

export const postSchemes = {
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
