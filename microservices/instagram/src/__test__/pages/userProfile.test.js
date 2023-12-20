import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import axiosAPI from "../../config/axiosConfig";
import * as ROUTES from '../../constants/routes'

import UserProfile from "../../pages/userProfile";
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


jest.mock("../../config/axiosConfig");
test("user profile page test", async () => {
  axiosAPI.get.mockResolvedValueOnce({
    data: {
      fullname: "alex",
      avatar: "123",
      phoneNumber: "1234567890",
      gender: "",
      posts:null,
      followers:users,
      following:users
    },
  });

  render(<BrowserRouter path={ROUTES.PROFILE}><UserProfile /></BrowserRouter>);
 
});

test("user profile page test 2", async () => {
  axiosAPI.get.mockResolvedValueOnce({
    data: {
      fullname: "alex",
      avatar: null,
      phoneNumber: "1234567890",
      gender: "",
      posts:[post],
      followers:users,
      following:users
    },
  });

  render(<BrowserRouter path={ROUTES.PROFILE}><UserProfile /></BrowserRouter>);
 
});
