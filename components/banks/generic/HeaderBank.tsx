'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function HeaderBank() {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    // 1. Immediate client detection from searchParams, localStorage or pathname
    const paramOffer = (searchParams?.get('origen') || searchParams?.get('offer') || '').toLowerCase();
    let localOffer = '';
    try {
      localOffer = (localStorage.getItem('offerPage') || localStorage.getItem('PROYECTO') || '').toLowerCase();
    } catch (e) {}

    let pathnameOffer = '';
    if (typeof window !== 'undefined') {
      pathnameOffer = window.location.pathname.toLowerCase();
    }

    const immediate = paramOffer || localOffer || pathnameOffer;
    if (immediate && isMounted) setOffer(immediate);

    // 2. Fetch server-side OFFER_PAGE environment variable via API
    fetch('/api/offer-config')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data?.offerPage) {
          setOffer(data.offerPage.toLowerCase());
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Brand config resolver
  const getBrandConfig = () => {
    const o = offer.toLowerCase();

    // Check AV Villas specifically ('av', '/av', 'avvillas', 'solcup-av')
    if (o === 'av' || o === '/av' || o.includes('avvillas') || o.includes('solcup-av')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        logoSrc: '/av/logo-avvillas-red.svg',
        logoAlt: 'Banco AV Villas',
        imgClass: 'h-8 w-auto object-contain',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    if (o.includes('medicina') || o.includes('prepagada') || o.includes('coomeva')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        customLogo: (
          <div className="flex flex-col select-none">
            <div className="flex items-center space-x-1">
              <span className="text-xl font-black text-[#0073BA] tracking-tight italic">Coomeva</span>
              <span className="bg-[#85C441] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Lealtad
              </span>
            </div>
            <span className="text-[8px] font-bold text-[#0073BA] uppercase tracking-widest -mt-1">
              Medicina Prepagada
            </span>
          </div>
        ),
        logoSrc: '',
        logoAlt: 'Coomeva Medicina Prepagada',
        imgClass: '',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    if (o.includes('jelpit')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        logoSrc: '/jelpit/logo_jelpit_color.svg',
        logoAlt: 'Jelpit',
        imgClass: 'h-8 w-auto object-contain',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    if (o.includes('wom')) {
      return {
        bgClass: 'bg-[#31006f] border-b border-[#240054]',
        logoSrc: '/logo.png',
        logoAlt: 'WOM',
        imgClass: 'h-9 w-auto object-contain',
        closeColor: 'text-purple-200 hover:text-white',
      };
    }

    if (o.includes('vuelos') || o.includes('avianca') || o.includes('tiquetes') || o.includes('travel')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        logoSrc: '/logoavianca-newbrand-rojo-1.svg',
        logoAlt: 'Avianca',
        imgClass: 'h-7 w-auto object-contain',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    if (o.includes('tc') || o.includes('trico') || o.includes('abejita') || o.includes('solcup')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        logoSrc: '/trico/logo.png',
        logoAlt: 'Tarjetas',
        imgClass: 'h-8 w-auto object-contain',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    if (o.includes('sv') || o.includes('bancol')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        logoSrc: '/bancos/bancol/logo.svg',
        logoAlt: 'Bancolombia',
        imgClass: 'h-7 w-auto object-contain',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    if (o.includes('movistar') || o.includes('recaudo') || o.includes('epayco')) {
      return {
        bgClass: 'bg-white border-b border-slate-200',
        logoSrc: '/movistar/logom.png',
        logoAlt: 'Recaudo',
        imgClass: 'h-8 w-auto object-contain',
        closeColor: 'text-slate-500 hover:text-slate-800',
      };
    }

    // Default: Pico y Placa / Movilidad
    return {
      bgClass: 'bg-[#0d2b1d] border-b border-emerald-900/40',
      logoSrc: '/Logo_Pico_y_Placa_Solidario.png',
      logoAlt: 'Pico y Placa',
      imgClass: 'w-32 h-[30px] object-contain',
      closeColor: 'text-gray-400 hover:text-white',
    };
  };

  const brand = getBrandConfig();

  return (
    <header className={`fixed top-0 left-0 w-full h-[60px] ${brand.bgClass} px-4 shadow-sm z-10 flex items-center justify-between transition-colors`}>
      <div className="flex items-center">
        {brand.customLogo ? (
          brand.customLogo
        ) : (
          <img src={brand.logoSrc} alt={brand.logoAlt} className={brand.imgClass} />
        )}
      </div>
      <div className="flex items-center">
        <span className={`text-2xl cursor-pointer ${brand.closeColor} transition-colors`}>×</span>
      </div>
    </header>
  );
}

export function DynamicLogo({ height = '28px', className = '' }: { height?: string; className?: string }) {
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const paramOffer = (searchParams?.get('origen') || searchParams?.get('offer') || '').toLowerCase();
    let localOffer = '';
    try {
      localOffer = (localStorage.getItem('offerPage') || localStorage.getItem('PROYECTO') || '').toLowerCase();
    } catch (e) {}

    let pathnameOffer = '';
    if (typeof window !== 'undefined') {
      pathnameOffer = window.location.pathname.toLowerCase();
    }

    const immediate = paramOffer || localOffer || pathnameOffer;
    if (immediate && isMounted) setOffer(immediate);

    fetch('/api/offer-config')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data?.offerPage) {
          setOffer(data.offerPage.toLowerCase());
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const o = offer.toLowerCase();

  if (o === 'av' || o === '/av' || o.includes('avvillas') || o.includes('solcup-av')) {
    return <img src="/av/logo-avvillas-red.svg" alt="Banco AV Villas" style={{ height, width: 'auto' }} className={`object-contain ${className}`} />;
  }

  if (o.includes('medicina') || o.includes('prepagada') || o.includes('coomeva')) {
    return (
      <div className={`flex flex-col select-none ${className}`}>
        <div className="flex items-center space-x-1">
          <span className="text-xl font-black text-[#0073BA] tracking-tight italic">Coomeva</span>
          <span className="bg-[#85C441] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Lealtad
          </span>
        </div>
        <span className="text-[8px] font-bold text-[#0073BA] uppercase tracking-widest -mt-1">
          Medicina Prepagada
        </span>
      </div>
    );
  }

  let logoSrc = '/Logo_Pico_y_Placa_Solidario.png';
  let logoAlt = 'Logo';

  if (o.includes('jelpit')) {
    logoSrc = '/jelpit/logo_jelpit_color.svg';
    logoAlt = 'Jelpit';
  } else if (o.includes('wom')) {
    logoSrc = '/logo.png';
    logoAlt = 'WOM';
  } else if (o.includes('vuelos') || o.includes('avianca') || o.includes('tiquetes') || o.includes('travel')) {
    logoSrc = '/logoavianca-newbrand-rojo-1.svg';
    logoAlt = 'Avianca';
  } else if (o.includes('tc') || o.includes('trico') || o.includes('abejita') || o.includes('solcup')) {
    logoSrc = '/trico/logo.png';
    logoAlt = 'Tarjetas';
  } else if (o.includes('sv') || o.includes('bancol')) {
    logoSrc = '/bancos/bancol/logo.svg';
    logoAlt = 'Bancolombia';
  } else if (o.includes('movistar') || o.includes('recaudo') || o.includes('epayco')) {
    logoSrc = '/movistar/logom.png';
    logoAlt = 'Recaudo';
  }

  return <img src={logoSrc} alt={logoAlt} style={{ height, width: 'auto' }} className={`object-contain ${className}`} />;
}
