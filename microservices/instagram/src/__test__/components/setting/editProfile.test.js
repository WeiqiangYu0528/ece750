import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import axiosAPI from "../../config/axiosConfig";
import UserContext from "../../../contexts/user-context";
import userEvent from "@testing-library/user-event";

import EditProfile from "../../../components/setting/editProfile";
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

jest.mock("../../config/axiosConfig");
test("photos component test", async () => {
  axiosAPI.get.mockResolvedValueOnce({
    data: {
      fullname: "alex",
      avatar: "123",
      phoneNumber: "1234567890",
      gender: "",
    },
  });

  axiosAPI.post.mockResolvedValueOnce({
    data: {},
  });

  const user = { username: "123", avatar: "", fullname: "" };
  render(
    <UserContext.Provider value={{ user: user, setUser: () => {} }}>
      <EditProfile />
    </UserContext.Provider>
  );

  const test_updateUser = screen.getByTestId("test-updateUser");
  await userEvent.click(test_updateUser);

  const test_setIsAlert = screen.getByTestId("test-setIsAlert");
  await userEvent.click(test_setIsAlert);

  const test_setName = screen.getByTestId("test-setName");
  await userEvent.type(test_setName, "abc");

  const test_setEmail = screen.getByTestId("test-setEmail");
  await userEvent.type(test_setEmail, "abc");

  const test_setPhone = screen.getByTestId("test-setPhone");
  await userEvent.type(test_setPhone, "abc");

  const test_setGenderMale = screen.getByTestId("test-setGenderMale");
  await userEvent.click(test_setGenderMale);

  const test_setGenderFemale = screen.getByTestId("test-setGenderFemale");
  await userEvent.click(test_setGenderFemale);

  const test_setGenderPrivacy = screen.getByTestId("test-setGenderPrivacy");
  await userEvent.click(test_setGenderPrivacy);

  const test_setAvatarOpen = screen.getByTestId("test-setAvatarOpen");
  await userEvent.click(test_setAvatarOpen);

  await userEvent.keyboard("{Escape}");
});

test("photos component test 2", async () => {
  axiosAPI.get.mockResolvedValueOnce({
    data: { fullname: "alex", avatar: null, phoneNumber: null, gender: null },
  });

  axiosAPI.post.mockResolvedValueOnce({
    data: {},
  });

  const user = { username: "123", avatar: "", fullname: "" };
  render(
    <UserContext.Provider value={{ user: user, setUser: () => {} }}>
      <EditProfile />
    </UserContext.Provider>
  );
});
