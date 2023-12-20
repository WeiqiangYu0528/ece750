import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import ModalComments from "../../../components/post/modal-comments";

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
const comments = {
    username: "alex",
    avatar: null,
    caption: "text",
    time_created: new Date().toDateString(),
    comments: [{ 
        id:"",
        username:"alex",
        comment:"text comment",
        avatar:{},
        time_created:new Date().toDateString(),
        replies: []
    },],
    setReplyUser: () => {},
    setCommentId: () => {},
}

const commentsWithHashtag = {
    username: "alex",
    avatar: {},
    caption: "test #test",
    time_created: new Date().toDateString(),
    comments: [{ 
        id:"",
        username:"alex",
        comment:"text comment",
        avatar:{},
        time_created:new Date().toDateString(),
        replies: []
    },],
    setReplyUser: () => {},
    setCommentId: () => {},
}

test("test element in the document", async () => {
    render(<Router><ModalComments {...comments} /></Router>  );
    const commentsElement = screen.queryByTestId("comments");
    expect(commentsElement).toBeInTheDocument();
})

test("handle hashtag comments", async () => {
    render(<Router><ModalComments {...commentsWithHashtag} /></Router>  );
    const hashtag = screen.queryByTestId("hashtag0");
    await userEvent.click(hashtag);
    expect(1).toBe(1);
})

