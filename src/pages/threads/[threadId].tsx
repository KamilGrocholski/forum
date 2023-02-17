import { EditorState } from "draft-js"
import { type NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import CustomEditor from "../../components/common/CustomEditor"
import StateWrapper from "../../components/common/StateWrapper"
import MainLayout from "../../components/layout/MainLayout"
import { api } from "../../utils/api"
import dartJsConversion from "../../utils/dartJsConversion"

const ThreadPage: NextPage = () => {
    const router = useRouter()
    const threadId = router.query.threadId as string
    const threadQuery = api.thread.getById.useQuery({ id: threadId })

    return (
        <MainLayout>
            <StateWrapper
                data={threadQuery.data}
                isLoading={threadQuery.isLoading}
                isError={threadQuery.isError}
                NonEmpty={(thread) => (
                    <div>
                        {thread.posts.map((post) => (
                            <Post
                                key={post.id}
                                content={post.content}
                                id={post.id}
                            />
                        ))}
                    </div>
                )}
            />
        </MainLayout>
    )
}

export default ThreadPage

const Post: React.FC<{
    content: string
    id: string
}> = ({
    content,
    id
}) => {
        const [mode, setMode] = useState<'view' | 'edit'>('view')

        const [editorState, setEditorState] = useState<EditorState>(dartJsConversion.convertToRead(EditorState.createEmpty(), content))

        return (
            <>
                {mode === 'view' ?
                    <CustomEditor
                        editorState={editorState}
                        readOnly={true}
                        onChange={() => null}
                    /> : null}
                {mode === 'edit' ?
                    <CustomEditor
                        editorState={editorState}
                        onChange={setEditorState}
                    /> : null}
                <button onClick={() => setMode(prev => prev === 'edit' ? 'view' : 'edit')}>Edit</button>
            </>
        )
    }