import { evaluate, derivative, simplify, parse } from "mathjs"

export interface DerivativeResult {
  partial_x: string
  partial_y: string
  gradient_at_point: { x: number; y: number }
  magnitude: number
}

export interface DomainRangeResult {
  domain: string
  range: string
  domain_description: string
  range_description: string
}

export interface LimitResult {
  limit_x_to_point: number | string
  limit_y_to_point: number | string
  limit_2d: number | string
  approaching_from: string
}

export interface LagrangeResult {
  gradient_f: { x: string; y: string }
  gradient_constraint: { x: string; y: string }
  critical_points: Array<{ x: number; y: number; value: number }>
  min_value: number | null
  max_value: number | null
}

export interface IntegralResult {
  double_integral_description: string
  volume_approximation: number
  calculation_method: string
}

export class MathCalculator {
  static evaluateFunction(expression: string, xPoint = 0, yPoint = 0) {
    try {
      const v = evaluate(expression, { x: xPoint, y: yPoint })
      return typeof v === "number" ? v : 0
    } catch {
      return 0
    }
  }
  // Calcula derivadas parciales con valores en un punto específico
  static calculatePartialDerivatives(expression: string, xPoint = 0, yPoint = 0): DerivativeResult {
    try {
      const dfdx_expr = derivative(expression, "x").toString()
      const dfdy_expr = derivative(expression, "y").toString()

      const dfdx_value = evaluate(dfdx_expr, { x: xPoint, y: yPoint })
      const dfdy_value = evaluate(dfdy_expr, { x: xPoint, y: yPoint })

      const dfdx_num = typeof dfdx_value === "number" ? dfdx_value : 0
      const dfdy_num = typeof dfdy_value === "number" ? dfdy_value : 0

      const magnitude = Math.sqrt(dfdx_num ** 2 + dfdy_num ** 2)

      return {
        partial_x: dfdx_expr,
        partial_y: dfdy_expr,
        gradient_at_point: {
          x: dfdx_num,
          y: dfdy_num,
        },
        magnitude: magnitude,
      }
    } catch (err) {
      return {
        partial_x: "Error",
        partial_y: "Error",
        gradient_at_point: { x: 0, y: 0 },
        magnitude: 0,
      }
    }
  }

  // Aproxima el dominio y rango
  static estimateDomainRange(expression: string): DomainRangeResult {
    const domain_description = "Depende de los términos en la función (fracciones, raíces, logaritmos)"
    const range_description = "Analiza los valores de z que puede tomar"

    // Intenta evaluar en varios puntos para estimar el rango
    let min_val = Number.POSITIVE_INFINITY
    let max_val = Number.NEGATIVE_INFINITY

    for (let x = -10; x <= 10; x += 1) {
      for (let y = -10; y <= 10; y += 1) {
        try {
          const z = evaluate(expression, { x, y })
          if (typeof z === "number" && isFinite(z)) {
            min_val = Math.min(min_val, z)
            max_val = Math.max(max_val, z)
          }
        } catch {
          // Ignore evaluation errors
        }
      }
    }

    return {
      domain: "ℝ² (depende de la función)",
      range: isFinite(min_val) && isFinite(max_val) ? `[${min_val.toFixed(2)}, ${max_val.toFixed(2)}]` : "ℝ",
      domain_description,
      range_description,
    }
  }

  // Calcula límites en un punto
  static calculateLimits(expression: string, xPoint = 0, yPoint = 0): LimitResult {
    try {
      // Límite acercándose por x
      const limit_x_approaches = evaluate(expression, {
        x: xPoint + 0.0001,
        y: yPoint,
      })
      const limit_x_val = typeof limit_x_approaches === "number" ? limit_x_approaches.toFixed(4) : "Indefinido"

      // Límite acercándose por y
      const limit_y_approaches = evaluate(expression, {
        x: xPoint,
        y: yPoint + 0.0001,
      })
      const limit_y_val = typeof limit_y_approaches === "number" ? limit_y_approaches.toFixed(4) : "Indefinido"

      // Límite en 2D (punto central)
      const limit_2d = evaluate(expression, { x: xPoint, y: yPoint })
      const limit_2d_val = typeof limit_2d === "number" ? limit_2d.toFixed(4) : "Indefinido"

      return {
        limit_x_to_point: limit_x_val,
        limit_y_to_point: limit_y_val,
        limit_2d: limit_2d_val,
        approaching_from: `(${xPoint}, ${yPoint})`,
      }
    } catch {
      return {
        limit_x_to_point: "Error",
        limit_y_to_point: "Error",
        limit_2d: "Error",
        approaching_from: `(${xPoint}, ${yPoint})`,
      }
    }
  }

