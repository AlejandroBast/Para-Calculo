"use client"

import { useRouter } from "next/navigation"
import FloatingParticles from "@/components/FloatingParticles"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      <FloatingParticles />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-[1]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <div className="mx-auto mb-1 w-50 h-50">
            <img src="/favicon.svg" alt="Logo" className="w-50 h-50" />
          </div>

          {/* Title */}
          <h1 className="text-50px md:text-7xl font-bold text-white leading-tight">
            Para-
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Calculo
            </span>
            <br />
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Visualiza tus funciones de manera interactiva y encuentra sys derivadas parciales!          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-lg font-semibold text-white mb-2">Gráficas 3D</h3>
              <p className="text-gray-400 text-sm">Grafica la funcion que desees y interactua con ella!</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">🧮</div>
              <h3 className="text-lg font-semibold text-white mb-2">Derivadas Parciales</h3>
              <p className="text-gray-400 text-sm">Encuentra sus derivadas parciales rapidamente!</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold text-white mb-2">Educativo</h3>
              <p className="text-gray-400 text-sm">Esta aplicacion esta hecha por y para estudiantes, aprende y disfruta</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => router.push("/calculator")}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <span>Empezar!</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Footer info */}
          <div className="pt-12 text-gray-500 text-sm">
            <p>By AlejandroBast ;)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
