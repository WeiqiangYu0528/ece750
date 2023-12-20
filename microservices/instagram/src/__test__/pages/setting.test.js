import { render, screen } from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import Setting from "../../pages/setting";
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

test("setting page test", async () => {

  render(<BrowserRouter><Setting /></BrowserRouter>);

  const test_setOptionChange = screen.getByTestId("test-setOptionChange");
  await userEvent.click(test_setOptionChange);

  const test_setOptionEdit = screen.getByTestId("test-setOptionEdit");
  await userEvent.click(test_setOptionEdit);

});

test("sidebar test", async () => {

  render(<BrowserRouter><Setting /></BrowserRouter>);

  const test_setOptionChange = screen.getByTestId("test-setOptionChange");
  await userEvent.click(test_setOptionChange);

  const test_setOptionEdit = screen.getByTestId("test-setOptionEdit");
  await userEvent.click(test_setOptionEdit);

});