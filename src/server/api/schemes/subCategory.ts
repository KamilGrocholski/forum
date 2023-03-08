import { z } from "zod";

export type SubCategorySchemes = {
  create: z.input<typeof subCategorySchemes.create>;
  delete: z.input<typeof subCategorySchemes.delete>;
  update: z.input<typeof subCategorySchemes.update>;
  threadsFilter: z.input<typeof subCategorySchemes.threadsFilter>;
};

export const subCategoryBase = {
  id: z.string().cuid(),
  name: z.string().min(1).max(50),
};

export const subCategorySchemes = {
  threadsFilter: z.object({
    sortBy: z
      .literal("views")
      .or(z.literal("ratings"))
      .or(z.literal("update"))
      .or(z.literal("create")),
  }),
  getThreads: z.object({
    subCategoryId: subCategoryBase.id,
    limit: z.number().default(10),
    page: z.number().default(1),
  }),
  create: z.object({
    name: subCategoryBase.name,
    categoryId: z.string().cuid(),
  }),
  delete: z.object({
    id: subCategoryBase.id,
  }),
  update: z.object({
    id: subCategoryBase.id,
    name: subCategoryBase.name,
  }),
};
