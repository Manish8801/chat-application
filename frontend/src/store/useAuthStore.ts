import IAuthUser from "./useAuthStore";
import { create } from "zustand";
import axiosInstance from "../lib/axio";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:5001";
export interface IAuthUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic: string;
  createdAt: string;
}

interface ISignupData {
  email: string;
  password: string;
  fullName: string;
}

interface ILoginData {
  email: string;
  password: string;
}

interface IUpdateData {
  profilePic: string | ArrayBuffer | null;
}

interface IAuthStore {
  authUser: IAuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  signup: (data: ISignupData) => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (data: ILoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: IUpdateData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const useAuthStore = create<IAuthStore>()((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data: ISignupData) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully.");

      get().connectSocket();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred while signing up.");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data: ILoginData) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully.");
      get().connectSocket();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occured while logging in.");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occured while logging out.");
      }
    }
  },
  updateProfile: async (data: IUpdateData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("./auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile update successfully.");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(
          "An unexpected error occurred while updating use profile picture."
        );
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const authUser = get().authUser;

    // if there's not signed in user or there's already a socket exists or connected
    if (!authUser || get().socket?.connected) return;

    // create a new socket
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    // then, connect it
    socket.connect();

    // and set it
    set({ socket });

    // then get and set online users by their _ids
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
export default useAuthStore;
