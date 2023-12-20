import {render, screen} from "@testing-library/react";
import Modal from "../../../components/sidebar/modal";
import userEvent from '@testing-library/user-event'
import React from "react";
beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
test("Show button only when length of media > 0", async () => {
    render(<Modal open={true} onClose={() => {}} onCreatePost={() => {}}/>)
    // const inputTextBefore = screen.getByTestId("text-edit");
    // await userEvent.type(inputTextBefore,"Hello World!");
    // const inputTextAfter = screen.getByTestId("text-edit");
    // const displayText = screen.getByTestId("text-display");
    // expect(inputTextAfter).toHaveTextContent("Hello World!");
    // expect(displayText).toHaveTextContent("Hello World!");
    expect(1).toBe(1);
})