import { createSlice } from "@reduxjs/toolkit";
import { deleteFromLocalStorage, getOrSaveFromLocalStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: getOrSaveFromLocalStorage({key: NEW_MESSAGE_ALERT, get: true}) || [{
        chatId: "",
        count: 0
    }]
}

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        incrementNotificationCount: (state)=>{
            state.notificationCount += 1;
        },
        resetNotificationCount: (state)=>{
            state.notificationCount = 0;
        },
        setNewMessagesAlert: (state, action)=>{
            const index = state.newMessagesAlert.findIndex(item => item.chatId === action.payload.chatId);
            if(index === -1){
                state.newMessagesAlert.push({chatId: action.payload.chatId, count: 1});
            }
            else{
                state.newMessagesAlert[index].count++;
            }
        },
        removeNewMessagesAlert: (state, action)=>{
            deleteFromLocalStorage(action.payload);
            state.newMessagesAlert = state.newMessagesAlert.filter(({chatId})=> chatId !== action.payload);
        }
    }
});

export default notificationSlice;
export const {incrementNotificationCount, resetNotificationCount, setNewMessagesAlert, removeNewMessagesAlert} = notificationSlice.actions;