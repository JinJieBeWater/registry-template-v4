'use client'

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { motion, useMotionValue, warning } from 'motion/react'
import { cn } from '@/lib/utils'
import { createPortal } from 'react-dom'

const variants = {
  hidden: {
    scale: 0,
  },
  cursorEnter: {
    scale: 1,
  },
  cursorLeave: {
    scale: 0,
  },
  cursorDown: {
    scale: 1.5,
  },
  info: {},
  success: {},
  warning: {},
  error: {},
}

type CursorContextType = {
  initialCursorVariant: string
  setinitialCursorVariant: Dispatch<SetStateAction<string>>
  animateCursorVariant: string
  setAnimateCursorVariant: Dispatch<SetStateAction<string>>
  animateCursor: (variant: keyof typeof variants) => void
}

const CursorContext = createContext<CursorContextType>({
  initialCursorVariant: '',
  setinitialCursorVariant: () => {},
  animateCursorVariant: '',
  setAnimateCursorVariant: () => {},
  animateCursor: () => {},
})

export const useCursorContext = () => useContext(CursorContext)

type CursorContextProviderProps = {
  children: ReactNode
  container?: string
}

export const CursorContextProvider = ({ children }: CursorContextProviderProps) => {
  const [initialCursorVariant, setinitialCursorVariant] = useState('hidden')
  const [animateCursorVariant, setAnimateCursorVariant] = useState('')
  const animateCursor = (variant: string) => {
    setinitialCursorVariant(animateCursorVariant)
    setAnimateCursorVariant(variant)
  }
  return (
    <CursorContext.Provider
      value={{
        initialCursorVariant,
        setinitialCursorVariant,
        animateCursorVariant,
        setAnimateCursorVariant,
        animateCursor,
      }}>
      {children}
    </CursorContext.Provider>
  )
}

function Cursor({ containerSelector: containerSelector = 'body' }: { containerSelector?: string }) {
  const { initialCursorVariant, animateCursorVariant, animateCursor } = useCursorContext()

  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      const cursor = cursorRef.current
      if (cursor) {
        cursorX.set(e.clientX - cursor.offsetWidth / 2)
        cursorY.set(e.clientY - cursor.offsetHeight / 2)
      }
      const el = document.querySelector(containerSelector)
      if (el) {
        const rect = el.getBoundingClientRect()
        const inner = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        animateCursor(inner ? 'cursorEnter' : 'cursorLeave')
      } else {
        console.warn(`Element with id ${containerSelector} not found`)
      }
    }
    const mouseEnterHandler = () => {
      animateCursor('cursorEnter')
    }
    const mouseLeaveHandler = () => {
      animateCursor('cursorLeave')
    }
    const mouseDownHandler = () => {
      animateCursor('cursorDown')
    }
    const mouseUpHandler = () => {
      animateCursor('cursorEnter')
    }
    const container = document.querySelector(containerSelector)

    window.addEventListener('mousemove', mouseMoveHandler)
    if (container) {
      container.addEventListener('mouseenter', mouseEnterHandler)
      container.addEventListener('mouseleave', mouseLeaveHandler)
      container.addEventListener('mousedown', mouseDownHandler)
      container.addEventListener('mouseup', mouseUpHandler)
    }
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler)
      if (container) {
        container.removeEventListener('mouseenter', mouseEnterHandler)
        container.removeEventListener('mouseleave', mouseLeaveHandler)
        container.removeEventListener('mousedown', mouseDownHandler)
        container.removeEventListener('mouseup', mouseUpHandler)
      }
    }
  }, [containerSelector])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted &&
        createPortal(
          <div className="fixed left-0 top-0 w-screen h-screen pointer-events-none z-[9999]">
            <motion.div
              ref={cursorRef}
              className={cn('absolute pointer-events-none w-6 h-6 rounded-full', 'bg-primary/10 ring-2 ring-primary/20 transition-all duration-200 ease-out')}
              variants={variants}
              initial={initialCursorVariant}
              animate={animateCursorVariant}
              style={{
                translateX: cursorX,
                translateY: cursorY,
                transformOrigin: 'center',
              }}></motion.div>
          </div>,
          (containerSelector && document.getElementById(containerSelector)) || document.body
        )}
    </>
  )
}
export default Cursor
