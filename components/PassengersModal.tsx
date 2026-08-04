/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function PassengersModal({
  value,
  onSelect,
  onClose,
}: {
  value: any;
  onSelect: (v: number) => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [adults, setAdults] = useState(1);
  const [teens, setTeens] = useState(0);
  const [kids, setKids] = useState(0);
  const [babies, setBabies] = useState(0);

  const total = adults + teens + kids + babies;

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const decrease = (setter: any, value: number, min: number) => {
    if (value > min) setter(value - 1);
  };

  const increase = (setter: any, value: number) => {
    setter(value + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* ✅ HEADER PIXEL PERFECT */}
      <div className="bg-[#111111] text-white flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="text-[16px]"><IoMdArrowBack /></button>
        <h1 className="text-[22px] font-semibold">Pasajeros</h1>
        <button onClick={onClose} className="text-[16px]"><IoClose /></button>
      </div>

      {/* ✅ TOP INPUT */}
      <div className="px-4 pt-5">
        <div className="border border-[#d9d9d9] rounded-sm p-1 pb-0 flex items-center gap-3">
          <span className="text-[16px]"><FaUserPlus />
          </span>

          <input
            ref={inputRef}
            readOnly
            value={total}
            className="text-lg outline-none border-b-2 border-[#28c53a] pb-1 w-full"
          />
        </div>
      </div>

      {/* ✅ LIST */}
      <div className="mt-6 px-6 space-y-8 text-[20px]">

        {/* ✅ ADULTOS */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Adultos</p>
            <p className="text-[15px] text-gray-500">Desde 15 años</p>
          </div>

          <div className="flex items-center gap-4 text-[22px]">
            <button
              onClick={() => decrease(setAdults, adults, 1)}
              className="text-gray-400"
            >
              <CiCircleMinus />

            </button>
            <span>{adults}</span>
            <button
              onClick={() => increase(setAdults, adults)}
            >
              <CiCirclePlus />

            </button>
          </div>
        </div>

        {/* ✅ JÓVENES */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Jóvenes</p>
            <p className="text-[15px] text-gray-500">De 12 a 14 años</p>
          </div>

          <div className="flex items-center gap-4 text-[22px]">
            <button
              onClick={() => decrease(setTeens, teens, 0)}
              className="text-gray-400"
            >
              <CiCircleMinus />
            </button>
            <span>{teens}</span>
            <button onClick={() => increase(setTeens, teens)}>
              <CiCirclePlus />
            </button>
          </div>
        </div>

        {/* ✅ NIÑOS */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Niños</p>
            <p className="text-[15px] text-gray-500">De 2 a 11 años</p>
          </div>

          <div className="flex items-center gap-4 text-[22px]">
            <button
              onClick={() => decrease(setKids, kids, 0)}
              className="text-gray-400"
            >
              <CiCircleMinus />
            </button>
            <span>{kids}</span>
            <button onClick={() => increase(setKids, kids)}>
              <CiCirclePlus />
            </button>
          </div>
        </div>

        {/* ✅ BEBÉS */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Bebés</p>
            <p className="text-[15px] text-gray-500">Menores de 2 años</p>
          </div>

          <div className="flex items-center gap-4 text-[22px]">
            <button
              onClick={() => decrease(setBabies, babies, 0)}
              className="text-gray-400"
            >
              <CiCircleMinus />
            </button>
            <span>{babies}</span>
            <button onClick={() => increase(setBabies, babies)}>
              <CiCirclePlus />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ CONFIRM BUTTON */}
      <div className="mt-12 flex justify-center px-6">
        <button
          onClick={() => {
            onSelect(total);

          }}
          className="bg-black text-white text-[20px] font-semibold px-12 py-3 rounded-full"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}