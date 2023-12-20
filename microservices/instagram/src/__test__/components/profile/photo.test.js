import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import Photo from "../../../components/profile/photo";
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }
};

const post = {
  id: "0",
  username: "alex",
  likes: [],
  comments: [],
  caption: "test",
  time_created: new Date().toDateString(),
  avatar: null,
  mediaList: [
    { id: "0", filename: "test1.jpg", type: "image", data: "data1" },
    { id: "1", filename: "test2.jpg", type: "image", data: "data2" },
  ],
  whether_liked: false,
  whether_followed_post_user: false,
  whether_saved: false,
  open: true,
};

test("photos component test", async () => {
  render(<Router><Photo post={post} onCreateComment={() => {}} /></Router>);
  const test_openMedia = screen.getByTestId(
    "test-openMedia"
  );
  await userEvent.click(test_openMedia);
  await userEvent.keyboard('{Escape}')
});
