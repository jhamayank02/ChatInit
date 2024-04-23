import { createContext, useContext, useMemo } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

// const getSocket = () => useContext(SocketContext);

const SocketProvider = ({children})=>{
    const socket = useMemo(() => io('http://localhost:80', {withCredentials: true}), []);
    // const socket = useMemo(() => io('https://chatinit-backend.onrender.com/', {withCredentials: true, transports: ['websocket']}), []);

    return <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
}

export {SocketProvider, SocketContext};