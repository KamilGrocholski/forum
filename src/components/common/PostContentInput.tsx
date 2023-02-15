import { CompositeDecorator, convertToRaw, Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useState, useRef } from 'react'

const PostContentInput: React.FC<{ getValue: (value: string) => void }> = ({
  getValue
}) => {
  const editor = useRef<Editor>(null)
  const [anchorElUrl, setAnchorElUrl] = useState<string>("")
  const [toggleButtonGroupValue, setToggleButtonGroupValue] = useState<string | null>(null)

  const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty())
  const [plainText, setPlainText] = useState('')

  const onChange = (editorState: EditorState) => {
    const raw = convertToRaw(editorState.getCurrentContent())
    const json = JSON.stringify(raw, null, 2)
    console.log(json)
    const plainText = editorState.getCurrentContent().getPlainText()
    console.log(plainText)
    setPlainText(plainText)

    setEditorState(editorState)
  };


  return (
    <div>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={onChange}
      />
      <button></button>
    </div>
  )
}

export default PostContentInput