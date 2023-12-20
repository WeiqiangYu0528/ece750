import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import ModalDelete from "../../../components/post/modal-delete";
import axiosAPI from "../../config/axiosConfig";

beforeEach(() => {
  jest.spyOn(console, 'error')
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockImplementation(() => null);
});

afterEach(() => {
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockRestore()
})

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
    post_id: "0",
    open: true,
    setOpen: () => {},
    onDelete: () => {},
    onClose: () => {},
}

jest.mock("../../config/axiosConfig");

test("click cancel to close the modal", async () => {
    render(<ModalDelete {...data} />);
    const cancel = screen.queryByTestId("cancel");
    const deleteButton = screen.queryByTestId("delete");
    await userEvent.click(cancel);
    const deleteButtonAfterClick = screen.queryByTestId("delete");
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButtonAfterClick).toBeInTheDocument();
})

test("Click delete button successfully ", async () => {
  axiosAPI.delete.mockResolvedValueOnce({
    data: {}
  });
    render(<ModalDelete {...data} />);
    const deleteButton = screen.queryByTestId("delete");
    await userEvent.click(deleteButton);
    expect(deleteButton).toBeInTheDocument();
})

test("Click delete button with error ", async () => {
  axiosAPI.delete.mockRejectedValueOnce(new Error('Some random error'));
  render(<ModalDelete {...data} />);
  const deleteButton = screen.queryByTestId("delete");
  await userEvent.click(deleteButton);
  expect(deleteButton).toBeInTheDocument();
})

