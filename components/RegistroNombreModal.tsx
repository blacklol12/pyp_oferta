"use client";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (nombre: string) => void;
}

export default function RegistroNombreModal({ open, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  // 🔥 Función que genera el mensaje de error exacto
  const getErrorNombre = (value: string) => {
    const nombre = value.trim();

    if (!nombre) return "";

    // Solo letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre))
      return "El nombre solo puede contener letras y espacios.";

    const partes = nombre.split(/\s+/);

    // Mínimo 2 palabras
    if (partes.length < 2)
      return "Por favor ingresa nombre y apellido válidos.";

    // Máximo 4 palabras
    if (partes.length > 4)
      return "El nombre es demasiado largo.";

    // Ninguna palabra debe tener menos de 2 letras
    if (partes.some((p) => p.length < 2))
      return "Cada parte del nombre debe tener al menos 2 letras.";

    // Bloquear secuencias de consonantes absurdas
    if (/[bcdfghjklmnpqrstvwxyz]{3,}/i.test(nombre))
      return "El nombre contiene secuencias de consonantes no válidas.";

    return "";
  };

  const validarNombre = (value: string) => {
    const err = getErrorNombre(value);
    setError(err);
    return err === "";
  };

  return (
    <div className="fixed inset-0 bg-white z-50 animate-fadeIn">

      {/* Borde superior verde */}
      <div className="h-8 bg-linear-to-r from-[#1B0041] to-[#1B0041] rounded-b-2xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mt-4 px-6 pb-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-[#1B0041]">
          Registro de Usuario
        </h1>

        <button
          onClick={onClose}
          className="text-gray-700 text-3xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Instrucción */}
      <p className="text-center text-[#1B0041] mt-6 px-6">
        Por favor ingresa tu nombre completo para continuar.
      </p>

      {/* Form */}
      <div className="px-6 mt-6">

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*$/.test(val)) {
              setNombre(val);
              validarNombre(val);
            }
          }}
          maxLength={40}
          className={`
            w-full px-4 py-3 rounded-xl bg-white border text-[#1B0041] 
            outline-none transition
            ${error ? "border-[#1B0041] bg-red-50" : "border-gray-300"}
          `}
        />

        {/* Error */}
        {error && (
          <p className="text-[#1B0041] text-sm mt-2">{error}</p>
        )}

        {/* Botón */}
        <button
          disabled={!!error || nombre.trim().length < 4}
          onClick={() => onSave(nombre.trim())}
          className={`
            w-full mt-6 py-3 rounded-xl text-lg font-semibold transition
            ${!error && nombre.trim().length >= 4
              ? "bg-[#1B0041] text-white cursor-pointer"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"}
          `}
        >
          Continuar
        </button>

      </div>
    </div>
  );
}