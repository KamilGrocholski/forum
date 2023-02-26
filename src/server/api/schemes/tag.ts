import {z} from 'zod'

export type TagSchemes = {
    create: z.input<typeof tagSchemes.create>
    delete: z.input<typeof tagSchemes.delete>
    update: z.input<typeof tagSchemes.update>
}

export const tagBase = {
    name: z.string().min(5).max(100)
}

export const tagSchemes = {
    create: z.object({
        name: tagBase.name
    }),
    delete: z.object({
        name: tagBase.name
    }),
    update: z.object({
        name: tagBase.name
    })
}