import { MdOutlineKeyboardArrowRight } from 'react-icons/md'

export interface BreadcrumbsProps {
  items: React.ReactNode[]
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items
}) => {
  return (
    <div className='flex items-center bg-red-900 p-2 mb-8 rounded w-fit'>
      {items.map((item, index) => (
        <div className='flex gap-1 items-center'>
          {item}
          {index !== items.length - 1
            ? <MdOutlineKeyboardArrowRight className='font-bold text-2xl' />
            : null}
        </div>
      ))}
    </div>
  )
}

export default Breadcrumbs
