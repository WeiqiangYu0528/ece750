import React, { useState } from "react";
import { postComment, postModalComment } from "./postType";
import ModalCommentReply from "./modal-comment-reply";
export default function ModalComment(props: postModalComment) {
  const [showReply, setShowReply] = useState(false);
  return (
    <div>
      <ModalCommentReply
        comment={props.comment}
        setCommentId={props.setCommentId}
        setReplyUser={props.setReplyUser}
      />
      <div className="mt-2">
        {props.comment.replies !== null && (
          <div>
            <p
              className="flex items-center cursor-pointer"
              onClick={() => setShowReply(!showReply)}
              data-testid="reply-button"
            >
              <span className="border-b-[1px] border-solid border-gray ml-12 w-6 inline"></span>
              <span className="text-xs ml-3 text-gray font-bold " data-testid="reply-text">
                {showReply ? "Hide replies" : "View replies"} (
                {props.comment.replies.length})
              </span>
            </p>
            {showReply && (
              <div className="ml-12">
                {props.comment.replies.map((reply: postComment) => (
                  <ModalCommentReply
                    key={reply.id}
                    comment={reply}
                    commentId={props.comment.id}
                    setCommentId={props.setCommentId}
                    setReplyUser={props.setReplyUser}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
