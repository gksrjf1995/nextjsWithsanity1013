import Link from 'next/link';
import React from 'react';
import { urlFor } from '../sanity';
import { Posts } from '../typing';
interface Props {
  posts: Posts[];
}

const EachPosts = (post: Props) => {
  const { posts } = post;
  console.log(posts);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
      {posts.map((item) => {
        return (
          <Link href={`post/${item.slug.current}`} key={item._id}>
            <div className="group border rounded-lg overflow-hidden">
              {item.mainImage ? (
                <img
                  className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
                  src={urlFor(item.mainImage).url()!}
                  alt={'images'}
                />
              ) : (
                '없음'
              )}
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">
                    {item.title && item.title}
                  </p>
                  <p className="text-xs">
                    {item.description && item.description}{' '}
                    <span>작성자 {item.author.name && item.author.name}</span>
                  </p>
                </div>

                <img
                  className="w-12 h-12 rounded-full"
                  src={urlFor(item.author.image).url()!}
                  alt={'작성자 이미지'}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default EachPosts;
