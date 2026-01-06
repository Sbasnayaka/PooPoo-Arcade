'use client'

import { useCallback, useRef } from 'react'
import { create } from 'zustand'

interface AudioState {
    isMuted: boolean
    toggleMute: () => void
}

export const useAudioStore = create<AudioState>((set) => ({
    isMuted: false,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}))

export function useAudio() {
    const { isMuted } = useAudioStore()

    // We would normally preload these, but for this demo we'll create them on the fly or use refs
    // Using simple oscillator synths for "brutalist" squelches if no assets, 
    // but let's try to assume we might have assets later. For now, we'll generate sound via Web Audio API
    // to avoid needing external files, which fits the "Brutalist/Code-only" vibe perfectly.

    const playTone = useCallback((type: 'squelch' | 'fart' | 'flush') => {
        if (isMuted) return
        if (typeof window === 'undefined') return

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContext) return

        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        const now = ctx.currentTime

        if (type === 'squelch') {
            // Wet squelch: fast frequency drop with modulation
            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(400, now)
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.1)
            gain.gain.setValueAtTime(1, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
            osc.start(now)
            osc.stop(now + 0.1)
        } else if (type === 'fart') {
            // Low saw wave with stutter
            osc.type = 'sawtooth'
            osc.frequency.setValueAtTime(80, now)
            osc.frequency.linearRampToValueAtTime(40, now + 0.3)
            gain.gain.setValueAtTime(1, now)
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3)
            osc.start(now)
            osc.stop(now + 0.3)
        } else if (type === 'flush') {
            // White noise approximation usually, but simple low pass sine for drain
            osc.type = 'sine'
            osc.frequency.setValueAtTime(200, now)
            osc.frequency.exponentialRampToValueAtTime(10, now + 1.5)
            gain.gain.setValueAtTime(0.5, now)
            gain.gain.linearRampToValueAtTime(0.01, now + 1.5)
            osc.start(now)
            osc.stop(now + 1.5)
        }
    }, [isMuted])

    return {
        playSquelch: () => playTone('squelch'),
        playFart: () => playTone('fart'),
        playFlush: () => playTone('flush')
    }
}
