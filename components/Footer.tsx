/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { FaFacebookF, FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { TfiYoutube } from "react-icons/tfi";

export default function Footer() {
  const [open, setOpen] = useState<null | string>(null);

  const toggle = (section: string) =>
    setOpen(open === section ? null : section);

  return (
    <footer className="bg-[#111111] text-white px-6 pt-10 pb-20 mt-10 relative">

      {/* ✅ BRAND CENTER */}
      <div className="text-center justify-center flex mb-8">
        <img src="/logo-footer.svg" alt="" className="w-[170px] h-[40px]" />

      </div>

      {/* ✅ SOCIAL TITLE */}
      <p className="text-[20px] font-semibold mb-6">¡Síguenos!</p>

      {/* ✅ SOCIAL ICONS */}
      <div className="flex items-center gap-5 mb-10">
        {[<FaTwitter />, <FaFacebookF />
          , <TfiYoutube />
          , <FaInstagramSquare />
        ].map((icon, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black text-[20px]"
          >
            {icon}
          </div>
        ))}
      </div>

      {/* ✅ SECTIONS */}
      <div className="space-y-6">

        {/* DESCUBRE Y COMPRA */}
        <div>
          <button
            onClick={() => toggle("compra")}
            className="w-full flex justify-between text-left text-[16px] font-semibold"
          >
            Descubre y compra
            <span className="text-[20px]">{open === "compra" ? <IoIosArrowUp />
              : <IoIosArrowDown />}</span>
          </button>

          {open === "compra" && (
            <ul className="mt-4 space-y-2 text-[15px] text-gray-300">
              <li>
                <span className="flex items-center gap-1">
                  Vuelos baratos
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Reservas de hoteles
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Alquiler de autos
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Tours y excursiones
                  <HiOutlineExternalLink />
                </span>
              </li>

              {/* Este elemento se mantiene simple */}
              <li>Asistencia en viaje</li>

              <li>
                <span className="flex items-center gap-1">
                  Aviones Connect
                  <HiOutlineExternalLink />
                </span>
              </li>
            </ul>
          )}
        </div>

        {/* SOBRE NOSOTROS */}
        <div>
          <button
            onClick={() => toggle("nosotros")}
            className="w-full flex justify-between text-left text-[16px] font-semibold"
          >
            Sobre nosotros
            <span className="text-[20px]">{open === "nosotros" ? <IoIosArrowUp />
              : <IoIosArrowDown />}</span>
          </button>

          {open === "nosotros" && (
            <ul className="mt-4 space-y-2 text-[15px] text-gray-300">
              <li>
                <span className="flex items-center gap-1">
                  Quiénes somos
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Trabaja con nosotros
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Sostenibilidad
                  <HiOutlineExternalLink />
                </span>
              </li>
            </ul>
          )}
        </div>

        {/* PORTALES */}
        <div>
          <button
            onClick={() => toggle("portales")}
            className="w-full flex justify-between text-left text-[16px] font-semibold"
          >
            Nuestros portales
            <span className="text-[20px]">{open === "portales" ? <IoIosArrowUp />
              : <IoIosArrowDown />}</span>
          </button>

          {open === "portales" && (
            <ul className="mt-4 space-y-2 text-[15px] text-gray-300">
              <li>
                <span className="flex items-center gap-1">
                  Agencias
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Corporativo
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Carga
                  <HiOutlineExternalLink />
                </span>
              </li>
            </ul>
          )}
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <button
            onClick={() => toggle("links")}
            className="w-full flex justify-between text-left text-[16px] font-semibold"
          >
            Enlaces rápidos
            <span className="text-[20px]">{open === "links" ? <IoIosArrowUp />
              : <IoIosArrowDown />
            }</span>
          </button>

          {open === "links" && (
            <ul className="mt-4 space-y-2 text-[15px] text-gray-300">
              <li>
                <span className="flex items-center gap-1">
                  Política de privacidad
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Términos y condiciones
                  <HiOutlineExternalLink />
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  Atención al cliente
                  <HiOutlineExternalLink />
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* ✅ COPYRIGHT & POWERED */}
      <div className="w-full mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[13px] text-gray-400">
        <p>Copyright © Avianca 2025</p>

        <p className="mt-2 md:mt-0">
          Powered by <span className="font-semibold">NewShore</span>
        </p>
      </div>

      {/* ✅ FLOATING BUTTON (SCROLL UP) */}
      <button className="fixed bottom-24 right-5 bg-[#e12424] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-[22px]">
        ↑
      </button>
    </footer>
  );
}