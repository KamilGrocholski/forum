import { categorySchemes } from "../schemes/category";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getAllWithSubCategoriesSmallInfo: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        subCategories: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                threads: true,
              },
            },
          },
        },
      },
    });
  }),
  getAllWithSubCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        subCategories: {
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            threads: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
              select: {
                createdAt: true,
                id: true,
                title: true,
                user: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                _count: {
                  select: {
                    posts: true,
                  },
                },
              },
            },
            _count: {
              select: {
                threads: true,
              },
            },
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(categorySchemes.create)
    .mutation(({ ctx, input }) => {
      const { name } = input;

      return ctx.prisma.category.create({
        data: {
          name,
        },
      });
    }),

  delete: protectedProcedure
    .input(categorySchemes.delete)
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.category.delete({
        where: {
          id,
        },
      });
    }),

  update: protectedProcedure
    .input(categorySchemes.update)
    .mutation(({ ctx, input }) => {
      const { id, name } = input;

      return ctx.prisma.category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });
    }),
});
