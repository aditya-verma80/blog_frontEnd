export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  createAt: string;
  updateAt: string;
  lastEditAt: string;
}
