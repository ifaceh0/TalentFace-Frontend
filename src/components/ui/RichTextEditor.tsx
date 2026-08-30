import { useEffect, useState } from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
  List as ListIcon,
  Quote as QuoteIcon,
  Link as LinkIcon,
  Undo2,
  Redo2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: JSONContent | string | null;
  onChange: (json: JSONContent) => void;
  maxChars?: number;
  minHeight?: number;
}

export default function RichTextEditor({
  content,
  onChange,
  maxChars = 1000,
  minHeight = 180,
}: RichTextEditorProps) {
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        orderedList: false,
        codeBlock: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: {
            class: 'text-red-600 underline underline-offset-2',
          },
        },
      }),
    ],
    content: content ?? '',
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[${minHeight}px] px-4 py-3 text-sm text-gray-800`,
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length > maxChars) {
        const truncated = text.slice(0, maxChars);
        editor.commands.setContent(
          { type: 'doc', content: [{ type: 'paragraph', content: truncated ? [{ type: 'text', text: truncated }] : [] }] },
          { emitUpdate: false },
        );
        setCharCount(maxChars);
        onChange(editor.getJSON());
        return;
      }
      setCharCount(text.length);
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && content) {
      setCharCount(editor.getText().length);
    }
  }, [editor, content]);

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', previousUrl ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const remaining = maxChars - charCount;

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
      <div className="flex items-center gap-0.5 px-2.5 py-2 border-b border-gray-100 bg-gray-50/60 flex-wrap">
        <ToolbarButton label="Bold" shortcut="⌘B" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <BoldIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>
        <ToolbarButton label="Italic" shortcut="⌘I" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <ItalicIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>
        <ToolbarButton label="Underline" shortcut="⌘U" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" shortcut="⌘⇧X" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
          <StrikeIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Bullet list" shortcut="⌘⇧8" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <ListIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>
        <ToolbarButton label="Quote" shortcut="⌘⇧B" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <QuoteIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>
        <ToolbarButton label="Link" shortcut="⌘K" active={editor?.isActive('link')} onClick={handleSetLink}>
          <LinkIcon size={15} strokeWidth={2.4} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Undo" shortcut="⌘Z" onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2 size={15} strokeWidth={2.4} />
        </ToolbarButton>
        <ToolbarButton label="Redo" shortcut="⌘⇧Z" onClick={() => editor?.chain().focus().redo().run()}>
          <Redo2 size={15} strokeWidth={2.4} />
        </ToolbarButton>

        <div className="ml-auto pl-2">
          <span className={`text-xs font-mono tabular-nums ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {remaining}/{maxChars}
          </span>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-1.5" />;
}

function ToolbarButton({
  children,
  label,
  shortcut,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  shortcut: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={`${label} (${shortcut})`}
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
        active ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

// import { useEffect, useState } from 'react';
// import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import {
//   Bold as BoldIcon,
//   Italic as ItalicIcon,
//   Underline as UnderlineIcon,
//   Strikethrough as StrikeIcon,
//   List as ListIcon,
//   Quote as QuoteIcon,
//   Link as LinkIcon,
//   Undo2,
//   Redo2,
// } from 'lucide-react';

// interface RichTextEditorProps {
//   content: JSONContent | string | null;
//   onChange: (json: JSONContent) => void;
//   maxChars?: number;
//   minHeight?: number;
// }

// export default function RichTextEditor({
//   content,
//   onChange,
//   maxChars = 1000,
//   minHeight = 180,
// }: RichTextEditorProps) {
//   const [charCount, setCharCount] = useState(0);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: false,
//         orderedList: false,
//         codeBlock: false,
//         horizontalRule: false,
//         link: {
//           openOnClick: false,
//           autolink: true,
//           HTMLAttributes: {
//             class: 'text-red-600 underline underline-offset-2',
//           },
//         },
//       }),
//     ],
//     content: content ?? '',
//     editorProps: {
//       attributes: {
//         class: `prose prose-sm max-w-none focus:outline-none min-h-[${minHeight}px] px-4 py-3 text-sm text-gray-800`,
//       },
//     },
//     onUpdate: ({ editor }) => {
//       const text = editor.getText();
//       if (text.length > maxChars) {
//         const truncated = text.slice(0, maxChars);
//         editor.commands.setContent(
//           { type: 'doc', content: [{ type: 'paragraph', content: truncated ? [{ type: 'text', text: truncated }] : [] }] },
//           { emitUpdate: false },
//         );
//         setCharCount(maxChars);
//         onChange(editor.getJSON());
//         return;
//       }
//       setCharCount(text.length);
//       onChange(editor.getJSON());
//     },
//   });

//   useEffect(() => {
//     if (editor && content) {
//       setCharCount(editor.getText().length);
//     }
//   }, [editor, content]);

//   const handleSetLink = () => {
//     if (!editor) return;
//     const previousUrl = editor.getAttributes('link').href as string | undefined;
//     const url = window.prompt('Enter URL', previousUrl ?? 'https://');
//     if (url === null) return;
//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }
//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };

//   const remaining = maxChars - charCount;

//   return (
//     <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
//       <div className="flex items-center gap-0.5 px-2.5 py-2 border-b border-gray-100 bg-gray-50/60 flex-wrap">
//         <ToolbarButton label="Bold" shortcut="⌘B" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
//           <BoldIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>
//         <ToolbarButton label="Italic" shortcut="⌘I" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
//           <ItalicIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>
//         <ToolbarButton label="Underline" shortcut="⌘U" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
//           <UnderlineIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>
//         <ToolbarButton label="Strikethrough" shortcut="⌘⇧X" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
//           <StrikeIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>

//         <Divider />

//         <ToolbarButton label="Bullet list" shortcut="⌘⇧8" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
//           <ListIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>
//         <ToolbarButton label="Quote" shortcut="⌘⇧B" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
//           <QuoteIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>
//         <ToolbarButton label="Link" shortcut="⌘K" active={editor?.isActive('link')} onClick={handleSetLink}>
//           <LinkIcon size={15} strokeWidth={2.4} />
//         </ToolbarButton>

//         <Divider />

//         <ToolbarButton label="Undo" shortcut="⌘Z" onClick={() => editor?.chain().focus().undo().run()}>
//           <Undo2 size={15} strokeWidth={2.4} />
//         </ToolbarButton>
//         <ToolbarButton label="Redo" shortcut="⌘⇧Z" onClick={() => editor?.chain().focus().redo().run()}>
//           <Redo2 size={15} strokeWidth={2.4} />
//         </ToolbarButton>

//         <div className="ml-auto pl-2">
//           <span className={`text-xs font-mono tabular-nums ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}>
//             {remaining}/{maxChars}
//           </span>
//         </div>
//       </div>

//       <EditorContent editor={editor} />
//     </div>
//   );
// }

// function Divider() {
//   return <div className="w-px h-5 bg-gray-200 mx-1.5" />;
// }

// function ToolbarButton({
//   children,
//   label,
//   shortcut,
//   active,
//   onClick,
// }: {
//   children: React.ReactNode;
//   label: string;
//   shortcut: string;
//   active?: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       title={`${label} (${shortcut})`}
//       onClick={onClick}
//       className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
//         active ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
//       }`}
//     >
//       {children}
//     </button>
//   );
// }