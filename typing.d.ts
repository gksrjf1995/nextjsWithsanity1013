export interface Posts {
  _createdAt: string;
  _id: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  description: string;
  mainImage: {
    _type?: string;
    asset: {
      _ref?: string;
      url: string;
    };
  };
  comments: commnet[];
  slug: {
    current: string;
  };
  body: [object];
}

interface commnet {
  Approved: boolean;
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
}
