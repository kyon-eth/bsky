import { create } from 'zustand';

interface LoadingState {
  isModelLoading: boolean;
  setModelLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isModelLoading: true,
  setModelLoading: (loading) => set({ isModelLoading: loading }),
})); 