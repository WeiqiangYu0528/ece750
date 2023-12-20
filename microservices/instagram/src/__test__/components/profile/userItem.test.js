import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import axiosAPI from "../../config/axiosConfig"
import userEvent from "@testing-library/user-event";

import UserItem from "../../../components/profile/userItem";
import { BrowserRouter } from "react-router-dom";

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

const users = [
  {
    username: "alex",
    fullname: "alex",
    avatar: {
      id: "abc123",
      filename: "sssss",
      data: "avatardata",
      type: "avatartype",
    },
    following: false,
    followingType: false,
  },
  {
    username: "alex",
    fullname: "alex",
    avatar: {
      id: "abc123",
      filename: "sssss",
      data: "avatardata",
      type: "avatartype",
    },
    following: false,
    followingType: true,
  },
];



jest.mock("../../config/axiosConfig")
test("userItem component test", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data:{}
  })
  axiosAPI.post.mockResolvedValueOnce({
    data:{}
  })

  const userItem = {
    username: "alice",
    fullname:"alice",
    avatar: { id: "0", filename: "test1.jpg", type: "image", data: "data1" },
    following:false,
    followingType: false,
    onClose:() => {},
    currentFollowing:users
  }

  render(<BrowserRouter><UserItem {...userItem} /></BrowserRouter>);
  const test_handleClickFollow = screen.getByTestId(
    "test-handleClickFollow"
  );
  await userEvent.click(test_handleClickFollow);

  const test_handleClickRemove = screen.getByTestId(
    "test-handleClickRemove"
  );
  await userEvent.click(test_handleClickRemove);
});

test("userItem component test 2", async () => {
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  const userItem = {
    username: "alice",
    fullname:"alice",
    avatar: { id: "0", filename: "test1.jpg", type: "image", data: "data1" },
    following:false,
    followingType: false,
    onClose:() => {},
    currentFollowing:users
  }

  render(<BrowserRouter><UserItem {...userItem} /></BrowserRouter>);

  const test_handleClickFollow = screen.getByTestId(
    "test-handleClickFollow"
  );
  await userEvent.click(test_handleClickFollow);

  const test_handleClickRemove = screen.getByTestId(
    "test-handleClickRemove"
  );
  await userEvent.click(test_handleClickRemove);

  const test_handleNavigate = screen.getByTestId(
    "test-handleNavigate"
  );
  await userEvent.click(test_handleNavigate);
});

test("userItem component test 3", async () => {
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  const userItem = {
    username: "alice",
    fullname:"alice",
    avatar:null,
    following:false,
    followingType: true,
    onClose:() => {},
    currentFollowing:users
  }

  render(<BrowserRouter><UserItem {...userItem} /></BrowserRouter>);
  const test_handleClickEvent = screen.getByTestId(
    "test-handleClickEvent"
  );
  await userEvent.click(test_handleClickEvent);
});

test("userItem component test 4", async () => {
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));

  const userItem = {
    username: "alex",
    fullname:"alex",
    avatar:null,
    following:false,
    followingType: true,
    onClose:() => {},
    currentFollowing:users
  }

  render(<BrowserRouter><UserItem {...userItem} /></BrowserRouter>);
  const test_handleClickEvent = screen.getByTestId(
    "test-handleClickEvent"
  );
  await userEvent.click(test_handleClickEvent);
});
