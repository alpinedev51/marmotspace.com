'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const container = useRef<HTMLDivElement>(null)
  const svgWrapper = useRef<HTMLDivElement>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const isDragging = useRef(false)
  const dragStart = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
  const scrollStart = useRef<{ left: number, top: number }>({ left: 0, top: 0 })

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      fontSize: 16,
      flowchart: {
        diagramPadding: 24,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        diagramMarginX: 24,
        diagramMarginY: 24
      }
    })

    if (svgWrapper.current) {
      const id = 'mermaid-' + Math.floor(Math.random() * 1000000)

      // Render the mermaid chart as SVG
      mermaid.render(id, chart)
        .then(({ svg }) => {
          svgWrapper.current!.innerHTML = svg
        }).catch((err) => {
          container.current!.innerHTML = `<pre style="color:red;">Mermaid render error:\n${err.message}</pre>`
          console.error('Mermaid render failed:', err)
        })
    }
  }, [chart])

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  useEffect(() => {
    const elem = container.current
    if (!elem) return

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      dragStart.current = { x: e.clientX, y: e.clientY }
      scrollStart.current = { left: elem.scrollLeft, top: elem.scrollTop }
      elem.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      elem.scrollLeft = scrollStart.current.left - dx
      elem.scrollTop = scrollStart.current.top - dy
    }

    const handleMouseUp = () => {
      isDragging.current = false
      elem.style.cursor = 'default'
    }

    elem.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      elem.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

  }, [])

  return (
    <div
      ref={container}
      className="mermaid-wrapper relative my-8 overflow-auto cursor-grab"
      onClick={toggleZoom}
    >
      <div
        ref={svgWrapper}
        className={`transform-origin-center duration-300 transition-transform origin-top-left ${isZoomed ? 'scale-150' : 'scale-110'}`}
      />
    </div>
  )
}
