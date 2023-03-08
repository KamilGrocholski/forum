import { useReducer } from "react";
import { type SubCategorySchemes } from "../../../server/api/schemes/subCategory";
import Button from "../Button";

type FilterTypeFromSchema = SubCategorySchemes["threadsFilter"];
type ThreadsFilterProps = ReturnType<typeof useThreadsFilter>;

export const useThreadsFilter = (initialState?: FilterTypeFromSchema) => {
  const [filter, setFilter] = useReducer<
    (
      prev: FilterTypeFromSchema,
      update: Partial<FilterTypeFromSchema>
    ) => FilterTypeFromSchema
  >(
    (prev, update) => ({ ...prev, ...update }),
    initialState ?? {
      sortBy: "create",
    }
  );

  return { filter, setFilter };
};

const ThreadsFilter: React.FC<ThreadsFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="my-8 flex gap-1 rounded bg-zinc-900 p-2">
      <Button
        variant="secondary"
        onClick={() => setFilter({ sortBy: "create" })}
      >
        Create
      </Button>
      <Button
        variant="secondary"
        onClick={() => setFilter({ sortBy: "views" })}
      >
        Views
      </Button>
      <Button
        variant="secondary"
        onClick={() => setFilter({ sortBy: "ratings" })}
      >
        Ratings
      </Button>
      <Button
        variant="secondary"
        onClick={() => setFilter({ sortBy: "update" })}
      >
        Update
      </Button>
    </div>
  );
};

export default ThreadsFilter;
