import React,{useEffect, useState, useContext} from 'react'
import {Route, useNavigate } from 'react-router-dom';
import Suggestions from '../components/suggestions/suggestions'
import Timeline from '../components/timeline'
import Sidebar from '../components/sidebar/sidebar'
import axiosAPI from "../config/postConfig"
import UserContext from '../contexts/user-context'
import * as ROUTES from '../constants/routes';
import { postType } from '../components/post/postType';
import { recommendedUserType} from './pageType';

export default function Dashboard() {
  const navigate = useNavigate();
  const {user, setUser} = useContext(UserContext);
  const [posts, setPosts] = useState<postType[]>();
  const [recommendedUsers, setRecommendedUsers] = useState<recommendedUserType[]>([]);

  useEffect(() => {
    const data = window.localStorage.getItem("username");
    const avartar = window.localStorage.getItem("avartar");
    const fullname = window.localStorage.getItem("fullname");
    if (data !== null) {
      var ava = "";
      if (avartar !== null) {
          ava = JSON.parse(avartar);
      }
      var f_name = "";
      if (fullname !== null) {
          f_name = JSON.parse(fullname);
      }

      let user_new = {username: JSON.parse(data), avatar: ava, fullname: f_name};
      setUser(user_new);
      user.username = user_new.username;
      getPosts();
    }
    else if (user.username === "") {
      navigate(ROUTES.LOGIN);
    }
    else {
      getPosts();
    }
  }, []);
  // useEffect(() => {
  //   if(user.username === ""){
  //     navigate(ROUTES.LOGIN);
  //   }
  //   else{
  //     getPosts();
  //   }
  // },[]);

    async function getPosts() {
      try{
        const response = await axiosAPI.get(`/home/${user.username}`);
        setPosts(response.data.postList);
        setRecommendedUsers(response.data.recomment_follow_list);
        console.log(response.data);
      }
      catch(err){
        console.error(err);
      }
    }
    return (
      <div className='bg-gray-background'>
          <div className='grid grid-cols-5 gap-12 max-w-screen-2xl'>
              <Sidebar onCreatePost={() => getPosts()}/>
              <Timeline posts={posts} onCreateComment={() => getPosts()}/>
              <Suggestions recommendedUsers={recommendedUsers}/>
          </div>
      </div>
    )
  }
