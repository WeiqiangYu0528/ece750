import { postType } from "./post/postType"

export type timelineType =  {
    posts:postType[] | undefined,
    onCreateComment: () => void,
}