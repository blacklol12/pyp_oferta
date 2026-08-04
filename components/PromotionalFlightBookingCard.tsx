import React from 'react';
import Image from 'next/image';

interface PromotionalFlightBookingCardProps {
  // Las props se pueden usar para hacer el componente reusable
  title?: string;
  subtitle?: string;
  ctaText?: string;
  mileageText?: string;
}

// Nota: Asume que las imágenes están en la carpeta 'public' de Next.js
// y que las rutas son correctas.
const heroImageUrl = '/es-home-s-min.jpg';
const birdIconUrl = '/newlogobox.png';

const PromotionalFlightBookingCard: React.FC<PromotionalFlightBookingCardProps> = ({
  title = '¡Reserva tu vuelo con 0% de interés!',
  subtitle = 'Paga con tarjetas de bancos aliados en 3, 6 o 12 cuotas. Aplican TyC. ¡Hay un lugar que te espera!',
  ctaText = 'Compra ya',
}) => {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg font-sans mx-auto">
      {/* Sección Superior - Visual 
        Se utiliza un div simple y la imagen de fondo se manejará con estilo inline 
        o, mejor, como una capa con Image de Next/Image.
      */}
      <div className="relative h-[300px] bg-gray-200">
        {/* Imagen de Fondo (Usamos Image de Next/Image para optimización) */}
        <Image
          src={heroImageUrl}
          alt="Cena navideña y foto familiar"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />

        {/* Capa de Contenido Superior */}

      </div>

      {/* Sección Inferior - Texto y CTA (Fondo Rojo) 
        Usamos `bg-red-600` para el rojo principal.
      */}
      <div className="relative bg-[#ff0202] text-white p-5">
        <h2 className="text-2xl font-extrabold leading-tight mb-2 pr-12">
          {title}
        </h2>
        <p className="text-sm font-light leading-snug mb-4 pr-12">
          {subtitle}
        </p>

        {/* Ícono Decorativo del Pájaro (Asumiendo que es un SVG blanco) */}
        <div className="absolute top-5 right-5">
          <Image
            src={birdIconUrl}
            alt="Ícono de vuelo"
            width={35}
            height={35}
          />
        </div>

        {/* Botón CTA */}
        <button className="float-right bg-white text-[#ff0202] font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition duration-150 ease-in-out">
          {ctaText}
        </button>

        {/* Clearfix para el float del botón, si es necesario, o usa flexbox */}
        <div className="clear-both"></div>
      </div>
    </div>
  );
};

export default PromotionalFlightBookingCard;