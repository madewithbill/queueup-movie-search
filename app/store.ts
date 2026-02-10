import { create } from "zustand";

interface UseHistory {
  referralPath: string;
  setPath: (pathname: string) => void;
}

export const useHistory = create<UseHistory>()((set) => ({
  referralPath: "",
  setPath: (pathname) => set({ referralPath: pathname }),
}));
