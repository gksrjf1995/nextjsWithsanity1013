import { GetStaticProps } from 'next';
import React from 'react';
import { sanityClient, urlFor } from '../../sanity';
import { Posts } from '../../typing';
import Header from '../../components/Header';
import PortableText from 'react-portable-text';

interface slugProps {
  post: Posts;
}

const Post = ({ post }: slugProps) => {
  console.log(post?.body);
  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url!()}
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2 ">
          <img
            className="h-10 w-10 rounded-full "
            src={urlFor(post.author.image).url!()}
          />
          <p className="font-extralight text-sm">
            -작성자 <span className="text-green-200">{post.author.name}</span> -
            작성일 {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl  font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="special-list-item">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className={'text-blue-500 hover:underline'}>
                  {children}
                </a>
              ),
              normal: ({ props, children }: any) => (
                <p className="text-black my-5">{children}</p>
              ),
            }}
          />
        </div>

        <hr className="max-w-full my-5 mx-auto border border-yellow-400" />
        <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
          <h3 className="text-sm text-yellow-500">위 글을 재밌게 보셨나요?</h3>
          <h4 className="text-3xl font-bold">댓글을 남겨주세요!</h4>
          <hr className="py-3 mt-2" />
          <label className="block mb-5">
            <span className="text-gray-700">이름:</span>
            <input
              className="shadow border rounded py-2 px-3 form-input mt-1 block
              w-full ring-yellow-500
            "
              type={'text'}
              placeholder="이름 입력해주세요!"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email:</span>
            <input
              className="shadow border rounded py-2 px-3 form-input mt-1 block
              w-full ring-yellow-500
            "
              type={'email'}
              placeholder="E-mail 입력해주세요!"
            />
          </label>

          <label className="block mb-5">
            <span className="text-gray-700">댓글 내용:</span>
            <textarea
              className="resize-none shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-400 outline-none forcus:ring "
              placeholder="댓글 내용 달아주세요!"
              rows={5}
            />
          </label>
        </form>
      </article>
    </main>
  );
};

export const getStaticPaths = async (path: any) => {
  console.log('Path');
  console.log(path);
  const query = `*[_type == "post"]{
        _id,
       slug {
            current
        }
     }
    `;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Posts) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('Params');
  const slug = params?.slug;

  const query = `*[_type == "post"  && slug.current == $slug] [0]{
        _id,
        title,
        author -> {
        name,
        image,
        },
        description,
        mainImage,
        slug,
        _createdAt,
        body
      }
    `;

  const post = await sanityClient.fetch(query, { slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

export default Post;
