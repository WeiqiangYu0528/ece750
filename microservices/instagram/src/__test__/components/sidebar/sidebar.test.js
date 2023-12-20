import {render, screen} from '@testing-library/react';
import Sidebar from '../../../components/sidebar/sidebar';
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom';
import 'intersection-observer';
beforeEach(() => {
    jest.spyOn(console, 'error')
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });
  
afterEach(() => {
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockRestore()
  })
test("click the search button and show search bar", async () => {
    render(<Router><Sidebar onCreatePost={() => {}}/></Router>);
    const searchButton = screen.getByTestId("search");
    const searchBar = screen.queryByTestId("search-bar");
    await userEvent.click(searchButton);
    const searchBarAfter = screen.queryByTestId("search-bar");
    expect(searchBar).not.toBeInTheDocument();
    expect(searchBarAfter).toBeInTheDocument();
})

test("click the notification button and show notification bar", async () => {
  render(<Router><Sidebar onCreatePost={() => {}}/></Router>);
  const notificationButton = screen.getByTestId("notification");
  const notificationBar = screen.queryByTestId("notification-bar");
  await userEvent.click(notificationButton);
  const notificationBarAfter = screen.queryByTestId("notification-bar");
  expect(notificationBar).not.toBeInTheDocument();
  expect(notificationBarAfter).toBeInTheDocument();
})
