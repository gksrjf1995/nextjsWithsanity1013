import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import { sanityClient, urlFor } from '../../sanity';
import { Posts } from '../../typing';
import Header from '../../components/Header';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';

interface slugProps {
  post: Posts;
}

interface Inputs {
  name: string;
  Email: string;
  exampleRequired: string;
  coment: string;
  _id: string;
}

const Post = ({ post }: slugProps) => {
  const [submitok, setsubmitok] = useState(false);
  console.log(post);
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await fetch('/api/createComent', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res), setsubmitok(true);
      })
      .catch((err) => {
        console.log(err), setsubmitok(false);
      });
  };
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
        {submitok ? (
          <div>
            <h1>댓글 달아주셔 감사합니다.</h1>
            <p>관리자 승인 후 댓글이 보입니다.</p>
          </div>
        ) : (
          <form
            className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-sm text-yellow-500">
              위 글을 재밌게 보셨나요?
            </h3>
            <h4 className="text-3xl font-bold">댓글을 남겨주세요!</h4>
            <hr className="py-3 mt-2" />
            <label>
              <input
                type={'hidden'}
                {...register('_id')}
                name={'_id'}
                value={post._id}
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">이름:</span>
              <input
                {...register('name', { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block
              w-full 
            "
                type={'text'}
                placeholder="이름 입력해주세요!"
              />
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Email:</span>
              <input
                {...register('Email', { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block
              w-full "
                type={'email'}
                placeholder="E-mail 입력해주세요!"
              />
            </label>

            <label className="block mb-5 ">
              <span className="text-gray-700">댓글 내용:</span>
              <textarea
                {...register('coment', { required: true })}
                className="shadow border rounded py-2 px-3  mt-1 block
              w-full  resize-none outline-none focus:ring ring-yellow-400"
                placeholder="댓글 내용 달아주세요!"
                rows={5}
              />
            </label>
            <div className="flex flex-col">
              <div className="text-red-300 text-bold  text-lg ">
                {errors.name && <p>이름을 입력해주세요.</p>}
              </div>
              <div className="text-red-300 text-bold text-lg my-3">
                {errors.coment && <p>댓글 내용을 작성해주세요.</p>}
              </div>
              <div className="text-red-300 text-bold text-lg">
                {errors.Email && <p>E-mail을 입력해주세요</p>}
              </div>
            </div>
            <input
              type="submit"
              className="w-full bg-yellow-500 shadow focus:shadow-outline  h-10 rounded-md hover:bg-yellow-400 text-white font-bold py-2 px-4 
            cursor-pointer"
            />
          </form>
        )}
        <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-400 space-y-2">
          <h3 className="text-4xl">댓글창</h3>
          <hr className="pb-2" />

          {post.comments.map((item) => {
            return (
              <p key={item._createdAt} className={'mt-2'}>
                <span className="text-yellow-500">{item.name} : </span>
                {item.comment}
              </p>
            );
          })}
        </div>
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
        'comments' : *[
          _type == "comment" &&
          post._ref == ^._id &&
          Approved == true
        ],
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
