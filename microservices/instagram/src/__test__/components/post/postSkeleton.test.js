import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";

import PostSkeleton from "../../../components/post/postSkeleton";
beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  

test("Test skeleton when loading", async () => {
    render(<PostSkeleton/>);
    const skeleton = screen.queryByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
})

