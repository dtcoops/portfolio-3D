
interface GameStore {
  hubReturnPosition: [number, number, number]
  visitedLevels: Set<string>
  isTransitioning: boolean
  serverOnline: boolean
  setHubReturnPosition: (pos: [number, number, number]) => void
  markVisited: (level: string) => void
  setTransitioning: (v: boolean) => void
  setServerOnline: (v: boolean) => void
}

export type { GameStore }