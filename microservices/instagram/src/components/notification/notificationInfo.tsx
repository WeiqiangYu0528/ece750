import { useState,useEffect } from "react";
import {Link} from 'react-router-dom'


export interface notificationData{
    notificationId:string,
    type:string,
    username_from:string,
    username_to:string,
    whether_read:boolean,
    comment:string
    postId:string
}

export default function NotificationBlock(props:{data:notificationData,currentUser:string,isRead:boolean,handleChange:(arg0:string)=>void}){
    const [data,setData]=useState(props.data);
    const [isRead,setIsRead]=useState(props.isRead);
    

    const handleClicked= ()=>{        
        setIsRead(true);
        props.handleChange(data.notificationId);
    };

    return (
        <div className="flex flex-row h-16 w-full border rounded-lg pl-5 border-slate-100 ">
        
        
        {isRead ? 
            (
                <div data-testid="isRead" className="flex flex-row w-full hover:bg-slate-100 p-1 pl-5 align-middle">
                    <div className="text-lg font-medium align-middle"><Link className="text-blue-500" to={`/p/${data.username_from}`}>{data.username_from}</Link> is following you.</div>
                </div>
            )
            :
            (
                <div data-testid="unRead" className="flex flex-row w-full hover:bg-slate-100 p-1 pl-5 align-middle cursor-pointer" onClick={handleClicked}>
                     <div className="text-lg font-medium align-middle"><Link className="text-blue-500" to={`/p/${data.username_from}`}>{data.username_from}</Link> is following you.</div>
                     <span className="inline-block w-2 h-2 mr-2 bg-red-600 rounded-full align-middle"></span>
                </div>
            )
        }
        </div>
        
    );
}