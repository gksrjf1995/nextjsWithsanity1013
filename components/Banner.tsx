import React from 'react';

const Banner = () => {
  return (
    <div className="flex py-10  justify-between items-center bg-yellow-400 border-y border-black lg:py-20">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif">
          <span className="underline decoration-black decoration-4">
            Medium
          </span>
          is a place to write , red , and connect
        </h1>
        <h2>
          It&apos;s easy and free to post your thinking on any topic and connect
          with millions of readers.
        </h2>
      </div>

      <img
        className="p-10 hidden md:inline-flex h-32 lg:h-72 "
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png"
      />
    </div>
  );
};

export default Banner;
