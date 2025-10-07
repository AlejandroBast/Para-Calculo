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
.animate-float-slow { animation: float-slow 20s ease-in-out
```
