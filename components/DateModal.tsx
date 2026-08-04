"use client";
import { useEffect, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function DateModal({
  type,       // "ida" | "vuelta"
  value,
  minDate,    // only for return flight
  onSelect,
  onClose,
}: {
  type: "ida" | "vuelta";
  value?: string;
  minDate?: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ today formatted as DD/MM/YYYY
  const today = new Date();
  const formattedToday = today.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [selected, setSelected] = useState(value || formattedToday);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // ✅ autofocus + disable scroll
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const label = type === "ida" ? "Ida" : "Vuelta";
  const question =
    type === "ida" ? "¿Cuándo vas a volar?" : "¿Cuándo vuelves?";

  // ✅ month title like "NOV 2025"
  const monthName = new Date(currentYear, currentMonth)
    .toLocaleDateString("es-CO", {
      month: "short",
      year: "numeric",
    })
    .replace(".", "")
    .toUpperCase();

  // ✅ calendar structure
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startIndex = firstDay === 0 ? 6 : firstDay - 1;

  const emptySlots = Array.from({ length: startIndex }, () => "");
  const monthDays = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1)
  );
  const daysArray = [...emptySlots, ...monthDays];

  // ✅ parse minDate for return flight rules
  const minDateObj = minDate
    ? new Date(
      Number(minDate.split("/")[2]),
      Number(minDate.split("/")[1]) - 1,
      Number(minDate.split("/")[0])
    )
    : null;

  const isPast = (day: string) => {
    const date = new Date(currentYear, currentMonth, Number(day));
    const todayMid = new Date();
    todayMid.setHours(0, 0, 0, 0);
    return date < todayMid;
  };

  const isBeforeMin = (day: string) => {
    if (!minDateObj || type !== "vuelta") return false;
    const date = new Date(currentYear, currentMonth, Number(day));
    return date < minDateObj;
  };

  // ✅ CORRECTED: NO onClose() here
  const selectDate = (day: string) => {
    if (isPast(day)) return;
    if (isBeforeMin(day)) return;

    const formatted = `${day.padStart(2, "0")}/${String(
      currentMonth + 1
    ).padStart(2, "0")}/${currentYear}`;

    setSelected(formatted);
    const iso = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;

    onSelect(iso);   // ✅ parent decides what happens next
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">

      {/* ✅ TOP BAR PIXEL PERFECT */}
      <div className="bg-[#111111] text-white flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="text-[16px]"><IoMdArrowBack /></button>
        <h1 className="text-[22px] font-semibold">Fechas</h1>
        <button onClick={onClose} className="text-[16px]"><IoClose /></button>
      </div>

      {/* ✅ INPUT */}
      <div className="px-4 pt-5">
        <div className="border border-[#d9d9d9] rounded-sm p-1 pb-0 flex items-center gap-3">
          <span className="text-[16px]"><FaRegCalendarAlt />
          </span>

          <div className="flex flex-col w-full">
            <label className="text-xs text-[#969696]">{label}</label>

            <input
              ref={inputRef}
              type="text"
              value={selected}
              readOnly
              className="text-lg outline-none border-b-2 border-[#28c53a] pb-1"
            />
          </div>
        </div>
      </div>

      {/* ✅ QUESTION */}
      <p className="px-4 mt-6 text-[18px] font-semibold">{question}</p>

      {/* ✅ LEGEND */}
      <div className="flex items-center gap-6 px-4 mt-4 text-[15px]">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#cde6db]" /> $
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#fde9a7]" /> $$
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#f6c1b9]" /> $$$
        </div>
      </div>

      {/* ✅ MONTH HEADER */}
      <div className="flex items-center justify-between px-4 mt-6">
        <button onClick={prevMonth} className="text-[16px] text-[#969696]">‹</button>
        <p className="text-[16px] font-bold">{monthName}</p>
        <button onClick={nextMonth} className="text-[16px] text-[#969696]">›</button>
      </div>

      {/* ✅ WEEK DAYS */}
      <div className="grid grid-cols-7 text-center mt-4 text-[14px] text-black  border-b border-b-[#969696] p-2 ml-5 mr-5">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d, i) => (
          <p key={i}>{d}</p>
        ))}
      </div>

      {/* ✅ REAL CALENDAR */}
      <div className="grid grid-cols-7 text-center text-[16px] text-[#1b1b1b] pb-10 font-normal">
        {daysArray.map((day, i) => {
          if (!day) return <div key={i} className="py-2" />;

          const disabled = isPast(day) || isBeforeMin(day);
          const isSelected = selected.startsWith(day.padStart(2, "0"));

          return (
            <div key={i} className="py-2">
              <button
                disabled={disabled}
                onClick={() => selectDate(day)}
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center
                  ${disabled ? "opacity-30" : ""}
                  ${isSelected ? "border-2 border-black" : ""}
                `}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}