import { TRPCError } from "@trpc/server";
import { threadSchemes } from "../schemes/thread";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const threadRouter = createTRPCRouter({
    postsPagination: publicProcedure
        .input(threadSchemes.getPosts)
        .query(async ({ctx, input}) => {
            const { limit, threadId, page, postLikesTake } = input

            const postsCount = await ctx.prisma.post.count({
                where: {
                    threadId
                }
            })

            if (!postsCount) throw new TRPCError({code: 'INTERNAL_SERVER_ERROR'})

            const totalPages = Math.ceil(postsCount / limit)

            const thread = await ctx.prisma.thread.findUnique({
                where: {
                    id: threadId
                }, 
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                }
            })

            if (!thread) throw new TRPCError({code: 'INTERNAL_SERVER_ERROR'})

            const posts = await ctx.prisma.post.findMany({
                where: {
                    threadId
                },
                skip: page * limit,
                take: limit,
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            image: true,
                            id: true,
                            name: true,
                            role: true,
                            createdAt: true,
                            _count: {
                                select: {
                                    posts: true,
                                    threads: true
                                }
                            },
                        },
                    },
                    _count: {
                        select: {
                            postLikes: true
                        }
                    },
                    postLikes: {
                        take: postLikesTake, 
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    role: true
                                }
                            }
                        }
                    }
                }
            })

            if (!posts) throw new TRPCError({code: 'INTERNAL_SERVER_ERROR'})

            return {
                thread,
                totalPages,
                posts
            }
        }),
    count: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.thread.count()
        }),
    getById: publicProcedure
        .input(threadSchemes.getById)
        .query(({ctx, input}) => {
            const { id } = input

            return ctx.prisma.thread.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    posts: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true,
                            user: {
                                select: {
                                    image: true,
                                    id: true,
                                    name: true,
                                    role: true,
                                    // createdAt: true,
                                    _count: {
                                        select: {
                                            posts: true,
                                            threads: true
                                        }
                                    }
                                }
                            },
                            _count: {
                                select: {
                                    postLikes: true
                                }
                            },
                            postLikes: {
                                take: 3,
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }),
    getLatest: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.thread.findMany({
                take: 10,
                select: {
                    title: true,
                    id: true,
                    createdAt: true,
                    subCategory: {
                        select: {
                            name: true,
                            id: true,
                            category: true
                        }                        
                    },
                    user: {
                        select: {
                            id: true,
                            image: true,
                            name: true,
                            role: true
                        }
                    }
                }
            }) 
        }),
    getAll: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.thread.findMany({
                select: {
                    id: true,
                    title: true,
                }
            })
        }),
    create: protectedProcedure
        .input(threadSchemes.create)
        .mutation(({ctx, input}) => {
            const { title, subCategoryId, content } = input

            return ctx.prisma.thread.create({
                data: {
                    title,
                    subCategoryId,
                    userId: ctx.session.user.id,
                    posts: {
                        create: {
                            content,
                            userId: ctx.session.user.id
                        }
                    }
                }
            })
        }),
    delete: protectedProcedure
        .input(threadSchemes.delete)
        .mutation(({ctx, input}) => {
            const { id } = input

            return ctx.prisma.thread.delete({
                where: {
                    id
                }
            })
        }),
    update: protectedProcedure
        .input(threadSchemes.update)
        .mutation(({ctx, input}) => {
            const { id, title, subCategoryId } = input

            return ctx.prisma.thread.update({
                where: {
                    id
                },
                data: {
                    title,
                    subCategoryId
                }
            })
        })
});
