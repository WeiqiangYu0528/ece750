import {render, screen} from '@testing-library/react';
import AddComment from '../../../components/post/add-comment';
import userEvent from "@testing-library/user-event"
import axiosAPI from "../../config/axiosConfig";
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
  
    observe() {
      return null;
    }
  
    disconnect() {
      return null;
    };
  
    unobserve() {
      return null;
    }
  };

  beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })

test("no post button before comment", async () => {
    render(<AddComment id="0" username="alex" avatar="..." replyUser='' commentId='1'/>);

    const postButtonBeforeComment = screen.queryByTestId("post-button");

    expect(postButtonBeforeComment).not.toBeInTheDocument();
});


test("appear post button after comment", async () => {
    render(<AddComment id="0" username="alex" avatar="..." replyUser='' commentId='1'/>);

    const inputComment = screen.getByTestId("input-comment");
    await userEvent.type(inputComment,"Test Comment");
    const postButtonAfterComment = screen.queryByTestId("post-button");

    expect(postButtonAfterComment).toBeInTheDocument();
});

test("show emoji", async () => {
    render(<AddComment id="0" username="alex" avatar="..." replyUser='' commentId='1'/>);

    const emojiButton = screen.getByTestId("emoji");
    await userEvent.click(emojiButton);
    const emojiModal = screen.queryByTestId("emoji-modal");

    expect(emojiModal).toBeInTheDocument();
});

jest.mock("../../config/axiosConfig");
test("test submit button", async () => {
    axiosAPI.post.mockRejectedValueOnce(new Error('Some random error'))
    render(<AddComment id="0" username="alex" avatar="..." replyUser='bob' commentId='1' onCreateComment={() => {}}/>);

    const postButton = screen.queryByTestId("post-button");
    await userEvent.click(postButton);
    const inputComment = screen.getByTestId("input-comment");

    expect(inputComment).toHaveTextContent("");
});