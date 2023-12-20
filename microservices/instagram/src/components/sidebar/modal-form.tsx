import React, { useContext, useEffect, useRef } from "react";
import UserContext from "../../contexts/user-context";
import { modelFormType } from "./sidebarType";

export default function ModalForm(props: modelFormType) {
  const { user } = useContext(UserContext);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  const textEdiableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textEdiableRef.current !== null && textEdiableRef.current.addEventListener("input", () => handleKeyUp())
  },[]);
  

  const handleKeyUp = () => {
    textDisplayRef.current !== null && textEdiableRef.current !== null && (textDisplayRef.current.innerHTML = textEdiableRef.current.innerHTML.replace(/#\p{L}+/gu, "<span class='hashtag'>$&</span>"));
    textEdiableRef.current !== null && props.setCaption(textEdiableRef.current.innerText);
    textEdiableRef.current !== null && props.setHashtags(textEdiableRef.current.innerHTML.match(/#\p{L}+/gu));
  };

  return (
    <div className="flex col-span-1">
      <div className="p-4 w-full">
        <div className="flex">
          <img
            className="rounded-full h-8 w-8 flex wr-3 "
            src={user.avatar}
            alt=""
          />
          <p className="text-sm font-bold ml-3">{user.username}</p>
        </div>
        <div className="highLite">
          <div className="highLite_colors pt-3 focus:outline-none" ref={textDisplayRef} data-text="Write a caption..." contentEditable={false} data-testid="text-display"></div>
          <div className="highLite_editable pt-3 focus:outline-none" contentEditable={true}  ref={textEdiableRef} data-testid="text-edit"></div>
        </div>
      </div>
    </div>
  );
}
