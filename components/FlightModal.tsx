/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function FlightModal({
  title,
  icon,
  value,
  data,
  onSelect,
  onClose,
}: {
  title: string;
  icon: string;
  value: string;
  data: { city: string; country: string; code: string }[];
  onSelect: (v: any) => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(value || "");

  // ✅ autofocus + disable scroll
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const filtered = data.filter((item) =>
    item.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* ✅ TOP BAR PIXEL PERFECT */}
      <div className="w-full bg-[#111111] text-white flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="text-[16px]"><IoMdArrowBack />
        </button>
        <h1 className="text-[20px] font-semibold">{title}</h1>
        <button onClick={onClose} className="text-[16px]"><IoClose />
        </button>
      </div>

      {/* ✅ SEARCH INPUT */}
      <div className="px-4 pt-5">
        <div className="border border-[#d9d9d9] rounded-sm p-1 pb-0 flex items-center gap-3">

          <img src={icon} alt="destino" className="w-10 h-10" />

          <div className="flex flex-col w-full">
            <label className="text-xs text-gray-500">{title}</label>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-lg outline-none border-b-2 border-[#28c53a] pb-1"
            />
          </div>
        </div>
      </div>

      {/* ✅ RESULTS LIST */}
      <div className="mt-4 overflow-y-auto px-4 pb-8">

        {filtered.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              onSelect(item); // ✅ SOLO ejecuta selección
              // ❌ NO llama onClose aquí (el padre controla el flujo)
            }}
            className="w-full text-left py-4 text-[16px] text-[#1b1b1bc7] "
          >
            <p className=" ">{item.city}  ({item.country}) &nbsp;{item.code}</p>

            {/* ✅ divider like the screenshot */}
            <div className="w-full h-px bg-gray-200 mt-4" />
          </button>
        ))}

      </div>
    </div>
  );
}