import React, { useContext, useState } from "react";
import { postActions } from "./postType";
import axiosAPI from "../../config/userConfig";
import axiosAPI1 from "../../config/postConfig";
import UserContext from "../../contexts/user-context";
export default function Actions(props: postActions) {
  const numberOfLikes = props.likes === null ? 0 : props.likes.length;
  const [likes, setLikes] = useState(numberOfLikes);
  const [toggleLiked, setToggleLiked] = useState(props.whether_liked);
  const [toggleSaved, setToggleSaved] = useState(props.whether_saved);
  const { user } = useContext(UserContext);

  const handleToggleLiked = () => {
    if (toggleLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setToggleLiked((toggleLiked) => !toggleLiked);
  };

  async function handleClickSave() {
    const newSave = !toggleSaved;
    setToggleSaved(!toggleSaved);
    const data = {
      username: user.username,
      post_id: props.post_id,
      save: newSave,
    };
    await axiosAPI
      .post("/save", data)
      .catch(function (err) {
        console.error(err);
      });
  }

  async function handleClickLike() {
    const newLike = !toggleLiked;
    handleToggleLiked();
    const data = {
      username: user.username,
      post_id: props.post_id,
      like: newLike,
    };
    await axiosAPI1
      .post("/likes", data)
      .catch(function (err) {
        console.error(err);
      });
  }

  return (
    <>
      <div className="flex justify-between p-4">
        <div className="flex">
          <svg
            aria-label="like"
            data-testid="like-button"
            onClick={handleClickLike}
            className={`mr-2 w-8 select-none cursor-pointer focus:outline-none ${
              toggleLiked ? "fill-red-500 text-red-500" : "text-black-light"
            }`}
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            height="24"
            role="img"
            viewBox="0 0 48 48"
            width="24"
          >
            <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
          </svg>
          <svg
            onClick={() => props.onComment && props.onComment()}
            aria-label="Comment"
            data-testid="comment-button"
            className="mr-2 w-8 select-none cursor-pointer"
            color="#262626"
            fill="#262626"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
          <svg
            aria-label="Share Post"
            className="mr-2 w-8 select-none cursor-pointer"
            color="#262626"
            fill="#262626"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <line
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="22"
              x2="9.218"
              y1="3"
              y2="10.083"
            ></line>
            <polygon
              fill="none"
              points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></polygon>
          </svg>
        </div>
        <svg
          onClick={handleClickSave}
          aria-label="Save"
          data-testid="save-button"
          className={`mr-2 w-8 select-none cursor-pointer focus:outline-none ${
            toggleSaved ? "fill-black text-black-primary" : "text-black-light"
          }`}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
        </svg>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold" data-testid="num-likes">
          {likes} likes
        </p>
      </div>
    </>
  );
}
