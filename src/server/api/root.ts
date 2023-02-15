import { createTRPCRouter } from "./trpc";
import { categoryRouter } from "./routers/category";
import { threadRouter } from "./routers/thread";
import { postRouter } from "./routers/post";
import { subCategoryRouter } from "./routers/subCategory";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  subCategory: subCategoryRouter,
  thread: threadRouter,
  post: postRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
