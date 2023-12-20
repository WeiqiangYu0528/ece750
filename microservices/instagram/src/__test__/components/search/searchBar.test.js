import { render, screen,fireEvent,waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import axiosAPI from "../../config/axiosConfig";
import SearchResultCard from "../../../components/search/searchResultCard";
import SearchBar from "../../../components/search/searchBar";

jest.mock("../../config/axiosConfig");

const testSearchResult1=[
    {
        userName : "xielin",
        avatarURL:null,
        isFollowing:true
    },
    {
        userName : "xie",
        avatarURL:null,
        isFollowing:false
    }

];


const setSearchBarBuffer = (bufferString)=>{
    return bufferString;
};

test("Load and display searchBar", async () => {
});



