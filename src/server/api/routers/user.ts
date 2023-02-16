import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    count: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.user.count()
        }),
});
