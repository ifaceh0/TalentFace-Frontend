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
import { updateSummary } from '../../services/candidate.service';
import type { CandidateProfile } from '../../types/candidate.types';

interface SummaryFormProps {
  profile: CandidateProfile; // profile.summary: JSONContent | null
  onUpdate: (p: CandidateProfile) => void;
}

const MAX_CHARS = 1000;

export default function SummaryForm({ profile, onUpdate }: SummaryFormProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
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
    content: profile.summary ?? '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[180px] px-4 py-3 text-sm text-gray-800',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length > MAX_CHARS) {
        const truncated = text.slice(0, MAX_CHARS);
        editor.commands.setContent(
          { type: 'doc', content: [{ type: 'paragraph', content: truncated ? [{ type: 'text', text: truncated }] : [] }] },
          { emitUpdate: false },
        );
        setCharCount(MAX_CHARS);
        setIsDirty(true);
        setMsg(null);
        return;
      }
      setCharCount(text.length);
      setIsDirty(true);
      setMsg(null);
    },
  });

  useEffect(() => {
    if (editor && profile.summary) {
      setCharCount(editor.getText().length);
    }
  }, [editor, profile.summary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || editor.isEmpty) return;

    const json: JSONContent = editor.getJSON();
    setLoading(true);
    setMsg(null);
    try {
      await updateSummary(json);
      onUpdate({ ...profile, summary: json });
      setIsDirty(false);
      setMsg({ type: 'success', text: 'Summary updated!' });
    } catch (err: unknown) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    editor?.commands.setContent(profile.summary ?? '');
    setIsDirty(false);
    setMsg(null);
    if (editor) setCharCount(editor.getText().length);
  };

  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', previousUrl ?? 'https://');
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const remaining = MAX_CHARS - charCount;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Profile Summary</h2>
          <p className="text-sm text-gray-500 mt-1">
            Write a compelling summary about yourself
          </p>
        </div>
        {isDirty && (
          <span className="shrink-0 mt-1 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Editor card */}
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-50 transition-all">
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-2.5 py-2 border-b border-gray-100 bg-gray-50/60 flex-wrap">
            <ToolbarButton
              label="Bold"
              shortcut="⌘B"
              active={editor?.isActive('bold')}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <BoldIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              shortcut="⌘I"
              active={editor?.isActive('italic')}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <ItalicIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>
            <ToolbarButton
              label="Underline"
              shortcut="⌘U"
              active={editor?.isActive('underline')}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>
            <ToolbarButton
              label="Strikethrough"
              shortcut="⌘⇧X"
              active={editor?.isActive('strike')}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            >
              <StrikeIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              label="Bullet list"
              shortcut="⌘⇧8"
              active={editor?.isActive('bulletList')}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <ListIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>
            <ToolbarButton
              label="Quote"
              shortcut="⌘⇧B"
              active={editor?.isActive('blockquote')}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <QuoteIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>
            <ToolbarButton
              label="Link"
              shortcut="⌘K"
              active={editor?.isActive('link')}
              onClick={handleSetLink}
            >
              <LinkIcon size={15} strokeWidth={2.4} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              label="Undo"
              shortcut="⌘Z"
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <Undo2 size={15} strokeWidth={2.4} />
            </ToolbarButton>
            <ToolbarButton
              label="Redo"
              shortcut="⌘⇧Z"
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <Redo2 size={15} strokeWidth={2.4} />
            </ToolbarButton>

            <div className="ml-auto pl-2">
              <span
                className={`text-xs font-mono tabular-nums ${
                  remaining < 50 ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {remaining}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Editor */}
          <EditorContent editor={editor} />
        </div>

        {/* AI hint */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
          <span className="text-base leading-none mt-0.5">💡</span>
          <p className="text-xs text-blue-700 leading-relaxed">
            A strong summary mentions your role, key skills, top achievements, and career
            goals in 3–5 sentences. Use <span className="font-semibold">bold</span> for
            standout skills and <span className="italic">italics</span> for emphasis.
          </p>
        </div>

        {msg && (
          <div
            className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${
              msg.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <span>{msg.type === 'success' ? '✓' : '⚠'}</span>
            {msg.text}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading || !editor || editor.isEmpty || !isDirty}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-red-200/50"
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {loading ? 'Saving…' : 'Save Summary'}
          </button>

          {isDirty && !loading && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Discard
            </button>
          )}
        </div>
      </form>
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
        active
          ? 'bg-red-100 text-red-600'
          : 'text-gray-600 hover:bg-gray-200/70 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

// import { useState } from 'react';
// import { updateSummary } from '../../services/candidate.service';
// import type { CandidateProfile } from '../../types/candidate.types';

// interface SummaryFormProps {
//   profile: CandidateProfile;
//   onUpdate: (p: CandidateProfile) => void;
// }

// const MAX = 1000;

// export default function SummaryForm({ profile, onUpdate }: SummaryFormProps) {
//   const [text, setText] = useState(profile.summary ?? '');
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!text.trim()) return;
//     setLoading(true);
//     setMsg(null);
//     try {
//       await updateSummary(text.trim());
//       onUpdate({ ...profile, summary: text.trim() });
//       setMsg({ type: 'success', text: 'Summary updated!' });
//     } catch (err: unknown) {
//       setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const remaining = MAX - text.length;

//   return (
//     <div className="space-y-5">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900">Profile Summary</h2>
//         <p className="text-sm text-gray-500 mt-1">Write a compelling summary about yourself (max {MAX} characters)</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="relative">
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value.slice(0, MAX))}
//             rows={8}
//             placeholder="I am a passionate software developer with experience in..."
//             className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
//           />
//           <span
//             className={`absolute bottom-3 right-4 text-xs font-mono ${
//               remaining < 50 ? 'text-red-500' : 'text-gray-400'
//             }`}
//           >
//             {remaining}/{MAX}
//           </span>
//         </div>

//         {/* AI hint */}
//         <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
//           <span className="text-base mt-0.5">💡</span>
//           <p className="text-xs text-blue-700">
//             A strong summary mentions your role, key skills, top achievements, and career goals in 3–5 sentences.
//           </p>
//         </div>

//         {msg && (
//           <div className={`text-sm px-4 py-3 rounded-xl ${
//             msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
//           }`}>
//             {msg.text}
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading || !text.trim()}
//           className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
//         >
//           {loading && (
//             <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
//               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
//               <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
//             </svg>
//           )}
//           {loading ? 'Saving…' : 'Save Summary'}
//         </button>
//       </form>
//     </div>
//   );
// }


// 

