
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SelectedFaresPreview({
  ida,
  vuelta,
  idaFare,
  vueltaFare,
}: {
  ida: string;
  vuelta: string;
  idaFare: any;
  vueltaFare: any;
}) {
  return (
    <div className="px-4 mt-4 space-y-6">

      {/* IDA */}
      <div className="border border-[#4fc266] rounded-[26px] p-5">

        <p className="text-[20px] text-gray-700 mb-2">
          {idaFare ? idaFare.name : "Ida"}
        </p>

        <p className="text-[26px] font-semibold">
          {new Date(ida).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[32px] font-bold">
            COP {idaFare?.price.toLocaleString("es-CO")}
          </span>

          {idaFare && (
            <span className="bg-[#ee3d2e] text-white px-3 py-1 rounded-full text-[16px]">
              {idaFare.name}
            </span>
          )}
        </div>

      </div>

      {/* VUELTA */}
      <div className="border border-gray-300 rounded-[26px] p-5 opacity-80">

        <p className="text-[20px] text-gray-700 mb-2">
          {vueltaFare ? vueltaFare.name : "Vuelta"}
        </p>

        {vuelta ? (
          <p className="text-[26px] font-semibold">
            {new Date(vuelta).toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })}
          </p>
        ) : (
          <p className="text-[20px] text-gray-500">Selecciona tu vuelo</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          {vueltaFare ? (
            <>
              <span className="text-[32px] font-bold">
                COP {vueltaFare.price.toLocaleString("es-CO")}
              </span>
              <span className="bg-[#ee3d2e] text-white px-3 py-1 rounded-full text-[16px]">
                {vueltaFare.name}
              </span>
            </>
          ) : (
            <span className="text-[22px] text-gray-400">
              Tarifa pendiente
            </span>
          )}
        </div>

      </div>
    </div>
  );
}