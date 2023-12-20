import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import ModalComment from "../../../components/post/modal-comment";
import exp from "constants";

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
const comment = {
    comment: { 
        id:"0",
        username:"alex",
        comment:"text comment",
        avatar:null,
        time_created:new Date().toDateString(),
        replies: null
    },
    setReplyUser: () => {},
    setCommentId: () => {},
}

const commentWithReply = {
    comment: { 
        id:"",
        username:"alex",
        comment:"text comment",
        avatar:null,
        time_created:new Date().toDateString(),
        replies: [
            { 
                id:"1",
                username:"bob",
                comment:"text comment 1",
                avatar:{},
                time_created:new Date().toDateString(),
                replies: []
            }
        ]
    },
    setReplyUser: () => {},
    setCommentId: () => {},
}

test("No reply button when no one replies", async () => {
    render(<ModalComment {...comment} />);
    const reply = screen.queryByTestId("reply-button");
    expect(reply).not.toBeInTheDocument();
})

test("Show correct context when user click reply button", async () => {
    render(<ModalComment {...commentWithReply} />);
    const reply = screen.queryByTestId("reply-button");
    const replyText = screen.queryByTestId("reply-text");
    expect(reply).toBeInTheDocument();
    expect(replyText).toHaveTextContent("View replies");
    await userEvent.click(reply);
    const replyTextAfterClick = screen.queryByTestId("reply-text");
    expect(replyTextAfterClick).toHaveTextContent("Hide replies");

})

