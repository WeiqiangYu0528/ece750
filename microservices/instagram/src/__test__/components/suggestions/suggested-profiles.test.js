import {render, screen} from "@testing-library/react";
import SuggestedProfiles from "../../../components/suggestions/suggested-profiles";
import userEvent from '@testing-library/user-event'
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

test("Show element when rendered", async () => {
    const recommendedUsers = [{username:"alex", avatar:null, fullname:"john"}]
    render(<Router><SuggestedProfiles recommendedUsers={recommendedUsers}/></Router>)
    const profiles = screen.getByTestId("profiles");
    expect(profiles).toBeInTheDocument();
})