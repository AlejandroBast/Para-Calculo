"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import { evaluate } from "mathjs"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface Plot3DProps {
  data: {
    x: number[]
    y: number[]
    z: number[][]
    type: string
    colorscale: string
  }
  functionName: string
  markedX?: number
  markedY?: number
}

export default function Plot3D({ data, functionName, markedX = 0, markedY = 0 }: Plot3DProps) {
  const indicatorTrace = useMemo(() => {
    try {
      const z = evaluate(functionName, { x: markedX, y: markedY })
      const zValue = typeof z === "number" ? z : 0

      return {
        x: [markedX],
        y: [markedY],
        z: [zValue],
        mode: "markers+text",
        marker: {
          size: 12,
          color: "red",
          symbol: "diamond",
          line: { color: "darkred", width: 2 },
        },
        text: [`(${markedX.toFixed(2)}, ${markedY.toFixed(2)})<br>z=${zValue.toFixed(2)}`],
        textposition: "top center",
        name: `Punto: (${markedX}, ${markedY})`,
        hoverinfo: "text",
        type: "scatter3d",
      }
    } catch {
      return null
    }
  }, [markedX, markedY, functionName])

  const plotDataWithIndicator = useMemo(() => {
    if (indicatorTrace) {
      return [data, indicatorTrace]
    }
    return [data]
  }, [data, indicatorTrace])

  return (
    <div className="w-full h-[600px]">
      <Plot
        data={plotDataWithIndicator}
        layout={{
          autosize: true,
          scene: {
            xaxis: { title: "x" },
            yaxis: { title: "y" },
            zaxis: { title: "z = f(x, y)" },
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1.3 },
            },
          },
          title: {
            text: `f(x, y) = ${functionName}`,
            font: { size: 18 },
          },
          margin: { l: 0, r: 0, b: 0, t: 40 },
          annotations: [
            {
              text: `Punto evaluado: (${markedX.toFixed(2)}, ${markedY.toFixed(2)})`,
              xref: "paper",
              yref: "paper",
              x: 0.02,
              y: 0.98,
              showarrow: false,
              bgcolor: "rgba(255, 0, 0, 0.1)",
              bordercolor: "red",
              borderwidth: 1,
              borderpad: 8,
            },
          ],
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
