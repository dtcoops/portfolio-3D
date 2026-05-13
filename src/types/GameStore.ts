
interface GameStore {
  hubReturnPosition: [number, number, number]
  visitedLevels: Set<string>
  isTransitioning: boolean
  setHubReturnPosition: (pos: [number, number, number]) => void
  markVisited: (level: string) => void
  setTransitioning: (v: boolean) => void
}

export type { GameStore }