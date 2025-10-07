"use client";
import { useEffect, useState } from "react";

const SIMBOLOS = "∂∫∑π∞√∇±≈→←αβγδλμθΩψΣΠΔ∇≙≠≥≤∵∴∛".split("");

type Letra = {
  id: number;
  char: string;
  top: number;
  left: number;
  size: number;         // en rem
  delay: number;        // en s
  duration: number;     // en s
  opacity: number;      // 0–1
};

export default function FloatingParticles() {
  const [letras, setLetras] = useState<Letra[]>([]);

  useEffect(() => {
    const N = 120; // ⬅️ AUMENTA ESTA CANTIDAD
    const arr = Array.from({ length: N }, (_, i) => ({
      id: i,
      char: SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)],
      top: Math.random() * 100,  
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 5, 
      duration: 10 + Math.random() * 20,
      opacity: 0.06 + Math.random() * 0.08,
    }));
    setLetras(arr);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {letras.map((l) => (
        <span
          key={l.id}
          className="absolute select-none animate-float-slow will-change-transform"
          style={{
            top: `${l.top}%`,
            left: `${l.left}%`,
            fontSize: `${l.size}rem`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            opacity: l.opacity,
          }}
        >
          {l.char}
        </span>
      ))}
    </div>
  );
}
