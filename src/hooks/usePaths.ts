import type { SubCategory, Thread } from "@prisma/client"

const usePaths = () => {
    const paths = {
        thread(threadId: Thread['id']) {
            return `/threads/${threadId}` as const
        },
        subCategoryId(categoryName: string, subCategoryId: SubCategory['id']) {
            return `/forum/${categoryName}/${subCategoryId}` as const
        },
        postThread() {
            return '/post-thread' as const
        },
        home() {
            return '/' as const
        }
    }

    return paths
}

export default usePaths