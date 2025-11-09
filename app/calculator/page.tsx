"use client"

import { useState, useMemo } from "react"
import { evaluate } from "mathjs"
import Plot3D from "@/components/Plot3D"
import FloatingParticles from "@/components/FloatingParticles"
import AdvancedMathAnalysis from "@/components/AdvancedMathAnalysis"
import Link from "next/link"

export default function CalculatorPage() {
  const [functionInput, setFunctionInput] = useState("x^2 + y^2")
  const [error, setError] = useState("")
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [xValue, setXValue] = useState(0)
  const [yValue, setYValue] = useState(0)

  const plotData = useMemo(() => {
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

      return {
        x: xValues,
        y: yValues,
        z: zValues,
        type: "surface",
        colorscale: "Viridis",
      }
    } catch (err) {
      setError("Error al evaluar la función. Verifica tu sintaxis.")
      return null
    }
  }, [functionInput])

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
            Grafica tus funciones y analiza derivadas parciales, límites, integrales y puntos críticos.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="function" className="block text-sm font-medium text-gray-700 mb-2">
                Ingresa tu función f(x, y):
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="x-val" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de x:
                </label>
                <input
                  id="x-val"
                  type="number"
                  step="0.1"
                  value={xValue}
                  onChange={(e) => setXValue(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="y-val" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de y:
                </label>
                <input
                  id="y-val"
                  type="number"
                  step="0.1"
                  value={yValue}
                  onChange={(e) => setYValue(Number.parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => plotData}
                className="flex-1 min-w-[150px] bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Graficar
              </button>
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="flex-1 min-w-[150px] bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                {showAnalysis ? "Ocultar" : "Análisis"} Matemático
              </button>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
          </div>
        </div>

        {showAnalysis && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Análisis Matemático Avanzado</h2>
            <AdvancedMathAnalysis functionInput={functionInput} initialX={xValue} initialY={yValue} />
          </div>
        )}

        {/* Plot Section */}
        {plotData && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gráfica 3D de f({functionInput})</h2>
            <Plot3D data={plotData} functionName={functionInput} markedX={xValue} markedY={yValue} />
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
              <li>Presiona "Análisis Matemático" para calcular derivadas, límites, integrales</li>
              <li>Modifica x, y para evaluar en diferentes puntos</li>
              <li>Interactúa con el gráfico: rota, acerca y explora la función</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
