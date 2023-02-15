import {z} from 'zod'

export type CategorySchemes = {
    create: z.input<typeof categorySchemes.create>
    delete: z.input<typeof categorySchemes.delete>
    update: z.input<typeof categorySchemes.update>
}

export const categoryBase = {
    id: z.string().cuid(),
    name: z.string().min(5).max(50)
}

export const categorySchemes = {
    create: z.object({
        name: categoryBase.name
    }),
    delete: z.object({
        id: categoryBase.id
    }),
    update: z.object({
        id: categoryBase.id,
        name: categoryBase.name
    })
}