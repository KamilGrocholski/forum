import { postSchemes } from "../schemes/post";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
    create: protectedProcedure
        .input(postSchemes.create)
        .mutation(({ctx, input}) => {
            const { content, threadId } = input

            return ctx.prisma.post.create({
                data: {
                    threadId,
                    userId: ctx.session.user.id,
                    content
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
