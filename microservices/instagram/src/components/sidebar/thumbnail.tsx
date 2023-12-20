import React from "react";
import { thumbnailType } from "./sidebarType";

export default function Thumbnail(props: thumbnailType) {
  const firstMedia = React.useRef<any>();
  const lastMedia = React.useRef<any>();

  const handleScrollToFirstMedia = () => {
    firstMedia.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleScrollToLastMedia = () => {
    lastMedia.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <div
      className={`absolute bottom-16 right-10 py-4 bg-[#1a1a1acc] cursor-pointer text-neutral-500 z-10 font-bold h-1/5`}
      style={{ width: `${Math.min(100, 25 * props.media.length)}%` }}
    >
      <div className="absolute top-0 right-8 flex overflow-x-auto w-[85%] h-full p-2">
        {props.media.map((file, idx) => {
          return (
            <div key={file} className="relative flex ml-5">
              {props.mediaType[idx] === "image" ? (
                <img
                  onClick={() => props.setMediaIdx(idx)}
                  data-testid={"image" + idx}
                  ref={
                    idx === 0
                      ? firstMedia
                      : idx === props.media.length - 1
                      ? lastMedia
                      : null
                  }
                  src={file}
                  className="h-full object-cover max-w-none"
                />
              ) : (
                <video
                  controls={false}
                  className="h-full object-cover max-w-none"
                  onClick={() => props.setMediaIdx(idx)}
                  data-testid={"video" + idx}
                  ref={
                    idx === 0
                      ? firstMedia
                      : idx === props.media.length - 1
                      ? lastMedia
                      : null
                  }
                >
                  <source src={file} />
                </video>
              )}
              {idx === props.mediaIdx && (
                <button
                  data-testid={"thumbnail-delete-button" + idx}
                  onClick={props.handleDelete}
                  className="absolute top-1 right-1 text-sm z-10 text-white cursor-pointer bg-[#1a1a1acc] rounded-full px-1 py-1"
                >
                  <svg
                    aria-label="Delete"
                    color="rgb(255, 255, 255)"
                    fill="rgb(255, 255, 255)"
                    height="12"
                    role="img"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="21"
                      x2="3"
                      y1="3"
                      y2="21"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="21"
                      x2="3"
                      y1="21"
                      y2="3"
                    ></line>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
      {props.media.length > 4 && (
        <button
          data-testid="first-media-button"
          className="absolute top-[40%] left-[12%] text-sm z-10 text-black cursor-pointer bg-white rounded-full px-2 py-0.5 font-bold"
          onClick={handleScrollToFirstMedia}
        >
          &#10094;
        </button>
      )}
      {props.media.length > 4 && (
        <button
          data-testid="last-media-button"
          className="absolute top-[40%] right-[8%] text-sm z-10 text-black cursor-pointer bg-white rounded-full px-2 py-0.5 font-bold"
          onClick={handleScrollToLastMedia}
        >
          &#10095;
        </button>
      )}
      <div className="absolute top-2 right-2 w-5">
        <input
          type="file"
          className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
          onChange={props.handleFileChange}
          accept="image/*"
          multiple
        />
        <svg
          className="w-full h-full"
          aria-label="Plus icon"
          color="rgb(142, 142, 142)"
          fill="rgb(142, 142, 142)"
          height="22"
          role="img"
          viewBox="0 0 24 24"
          width="22"
        >
          <path d="M21 11.3h-8.2V3c0-.4-.3-.8-.8-.8s-.8.4-.8.8v8.2H3c-.4 0-.8.3-.8.8s.3.8.8.8h8.2V21c0 .4.3.8.8.8s.8-.3.8-.8v-8.2H21c.4 0 .8-.3.8-.8s-.4-.7-.8-.7z"></path>
        </svg>
      </div>
    </div>
  );
}
