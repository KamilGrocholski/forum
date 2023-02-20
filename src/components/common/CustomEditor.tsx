import { Separator } from "@draft-js-plugins/static-toolbar";
import Editor from '@draft-js-plugins/editor'
import { useState, useRef } from "react";
import createToolbarPlugin from '@draft-js-plugins/static-toolbar'
import { BoldButton, ItalicButton, UnderlineButton, CodeButton, UnorderedListButton, OrderedListButton } from "@draft-js-plugins/buttons";
import { type EditorProps } from "draft-js";
import 'draft-js/dist/Draft.css';

interface CustomEditorProps extends EditorProps {
    readOnly?: boolean
}

const CustomEditor: React.FC<CustomEditorProps> = ({
    readOnly = false,
    ...rest
}) => {

    const [{ plugins, Toolbar }] = useState(() => {
        const toolbarPlugin = createToolbarPlugin();
        const { Toolbar } = toolbarPlugin;
        const plugins = [toolbarPlugin];
        return {
            plugins,
            Toolbar
        };
    });

    const editorRef = useRef<Editor | null>(null);

    return (
        <div
            className={`editor ${readOnly ? '' : 'readonly-editor'} min-h-[12rem] w-full`}
            onClick={() => editorRef.current && editorRef.current.focus()}
        >
            {readOnly
                ? null
                : <Toolbar>
                    {(externalProps) => (
                        <div className='flex'>
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <CodeButton {...externalProps} />
                            <Separator />
                            <UnorderedListButton {...externalProps} />
                            <OrderedListButton {...externalProps} />
                        </div>
                    )}
                </Toolbar>}
            <Editor
                plugins={readOnly ? undefined : plugins}
                ref={(editor) => (editorRef.current = editor)}
                readOnly={readOnly}
                {...rest}
            />
        </div>
    );
};

export default CustomEditor