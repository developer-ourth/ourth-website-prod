"use client";

import React from "react";

export default function ProductComparisonMatrix() {
  const criteria = [
    {
      name: "100% Leak & Grease Proof",
      subtitle: "Even for boiling hot Indian curries, gravies, and dals",
      ourth: { status: true, text: "Superior (No sogginess)" },
      plastic: { status: true, text: "Yes (Toxic chemical leach)" },
      paper: { status: false, text: "Soggy within 10 minutes" },
      bagasse: { status: false, text: "Absorbs oil & weakens" },
    },
    {
      name: "Microwave & Freezer Safe",
      subtitle: "Up to 100°C thermal resistance without warping",
      ourth: { status: true, text: "100% Safe (2 min+ high)" },
      plastic: { status: false, text: "Melts & leaches carcinogens" },
      paper: { status: false, text: "Burns or loses shape" },
      bagasse: { status: true, text: "Safe up to warm temp" },
    },
    {
      name: "Zero Chemical Coatings or Waxes",
      subtitle: "No plastic PLA film, bleach, or synthetic binders",
      ourth: { status: true, text: "Pure natural leaf + water wash" },
      plastic: { status: false, text: "100% petroleum polymers" },
      paper: { status: false, text: "Coated with PE/wax film" },
      bagasse: { status: false, text: "Often bleached / PFAS treated" },
    },
    {
      name: "45-Day Natural Biodegradation",
      subtitle: "Composts cleanly in backyard soil into nutrient fertilizer",
      ourth: { status: true, text: "45 Days (Backyard compostable)" },
      plastic: { status: false, text: "500+ Years (Microplastics)" },
      paper: { status: false, text: "Years if plastic coated" },
      bagasse: { status: true, text: "90-180 Days (Industrial facility)" },
    },
    {
      name: "Heavy-Duty Structural Strength",
      subtitle: "Never bends, buckles, or folds under heavy feast meals",
      ourth: { status: true, text: "Rigid & woody like wood plates" },
      plastic: { status: false, text: "Flimsy & bends easily" },
      paper: { status: false, text: "Folds under gravy weight" },
      bagasse: { status: false, text: "Softens when moist" },
    },
    {
      name: "100% Tree-Free Harvest",
      subtitle: "Upcycled naturally fallen leaves without chopping branches",
      ourth: { status: true, text: "Fallen sheath leaves only" },
      plastic: { status: false, text: "Fossil fuel derived" },
      paper: { status: false, text: "Requires timber logging" },
      bagasse: { status: true, text: "Sugarcane pulp residue" },
    },
  ];

  return (
    <section className="py-16 px-6 max-w-[1400px] mx-auto font-['IBM_Plex_Sans']">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E8F0D8] text-[#0D3A27] font-bold text-xs tracking-wider uppercase border border-[#76A52E]/30 mb-4 shadow-2xs">
          <span>⚖️</span>
          <span>Scientific Proof & Material Authority</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
          Why Areca Palm Leaves Outperform Every Alternative
        </h2>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-normal">
          Directly answering your top questions: see how Healing OURTH natural tableware compares against plastic, coated paper, and sugarcane bagasse across performance and safety.
        </p>
      </div>

      {/* Responsive Table Card */}
      <div className="bg-white rounded-[28px] border border-gray-200/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-200 bg-[#FAF8F3]">
                <th className="py-5 px-6 font-bold text-gray-900 text-base sm:text-lg w-[32%]">
                  Performance & Safety Criteria
                </th>

                {/* Ourth Winner Column Header */}
                <th className="py-5 px-6 font-extrabold text-[#0D3A27] text-base sm:text-lg bg-[#E8F0D8]/60 border-l-2 border-r-2 border-[#76A52E] w-[22%] relative">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌿</span>
                    <span>Healing OURTH</span>
                  </div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-white bg-[#25784C] px-2.5 py-0.5 rounded-full mt-1.5 shadow-xs">
                    👑 Clear Winner
                  </span>
                </th>

                <th className="py-5 px-6 font-bold text-gray-700 text-sm sm:text-base w-[16%]">
                  Plastic / Styrofoam
                </th>
                <th className="py-5 px-6 font-bold text-gray-700 text-sm sm:text-base w-[15%]">
                  Coated Paper
                </th>
                <th className="py-5 px-6 font-bold text-gray-700 text-sm sm:text-base w-[15%]">
                  Sugarcane Bagasse
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm sm:text-base">
              {criteria.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Criteria Title */}
                  <td className="py-5 px-6 align-top">
                    <span className="font-bold text-gray-900 block text-base">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500 font-normal mt-0.5 block leading-relaxed">
                      {item.subtitle}
                    </span>
                  </td>

                  {/* Ourth Column (Highlighted) */}
                  <td className="py-5 px-6 align-top bg-[#E8F0D8]/30 border-l-2 border-r-2 border-[#76A52E]/40 font-medium text-[#0D3A27]">
                    <div className="flex items-start gap-2.5">
                      <span className="text-green-600 font-bold text-lg leading-none mt-0.5">✔</span>
                      <div>
                        <span className="font-bold block text-sm sm:text-base text-[#0D3A27]">
                          {item.ourth.text}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Plastic Column */}
                  <td className="py-5 px-6 align-top text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className={`font-bold text-base leading-none mt-0.5 ${item.plastic.status ? "text-green-600" : "text-red-500"}`}>
                        {item.plastic.status ? "✔" : "✘"}
                      </span>
                      <span className="text-xs sm:text-sm">{item.plastic.text}</span>
                    </div>
                  </td>

                  {/* Paper Column */}
                  <td className="py-5 px-6 align-top text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className={`font-bold text-base leading-none mt-0.5 ${item.paper.status ? "text-green-600" : "text-red-500"}`}>
                        {item.paper.status ? "✔" : "✘"}
                      </span>
                      <span className="text-xs sm:text-sm">{item.paper.text}</span>
                    </div>
                  </td>

                  {/* Bagasse Column */}
                  <td className="py-5 px-6 align-top text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className={`font-bold text-base leading-none mt-0.5 ${item.bagasse.status ? "text-green-600" : "text-red-500"}`}>
                        {item.bagasse.status ? "✔" : "✘"}
                      </span>
                      <span className="text-xs sm:text-sm">{item.bagasse.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Banner */}
        <div className="p-6 bg-[#FAF8F3] border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#25784C] text-white flex items-center justify-center text-lg font-bold shrink-0">
              ✓
            </span>
            <div>
              <h4 className="font-bold text-black text-sm sm:text-base">
                100% Chemical-Free Assurance
              </h4>
              <p className="text-xs text-gray-600">
                Every plate is sun-dried, UV-sterilized, and pressed with pure water—zero glues, waxes, or plastic lacquers.
              </p>
            </div>
          </div>
          <a
            href="#all-products"
            className="px-6 py-2.5 rounded-full bg-[#0D3A27] text-white font-bold text-sm hover:bg-[#155338] transition shrink-0 shadow-sm"
          >
            Order Areca Tableware ↓
          </a>
        </div>
      </div>
    </section>
  );
}
