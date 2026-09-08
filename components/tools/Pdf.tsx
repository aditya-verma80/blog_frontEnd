import { pdf, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Blog } from "@/types/blog";

export function safeFileName(title: string) {
    return title.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "blog";
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        color: "#222",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    meta: {
        fontSize: 10,
        color: "#666",
        marginBottom: 15,
    },
    divider: {
        marginBottom: 15,
        borderBottom: "1px solid #ddd",
    },
    content: {
        fontSize: 12,
        lineHeight: 1.6,
    },
});

const exportPdf = async (blog: Blog) => {
    const BlogDocument = (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{blog.title}</Text>

                <Text style={styles.meta}>
                    By {blog.authorName}
                    {"\n"}
                    Created: {new Date(blog.createdAt).toLocaleString()}
                    {"\n"}
                    Last Edited: {new Date(blog.updatedAt).toLocaleString()}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.content}>
                    {blog.content.replace(/<[^>]+>/g, "")}
                </Text>
            </Page>
        </Document>
    );

    const blob = await pdf(BlogDocument).toBlob();

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName(blog.title)}.pdf`;
    link.click();

    URL.revokeObjectURL(url);
};

export default exportPdf;