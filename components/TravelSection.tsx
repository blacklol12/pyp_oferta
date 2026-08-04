
/* eslint-disable @next/next/no-img-element */
export default function TravelSection() {
  return (
    <div className="px-4 pt-4 pb-14 ">

      {/* ✅ TITLE 1 */}
      <h2 className="text-center text-[22px] font-semibold mb-6">
        Prepárate para viajar
      </h2>

      {/* ✅ CHECK-IN CARD */}
      <div className="bg-white rounded-[22px] shadow-md p-4 flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          {/* ICON */}
          <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
            📄
          </div>

          <div>
            <p className="text-[18px] font-semibold">Check-in online</p>
            <p className="text-[13px] text-gray-600 leading-snug max-w-[190px]">
              Obtén tu pase de abordar y ahorra tiempo en el aeropuerto.
            </p>
          </div>
        </div>

        {/* ARROW */}
        <span className="text-[20px] text-gray-500">›</span>
      </div>

      {/* ✅ DIVIDER LINE */}
      <div className="w-full h-1 rounded-full bg-[#e5e5e5] mb-10" />

      {/* ✅ TITLE 2 */}
      <h2 className="text-center text-[22px] font-semibold mb-6">
        Conoce las novedades de Lifemiles
      </h2>

      {/* ✅ DARK PROMO CARD */}
      <div className=" overflow-hidden relative mb-9">
        {/* IMAGE */}
        <img
          src="/one.png"
          className="w-full h-[190px] object-cover "
          alt="promo"
        />

      </div>
      <div className=" overflow-hidden relative mb-9">
        {/* IMAGE */}
        <img
          src="/thow.png"
          className="w-full h-[190px] object-cover "
          alt="promo"
        />

      </div>
      <div className=" overflow-hidden relative mb-9">
        {/* IMAGE */}
        <img
          src="/three.png"
          className="w-full h-[190px] object-cover "
          alt="promo"
        />

      </div>
    </div>
  );
}