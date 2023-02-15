import { subCategorySchemes } from "../schemes/subCategory";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const subCategoryRouter = createTRPCRouter({
    getThreads: publicProcedure
        .input(subCategorySchemes.getThreads)
        .query(({ctx, input}) => {
            const {subCategoryId} = input

            return ctx.prisma.thread.findMany({
                where: {
                    subCategoryId
                },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            posts: true,
                            views: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            image: true,
                            id: true
                        }
                    },
                    posts: {
                        take: 1,
                        select: {
                            createdAt: true,
                            user: {
                                select: {
                                    name: true,
                                    id: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            })
        }),
    create: protectedProcedure
        .input(subCategorySchemes.create)
        .mutation(({ctx, input}) => {
            const { name, categoryId } = input

            return ctx.prisma.subCategory.create({
                data: {
                    name,
                    category: {
                        connect: {
                            id: categoryId
                        }
                    }
                }
            })
        }),

    delete: protectedProcedure
        .input(subCategorySchemes.delete)
        .mutation(({ctx, input}) => {
            const { id } = input

            return ctx.prisma.subCategory.delete({
                where: {
                    id
                }
            })
        }),

    update: protectedProcedure
        .input(subCategorySchemes.update)
        .mutation(({ctx, input}) => {
            const { id, name } = input

            return ctx.prisma.subCategory.update({
                where: {
                    id
                },
                data: {
                    name
                }
            })
        })

});
