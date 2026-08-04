// app/api/bancos/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Datos fijos de bancos
const BANCOS_FIJOS = [
  { codigo: '1815', nombre: 'ALIANZA FIDUCIARIA' },
  { codigo: '1558', nombre: 'BAN100' },
  { codigo: '1059', nombre: 'BANCAMIA S.A.' },
  { codigo: '1040', nombre: 'BANCO AGRARIO' },
  { codigo: '1052', nombre: 'BANCO AV VILLAS' },
  { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA S.A.' },
  { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
  { codigo: '1066', nombre: 'BANCO COOPERATIVO COOPCENTRAL' },
  { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
  { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
  { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
  { codigo: '1062', nombre: 'BANCO FALABELLA' },
  { codigo: '1063', nombre: 'BANCO FINANDINA S.A. BIC' },
  { codigo: '1012', nombre: 'BANCO GNB SUDAMERIS' },
  { codigo: '1006', nombre: 'BANCO ITAU' },
  { codigo: '1071', nombre: 'BANCO J.P. MORGAN COLOMBIA S.A.' },
  { codigo: '1047', nombre: 'BANCO MUNDO MUJER S.A.' },
  { codigo: '1060', nombre: 'BANCO PICHINCHA S.A.' },
  { codigo: '1002', nombre: 'BANCO POPULAR' },
  { codigo: '1065', nombre: 'BANCO SANTANDER COLOMBIA' },
  { codigo: '1069', nombre: 'BANCO SERFINANZA' },
  { codigo: '1303', nombre: 'BANCO UNION antes GIROS' },
  { codigo: '1007', nombre: 'BANCOLOMBIA' },
  { codigo: '1061', nombre: 'BANCOOMEVA S.A.' },
  { codigo: '1808', nombre: 'BOLD CF' },
  { codigo: '1283', nombre: 'CFA COOPERATIVA FINANCIERA' },
  { codigo: '1009', nombre: 'CITIBANK' },
  { codigo: '1370', nombre: 'COLTEFINANCIERA' },
  { codigo: '1292', nombre: 'CONFIAR COOPERATIVA FINANCIERA' },
  { codigo: '1289', nombre: 'COTRAFA' },
  { codigo: '1816', nombre: 'CREZCAMOS' },
  { codigo: '1097', nombre: 'DALE' },
  { codigo: '1551', nombre: 'DAVIPLATA' },
  { codigo: '1637', nombre: 'IRIS' },
  { codigo: '1286', nombre: 'JFK COOPERATIVA FINANCIERA' },
  { codigo: '1070', nombre: 'LULO BANK' },
  { codigo: '1801', nombre: 'MOVII S.A.' },
  { codigo: '1507', nombre: 'NEQUI' },
  { codigo: '1809', nombre: 'NU' },
  { codigo: '1811', nombre: 'RAPPIPAY' },
  { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
  { codigo: '1804', nombre: 'UALÁ' },
];

export async function GET(request: NextRequest) {
  try {
    console.log('🏦 Usando lista de bancos fijos...');

    // Ordenar alfabéticamente
    const sortedBancos = BANCOS_FIJOS.sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );

    return NextResponse.json({
      success: true,
      data: sortedBancos,
      total: sortedBancos.length,
    });

  } catch (error) {
    console.error('❌ Error al obtener bancos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener la lista de bancos',
      data: [],
      total: 0,
    });
  }
}