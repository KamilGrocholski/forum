import { z } from 'zod'
import { postBase } from './post'
import { subCategoryBase } from './subCategory'

export type ThreadSchemes = {
    create: z.input<typeof threadSchemes.create>
    delete: z.input<typeof threadSchemes.delete>
    update: z.input<typeof threadSchemes.update>
    rateThread: z.input<typeof threadSchemes.rateThread>
}

export const threadBase = {
    id: z.string().cuid(),
    title: z.string().min(5).max(100),
    userId: z.string().cuid(),
    rating: z.number().min(0).max(5)
}

export const threadSchemes = {
    getPosts: z.object({
        threadId: threadBase.id,
        limit: z.number().default(10),
        page: z.number().default(1),
        postLikesTake: z.number()
    }),
    getById: z.object({
        id: threadBase.id
    }),
    create: z.object({
        subCategoryId: subCategoryBase.id,
        title: threadBase.title,
        content: postBase.content
    }),
    delete: z.object({
        id: threadBase.id
    }),
    update: z.object({
        id: threadBase.id,
        subCategoryId: subCategoryBase.id,
        title: threadBase.title
    }),
    rateThread: z.object({
        threadId: threadBase.id,
        rating: threadBase.rating
    })
}
