import { Separator } from "@draft-js-plugins/static-toolbar";
import Editor from '@draft-js-plugins/editor'
import { useState, useRef } from "react";
import createToolbarPlugin from '@draft-js-plugins/static-toolbar'
import { BoldButton, ItalicButton, UnderlineButton, CodeButton, UnorderedListButton, OrderedListButton } from "@draft-js-plugins/buttons";
import { type EditorProps } from "draft-js";

interface CustomEditorProps extends EditorProps {
    ok?: number
}

const CustomEditor: React.FC<CustomEditorProps> = ({
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
        <div>
            <div
                className="editor"
                onClick={() => editorRef.current && editorRef.current.focus()}
            >
                <Toolbar>
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
                </Toolbar>
                <Editor
                    plugins={plugins}
                    ref={(editor) => (editorRef.current = editor)}
                    {...rest}
                />
            </div>
        </div>
    );
};

export default CustomEditor