import type { NextApiRequest, NextApiResponse } from 'next';
import sanityClient from '@sanity/client';

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKNE,
};

const client = sanityClient(config);

export default async function createComent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { Email, _id, name, coment } = JSON.parse(req.body);
  console.log('서버 접속');
  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      name,
      email: Email,
      comment: coment,
    });
  } catch (err) {
    return res.status(500).json({ message: '오류 있음' });
  }

  return res.status(200).json({ message: '성공' });
}
