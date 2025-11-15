import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Table as TableIcon,
    Underline as UnderlineIcon,
    Undo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const normalizeHtml = (html: string): string => {
    const trimmed = html?.trim() ?? '';
    if (!trimmed || trimmed === '<p></p>' || trimmed === '<p><br></p>') {
        return '<p></p>';
    }
    return trimmed;
};

export function RichTextEditor({
    content,
    onChange,
    placeholder,
}: RichTextEditorProps) {
    const externalContentRef = useRef<string>(normalizeHtml(content));

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                orderedList: false,
                bulletList: false,
                listItem: false,
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg',
                },
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            BulletList.configure({
                keepMarks: true,
                keepAttributes: true,
                HTMLAttributes: {
                    class: 'list-disc ps-6 space-y-2',
                },
            }),
            OrderedList.configure({
                keepMarks: true,
                keepAttributes: true,
                HTMLAttributes: {
                    class: 'list-decimal ps-6 space-y-2',
                },
            }),
            ListItem.configure({
                HTMLAttributes: {
                    class: 'leading-relaxed',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Placeholder.configure({
                placeholder: placeholder ?? 'Tulis konten di sini...',
                includeChildren: true,
            }),
        ],
        content: normalizeHtml(content),
        onUpdate: ({ editor }) => {
            const html = normalizeHtml(editor.getHTML());
            externalContentRef.current = html;
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none',
                    'min-h-[320px] rounded-b-lg border border-t-0 border-border bg-card p-4',
                ),
            },
        },
    });

    const syncExternalContent = useCallback(
        (nextContent: string) => {
            if (!editor) {
                return;
            }

            const normalized = normalizeHtml(nextContent);
            if (normalized === externalContentRef.current) {
                return;
            }

            externalContentRef.current = normalized;
            const { from, to } = editor.state.selection;

            editor
                .chain()
                .setContent(normalized, false, { preserveWhitespace: true })
                .setTextSelection({ from, to })
                .run();
        },
        [editor],
    );

    useEffect(() => {
        syncExternalContent(content);
    }, [content, syncExternalContent]);

    if (!editor) {
        return (
            <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-muted text-sm text-muted-foreground">
                Memuat editor...
            </div>
        );
    }

    const addImage = () => {
        const url = window.prompt('Masukkan URL gambar:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Masukkan URL:', previousUrl ?? '');
        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const MenuButton = ({
        onClick,
        isActive,
        children,
        title,
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            title={title}
            className={cn('h-8 w-8 p-0', isActive && 'bg-muted')}
        >
            {children}
        </Button>
    );

    return (
        <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex flex-wrap gap-1 border-b border-border bg-muted/50 p-2">
                <div className="flex gap-1 border-r border-border pr-2">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Tebal"
                    >
                        <Bold className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Miring"
                    >
                        <Italic className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Garis bawah"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Coret"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Kode"
                    >
                        <Code className="h-4 w-4" />
                    </MenuButton>
                </div>

                <div className="flex gap-1 border-r border-border pr-2">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </MenuButton>
                </div>

                <div className="flex gap-1 border-r border-border pr-2">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Daftar bullet"
                    >
                        <List className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Daftar nomor"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Kutipan"
                    >
                        <Quote className="h-4 w-4" />
                    </MenuButton>
                </div>

                <div className="flex gap-1 border-r border-border pr-2">
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Rata kiri"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Rata tengah"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Rata kanan"
                    >
                        <AlignRight className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Rata kiri-kanan"
                    >
                        <AlignJustify className="h-4 w-4" />
                    </MenuButton>
                </div>

                <div className="flex gap-1 border-r border-border pr-2">
                    <MenuButton
                        onClick={addLink}
                        isActive={editor.isActive('link')}
                        title="Tambahkan tautan"
                    >
                        <Link2 className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton onClick={addImage} title="Tambahkan gambar">
                        <ImageIcon className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                                .run()
                        }
                        title="Tambahkan tabel"
                    >
                        <TableIcon className="h-4 w-4" />
                    </MenuButton>
                </div>

                <div className="flex gap-1">
                    <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Urungkan">
                        <Undo className="h-4 w-4" />
                    </MenuButton>
                    <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Ulangi">
                        <Redo className="h-4 w-4" />
                    </MenuButton>
                </div>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}
