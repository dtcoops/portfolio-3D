import { create } from 'zustand'
import type { GameStore } from '../types/GameStore'

export const useGameStore = create<GameStore>((set) => ({
  hubReturnPosition: [0, 1, 10],
  visitedLevels: new Set(),
  isTransitioning: false,
  serverOnline: false,
  setHubReturnPosition: (pos) => set({ hubReturnPosition: pos }),
  markVisited: (level) =>
    set((s) => ({ visitedLevels: new Set([...s.visitedLevels, level]) })),
  setTransitioning: (v) => set({ isTransitioning: v }),
  setServerOnline: (v) => set({ serverOnline: v }),
}))