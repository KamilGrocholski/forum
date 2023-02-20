import type { SubCategory, Thread, User } from "@prisma/client"

const usePaths = () => {
    const paths = {
        user(userId: User['id']) {
            return `/users/${userId}` as const
        },
        thread(threadId: Thread['id']) {
            return `/threads/${threadId}` as const
        },
        subCategoryId(categoryName: string, subCategoryId: SubCategory['id'], page = 0) {
            return `/forum/${categoryName}/${subCategoryId}?page=${page}` as const
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