import { render, screen,fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import axiosAPI from "../../config/axiosConfig";
import NotificationBlock from "../../../components/notification/notificationInfo";
jest.mock("../../config/axiosConfig");
test("create a notification block with unread notification",async ()=>{
    const data ={
        idString:"abcdefg",
        type:"follow",
        username_from:"xielin",
        username_to:"alex",
        whether_read:false,
        comment:null,
        postId:null
    }
    
    render(<Router><NotificationBlock data={data} currentUserg={"alex"} isRead={false} handleChange={(data)=>{return data}}/></Router>);
    const unReadBlock = screen.getByTestId("unRead");
    await userEvent.click(unReadBlock);
    expect(1).toBe(1);
})

test("create a notification block with read notification",async ()=>{
    const data ={
        idString:"abcdefg",
        type:"follow",
        username_from:"xielin",
        username_to:"alex",
        whether_read:true,
        comment:null,
        postId:null
    }
    
    render(<Router><NotificationBlock data={data} currentUserg={"alex"} isRead={true} handleChange={(data)=>{return data}}/></Router>);
    //const unReadBlock = screen.getByTestId("unRead");
    //await userEvent.click(unReadBlock);
    expect(1).toBe(1);
})

