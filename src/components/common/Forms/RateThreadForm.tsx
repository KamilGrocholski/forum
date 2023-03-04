import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import type { Thread } from "@prisma/client"
import { useEffect, useState } from "react"
import { useForm, type SubmitHandler, type SubmitErrorHandler, Controller } from "react-hook-form"
import { threadSchemes, type ThreadSchemes } from "../../../server/api/schemes/thread"
import { api } from "../../../utils/api"
import Button from "../Button"

const RateThreadForm: React.FC<{
  threadId: Thread['id']
}> = ({
  threadId
}) => {
    const rateThreadMutation = api.thread.rateThread.useMutation({
      onSuccess: () => {
        alert('Rated')
      },
      onError: () => {
        alert('Error while rating')
      }
    })

    const {
      handleSubmit,
      control,
      setValue
    } = useForm<ThreadSchemes['rateThread']>({
      defaultValues: {
        threadId
      },
      resolver: zodResolver(threadSchemes.rateThread)
    })


    const onValid: SubmitHandler<ThreadSchemes['rateThread']> = (data, e) => {
      e?.preventDefault()
      rateThreadMutation.mutate(data)
    }

    const onError: SubmitErrorHandler<ThreadSchemes['rateThread']> = (_, e) => {
      e?.preventDefault()
    }

    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(-1)

    useEffect(() => {
      setValue('rating', rating)
    }, [rating])

    return (
      <form
        onSubmit={handleSubmit(onValid, onError)}
        className='flex gap-1'
      >
        <Controller
          control={control}
          name='rating'
          render={() => (

            <div className='flex gap-1'>
              {[...Array.from({ length: 5 }, (i) => i).map((_, index) => (
                <button
                  type='button'
                  key={index}
                  className={clsx(
                    index + 1 <= hover ? 'text-yellow-300' : 'text-gray-500',
                    index + 1 <= rating ? 'text-yellow-500' : 'text-gray-300',
                    'text-2xl font-bold'
                  )}
                  onMouseEnter={() => setHover(index + 1)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(index + 1)}
                >
                  <span>&#9733;</span>
                </button>
              ))]}
            </div>
          )}
        />
        <Button type='submit'>
          Rate
        </Button>
      </form >
    )
  }

export default RateThreadForm
