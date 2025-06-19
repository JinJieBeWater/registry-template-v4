import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

export interface PointerHintProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * ID of the element to track cursor within
   */
  trackId?: string
  /**
   * The content to display in the hint
   */
  children?: React.ReactNode
  /**
   * Optional variant for different hint types
   */
  variant?: 'default' | 'success' | 'error' | 'warning'
  /**
   * Optional offset from the pointer position
   */
  offset?: { x: number; y: number }
  /**
   * Hide the hint when cursor is over clickable elements
   */
  hideOnClickable?: boolean
  /**
   * Size of the cursor effect in pixels
   */
  size?: number
}

export function PointerHint({ trackId, children, className, variant = 'default', offset = { x: 0, y: 0 }, hideOnClickable = false, size = 30, ...props }: PointerHintProps) {
  const [mounted, setMounted] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = React.useState(false)
  const [isInner, setIsInner] = React.useState(false)
  const tooltipRef = React.useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const calculateTooltipPosition = (mouseX: number, mouseY: number) => {
    if (!tooltipRef.current) return { x: mouseX + 20, y: mouseY + 20 }

    const tooltip = tooltipRef.current
    const tooltipRect = tooltip.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const padding = 10 // 边距

    let x = mouseX + 20
    let y = mouseY + 20

    // 检查右边界
    if (x + tooltipRect.width > viewportWidth - padding) {
      x = mouseX - tooltipRect.width - 10
    }

    // 检查下边界
    if (y + tooltipRect.height > viewportHeight - padding) {
      y = mouseY - tooltipRect.height - 10
    }

    return { x, y }
  }

  React.useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      if (trackId) {
        const el = document.getElementById(trackId)
        if (el) {
          const rect = el.getBoundingClientRect()
          const inner = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
          setIsInner(inner)
        } else {
          console.warn(`Element with id ${trackId} not found`)
          setIsInner(false)
        }
      } else {
        setIsInner(true)
      }

      if (hideOnClickable) {
        const target = e.target as HTMLElement
        setIsPointer(window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer')
      }

      const x = e.clientX + offset.x
      const y = e.clientY + offset.y

      setPosition({ x, y })
      setTooltipPosition(calculateTooltipPosition(x, y))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [trackId, offset.x, offset.y, hideOnClickable, mounted])

  React.useEffect(() => {
    if (children) {
      setTooltipPosition(calculateTooltipPosition(position.x, position.y))
    }
  }, [children])

  const variantStyles = {
    default: 'bg-background/95 text-foreground shadow-sm backdrop-blur-[8px] border border-border/40',
    success: 'bg-emerald-500/95 text-emerald-50 shadow-sm backdrop-blur-[8px] border border-emerald-600/20',
    error: 'bg-destructive/95 text-destructive-foreground shadow-sm backdrop-blur-[8px] border border-destructive/30',
    warning: 'bg-yellow-500/95 text-yellow-50 shadow-sm backdrop-blur-[8px] border border-yellow-600/20',
  }

  const content = (
    <div
      className="fixed left-0 top-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 9999 }}>
      <div
        className={cn(
          'absolute pointer-events-none rounded-full will-change-transform',
          'bg-primary/10 ring-2 ring-primary/20 mix-blend-plus-lighter',
          'transition-all duration-200 ease-out',
          className
        )}
        style={{
          width: size,
          height: size,
          transform: `translate(${position.x - size / 2}px, ${position.y - size / 2}px)`,
        }}
      />
      {children && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute pointer-events-none rounded-lg px-3 py-2',
            'text-sm font-medium antialiased',
            'transform-gpu transition-all duration-200 ease-out',
            variantStyles[variant],
            className
          )}
          style={{
            transform: `translate(${tooltipPosition.x}px, ${tooltipPosition.y}px)`,
          }}
          {...props}>
          {children}
        </div>
      )}
    </div>
  )

  if (!mounted || !isInner || (hideOnClickable && isPointer)) {
    return null
  }

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body)
  }

  return null
}
