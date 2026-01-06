'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { usePathname } from 'next/navigation'

export default function FlushTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    useEffect(() => {
        // On mount (page change entry), animate in (swirl up?) or just static
        // Real page transitions in Next.js App Router are unique (template.tsx).
        // For now, let's just animate the CHILDREN on mount.

        gsap.fromTo("#flush-container",
            { rotation: -360, scale: 0, opacity: 0 },
            { rotation: 0, scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
        )
    }, [pathname])

    return (
        <div id="flush-container" className="w-full h-full">
            {children}
        </div>
    )
}
