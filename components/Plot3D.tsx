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
          size: 14,
          color: "#00ffff",
          symbol: "diamond",
          line: { color: "#00cccc", width: 3 },
        },
        text: [`(${markedX.toFixed(2)}, ${markedY.toFixed(2)})<br>z=${zValue.toFixed(2)}`],
        textposition: "top center",
        textfont: { color: "#00ffff", size: 12, family: "monospace" },
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
          paper_bgcolor: "#0a0a0a",
          plot_bgcolor: "#0a0a0a",
          scene: {
            xaxis: {
              title: "x",
              gridcolor: "#333333",
              zerolinecolor: "#555555",
            },
            yaxis: {
              title: "y",
              gridcolor: "#333333",
              zerolinecolor: "#555555",
            },
            zaxis: {
              title: "z = f(x, y)",
              gridcolor: "#333333",
              zerolinecolor: "#555555",
            },
            camera: {
              eye: { x: 1.5, y: 1.5, z: 1.3 },
            },
            bgcolor: "#0a0a0a",
          },
          title: {
            text: `f(x, y) = ${functionName}`,
            font: { size: 18, color: "#ffffff" },
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
              bgcolor: "rgba(0, 255, 255, 0.15)",
              bordercolor: "#00ffff",
              borderwidth: 2,
              borderpad: 8,
              font: { color: "#00ffff", size: 11 },
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
