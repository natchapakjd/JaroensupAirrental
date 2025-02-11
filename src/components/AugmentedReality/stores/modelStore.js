import  create  from "zustand";

const useModelsStore = create((set) => ({
  models: [], // เก็บรายการโมเดล
  selectedModel: null, // เก็บ id ของโมเดลที่เลือก
  setModels: (newModels) => set({ models: newModels }),
  setSelectedModel: (id) => set({ selectedModel: id }),
  
  rotateSelectedModel: (rotationAmount) => set((state) => {
    return {
      models: state.models.map((model) =>
        model.id === state.selectedModel
          ? { ...model, rotation: (model.rotation || 0) + rotationAmount }
          : model
      ),
    };
  }),

  isAnimating: false,
  toggleAnimation: () => set((state) => ({ isAnimating: !state.isAnimating })),

  showGeometry: true,
  toggleGeometry: () => set((state) => ({ showGeometry: !state.showGeometry })),
  
  removeModelById: (id) => set((state) => ({
    models: state.models.filter((model) => model.id !== id),
    selectedModel: state.selectedModel === id ? null : state.selectedModel,
  })),
}));

export default useModelsStore;
