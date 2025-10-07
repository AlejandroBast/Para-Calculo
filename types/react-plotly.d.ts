declare module 'react-plotly.js' {
  import * as React from 'react'

  type PlotlyData = any
  type PlotlyLayout = any
  type PlotlyConfig = any

  export interface PlotlyProps extends React.HTMLAttributes<HTMLDivElement> {
    data?: PlotlyData[]
    layout?: PlotlyLayout
    config?: PlotlyConfig
    style?: React.CSSProperties
  }

  const Plot: React.ComponentType<PlotlyProps>
  export default Plot
}
