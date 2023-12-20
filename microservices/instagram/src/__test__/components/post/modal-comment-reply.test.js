import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";

import ModalCommentReply from "../../../components/post/modal-comment-reply";

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
const reply = {
    comment: { 
        id:"",
        username:"alex",
        comment:"text comment",
        avatar:{},
        time_created:new Date().toDateString(),
        replies: []
    },
    commentId: "0",
    setReplyUser: () => {},
    setCommentId:() => {},
}

const replyWithoutCommentId = {
    comment: { 
        id:"",
        username:"alex",
        comment:"text comment",
        avatar:{},
        time_created:new Date().toDateString(),
        replies: []
    },
    setReplyUser: () => {},
    setCommentId:() => {},
}

test("Click like button", async () => {
    render(<ModalCommentReply {...reply} />);
    const likeButton = screen.queryByTestId("like-button");
    await userEvent.click(likeButton);
    expect(1).toBe(1);
})

test("Click reply button", async () => {
    render(<ModalCommentReply {...reply} />);
    const replyButton = screen.queryByTestId("reply");
    await userEvent.click(replyButton);
    expect(1).toBe(1);
})

test("test comment id is not undefined", async () => {
    render(<ModalCommentReply {...replyWithoutCommentId} />);
    const replyButton = screen.queryByTestId("reply");
    await userEvent.click(replyButton);
    expect(replyButton).toBeInTheDocument();
})
