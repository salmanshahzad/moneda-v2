import create from "zustand";

export interface State {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface User {
  id: number;
  username: string;
}

const useStore = create<State>((set) => ({
  user: null,
  setUser: (user: User | null) => set(() => ({ user })),
}));

export default useStore;
