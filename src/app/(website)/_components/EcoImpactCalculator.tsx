"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function EcoImpactCalculator() {
  const [platesPerMonth, setPlatesPerMonth] = useState<number>(500);

  // Formulas
  // Average plastic/styrofoam plate is ~28.4g of non-biodegradable waste
  const plasticSavedKg = (platesPerMonth * 0.0284).toFixed(1);
  // Washing plates or paper pulp processing consumes ~1.04 Liters per plate equivalent
  const waterSavedLiters = Math.round(platesPerMonth * 1.04);
  // Carbon offset vs virgin polystyrene / heavy paper production
  const carbonOffsetKg = (platesPerMonth * 0.085).toFixed(1);

  const presets = [
    { label: "🏠 Home / Family", value: 100 },
    { label: "🎉 Party / Event", value: 500 },
    { label: "🍽️ Cafe / Caterer", value: 2500 },
    { label: "🏨 Eco-Resort / Banquet", value: 5000 },
  ];

  return (
    <section className="py-16 px-6 max-w-[1400px] mx-auto font-['IBM_Plex_Sans'] relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0D8] text-[#0D3A27] font-bold text-xs tracking-wider uppercase border border-[#76A52E]/30 mb-4 shadow-xs">
            <span>🌱</span>
            <span>Interactive Eco-Impact Calculator</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-[#0D3A27]">
            See Your Real-World Impact
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-normal">
            Drag the slider to calculate the exact plastic waste and water footprint you eliminate when switching your events or kitchen to Healing OURTH Areca leaves.
          </p>
        </div>

        {/* Slider Controls (Glassmorphic Card) */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-white/80 shadow-[0_12px_40px_rgba(13,58,39,0.06)] mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <label className="text-base sm:text-lg font-bold text-[#0D3A27]">
              Monthly Tableware Usage:
            </label>
            <div className="flex items-center gap-2 bg-white text-[#0D3A27] px-5 py-2 rounded-xl font-extrabold text-2xl shadow-sm border-2 border-[#76A52E]">
              <span>{platesPerMonth.toLocaleString()}</span>
              <span className="text-sm font-semibold text-gray-600">plates / month</span>
            </div>
          </div>

          {/* Range Input */}
          <div className="relative mb-6">
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={platesPerMonth}
              onChange={(e) => setPlatesPerMonth(Number(e.target.value))}
              className="w-full h-3 bg-gray-200/80 rounded-lg appearance-none cursor-pointer accent-[#76A52E] focus:outline-none focus:ring-2 focus:ring-[#76A52E]"
            />
            <div className="flex justify-between text-xs text-gray-600 font-semibold mt-2">
              <span>50 plates</span>
              <span>1,000</span>
              <span>2,500</span>
              <span>5,000+ plates</span>
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="text-xs text-gray-600 font-semibold mr-1">Quick Presets:</span>
            {presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setPlatesPerMonth(preset.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  platesPerMonth === preset.value
                    ? "bg-[#25784C] text-white shadow-md scale-105 border border-white"
                    : "bg-white/70 text-gray-800 hover:bg-white border border-gray-200/80 shadow-2xs"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Computed Metrics Grid (Glassmorphic Podiums) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Plastic Eliminated */}
          <motion.div
            key={`plastic-${platesPerMonth}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-white/90 rounded-[28px] p-7 text-center text-gray-900 shadow-[0_12px_40px_rgba(13,58,39,0.06)] hover:shadow-[0_16px_50px_rgba(13,58,39,0.12)] transition-all border-t-4 border-t-[#76A52E] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-[#E8F0D8] text-[#0D3A27] flex items-center justify-center text-2xl mx-auto mb-3 shadow-2xs">
                🗑️
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Plastic Eliminated
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0D3A27]">
                {plasticSavedKg} <span className="text-xl font-bold">kg</span>
              </h3>
            </div>
            <p className="text-xs text-gray-600 mt-3 border-t border-gray-100/80 pt-2.5 font-medium">
              Saved from landfills & oceans every month
            </p>
          </motion.div>

          {/* Card 2: Water Saved */}
          <motion.div
            key={`water-${platesPerMonth}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-white/90 rounded-[28px] p-7 text-center text-gray-900 shadow-[0_12px_40px_rgba(16,63,94,0.06)] hover:shadow-[0_16px_50px_rgba(16,63,94,0.12)] transition-all border-t-4 border-t-[#103F5E] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-blue-100/80 text-[#103F5E] flex items-center justify-center text-2xl mx-auto mb-3 shadow-2xs">
                💧
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Water Preserved
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#103F5E]">
                {waterSavedLiters.toLocaleString()} <span className="text-xl font-bold">L</span>
              </h3>
            </div>
            <p className="text-xs text-gray-600 mt-3 border-t border-gray-100/80 pt-2.5 font-medium">
              Vs washing reusables or chemical paper pulping
            </p>
          </motion.div>

          {/* Card 3: Trees Preserved */}
          <motion.div
            key={`trees-${platesPerMonth}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-white/90 rounded-[28px] p-7 text-center text-gray-900 shadow-[0_12px_40px_rgba(37,120,76,0.06)] hover:shadow-[0_16px_50px_rgba(37,120,76,0.12)] transition-all border-t-4 border-t-[#25784C] flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-green-100/80 text-[#25784C] flex items-center justify-center text-2xl mx-auto mb-3 shadow-2xs">
                🌳
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Trees Preserved
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#25784C] leading-tight">
                0 Trees Cut
              </h3>
            </div>
            <p className="text-xs text-gray-600 mt-3 border-t border-gray-100/80 pt-2.5 font-medium">
              100% naturally fallen areca leaves harvested ethically
            </p>
          </motion.div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-600 font-medium">
          <span>Estimated Carbon Footprint Reduction: </span>
          <strong className="text-[#0D3A27]">{carbonOffsetKg} kg CO₂e / month</strong>
          <span> • Verified zero-chemical natural pressing process.</span>
        </div>
      </div>
    </section>
  );
}
