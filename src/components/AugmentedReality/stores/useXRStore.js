import  create  from "zustand";

const useXRStore = create((set) => ({
  isPresenting: false,
  setIsPresenting: (value) => set({ isPresenting: value }),
}));

export default useXRStore;
