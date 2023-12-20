import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import axiosAPI from "../../config/axiosConfig";

import AvatarModal from "../../../components/profile/avatarModal";
import UserContext from "../../../contexts/user-context";
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
test("avatar modal test", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: { res: { data: "abc" } },
  });

  render(
    <AvatarModal
      isUserSelf={true}
      isOpen={true}
      onClose={() => {}}
      setAvatar={() => {}}
    />
  );

  const test_upload = screen.getByTestId("test-upload");

  const file = new File(["hello"], "hello.png", { type: "image/png" });

  await userEvent.upload(test_upload, file);

  expect(test_upload.files[0]).toStrictEqual(file);
});

test("avatar modal test 2", async () => {
  axiosAPI.post.mockResolvedValueOnce({
    data: { res: { data: "abc" } },
  });

  render(
    <AvatarModal
      isUserSelf={false}
      isOpen={true}
      onClose={() => {}}
      setAvatar={() => {}}
    />
  );

  const test_upload = screen.getByTestId("test-upload");

  const file = new File(["hello"], "hello.png", { type: "image/png" });

  await userEvent.upload(test_upload, file);

  expect(test_upload.files[0]).toStrictEqual(file);
});
