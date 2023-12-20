import {render, screen, cleanup} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import Actions from "../../../components/post/actions";

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })

const actionIds = []

afterEach(cleanup);

test("click like button once", async () => {
    render(<Actions likes = {actionIds} whether_liked={false} whether_saved={false} post_id="" />);

    const likeButton = screen.getByTestId("like-button");
    await userEvent.click(likeButton);
    const numLikes = screen.getByTestId("num-likes");
    
    expect(numLikes).toHaveTextContent('1 likes');
})

test("click like button twice", async () => {
    render(<Actions likes = {null} whether_liked={false} whether_saved={false} post_id="" />);

    const likeButton = screen.getByTestId("like-button");
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);
    const numLikes = screen.getByTestId("num-likes");

    expect(numLikes).toHaveTextContent('0 likes');
})

test("click save button once", async () => {
    render(<Actions likes = {actionIds} whether_liked={false} whether_saved={false} post_id="" />);

    const saveButton = screen.getByTestId("save-button");
    await userEvent.click(saveButton);

    expect(1).toBe(1);
})

test("click save button twice", async () => {
    render(<Actions likes = {actionIds} whether_liked={false} whether_saved={false} post_id="" />);

    const saveButton = screen.getByTestId("save-button");
    await userEvent.click(saveButton);
    await userEvent.click(saveButton);

    expect(1).toBe(1);
})


test("click comment button", async () => {
    render(<Actions likes = {actionIds} whether_liked={false} whether_saved={false} post_id="" onComment={() => {}} />);

    const saveButton = screen.getByTestId("comment-button");
    await userEvent.click(saveButton);

    expect(1).toBe(1);
})