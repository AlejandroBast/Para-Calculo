"use client"

import { useState } from "react"
import { evaluate, derivative } from "mathjs"
import Plot3D from "@/components/Plot3D"
import FloatingParticles from "@/components/FloatingParticles"
import Link from "next/link"

export default function CalculatorPage() {
  const [functionInput, setFunctionInput] = useState("x^2 + y^2")
  const [plotData, setPlotData] = useState<any>(null)
  const [error, setError] = useState("")
  const [derivatives, setDerivatives] = useState<{
    dfdx: string
    dfdy: string
    dfdxAt0: number
    dfdyAt0: number
  } | null>(null)
  const [showDerivatives, setShowDerivatives] = useState(false)

  const generatePlot = () => {
    try {
      setError("")
      const range = 5
      const step = 0.5
      const xValues: number[] = []
      const yValues: number[] = []
      const zValues: number[][] = []

      // Generate mesh grid
      for (let x = -range; x <= range; x += step) {
        xValues.push(x)
      }
      for (let y = -range; y <= range; y += step) {
        yValues.push(y)
      }

      // Calculate z values
      for (let i = 0; i < yValues.length; i++) {
        const row: number[] = []
        for (let j = 0; j < xValues.length; j++) {
          try {
            const z = evaluate(functionInput, { x: xValues[j], y: yValues[i] })
            row.push(typeof z === "number" ? z : 0)
          } catch {
            row.push(0)
          }
        }
        zValues.push(row)
      }

      setPlotData({
        x: xValues,
        y: yValues,
        z: zValues,
        type: "surface",
        colorscale: "Viridis",
      })
    } catch (err) {
      setError("Error al evaluar la función. Verifica tu monda.")
      setPlotData(null)
    }
  }

  const calculateDerivatives = () => {
    try {
      setError("")

      // Calculate symbolic derivatives
      const dfdxExpr = derivative(functionInput, "x").toString()
      const dfdyExpr = derivative(functionInput, "y").toString()

      // Evaluate at (0, 0)
      const dfdxAt0 = evaluate(dfdxExpr, { x: 0, y: 0 })
      const dfdyAt0 = evaluate(dfdyExpr, { x: 0, y: 0 })

      setDerivatives({
        dfdx: dfdxExpr,
        dfdy: dfdyExpr,
        dfdxAt0: typeof dfdxAt0 === "number" ? dfdxAt0 : 0,
        dfdyAt0: typeof dfdyAt0 === "number" ? dfdyAt0 : 0,
      })
      setShowDerivatives(true)
    } catch (err) {
      setError("Error al calcular las derivadas. Verifica tu monda.")
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <FloatingParticles />

      <div className="relative z-10 max-w-6xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium"></span>
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Para-Calculo</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Grafica tus funciones y calcula sus derivadas parciales de manera interactiva.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-2">
                Ingresa tu función f(x), f(x, y):
              </label>
              <input
                id="function"
                type="text"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="Ejemplo: x^2 + y^2, sin(x)*cos(y)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Ejemplos: <code className="bg-gray-100 px-2 py-1 rounded">x^2 + y^2</code>,
                <code className="bg-gray-100 px-2 py-1 rounded ml-2">sin(x)*cos(y)</code>,
                <code className="bg-gray-100 px-2 py-1 rounded ml-2">x*y</code>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generatePlot}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Grafico
              </button>
              <button
                onClick={calculateDerivatives}
                className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Derivadas Parciales
              </button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          </div>
        </div>

        {/* Derivatives Section */}
        {showDerivatives && derivatives && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Derivadas Parciales</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Derivada parcial respecto a x:</h3>
                <p className="text-lg font-mono text-gray-700 mb-2">∂f/∂x = {derivatives.dfdx}</p>
                <p className="text-sm text-gray-600">
                  En (0, 0): <span className="font-bold">{derivatives.dfdxAt0.toFixed(4)}</span>
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Derivada parcial respecto a y:</h3>
                <p className="text-lg font-mono text-gray-700 mb-2">∂f/∂y = {derivatives.dfdy}</p>
                <p className="text-sm text-gray-600">
                  En (0, 0): <span className="font-bold">{derivatives.dfdyAt0.toFixed(4)}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plot Section */}
        {plotData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gráfica 3D de f({functionInput})</h2>
            <Plot3D data={plotData} functionName={functionInput} />
          </div>
        )}

        {/* Instructions */}
        {!plotData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">¿Perdido? Sigue estos pasos:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Escribe una función de dos variables usando x e y</li>
              <li>Usa operadores matemáticos: +, -, *, /, ^, sin(), cos(), tan(), exp(), log()</li>
              <li>Presiona "Graficar" para ver la superficie 3D</li>
              <li>Presiona "Ver Derivadas" para calcular ∂f/∂x y ∂f/∂y en el punto (0,0)</li>
              <li>Interactúa con el gráfico: rota, acerca y explora la función</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
