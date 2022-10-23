export default {
  name: 'comment',
  type: 'document',
  title: 'comment',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'Approved',
      title: 'Approved',
      type: 'boolean',
      description: '승인 없이 코멘트는 보여지지않음.',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'text',
    },
    {
      name: 'post',
      type: 'reference',
      to: [{ type: 'post' }],
    },
  ],
};
