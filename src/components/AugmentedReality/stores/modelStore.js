import create from "zustand";

const useModelsStore = create((set) => ({
  modelsStore: [],
  setModelsStore: (newModels) => set({ models: newModels }),
}));

export default useModelsStore;
