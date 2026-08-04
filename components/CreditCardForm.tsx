/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useMemo } from "react";
import { FaUser } from 'react-icons/fa';
import { FaCreditCard } from "react-icons/fa6";

// Importa tu componente de selección de país (asumo que existe)
// import CountrySelect from "./CountrySelect"; 
// --- Configuración de Debouncing ---
const DEBOUNCE_DELAY = 500; // 500ms de espera
const LOCAL_STORAGE_KEY = "cardPaymentData"; // Clave única para guardar los datos

// --- Funciones de Utilidad (Definiciones Requeridas) ---

/**
 * 1. Implementa el Algoritmo de Luhn (Módulo 10).
 */
const luhnCheck = (cardNumber: string): boolean => {
  const cleanedNumber = String(cardNumber).replace(/\s+/g, '').replace(/-/g, '');
  if (!/^\d{12,19}$/.test(cleanedNumber)) return false;

  let sum = 0;
  let double = false;
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return (sum % 10) === 0;
};

/**
 * 2. Detecta el tipo de tarjeta (Visa, MC, Amex) y hace la validación de longitud.
 */
const detectCardType = (number: string) => {
  const cleanedNumber = number.replace(/\s+/g, '').replace(/-/g, '');
  let cardType = 'unknown';

  if (/^4/.test(cleanedNumber)) cardType = 'visa';
  else if (/^(5[1-5]|222[1-9]|2[3-7])/.test(cleanedNumber)) cardType = 'mastercard';
  else if (/^3[47]/.test(cleanedNumber)) cardType = 'amex';

  const isLuhnValid = luhnCheck(cleanedNumber);

  const isLengthValid =
    (cardType === 'visa' && (cleanedNumber.length === 13 || cleanedNumber.length === 16 || cleanedNumber.length === 19)) ||
    (cardType === 'mastercard' && cleanedNumber.length === 16) ||
    (cardType === 'amex' && cleanedNumber.length === 15) ||
    (cardType === 'unknown' && cleanedNumber.length > 0); // Permite otros tipos si es de longitud válida

  return {
    type: cardType,
    isValid: isLuhnValid && isLengthValid,
  };
};

/**
 * 3. Consulta asíncrona a la API de BIN (con manejo de 403/429).
 */
const lookupBin = async (bin: string) => {
  localStorage.removeItem('binbank');
  if (bin.length < 6) return null;
  try {

    const response = await fetch(`/api/bin?bin=${bin}`);

    if (!response.ok) {
      // No es necesariamente un error grave, solo que el BIN no está en la base de datos
      console.log("Error 403/429: Límite de solicitudes de la API alcanzado. La información del banco no estará disponible.", response);
      return null;
    }

    const data = await response.json();
    //  console.log('data', data);
    localStorage.setItem('binbank', JSON.stringify(data));
    return {
      bankName: data.bank?.name || null,
      countryName: data.country?.name || null,
      scheme: data.scheme || 'unknown'
    };
  } catch (error) {
    console.error("Error en la conexión al consultar el BIN:", error);
    return null;
  }
};

// --- Componente Toggle (Asumo que existe) ---
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-[52px] h-[30px] rounded-full flex items-center px-1 transition-colors ${checked ? "bg-[#00b050]" : "bg-[#d3d3d3]"
        }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );
}

// --- Componente CreditCardForm ---

