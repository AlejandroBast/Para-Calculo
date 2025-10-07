"use client"

import dynamic from "next/dynamic"

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
}

export default function Plot3D({ data, functionName }: Plot3DProps) {
  return (
    <div className="w-full h-[600px]">
      <Plot
        data={[data]}
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
