import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../utils/api";
import CustomEditor from "../CustomEditor";
import { type EditorState } from "draft-js";
import dartJsConversion from "../../../utils/dartJsConversion";
import { type PostSchemes } from "../../../server/api/schemes/post";
import type { Post } from "@prisma/client";
import { z } from "zod";
import Button from "../Button";
import useToasts from "../../../hooks/useToasts";

const EditPostForm: React.FC<{
  postId: Post["id"];
  editorState: EditorState;
  setEditorState: React.Dispatch<EditorState>;
  onSuccess: () => void;
}> = ({ postId, editorState, setEditorState, onSuccess }) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<PostSchemes["update"], "content">>({
    defaultValues: {
      id: postId,
    },
    resolver: zodResolver(
      z.object({
        id: z.string().cuid(),
      })
    ),
  });

  const { push } = useToasts();

  const updatePost = api.post.update.useMutation({
    onSuccess: () => {
      onSuccess();
      push("post-edit-success");
    },
    onError: () => {
      push("post-edit-error");
    },
  });

  const onValid: SubmitHandler<Omit<PostSchemes["update"], "content">> = (
    data,
    e
  ) => {
    e?.preventDefault();
    console.log(data);
    const content = dartJsConversion.convertToSaveInDatabase(editorState);
    updatePost.mutate({
      id: data.id,
      content,
    });
  };

  const onError: SubmitErrorHandler<Omit<PostSchemes["update"], "content">> = (
    data,
    e
  ) => {
    e?.preventDefault();
    console.log({
      ...data,
      editorState: dartJsConversion.convertToSaveInDatabase(editorState),
    });
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onValid, onError)}
      className="flex flex-col space-y-12 rounded p-3"
    >
      <CustomEditor editorState={editorState} onChange={setEditorState} />

      <Button type="submit" className="w-fit">
        Confirm changes
      </Button>
    </form>
  );
};

export default EditPostForm;
