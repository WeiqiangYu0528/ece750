import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import Modal from "../../../components/post/modal";
import handleClose from "../../../__mocks__/modal";

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
  

const data = {
    id:"0",
    username: "alex",
    likes:[],
    comments: [],
    caption:"test",
    time_created: new Date().toDateString(),
    avatar:null,
    mediaList: [{id:"0", filename:"test1.jpg", type:"image", data:"data1"},{id:"1", filename:"test2.jpg", type:"image", data:"data2"}],
    whether_liked: false,
    whether_followed_post_user: false,
    whether_saved:false,
    open:true,
    onClose: () => {},
    onCreateComment: () => {},
}

test("Show prev button iff media id is greater than 1", async () => {
    render(<Router><Modal {...data} handleClose={handleClose}/></Router>);
    const next = screen.queryByTestId("next");
    const prev = screen.queryByTestId("prev");
    expect(prev).not.toBeInTheDocument();

    await userEvent.click(next);
    const prevAfterClick = screen.queryByTestId("prev");
    expect(prevAfterClick).toBeInTheDocument();

    await userEvent.click(prevAfterClick);
    const prevAfterClick2 = screen.queryByTestId("prev");
    expect(prevAfterClick2).not.toBeInTheDocument();

})

test("Show next button when media id is not the last index", async () => {
    render(<Router><Modal {...data} handleClose={handleClose}/></Router>);
    const next = screen.queryByTestId("next");
    expect(next).toBeInTheDocument();

    await userEvent.click(next);
    const nextAfterClick = screen.queryByTestId("next");
    expect(nextAfterClick).not.toBeInTheDocument();
})