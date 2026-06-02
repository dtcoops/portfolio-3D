import type { AnimationState } from "../../types/AnimationStates"

type JumpPhase = 'none' | 'up' | 'air' | 'down'

export class AnimationController {
  private state: AnimationState = 'Idle'
  private airborne = false
  private jumpPhase: JumpPhase = 'none'

  getAnimation(): AnimationState {
    return this.state
  }

  isAirborne(): boolean {
    return this.airborne
  }

  getJumpPhase(): JumpPhase {
    return this.jumpPhase
  }

  update(isMoving: boolean, isRunning: boolean): void {
    if (this.airborne) return
    this.state = isMoving && isRunning ? 'Running' 
    : isMoving ? 'Walking' 
    : 'Idle'
  }

  onJump(runningBack = false): void {
    this.airborne = true
    this.jumpPhase = 'up'
    this.state = runningBack ? 'Running Jump' : 'Jump Up'
  }

  onFall(): void {
    this.airborne = true
    this.jumpPhase = 'air'
    this.state = 'Air Time'
  }

  onJumpUpFinished(): void {
    if (this.jumpPhase !== 'up') return
    this.jumpPhase = 'air'
    this.state = 'Air Time'
  }

  // Returns true only on the first call (i.e. the actual landing moment)
  onLand(): boolean {
    if (!this.airborne || this.jumpPhase === 'down') return false
    this.jumpPhase = 'down'
    this.state = 'Jump Down'
    return true
  }

  onJumpDownFinished(): void {
    this.airborne = false
    this.jumpPhase = 'none'
    // update() will set the correct ground state on the next frame
  }
}
