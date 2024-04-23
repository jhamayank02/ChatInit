import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useOtpVerificationMutation, useResendOTPMutation } from "../redux/api/api";
import { useCookies } from 'react-cookie';
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";

let currentOtpIndex = 0;

const OTPScreen = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [cookies, setCookie] = useCookies();
  const dispatch = useDispatch();

  const [submitOTP] = useOtpVerificationMutation();
  const [resendOTP] = useResendOTPMutation();

  const submitHandler = async ()=>{
    try{
      const user_data = {
        email: location.state.email,
        otp: otp.join('')
      }

      const response = await submitOTP(user_data);
      if(response.error !== undefined){
        throw Error(response.error.data.msg);
      }

      toast.success(`Success: ${response.data.msg}`);
      setCookie('uid', response.data.access_token, {maxAge: 1000 * 60 * 60 * 24});
      dispatch(userExists(response.data.user));
      return navigate('/chat')
    }
    catch(err){
      toast.error(`Error: ${err.message}`);
    }
  }

  const resendOtpHandler = async ()=>{
    try{
      const email = location.state.email;

      const response = await resendOTP({email: email});

      if(response.error !== undefined){
        throw Error(response.error.data.msg);
      }

      toast.success(`Success: ${response.data.msg}`);
    }
    catch(err){
      toast.error(`Error: ${err.message}`);
    }
  }

  const onChangeHandler = (e)=>{
    const { value } = e.target;
    // console.log(value);
    const newOtp = [...otp];
    newOtp[currentOtpIndex] = value.substr(value.length - 1);
    if(!value){
      setActiveOtpIndex(currentOtpIndex-1);
    }
    else{
      setActiveOtpIndex(currentOtpIndex+1);
    }
    setOtp(newOtp);
  }

  const onKeyDownHandler = (e,index)=>{
    currentOtpIndex = index;
    if(e.key === 'Backspace'){
      setActiveOtpIndex(currentOtpIndex-1);
    }
  }

  useEffect(()=>{
    inputRef.current?.focus();
  }, [activeOtpIndex])

  useEffect(()=>{
    if(!location?.state?.email){
      return navigate('/')
    }
  }, []);

  return (
    <div className="my-8 px-4">
      <h1 className="text-3xl font-light">OTP Verification</h1>
      <p className="text-lg font-light">Enter the <span>One Time Password(OTP)</span> we have sent to your email <span>{location?.state?.email}</span></p>

      <div className="flex gap-x-2 justify-center mt-3">
        {otp.map((_, index)=>{
          return <input ref={activeOtpIndex === index ? inputRef : null} onChange={onChangeHandler} onKeyDown={(e)=>onKeyDownHandler(e,index)} value={otp[index]} className="bg-[#ebe9e9] text-3xl rounded-md outline-none w-[42px] px-3 py-1" type="number"></input>
        })}
        
      </div>

      <div className="text-lg font-light mt-5 text-center">Didn't receive the OTP. <span onClick={resendOtpHandler} className="text-[#2d97ff] cursor-pointer hover:underline">Resend OTP</span></div>

      <button onClick={submitHandler} className="bg-[#2d97ff] text-white rounded-sm font-light py-1 text-lg px-3 ml-auto mr-0 block">Submit</button>
    </div>
  )
}

export default OTPScreen;
