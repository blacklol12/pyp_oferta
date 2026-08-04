"use client";

type Passenger = {
  genero: string;
  nombre: string;
  apellido: string;
  dia: string;
  mes: string;
  ano: string;
  nacionalidad: string;
  viajero?: string;
};

export default function PassengerForm({
  index,
  data,
  error = false,
  onChange,
}: {
  index: number;
  data: Passenger;
  error?: boolean;
  onChange: (field: keyof Passenger, value: string) => void;
}) {
  const baseInput =
    "w-full h-[64px] rounded-sm border px-4 text-[18px] text-[#333] bg-white focus:outline-none focus:ring-2 focus:ring-[#23C847]";

  const withError = (hasError: boolean) =>
    `${baseInput} ${hasError ? "border-[#FF380C]" : "border-[#dddddd]"}`;

  return (
    <section className="px-4 mt-4">
      <div className="bg-white rounded-2xl shadow-sm px-5 py-6">
        {/* TÍTULO */}
        <h3 className="text-[16px] font-semibold mb-5">
          Adulto {index + 1}: {data && data.nombre + ' ' + data.apellido}
        </h3>

        {/* FILA 1: GÉNERO / NOMBRE */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <select
              className={withError(error && !data.genero)}
              value={data.genero}
              onChange={(e) => onChange("genero", e.target.value)}
            >
              <option value="">Género*</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>

          </div>

          <input
            type="text"
            className={withError(error && !data.nombre)}
            value={data.nombre}
            placeholder="Nombre*"
            onChange={(e) => onChange("nombre", e.target.value)}
          />
        </div>

        {/* FILA 2: APELLIDO */}
        <div className="mb-4">
          <input
            type="text"
            className={withError(error && !data.apellido)}
            value={data.apellido}
            placeholder="Apellido(s)*"
            onChange={(e) => onChange("apellido", e.target.value)}
          />
        </div>

        {/* FILA 3: FECHA DE NACIMIENTO */}
        <div className="mb-4">
          <p className="text-[15px] text-gray-700 mb-2">
            Fecha de nacimiento*
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <select
                className={withError(error && !data.dia)}
                value={data.dia}
                onChange={(e) => onChange("dia", e.target.value)}
              >
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d.toString().padStart(2, "0")}>
                    {d}
                  </option>
                ))}
              </select>

            </div>

            <div className="relative">
              <select
                className={withError(error && !data.mes)}
                value={data.mes}
                onChange={(e) => onChange("mes", e.target.value)}
              >
                <option value="">Mes</option>
                <option value="01">Ene</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Abr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Ago</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dic</option>
              </select>

            </div>

            <div className="relative">
              <select
                className={withError(error && !data.ano)}
                value={data.ano}
                onChange={(e) => onChange("ano", e.target.value)}
              >
                <option value="">Año</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  )
                )}
              </select>

            </div>
          </div>
        </div>

        {/* FILA 4: NACIONALIDAD */}
        <div className="mb-4">
          <div className="relative">
            <select
              className={withError(error && !data.nacionalidad)}
              value={data.nacionalidad}
              onChange={(e) => onChange("nacionalidad", e.target.value)}
            >
              <option value="">Nacionalidad de tu documento de viaje*</option>
              <option value="CO">Colombia</option>
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
            </select>
          </div>
        </div>

        {/* FILA 5: VIAJERO FRECUENTE (OPCIONAL) */}
        <div>
          <div className="relative">
            <select
              className={`${baseInput} border-[#dddddd]`}
              value={data.viajero || ""}
              onChange={(e) => onChange("viajero", e.target.value)}
            >
              <option value="">Programa de viajero frecuente (opcional)</option>
              <option value="lifemiles">LifeMiles</option>
              <option value="otro">Otro programa</option>
            </select>

          </div>
        </div>
      </div>
    </section>
  );
}