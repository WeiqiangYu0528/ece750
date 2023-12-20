import React, { useContext, useState, useEffect } from "react";
import { userItemType } from "../../pages/pageType";
import UserContext from "../../contexts/user-context";
import axiosAPI from "../../config/userConfig";
import { useNavigate } from "react-router-dom";
export default function UserItem(props: userItemType) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [removed, setRemoved] = useState(false);
  const [isFollowing, setIsFollowing] = useState<Boolean>(false);

  useEffect(() => {
    props.currentFollowing.forEach((element) => {
      if (element.username === props.username) {
        setIsFollowing(true);
      }
    });
  }, []);

  const handleFollowRequest = async () => {
    let setFollowPair = {
      currentUserName: user.username,
      targetUserName: props.username,
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
  };

  const handleUnfollowRequest = async () => {
    let cancelFollowPair = {
      currentUserName: user.username,
      targetUserName: props.username,
    };
    await axiosAPI
      .post("/cancelFollow", cancelFollowPair)
      .then(function (response) {
        let res = response.data;
        console.log("result of cancelFollow: " + res);
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  const handleClickRemove = async () => {
    handleUnfollowRequest();
    setRemoved(true);
  };

  const handleClickFollow = async () => {
    handleFollowRequest();
    setIsFollowing(true);
  };

  const handleClickEvent = async () => {
    if (isFollowing) {
      handleUnfollowRequest();
    } else {
      handleFollowRequest();
    }
    setIsFollowing(!isFollowing);
  };

  const handleNavigate = () => {
    props.onClose();
    navigate(`/p/${props.username}`);
  };

  const avatar = props.avatar
    ? "data:image/png;base64," + props.avatar.data
    : "/images/avatars/default_avatar.jpg";

  return (
    <div className="flex justify-between px-6 py-4">
      <div className="flex items-center">
        <img
          data-testid="test-handleNavigate"
          className="rounded-full h-10 w-10 mr-3 object-cover"
          src={avatar}
          onClick={handleNavigate}
        />
        <div>
          <p className="font-bold">
            <span onClick={handleNavigate}>{props.username}</span>{" "}
            {!props.followingType && !isFollowing && (
              <span
                data-testid="test-handleClickFollow"
                className="custom-blue ml-2 cursor-pointer"
                onClick={handleClickFollow}
              >
                Follow
              </span>
            )}
          </p>
          <p className="text-gray">{props.fullname}</p>
        </div>
      </div>
      <div>
        {props.followingType ? (
          <button
            data-testid="test-handleClickEvent"
            className={`font-bold px-4 py-2 rounded-lg ${
              isFollowing
                ? "custom-background-gray"
                : "text-white custom-background-blue"
            }`}
            onClick={handleClickEvent}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        ) : (
          <button
            data-testid="test-handleClickRemove"
            className="font-bold px-2 py-2 custom-background-gray rounded-lg"
            onClick={handleClickRemove}
            disabled={removed}
          >
            {removed ? "Removed" : "Remove"}
          </button>
        )}
      </div>
    </div>
  );
}
