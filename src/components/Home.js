import {useContext, useEffect, useState} from 'react';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Loading from "../utils/Loading";
import { toast } from 'react-toastify';
import {useDispatch} from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import { useLazyCheckIsLoggedInQuery } from '../redux/api/api';

const Home = ()=>{
    
    const [loading, setLoading] = useState(false);
    const [display, setDisplay] = useState('login');
    const [cookies, setCookie] = useCookies(['uid']);
    // const authContext = useContext(authCtx);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [checkIsLoggedIn] = useLazyCheckIsLoggedInQuery();
    
    const loginWithCookie = async ()=>{
        if(cookies?.uid === undefined){
            return;
        }
        try{
            setLoading(true);

            const response = await checkIsLoggedIn();
            // setLoading(false);
            console.log(response.data);
    
            if(response.error !== undefined){
                throw Error(response.error.data.msg || "Something went wrong!!!");
            }
            
            setLoading(false);
            setCookie('uid', response.data.access_token, {maxAge: 1000 * 60 * 60 * 24});
            dispatch(userExists(response.data.user))
            return navigate('/chat')

            // const response = await fetch("http://localhost:80/api/auth/check-is-logged-in", {
            //     method: 'POST',
            //     credentials: 'include',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // })
            // const data = await response.json();
            // setLoading(false);

            // if(data.status !== 200){
            //     throw Error(data.msg || "Something went wrong!!!");
            // }
            
            // dispatch(userExists(data.user))
            // return navigate('/chat')
        }
        catch(error){
            setLoading(false);
            toast.error(`Error: ${error.message}`)
        }
    }

    useEffect(()=>{
        loginWithCookie();
    }, [])

    return <div className="w-[97%] absolute top-[50px] left-[50%] translate-x-[-50%] sm:w-[600px]">

        <div className="border-[1px] border-[#d9d9d9] px-2 py-3 text-3xl text-center py-4 rounded-md bg-white font-light">
            ChatInit()
        </div>

        {loading && <div className="border-[1px] border-[#d9d9d9] bg-white px-2 py-3 mt-2 rounded-md  overflow-y-scroll max-h-[450px]"><Loading /></div>}

        {!loading && <div className="border-[1px] border-[#d9d9d9] bg-white px-2 py-3 mt-2 rounded-md overflow-y-scroll max-h-[450px]">
            <div className="flex gap-x-0 px-4">
                <NavLink to="/" className={"w-[50%] border-[1px] font-light rounded-2xl text-center font-light py-1 cursor-pointer " + `${display === 'login' ? 'bg-[#2d97ff] text-white' : 'text-black'}`} onClick={()=>setDisplay('login')}>Login</NavLink>
                <NavLink to="/signup" className={"w-[50%] border-[1px] font-light rounded-2xl text-center font-light py-1 cursor-pointer " + `${display === 'signup' ? 'bg-[#2d97ff] text-white' : 'text-black'}`} onClick={()=>setDisplay('signup')}>Sign Up</NavLink>
            </div>

            <Outlet />
        </div>}
    </div>
}

export default Home;