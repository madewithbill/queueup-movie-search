import { create } from "zustand";

interface UseHistory {
  referralPath: string;
  setReferralPath: (pathname: string) => void;
}

const useHistory = create<UseHistory>()((set) => ({
  referralPath: "",
  setReferralPath: (pathname) => set({ referralPath: pathname }),
}));
