/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useMemo } from "react";

export default function DateStrip({
  type,
  selected,
  onChange,
}: {
  type: "ida" | "vuelta";
  selected: string;
  onChange: (d: string) => void;
}) {
  if (!selected) return null;

  const selDate = new Date(selected);

  const prev = new Date(selDate);
  prev.setDate(prev.getDate() - 1);

  const next = new Date(selDate);
  next.setDate(next.getDate() + 1);

  const format = (d: Date): string => {
    // 1. Usar toLocaleDateString con el formato deseado
    const dateString = d.toLocaleDateString("es-CO", {
      weekday: "short", // Ej: "vie."
      day: "2-digit",   // Ej: "27"
      month: "short",   // Ej: "nov."
    });

    // 2. Limpiar la cadena resultante para eliminar la preposición y los puntos:

    // Expresión regular que busca la preposición "de" (seguida o precedida por espacios)
    // y también los puntos (.) al final de las abreviaturas.
    return dateString
      .replace(/de /g, "") // Eliminar "de " (con espacio)
      .replace(/\./g, "")   // Eliminar todos los puntos (p. ej., "vie." -> "vie")
      ;      // Opcional: convertir todo a mayúsculas para un estilo consistente (VIE 27 NOV)
  };

  // PRECIOS RANDOM PARA MAQUETA
  const randomPrice = () =>
    Math.floor(200000 + Math.random() * 700000).toLocaleString("es-CO");

  const options = [
    { date: prev, price: Number(119600).toLocaleString("es-CO"), iso: prev.toISOString().slice(0, 10) },
    { date: selDate, price: Number(46400).toLocaleString("es-CO"), iso: selDate.toISOString().slice(0, 10) },
    { date: next, price: Number(119000).toLocaleString("es-CO"), iso: next.toISOString().slice(0, 10) },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mt-6 text-sm"> {/* text-sm (14px) en el contenedor principal */}

      {/* FLECHA IZQUIERDA (PREVIA) */}
      <button className="text-gray-400 p-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => onChange(opt.iso)}
          className={`
        flex flex-col items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer
        
        ${opt.iso === selected
              ? "border-2 border-[#81c784] rounded-xl text-black shadow-md min-w-[100px] bg-white" // ACTIVO: Borde verde, redondeo suave, sombra
              : "text-gray-400" // INACTIVO: Texto gris suave
            } 
      `}
        >
          {/* Día y Mes (Jue. 27 Nov.) -> Usando text-sm (14px) para el texto normal */}
          <p className={`text-sm leading-tight ${opt.iso === selected ? "font-bold" : "font-medium"}`}>
            {/* Usando text-base (16px) para el día seleccionado para que resalte, si 14px es el mínimo.
           Si todo debe ser 14px, usa text-sm en ambos lugares. Mantendré el contraste para la jerarquía. */}
            <span className={`${opt.iso === selected ? "text-[14px] font-extrabold" : "text-sm font-medium"}`}>
              {format(opt.date)}
            </span>
          </p>

          {/* Precio (COP 616.800) -> Usando text-base (16px) y font-extrabold para que se lea bien. */}
          <p className={`
        text-[14px] mt-1 leading-tight 
        ${opt.iso === selected
              ? "font-bold " // Precio en negrita extrafuerte si está seleccionado
              : "text-gray-500" // Precio en gris si está inactivo
            }
      `}>
            {opt.price === '-' ? '-' : `COP ${opt.price}`}
          </p>
        </div>
      ))}

      {/* FLECHA DERECHA (SIGUIENTE) */}
      <button className="text-black p-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}