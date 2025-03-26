import { create } from "zustand";

interface ITheme {
  theme: string;
  setTheme: (theme: string) => void;
}

const useThemeStore = create<ITheme>()((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme: string) => {
    set({ theme });
    
    localStorage.setItem("chat-theme", theme);
  },
}));

export default useThemeStore;
