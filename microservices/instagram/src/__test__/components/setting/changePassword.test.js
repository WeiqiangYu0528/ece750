import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import axiosAPI from "../../config/axiosConfig";
import userEvent from "@testing-library/user-event";
import UserContext from "../../../contexts/user-context";

import ChangePassword from "../../../components/setting/changePassword";
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
test("changePassword component test", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: { sign: 1 },
  });
  const user = { username: "123", avatar: "123", fullname: "123" };
  render(
    <UserContext.Provider value={{ user: user, setUser: () => {} }}>
      <ChangePassword />
    </UserContext.Provider>
  );

  const test_setIsAlert = screen.getByTestId("test-setIsAlert");
  await userEvent.click(test_setIsAlert);

  const test_setOldPwd = screen.getByTestId("test-setOldPwd");
  await userEvent.type(test_setOldPwd, "abc");

  const test_setNewPwd = screen.getByTestId("test-setNewPwd");
  await userEvent.type(test_setNewPwd, "abc");

  const test_setNewPwdConf = screen.getByTestId("test-setNewPwdConf");

  await userEvent.type(test_setNewPwdConf, "abc");

  const test_changePwd = screen.getByTestId("test-changePwd");
  await userEvent.click(test_changePwd);

  await userEvent.type(test_setNewPwd, "abcdef");

  await userEvent.click(test_changePwd);
});

test("changePassword component test 2", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: { sign: 2 },
  });

  const user = { username: "123", avatar: "123", fullname: "123" };
  render(
    <UserContext.Provider value={{ user: user, setUser: () => {} }}>
      <ChangePassword />
    </UserContext.Provider>
  );

  const test_changePwd = screen.getByTestId("test-changePwd");
  await userEvent.click(test_changePwd);
});


test("changePassword fail test", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: {  sign: 1  },
  });

  const user = {username:"123", avatar:"123", fullname:"123"}
  render(<UserContext.Provider value={{ user:user , setUser: ()=>{}}}>
    <ChangePassword />
  </UserContext.Provider>);

  const test_setNewPwd = screen.getByTestId("test-setNewPwd");
  await userEvent.type(test_setNewPwd,"abcdef")

  const test_setNewPwdConf = screen.getByTestId("test-setNewPwdConf");
  await userEvent.type(test_setNewPwdConf,"abc")

  const test_changePwd = screen.getByTestId(
    "test-changePwd"
  );

  await userEvent.click(test_changePwd);
});