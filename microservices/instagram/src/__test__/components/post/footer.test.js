import {render, screen} from '@testing-library/react';
import Footer from '../../../components/post/footer';
import userEvent from "@testing-library/user-event"
import {BrowserRouter as Router} from 'react-router-dom';
import exp from 'constants';

beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
  
test("caption with no hashtag", async () => {
    render(<Router><Footer username="alex" caption="Hello World" /></Router>);

    const username = screen.getByTestId("username");
    const caption = screen.getByTestId("caption");

    expect(username).toHaveTextContent("alex");
    expect(caption).toHaveTextContent("Hello World");
});

test("caption with hashtag", async () => {
    render(<Router><Footer username="alex" caption="Hello World #test"/></Router>);
    const caption = screen.getByTestId("caption");
    const hashtag = screen.getByTestId("hashtag0");
    await userEvent.click(hashtag);
    expect(caption).toHaveTextContent("#test");
});