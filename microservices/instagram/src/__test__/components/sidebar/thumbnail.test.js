import {render, screen} from '@testing-library/react';
import React from 'react';
import Thumbnail from '../../../components/sidebar/thumbnail';
import userEvent from '@testing-library/user-event'
import * as refMock from "../../../__mocks__/scrollLastMedia";

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
const data = {
    media: ["media1", "media2"],
    mediaType: ["image", "image"],
    mediaIdx: 0,
    setMediaIdx: () => {},
    handleDelete: () => {},
    handleFileChange: () => {},
}

const dataWithMoreMedia = {
    media: ["media1", "media2","media3", "media4","media5", "media6"],
    mediaType: ["video", "image","video", "image","image", "video"],
    mediaIdx: 0,
    setMediaIdx: () => {},
    handleDelete: () => {},
    handleFileChange: () => {},
}

test("Only show delete button when image is selected", () => {
    
    //arange
    render(<Thumbnail {...data}/>);
    //act
    const firstDeleteButton = screen.queryByTestId("thumbnail-delete-button0");
    const secondDeleteButton = screen.queryByTestId("thumbnail-delete-button1");
    const firstMediaButton = screen.queryByTestId("first-media-button");
    const LastMediaButton = screen.queryByTestId("last-media-button");
    //assert
    expect(firstDeleteButton).toBeInTheDocument();
    expect(secondDeleteButton).not.toBeInTheDocument();
    expect(firstMediaButton).not.toBeInTheDocument();
    expect(LastMediaButton).not.toBeInTheDocument();
});

test("Not show first/last media button when media is less than 4", async () => {
    //arange
    render(<Thumbnail {...data}/>);
    //act
    const firstMediaButton = screen.queryByTestId("first-media-button");
    const LastMediaButton = screen.queryByTestId("last-media-button");
    //assert
    expect(firstMediaButton).not.toBeInTheDocument();
    expect(LastMediaButton).not.toBeInTheDocument();
})


test("Show different media when selected", async () => {
    //arange
    render(<Thumbnail {...dataWithMoreMedia}/>);
    //act
    const image = screen.queryByTestId("image1");
    const video = screen.queryByTestId("video0");
    await userEvent.click(image);
    await userEvent.click(video);
    //assert
    expect(image).toBeInTheDocument();
    expect(video).toBeInTheDocument();
})