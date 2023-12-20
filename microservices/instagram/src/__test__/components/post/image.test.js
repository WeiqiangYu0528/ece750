import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";

import Image from "../../../components/post/image";
beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
const mediaList = [{id:"0", filename:"test1.jpg", type:"image", data:"data1"},{id:"1", filename:"test2.mp4", type:"video", data:"data2"}]

test("Not show minus button for the first image", async () => {
    render(<Image mediaList={mediaList}/>);
    const minusButton = screen.queryByTestId("minus");
    const plusButton = screen.queryByTestId("plus");
    expect(minusButton).not.toBeInTheDocument();
    expect(plusButton).toBeInTheDocument();
})


test("Not show plus button for the last image", async () => {
    render(<Image mediaList={mediaList}/>);
    const plusButton = screen.queryByTestId("plus");
    await userEvent.click(plusButton);
    const minusButton = screen.queryByTestId("minus");
    const plusButtonAfterClick = screen.queryByTestId("plus");
    expect(minusButton).toBeInTheDocument();
    expect(plusButtonAfterClick).not.toBeInTheDocument();
})


test("Test minus button", async () => {
    render(<Image mediaList={mediaList}/>);
    const plusButton = screen.queryByTestId("plus");
    await userEvent.click(plusButton);
    const minusButton = screen.queryByTestId("minus");
    await userEvent.click(minusButton);
    const minusButtonAfterClick = screen.queryByTestId("minus");
    const plusButtonAfterClick = screen.queryByTestId("plus");
    expect(minusButtonAfterClick).not.toBeInTheDocument();
    expect(plusButtonAfterClick).toBeInTheDocument();
})