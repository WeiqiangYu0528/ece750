import React, { useState } from "react";
import { postType } from "../post/postType";
import PostModal from "../post/modal";
import Media from "../post/media";

export default function Photo({
  post,
  onCreateComment,
}: {
  post: postType;
  onCreateComment: () => void;
}) {
  const [open, setOpen] = useState(false);
  const media = post.mediaList[0];

  return (
    <div className="relative bg-black pb-[100%] col-span-1" key={post.id}>
      <div data-testid={"test-openMedia"} onClick={() => setOpen(true)}>
        <Media type={media.type} data={media.data} controls={false} />
      </div>
      <div className="absolute bottom-0 left-0  z-10 w-full justify-evenly items-center h-full bg-neutral-800/50 group-hover:flex hidden">
        <p className="flex items-center text-white font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-8 mr-4"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          {/* {post?.likes} */}
        </p>

        <p className="flex items-center text-white font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-8 mr-4"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          {post.comments?.length}
        </p>
      </div>
      <PostModal
        id={post.id}
        open={open}
        username={post.username}
        caption={post.caption}
        likes={post.likes}
        whether_liked={post.whether_liked}
        whether_saved={post.whether_saved}
        whether_followed_post_user={post.whether_followed_post_user}
        avatar={post.avatar}
        time_created={post.time_created}
        comments={post.comments}
        mediaList={post.mediaList}
        onClose={() => setOpen(false)}
        onCreateComment={onCreateComment}
      />
    </div>
  );
}
