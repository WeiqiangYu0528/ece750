import React,{useContext, useState} from 'react'
import { recommendedUserType } from '../../pages/pageType'
import axiosAPI from '../../config/userConfig';
import UserContext from '../../contexts/user-context';
import { useNavigate } from 'react-router-dom';
export default function SuggestedProfile(props: {recommendedUser: recommendedUserType}) {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const {user} = useContext(UserContext);
  const handleFollowRequest = async () => {
    setIsFollowing(true);
    let setFollowPair = {
        currentUserName: user.username,
        targetUserName: props.recommendedUser.username,
      };
      await axiosAPI
        .post("/setFollow", setFollowPair)
        .then(function (response) {
          let res = response.data;
          console.log("result of setFollow: " + res);
        })
        .catch(function (err) {
          console.error(err);
        });
  }
  const avatar = props.recommendedUser.avatar === null ? "/images/avatars/default_avatar.jpg" : "data:image/png;base64, " + props.recommendedUser.avatar.data;
  
  return (
    <div className="flex flex-row items-center align-items justify-between" >
        <div className="flex items-center justify-between cursor-pointer" data-testid="profile" onClick={() => navigate(`/p/${props.recommendedUser.username}`)}>
            <img className="rounded-full w-8 h-8 flex mr-3" src={avatar} alt="jjsd" />
            <p className="font-bold text-sm">{props.recommendedUser.username}</p>
        </div>
        <div >
          {
            isFollowing ? <button data-testid="following" className="text-xs font-bold custom-black" type='button' disabled>Following</button> : <button data-testid="follow" className="text-xs font-bold text-blue-medium custom-blue" type='button' onClick={handleFollowRequest}>Follow</button>
          }
        </div>

    </div>
  )
}
