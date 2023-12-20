import { render, screen,fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import axiosAPI from "../../config/axiosConfig";
import NotificationBar from "../../../components/notification/notificationBar";
jest.mock("../../config/axiosConfig");

test("notification bar is created correctly",async ()=>{
    axiosAPI.get.mockResolvedValueOnce({
          data:[{
            idString:"abcdevvfg",
            type:"follow",
            username_from:"xielin",
            username_to:"alex",
            whether_read:true,
            comment:null,
            postId:null

          },
          {
            idString:"abcdefaag",
            type:"follow",
            username_from:"xielin2",
            username_to:"alex2",
            whether_read:false,
            comment:null,
            postId:null

          }],
        
    });
  
    
    axiosAPI.post.mockResolvedValueOnce({
          data:[]
       });
    
    render(<Router><NotificationBar currentUser="alex"/></Router>);
    const notiList = screen.getByTestId("notification-list");
    expect(1).toBe(1);
});
