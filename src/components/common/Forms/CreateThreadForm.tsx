import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../TextInput";
import { type ThreadSchemes } from "../../../server/api/schemes/thread";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import StateWrapper from "../StateWrapper";
import { Modal } from "../Modal";
import { useState } from "react";
import usePaths from "../../../hooks/usePaths";
import CustomEditor from "../CustomEditor";
import { EditorState } from "draft-js";
import { z } from "zod";
import dartJsConversion from "../../../utils/dartJsConversion";
import Button from "../Button";
import useToasts from "../../../hooks/useToasts";

const CreateThreadForm: React.FC = () => {
  const [subCategoryName, setSubCategoryName] = useState<string | null>(null);

  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );

  const { push } = useToasts();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<ThreadSchemes["create"], "content">>({
    resolver: zodResolver(
      z.object({
        title: z.string(),
        subCategoryId: z.string(),
      })
    ),
  });

  const paths = usePaths();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const createThread = api.thread.create.useMutation({
    onSuccess: (data) => {
      push("thread-create-success");
      void router.push(paths.thread(data.id));
    },
    onError: () => {
      push("thread-create-error");
    },
  });

  const onValid: SubmitHandler<Omit<ThreadSchemes["create"], "content">> = (
    data,
    e
  ) => {
    e?.preventDefault();

    const content = dartJsConversion.convertToSaveInDatabase(editorState);
    createThread.mutate({
      ...data,
      content,
    });
  };

  const onError: SubmitErrorHandler<
    Omit<ThreadSchemes["create"], "content">
  > = (data, e) => {
    e?.preventDefault();
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onValid, onError)}
      className="flex flex-col space-y-3 rounded bg-zinc-800 p-3"
    >
      <Button onClick={() => setOpen(true)}>Select subcategory</Button>
      <Modal openState={[open, setOpen]}>
        <CategoryWithSubCategories
          onSelect={(id, name) => {
            setValue("subCategoryId", id);
            setSubCategoryName(name);
            setOpen(false);
          }}
        />
      </Modal>
      <TextInput
        id="thread-title"
        placeholder="Thread title"
        errorMessage={errors.title?.message}
        {...register("title")}
      />

      <CustomEditor editorState={editorState} onChange={setEditorState} />

      <div className="flex gap-1">
        <span>Selected subcategory:</span>
        <span className="font-bold">{subCategoryName}</span>
      </div>
      <TextInput
        disabled={true}
        className="hidden"
        id="thread-subCategoryId"
        errorMessage={errors.subCategoryId?.message}
        {...register("subCategoryId")}
      />
      <Button
        type="submit"
        loading={createThread.isLoading || createThread.isSuccess}
      >
        Create
      </Button>
    </form>
  );
};

export default CreateThreadForm;

const CategoryWithSubCategories: React.FC<{
  onSelect: (id: string, name: string) => void;
}> = ({ onSelect }) => {
  const listQuery = api.category.getAllWithSubCategoriesSmallInfo.useQuery();

  return (
    <StateWrapper
      data={listQuery.data}
      isLoading={listQuery.isLoading}
      isError={listQuery.isError}
      NonEmpty={(list) => (
        <div className="flex min-w-[70vw] flex-col bg-zinc-900 p-3">
          {list.map((category) => (
            <div key={category.id} className="w-full">
              <div className="bg-red-900 px-3">{category.name}</div>
              <div className="flex flex-col">
                {category.subCategories.map((subCategory) => (
                  <button
                    key={subCategory.id}
                    onClick={() => onSelect(subCategory.id, subCategory.name)}
                    className="flex w-full justify-between px-3 text-start hover:bg-zinc-800"
                  >
                    <span>{subCategory.name}</span>
                    {/* <span>Threads: {subCategory._count.threads}</span> */}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
};
