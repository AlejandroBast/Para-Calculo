# Para-Calculo — Calculadora Multivariable (Documentación Técnica)

<img width="1024" height="1024" alt="Para-Calculo logo" src="https://github.com/user-attachments/assets/318954fe-b73c-421f-b56f-09498cac10ac" />

## Descripción general

**Para-Calculo** es una aplicación web educativa construida con **Next.js 15** y **React 19** para visualizar superficies de funciones de dos variables (f(x,y)) en 3D y calcular derivadas parciales de forma simbólica. Está pensada para cursos de **Cálculo Multivariable**, con una interfaz moderna, responsiva y animaciones suaves.

## Tabla de contenidos

1. [Arquitectura](#arquitectura)
2. [Tecnologías y dependencias](#tecnologías-y-dependencias)
3. [Estructura del proyecto](#estructura-del-proyecto)

# Para-Calculo — Calculadora Multivariable

Aplicación educativa para visualizar funciones de dos variables y realizar análisis básico y avanzado (derivadas parciales, límites, integrales y más). La app está implementada con Next.js + React y usa mathjs para cálculos simbólicos y numéricos, y Plotly para la visualización 3D.

Contenido de este README (resumido)

- Qué hace la aplicación
- Cómo usar la interfaz
- Cómo calcula derivadas, límites e integrales (fórmulas y métodos)
- Ejemplos y recomendaciones prácticas
- Instalación, pruebas y próximas mejoras

---

## Qué hace la aplicación

- Grafica superficies 3D de funciones de dos variables: $z=f(x,y)$.
- Permite evaluar la función en un punto $(x_0,y_0)$ y ver el valor $z_0=f(x_0,y_0)$.
- Calcula derivadas parciales simbólicas y las evalúa en un punto.
- Aproxima límites y realiza integrales dobles por suma de Riemann (aproximación numérica).
- Ofrece controles interactivos (sliders, inputs numéricos, auto-update y posibilidad de configurar rango y resolución).

---

## Cómo usar la interfaz (rápido)

1. Ingresa una función en la caja principal, por ejemplo `x^2 + y^2` o `sin(x)*cos(y)`.
2. Ajusta el rango (±R) y la resolución (step) para la malla de evaluación. Valores por defecto razonables: R=5, step=0.5.
3. Usa los controles `x` y `y` (slider + input numérico) para seleccionar el punto donde evaluar; el marcador en el gráfico mostrará $f(x,y)$.
4. Activa/desactiva `Auto-update` para que la gráfica y los cálculos se actualicen automáticamente o requieran que presiones `Graficar`.
5. En la sección de análisis (si está habilitada) puedes ver derivadas, límites, integrales y animaciones de recorrido por la superficie.

---

## Derivadas parciales — qué son y cómo las calcula la app

Matemáticamente, las derivadas parciales en un punto $(x_0,y_0)$ se definen como:

$f_x(x_0,y_0) = \lim_{h\to 0} \dfrac{f(x_0+h,y_0)-f(x_0,y_0)}{h},$

$f_y(x_0,y_0) = \lim_{h\to 0} \dfrac{f(x_0,y_0+h)-f(x_0,y_0)}{h}.$

Cómo las calcula la app:

- Symbolic (mathjs): por defecto usamos la capacidad simbólica de mathjs (`derivative(expr, 'x')`) para obtener las expresiones simbólicas de $f_x$ y $f_y$ cuando la expresión es simbólicamente diferenciable.
  - Ventaja: se obtiene la forma analítica (por ejemplo `2*x` para `x^2`).
  - Ejemplo en código: `const dfdx = derivative(functionInput, 'x').toString()`.

- Evaluación numérica: una vez obtenida la expresión simbólica, evaluamos la expresión en $(x_0,y_0)$ con `evaluate(expr, {x: x0, y: y0})`.

Fallback / numérico:

- Si por algún motivo la derivada simbólica no es aplicable (por ejemplo expresiones no diferenciables o construcciones no soportadas), la app puede usar una aproximación por diferencias finitas centradas:

$f_x(x_0,y_0) \approx \dfrac{f(x_0+h,y_0)-f(x_0-h,y_0)}{2h}$

con $h$ pequeño (por ejemplo $h=10^{-4}$). Este método está implementable como respaldo y es útil para funciones con símbolos no soportados por la diferenciación simbólica.

Interpretación práctica:

- Si $f_x(x_0,y_0)>0$ la función aumenta si movemos $x$ en sentido positivo manteniendo $y$ fijo.
- El vector gradiente $\nabla f = (f_x, f_y)$ indica la dirección de máximo incremento.

---

## Límites — cómo aproximamos y qué se muestra

Matemáticamente, el límite bidimensional en $(x_0,y_0)$ es:

$\lim_{(x,y)\to(x_0,y_0)} f(x,y)$

En la práctica la app usa aproximaciones numéricas y comprobaciones por varias rutas:

- Aproximación por ejes: evaluar `f(x0 ± h, y0)` y `f(x0, y0 ± h)` con $h$ pequeño (por ejemplo $10^{-4}$) para ver consistencia lateral.
- Aproximación radial: evaluar `f(x0 + h \cos t, y0 + h \sin t)` para varios ángulos `t` y comparar resultados.
- Evaluación directa: `f(x0,y0)` cuando es finita y la función está definida en el punto.

Decisión práctica:

- Si las evaluaciones por diferentes rutas convergen al mismo número (dentro de una tolerancia), mostramos ese valor como aproximación del límite.
- Si los resultados divergen (o cambia según la ruta), la app señala que el límite puede no existir.

Ejemplo: para `f(x,y) = x*y/(x^2+y^2)` en $(0,0)$ las aproximaciones por distintas rectas muestran dependencia de la pendiente → límite no existe.

---

## Integrales dobles — método numérico usado

Para aproximar integrales dobles

$I = \iint_{D} f(x,y)\,dA$

la app utiliza aproximación por suma de Riemann (método de rectángulos):

1. Dividir el dominio $D = [a,b]\times[c,d]$ en una cuadrícula $N_x \times N_y$ (según `step` y `range`).
2. Evaluar $f$ en el punto representativo de cada sub-rectángulo.
3. Sumar $f(x_i,y_j)\cdot \Delta A$, donde $\Delta A = \Delta x \Delta y$.

Fórmula aproximada:

$I \approx \sum_{i=1}^{N_x} \sum_{j=1}^{N_y} f(x_i,y_j)\,\Delta x\,\Delta y.$

Detalles de implementación:

- Por defecto usamos un número moderado de subdivisiones para mantener interactividad (p. ej. `subdivisions = 20..50`).
- Resultado: aproximación numérica (no simbólica). Para integrales exactas simbólicas efectuar con CAS externo (no implementado aquí).

---

## Plano tangente y Hessiana (qué más se puede mostrar)

- Plano tangente en $(x_0,y_0)$:

$z = f(x_0,y_0) + f_x(x_0,y_0)(x-x_0) + f_y(x_0,y_0)(y-y_0).$

- Hessiana (matriz de segundas derivadas):

$H_f = \begin{pmatrix} f_{xx} & f_{xy} \\ f_{yx} & f_{yy} \end{pmatrix}$

Se puede usar la Hessiana para clasificar puntos críticos (mínimo, máximo, silla) mediante el criterio de determinante y valores propios.

---

## Ejemplos rápidos y fórmulas (útiles para enseñar)

- $f(x,y)=x^2+y^2$ → $f_x=2x$, $f_y=2y$, gradiente $(2x,2y)$, plano tangente en $(x_0,y_0)$: $z = x_0^2+y_0^2 + 2x_0(x-x_0)+2y_0(y-y_0)$.
- $f(x,y)=x^2-y^2$ → $f_x=2x$, $f_y=-2y$ (silla si signos opuestos).
- $f(x,y)=\sin x \cos y$ → $f_x=\cos x \cos y$, $f_y=-\sin x \sin y$.
- $f(x,y)=e^{-(x^2+y^2)}$ → $f_x=-2x e^{-(x^2+y^2)}$, $f_y=-2y e^{-(x^2+y^2)}$.

---

## Instalación y ejecución

```bash
git clone https://github.com/AlejandroBast/Para-Calculo.git
cd Para-Calculo
npm install
npm run dev
# Abre http://localhost:3000
```

Notas:

- Node 18+ recomendado.
- `mathjs` se usa para diferenciación simbólica; para integrales y límites usamos aproximaciones numéricas.

---

## Sugerencias de uso y limitaciones

- Evitar `step` demasiado pequeño con rangos grandes: el número de evaluaciones crece como $O((2R/step)^2)$ y puede bloquear el navegador.
- Para funciones no definidas en algunos puntos (divisiones por cero), la app captura errores y asigna `0` o marca el punto como indefinido; revisa la consola si ves valores extraños.
- Algunas construcciones avanzadas (condicionales complejas, funciones definidas por piezas) pueden no diferenciarse simbólicamente; entonces usar diferencias finitas como respaldo.

---

## Qué añadí en este README (resumen técnico)

- Explicación clara y detallada de cómo se calculan derivadas parciales (simbólico y fallback numérico), límites (métodos de aproximación) e integrales dobles (suma de Riemann).
- Ejemplos y fórmulas clave para usar en clase o documentación.
- Indicaciones de rendimiento y buenas prácticas para parámetros de la malla.

---

Si quieres que incluya imágenes, diagramas de gradiente/plano tangente o una sección con ejercicios guiados (por ejemplo: "Encuentra y clasifica puntos críticos para estas funciones") lo agrego en la próxima iteración.

Contacto: abre un issue o PR en el repositorio y propón cambios.

## Lógica y funciones

En esta sección profundizamos en las funciones clave del código, su contrato (entradas/salidas), cómo se implementan en la práctica y qué comportamientos/errores gestionar.

Resumen rápido (contrato)

- generatePlot(functionInput, range, step) -> PlotData | null
  - inputs: expresión en string (mathjs), rango R (número), step (número)
  - output: objeto con { x: number[], y: number[], z: number[][], type: 'surface', colorscale }
  - errores: devuelve null y setea mensaje de error si la evaluación falla

- calculateDerivatives(functionInput, x0, y0) -> { dfdxExpr, dfdyExpr, dfdxVal, dfdyVal }
  - inputs: expresión, punto de evaluación
  - output: expresiones simbólicas y valores numéricos evaluados en (x0,y0)

- calculateLimits(functionInput, x0, y0) -> LimitResult
  - aproxima límite por varias rutas (ejes, radial) y reporta consistencia

- approximateDoubleIntegral(functionInput, xRange, yRange, subdivisions) -> number
  - aproximación por suma de Riemann

Detalle de las implementaciones clave

1. generatePlot (malla y evaluación)

Comportamiento:

- Construye arrays de valores para x e y desde -R a R usando `for (let x = -R; x <= R; x += step)`.
- Evalúa `z = evaluate(functionInput, { x, y })` para cada par (x,y) y monta la matriz `zValues` que acepta Plotly.
- Normaliza valores y atrapa excepciones por evaluación, rellenando `0` (o NaN) cuando la evaluación falla.

Puntos importantes del código:

```ts
const xValues: number[] = [];
for (let x = -range; x <= range; x += step) xValues.push(Number(x.toFixed(6)));

const zValues: number[][] = [];
for (let i = 0; i < yValues.length; i++) {
  const row: number[] = [];
  for (let j = 0; j < xValues.length; j++) {
    try {
      const z = evaluate(functionInput, { x: xValues[j], y: yValues[i] });
      row.push(typeof z === "number" ? z : 0);
    } catch {
      row.push(0);
    }
  }
  zValues.push(row);
}
```

Notas y mejoras posibles:

- Evitar generar mallas con más de N puntos (por ejemplo N = 10000) y mostrar aviso.
- Soportar distintos modos (centros, esquinas, subdivisiones): elegir punto representativo para la suma/integral.

2. calculateDerivatives (simbólico + evaluación)

Comportamiento:

- Intenta obtener expresiones simbólicas con `derivative(expr, 'x')` y `derivative(expr, 'y')`.
- Evalúa las expresiones en (x0,y0) con `evaluate`.

Ejemplo (código):

```ts
const dfdxExpr = derivative(functionInput, "x").toString();
const dfdyExpr = derivative(functionInput, "y").toString();
const dfdxVal = evaluate(dfdxExpr, { x: x0, y: y0 });
const dfdyVal = evaluate(dfdyExpr, { x: x0, y: y0 });
```

Fallback numérico (centrado):

```ts
const h = 1e-4;
const fxh = evaluate(functionInput, { x: x0 + h, y: y0 });
const fxmh = evaluate(functionInput, { x: x0 - h, y: y0 });
const approx_dfdx = (fxh - fxmh) / (2 * h);
```

3. calculateLimits (estrategia híbrida)

Comportamiento práctico que implementa la app:

- Evaluaciones por ejes (x0±h, y0) y (x0, y0±h).
- Evaluaciones por varias direcciones radiales con `t` en [0,2π): `x = x0 + h cos t`, `y = y0 + h sin t`.
- Si los valores numéricos convergen (dentro de una tolerancia), se reporta el límite aproximado; si no, se indica posible inexistencia del límite.

4. approximateDoubleIntegral (suma de Riemann)

Pseudocódigo:

```ts
const dx = (xMax - xMin) / Nx;
const dy = (yMax - yMin) / Ny;
let sum = 0;
for (let i = 0; i < Nx; i++) {
  for (let j = 0; j < Ny; j++) {
    const x = xMin + (i + 0.5) * dx;
    const y = yMin + (j + 0.5) * dy;
    sum += evaluate(expr, { x, y }) * dx * dy;
  }
}
return sum;
```

Control de errores y valores no finitos:

- Ignorar (o tratar como 0) las evaluaciones que produzcan NaN o ±Infinity. También puede agregarse una bandera `strict` para abortar la integral si hay demasiados puntos inválidos.

5. Utilidad compartida: MathCalculator

El archivo `lib/math-utils.ts` contiene utilidades reutilizables:

- `calculatePartialDerivatives(expression, xPoint, yPoint)` → devuelve expresiones y valores numéricos.
- `evaluateFunction(expression, x, y)` → wrapper seguro para `evaluate` que captura errores.
- `calculateLimits`, `approximateDoubleIntegral`, `calculateFunctionRange`, `analyzeCriticalPoints`.

Ejemplo de uso desde un componente:

```ts
import { MathCalculator } from "@/lib/math-utils";

const z = MathCalculator.evaluateFunction(expr, x, y);
const derivs = MathCalculator.calculatePartialDerivatives(expr, x, y);
```

6. Interacción entre componente y visualización (contrato de Plot3D)

Plot3D espera `data` con la forma `{ x: number[], y: number[], z: number[][], type: 'surface', colorscale }` y acepta opcionalmente un `point` o `markedX/markedY` para mostrar un indicador.

Comportamiento esperado:

- Si `point` está definido, Plot3D dibuja un `scatter3d` con el marcador y una proyección vertical además de una etiqueta de texto con el valor z.
- Plot3D emite eventos `onClick` (si se captura) con las coordenadas del punto clicado; el padre puede usarlo para actualizar `x0,y0`.

7. Manejo de errores y UX

- Validación de la expresión: se recomienda envolver `evaluate` en try/catch y mostrar mensajes claros al usuario.
- Evitar recálculos inmediatos sin debounce cuando el `step` es muy pequeño o cuando la malla produciría > 50k evaluaciones.
- Cuando detectamos un número excesivo de puntos a generar, mostrar un modal/aviso y pedir confirmación del usuario.

8. Casos borde y consideraciones numéricas

- Funciones no definidas (por ejemplo división por cero): la app captura excepciones y muestra `0` u otro valor neutro; para un comportamiento más académico se puede marcar como indefinido.
- Puntos con comportamiento oscilatorio (singularidades esenciales) requieren aumentar las rutas/muestras en `calculateLimits`.
- Derivadas simbólicas pueden devolver expresiones que mathjs no evalúa numéricamente en ciertos casos; en ese caso usar fallback numérico.

9. Tests rápidos y verificación

- Unit tests propuestos (jest / vitest):
  - `generatePlot` con `x^2+y^2` produce z central ~0 en (0,0).
  - `calculatePartialDerivatives` con `x^2+y^2` devuelve `2*x` y `2*y` y valores numéricos esperados.
  - `approximateDoubleIntegral` sobre `1` en [0,1]x[0,1] ≈ 1.

10. Rendimiento y recomendaciones

- Seleccionar por defecto `range=5` y `step=0.5` para equilibrar calidad y velocidad.
- Añadir un limite superior de puntos (por ejemplo 40k) y calcular el número de celdas como `((2*range)/step + 1)^2`.
- Considerar mover cálculos pesados a un WebWorker o a un servicio backend si quieres mallas interactivas muy finas.

---

Con esto la sección de "Lógica y funciones" queda ampliada con detalles técnicos y prácticos: si quieres que añada fragmentos concretos de código (por ejemplo, la función `generatePlot` completa tal y como la usas en `page.tsx`), lo agrego en la siguiente iteración y dejo el README listo con un bloque de código formateado y comentado.
