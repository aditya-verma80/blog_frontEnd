import { useEffect, useRef, useState } from "react";
import type QuillType from "quill";

import { toast } from "react-toastify";
import "quill/dist/quill.snow.css";
const editorModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
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

    import("quill").then(({ default: Quill }) => {
      if (!isMounted || !editorRef.current || quillRef.current) return;

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: editorModules,
      });

      quill.root.innerHTML = value;
      quill.on("text-change", () => {
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

const BlogForm = ({ blogId }: { blogId?: string }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation form
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all fields");
      return;
    }

    console.log("blog form data =================", formData);
  };

  return (
    <div>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {blogId ? "Edit Blog" : "Create New Blog"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your blog title"
                className={`block w-full rounded-md bg-white/5 px-3 py-1.5 text-base border border-gray-300 outline-none text-gray-800 outline-1 -outline-offset-1 placeholder:text-gray-500  sm:text-sm/6`}
                aria-label="Blog title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Content
              </label>
              <QuillEditor
                value={formData.content}
                onChange={handleEditorChange}
              />

              {errors.content && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {errors.content}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium py-2 px-4 rounded transition duration-200">
                Add Blog
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BlogForm;
