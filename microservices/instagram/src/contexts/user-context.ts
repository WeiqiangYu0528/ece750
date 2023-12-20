import { createContext } from 'react';
import { UserContextType } from './context-type';

const defaultState = {
    user:{
      username: "",
      avatar:"",
      fullname:"",
    },
    setUser: () => {},
  };

const UserContext = createContext<UserContextType>(defaultState);
export default UserContext;