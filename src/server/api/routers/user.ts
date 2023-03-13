import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  imperatorProcedure,
} from "../trpc";

export const userRouter = createTRPCRouter({
  count: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.count();
  }),
  getLastNewUser: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });
  }),
  getProfile: publicProcedure
    .input(z.object({ userId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      const { userId } = input;

      return ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              threads: true,
            },
          },
          threads: {
            orderBy: {
              createdAt: "desc",
            },
            select: {
              title: true,
              createdAt: true,
              updatedAt: true,
              id: true,
              _count: {
                select: {
                  posts: true,
                  views: true,
                },
              },
              subCategory: {
                select: {
                  id: true,
                  name: true,
                },
              },
              user: {
                select: {
                  name: true,
                  image: true,
                  id: true,
                  role: true,
                },
              },
            },
          },
        },
      });
    }),
  changeRole: imperatorProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
        role: z
          .literal("user")
          .or(z.literal("admin"))
          .or(z.literal("imperator")),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId, role } = input;

      return ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role,
        },
      });
    }),
});
