import axiosAPI from "../config/userConfig";
import axiosAPI1 from "../config/postConfig";
import { useEffect, useState, useContext, useRef } from "react";
import Header from "../components/profile/header";
import Photos from "../components/profile/photos";
import { postType } from "../components/post/postType";
import Sidebar from "../components/sidebar/sidebar";
import { useParams } from "react-router-dom";
import UserContext from "../contexts/user-context";
import { userType } from "./pageType";

export default function UserProfile(props: any) {
  const { username } = useParams();
  const [isUserSelf, setIsUserSelf] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [fullname, setFullname] = useState("");
  const [posts, setPosts] = useState<postType[]>([]);
  const [followers, setFollowers] = useState<userType[]>([]);
  const [following, setFollowing] = useState<userType[]>([]);
  const [currentFollowing, setCurrentFollowing] = useState<userType[]>([]);
  const [loadedNumber, setLoadedNumber] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const [postNum, setPostNum] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  async function getUserPosts() {
    console.log(loadedNumber);
    try {
      const requestBody = {
        username: username,
        loadedNumber: loadedNumber
      }
      const response = await axiosAPI.post("/profile", requestBody);
      if (response.data.avatar !== null)
        setAvatar("data:image/png;base64, " + response.data.avatar.data);
      else setAvatar("/images/avatars/default_avatar.jpg");
      setFullname(response.data.fullname);
      setPosts(response.data.posts);
      setPostNum(response.data.postIds !== null ? response.data.postIds.length : 0);
      setFollowers(response.data.followers);
      setFollowing(response.data.following);
      setLoadedNumber(response.data.posts !== null ? response.data.posts.length : 0);
      if (user.username === username) {
        setCurrentFollowing(response.data.following)
      }
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getSavedPosts() {
    await axiosAPI1
      .get(`/save/${username}`)
      .then((response) => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getUserPosts();
    if (user.username === username) {
      setIsUserSelf(true);
    } else {
      setIsUserSelf(false);
    }
    console.log(user.username);
  }, [username]);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate the scroll position
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Calculate the height of the entire document
      const totalHeight = document.documentElement.scrollHeight;

      // Calculate the height of the visible window
      const windowHeight = window.innerHeight;

      // Check if the user has reached the bottom of the page
      if (scrollY + windowHeight >= totalHeight) {
        getUserPosts();
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [getUserPosts]);


  return (
    <>
      <div className="bg-gray-background">
        <div className="grid grid-cols-5 gap-12 pr-10 ">
          <Sidebar onCreatePost={() => getUserPosts()} />
          <div className="container col-span-4 flex flex-col pt-5 " ref={contentRef}>
            <Header
              isUserSelf={isUserSelf}
              postCount={postNum}
              username={username}
              avatar={avatar}
              fullname={fullname}
              setAvatar={setAvatar}
              followers={followers}
              following={following}
              currentFollowing={currentFollowing}
            />
            <Photos
              isUserSelf={isUserSelf}
              isProfilePage={true}
              posts={posts}
              onCreateComment={getUserPosts}
              onClickSave={() => getSavedPosts()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
