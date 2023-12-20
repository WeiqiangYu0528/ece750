import axiosAPI from "../../config/userConfig"
import axiosAPI1 from "../../config/notificationConfig"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Route, useNavigate } from 'react-router-dom';

interface SearchCardProps{
    result:SearchResult;
    currentUser:string;
}

export interface SearchResult{
    userName : string;
    avatarURL:string;
    isFollowing:boolean;
}



export default function SearchResultCard(props:SearchCardProps){
    const result:SearchResult = props.result;
    const [isFollowed,setIsFollowed] = useState(result.isFollowing);
    const [targetUser,setTargetUser]=useState(result.userName);
    const [currentUser,setCurrentUser]=useState(props.currentUser);
    const [isMyself,setIsMySelf]=useState(targetUser===currentUser);
    const navigate = useNavigate();
    const handleFollowingClicked = async ()=>{
        let cancelFollowPair = {currentUserName:currentUser,targetUserName:targetUser}; 
        console.log("currentUser: " + currentUser + " targetUser: "+targetUser+" ; send request")
        await axiosAPI.post("/cancelFollow",cancelFollowPair)
        .then(function(response){
            let res = response.data;
            console.log("result of cancelFollow: "+res);
            if(res === "successful"){
                setIsFollowed(false);
            }
            
        })
        .catch(function(err){
            console.error(err);
        }); 
    };
    const handleFollowClicked= async ()=>{
        let setFollowPair = {currentUserName:currentUser,targetUserName:targetUser};
        let notificationPair={username_from:currentUser,username_to:targetUser}; 
        await axiosAPI.post("/setFollow",setFollowPair)
        .then(function(response){
            let res = response.data;
            console.log("result of setFollow: "+res);
            if(res === "successful"){
                setIsFollowed(true);
            }
            
        })
        .catch(function(err){
            console.error(err);
        }); 
        await axiosAPI1.post("/add/follow",notificationPair).then().catch(function(err){
            console.error(err);
        }); 

    };


    return (
        
            <div className="flex flex-row h-16 w-full hover:bg-slate-100 p-1">
                
                <Link to={`/p/${result.userName}`}  className='h-16 w-4/6 no-underline cursor-pointer'>
                    <div className="flex flex-row p-1 h-full w-full">
                        <img src={result.avatarURL} alt={result.userName} className="w-[40px] h-[40px] rounded-full hover:scale-105"/>
                        <div className="flex flex-col h-full w-[calc(100%-40px)]" >
                            <p className="h-1/2 w-full pl-3 pb-0 mb-0 font-semibold text-sm overflow-hidden">{result.userName}</p>
                            <p className="h-1/2 w-full pl-3 pb-3 font-light text-sm overflow-hidden"></p>
                        </div>
                    </div>
                </Link>
                {isFollowed ? (
                                <button data-testid="following" className="w-2/6 border-transparent bg-transparent text-gray-500 text-sm font-semibold" onClick={handleFollowingClicked}>Following</button> 
                            ):(
                                <button data-testid="follow" className="w-2/6 border-transparent bg-transparent text-blue-600 text-sm font-semibold" onClick={handleFollowClicked}>Follow</button>
                )}
                
            </div>
       
    );
}