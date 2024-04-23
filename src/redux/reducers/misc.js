import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNotificationModalOpened : false,
    isSearchModalOpened : false,
    isCreateGroupModalOpened : false,
    isMyDetailsModalOpened : false,
    isUserDetailsModalOpened : false,
    isGroupDetailsModalOpened: false,
    isAddMembersModalOpened: false
};

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        openNotificationModal: (state)=> { state.isNotificationModalOpened = true },
        closeNotificationModal: (state)=> { state.isNotificationModalOpened = false },

        openSearchModal: (state)=> { state.isSearchModalOpened = true },
        closeSearchModal: (state)=> { state.isSearchModalOpened = false },

        openCreateGroupModal: (state)=> { state.isCreateGroupModalOpened = true },
        closeCreateGroupModal: (state)=> { state.isCreateGroupModalOpened = false },

        openMyDetailsModal: (state)=> { state.isMyDetailsModalOpened = true },
        closeMyDetailsModal: (state)=> { state.isMyDetailsModalOpened = false },

        openUserDetailsModal: (state)=> { state.isUserDetailsModalOpened = true },
        closeUserDetailsModal: (state)=> { state.isUserDetailsModalOpened = false },

        openGroupDetailsModal: (state)=> { state.isGroupDetailsModalOpened = true },
        closeGroupDetailsModal: (state)=> { state.isGroupDetailsModalOpened = false },

        openAddMembersModal: (state)=> { state.isAddMembersModalOpened = true },
        closeAddMembersModal: (state)=> { state.isAddMembersModalOpened = false },
    }
});

export default miscSlice;
export const {
    openNotificationModal,
    closeNotificationModal,
    openSearchModal,
    closeSearchModal,
    openCreateGroupModal,
    closeCreateGroupModal,
    openMyDetailsModal,
    closeMyDetailsModal,
    openUserDetailsModal,
    closeUserDetailsModal,
    openGroupDetailsModal,
    closeGroupDetailsModal,
    openAddMembersModal,
    closeAddMembersModal
} = miscSlice.actions;