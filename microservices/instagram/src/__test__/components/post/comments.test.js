import {render, screen} from '@testing-library/react';
import Comment from '../../../components/post/comments';
import userEvent from "@testing-library/user-event"

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })

const comments = [{id: "0", username: "alex", avatar: "...", comment: "Test Comment", replies: [], time_created: "0"}]


test("no post button before comment", async () => {
    render(<Comment comments={comments} onExpandComments={() => {}} />);

    const username = screen.getByTestId("name0");
    const comment = screen.getByTestId("comment0");

    expect(username).toHaveTextContent("alex");
    expect(comment).toHaveTextContent("Test Comment");
});