import {  mediaType } from "./postType";
export default function Media(props:mediaType) {
  return (
    <>
      {props.type === "image" ? (
        <img
          className="absolute h-full w-full object-cover"
          alt=""
          src={"data:image/png;base64," + props.data}
        />
      ) : (
        <video
          controls={props.controls}
          className="absolute h-full w-full object-cover"
        >
          <source src={"data:video/mp4;base64," + props.data} />
        </video>
      )}
    </>
  );
}
