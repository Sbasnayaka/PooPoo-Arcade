'use client'

import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { usePhysics } from './PhysicsProvider'

export default function GamePile() {
    const { world, engine } = usePhysics()
    const sceneRef = useRef<HTMLDivElement>(null)

    // Track bodies to sync positions with React state if needed, 
    // but for raw performance we often let Matter.js drive the position 
    // and just sync via a ref loop or use a custom renderer. 
    // For this "Brutalist" vibe, we can do a hybrid: 
    // Spawn bodies invisible, and map DOM elements to them.

    const [games] = useState([
        { id: 'tictacturd', color: '#D8B370', label: 'Tic Tac Turd' },
        { id: 'battleflush', color: '#7C3F00', label: 'Battleflush' },
        { id: 'blockpoop', color: '#CCFF00', label: 'Coming Soon' },
        // Duplicate for pile effect
        { id: 'p1', color: '#D8B370', label: 'Pile Item 1' },
        { id: 'p2', color: '#7C3F00', label: 'Pile Item 2' },
    ])

    const bodiesRef = useRef<Map<string, Matter.Body>>(new Map())
    const elementsRef = useRef<Map<string, HTMLDivElement | null>>(new Map())

    useEffect(() => {
        if (!world || !engine || !sceneRef.current) return

        const width = sceneRef.current.clientWidth
        const height = sceneRef.current.clientHeight

        // Boundaries
        const ground = Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true })
        const wallLeft = Matter.Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true })
        const wallRight = Matter.Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true })

        Matter.Composite.add(world, [ground, wallLeft, wallRight])

        // Spawn Game Bodies
        games.forEach((game, index) => {
            const x = Math.random() * (width - 100) + 50
            const y = -Math.random() * 500 - 100 // Start above screen

            const body = Matter.Bodies.rectangle(x, y, 160, 96, { // approx w-40 h-24
                restitution: 0.1, // low bounce
                friction: 0.9,    // sticky
                chamfer: { radius: 4 },
                angle: Math.random() * Math.PI * 2
            })

            bodiesRef.current.set(game.id, body)
            Matter.Composite.add(world, body)
        })

        // Mouse Interaction
        const mouse = Matter.Mouse.create(sceneRef.current)
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        })
        Matter.Composite.add(world, mouseConstraint)

        // Allow scrolling if not dragging body (simple pointer event fix handled by Matter potentially, 
        // but for now we let Matter capture events on the container)

        // Sync Loop
        let animationFrameId: number
        const update = () => {
            bodiesRef.current.forEach((body, id) => {
                const el = elementsRef.current.get(id)
                if (el) {
                    const { x, y } = body.position
                    const angle = body.angle
                    el.style.transform = `translate(${x - 80}px, ${y - 48}px) rotate(${angle}rad)` // center offset
                }
            })
            animationFrameId = requestAnimationFrame(update)
        }
        update()

        return () => {
            cancelAnimationFrame(animationFrameId)
            Matter.Composite.remove(world, [ground, wallLeft, wallRight, mouseConstraint])
            bodiesRef.current.forEach(body => Matter.Composite.remove(world, body))
            bodiesRef.current.clear()
        }
    }, [world, engine, games])

    return (
        <div ref={sceneRef} className="absolute inset-0 overflow-hidden pointer-events-auto z-10">
            {games.map(game => (
                <div
                    key={game.id}
                    ref={el => { elementsRef.current.set(game.id, el); }}
                    className="absolute w-40 h-24 flex items-center justify-center border-4 border-black text-center font-display text-sm p-2 shadow-[4px_4px_0px_#000] cursor-grab active:cursor-grabbing select-none hover:brightness-110"
                    style={{
                        backgroundColor: game.color,
                        color: game.color === '#7C3F00' ? '#E6D1AB' : '#3E1C00',
                        willChange: 'transform',
                        top: 0,
                        left: 0,
                    }}
                    onPointerDown={(e) => {
                        // Prevent navigation if dragging logic is heavy, but for now simple click works if we don't drag far.
                        // Ideally we check if it was a drag or a click.
                        // For simplicity in this rough physics demo, we'll use a double click or just rely on the fact that dragging prevents click propagation usually.
                        // Actually, let's just make it a link but we need to stop propagation if dragging.
                        // Workaround: Add a small button inside or make the whole thing clickable if velocity is low.
                    }}
                >
                    <a href={`/games/${game.id}`} className="w-full h-full flex items-center justify-center pointer-events-none">
                        <span className="pointer-events-auto">{game.label}</span>
                    </a>
                </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 text-center text-burnt-sienna font-irony pointer-events-none opacity-50">
                Drag to dig...
            </div>
        </div>
    )
}
