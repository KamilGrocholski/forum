import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  changeToSeen: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        seen: true,
      },
    });
  }),
  countUnseen: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.notification.count({
      where: {
        userId: ctx.session.user.id,
        seen: false,
      },
    });
  }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
