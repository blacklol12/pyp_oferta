/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";

// Los iconos de 'react-icons' han sido eliminados y reemplazados por SVG nativo
// import { IoMdArrowBack } from "react-icons/io";
// import { IoClose } from "react-icons/io5";
// Tipo para el estado del viaje, tomado del componente padre
type TripType = 'round-trip' | 'one-way';

export default function BookingSummaryModal({
  origen,
  destino,
  ida,
  vuelta,
  pasajeros,
  tripType, // 💡 NUEVA PROP: Tipo de viaje
  onEditOrigen,
  onEditDestino,
  onEditIda,
  onEditVuelta,
  onEditPasajeros,
  onClose,
  onSearch,
}: {
  origen: string;
  destino: string;
  ida: string;
  vuelta: any;
  pasajeros: any;
  tripType: TripType; // 💡 NUEVA PROP REQUERIDA
  onEditOrigen: () => void;
  onEditDestino: () => void;
  onEditIda: () => void;
  onEditVuelta?: () => void;
  onEditPasajeros: () => void;
  onClose: () => void;
  onSearch: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Determina si el viaje es Solo Ida
  const isOneWay = tripType === 'one-way';

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* ✅ HEADER */}
      <div className="bg-[#111111] text-white flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="text-[18px] w-5 h-5 flex items-center justify-center">
          {/* Reemplazo de IoMdArrowBack con SVG nativo */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-[18px]">Reserva tu vuelo</h1>
        <button onClick={onClose} className="text-[18px] w-5 h-5 flex items-center justify-center">
          {/* Reemplazo de IoClose con SVG nativo */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ✅ CONTENT */}
      <div className="w-full max-w-lg mx-auto p-4 bg-white min-h-screen">

        {/* ✈️ 1. TOGGLE IDA Y VUELTA / SOLO IDA (Solo visual, no interactivo) */}
        <div className="w-full flex justify-center mb-6">
          <div className="inline-flex items-center bg-white rounded-full shadow-md px-4 py-2 gap-4">

            {/* OPCIÓN: Ida y vuelta */}
            <div className="flex items-center gap-2 outline-none">
              {/* Icono Radio */}
              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${!isOneWay ? 'bg-[#4ade80]' : 'border-2 border-gray-400 bg-transparent'}`}>
                {!isOneWay && <div className="h-2 w-2 rounded-full bg-white"></div>}
              </div>
              <span className={`text-base font-medium tracking-tight ${!isOneWay ? 'text-black' : 'text-gray-500'}`}>
                Ida y vuelta
              </span>
            </div>

            {/* OPCIÓN: Solo ida */}
            <div className="flex items-center gap-2 outline-none">
              {/* Icono Radio */}
              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${isOneWay ? 'bg-[#4ade80]' : 'border-2 border-gray-400 bg-transparent'}`}>
                {isOneWay && <div className="h-2 w-2 rounded-full bg-white"></div>}
              </div>
              <span className={`text-base font-medium tracking-tight ${isOneWay ? 'text-black' : 'text-gray-500'}`}>
                Solo ida
              </span>
            </div>
          </div>
        </div>

        {/* 🚀 2. CAMPOS DE BÚSQUEDA */}
        <div className="space-y-4">

          {/* ✅ ORIGEN / DESTINO */}
          {/* ... (sin cambios) */}
          <div className="flex border border-gray-300 rounded-sm overflow-hidden relative">

            {/* Botón de Intercambio (Centrado) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="bg-white p-1 rounded-full border border-gray-300 shadow-sm">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </span>
            </div>

            {/* ORIGEN */}
            <button
              className="flex-1 p-3 flex items-center gap-3 text-left relative z-0"
              onClick={onEditOrigen}
            >
              {/* Icono de Despegue (SVG) */}
              <img src="/origen.png" alt="destino" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 leading-tight">Origen</span>
                {/* Usando la variable {origen} */}
                <span className="text-lg font-bold text-black leading-tight truncate">{origen}</span>
              </div>
            </button>

            <div className="w-px bg-gray-200 my-2" />

            {/* DESTINO */}
            <button
              className="flex-1 p-3 flex items-center gap-3 text-left relative z-0"
              onClick={onEditDestino}
            >
              {/* Icono de Aterrizaje (SVG) */}
              <img src="/destino.png" alt="destino" className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 leading-tight">Destino</span>
                {/* Usando la variable {destino} o placeholder */}
                <span className={`text-lg font-bold leading-tight truncate ${destino ? "text-black" : "text-gray-400"}`}>
                  {destino || "Destino"}
                </span>
              </div>
            </button>
          </div>

          {/* ✅ FECHAS */}
          <div className="flex border border-gray-300 rounded-sm overflow-hidden">

            {/* IDA */}
            <button
              className="flex-1 p-3 flex items-center gap-3 text-left"
              onClick={onEditIda}
            >
              {/* Icono de Calendario (SVG) */}
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 leading-tight">Ida</span>
                {/* Usando la variable {ida} */}
                <span className="text-lg font-bold text-black leading-tight">{ida}</span>
              </div>
            </button>

            <div className="w-px bg-gray-200 my-2" />

            {/* 💡 VUELTA (CONDICIONAL) */}
            <button
              // Deshabilita el botón si es Solo Ida
              disabled={isOneWay}
              // Solo permite editar si no es Solo Ida
              onClick={!isOneWay ? onEditVuelta : undefined}
              className={`flex-1 p-3 flex items-center gap-3 text-left transition-opacity ${isOneWay ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Icono de Calendario (SVG) */}
              <svg className={`w-6 h-6 ${isOneWay ? 'text-gray-400' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 leading-tight">Vuelta</span>
                {/* Muestra la fecha si existe, si no, "N/A" */}
                <span className={`text-lg font-bold leading-tight ${isOneWay ? 'text-gray-400' : 'text-black'}`}>
                  {isOneWay ? 'N/A' : (vuelta || 'Seleccionar')}
                </span>
              </div>
            </button>
          </div>

          {/* ✅ PASAJEROS */}
          <button
            onClick={onEditPasajeros}
            className="flex border border-gray-300 rounded-sm p-4 items-center gap-3 text-left w-full h-16"
          >
            {/* Icono de Personas + (SVG) */}
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 19l2-2m-2 0l-2 2m2-2v4" />
            </svg>
            {/* Usando la variable {pasajeros} */}
            <span className="text-lg font-bold text-black">{pasajeros}</span>
          </button>
        </div>

        {/* 🔍 3. SEARCH BUTTON */}
        <button
          onClick={onSearch}
          className="mt-6 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-full text-xl font-bold transition-transform active:scale-[0.99]"
        >
          Buscar
        </button>

      </div>
    </div>
  );
}