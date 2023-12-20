import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import Timeline from "../components/timeline";
beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
const posts = [{
    id:"0",
    username: "alex",
    likes:[],
    comments: [],
    caption:"test",
    time_created: new Date().toDateString(),
    avatar:null,
    mediaList: [
        {id:"0", filename:"test1.jpg", type:"image", data:"data1"}
    ],
    whether_liked: false,
    whether_followed_post_user: false,
    whether_saved:false,
}]

test("Test timeline", async () => {
    render(<Router><Timeline posts={posts} onCreateComment={() => {}}/></Router>);
    const timeline = screen.queryByTestId("timeline");
    expect(timeline).toBeInTheDocument();
})

test("Test timeline with undefined posts", async () => {
    render(<Router><Timeline onCreateComment={() => {}}/></Router>);
    const timeline = screen.queryByTestId("timeline");
    expect(timeline).toBeInTheDocument();
})