export default function CreditCardForm() {

  // --- ESTADO Y REFERENCIA ---
  const [cardData, setCardData] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    return {
      holder: "",
      number: "",
      month: "",
      year: "",
      cvv: "",
      email: "",
      address: "",
      city: "",
      country: "",
      type: "unknown",
      bankName: null as string | null,
      countryName: null as string | null,
      isValidNumber: false,
    };
  });

  const [splitLocal, setSplitLocal] = useState(false);
  const [splitTwoCards, setSplitTwoCards] = useState(false);

  // Referencia para el temporizador de Debouncing
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔄 FUNCIÓN AUXILIAR: Actualiza el estado y guarda en LocalStorage
  const updateAndSave = (updates: any) => {
    setCardData((prev: any) => {
      const newState = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
      }
      return newState;
    });
  };

  // --- MANEJO ASÍNCRONO DEL NÚMERO DE TARJETA ---

  const processCardNumber = async (number: string) => {
    const cleanedNumber = number.replace(/\D/g, '').replace(/\s+/g, '');
    const bin = cleanedNumber.substring(0, 6);

    // 1. Validaciones Síncronas
    const isValidLuhn = luhnCheck(cleanedNumber);
    const { type: localType, isValid: isBinLengthValid } = detectCardType(cleanedNumber);

    let bankData: any = { bankName: null, countryName: null, scheme: localType };

    // 2. Consulta Asíncrona (SOLO si hay 6 dígitos)
    if (bin.length === 6) {
      const data = await lookupBin(bin);
      if (data) {
        bankData = data;
      }
    }

    // 3. Actualización Final de los datos derivados
    // ✅ USAR updateAndSave
    updateAndSave({
      type: bankData.scheme || localType,
      bankName: bankData.bankName,
      countryName: bankData.countryName,
      isValidNumber: isValidLuhn && isBinLengthValid,
    });
  };

  // --- MANEJADOR DE CAMBIO PRINCIPAL (SÍNCRONO) ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'number') {
      // 1. FILTRADO (Solo dígitos)
      const filteredValue = value.replace(/\D/g, '');

      // Actualización inmediata del input
      // ✅ USAR updateAndSave
      updateAndSave({ [name]: filteredValue });

      // --- DEBOUNCING ---
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      // Si hay suficientes dígitos para la consulta, iniciamos el temporizador
      if (filteredValue.length >= 6) {
        typingTimerRef.current = setTimeout(() => {
          processCardNumber(filteredValue);
        }, DEBOUNCE_DELAY);
      } else {
        // Resetear datos si se borra el número
        // ✅ USAR updateAndSave
        updateAndSave({
          type: 'unknown',
          bankName: null,
          countryName: null,
          isValidNumber: false,
        });
      }

    } else {
      // Manejo de Otros Campos (síncrono)
      // ✅ USAR updateAndSave
      updateAndSave({ [name]: value });
    }
  };

  // --- Renderizado de Iconos ---
  const cardImages: any = {
    visa: <img src="/icons/visa.svg" alt="Visa" className="w-8 h-8" />,
    mastercard: <img src="/icons/mastercard.svg" alt="Mastercard" className="w-8 h-8" />,
    amex: <img src="/icons/amex.svg" alt="Amex" className="w-8 h-8" />,
    unknown: <FaCreditCard className="text-[22px]" />,
  };

  // --- JSX (RENDERIZADO) ---
  return (
    <div className="rounded-[28px] bg-white">

      {/* CAMPOS TARJETA */}
      <div className="space-y-4 mt-3">
        {/* NOMBRE DEL TITULAR */}
        <div className="border border-[#d3d3d3] rounded-sm h-[62px] flex items-center px-4 text-[18px] gap-3">
          <span className="text-[22px]"><FaUser /></span>
          <input
            name="holder"
            value={cardData.holder}
            onChange={handleChange}
            placeholder="Nombre del titular"
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* NÚMERO DE TARJETA */}
        <div className="border border-[#d3d3d3] rounded-sm  h-[62px] flex items-center px-4 text-[18px] gap-3">
          <span className="text-[22px]">
            {cardImages[cardData.type] || cardImages['unknown']}
          </span>
          <input
            name="number"
            value={cardData.number}
            onChange={handleChange}
            placeholder="Número de tarjeta"
            className="w-full bg-transparent outline-none"
            maxLength={19}
          />
        </div>

        {/* FEEDBACK DEL BANCO Y VALIDEZ */}
        {(cardData.bankName || cardData.number.length >= 6) && (
          <div className="mt-2 text-sm pl-4">
            {cardData.bankName && (
              <p className="text-gray-700">
                Emitido por: **{cardData.bankName}** ({cardData.countryName})
              </p>
            )}

            {cardData.number.length >= 12 && !cardData.isValidNumber && (
              <p className="text-red-500 font-medium">
                ⚠️ El número es inválido
              </p>
            )}
          </div>
        )}

        {/* FECHA + CVV */}
        <div>
          <p className="text-[16px] text-gray-700 mb-2">Fecha de Expiración</p>
          <div className="flex gap-4">
            {/* MES */}
            <div className="flex-1 border border-[#d3d3d3] rounded-sm h-[62px] flex items-center px-4 text-[18px] justify-between">
              <select
                name="month"
                value={cardData.month}
                onChange={handleChange}
                className="w-full bg-transparent outline-none appearance-none pr-6"
              >
                <option value="">Mes</option>
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = i + 1;
                  return (
                    <option key={m} value={m.toString().padStart(2, "0")}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  );
                })}
              </select>
              <span className="text-[22px] text-gray-500">▾</span>
            </div>

            {/* AÑO */}
            <div className="flex-1 border border-[#d3d3d3] rounded-sm  h-[62px] flex items-center px-4 text-[18px] justify-between">
              <select
                name="year"
                value={cardData.year}
                onChange={handleChange}
                className="w-full bg-transparent outline-none appearance-none pr-6"
              >
                <option value="">Año</option>
                {Array.from({ length: 15 }).map((_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
              <span className="text-[22px] text-gray-500">▾</span>
            </div>

            {/* CVV */}
            <div className="flex-[0.9] border border-[#d3d3d3] rounded-sm  h-[62px] flex items-center px-4 text-[18px] justify-between gap-2">
              <input
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                placeholder="CVV"
                className="w-full bg-transparent outline-none"
                maxLength={4}
                inputMode="numeric"
              />
              <span className="text-[22px] text-gray-500">i</span>
            </div>
          </div>
        </div>
      </div>

      {/* DATOS DE FACTURACIÓN */}
      <div className="mt-6">
        <p className="text-[20px] font-semibold mb-3">Datos de facturación</p>

        <div className="space-y-4">
          {/* EMAIL */}
          <div className="border border-[#d3d3d3] rounded-sm  h-[62px] flex items-center px-4 text-[18px]">
            <input
              name="email"
              type="email"
              value={cardData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* DIRECCIÓN */}
          <div className="border border-[#d3d3d3] rounded-sm  h-[62px] flex items-center px-4 text-[18px]">
            <input
              name="address"
              value={cardData.address}
              onChange={handleChange}
              placeholder="Dirección de residencia"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* CIUDAD */}
          <div className="border border-[#d3d3d3] rounded-sm h-[62px] flex items-center px-4 text-[18px]">
            <input
              name="city"
              value={cardData.city}
              onChange={handleChange}
              placeholder="Ciudad"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {/* PAÍS */}
          {/* Reemplaza con tu componente CountrySelect */}
          {/* <CountrySelect
                        placeholder="País"
                        onCountryChange={(country: any) => updateAndSave({ country: country.value })}
                    />
                    */}
        </div>
      </div>
    </div>
  );
}