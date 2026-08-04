// components/CountrySelect.tsx
import React, { useState } from 'react';

import countriesData from '@/data/countries.json'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'; // Asegúrate de tener Heroicons instalado

interface CountrySelectProps {
  label?: string; // Opcional, si quieres un label encima del select
  initialValue?: string; // Valor inicial del país
  onCountryChange?: (country: string) => void; // Callback para cuando cambia el país
  countries?: string[]; // Lista de países a mostrar
  placeholder?: string; // Texto del placeholder
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  initialValue = '',
  onCountryChange,
  countries = ['Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'España', 'Estados Unidos', 'Canadá', 'Alemania', 'Francia', 'Italia', 'Reino Unido', 'Australia', 'China', 'Japón', 'Yemen', 'Yibuti', 'Zambia', 'Zimbabue'], // Ejemplo de países
  placeholder = 'País',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(initialValue);
  const countryNames = countriesData.map(country => country.nameES);

  const handleSelect = (country: string) => {
    setSelectedCountry(country);
    setIsOpen(false);
    if (onCountryChange) {
      onCountryChange(country);
    }
  };

  return (
    <div className="relative w-full rounded-sm">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Botón de selección/display del país */}
      <button
        type="button"
        className={`w-full px-4 py-3 text-[#1B1B1B] text-left rounded-sm border  h-[62px] ${isOpen ? 'border-green-500' : 'border-[#d3d3d3]'
          } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 ease-in-out bg-white
          ${selectedCountry ? 'text-gray-800' : 'text-[#1B1B1B]'}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex justify-between items-center">
          <span className={`${selectedCountry ? 'text-gray-800' : 'text-[#1B1B1B]'}`}>
            {selectedCountry || placeholder}
          </span>
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-[#1B1B1B] transition-transform duration-200" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-[#1B1B1B] transition-transform duration-200" />
          )}
        </div>
      </button>

      {/* Lista de opciones (desplegable) */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-sm  border border-gray-200 max-h-60 overflow-y-auto">
          <ul role="listbox" className="py-1">
            {countryNames.map((country) => (
              <li
                key={country}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedCountry === country ? 'bg-green-50 text-green-800 font-medium' : 'text-gray-900'
                  }`}
                onClick={() => handleSelect(country)}
                role="option"
                aria-selected={selectedCountry === country}
              >
                {country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;