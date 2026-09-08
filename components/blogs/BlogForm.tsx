import { useEffect, useRef, useState } from "react";
import type QuillType from "quill";

import { toast } from "react-toastify";
import "quill/dist/quill.snow.css";
import {
  createBlog,
  fetchBlogById,
  updateBlog,
} from "@/redux/slices/blogSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import LoaderButton from "../LoaderButton";
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

      quill.root.setAttribute("aria-label", "Blog content");
      quill.root.setAttribute("aria-required", "true");

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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.blog);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (!blogId) return;

    let active = true;
    dispatch(fetchBlogById(blogId))
      .unwrap()
      .then((result) => {
        if (active) {
          setFormData({
            title: result.blog.title,
            content: result.blog.content,
          });
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(
            typeof error === "string" ? error : "Unable to load blog",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [blogId, dispatch]);

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

    try {
      const result = blogId
        ? await dispatch(updateBlog({ id: blogId, data: formData })).unwrap()
        : await dispatch(createBlog(formData)).unwrap();

      toast.success(result.message);
      router.push(`/blog/${result.blog._id}`);
      router.refresh();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Unable to save blog");
    }
  };

  return (
    <div>
      <main
        id="main-content"
        className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="rounded-lg bg-white p-4 shadow-md sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
            {blogId ? "Edit Blog" : "Create New Blog"}
          </h1>

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
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p
                  id="title-error"
                  className="mt-1 text-sm font-medium text-red-700"
                  role="alert"
                >
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
                <p
                  id="content-error"
                  className="mt-1 text-sm font-medium text-red-700"
                  role="alert"
                >
                  {errors.content}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="min-h-11 cursor-pointer rounded bg-blue-700 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? (
                  <LoaderButton textval="Saving..." />
                ) : blogId ? (
                  "Update Blog"
                ) : (
                  "Add Blog"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BlogForm;
