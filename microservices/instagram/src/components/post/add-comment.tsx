import React, { useContext, useState, useRef, useEffect } from "react";
import { postAddComment } from "./postType";
import axiosAPI from "../../config/postConfig";
import UserContext from "../../contexts/user-context";
import ModalEmoji from "./modal-emoji";
import { EmojiClickData } from "emoji-picker-react";
export default function AddComment(props: postAddComment) {
  const [comment, setComment] = useState("");
  const { user } = useContext(UserContext);
  const [showEmoji, setShowEmoji] = useState(false);

  const positionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(props.replyUser !== ""){
      setComment("@" + props.replyUser + " ");
    }
  }, [props.replyUser]);

  const formData = new FormData();
  formData.append("comment", comment);
  const newComment = {
    username: user.username,
    id: props.id,
    comment: comment,
    reply: props.replyUser,
    commentId: props.commentId,
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setComment("");
    addComment();
  };

  async function addComment() {
    const response = await axiosAPI
      .post("/comment", newComment)
      .catch(function (err) {
        console.log(err);
      });
    props.onCreateComment();
  }

  return (
    <div className="border-b border-gray-primary relative" ref={positionRef}>
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div>
          <input
            data-testid="input-comment"
            type="text"
            aria-label="Add a comment"
            autoComplete="off"
            className="text-sm text-gray-base w-full mr-3 py-4 px-4 focus:outline-none"
            name="add-comment"
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            {comment !== "" && (
              <button
                style={{ color: "rgb(0, 149, 246)" }}
                className="text-sm font-bold text-blue-medium mr-1"
                data-testid="post-button"
                type="submit"
              >
                POST
              </button>
            )}
          </div>
          <div onClick={() => setShowEmoji(true)}>
            <svg
              aria-label="Emoji"
              data-testid="emoji"
              className="x1lliihq x1n2onr6"
              color="rgb(199, 199, 199)"
              fill="rgb(199, 199, 199)"
              height="13"
              role="img"
              viewBox="0 0 24 24"
              width="13"
            >
              <title>Emoji</title>
              <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
            </svg>
          </div>
        </div>
      </form>
      <ModalEmoji open={showEmoji} setOpen={setShowEmoji} comment={comment} setComment={setComment} pos_x = {positionRef.current?.offsetLeft} pos_y ={positionRef.current?.offsetTop}/>
    </div>
  );
}
