export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  authorName: string;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
  lastEditAt?: string;
}
