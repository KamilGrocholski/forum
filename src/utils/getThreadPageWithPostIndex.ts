export default function getThreadPageWithPostIndex(
  postsCounter: number,
  postsPerPage: number
): {
  threadPage: number;
  postIndex: number;
} {
  console.log(postsCounter);
  const threadPage = Math.floor(postsCounter / postsPerPage);
  const postIndex = postsCounter === 0 ? 0 : postsCounter - 1;
  console.log({ threadPage, postIndex });

  return {
    threadPage: threadPage === 0 ? 0 : threadPage - 1,
    postIndex,
  };
}
