
import { Howl } from 'howler'

type SoundChannel = 'sfx' | 'music' | 'ambient'

class SoundManager {
    private cache = new Map<string, { howl: Howl; channel: SoundChannel }>()
    private channelVolumes: Record<SoundChannel, number> = {
        sfx: 0.6,
        music: 0.1,
        ambient: 0.6,
    }
    private currentMusic: Howl | null = null
    private currentMusicSrc: string | null = null
    private activeAmbients = new Map<string, number>()
    private mutedVolumes: Partial<Record<SoundChannel, number>> = {}

    preloadMusic(src: string, key: string = src) {
        this.get(src, 'music', key, { loop: true })
    }

    preloadAmbient(src: string, key: string = src) {
        this.get(src, 'ambient', key, { loop: true })
    }

    preloadSFX(src: string, key: string = src) {
        this.get(src, 'sfx', key)
    }

    private get(src: string, channel: SoundChannel, key: string = src, options: Partial<{ loop: boolean }> = {}) {
        if (!this.cache.has(key)) {
            const howl = new Howl({
                src: [src],
                volume: this.channelVolumes[channel],
                loop: options.loop ?? false,
            })
            this.cache.set(key, { howl, channel })
        }
        return this.cache.get(key)!.howl
    }

    playSFX(src: string, volumeScale = 1) {
        const howl = this.get(src, 'sfx')
        const id = howl.play()
        if (volumeScale !== 1) {
            howl.volume(this.channelVolumes.sfx * volumeScale, id)
        }
        return id
    }

    playSFXAtPosition(src: string, sourcePos: [number, number, number], listenerPos: [number, number, number], maxDistance = 10, volumeScale = 1) {
        const dx = sourcePos[0] - listenerPos[0]
        const dz = sourcePos[2] - listenerPos[2]
        const distance = Math.sqrt(dx * dx + dz * dz)
        const volume = Math.max(0, 1 - distance / maxDistance)

        const howl = this.get(src, 'sfx')
        const id = howl.play()
        if (volumeScale !== 1) {
            howl.volume(this.channelVolumes.sfx * volumeScale, id)
        }
        howl.volume(volume * this.channelVolumes.sfx, id)
        return id
    }

    playAmbient(src: string, key: string = src, volumeScale = 1): number {
        // If already playing, don't start a duplicate
        if (this.activeAmbients.has(key)) {
            return this.activeAmbients.get(key)!
        }

        const howl = this.get(src, 'ambient', key, { loop: true })

        const startPlaying = () => {
            // Guard again in case a race let two calls through before this resolved
            if (this.activeAmbients.has(key)) {
                return
            }
            const id = howl.play()
            if (volumeScale !== 1) {
                howl.volume(this.channelVolumes.ambient * volumeScale, id)
            }
            this.activeAmbients.set(key, id)
        }

        if (howl.state() === 'loaded') {
            startPlaying()
        } else {
            howl.once('load', startPlaying)
        }

        return -1
    }

    playAmbientAtPosition(src: string, key: string, sourcePos: [number, number, number], listenerPos: [number, number, number], maxDistance = 15) {
        const dx = sourcePos[0] - listenerPos[0]
        const dz = sourcePos[2] - listenerPos[2]
        const distance = Math.sqrt(dx * dx + dz * dz)
        const volume = Math.max(0, 1 - distance / maxDistance)

        const howl = this.get(src, 'ambient', key, { loop: true })
        const existingId = this.activeAmbients.get(key)

        if (existingId !== undefined) {
            // already playing — just update its volume, don't create a new instance
            howl.volume(volume * this.channelVolumes.ambient, existingId)
            return existingId
        }

        const id = howl.play()
        howl.volume(volume * this.channelVolumes.ambient, id)
        this.activeAmbients.set(key, id)
        return id
    }

    playMusic(src: string, key: string = src, fade = 800) {
        if (this.currentMusicSrc === src) {
            return -1
        }

        const next = this.get(src, 'music', key, { loop: true })

        if (this.currentMusic) {
            const prev = this.currentMusic
            prev.fade(prev.volume(), 0, fade)
            prev.once('fade', () => prev.stop())
        }

        const id = next.play()
        next.volume(0)
        next.fade(0, this.channelVolumes.music, fade)

        this.currentMusic = next
        this.currentMusicSrc = src
        return id
    }

    stopAmbient(src: string, key: string = src) {
        const entry = this.cache.get(src)
        const id = this.activeAmbients.get(key)
        if (!entry || id === undefined) return

        entry.howl.stop(id)
        this.activeAmbients.delete(src)
    }

    setChannelVolume(channel: SoundChannel, volume: number) {
        this.channelVolumes[channel] = volume
        
        this.cache.forEach(({ howl, channel: c }) => {
            if (c === channel) {
                howl.volume(volume)
            }
        })
    }

    muteChannel(channel: SoundChannel) {
        this.mutedVolumes[channel] = this.channelVolumes[channel]
        this.setChannelVolume(channel, 0)
    }

    unmuteChannel(channel: SoundChannel) {
        const restored = this.mutedVolumes[channel]
        if (restored !== undefined) {
            this.setChannelVolume(channel, restored)
            delete this.mutedVolumes[channel]
        }
    }

    toggleMuteChannel(channel: SoundChannel) {
        if (this.mutedVolumes[channel] !== undefined) {
            this.unmuteChannel(channel)
        } else {
            this.muteChannel(channel)
        }
    }
}

export const soundManager = new SoundManager()