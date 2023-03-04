import { TRPCError } from "@trpc/server";
import { postSchemes } from "../schemes/post";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
    report: protectedProcedure
        .input(postSchemes.report)
        .mutation(({ctx, input}) => {
            const {postId, reason} = input

            return ctx.prisma.reportPost.create({
                data: {
                    postId,
                    reason
                }
            })
        }),
    like: protectedProcedure
        .input(postSchemes.like)
        .mutation(async ({ctx, input}) => {
            const { postId } = input

            const foundLike = await ctx.prisma.postLike.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    postId
                }
            })

            if (foundLike) throw new TRPCError({code: 'FORBIDDEN'})

            return ctx.prisma.postLike.create({
                data: {
                    userId: ctx.session.user.id,
                    postId
                }
            })
        }),
    count: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.post.count()
        }),
    getLatest: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.post.findMany({
                take: 20,
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            role: true
                        }
                    },
                    createdAt: true,
                    thread: {
                        select: {
                            id: true,
                            title: true,
                        }
                    }
                }
            })
        }),
    create: protectedProcedure
        .input(postSchemes.create)
        .mutation(({ctx, input}) => {
            const { content, threadId } = input

            return ctx.prisma.post.create({
                data: {
                    userId: ctx.session.user.id,
                    content,
                    threadId
                }
            })
        }),
    delete: protectedProcedure
        .input(postSchemes.delete)
        .mutation(({ctx, input}) => {
            const { id } = input

            return ctx.prisma.post.delete({
                where: {
                    id
                }
            })
        }),
    update: protectedProcedure
        .input(postSchemes.update)
        .mutation(({ctx, input}) => {
            const { id, content } = input

            return ctx.prisma.post.update({
                where: {
                    id
                },
                data: {
                    content
                }
            })
        })
});


