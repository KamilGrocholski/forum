import { convertFromRaw, convertToRaw, type EditorChangeType, EditorState, type RawDraftContentState } from "draft-js";

const convertToSaveInDatabase = (editorState: EditorState) => {
    const content = editorState.getCurrentContent()
    const rawObject = convertToRaw(content)
    const draftRaw = JSON.stringify(rawObject)

    return draftRaw
}

const convertToRead = (editorState: EditorState, draftRaw: string, changeType: EditorChangeType = 'remove-range') => {
    return EditorState.push(
        editorState,
        convertFromRaw(JSON.parse(draftRaw) as RawDraftContentState),
        changeType
    )
}

const dartJsConversion = {
    convertToSaveInDatabase,
    convertToRead
}

export default dartJsConversion