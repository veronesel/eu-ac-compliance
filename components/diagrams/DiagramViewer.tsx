'use client'

import { useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Download, RotateCcw } from 'lucide-react'

interface DiagramViewerProps {
  title: string
  filename: string
  children: React.ReactNode
}

export default function DiagramViewer({ title, filename, children }: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  function zoomIn() { setScale(s => Math.min(s + 0.2, 3)) }
  function zoomOut() { setScale(s => Math.max(s - 0.2, 0.4)) }
  function reset() { setScale(1) }

  function download() {
    const svgEl = containerRef.current?.querySelector('svg')
    if (!svgEl) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svgEl)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <span className="text-sm font-medium text-[#0F172A]">{title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#94A3B8] w-10 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Reset zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-[#E2E8F0] mx-1" />
          <button
            onClick={download}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Download SVG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-auto p-4" style={{ maxHeight: '600px' }}>
        <div
          ref={containerRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
