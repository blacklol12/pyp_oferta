
/* eslint-disable @next/next/no-img-element */
export default function OffersList({
  origin,
  offers,
}: {
  origin: string;
  offers: {
    city: string;
    discount: string;
    price: string;
    image: string;
  }[];
}) {
  return (
    <div className="px-4 pb-10 pt-6 ">

      {/* ✅ TITLE */}
      <h2 className="text-center text-[26px] font-semibold mb-6">
        Ofertas desde{" "}
        <span className="text-[#0b8693] underline font-semibold">
          {origin}
        </span>{" "}
        <span className="inline-block align-middle text-[18px]">
          ▼
        </span>
      </h2>

      {/* ✅ LIST */}
      <div className="space-y-6">
        {offers.map((item, i) => (
          <div key={i} className="rounded-[22px] overflow-hidden shadow-md" style={{ background: `url(${item.image})` }}

          >
            {/* IMAGE */}
            <img
              src={item.image}
              className="w-full h-[180px] object-cover"
              alt={item.city}
            />

            {/* WHITE CARD OVERLAY */}
            <div className="boxfo -mt-10 rounded-[18px] shadow-md p-4 flex items-center justify-between" >
              <div className="w-full flex bg-white p-4 rounded-2xl justify-between">
                <div>
                  <p className="text-[20px] font-semibold">{item.city}</p>
                  <p className="text-[12px] text-gray-500">
                    Por trayecto desde
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[12px] font-semibold opacity-70">
                    {item.discount} OFF
                  </p>
                  <p className="text-[18px] font-bold">
                    COP {item.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ LINK BOTTOM */}
      <div className="text-right mt-6 pr-2">
        <a className="text-[#0b8693] font-medium text-[16px] flex items-center justify-end gap-1 underline">
          Descubrir más ofertas →
        </a>
      </div>
    </div>
  );
}