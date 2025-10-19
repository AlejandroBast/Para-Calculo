

# Para-Calculo — Calculadora Multivariable (Documentación Técnica)

<img width="1024" height="1024" alt="Para-Calculo logo" src="https://github.com/user-attachments/assets/318954fe-b73c-421f-b56f-09498cac10ac" />

## Descripción general

**Para-Calculo** es una aplicación web educativa construida con **Next.js 15** y **React 19** para visualizar superficies de funciones de dos variables (f(x,y)) en 3D y calcular derivadas parciales de forma simbólica. Está pensada para cursos de **Cálculo Multivariable**, con una interfaz moderna, responsiva y animaciones suaves.

## Tabla de contenidos

1. [Arquitectura](#arquitectura)
2. [Tecnologías y dependencias](#tecnologías-y-dependencias)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Componentes principales](#componentes-principales)
5. [Animaciones](#animaciones)
6. [Lógica y funciones](#lógica-y-funciones)
7. [Fundamentos matemáticos](#fundamentos-matemáticos)
8. [Estilos y diseño](#estilos-y-diseño)
9. [Instalación y uso](#instalación-y-uso)
10. [Ejemplos de funciones](#ejemplos-de-funciones)
11. [Solución de problemas](#solución-de-problemas)
12. [Extensiones futuras](#extensiones-futuras)
13. [Licencia y contacto](#licencia-y-contacto)

---

## Arquitectura

**Patrones y organización**

* **App Router de Next.js**: separación clara entre *pages* (landing y calculadora) y *layout* raíz.
* **Componentes reutilizables**: UI desacoplada (gráfico 3D, animaciones de fondo, etc.).
* **Interactividad en cliente**: componentes con `'use client'` cuando requieren *hooks* o APIs del navegador.
* **Estado local** con `useState` y cálculo bajo demanda.

**Tecnologías core**

* **Next.js 15** (App Router, compatibilidad SSR/CSR según necesidad).
* **React 19**.
* **TypeScript** para *type safety*.
* **Tailwind CSS** (utilidades + animaciones personalizadas).

---

## Tecnologías y dependencias

### mathjs

* **Uso**: evaluación matemática y diferenciación simbólica.
* **APIs**: `parse`, `compile`, `evaluate`, `derivative`.

```ts
import { parse, evaluate, derivative } from "mathjs";

const node = parse("x^2 + y^2");
const compiled = node.compile();
const result = compiled.evaluate({ x: 1, y: 2 }); // 5
```

### react-plotly.js + plotly.js

* **Uso**: visualización de superficies 3D (`type: 'surface'`).
* **Interacción**: rotar, *zoom*, *pan*, *reset*.
* **Escalas de color**: por ejemplo `Viridis`.

### Tailwind CSS

* **Uso**: diseño *utility-first*, gradientes, *backdrop blur*, *responsive*, y clases de animación.

---

## Estructura del proyecto

```
para-calculo/
├── app/
│   ├── page.tsx               # Landing
│   ├── calculator/
│   │   └── page.tsx           # Calculadora
│   ├── layout.tsx             # Layout raíz
│   └── globals.css            # Estilos globales + keyframes
├── components/
│   ├── Plot3D.tsx             # Visualización 3D
│   └── FloatingParticles.tsx  # Animación de fondo
├── package.json
└── README.md
```

---

## Componentes principales

### Landing (`app/page.tsx`)

* Fondo con gradiente y **`<FloatingParticles />`**.
* Título con gradiente de texto (Tailwind `bg-clip-text` + `text-transparent`).
* Grid de características (responsive) y botón **CTA** que navega a `/calculator`.

### Calculadora (`app/calculator/page.tsx`)

**Estado**

```ts
const [functionInput, setFunctionInput] = useState("x^2 + y^2");
const [plotData, setPlotData] = useState<any>(null);
const [derivatives, setDerivatives] = useState<{
  dfdx: string; dfdy: string; dfdxAt0: number; dfdyAt0: number;
} | null>(null);
const [error, setError] = useState("");
const [showDerivatives, setShowDerivatives] = useState(false);
```

**Funciones clave**

* `generatePlot()`: genera malla ([-5,5]\times[-5,5]) con paso `0.5` y evalúa `z = f(x,y)` en cada punto (441 evaluaciones). Actualiza `plotData`.
* `calculateDerivatives()`: deriva simbólicamente con `derivative()` y evalúa en (0,0).

### Plot 3D (`components/Plot3D.tsx`)

```ts
const plotData = [{
  type: 'surface' as const,
  x: data.x,
  y: data.y,
  z: data.z,
  colorscale: 'Viridis',
  showscale: true,
}];

const layout = {
  autosize: true,
  scene: {
    xaxis: { title: 'X' },
    yaxis: { title: 'Y' },
    zaxis: { title: 'Z = f(x,y)' },
    camera: { eye: { x: 1.5, y: 1.5, z: 1.3 } },
  },
  margin: { l: 0, r: 0, t: 0, b: 0 },
};
```

### Animación de fondo (`components/FloatingParticles.tsx`)

* Partículas con tamaño, retraso y duración variables.
* Símbolos matemáticos con animación lenta (`animate-float-slow`).
* Contenedor `fixed inset-0 pointer-events-none` para no bloquear la UI.

---

## Animaciones

En `app/globals.css` se definen `@keyframes` y utilidades:

```css
@keyframes float {
  0%   { transform: translateY(100vh) rotate(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}

@keyframes float-slow {
  0%,100% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
  50% { transform: translateY(-40px) translateX(-10px) rotate(-5deg); }
  75% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
}

.animate-float { animation: float linear infinite; }
.animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
```

> Sugerencia: si renders en SSR causan *mismatch*, genera valores aleatorios en `useEffect` o usa una semilla determinista.

---

## Lógica y funciones

### `generatePlot()` (resumen)

* Construye `xValues` y `yValues` con rango y paso configurables.
* Evalúa `z` con `evaluate(functionInput, { x, y })`.
* Actualiza `plotData` para `Plotly`.

### `calculateDerivatives()` (resumen)

* Obtiene expresiones simbólicas con `derivative(functionInput, 'x' | 'y')`.
* Evalúa en (0,0) con `evaluate` y muestra panel de resultados.

---

## Fundamentos matemáticos



### 1) ¿Qué estamos graficando?
- Funciones de dos variables: $z=f(x,y)$.
- Dibujamos la superficie evaluando $f$ en un **rectángulo** (por defecto $[-5,5]\times[-5,5]$) con un **paso** $h$ (0.5).
- Más chico $h$ = más detalle pero más lento; más grande $h$ = más rápido pero menos detalle.

---

### 2) Derivadas parciales (cambios en x o en y)
- $f_x(x,y)$: cómo cambia $f$ si mueves **x** y dejas **y** fija.  
- $f_y(x,y)$: cómo cambia $f$ si mueves **y** y dejas **x** fija.  
- En la app se obtienen con **mathjs** (`derivative(...)`) y se evalúan (por defecto en $(0,0)$).

**Idea rápida**
- $f_x>0$ → sube al moverte en $+x$.  
- $f_y<0$ → baja al moverte en $+y$.

---

### 3) Gradiente (dirección de mayor subida)
- $\nabla f=(f_x,f_y)$.
- Apunta hacia donde $f$ **crece más rápido** cerca del punto.

---

### 4) Plano tangente (aproximación lineal)
Si $f$ es suave en $(x_0,y_0)$:

$$
z \approx f(x_0,y_0)\;+\;f_x(x_0,y_0)\,(x-x_0)\;+\;f_y(x_0,y_0)\,(y-y_0).
$$

- Es “el mejor plano” que aproxima a la superficie cerca del punto.
- Con las parciales, la app puede dibujarlo como capa opcional.

---

### 5) Malla de evaluación (grid)
1) Creamos listas de valores para **x** y **y** (rango + paso).  
2) Formamos la malla $(X,Y)$.  
3) Calculamos $Z=f(X,Y)$ para graficar.

Con $21$ puntos por eje (de $-5$ a $5$ cada $0.5$) se hacen $21\times21=441$ evaluaciones.

---

### 6) Ejemplo exprés
$f(x,y)=\sin x \,\cos y$

- $f_x=\cos x \,\cos y$, $f_y=-\sin x\,\sin y$.  
- En $(0,0)$: $f=0,\; f_x=1,\; f_y=0$.  
- Plano tangente en $(0,0)$: $z\approx x$.  
  Cerca del origen la superficie parece un plano inclinado.

---

### 7) Ejemplos típicos (qué verás)
- **Paraboloide** $x^2+y^2$: mínimo en $(0,0)$, simetría radial. $f_x=2x,\ f_y=2y$.  
- **Silla** $x^2-y^2$: sube en $x$, baja en $y$. $f_x=2x,\ f_y=-2y$.  
- **Trigonométrica** $\sin x \cos y$: ondas periódicas.  
- **Gaussiana** $e^{-(x^2+y^2)}$: pico suave;  
  $f_x=-2x\,e^{-(x^2+y^2)},\ \ f_y=-2y\,e^{-(x^2+y^2)}$ (ojo con el factor exponencial).  
- **Plano** $2x+3y$: pendientes constantes.  
- **Producto** $xy$: contornos hiperbólicos; cambia de signo por cuadrantes.

---

### 8) Notas prácticas
- Funciones con puntas (p. ej. $|x|+|y|$) pueden no tener derivada en algunos puntos.  
- Exponenciales grandes pueden “quemar” la escala; ajusta el rango.  
- **mathjs**: usa `^` para potencias (`x^2`), escribe multiplicaciones (`x*y`), trigonometría en **radianes**.


Se incluyen ejemplos típicos: `x^2 + y^2`, `x^2 - y^2`, `sin(x)*cos(y)`, `exp(-(x^2+y^2))`, `x*y`.

---

## Estilos y diseño

* **Colores**: gradientes (`bg-gradient-to-br`), *glassmorphism* (`bg-white/5 backdrop-blur-sm border-white/10`).
* **Tipografía y espaciado**: utilidades de Tailwind (`text-`, `p-`, `gap-`, `md:`...).
* **Accesibilidad**: contraste suficiente y *focus ring* visible.

---

## Instalación y uso

### Requisitos previos

* Node.js 18+
* npm o yarn

### Pasos

```bash
# 1) Clonar o descargar
# git clone https://github.com/<tu-usuario>/para-calculo.git
cd para-calculo

# 2) Instalar dependencias
npm install

# 3) Desarrollo
npm run dev
# Abre http://localhost:3000

# 4) Producción
npm run build
npm start
```

> Si despliegas en **Vercel**, basta con `vercel` (o conectar el repo) y Vercel ejecutará `next build` automáticamente.

---

## Ejemplos de funciones

* Paraboloide: `x^2 + y^2` → (\partial_x = 2x), (\partial_y = 2y)
* Silla de montar: `x^2 - y^2` → (\partial_x = 2x), (\partial_y = -2y)
* Trigonométrica: `sin(x) * cos(y)` → (\partial_x = \cos x \cos y), (\partial_y = -\sin x \sin y)
* Gaussiana: `exp(-(x^2 + y^2))` → (\partial_x = -2x,e^{-(x^2+y^2)}), (\partial_y = -2y,e^{-(x^2+y^2)})
* Plano: `2*x + 3*y` → derivadas constantes 2 y 3
* Producto: `x * y` → (\partial_x = y), (\partial_y = x)

**Notas de sintaxis (mathjs)**

* Potencia: `^` o `**` (usar `^` en los ejemplos)
* Multiplicación explícita: `x*y` (no `xy`)
* Evitar superíndices Unicode (`x²`), usar `x^2`

---

## Solución de problemas

* **No se ve el gráfico**: valida la expresión, revisa consola y que `react-plotly.js` cargue en cliente (`dynamic(..., { ssr: false })`).
* **Derivadas `NaN`**: la función puede no ser diferenciable en (0,0), p. ej. `abs(x)+abs(y)`.
* **Animaciones con *lag***: reduce número de partículas o aumenta la duración.
* **Errores de hidratación**: evita `Math.random()`/`Date.now()` durante el render SSR; genera en `useEffect` o usa semilla.

---

## Extensiones futuras

* Curvas de nivel (contornos 2D).
* Vector gradiente y plano tangente interactivos.
* Hessiana y clasificación de puntos críticos.
* Exportar imagen/CSV.
* Controles de animación (velocidad, densidad, temas).

---

## Licencia y contacto

Proyecto con fines educativos para Cálculo Multivariable.

* **mathjs** — Motor matemático
* **Plotly.js** — Visualización 3D
* **Next.js** — Framework React
* **Tailwind CSS** — Estilos

¿Dudas o sugerencias? Abre un *issue* en el repositorio o escribe en la sección de *discussions*.

---

**Última actualización**: Octubre 2025
**Versión**: 2.0.0
**Novedades**: Animaciones con partículas, landing mejorada, navegación entre páginas.

[![By: AlejandroBast](https://img.shields.io/badge/By-AlejandroBast-6b9cff)](https://github.com/AlejandroBast)

