import { create } from "zustand";

type ContactPanelState = {
  open: boolean;
  openContact: () => void;
  closeContact: () => void;
};

export const useContactPanelStore = create<ContactPanelState>((set) => ({
  open: false,
  openContact: () => set({ open: true }),
  closeContact: () => set({ open: false }),
}));
