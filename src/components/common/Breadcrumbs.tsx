import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export interface BreadcrumbsProps {
  items: React.ReactNode[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="mb-8 flex w-fit items-center rounded bg-red-900 p-2">
      {items.map((item, index) => (
        <div className="flex items-center gap-1" key={index}>
          {item}
          {index !== items.length - 1 ? (
            <MdOutlineKeyboardArrowRight className="text-2xl font-bold" />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
