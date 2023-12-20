import { useState,useEffect } from "react";
import axiosAPI from "../../config/notificationConfig"
import NotificationBlock,{notificationData} from "./notificationInfo";


export default function NotificationBar(props:{currentUser:string}){
    const [readList,setReadList]=useState<string[]>([]);
    const [infos,setInfos]=useState<notificationData[]>([]);
    const [currentUser,setCurrentUser]=useState<string>(props.currentUser);

    
    const handleGetNotification = async ()=>{
        await axiosAPI.get(`/${currentUser}`)
        .then(function (res){
            let results = res.data;
            let infosData:notificationData[] = []; 
            let counterRead = 0;
            results.map((result:any)=>{
                if(result.type==="follow"){
                    let tempInfo:notificationData = {notificationId:result.idString,
                                                    type:result.type,
                                                    username_from:result.username_from,
                                                    username_to:result.username_to,
                                                    whether_read:result.whether_read,
                                                    comment:result.comment,
                                                    postId:result.postId};
                    infosData.push(tempInfo);
                    if(result.whether_read){
                        counterRead+=1;
                    }
                }
            });
            console.log(`get ${results.length} notifications, ${counterRead} were read`);
            setInfos(infosData);
        }).catch(function (err){
            console.error(err);            
        });
    }

    const handleChangeRead = (id:string)=>{
        if(!readList.includes(id)){
            setReadList([...readList,id]);
        }
    }

    const handleUnmount = ()=>{
        if(readList.length>0){
            const formData = new FormData();
            for(const id of readList){
                formData.append("notificationId[]",id);
            }
            axiosAPI.post("/change",formData,{
                headers : {"Content-Type" : "application/json;charset=utf-8"}
            });
        }
        
    }


    useEffect(()=>{
        handleGetNotification();

        return handleUnmount;
    },[]);

    return (
        <div className='flex flex-col pl-2 pr-2 bg-white border-gray-primary h-screen w-96 border-r border-l rounded-r-[1rem]'>
            
            <div className="pt-6 pb-8">
                <p className="font-medium text-2xl font-sans">Notification</p>
            </div> 

            <div data-testid="notification-list" className="overflow-y-scroll w-full border-t-2 pt-6 border-slate-150">
                {infos.map((info)=>{
                    return (
                        <NotificationBlock data={info} currentUser={currentUser} isRead={info.whether_read} handleChange={handleChangeRead}/>                  
                    );
                })}
            </div>
           
        </div>
    );
}






