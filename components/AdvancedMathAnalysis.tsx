"use client"

import { useState, useMemo } from "react"
import { MathCalculator } from "@/lib/math-utils"
import type { DerivativeResult, LimitResult, LagrangeResult, IntegralResult } from "@/lib/math-utils"

interface AdvancedMathAnalysisProps {
  functionInput: string
  initialX?: number
  initialY?: number
}

export default function AdvancedMathAnalysis({ functionInput, initialX = 0, initialY = 0 }: AdvancedMathAnalysisProps) {
  const [xPoint, setXPoint] = useState<number>(initialX || 0)
  const [yPoint, setYPoint] = useState<number>(initialY || 0)
  const [activeTab, setActiveTab] = useState<"derivatives" | "limits" | "critical" | "integral">("derivatives")

  const [derivatives, setDerivatives] = useState<DerivativeResult | null>(null)
  const [limits, setLimits] = useState<LimitResult | null>(null)
  const [critical, setCritical] = useState<LagrangeResult | null>(null)
  const [integral, setIntegral] = useState<IntegralResult | null>(null)

  const handleCalculateDerivatives = useMemo(() => {
    return () => {
      const result = MathCalculator.calculatePartialDerivatives(functionInput, xPoint, yPoint)
      setDerivatives(result)
    }
  }, [functionInput, xPoint, yPoint])

  const handleCalculateLimits = useMemo(() => {
    return () => {
      const result = MathCalculator.calculateLimits(functionInput, xPoint, yPoint)
      setLimits(result)
    }
  }, [functionInput, xPoint, yPoint])

  const handleAnalyzeCritical = useMemo(() => {
    return () => {
      const result = MathCalculator.analyzeCriticalPoints(functionInput, { min: -10, max: 10 }, { min: -10, max: 10 })
      setCritical(result)
    }
  }, [functionInput])

  const handleCalculateIntegral = useMemo(() => {
    return () => {
      const result = MathCalculator.approximateDoubleIntegral(functionInput, { min: -5, max: 5 }, { min: -5, max: 5 })
      setIntegral(result)
    }
  }, [functionInput])

  return (
    <div className="w-full space-y-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Punto de Evaluación (x, y)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="x-point" className="block text-sm font-medium text-gray-700 mb-1">
              Valor de x:
            </label>
            <input
              id="x-point"
              type="number"
              step="0.1"
              value={xPoint ?? 0}
              onChange={(e) => setXPoint(Number.parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="y-point" className="block text-sm font-medium text-gray-700 mb-1">
              Valor de y:
            </label>
            <input
              id="y-point"
              type="number"
              step="0.1"
              value={yPoint ?? 0}
              onChange={(e) => setYPoint(Number.parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("derivatives")}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "derivatives" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Derivadas
          </button>
          <button
            onClick={() => setActiveTab("limits")}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "limits" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Límites
          </button>
          <button
            onClick={() => setActiveTab("critical")}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "critical" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Puntos Críticos
          </button>
          <button
            onClick={() => setActiveTab("integral")}
            className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
              activeTab === "integral" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Integrales
          </button>
        </div>

        <div className="p-6">
          {activeTab === "derivatives" && (
            <div className="space-y-4">
              <button
                onClick={handleCalculateDerivatives}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Calcular Derivadas Parciales
              </button>

              {derivatives && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">∂f/∂x</h4>
                    <p className="font-mono text-sm text-gray-700 break-words">{derivatives.partial_x}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      En ({xPoint}, {yPoint}):{" "}
                      <span className="font-bold">{derivatives.gradient_at_point.x.toFixed(4)}</span>
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">∂f/∂y</h4>
                    <p className="font-mono text-sm text-gray-700 break-words">{derivatives.partial_y}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      En ({xPoint}, {yPoint}):{" "}
                      <span className="font-bold">{derivatives.gradient_at_point.y.toFixed(4)}</span>
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Gradiente ∇f</h4>
                    <p className="text-sm text-gray-700">
                      ∇f({xPoint}, {yPoint}) = ({derivatives.gradient_at_point.x.toFixed(4)},{" "}
                      {derivatives.gradient_at_point.y.toFixed(4)})
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Magnitud: <span className="font-bold">{derivatives.magnitude.toFixed(4)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "limits" && (
            <div className="space-y-4">
              <button
                onClick={handleCalculateLimits}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Calcular Límites
              </button>

              {limits && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Límite acercándose por x</h4>
                    <p className="text-sm text-gray-700">
                      lim (x→{xPoint}) = <span className="font-bold">{limits.limit_x_to_point}</span>
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Límite acercándose por y</h4>
                    <p className="text-sm text-gray-700">
                      lim (y→{yPoint}) = <span className="font-bold">{limits.limit_y_to_point}</span>
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Límite en 2D</h4>
                    <p className="text-sm text-gray-700">
                      lim ({xPoint}, {yPoint}) = <span className="font-bold">{limits.limit_2d}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "critical" && (
            <div className="space-y-4">
              <button
                onClick={handleAnalyzeCritical}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Analizar Puntos Críticos
              </button>

              {critical && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Gradiente ∇f</h4>
                    <p className="text-sm text-gray-700">
                      ∂f/∂x = <span className="font-mono">{critical.gradient_f.x}</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      ∂f/∂y = <span className="font-mono">{critical.gradient_f.y}</span>
                    </p>
                  </div>

                  {critical.critical_points.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Puntos Críticos Encontrados</h4>
                      <div className="space-y-2">
                        {critical.critical_points.map((point, idx) => (
                          <div key={idx} className="text-sm text-gray-700 bg-white p-2 rounded">
                            Punto {idx + 1}: ({point.x}, {point.y}) → f = {point.value.toFixed(4)}
                          </div>
                        ))}
                      </div>
                      {critical.min_value !== null && (
                        <div className="mt-2 text-sm text-gray-600">
                          Valor mínimo aproximado: <span className="font-bold">{critical.min_value.toFixed(4)}</span>
                        </div>
                      )}
                      {critical.max_value !== null && (
                        <div className="text-sm text-gray-600">
                          Valor máximo aproximado: <span className="font-bold">{critical.max_value.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "integral" && (
            <div className="space-y-4">
              <button
                onClick={handleCalculateIntegral}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Calcular Integral Doble
              </button>

              {integral && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Expresión</h4>
                    <p className="text-sm text-gray-700 font-mono break-words">
                      {integral.double_integral_description}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Volumen Aproximado</h4>
                    <p className="text-2xl font-bold text-indigo-600">{integral.volume_approximation.toFixed(4)}</p>
                    <p className="text-sm text-gray-600 mt-2">{integral.calculation_method}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
