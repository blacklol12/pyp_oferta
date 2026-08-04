"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RCongrats() {
  const router = useRouter();

  useEffect(() => {
    window.location.href = "/promo/congrats"
  }, [router]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-lg">cargando...</p>
    </div>
  );
}