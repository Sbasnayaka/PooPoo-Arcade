'use client'

import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useAudio } from '@/hooks/useAudio'

interface SquelchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'
}

export default function SquelchButton({ children, className, variant = 'primary', ...props }: SquelchButtonProps) {
    const [scale, setScale] = useState({ x: 1, y: 1 })
    // @ts-ignore
    const { playSquelch } = useAudio()

    const handleMouseDown = () => {
        // Squelch effect: flatten y, expand x
        setScale({ x: 1.1, y: 0.9 })
        if (playSquelch) playSquelch()
    }

    const handleMouseUp = () => {
        // Bounce back
        setScale({ x: 0.95, y: 1.05 })
        setTimeout(() => setScale({ x: 1, y: 1 }), 150)
    }

    const baseStyles = "font-display text-xl border-4 border-black shadow-[6px_6px_0px_#000] transition-transform duration-100 flex items-center justify-center px-6 py-3 cursor-pointer select-none"
    const variants = {
        primary: "bg-sewage text-fawn hover:bg-opacity-90",
        secondary: "bg-cardboard text-septic hover:bg-opacity-90"
    }

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setScale({ x: 1, y: 1 })}
            style={{
                transform: `scale(${scale.x}, ${scale.y})`,
            }}
            {...props}
        >
            {children}
        </button>
    )
}
