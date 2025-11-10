"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { MathCalculator } from "@/lib/math-utils"
import type { DerivativeResult, LimitResult, LagrangeResult, IntegralResult } from "@/lib/math-utils"

interface AdvancedMathAnalysisProps {
  functionInput: string
  initialX?: number
  initialY?: number
  onXChange?: (x: number) => void
  onYChange?: (y: number) => void
}

export default function AdvancedMathAnalysis({
  functionInput,
  initialX = 0,
  initialY = 0,
  onXChange,
  onYChange,
}: AdvancedMathAnalysisProps) {
  const [xPoint, setXPoint] = useState<number>(initialX || 0)
  const [yPoint, setYPoint] = useState<number>(initialY || 0)
  const [activeTab, setActiveTab] = useState<"derivatives" | "limits" | "critical" | "integral">("derivatives")

  const [derivatives, setDerivatives] = useState<DerivativeResult | null>(null)
  const [limits, setLimits] = useState<LimitResult | null>(null)
  const [critical, setCritical] = useState<LagrangeResult | null>(null)
  const [integral, setIntegral] = useState<IntegralResult | null>(null)

  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [rangeData, setRangeData] = useState<{
    min: number
    max: number
    points: Array<{ x: number; y: number; z: number }>
  } | null>(null)

  const onXChangeRef = useRef(onXChange)
  const onYChangeRef = useRef(onYChange)

  useEffect(() => {
    onXChangeRef.current = onXChange
    onYChangeRef.current = onYChange
  }, [onXChange, onYChange])

  useEffect(() => {
    if (isAnimating) {
      onXChangeRef.current?.(xPoint)
    }
  }, [xPoint, isAnimating])

  useEffect(() => {
    if (isAnimating) {
      onYChangeRef.current?.(yPoint)
    }
  }, [yPoint, isAnimating])

  useEffect(() => {
    if (!isAnimating) {
      setXPoint(initialX || 0)
      setYPoint(initialY || 0)
    }
  }, [initialX, initialY, isAnimating])

  const zValue = useMemo(() => {
    try {
      return MathCalculator.evaluateFunction(functionInput, xPoint, yPoint)
    } catch {
      return 0
    }
  }, [functionInput, xPoint, yPoint])

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

  useEffect(() => {
    if (!isAnimating || !rangeData || rangeData.points.length === 0) return

    const totalPoints = rangeData.points.length
    const duration = 8000 // 8 seconds for full animation
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / duration) * 100, 100)

      setAnimationProgress(progress)

      if (progress >= 100) {
        setIsAnimating(false)
        return
      }

      const currentIndex = Math.floor((progress / 100) * totalPoints)
      if (currentIndex < totalPoints) {
        const point = rangeData.points[currentIndex]
        setXPoint(Number(point.x.toFixed(2)))
        setYPoint(Number(point.y.toFixed(2)))
      }

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [isAnimating, rangeData])

  const handleAnimateRange = () => {
    const range = MathCalculator.calculateFunctionRange(functionInput, { min: -5, max: 5 }, { min: -5, max: 5 })
    setRangeData(range)
    setAnimationProgress(0)
    setIsAnimating(true)
  }

  const handleStopAnimation = () => {
    setIsAnimating(false)
    setAnimationProgress(0)
  }

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
              disabled={isAnimating}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
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
              disabled={isAnimating}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Matriz de Coordenadas</h4>
          <div className="flex items-center justify-center gap-6">
            {/* X Column */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-indigo-600 mb-2">X</div>
              <div className="bg-white border-2 border-indigo-400 rounded-lg px-6 py-3 shadow-md">
                <div className="text-2xl font-bold text-indigo-600">{xPoint.toFixed(2)}</div>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-8 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
              <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Y Column */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-purple-600 mb-2">Y</div>
              <div className="bg-white border-2 border-purple-400 rounded-lg px-6 py-3 shadow-md">
                <div className="text-2xl font-bold text-purple-600">{yPoint.toFixed(2)}</div>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-8 bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <svg className="w-3 h-3 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Z Column */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-pink-600 mb-2">Z = f(x, y)</div>
              <div className="bg-white border-2 border-pink-400 rounded-lg px-6 py-3 shadow-md">
                <div className="text-2xl font-bold text-pink-600">{zValue.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* Formula display */}
          <div className="mt-4 text-center">
            <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-200">
              <span className="text-sm text-gray-700">
                f(<span className="text-indigo-600 font-bold">{xPoint.toFixed(2)}</span>,{" "}
                <span className="text-purple-600 font-bold">{yPoint.toFixed(2)}</span>) ={" "}
                <span className="text-pink-600 font-bold">{zValue.toFixed(4)}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleAnimateRange}
              disabled={isAnimating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating ? "Animando..." : "Animar Rango de Función"}
            </button>
            {isAnimating && (
              <button
                onClick={handleStopAnimation}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Detener
              </button>
            )}
          </div>

          {isAnimating && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-100"
                style={{ width: `${animationProgress}%` }}
              />
            </div>
          )}

          {rangeData && (
            <div className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
              <p>
                <strong>Rango de z:</strong> [{rangeData.min.toFixed(2)}, {rangeData.max.toFixed(2)}]
              </p>
              <p className="mt-1">
                <strong>Puntos evaluados:</strong> {rangeData.points.length}
              </p>
            </div>
          )}
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
