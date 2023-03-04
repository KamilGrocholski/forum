export const getAvgRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
}

