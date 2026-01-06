'use client'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface ContainerProps {
    children: React.ReactNode
    className?: string
    noRotation?: boolean
}

export default function Container({ children, className, noRotation }: ContainerProps) {
    const [rotation, setRotation] = useState(0)

    useEffect(() => {
        if (!noRotation) {
            // Chaos theory: -2 to +2 deg
            const rot = Math.random() * 4 - 2;
            setRotation(rot);
        }
    }, [noRotation])

    return (
        <div
            className={twMerge(
                "bg-cardboard border-4 border-black shadow-[8px_8px_0px_#000] p-6 text-septic transition-transform duration-300 hover:scale-[1.02]",
                className
            )}
            style={{
                transform: `rotate(${rotation}deg)`
            }}
        >
            {children}
        </div>
    )
}
