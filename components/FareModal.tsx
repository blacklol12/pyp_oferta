/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

// Definiciones de tipos (sacadas de la conversación previa)
type Fare = {
  name: string;
  price: number;
  icon: string;
  ty: string;
  recommended?: boolean;
  features: { label: string; included: boolean }[];
};

interface FareModalProps {
  fares: Fare[] | any;
  segment: "ida" | "vuelta"; // "ida" | "vuelta"
  onClose: () => void;
  onSelect: (fare: Fare, segment: "ida" | "vuelta") => void;
}

export default function FareModal({
  fares,
  segment,
  onClose,
  onSelect,
}: FareModalProps) {
  // 1. ESTADO PARA LA ANIMACIÓN
  const [isOpen, setIsOpen] = useState(false);
  const ANIMATION_DURATION = 500; // Coincide con 'duration-500'

  useEffect(() => {
    // Control del Overflow
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Inicia la animación de entrada
    setIsOpen(true);

    // Limpieza
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // 2. Función de Cierre con Animación de Salida
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, ANIMATION_DURATION);
  };

  // 3. Clases Condicionales para la Animación
  const slideClass = isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0";

  return (
    // OVERLAY
    <div
      className={`
        fixed inset-0 z-999 bg-black/40 flex items-end 
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0"} 
      `}
      onClick={handleClose}
    >
      {/* DRAWER */}
      <div
        className={`
          bg-white w-full fares-compare rounded-t-[28px] max-h-[90vh] flex flex-col
          transform transition-transform duration-500 ease-out 
          ${slideClass} 

        `}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ✅ HEADER FIJO */}
        <div className="fares-compare_header">
          <h2 className="fares-compare_title">
            Selecciona tu tarifa
          </h2>
          <button onClick={handleClose} className="text-3xl fares-compare_button-close text-gray-500">
            <IoClose />
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 shrink-0" />

        {/* ✅ FARE LIST (Contenido Desplazable) */}
        <div className="px-4 pb-8 pt-4 space-y-6 overflow-y-auto">
          {fares.map((fare: any, i: any) => (
            // APLICANDO LA ESTRUCTURA DE LA TARJETA SOLICITADA
            <div
              key={i}
              className={`fare-control my-${i}_tag`}
            >

              {/* ETIQUETA RECOMENDADA */}
              {fare.recommended && (
                <div className="absolute top-0 right-0 bg-[#8a167b]  text-white text-xs font-semibold px-4 py-1 rounded-bl-3xl rounded-tr-2xl">
                  Recomendada
                </div>
              )}

              {/* HEADER: Nombre y Subtítulo */}
              <div className="fare_header">
                <p className="fare_name">
                  {/* Dinámico: fare.name */}
                  {fare.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {/* Dinámico: Slogan */}
                  {fare.name === "Basic" ? "Vuela ligero" : "Más completo"}
                </p>
              </div>
              <div className="fare_button_price p-3">

                <div className="price_currency">
                  <span className="currency text-space-gap">COP</span>
                  <span className="price text-space-gap">{fare.price.toLocaleString("es-CO")}</span>
                </div>
              </div>

              {/* BODY: Lista de Características (Dinámico) */}
              <div className="fare_body">
                <ul className="fare_list">
                  {fare.features.map((f: any, idx: any) => (
                    <li
                      key={idx}
                      className={`flex fare_list_item items-start gap-3 ${f.included ? "text-gray-700" : "text-gray-400"}`}
                    >

                      {/* ICONO */}
                      <span className="shrink-0 pt-0.5">
                        <div className="fare_list_item_icon">
                          <span className={`${f.icon} ${f.ty}`}></span>
                        </div>
                      </span>
                      {/* ETIQUETA */}
                      <span className={`fare_list_item_description ${f.ty != 'iconmuted' ? 'text-[#1B1B1B]' : 'iconmuted'}`}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul></div>

              {/* FOOTER: Botón y Nota de Precio */}
              <div className="fare_footer">
                <button
                  onClick={() => onSelect(fare, segment)}
                  className="fare_button"
                >
                  Seleccionar
                </button>
                <p className="fare_price-info">
                  Precio por pasajero
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}