import Home from './components/Pages/Home';
import { ToastContainer } from 'react-toastify';
import {HashRouter, Routes, Route} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ChatHome from './components/Pages/ChatHome';
import OTPScreen from './components/Pages/OTPScreen';
import Signup from './components/Pages/Signup';
import Login from './components/Pages/Login';
import { CookiesProvider } from 'react-cookie';
import { SocketProvider } from './socket';

function App() {
  return (
    <CookiesProvider>
    <HashRouter>
      {/* <div className="app-container relative h-[100dvh] bg-[#e9e9e9] overflow-hidden px-4 py-4"> */}
      <div className="app-container relative h-[100dvh] bg-[#e9e9e9]">
        <ToastContainer position='top-right' autoClose={5000} />
      <Routes>
        {/* <Route exact path='/' element={<Home />} /> */}
        <Route exact path='/' element={<Home />}>
          <Route index element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='otp-verification' element={<OTPScreen />} />
        </Route>
        <Route exact path='/chat' element={<SocketProvider><ChatHome /></SocketProvider>} />
        {/* <Route exact path='/otp-verification' element={<OTPScreen />} /> */}
      </Routes>
      </div>
    </HashRouter>
    </CookiesProvider>
  );
}

export default App;
