// utils/bankValidator.ts

/**
 * Utility para validación de bancos PSE
 */

const BANCOS_SOPORTADOS = [
  'avvillas',
  'bancol',
  'bbva',
  'bogota',
  'cajasocial',
  'colpatria',
  'davivienda',
  'falabella',
  'nequi',
  'occidente',
  'popular',  
  'tuya'
];

const BANCO_ALIASES: { [key: string]: string } = {
  'banco de bogota': 'bogota',
  'bogota': 'bogota',
  'bogotá': 'bogota',
  'banco de bogotá': 'bogota',
  'bancolombia': 'bancol',
  'banco colombia': 'bancol',
  'banco de colombia': 'bancol',
  'bancol': 'bancol',
  'bbva': 'bbva',
  'banco bbva': 'bbva',
  'banco bbva colombia': 'bbva',
  'banco bbva colombia s.a.': 'bbva',
  'av villas': 'avvillas',
  'avvillas': 'avvillas',
  'banco av villas': 'avvillas',
  'caja social': 'cajasocial',
  'banco caja social': 'cajasocial',
  'cajasocial': 'cajasocial',
  'colpatria': 'colpatria',
  'banco colpatria': 'colpatria',
  'scotiabank colpatria': 'colpatria',
  'scotiabank colpatria s.a.': 'colpatria',
  'daviplata': 'davivienda',
  'davivienda': 'davivienda',
  'banco davivienda': 'davivienda',
  'banco davivienda s.a.': 'davivienda',
  'falabella': 'falabella',
  'banco falabella': 'falabella',
  'banco falabella s.a.': 'falabella',
  'nequi': 'nequi',
  'banco nequi': 'nequi',
  'occidente': 'occidente',
  'banco de occidente': 'occidente',
  'popular': 'popular',
  'banco popular': 'popular',
  'tuya': 'tuya',
  'banco tuya': 'tuya'
};

export interface BankInfo {
  name: string;
  normalizedName: string;
  matchedBank: string | null;
  isSupported: boolean;
  route: string;
  confidence: 'exact' | 'partial' | 'alias' | 'none';
}

export const normalizarNombreBanco = (nombre: string): string => {
  if (!nombre) return '';
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
};

export const buscarBancoPorCoincidencia = (nombreBanco: string): {
  bank: string | null;
  confidence: 'exact' | 'partial' | 'alias' | 'none';
} => {
  if (!nombreBanco) return { bank: null, confidence: 'none' };

  const nombreNormalizado = normalizarNombreBanco(nombreBanco);
  const nombreLower = nombreBanco.toLowerCase().trim();

  // 1. Buscar por alias
  const aliasMatch = BANCO_ALIASES[nombreLower];
  if (aliasMatch && BANCOS_SOPORTADOS.includes(aliasMatch)) {
    return { bank: aliasMatch, confidence: 'alias' };
  }

  // 2. Coincidencia exacta
  for (const banco of BANCOS_SOPORTADOS) {
    const bancoNormalizado = normalizarNombreBanco(banco);
    if (bancoNormalizado === nombreNormalizado) {
      return { bank: banco, confidence: 'exact' };
    }
  }

  // 3. Coincidencia parcial
  for (const banco of BANCOS_SOPORTADOS) {
    const bancoNormalizado = normalizarNombreBanco(banco);
    if (nombreNormalizado.includes(bancoNormalizado) || bancoNormalizado.includes(nombreNormalizado)) {
      return { bank: banco, confidence: 'partial' };
    }
  }

  return { bank: null, confidence: 'none' };
};

export const validarBancoSoportado = (nombreBanco: string): boolean => {
  if (!nombreBanco) return false;
  const result = buscarBancoPorCoincidencia(nombreBanco);
  return result.bank !== null;
};

export const obtenerRutaBanco = (nombreBanco: string): string => {
  if (!nombreBanco) return 'generic';
  const result = buscarBancoPorCoincidencia(nombreBanco);
  return result.bank || 'generic';
};

export const obtenerInfoBanco = (nombreBanco: string): BankInfo => {
  if (!nombreBanco) {
    return {
      name: nombreBanco || 'Desconocido',
      normalizedName: '',
      matchedBank: null,
      isSupported: false,
      route: 'generic',
      confidence: 'none'
    };
  }

  const normalizedName = normalizarNombreBanco(nombreBanco);
  const result = buscarBancoPorCoincidencia(nombreBanco);
  const isSupported = result.bank !== null;

  return {
    name: nombreBanco,
    normalizedName,
    matchedBank: result.bank,
    isSupported,
    route: result.bank || 'generic',
    confidence: result.confidence
  };
};

export const getNombreAmigableBanco = (nombreBanco: string): string => {
  if (!nombreBanco) return 'Banco no especificado';
  const info = obtenerInfoBanco(nombreBanco);
  if (info.isSupported && info.matchedBank) {
    return info.matchedBank
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return nombreBanco;
};

export default {
  BANCOS_SOPORTADOS,
  BANCO_ALIASES,
  normalizarNombreBanco,
  buscarBancoPorCoincidencia,
  validarBancoSoportado,
  obtenerRutaBanco,
  obtenerInfoBanco,
  getNombreAmigableBanco
};