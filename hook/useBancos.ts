// hook/useBancos.ts
import { useState } from 'react';

export interface Banco {
  codigo: string;
  nombre: string;
}

// Caché global
let bancosCache: any;

export function useBancos() {
  const [bancos, setBancos] = useState<Banco[]>(bancosCache || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(!!bancosCache);

  const fetchBancos = async (forceRefresh: boolean = false) => {
    // Si ya hay caché y no es forceRefresh
    if (bancosCache && !forceRefresh) {
      console.log('📦 Usando caché de bancos:', bancosCache.length);
      setBancos(bancosCache);
      setLoaded(true);
      return bancosCache;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🏦 Obteniendo lista de bancos...');

      const response = await fetch('/api/bancos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📦 Respuesta de bancos:', result);

      if (result.success && result.data && result.data.length > 0) {
        bancosCache = result.data;
        setBancos(bancosCache);
        setLoaded(true);
        console.log('✅ Bancos cargados:', bancosCache.length);
        return bancosCache;
      } else {
        throw new Error(result.error || 'No se encontraron bancos');
      }
    } catch (err) {
      let errorMessage = 'Error al cargar bancos';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Error en useBancos:', err);
      
      // Fallback con lista de respaldo
      const fallbackBancos = getFallbackBancos();
      bancosCache = fallbackBancos;
      setBancos(fallbackBancos);
      setLoaded(true);
      return fallbackBancos;
    } finally {
      setLoading(false);
    }
  };

  const getFallbackBancos = (): Banco[] => {
    return [
      { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
      { codigo: '1007', nombre: 'BANCOLOMBIA' },
      { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
      { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA S.A.' },
      { codigo: '1002', nombre: 'BANCO POPULAR' },
      { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
      { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
      { codigo: '1052', nombre: 'BANCO AV VILLAS' },
      { codigo: '1006', nombre: 'BANCO ITAU' },
      { codigo: '1012', nombre: 'BANCO GNB SUDAMERIS' },
      { codigo: '1062', nombre: 'BANCO FALABELLA' },
      { codigo: '1060', nombre: 'BANCO PICHINCHA S.A.' },
      { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
    ];
  };

  const reset = () => {
    setBancos([]);
    setLoading(false);
    setError(null);
    setLoaded(false);
  };

  return {
    bancos,
    loading,
    error,
    loaded,
    fetchBancos,
    reset,
  };
}