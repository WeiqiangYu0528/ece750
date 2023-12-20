import {render, screen} from "@testing-library/react";
import User from "../../../components/suggestions/user";
import userEvent from '@testing-library/user-event'
import React from "react";

test("Show element when rendered", async () => {
    render(<User/>)
    const user = screen.getByTestId("user");
    expect(user).toBeInTheDocument();
})