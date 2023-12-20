import React, { useRef, useEffect } from "react";
import { postFooter } from "./postType";
import { useNavigate } from "react-router-dom";

export default function Footer(props: postFooter) {
  const navigate = useNavigate();
  const texts = props.caption.split(/#\p{L}+/gu);
  const hashtags = props.caption.match(/#\p{L}+/gu);

  const handleHashtag = (e: any) => {
    navigate("/hashtags/" + e.target.innerText?.slice(1));
  };

  const caption =(
      <div className="inline">
        {texts.map((text, idx) => (
          <div className="inline" key={idx}>
            <span>{text}</span>
            {hashtags && <span className="hashtag cursor-pointer" data-testid={"hashtag"+idx} onClick={handleHashtag}>{hashtags[idx]}</span>}
          </div>
        ))}
      </div>
    );

  return (
    <div className="p-4 pt-2 pb-0">
      <span data-testid="username" className="mr-1 font-bold" >{props.username}</span>
      <span data-testid="caption" >{caption}</span>
    </div>
  );
}
