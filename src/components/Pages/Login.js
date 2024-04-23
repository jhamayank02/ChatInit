import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userExists } from '../../redux/reducers/auth';
import {useDispatch} from 'react-redux';
import { useCookies } from 'react-cookie';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  // TODO
  const isValid = (user_data) => {
    return true;
  }

const formSubmitHandler = async (e)=>{
    e.preventDefault();

    const user_data = {
        email: emailRef.current.value,
        password: passwordRef.current.value
    }

    if(isValid(user_data)){
      try{
        setIsLoggingIn(true);
        const response = await fetch('http://localhost:80/api/auth/login', {
        // const response = await fetch('https://chatinit-backend.onrender.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user_data)
        });

        const data = await response.json();

        if(data.status !== 200){
          throw Error(data.msg);
        }

        if(!data.verified){
          toast.error(data.msg);
          navigate('/otp-verification', {state: {email: emailRef.current.value}})
        }
        else{
          // console.log(data);
          // TODO -> Save cookie
          setCookie('uid', data.access_token, {maxAge: 1000 * 60 * 60 * 24});
          dispatch(userExists(data.user));
          setIsLoggingIn(false);
          navigate('/chat')
        }
      }
      catch(error){
        setIsLoggingIn(false);
        toast.error(`Error: ${error.message}`);
      }
    }
}

  return (
    <div className='my-8 px-4'>
      <h1 className='text-3xl font-light'>Welcome Back!!!</h1>
      <p className='text-lg font-light'>Login to continue chatting</p>

      <form className='flex flex-col mt-4 font-light' onSubmit={formSubmitHandler}>
        <label className=''>Email</label>
        <input ref={emailRef} className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="email" required placeholder='Enter your email'></input>
        
        <label className=''>Password</label>
        <input ref={passwordRef} className='mb-4 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="password" required placeholder='Enter your password'></input>
      
        <button disabled={isLoggingIn} className='bg-[#2d97ff] text-white rounded-sm font-light py-1 text-lg disabled:bg-[#bfbfbf] disabled:cursor-not-allowed'>{!isLoggingIn ? 'Login' : 'Logging in...'}</button>      
        {/* <span className='my-1 text-blue-400'>Forgot password?</span> */}
      </form>
    </div>
  )
}

export default Login;

