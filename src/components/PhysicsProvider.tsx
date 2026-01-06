'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'

interface PhysicsContextType {
    engine: Matter.Engine | null
    world: Matter.World | null
}

const PhysicsContext = createContext<PhysicsContextType>({
    engine: null,
    world: null,
})

export const usePhysics = () => useContext(PhysicsContext)

export default function PhysicsProvider({ children }: { children: React.ReactNode }) {
    const [engine, setEngine] = useState<Matter.Engine | null>(null)
    const renderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // 1. Setup Matter.js Engine
        const newEngine = Matter.Engine.create({
            gravity: { x: 0, y: 1.5, scale: 0.001 }, // Heavy gravity
        })

        // 2. Setup Runner
        const runner = Matter.Runner.create()

        // 3. Start Loop
        Matter.Runner.run(runner, newEngine)

        setEngine(newEngine)

        // Cleanup
        return () => {
            Matter.Runner.stop(runner)
            Matter.Engine.clear(newEngine)
        }
    }, [])

    return (
        <PhysicsContext.Provider value={{ engine, world: engine?.world ?? null }}>
            <div ref={renderRef} className="fixed inset-0 pointer-events-none z-[-1] opacity-0" />
            {children}
        </PhysicsContext.Provider>
    )
}
