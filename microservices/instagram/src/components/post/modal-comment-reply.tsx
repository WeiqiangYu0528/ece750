import React, { useState } from "react";
import { postModalCommentReply } from "./postType";
import { formatDistanceToNowStrict } from "date-fns";

export default function ModalCommentReply(props: postModalCommentReply) {
  const [toggleLiked, setToggleLiked] = useState(false);
  const commentAvatar =
    props.comment.avatar === null
      ? "/images/avatars/default_avatar.jpg"
      : "data:image/png;base64, " + props.comment.avatar.data;

  const handleToggleLiked = () => {
    setToggleLiked(!toggleLiked);
  };

  const handleClickReply = () => {
    props.setReplyUser(props.comment.username);
    const commentId = props.commentId === undefined ? props.comment.id : props.commentId;
    props.setCommentId(commentId);
  };
  return (
    <div className={`items-center flex justify-between ${props.commentId !== undefined ? "mt-4" : "mt-8"}`}>
      <div className="flex">
        <img className="rounded-full h-9 w-8 wr-3 pt-1" src={commentAvatar} alt="" />
        <div className="pl-3">
          <p>
            <span className="text-sm font-bold">{props.comment.username}</span>
            <span className="text-sm ml-3">{props.comment.comment}</span>
          </p>
          <p>
            <span className="text-xs text-gray cursor-pointer">
              {formatDistanceToNowStrict(new Date(props.comment.time_created))}
            </span>
            <span className="text-xs ml-3 text-gray font-bold cursor-pointer">
              0 likes
            </span>
            <span
              className="text-xs ml-3 text-gray font-bold cursor-pointer"
              onClick={handleClickReply}
              data-testid={"reply"} 
            >
              Reply
            </span>
          </p>
        </div>
      </div>
      <div
        className="flex items-center"
      >
        <svg
          aria-label="like"
          data-testid="like-button"
          onClick={handleToggleLiked}
          className={`mr-2 w-8 select-none cursor-pointer focus:outline-none ${
            toggleLiked ? "fill-red-500 text-red-500" : "text-black"
          }`}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          height="12"
          role="img"
          viewBox="0 0 48 48"
          width="6"
        >
          <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
        </svg>
      </div>
    </div>
  );
}
