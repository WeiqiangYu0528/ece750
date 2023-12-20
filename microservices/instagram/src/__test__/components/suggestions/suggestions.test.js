import {render, screen} from "@testing-library/react";
import Suggestions from "../../../components/suggestions/suggestions";
import { BrowserRouter as Router } from "react-router-dom";
test("Show element when rendered", async () => {
    const recommendedUsers = [{username:"alex", avatar:null, fullname:"john"}]
    render(<Router><Suggestions recommendedUsers={recommendedUsers}/></Router>)
    const suggestions = screen.getByTestId("suggestions");
    expect(suggestions).toBeInTheDocument();
})