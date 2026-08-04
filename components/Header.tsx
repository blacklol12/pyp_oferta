/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Versión Desktop */}
        <div className="hidden md:flex h-20 items-center justify-between">
          <div className="flex items-center">
            {/* Logo Movistar */}
            <img
              src="https://pago-factura.movistar.co/static/media/logo-movistar.9e4369e4.svg"
              alt="Movistar"
              className="h-10 w-auto"
            />
          </div>

          {/* Badge de Seguridad ePayco */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[11px] text-[#50535A] font-medium uppercase tracking-tighter">
              <span className="mr-1 text-[#019DF4]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              Pagos procesados por
              <img
                src="https://multimedia.epayco.co/epayco-landing/btns/epayco-logo-fondo-claro.png"
                alt="ePayco"
                className="h-4 ml-2 opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Versión Mobile */}
        <div className="flex md:hidden flex-col items-center py-4 gap-2">
          <img
            src="https://pago-factura.movistar.co/static/media/logo-movistar.9e4369e4.svg"
            alt="Movistar"
            className="h-8 w-auto"
          />
          <div className="flex items-center text-[10px] text-gray-400">
            Pagos procesados por
            <img
              src="https://multimedia.epayco.co/epayco-landing/btns/epayco-logo-fondo-claro.png"
              alt="ePayco"
              className="h-3 ml-1 grayscale opacity-50"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;