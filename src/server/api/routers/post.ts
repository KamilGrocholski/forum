import { TRPCError } from "@trpc/server";
import { postSchemes } from "../schemes/post";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { pusherServerClient } from "../../utils/pusher";

export const postRouter = createTRPCRouter({
  report: protectedProcedure
    .input(postSchemes.report)
    .mutation(({ ctx, input }) => {
      const { postId, reason } = input;

      return ctx.prisma.reportPost.create({
        data: {
          postId,
          reason,
        },
      });
    }),
  like: protectedProcedure
    .input(postSchemes.like)
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;

      const foundLike = await ctx.prisma.postLike.findFirst({
        where: {
          userId: ctx.session.user.id,
          postId,
        },
      });

      if (foundLike) throw new TRPCError({ code: "FORBIDDEN" });

      return await ctx.prisma.postLike.create({
        data: {
          userId: ctx.session.user.id,
          postId,
        },
      });
    }),
  count: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.count();
  }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      take: 20,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        createdAt: true,
        thread: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }),
  create: protectedProcedure
    .input(postSchemes.create)
    .mutation(async ({ ctx, input }) => {
      const { content, threadId } = input;

      const post = await ctx.prisma.post.create({
        data: {
          userId: ctx.session.user.id,
          content,
          threadId,
        },
        select: {
          user: {
            select: {
              name: true,
              id: true,
              role: true,
            },
          },
          thread: {
            select: {
              title: true,
              id: true,
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!post) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      if (post.user.id !== post.thread.user.id) {
        try {
          const notification = await ctx.prisma.notification.create({
            data: {
              userId: post.thread.user.id,
              title: "New post",
              content: `${post.user.name ?? "A user"} has created a post in ${
                post.thread.title
              }`,
            },
          });

          if (notification) {
            await pusherServerClient.trigger(
              `user-${post.thread.user.id}`,
              "notification",
              {}
            );
          }
        } catch (err) {
          console.error(err);
        }
      }

      const postsCounter = await ctx.prisma.post.count({
        where: {
          threadId: post.thread.id,
        },
      });

      return { post, postsCounter };
    }),
  delete: protectedProcedure
    .input(postSchemes.delete)
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.post.delete({
        where: {
          id,
        },
      });
    }),
  update: protectedProcedure
    .input(postSchemes.update)
    .mutation(({ ctx, input }) => {
      const { id, content } = input;

      return ctx.prisma.post.update({
        where: {
          id,
        },
        data: {
          content,
        },
      });
    }),
});
