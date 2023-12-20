import { useState, useEffect, useContext } from "react";
import UserModal from "./userModal";
import AvatarModal from "./avatarModal";
import Skeleton from "react-loading-skeleton";
import { userType } from "../../pages/pageType";
import FollowModal from "./followModal";
import { Route, useNavigate } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import UserContext from "../../contexts/user-context";
import axiosAPI from "../../config/userConfig";

export default function Header({
  isUserSelf,
  postCount,
  username,
  avatar,
  fullname,
  setAvatar,
  followers,
  following,
  currentFollowing
}: {
  isUserSelf: boolean;
  postCount: number;
  avatar: string;
  fullname: string;
  username: string | undefined;
  setAvatar: (avatar: string) => void;
  followers: userType[];
  following: userType[];
  currentFollowing: userType[];
}) {
  const [isAvatarOpen, setAvatarOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [followerModalOpen, setFollowerModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {   
    if (avatar !== "") {
      setLoading(false);
    }
    if (!isUserSelf) {
      setIsFollowing(false);
      if(followers !== null){
        followers.forEach((follower) => {
          if (follower.username === user.username) {
            setIsFollowing(true);
          }
        });
      }
    }
  }, [avatar]);

  const handleClickFollower = () => {
    if (followers !== null && followers.length > 0) {
      setFollowerModalOpen(true);
    }
  };

  const handleClickFollowing = () => {
    if (following !== null && following.length > 0) {
      setFollowingModalOpen(true);
    }
  };

  const handleFollowRequest = async () => {
    let setFollowPair = {
      currentUserName: user.username,
      targetUserName: username,
    };
    if (isFollowing) {
      await axiosAPI
        .post("/cancelFollow", setFollowPair)
        .then(function (response) {
          let res = response.data;
          console.log("result of cancelFollow: " + res);
          setIsFollowing(false);
        })
        .catch(function (err) {
          console.error(err);
        });
    } else {
      await axiosAPI
        .post("/setFollow", setFollowPair)
        .then(function (response) {
          let res = response.data;
          console.log("result of setFollow: " + res);
          setIsFollowing(true);
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <div className="container flex justify-center items-center">
          {loading ? (
            <Skeleton circle height={160} width={160} />
          ) : (
            <img
              data-testid="test-setAvatarOpen"
              className="rounded-full h-40 w-40 flex cursor-pointer"
              src={avatar}
              alt="profile pic"
              onClick={() => setAvatarOpen(true)}
            />
          )}
        </div>
        <div className="flex items-center justify-center flex-col col-span-2">
          <div className="container flex items-center">
            <p className="text-2xl mr-4">{username}</p>
            {isUserSelf ? (
              <div data-testid="edit-profile" className="flex">
                <button
                  data-testid="test-navigateSetting"
                  className=" bg-gray-100 font-bold text-sm rounded w-28 h-8"
                  type="button"
                  onClick={() => navigate(ROUTES.SETTING)}
                >
                  Edit Profile
                </button>
                <svg
                  aria-label="Options"
                  color="#262626"
                  fill="#262626"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                  className="ml-2 cursor-pointer"
                  data-testid="test-setUserOpen"
                  onClick={() => setUserOpen(true)}
                >
                  <circle
                    cx="12"
                    cy="12"
                    fill="none"
                    r="8.635"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></circle>
                  <path
                    d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
                    fill="none"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>
            ) : (
              <>
                <button
                  className={`${
                    isFollowing ? "bg-gray-100" : "bg-sky-400 hover:bg-sky-600"
                  }  font-bold text-sm rounded w-20 h-8`}
                  type="button"
                  data-testid="test-Following"
                  onClick={handleFollowRequest}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  className=" bg-gray-100 font-bold text-sm rounded w-20 h-8 ml-2"
                  type="button"
                >
                  Message
                </button>
                <svg
                  aria-label="Options"
                  color="#262626"
                  fill="#262626"
                  height="32"
                  role="img"
                  viewBox="0 0 24 24"
                  width="32"
                  className="ml-2 cursor-pointer"
                  data-testid="test-setUserOpen"
                  onClick={() => setUserOpen(true)}
                >
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="6" cy="12" r="1.5"></circle>
                  <circle cx="18" cy="12" r="1.5"></circle>
                </svg>
              </>
            )}
          </div>
          <div className="container flex mt-4">
            <p className="mr-10">
              <span className="font-bold">{postCount}</span> posts
            </p>
            <p
              data-testid="test-handleClickFollower"
              className="mr-10 cursor-pointer"
              onClick={handleClickFollower}
            >
              <span className="font-bold">
                {followers !== null ? followers.length : 0}{" "}
              </span>
              <span className="text-blue">follower</span>
            </p>
            <p
              data-testid="test-handleClickFollowing"
              className="mr-10 cursor-pointer"
              onClick={handleClickFollowing}
            >
              <span className="font-bold">
                {following != null ? following.length : 0}
              </span>{" "}
              <span className="text-blue">following</span>
            </p>
          </div>
          <div className="container mt-4">
            <p className="font-medium">{fullname}</p>
          </div>
        </div>
      </div>
      <UserModal
        isOpen={isUserOpen}
        isUserSelf={isUserSelf}
        onClose={() => setUserOpen(false)}
      ></UserModal>
      <AvatarModal
        isOpen={isAvatarOpen}
        isUserSelf={isUserSelf}
        setAvatar={setAvatar}
        onClose={() => setAvatarOpen(false)}
      ></AvatarModal>
      {followers && (
        <FollowModal
          open={followerModalOpen}
          onClose={() => setFollowerModalOpen(false)}
          users={followers}
          currentFollowing={currentFollowing}
          followingType={false}
        />
      )}
      {following && (
        <FollowModal
          open={followingModalOpen}
          followingType={true}
          onClose={() => setFollowingModalOpen(false)}
          users={following}
          currentFollowing={currentFollowing}
        />
      )}
    </>
  );
}
