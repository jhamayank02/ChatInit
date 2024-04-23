import { useContext, useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { userExists } from "../redux/reducers/auth";
import { useCookies } from "react-cookie";

const Signup = ()=>{
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies();
    const [isSigningUp, setIsSigningUp] = useState(false);

    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const profilePictureRef = useRef();

    const isValid = (user_data) => {
        return true;
    }

    const formSubmitHandler = async (e)=>{
        e.preventDefault();

        const user_data = new FormData();
        user_data.append('firstname', firstnameRef.current.value);
        user_data.append('lastname', lastnameRef.current.value);
        user_data.append('email', emailRef.current.value);
        user_data.append('password', passwordRef.current.value);
        user_data.append('profilePic', profilePictureRef.current.files[0]);

        if(isValid(user_data)){
            try{
                setIsSigningUp(true);
                const response = await fetch('http://localhost:80/api/auth/signup', {
                  // const response = await fetch('https://chatinit-backend.onrender.com/api/auth/signup', {
                  method: 'POST',
                  body: user_data
                });
        
                const data = await response.json();
        
                console.log(data);
                if(data.status !== 200){
                  throw Error(data.msg);
                }
                
                setCookie('uid', data.access_token, {maxAge: 1000 * 60 * 60 * 24});
                dispatch(userExists(data.user));
                setIsSigningUp(false);
                return navigate('/otp-verification', {state: {email: emailRef.current.value}});
              }
              catch(error){
                setIsSigningUp(false);
                toast.error(`Error: ${error.message}`);
              }
            }
    }

    return <div className='my-8 px-4'>
    <h1 className='text-3xl font-light'>Welcome!!!</h1>
    <p className='text-lg font-light'>Create your account to start chatting</p>

    <form className='flex flex-col mt-4 font-light' onSubmit={formSubmitHandler}>
      <label className=''>Firstname</label>
      <input ref={firstnameRef} className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="text" required placeholder='Enter your firstname'></input>
      
      <label className=''>Lastname</label>
      <input ref={lastnameRef} className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="text" required placeholder='Enter your lastname'></input>
      
      <label className=''>Email</label>
      <input ref={emailRef} className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="email" required placeholder='Enter your email'></input>
      
      <label className=''>Password</label>
      <input ref={passwordRef} className='mb-2 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="password" required placeholder='Enter your password'></input>
      
      <label className=''>Profile picture</label>
      <input ref={profilePictureRef} className='mb-4 px-2 py-1 border-[1px] border-[#d9d9d9] outline-none rounded-sm' type="file" accept="images*/" required></input>
    
      <button disabled={isSigningUp} className='bg-[#2d97ff] text-white rounded-sm font-light py-1 text-lg disabled:bg-[#bfbfbf] disabled:cursor-not-allowed'>{!isSigningUp ? 'Signup' : 'Signing up...'}</button>      
    </form>
  </div>
}

export default Signup;