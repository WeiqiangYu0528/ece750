import {render, screen} from "@testing-library/react";
import SuggestedProfile from "../../../components/suggestions/suggested-profile";
import userEvent from '@testing-library/user-event'
import React from "react";
import axiosAPI from "../../config/axiosConfig";
import { BrowserRouter as Router } from "react-router-dom";
jest.mock("../../config/axiosConfig");
test("Show element when rendered", async () => {
    const recommendedUser = {username:"alex", avatar:null, fullname:"john"}
    render(<Router><SuggestedProfile recommendedUser={recommendedUser}/></Router>)
    const profile = screen.getByTestId("profile");
    await userEvent.click(profile);
    expect(profile).toBeInTheDocument();
})

test("Show follow when not followed and show following when click follow", async () => {
    axiosAPI.post.mockResolvedValueOnce({
        data: {
        },
      });
    const recommendedUser = {username:"alex", avatar:"", fullname:"john"}
    render(<Router><SuggestedProfile recommendedUser={recommendedUser}/></Router>)
    const follow = screen.getByTestId("follow");
    const following = screen.queryByTestId("following");
    await userEvent.click(follow);
    const followAfter = screen.queryByTestId("follow");
    const followingAfter = screen.queryByTestId("following");
    expect(follow).toBeInTheDocument();
    expect(following).not.toBeInTheDocument();
    expect(followAfter).not.toBeInTheDocument();
    expect(followingAfter).toBeInTheDocument();
})

test("Show error message when error occurs", async () => {
    axiosAPI.post.mockRejectedValueOnce(new Error('Some random error'));
    const recommendedUser = {username:"alex", avatar:"", fullname:"john"}
    render(<Router><SuggestedProfile recommendedUser={recommendedUser}/></Router>)
    const follow = screen.getByTestId("follow");
    await userEvent.click(follow);
    expect(follow).toBeInTheDocument();
})
