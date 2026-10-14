import { create } from "zustand";

type State = {
  isOpen: boolean,
  toggle: () => void
}

export const sidePanelOpen = create<State>((set) => ({
  isOpen:true,
  // Toggle boolean using previous state
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
