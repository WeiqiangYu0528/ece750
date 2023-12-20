import React, { useState, useRef, useEffect } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { postModalComments } from './postType'
import ModalComment from './modal-comment';
import { useNavigate } from 'react-router-dom';

export default function ModalComments(props: postModalComments) {
  const navigate = useNavigate();
  const texts = props.caption.split(/#\p{L}+/gu);
  const hashtags = props.caption.match(/#\p{L}+/gu);

  const handleHashtag = (e: any) => {
    navigate("/hashtags/" + e.target.innerText?.slice(1));
  };

  const caption = (
      <>
        {texts.map((text, idx) => (
          <span key={idx}>
            <span>{text}</span>
            {hashtags && <span className="hashtag cursor-pointer" data-testid={"hashtag"+idx} onClick={handleHashtag}>{hashtags[idx]}</span>}
          </span>
        ))}
      </>
    );

  const imgsrc = props.avatar === null ? "/images/avatars/default_avatar.jpg" : "data:image/png;base64, " + props.avatar.data;

  return (
    <div className="p-4 py-8 h-[95%] overflow-y-auto" data-testid="comments" >
      <div className="flex">
        <img className="rounded-full h-9 w-8 flex wr-3 pt-1" src={imgsrc} alt="" />
        <div className='pl-3'>
          <p>
            <span className="text-sm font-bold">{props.username}</span>
            <span className="text-sm ml-3">{caption}</span>
          </p>
          <p><span className="text-xs text-gray" >{formatDistanceToNowStrict(new Date(props.time_created))}</span></p>
        </div>
      </div>
      {props.comments && props.comments.map((comment) => {
            return <ModalComment key={comment.id} comment={comment} setReplyUser={props.setReplyUser} setCommentId={props.setCommentId} />
      })}
    </div>
  )
}