import clsx from "clsx"
import { useState } from "react"

export type RatingProps = {
  rating?: number
  readOnly?: boolean
}

const Rating: React.FC<RatingProps> = ({
  rating: ratingFromProps = 0,
  readOnly = false
}) => {
  const [rating, setRating] = useState(ratingFromProps)
  const [hover, setHover] = useState(0)

  return (
    <div className='flex gap-1'>
      {[...Array.from({ length: 5 }, (i) => i).map((_, index) => (
        <button
          key={index}
          className={clsx(
            !readOnly && index + 1 <= hover ? 'text-yellow-300' : 'text-gray-500',
            index + 1 <= rating ? 'text-yellow-500' : 'text-gray-300',
            'text-2xl font-bold'
          )}
          onMouseEnter={!readOnly ? () => setHover(index + 1) : undefined}
          onMouseLeave={!readOnly ? () => setHover(0) : undefined}
          onClick={() => setRating(index + 1)}
        >
          <span>&#9733;</span>
        </button>
      ))]}
    </div>
  )
}

export default Rating

export const RatingReadonly: React.FC<{ rating: number, totalRatings: number }> = ({ rating, totalRatings }) => {
  return (
    <div className='flex gap-1 items-center'>
      <span className='text-2xl font-bold text-yellow-500'>&#9733;</span>
      <span className='text-xl font-semibold'>{rating}<span className='text-gray-500 ml-1'>({totalRatings})</span></span>
    </div>
  )
}
