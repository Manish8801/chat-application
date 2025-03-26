import { create } from "zustand";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import useAuthStore, { type IAuthUser } from "./useAuthStore";
import axiosInstance from "../lib/axio";
interface IMessageData {
  text: string;
  image?: string | ArrayBuffer | null;
}
export interface IMessage {
  _id: string;
  receiverId: string;
  senderId: string;
  text: string;
  image: string;
  createdAt: string;
}

interface IChat {
  messages: IMessage[];
  users: IAuthUser[];
  selectedUser: IAuthUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: IAuthUser | null) => void;
  sendMessage: (messageData: IMessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
export const useChatStore = create<IChat>()((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred while fetching users.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred fetching messages.");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: IMessageData) => {
    const { selectedUser, messages } = get();

    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred while sending message.");
      }
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId !== selectedUser._id;

      if (isMessageSentFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");
  },
  
  setSelectedUser: (selectedUser: IAuthUser | null) => {
    set({ selectedUser });
  },
}));
export default useChatStore;
