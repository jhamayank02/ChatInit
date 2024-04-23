import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const api =  createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:80/api/"}),
    // baseQuery: fetchBaseQuery({baseUrl: "https://chatinit-backend.onrender.com/api/"}),
    tagTypes: ["Chat", "User", "Message"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: ()=>({
                url: "users/my-chats/",
                credentials: 'include'
            }),
            providesTags: ["Chat"]
        }),

        searchUser: builder.query({
            query: (user)=>({
                url: `users/search/${user}`,
                credentials: 'include'
            }),
            provideTags: ["User"]
        }),

        sendFriendRequest: builder.mutation({
            query: (data)=> ({
                url: "requests/send-request",
                method: "POST",
                credentials: "include",
                body: data
            }),
            invalidateTags: ["User"]
        }),

        getNotifications: builder.query({
            query: ()=> ({
                url: "requests/get-all-notifications",
                credentials: "include",
            }),
           keepUnusedDataFor: 0
        }),

        acceptFriendRequest: builder.mutation({
            query: (data)=> ({
                url: "requests/accept-request",
                method: "POST",
                credentials: "include",
                body: data
            }),
            invalidateTags: ["Chat"]
        }),

        rejectFriendRequest: builder.mutation({
            query: (data)=> ({
                url: "requests/reject-request",
                method: "POST",
                credentials: "include",
                body: data
            }),
            invalidateTags: ["Chat"]
        }),

        requestsSentByMe: builder.query({
            query: (data)=> ({
                url: "requests/requests-sent-by-me",
                credentials: "include"
            }),
            invalidateTags: ["Chat"]
        }),

        requestsReceivedByMe: builder.query({
            query: ()=> ({
                url: "requests/requests-received-by-me",
                credentials: "include"
            }),
            invalidateTags: ["Chat"],
            keepUnusedDataFor: 0
        }),

        otpVerification: builder.mutation({
            query:  (data)=> ({
                url: "auth/otp-verification",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        resendOTP: builder.mutation({
            query:  (data)=> ({
                url: "auth/resend-otp",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        getMessages: builder.mutation({
            query:  (data)=> ({
                url: "messages/get-messages",
                method: "POST",
                credentials: "include",
                body: data
            }),
            keepUnusedDataFor: 0
        }),

        sendAttachment: builder.mutation({
            query:  (data)=> ({
                url: "messages/send-attachment",
                method: "POST",
                credentials: "include",
                body: data
            }),
            providesTags: ["Message"]
        }),

        getMyFriends: builder.query({
            query:  ()=> ({
                url: "users/get-my-friends",
                method: "GET",
                credentials: "include"
            })
        }),

        getMyAvailableFriends: builder.mutation({
            query:  (data)=> ({
                url: "users/get-my-available-friends",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        createNewGroup: builder.mutation({
            query: (data)=>({
                url: "users/create-group",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),
        
        getUserDetails: builder.mutation({
            query: (data)=>({
                url: "users/get-user-details",
                method: "POST",
                credentials: "include", 
                body: data
            })
        }),

        getGroupDetails: builder.mutation({
            query: (data)=>({
                url: "users/get-group-details",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        removeFromGroup: builder.mutation({
            query: (data)=>({
                url: "users/remove-from-group",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        leaveGroup: builder.mutation({
            query: (data)=>({
                url: "users/leave-group",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        addMembersInTheGroup: builder.mutation({
            query: (data)=>({
                url: "users/add-in-group",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        unfriend: builder.mutation({
            query: (data)=>({
                url: "users/unfriend",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        deleteMessage: builder.mutation({
            query: (data)=>({
                url: "messages/delete-message",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        deleteAccount: builder.mutation({
            query: (data)=>({
                url: "auth/delete-account",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        deleteGroup: builder.mutation({
            query: (data)=>({
                url: "users/delete-group",
                method: "POST",
                credentials: "include",
                body: data
            })
        }),

        logout: builder.query({
            query: ()=>({
                url: "auth/logout",
                method: "get",
                credentials: "include"
            }),
            invalidatesTags: ["Chat", "User", "Message"]
        }),

        checkIsLoggedIn: builder.query({
            query: ()=>({
                url: "auth/check-is-logged-in",
                method: "post",
                credentials: "include"
            }),
            invalidatesTags: ["Chat", "User", "Message"]
        })
    })
});

export default api;
export const {useMyChatsQuery, useLazySearchUserQuery, useSendFriendRequestMutation, useGetNotificationsQuery, useAcceptFriendRequestMutation, useRejectFriendRequestMutation, useRequestsReceivedByMeQuery, useRequestsSentByMeQuery, useOtpVerificationMutation, useResendOTPMutation, useGetMessagesMutation, useSendAttachmentMutation, useGetMyFriendsQuery, useGetMyAvailableFriendsMutation, useCreateNewGroupMutation, useGetUserDetailsMutation, useGetGroupDetailsMutation, useRemoveFromGroupMutation, useLeaveGroupMutation, useAddMembersInTheGroupMutation, useUnfriendMutation, useDeleteMessageMutation, useDeleteAccountMutation, useDeleteGroupMutation, useLazyLogoutQuery, useLazyCheckIsLoggedInQuery} = api;