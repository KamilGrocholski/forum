import { type NextPage } from "next";
import { useRouter } from "next/router";
import StateWrapper from "../../../../components/common/StateWrapper";
import MainLayout from "../../../../components/layout/MainLayout";
import { api } from "../../../../utils/api";
import usePaths from "../../../../hooks/usePaths";
import LinkButton from "../../../../components/common/LinkButton";
import { useMemo } from "react";
import Pagination from "../../../../components/common/Pagination";
import UserAvatar from "../../../../components/common/UserAvatar";
import { USER_ROLE_THINGS } from "../../../../utils/userRoleThings";
import Breadcrumbs from "../../../../components/common/Breadcrumbs";
import { RatingReadonly } from "../../../../components/common/Rating";
import { getAvgRating } from "../../../../utils/getAvgRating";
import ThreadsFilter, {
  useThreadsFilter,
} from "../../../../components/common/Filters/ThreadsFilter";

const SubCategoryPage: NextPage = () => {
  const router = useRouter();
  const subCategoryId = router.query.subCategoryId as string;
  const pageFromQuery = router.query.page as string;
  const parsedPage = pageFromQuery ? parseInt(pageFromQuery) : 0;
  const paths = usePaths();

  // const [page, setPage] = useState(() => parsedPage ?? 0)
  const page = useMemo(() => {
    return parsedPage;
  }, [parsedPage]);

  const { filter, setFilter } = useThreadsFilter({
    sortBy: "createdAt",
  });

  const threadsPagination = api.subCategory.threadsPagination.useQuery(
    {
      subCategoryId,
      limit: 10,
      page,
      filter,
    },
    {
      keepPreviousData: true,
    }
  );

  const setPageQuery = (page: number) => {
    void router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <MainLayout>
      <StateWrapper
        data={threadsPagination.data}
        isLoading={threadsPagination.isLoading}
        isError={threadsPagination.isError}
        isEmpty={threadsPagination.data?.threads.length === 0}
        Empty={<div>This subcategory has no threads.</div>}
        NonEmpty={(threads) => (
          <>
            <Breadcrumbs
              items={[
                <LinkButton href={paths.home()} key="category">
                  {threads.subCategory.category.name}
                </LinkButton>,
                <LinkButton
                  key="subCategoryId"
                  href={paths.subCategoryId(
                    threads.subCategory.category.name,
                    threads.subCategory.id
                  )}
                >
                  {threads.subCategory.name}
                </LinkButton>,
              ]}
            />
            <ThreadsFilter filter={filter} setFilter={setFilter} />
            <Pagination
              className="mb-5"
              currentPage={page}
              pages={threads.totalPages}
              goTo={(newPage) => setPageQuery(newPage)}
              goToNext={() => {
                setPageQuery(page + 1);
              }}
              goToPrev={() => {
                setPageQuery(page - 1);
              }}
            />
            <div className="flex flex-col rounded bg-zinc-900 p-3">
              {threads.threads.map((thread) => (
                <div
                  key={thread.id}
                  className="grid grid-cols-4 items-center border-b border-zinc-700 py-3 last:border-none hover:bg-zinc-800 lg:grid-cols-6"
                >
                  {/* Thread creator  */}
                  <LinkButton
                    href={paths.user(thread.user.id)}
                    className="group relative hidden w-fit lg:block"
                  >
                    <UserAvatar
                      width={50}
                      height={50}
                      alt=""
                      src={thread.user.image}
                      className="outline-red-900 transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:outline"
                    />
                    <div
                      className={`${
                        USER_ROLE_THINGS[thread.user.role].textColor
                      } absolute top-0 left-24 hidden rounded bg-zinc-800 px-3 py-1 group-hover:block`}
                    >
                      {thread.user.name}
                    </div>
                  </LinkButton>

                  {/* Thread link  */}
                  <div className="col-span-2 min-w-0">
                    <LinkButton
                      href={paths.thread(thread.id)}
                      className="block truncate font-semibold hover:underline"
                    >
                      {thread.title}
                    </LinkButton>
                  </div>

                  {/* Thread rating  */}
                  <RatingReadonly
                    totalRatings={thread.ratings.length}
                    rating={getAvgRating(
                      thread.ratings.map(({ rating }) => rating)
                    )}
                  />
                  <div className="hidden lg:block">
                    <div>Replies: {thread._count.posts}</div>
                    <div>Views: {thread._count.views}</div>
                  </div>

                  {/* Latest post's creator */}
                  <div className="hidden lg:block">
                    {thread.posts[0]?.user.id ? (
                      <LinkButton
                        href={paths.user(thread.posts[0].user.id)}
                        className="flex items-center gap-2"
                      >
                        <UserAvatar
                          width={20}
                          height={20}
                          alt=""
                          src={thread.posts[0].user.image}
                        />
                        <span
                          className={`${
                            USER_ROLE_THINGS[thread.posts[0].user.role]
                              .textColor
                          } hidden truncate md:block`}
                        >
                          {thread.posts[0].user.name}
                        </span>
                      </LinkButton>
                    ) : (
                      <span>No posts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              className="mt-5"
              currentPage={page}
              pages={threads.totalPages}
              goTo={(newPage) => setPageQuery(newPage)}
              goToNext={() => {
                setPageQuery(page + 1);
              }}
              goToPrev={() => {
                setPageQuery(page - 1);
              }}
            />
          </>
        )}
      />
    </MainLayout>
  );
};

export default SubCategoryPage;
