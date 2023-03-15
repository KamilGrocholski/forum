import clsx from "clsx";

export interface PaginationProps {
  pages: number;
  currentPage: number;
  goToNext: () => void;
  goToPrev: () => void;
  goTo: (page: number) => void;
  className?: string;
  onPageChange?: () => void;
  shouldScrollToTop?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pages,
  currentPage,
  goToNext,
  goToPrev,
  goTo,
  className,
  onPageChange,
  shouldScrollToTop = true,
}) => {
  const pagesArray = Array.from({ length: pages }).map((_, index) => index);

  const handleChangePage = (cb: () => void) => {
    cb();
    onPageChange && shouldScrollToTop && onPageChange();
  };

  return (
    <div className={clsx("flex", className)}>
      {currentPage > 0 ? (
        <PaginationButton
          onClick={() => handleChangePage(goToPrev)}
          className="mr-2 bg-zinc-800 text-zinc-500"
        >
          Prev
        </PaginationButton>
      ) : null}
      {pagesArray.map((page) => (
        <PaginationButton
          key={page}
          onClick={() => handleChangePage(() => goTo(page))}
          className={`${
            page === currentPage
              ? "bg-red-900 text-white"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {page + 1}
        </PaginationButton>
      ))}
      {currentPage < pages - 1 ? (
        <PaginationButton
          onClick={() => handleChangePage(goToNext)}
          className="ml-2 bg-zinc-800 text-zinc-500"
        >
          Next
        </PaginationButton>
      ) : null}
    </div>
  );
};

export default Pagination;

const PaginationButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}> = ({ children, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "lg:text-md rounded border border-zinc-900 py-1 px-3 text-2xl hover:text-white lg:px-1 lg:py-0 ",
        className
      )}
    >
      {children}
    </button>
  );
};
