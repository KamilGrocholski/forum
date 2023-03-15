const SETTINGS = {
  limit: 3 as const,
  postLikesTake: 3 as const,
  calcPostIndex: function (
    currentPage: number,
    postIndex: number,
    limit: number
  ): number {
    return postIndex + currentPage * limit;
  },
};

export default SETTINGS;
