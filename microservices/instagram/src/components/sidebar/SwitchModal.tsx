import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, useNavigate } from 'react-router-dom';
import axiosAPI from "../../config/authConfig"
import { loginType } from "../../pages/pageType";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import * as ROUTES from  '../../constants/routes';
import UserContext from '../../contexts/user-context';

interface userType {
  username: string,
  avatar: string,
  fullname: string
};

export default function SwitchModal({
  isOpen,
  onClose,
  // props,
}: {
  isOpen: boolean;
  onClose: () => void;
  // props : loginType;
}) {
  // const [user, setUser] = useState<userType>({username:"", avatar:"", fullname:""});
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState(''); // an array with two values: the current state and a function to update the state
  const [password, setPassword] = useState('');
  const cancelButtonRef = useRef(null);
  const [error, setError] = useState('');
  const isInvalid = password === '' || emailAddress === '';
  const handleLogin: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    const obj = {username:emailAddress, password:password};
    try {
        const response = await axiosAPI.post('/login', obj);
        console.log(response);
        let user_new = {
            username: response.data.username,
            fullname: response.data.fullname,
            avatar: "/images/avatars/default_avatar.jpg",
        }
        if(response.data.avatar!==null){
          user_new.avatar = "data:image/png;base64, "+response.data.avatar.data.data;
        }
        // props.onLogin(user);
        localStorage.clear();
        setUser(user_new);
        window.localStorage.setItem("username", JSON.stringify(user.username));
        window.localStorage.setItem("avartar", JSON.stringify(user.avatar));
        window.localStorage.setItem("fullname", JSON.stringify(user.fullname));
        navigate(ROUTES.DASHBOARD);
    }
    catch (error: any) {
        console.error(error);
        // Show a message indicating incorrect login credentials to the user
        setError('Incorrect login credentials. Please try again.');
        // if (error.response && error.response.data) {
        //     setError(error.response.data);
        // } else {
        //     setError('Incorrect login credentials. Please try again.');
        // }
    }
};

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                {(
                  <div className="bg-white">
                                <div className="flex flex-col">
                <div className="flex flex-col items-center bg-white p-4 
                border border-gray-primary mb-4 rounded">
                    <h1 className="flex justify-center w-full">
                        <img src="/images/watig_logo.png" alt="UW_IG" className="mt-2 w-full mb-4"/>
                    </h1>
                    {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

                    <form method="POST">
                        <input
                            aria-label="Enter your email address"
                            type="text"
                            placeholder="Email address"
                            data-testid="email-address"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                            border-gray-primary rounded mb-2"
                            onChange={({ target}) => setEmailAddress(target.value)}
                            value={emailAddress}
                        />
                        <input
                            aria-label="Enter your password"
                            type="password"
                            placeholder="Password"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                            border-gray-primary rounded mb-2"
                            onChange={({ target}) => setPassword(target.value)}
                            value={password}
                        />
                        <button onClick={handleLogin}
                            disabled={isInvalid}
                            type="submit"
                            style={{ "backgroundColor": "rgb(0, 149, 246)" }}
                            className={`text-white w-full rounded h-8 font-bold
                            ${isInvalid && 'opacity-50'}`}
                            onMouseOver={(e: any) => !isInvalid && (e.target.style.backgroundColor = "rgb(57, 117, 234)")}
                            onMouseLeave={(e: any) => !isInvalid && (e.target.style.backgroundColor = "rgb(0, 149, 246)")}
                        >
                            Login
                        </button>
                    </form>
                </div>
                {/* <div className="flex justify-center items-center flex-col w-full bg-white p-4 
                rounded border border-gray-primary">
                    <p className="text-sm">
                        Don't have an account?{` `}
                        <Link to={ROUTES.SIGN_UP} className="font-bold text-blue-medium">
                            Sign up
                        </Link>
                    </p>
                </div> */}
            </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
