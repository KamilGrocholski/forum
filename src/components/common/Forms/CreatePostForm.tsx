import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../utils/api";
import { useState } from "react";
import CustomEditor from "../CustomEditor";
import { EditorState } from "draft-js";
import dartJsConversion from "../../../utils/dartJsConversion";
import { type PostSchemes } from "../../../server/api/schemes/post";
import type { Thread } from "@prisma/client";
import { z } from "zod";
import { useRouter } from "next/router";
import usePaths from "../../../hooks/usePaths";
import useToasts from "../../../hooks/useToasts";

const CreatePostForm: React.FC<{
  threadId: Thread["id"];
}> = ({ threadId }) => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<PostSchemes["create"], "content">>({
    defaultValues: {
      threadId,
    },
    resolver: zodResolver(
      z.object({
        threadId: z.string().cuid(),
      })
    ),
  });

  const router = useRouter();
  const paths = usePaths();
  const { push } = useToasts();

  const utils = api.useContext();

  const createPost = api.post.create.useMutation({
    onSuccess: (createdPost) => {
      //   void utils.thread.getById.invalidate({ id: threadId });
      void router.push(`/${paths.threadPageWithPostIndex(0, 10, threadId, 1)}`);
      push("post-create-success");
    },
    onError: () => {
      push("post-create-error");
    },
  });

  const onValid: SubmitHandler<Omit<PostSchemes["create"], "content">> = (
    data,
    e
  ) => {
    e?.preventDefault();
    console.log(data);
    const content = dartJsConversion.convertToSaveInDatabase(editorState);
    createPost.mutate({
      threadId: data.threadId,
      content,
    });
  };

  const onError: SubmitErrorHandler<Omit<PostSchemes["create"], "content">> = (
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

      <button className="w-fit rounded bg-red-900 px-3 py-1">Create</button>
    </form>
  );
};

export default CreatePostForm;
