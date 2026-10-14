import { create } from "zustand";

type View = "session" | "heatmap";

type State = {
  view: View;
  setView: (view: View) => void;
};

export const useViewMode = create<State>((set) => ({
  view: "session",

  setView: (view) => set({ view }),
}));
