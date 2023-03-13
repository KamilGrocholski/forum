import { useReducer } from "react";
import { type SubCategorySchemes } from "../../../server/api/schemes/subCategory";
import Button from "../Button";
import { BsFillReplyFill } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { AiFillEye, AiFillCalendar } from "react-icons/ai";
import { MdGrade } from "react-icons/md";

type FilterTypeFromSchema = SubCategorySchemes["threadsFilter"];
type ThreadsFilterProps = ReturnType<typeof useThreadsFilter>;

export const useThreadsFilter = (initialState: FilterTypeFromSchema) => {
  const [filter, setFilter] = useReducer<
    (
      prev: FilterTypeFromSchema,
      update: Partial<FilterTypeFromSchema>
    ) => FilterTypeFromSchema
  >((prev, update) => ({ ...prev, ...update }), initialState);

  return { filter, setFilter };
};

const ThreadsFilter: React.FC<ThreadsFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="my-8 w-fit">
      <div className="text-2xl font-semibold">Filter</div>
      <div className="flex gap-1 rounded bg-zinc-900 p-2">
        <Button
          size="lg"
          variant={filter.sortBy === "createdAt" ? "primary" : "secondary"}
          onClick={() => setFilter({ sortBy: "createdAt" })}
        >
          <AiFillCalendar />
        </Button>
        <Button
          size="lg"
          variant={filter.sortBy === "views" ? "primary" : "secondary"}
          onClick={() => setFilter({ sortBy: "views" })}
        >
          <AiFillEye />
        </Button>
        <Button
          size="lg"
          variant={filter.sortBy === "ratings" ? "primary" : "secondary"}
          onClick={() => setFilter({ sortBy: "ratings" })}
        >
          <MdGrade />
        </Button>
        <Button
          size="lg"
          variant={filter.sortBy === "updatedAt" ? "primary" : "secondary"}
          onClick={() => setFilter({ sortBy: "updatedAt" })}
        >
          <RxUpdate />
        </Button>
        <Button
          size="lg"
          variant={filter.sortBy === "replies" ? "primary" : "secondary"}
          onClick={() => setFilter({ sortBy: "replies" })}
        >
          <BsFillReplyFill />
        </Button>
      </div>
    </div>
  );
};

export default ThreadsFilter;