  // Análisis básico de puntos críticos usando derivadas
  static analyzeCriticalPoints(
    expression: string,
    xRange: { min: number; max: number },
    yRange: { min: number; max: number },
  ): LagrangeResult {
    try {
      const dfdx = derivative(expression, "x")
      const dfdy = derivative(expression, "y")

      const critical_points: Array<{ x: number; y: number; value: number }> = []
      let min_val = Number.POSITIVE_INFINITY
      let max_val = Number.NEGATIVE_INFINITY

      const step = (xRange.max - xRange.min) / 100 // Aumentado de 40 a 100
      const step_y = (yRange.max - yRange.min) / 100

      for (let x = xRange.min; x <= xRange.max; x += step) {
        for (let y = yRange.min; y <= yRange.max; y += step_y) {
          try {
            const dfdx_val = evaluate(dfdx.toString(), { x, y })
            const dfdy_val = evaluate(dfdy.toString(), { x, y })
            const fx_val = evaluate(expression, { x, y })

            if (
              typeof dfdx_val === "number" &&
              typeof dfdy_val === "number" &&
              typeof fx_val === "number" &&
              isFinite(fx_val) &&
              Math.abs(dfdx_val) < 0.01 && // Threshold más estricto de 0.1 a 0.01
              Math.abs(dfdy_val) < 0.01
            ) {
              // Check if this point is not too close to existing points
              const isTooClose = critical_points.some(
                (p) => Math.abs(p.x - x) < step * 3 && Math.abs(p.y - y) < step_y * 3,
              )

              if (!isTooClose) {
                critical_points.push({
                  x: Number.parseFloat(x.toFixed(3)),
                  y: Number.parseFloat(y.toFixed(3)),
                  value: fx_val,
                })
                min_val = Math.min(min_val, fx_val)
                max_val = Math.max(max_val, fx_val)
              }
            }
          } catch {
            // Ignore errors
          }
        }
      }

      if (critical_points.length === 0) {
        for (let x = xRange.min; x <= xRange.max; x += step) {
          for (let y = yRange.min; y <= yRange.max; y += step_y) {
            try {
              const dfdx_val = evaluate(dfdx.toString(), { x, y })
              const dfdy_val = evaluate(dfdy.toString(), { x, y })
              const fx_val = evaluate(expression, { x, y })

              if (
                typeof dfdx_val === "number" &&
                typeof dfdy_val === "number" &&
                typeof fx_val === "number" &&
                isFinite(fx_val) &&
                Math.abs(dfdx_val) < 0.05 && // Threshold más relajado
                Math.abs(dfdy_val) < 0.05
              ) {
                const isTooClose = critical_points.some(
                  (p) => Math.abs(p.x - x) < step * 3 && Math.abs(p.y - y) < step_y * 3,
                )

                if (!isTooClose) {
                  critical_points.push({
                    x: Number.parseFloat(x.toFixed(3)),
                    y: Number.parseFloat(y.toFixed(3)),
                    value: fx_val,
                  })
                  min_val = Math.min(min_val, fx_val)
                  max_val = Math.max(max_val, fx_val)
                }
              }
            } catch {
              // Ignore errors
            }
          }
        }
      }

      return {
        gradient_f: {
          x: dfdx.toString(),
          y: dfdy.toString(),
        },
        gradient_constraint: {
          x: "Definir restricción",
          y: "Definir restricción",
        },
        critical_points: critical_points.slice(0, 8), // Show up to 8 points
        min_value: isFinite(min_val) ? min_val : null,
        max_value: isFinite(max_val) ? max_val : null,
      }
    } catch {
      return {
        gradient_f: { x: "Error", y: "Error" },
        gradient_constraint: { x: "Error", y: "Error" },
        critical_points: [],
        min_value: null,
        max_value: null,
      }
    }
  }

  // Aproxima integral doble usando método de Riemann
  static approximateDoubleIntegral(
    expression: string,
    xRange: { min: number; max: number },
    yRange: { min: number; max: number },
    subdivisions = 20,
  ): IntegralResult {
    try {
      const dx = (xRange.max - xRange.min) / subdivisions
      const dy = (yRange.max - yRange.min) / subdivisions
      let sum = 0
      let validPoints = 0

      for (let x = xRange.min; x < xRange.max; x += dx) {
        for (let y = yRange.min; y < yRange.max; y += dy) {
          try {
            const z = evaluate(expression, { x, y })
            if (typeof z === "number" && isFinite(z)) {
              sum += z
              validPoints++
            }
          } catch {
            // Ignore
          }
        }
      }

      const volume = sum * dx * dy

      return {
        double_integral_description: `∫∫ ${expression} dA sobre [${xRange.min}, ${xRange.max}] × [${yRange.min}, ${yRange.max}]`,
        volume_approximation: volume,
        calculation_method: `Suma de Riemann con ${subdivisions}x${subdivisions} subdivisiones`,
      }
    } catch {
      return {
        double_integral_description: `∫∫ ${expression} dA`,
        volume_approximation: 0,
        calculation_method: "Error en cálculo",
      }
    }
  }

  // Valida y simplifica expresiones
  static validateAndSimplify(expression: string): { valid: boolean; simplified: string; error?: string } {
    try {
      const node = parse(expression)
      const simplified = simplify(node).toString()
      return { valid: true, simplified }
    } catch (err) {
      return {
        valid: false,
        simplified: expression,
        error: `Error en la expresión: ${err instanceof Error ? err.message : "Desconocido"}`,
      }
    }
  }

  static calculateFunctionRange(
    expression: string,
    xRange: { min: number; max: number },
    yRange: { min: number; max: number },
    samples = 50,
  ): { min: number; max: number; points: Array<{ x: number; y: number; z: number }> } {
    const stepX = (xRange.max - xRange.min) / samples
    const stepY = (yRange.max - yRange.min) / samples
    let minZ = Number.POSITIVE_INFINITY
    let maxZ = Number.NEGATIVE_INFINITY
    const points: Array<{ x: number; y: number; z: number }> = []

    for (let x = xRange.min; x <= xRange.max; x += stepX) {
      for (let y = yRange.min; y <= yRange.max; y += stepY) {
        try {
          const z = evaluate(expression, { x, y })
          if (typeof z === "number" && isFinite(z)) {
            minZ = Math.min(minZ, z)
            maxZ = Math.max(maxZ, z)
            points.push({ x, y, z })
          }
        } catch {
          // Ignore evaluation errors
        }
      }
    }

    return {
      min: isFinite(minZ) ? minZ : 0,
      max: isFinite(maxZ) ? maxZ : 0,
      points: points,
    }
  }
}
