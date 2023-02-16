import clsx from 'clsx'
import { BsArrowRepeat } from 'react-icons/bs'

const SmallLoader: React.FC<{
    className?: string
}> = ({
    className
}) => {
        return (
            <BsArrowRepeat
                className={clsx(
                    'animate-spin',
                    className
                )}
            />
        )
    }

export default SmallLoader