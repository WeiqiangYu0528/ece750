import axiosAPI from "../config/authConfig"
import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ROUTES from  '../constants/routes';

export default function SignUp() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [msg, setMessage] = useState('');
    const isInvalid = password === '' || emailAddress === '';

    const handleSignup: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        // Email format validation using regular expression
        const emailRegex = /^[a-zA-Z0-9_.]+@uwaterloo\.ca$/;
        if (!emailRegex.test(emailAddress)) {
            setError('Email address must be in the format personal_id@uwaterloo.ca');
            return;
        }

        // Check username length
        if (username.length < 3 || username.length > 15) {
            setError('Username must be between 3 and 15 characters');
            return;
        }
        const obj = {emailAddress:emailAddress, fullName:fullName, username:username, password:password};
        try {
            const response = await axiosAPI.post('/register', obj);
            console.log(response);
            setError('')
            setMessage('Congrats! You have successfully registered.');
            navigate(ROUTES.LOGIN);
        }
        catch (error: any){
            // console.error(error);
            setMessage('')
            // Show a message indicating incorrect login credentials to the user
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('Sorry, this email address has been registered.');
            }
        }
      }
      
    
    useEffect(() => {
        document.title = 'Sign up - Instagram';
    }, []);

    return (
        <div className="container flex mx-auto max-w-screen-md items-center h-screen">
            <div className="flex w-3/5">
                <img src="/images/iphone-with-profile.jpg" alt="iPhone with Instagram app" />
            </div>
            <div className="flex flex-col w-2/5">
                <div className="flex flex-col items-center bg-white p-4 
                border border-gray-primary mb-4 rounded">
                    <h1 className="flex justify-center w-full">
                        <img src="/images/watig_logo.png" alt="Instagram" className="mt-2 w-full mb-4"/>
                    </h1>
                    {error && <p className="mb-4 text-xs text-red-600" data-testid="warning">{error}</p>}

                    <form onSubmit={handleSignup} method="POST">
                        <input
                            aria-label="Enter your username"
                            type="text"
                            placeholder="Username"
                            data-testid="userid"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                            border-gray-primary rounded mb-2"
                            onChange={({ target}) => setUsername(target.value)}
                            value={username}
                        />
                        <input
                            aria-label="Enter your full name"
                            type="text"
                            placeholder="Full name"
                            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border
                            border-gray-primary rounded mb-2"
                            onChange={({ target}) => setFullName(target.value)}
                            value={fullName}
                        />
                        <input
                            aria-label="Enter your email address"
                            type="text"
                            placeholder="University Email address"
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
                        <button
                            disabled={isInvalid}
                            type="submit"
                            style={{ "backgroundColor": "rgb(0, 149, 246)" }}
                            className={`text-white w-full rounded h-8 font-bold
                        ${isInvalid && 'opacity-50'}`}
                            onMouseOver={(e: any) => !isInvalid && (e.target.style.backgroundColor = "rgb(57, 117, 234)")}
                            onMouseLeave={(e: any) => !isInvalid && (e.target.style.backgroundColor = "rgb(0, 149, 246)")}
                        >
                            Sign up
                        </button>
                    </form>
                </div>
                <div className="flex justify-center items-center flex-col w-full bg-white p-4 
                rounded border border-gray-primary">
                    <p className="text-sm">
                        Have an account?{` `}
                        <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// TODO: add to tailwind config
// bg-blue-medium -> hex values
// text-red-primary -> hex values
// text-blue-medium -> hex values
// text-gray-base -> hex values
// border-gray-primary -> hax values
