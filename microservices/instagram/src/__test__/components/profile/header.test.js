import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import axiosAPI from "../../config/axiosConfig";
import UserContext from "../../../contexts/user-context";
import Header from "../../../components/profile/header";
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

jest.mock("../../config/axiosConfig");
test("editProfile", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: {},
  });
  render(
    <BrowserRouter>
      <Header
        isUserSelf={true}
        postCount={3}
        username={"alex"}
        fullname="abc"
        setAvatar={() => {}}
        avatar={"sbc"}
        followers={users}
        following={users}
        currentFollowing={users}
      />
    </BrowserRouter>
  );
  const test_navigateSetting = screen.getByTestId("test-navigateSetting");
  await userEvent.click(test_navigateSetting);

  const test_handleClickFollower = screen.getByTestId(
    "test-handleClickFollower"
  );
  await userEvent.click(test_handleClickFollower);

  const test_handleClickFollowing = screen.getByTestId(
    "test-handleClickFollowing"
  );
  await userEvent.click(test_handleClickFollowing);

  const test_setAvatarOpen = screen.getByTestId("test-setAvatarOpen");
  await userEvent.click(test_setAvatarOpen);

  const test_setUserOpen = screen.getByTestId("test-setUserOpen");
  await userEvent.click(test_setUserOpen);

  await userEvent.click(test_handleClickFollowing);

  userEvent.keyboard("{esc}");
});

test("editProfile2", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: {},
  });
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));
  axiosAPI.post.mockResolvedValueOnce({
    data: {},
  });
  axiosAPI.post.mockRejectedValueOnce(new Error("Some random error"));
  render(
    <BrowserRouter>
      <Header
        isUserSelf={false}
        postCount={3}
        username={"alex"}
        fullname="abc"
        setAvatar={() => {}}
        avatar={""}
        followers={users}
        following={users}
        currentFollowing={users}
      />
    </BrowserRouter>
  );

  const test_handleClickFollower = screen.getByTestId(
    "test-handleClickFollower"
  );
  await userEvent.click(test_handleClickFollower);

  const test_setUserOpen = screen.getByTestId("test-setUserOpen");
  await userEvent.click(test_setUserOpen);

  const test_Following = screen.getByTestId("test-Following");
  await userEvent.click(test_Following);
  await userEvent.click(test_Following);
  await userEvent.click(test_Following);
  await userEvent.click(test_Following);
});

test("editProfile3", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: { res: { data: "abc" } },
  });
  const user = { username: "alex", avatar: "", fullname: "" };
  render(
      <UserContext.Provider value={{ user: user, setUser: () => {} }}>
         <BrowserRouter>
      <Header
        isUserSelf={false}
        postCount={3}
        username={"alex"}
        fullname="abc"
        setAvatar={() => {}}
        avatar={""}
        followers={users}
        following={users}
        currentFollowing={users}
      />
    </BrowserRouter>
      </UserContext.Provider>
  );
});

test("editProfile4", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: { res: { data: "abc" } },
  });
  const user = { username: "alex", avatar: "", fullname: "" };
  render(
      <UserContext.Provider value={{ user: user, setUser: () => {} }}>
         <BrowserRouter>
      <Header
        isUserSelf={false}
        postCount={3}
        username={"alex"}
        fullname="abc"
        setAvatar={() => {}}
        avatar={""}
        followers={null}
        following={null}
        currentFollowing={users}
      />
    </BrowserRouter>
      </UserContext.Provider>
  );

  const test_handleClickFollower = screen.getByTestId(
    "test-handleClickFollower"
  );
  await userEvent.click(test_handleClickFollower);

  const test_handleClickFollowing = screen.getByTestId(
    "test-handleClickFollowing"
  );
  await userEvent.click(test_handleClickFollowing);
});