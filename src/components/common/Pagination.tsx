import clsx from "clsx"

export interface PaginationProps {
    pages: number
    currentPage: number
    goToNext: () => void
    goToPrev: () => void
    goTo: (page: number) => void
    className?: string
}

const Pagination: React.FC<PaginationProps> = ({
    pages,
    currentPage,
    goToNext,
    goToPrev,
    goTo,
    className
}) => {
    const pagesArray = Array.from({ length: pages }).map((_, index) => index)

    return (
        <div className={clsx(
            'flex',
            className
        )}>
            {currentPage > 0
                ? <PaginationButton onClick={() => void goToPrev()} className='mr-2 bg-zinc-800 text-zinc-500'>
                    Prev
                </PaginationButton>
                : null}
            {pagesArray.map((page) => (
                <PaginationButton
                    key={page}
                    onClick={() => goTo(page)}
                    className={`${page === currentPage ? 'bg-red-900 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                >
                    {page + 1}
                </PaginationButton>
            ))}
            {currentPage < pages - 1
                ? <PaginationButton onClick={() => void goToNext()} className='ml-2 bg-zinc-800 text-zinc-500'>
                    Next
                </PaginationButton>
                : null}
        </div>
    )
}

export default Pagination

const PaginationButton: React.FC<{
    children: React.ReactNode
    className?: string
    onClick: () => void
}> = ({ children, className, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={clsx(
                'hover:text-white rounded-sm border border-zinc-700 px-1',
                className
            )}>
            {children}
        </button>
    )
}