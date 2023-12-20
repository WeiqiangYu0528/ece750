import React, { useState, useContext, useRef, useEffect } from 'react'
import Modal from './modal';
import {Route, useNavigate } from 'react-router-dom';
import { sidebarType } from './sidebarType';
import SearchBar from '../search/searchBar';
import * as ROUTES from '../../constants/routes';
import UserContext from '../../contexts/user-context'
import SwitchModal from './SwitchModal';
import { loginType } from "../../pages/pageType";
import NotificationBar from '../notification/notificationBar';
interface userType {
    username: string,
    avatar: string,
    fullname: string
  };

export default function Sidebar(props: sidebarType) {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);
    const [showMore, setShowMore] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchButtonClicked,setSearchButtonClicked] = useState(false);
    const [notificationClicked,setNotificationClicked] = useState(false);
    const [searchBarBuffer,setSearchBarBuffer] = useState<string>("");
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [switch_user, setSwitchUser] = useState<userType>({username:"", avatar:"", fullname:""});
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
            user.avatar = user_new.avatar;
          }
      }, []);
      
      useEffect(() => {
        if (user.username != "") {
            window.localStorage.setItem("username", JSON.stringify(user.username));
            window.localStorage.setItem("avartar", JSON.stringify(user.avatar));
            window.localStorage.setItem("fullname", JSON.stringify(user.fullname));
        }
      }, [user]);

    function handleLogout() {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (confirmed) {
            localStorage.clear();
            setUser({});
            navigate(ROUTES.LOGIN);
        }
    }
    function handleSwitchAccount() {
        const confirmed = window.confirm("Are you sure you want to switch account?");
        if (confirmed) {
            localStorage.clear();
            setUser({});
            navigate(ROUTES.LOGIN);
        }
        // return (
        //     <p>hello</p>
        // )
    }
    
    const clickOutsideRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (clickOutsideRef.current && !clickOutsideRef.current.contains(event.target as Node)) {
            setSearchButtonClicked(false);
            setNotificationClicked(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [clickOutsideRef]);
      

    return (
        <>
        <div ref={clickOutsideRef}>
            <Modal open={showModal} onClose={() => setShowModal(false)} onCreatePost={props.onCreatePost} />
            <div className="container col-span-1 bg-white p-10 border-r border-gray-primary h-screen sticky top-0 z-10">
                <div className="text-gray-700 text-center flex align-items cursor-pointer">
                    <h1 className="flex">
                        <img src="/images/logo.png" alt="Instagram" className="mt-2 w-6/12" />
                    </h1>
                </div>
                <ul>
                    <div className="pb-6">
                        <li data-testid="home" className="hover:text-custom-blue flex mt-10 cursor-pointer" onClick={() => navigate(ROUTES.DASHBOARD)}>
                            <svg aria-label="Home" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>
                            <span className='ml-3'>Home</span>
                        </li>
                        <li data-testid="search" className="hover:text-custom-blue flex mt-7 cursor-pointer" 
                            onClick={()=>{
                                setSearchButtonClicked(!searchButtonClicked);
                                setNotificationClicked(false);                               
                            }}>
                            <svg aria-label="Search" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
                            <span className='ml-3'>Search</span>
                        </li>
                        <li data-testid="explore" className="hover:text-custom-blue flex mt-7 cursor-pointer" onClick={() => navigate("/explore/" + user.username)}>
                            <svg aria-label="Explore" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon><polygon fillRule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></svg>
                            <span className='ml-3'>Explore</span>
                        </li>
                        <li className="flex mt-7 cursor-pointer"
                            data-testid="notification"
                            onClick={()=>{
                                setNotificationClicked(!notificationClicked);
                                setSearchButtonClicked(false);                                   
                            }}>
                            <svg aria-label="Notifications" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                            <span className='ml-3'>Notifications</span>
                        </li>
                        <li data-testid="create-button" className="flex mt-7 cursor-pointer" onClick={() => setShowModal(true)}>
                            <svg aria-label="New post" className="_ab6-" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
                            <span className='ml-3'>Create</span>
                        </li>
                        <li data-testid="profile" className="flex items-center mt-7 cursor-pointer" onClick={() => {navigate(`/p/${user.username}`)}}>
                            <img className='rounded-full w-6 h-6 flex mr-3' src={user.avatar} alt="" />
                            Profile
                        </li>
                        <div className='absolute bottom-0 mt-7 py-10 pr-32 '>
                                {showMore &&
                                    <div data-testid="more-content" className='absolute -top-44'>
                                        <li className="flex mt-3 justify-between border-b border-gray-primary py-3 cursor-pointer" onClick={() => {navigate(ROUTES.SETTING)}}>
                                            <span className='ml-3'>Setting</span>
                                            <svg aria-label="Settings" className="" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><path d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        </li>
                                        <li className="flex  justify-between border-b border-gray-primary py-3 cursor-pointer">
                                            <span className='ml-3'>Saved</span>
                                            <svg aria-label="Saved" className="" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                                        </li>
                                        <li data-testid="switch" className="flex border-b border-gray-primary py-3 cursor-pointer" onClick={() => setLoginOpen(true)}>
                                            <span className='ml-3'>Switch accounts</span>
                                        </li>
                                        <li data-testid="logout" className="flex border-b border-gray-primary py-3 cursor-pointer" onClick={handleLogout}>
                                            <span className='ml-3'>Logout</span>
                                        </li>
                                    </div>}
                            <li data-testid="more-button" className="cursor-pointer flex" onClick={() => setShowMore(!showMore)}>
                                <svg aria-label="Settings" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="4" y2="4"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="12" y2="12"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="3" x2="21" y1="20" y2="20"></line></svg>
                                <span className='ml-3'> More</span>
                            </li>
                        </div>
                    </div>
                </ul>
                {searchButtonClicked && 
                    <div data-testid="search-bar" className="absolute left-full inset-y-0 duration-100 ease-in-out border-transparent z-10">
                        <SearchBar contentBuffer={searchBarBuffer} handleReturnBuffer={setSearchBarBuffer} currentUser={user.username}/>
                    </div>  
                }
                {notificationClicked &&
                    <div data-testid="notification-bar" className="absolute left-full inset-y-0 duration-100 ease-in-out border-transparent z-10">
                        <NotificationBar currentUser={user.username}/>
                    </div> 
                }
            </div>
        </div>
        <SwitchModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        // onLogin={() => setSwitchUser()}
      ></SwitchModal>
      </>
    )
}
