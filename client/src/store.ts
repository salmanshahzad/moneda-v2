import create from "zustand";

export interface State {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface User {
  id: number;
  username: string;
  categories: Category[];
  isTwoFactorEnabled: boolean;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  colour: string;
  target: number;
}

export type CategoryType = "income" | "expense";

const useStore = create<State>((set) => ({
  user: null,
  setUser: (user: User | null) => set(() => ({ user })),
}));

export default useStore;
