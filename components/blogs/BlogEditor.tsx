'use client';

import { useEffect, useRef, useState } from 'react';
import type QuillType from 'quill';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify';
import 'quill/dist/quill.snow.css';

const editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

function QuillEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    let isMounted = true;

    import('quill').then(({ default: Quill }) => {
      if (!isMounted || !editorRef.current || quillRef.current) return;

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: editorModules,
      });

      quill.root.innerHTML = value;
      quill.on('text-change', () => {
        onChangeRef.current(quill.root.innerHTML);
      });

      quillRef.current = quill;
    });

    return () => {
      isMounted = false;
    };
  }, [value]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || quill.root.innerHTML === value) return;

    const selection = quill.getSelection();
    quill.root.innerHTML = value;
    if (selection) {
      quill.setSelection(selection);
    }
  }, [value]);

  return (
    <div className="rounded-lg bg-white text-gray-900">
      <div ref={editorRef} className="min-h-64" />
    </div>
  );
}

export default function BlogEditor({ blogId }: { blogId?: string }) {
  const router = useRouter();

  const [localError, setLocalError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setLocalError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-800">BlogHub</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Back to Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {blogId ? 'Edit Blog' : 'Create New Blog'}
          </h2>

          {localError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg" role="alert">
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter your blog title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Blog title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content
              </label>
              <QuillEditor
                value={formData.content}
                onChange={handleEditorChange}
              />
            </div>

            <div className="flex gap-4 pt-6">
               <button>asdfsdf</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
