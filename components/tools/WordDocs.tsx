import { Blog } from "@/types/blog";
import { safeFileName } from "./Pdf";

function exportDocument(blog: Blog) {
    // alert("docs evetn is calling")
    const html = `<!doctype html><html>

<body style="font-family: Helvetica, sans-serif;">
  <h1 style="font-size: 24px; font-weight: bold; color: #333; ">${blog.title}</h1>

  <div style="display:flex; color: #6b7280; align-items:center; gap:16px;padding-bottom: 0; margin-bottom: 0">
    <span style="font-size: 14px;text-transform: capitalize;">By ${blog.authorName}</span> &#8226;
    <span style="font-size: 14px;">Created: ${new Date(blog.createdAt).toLocaleString()}</span> &#8226;
    <span style="font-size: 14px;">Last edited: ${new Date(blog.updatedAt).toLocaleString()}</span>
  </div>

  <hr style="color:#d1d5db; margin: 0;" />

  <p>${blog.content}</p>
</body>

  </html>`;
    const url = URL.createObjectURL(
        new Blob([html], { type: "application/msword" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName(blog.title)}.doc`;
    link.click();
    URL.revokeObjectURL(url);
}

export default exportDocument;