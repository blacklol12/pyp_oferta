/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";

export default function BookingFooterFinal({ onContinue }: { onContinue: () => void }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("totalPrice");
    if (saved) setTotal(Number(saved));
  }, []);

  if (!total) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white pt-4 pb-6 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      {/* ✅ Cart button */}
      <button className="w-full  border-2 button-foot text-[16px] font-semibold py-4 rounded-[40px] flex items-center justify-center gap-2" onClick={onContinue}>
        <span className="text-[22px]"><FaCartShopping className="w-4 h-4" />
        </span>
        COP {total.toLocaleString("es-CO")}
      </button>

      {/* ✅ Continuar button */}
      <button className="w-full mt-3 btn-next button-foot  text-white text-[16px] font-semibold py-4 rounded-[40px]" onClick={onContinue}>
        Continuar
      </button>

    </div>
  );
}