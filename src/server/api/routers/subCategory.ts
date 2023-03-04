import { TRPCError } from "@trpc/server";
import { subCategorySchemes } from "../schemes/subCategory";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const subCategoryRouter = createTRPCRouter({
    threadsPagination: publicProcedure
        .input(subCategorySchemes.getThreads)
        .query(async ({ ctx, input }) => {
            const { subCategoryId, limit, page } = input

            const threadsCount = await ctx.prisma.thread.count({
                where: {
                    subCategoryId
                }
            })

            if (!threadsCount) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

            const totalPages = Math.ceil(threadsCount / limit)

            const subCategory = await ctx.prisma.subCategory.findUnique({
                where: {
                    id: subCategoryId
                },
                select: {
                    id: true,
                    name: true,
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            if (!subCategory) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })

            const items = await ctx.prisma.thread.findMany({
                skip: page * limit,
                take: limit,
                where: {
                    subCategoryId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    updatedAt: true,
                    ratings: {
                        select: {
                            rating: true
                        }
                    },
                    _count: {
                        select: {
                            ratings: true,
                            posts: true,
                            views: true
                        }
                    },
                    subCategory: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            image: true,
                            id: true,
                            role: true
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
                                    image: true,
                                    role: true
                                }
                            }
                        }
                    },
                }
            })

            return {
                threads: items,
                subCategory,
                totalPages
            }
        }),
    create: protectedProcedure
        .input(subCategorySchemes.create)
        .mutation(({ ctx, input }) => {
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
        .mutation(({ ctx, input }) => {
            const { id } = input

            return ctx.prisma.subCategory.delete({
                where: {
                    id
                }
            })
        }),

    update: protectedProcedure
        .input(subCategorySchemes.update)
        .mutation(({ ctx, input }) => {
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
