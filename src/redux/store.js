import {configureStore} from '@reduxjs/toolkit';
import authSlice from './reducers/auth';
import api from './api/api';
import notificationSlice from './reducers/notification';
import miscSlice from './reducers/misc';

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [notificationSlice.name]: notificationSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (defaultMiddleware)=> [...defaultMiddleware(), api.middleware]
});

export default store;