import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  imperatorProcedure,
} from "../trpc";

export const notificationRouter = createTRPCRouter({
  changeToSeen: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        seen: false,
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
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
