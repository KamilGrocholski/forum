import { z } from "zod";
import { threadSchemes } from "../schemes/thread";
import { createTRPCRouter, publicProcedure, protectedProcedure, imperatorProcedure } from "../trpc";

export const threadRouter = createTRPCRouter({
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
                    createdAt: true
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
                            name: true
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
            const { title, subCategoryId } = input

            return ctx.prisma.thread.create({
                data: {
                    title,
                    subCategoryId,
                    userId: ctx.session.user.id
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
