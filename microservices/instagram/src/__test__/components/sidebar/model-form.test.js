import {render, screen} from "@testing-library/react";
import ModalForm from "../../../components/sidebar/modal-form";
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
  
test("change caption", async () => {
    render(<ModalForm caption="text caption" setCaption={() => {}} setHashtags={() => {}}/>)
    const inputTextBefore = screen.getByTestId("text-edit");
    await userEvent.type(inputTextBefore,"Hello World!");
    const inputTextAfter = screen.getByTestId("text-edit");
    const displayText = screen.getByTestId("text-display");
    expect(inputTextAfter).toHaveTextContent("Hello World!");
    expect(displayText).toHaveTextContent("Hello World!");
})