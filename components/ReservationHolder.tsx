/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

type Holder = {
  pasajeroIndex: string;
  prefix: string;
  phone: string;
  email: string;
  emailConfirm: string;
  promos: boolean;
};

export default function ReservationHolder({
  options,
  value,
  errors,
  onChange,
}: {
  options: string[];
  value: Holder;
  errors: any;
  onChange: (field: keyof Holder, value: string | boolean) => void;
}) {

  const cls = (field: keyof Holder) =>
    `w-full border h-[64px] rounded-sm px-4 text-[16px] ${errors[field] ? "border-red-500 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="px-4 mt-10">
      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-[16px] font-semibold">Titular de la reserva</h2>
        <p className="text-[16px] mt-2 text-gray-700 leading-snug">
          Será la persona que recibirá la confirmación de la reserva y la única autorizada para
          cambios o reembolsos.
        </p>

        {/* Pasajero */}
        <select
          className={`${cls("pasajeroIndex")} mt-4`}
          value={value.pasajeroIndex}
          onChange={(e) => onChange("pasajeroIndex", e.target.value)}
        >
          <option value="">Pasajero*</option>
          {options.map((opt, i) => (
            <option key={i} value={i}>
              {opt}
            </option>
          ))}
        </select>

        {/* Prefijo + Tel */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <select
            className={cls("prefix")}
            value={value.prefix}
            onChange={(e) => onChange("prefix", e.target.value)}
          >
            <option value="">Prefijo*</option>
            <option value="+57">+57</option>
          </select>

          <input
            className={`${cls("phone")} col-span-2`}
            placeholder="Teléfono*"
            value={value.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        {/* Email */}
        <input
          className={`${cls("email")} mt-4`}
          placeholder="Correo electrónico*"
          value={value.email}
          onChange={(e) => onChange("email", e.target.value)}
        />

        <input
          className={`${cls("emailConfirm")} mt-4`}
          placeholder="Confirmar correo electrónico*"
          value={value.emailConfirm}
          onChange={(e) => onChange("emailConfirm", e.target.value)}
        />
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-3 mt-4 text-[16px] text-gray-800">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5"
          checked={value.promos}
          onChange={(e) => onChange("promos", e.target.checked)}
        />
        <span>
          Acepto el uso de mis datos personales para recibir promociones y novedades.
        </span>
      </label>

      {errors.promos && (
        <p className="text-red-500 text-sm mt-1 ml-8">
          Debes aceptar para continuar
        </p>
      )}
    </div>
  );
}