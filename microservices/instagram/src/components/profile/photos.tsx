/* eslint-disable no-nested-ternary */
import Skeleton from "react-loading-skeleton";
import { postType, postImage } from "../post/postType";
import Photo from "./photo";

export default function Photos({
  isUserSelf,
  isProfilePage,
  posts,
  onCreateComment,
  onClickSave,
}: {
  isUserSelf: boolean;
  isProfilePage: boolean;
  posts: postType[];
  onCreateComment: () => {};
  onClickSave: any;
}) {

  return (
    <div className="h-full border-t border-gray-primary mt-12 pt-4">
      <div className={`flex items-center justify-center flex-row ${isProfilePage?"":"hidden"}`}>
        <div className="flex items-center justify-center flex-row cursor-pointer" onClick={onCreateComment}>
          <svg
            aria-label=""
            color="rgb(38, 38, 38)"
            fill="rgb(38, 38, 38)"
            height="16"
            role="img"
            viewBox="0 0 24 24"
            width="16"
          >
            <rect
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              width="18"
              x="3"
              y="3"
            ></rect>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="9.015"
              x2="9.015"
              y1="3"
              y2="21"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="14.985"
              x2="14.985"
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
              y1="9.015"
              y2="9.015"
            ></line>
            <line
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="21"
              x2="3"
              y1="14.985"
              y2="14.985"
            ></line>
          </svg>
          <span className="mr-10 ml-1">POSTS</span>
        </div>
        <div className="flex items-center justify-center flex-row cursor-pointer">
          {isUserSelf ? (
            <div onClick={onClickSave} className="inline flex items-center">
              <svg
                aria-label=""
                color="rgb(142, 142, 142)"
                fill="rgb(142, 142, 142)"
                height="16"
                role="img"
                viewBox="0 0 24 24"
                width="16"
              >
                <polygon
                  fill="none"
                  points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></polygon>
              </svg>
              <span className="mr-10 ml-1">SAVED</span>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex items-center justify-center flex-row cursor-pointer">
          <svg
            aria-label=""
            color="rgb(142, 142, 142)"
            fill="rgb(142, 142, 142)"
            height="16"
            role="img"
            viewBox="0 0 24 24"
            width="16"
          >
            <path
              d="M10.201 3.797 12 1.997l1.799 1.8a1.59 1.59 0 0 0 1.124.465h5.259A1.818 1.818 0 0 1 22 6.08v14.104a1.818 1.818 0 0 1-1.818 1.818H3.818A1.818 1.818 0 0 1 2 20.184V6.08a1.818 1.818 0 0 1 1.818-1.818h5.26a1.59 1.59 0 0 0 1.123-.465Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <path
              d="M18.598 22.002V21.4a3.949 3.949 0 0 0-3.948-3.949H9.495A3.949 3.949 0 0 0 5.546 21.4v.603"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
            <circle
              cx="12.072"
              cy="11.075"
              fill="none"
              r="3.556"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></circle>
          </svg>
          <span className="ml-1">TAGGED</span>
        </div>
      </div>

      <div>
        {posts === null ? (
          <div className="w-full text-center font-bold pt-32">
            <p>Share Photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 mt-4 mb-12">
            { posts.map((post) => (
                  <Photo key={post.id} post={post} onCreateComment={onCreateComment} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
}
// Photos.propTypes = {
//   photos: PropTypes.array,
// };
