// import React from 'react';
import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import * as ROUTES from './constants/routes'
import UserContext from './contexts/user-context';
import Hashtag from './pages/hashtag';
import Explore from './pages/explore';

interface userType {
  username: string,
  avatar: string,
  fullname: string
};

function App() {
  const [user, setUser] = useState<userType>({username:"", avatar:"", fullname:""});
  
  const Login = lazy(() => import('./pages/login'));
  const Dashboard= lazy(() => import('./pages/dashboard'));
  const UserProfile= lazy(() => import('./pages/userProfile'));
  const SignUp = lazy(() => import("./pages/sign-up"));
  const ErrorPage = lazy(() => import("./pages/error-page"));
  const NotFoundPage = lazy(() => import("./pages/not-found"));
  const Setting = lazy(() => import("./pages/setting"));

  return (
    <UserContext.Provider value={{ user:user , setUser: setUser}}>
      <Router>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login onLogin={setUser}/>} errorElement={<ErrorPage/>}  />
          <Route path={ROUTES.SIGN_UP} element={<SignUp/>}errorElement={<ErrorPage/>} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard/>}errorElement={<ErrorPage/>} />
          <Route path={ROUTES.PROFILE} element={<UserProfile/>} errorElement={<ErrorPage/>} />
          <Route path={ROUTES.SETTING} element={<Setting/>} errorElement={<ErrorPage/>} />
          <Route path={ROUTES.HASHTAG} element={<Hashtag/>} errorElement={<ErrorPage/>} />
          <Route path={ROUTES.EXPLORE} element={<Explore/>} errorElement={<ErrorPage/>} />
          <Route path='*' element={<NotFoundPage/>} />
        </Routes>
      </Suspense>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
