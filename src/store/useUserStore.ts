import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  batteries: number;
  streak: number;
  streakFreezes: number;
  coins: number;
  totalScore: number;
  deductBattery: () => void;
  addCoin: (amount: number) => void;
  buyItem: (type: 'freeze' | 'battery', cost: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Default values used if localStorage is empty
      batteries: 5,
      streak: 0,
      streakFreezes: 0,
      coins: 100,
      totalScore: 100,

      deductBattery: () =>
        set((state) => ({
          batteries: Math.max(0, state.batteries - 1),
        })),

      addCoin: (amount) =>
        set((state) => ({
          coins: state.coins + amount,
          totalScore: state.totalScore + amount,
        })),

      buyItem: (type, cost) =>
        set((state) => {
          if (state.coins < cost) return state;
          if (type === 'freeze')
            return { coins: state.coins - cost, streakFreezes: state.streakFreezes + 1 };
          if (type === 'battery')
            return { coins: state.coins - cost, batteries: state.batteries + 1 };
          return state;
        }),
    }),
    {
      name: 'palmo-user-storage', // unique name for the item in localStorage
      storage: createJSONStorage(() => localStorage), // explicitly use localStorage
    }
  )
);