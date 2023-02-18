import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    count: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.user.count()
        }),
    getLastNewUser: publicProcedure
        .query(({ctx}) => {

            return ctx.prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true
                }
            })
        }),
    getProfile: publicProcedure
        .input(z.object({userId: z.string().cuid()}))
        .query(({ctx, input}) => {
            const {userId} = input

            return ctx.prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    role: true,
                    _count: {
                        select: {
                            posts: true,
                            threads: true
                        }
                    }
                }
            })
        })
});
