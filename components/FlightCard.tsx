/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function FlightCard({
  departureTime,
  arrivalTime,
  from,
  to,
  duration,
  type,
  operated,
  price,
  selected = false,
  fare = null,
  bestOption,
  onSelect,
}: {
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  duration: string;
  type: string;
  operated: string;
  price: string;
  selected?: boolean;
  fare?: any;
  bestOption?: any;
  onSelect?: () => void;
}) {
  return (
    <div
      className={`mt-4 journeysbox bg-white rounded-3xl  transition-all w-full max-w-sm mx-auto
    ${selected ? "border-4 border-[#12ab70]" : "border border-gray-100 cursor-pointer"
        }`}
      onClick={!selected ? onSelect : undefined}
    >

      {/* ✅ ETIQUETA "MEJOR PRECIO" (Esquina superior derecha) */}
      {bestOption &&
        <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-3.5">
          <div className="journey_best-price text-black text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <span className="text-sm font-extrabold">$</span>
            Mejor precio
          </div>
        </div>}

      {/* TOP AREA: HORARIOS Y TRAYECTO */}
      <div className="flex justify-between items-center pt-8 p-5">

        {/* LEFT TIME & ORIGEN (BOG) */}
        <div className="text-left">
          <p className="text-[22px] font-semibold leading-none text-black">{departureTime}</p>
          <p className="text-xl font-medium mt-1 text-black">{from}</p>
        </div>

        {/* CENTER TIMELINE Y DETALLES */}
        <div className="flex flex-col items-center grow mx-2 mt-4">

          <div className="flex items-center gap-2 text-xs mb-1">
            {/* Usando DIV en lugar de underline para el estilo de enlace limpio */}
            <p className="text-xs text-[#0190a0] font-light tracking-tight underline">Directo</p>
            <div className="w-px h-3 bg-gray-300" /> {/* Separador vertical */}
            <p className="text-xs text-gray-700 font-medium">{duration}</p>
          </div>

          {/* LÍNEA DE TIEMPO (Puntos y Línea punteada) */}
          <div className="flex items-center w-full">
            {/* Punto Izquierdo */}
            <span className="w-2 h-2 bg-[#0190a0] rounded-full shrink-0" />
            {/* Línea Punteada */}
            <div className="border-t border-dashed border-gray-400 w-full" />
            {/* Punto Derecho */}
            <span className="w-2 h-2 bg-[#0190a0] rounded-full shrink-0" />
          </div>

          {/* Operado por Avianca */}
          <div className="flex justify-center mt-3">
            <div className="bg-[#fafafa] text-[#5a5a5a] text-xs px-4 py-1 rounded-lg font-medium whitespace-nowrap">
              Operado por {operated}
            </div>
          </div>
        </div>

        {/* RIGHT TIME & DESTINO (AXM) */}
        <div className="text-right">
          <p className="text-[22px] font-semibold leading-none text-[#1b1b1b]">{arrivalTime}</p>
          <p className="text-xl font-medium mt-1 text-[#1b1b1b]">{to}</p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}

      {/* PRICE Y FOOTER */}
      <div className="mt-4 pt-4 bg-[#fafafa] text-center p-5 rounded-bl-3xl rounded-br-3xl">
        <p className="text-sm text-gray-500 font-nomal tracking-tight">Desde</p>

        <div className="mt-1 flex items-center justify-center gap-1">
          <p className="  text-[#1b1b1b] leading-none">
            <span className="text-[16px]"> COP</span> <span className="text-[36px] font-bold">{fare ? fare.price : price}</span>
          </p>
          {/* Icono de Flecha hacia abajo */}
          <span className="text-2xl font-nomal text-gray-500">⌄</span>
        </div>

        {/* Si necesitas la tarifa extra (no visible en esta imagen específica) */}
        {fare && (
          <div className="mt-3 bg-[#e12424] text-white px-4 py-1 rounded-sm inline-block text-sm font-semibold">
            {fare.name}
          </div>
        )}
      </div>
    </div>
  );
}