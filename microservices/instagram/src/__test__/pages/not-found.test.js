import {render, screen} from "@testing-library/react";
// import {screen} from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import NotFoundPage from "../../pages/not-found";

test("Test error page", async () => {
    render(<Router><NotFoundPage/></Router>);
    const element = screen.queryByTestId("not-found");
    const home = screen.queryByTestId("home");
    await userEvent.click(home);
    expect(element).toBeInTheDocument();
})


