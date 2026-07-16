"use client";

import React from "react";

interface ReviewStarProps {
  filled?: boolean;
  size?: number | string;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ReviewStar({
  filled = true,
  size = 24,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ReviewStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-150 flex-shrink-0 ${
        onClick ? "cursor-pointer hover:scale-110 active:scale-95" : ""
      } ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 3D Offset Shadow / Bottom Layer */}
      <path
        d="M14 2.5 L17.4 9.4 L25 10.5 L19.5 15.8 L20.8 23.4 L14 19.8 L7.2 23.4 L8.5 15.8 L3 10.5 L10.6 9.4 Z"
        fill="#103F5E"
        transform="translate(1.5, 2)"
        strokeLinejoin="round"
      />

      {/* Main Top Chunky Outlined Star Layer */}
      <path
        d="M14 2.5 L17.4 9.4 L25 10.5 L19.5 15.8 L20.8 23.4 L14 19.8 L7.2 23.4 L8.5 15.8 L3 10.5 L10.6 9.4 Z"
        fill={filled ? "#84E012" : "#EBE8DF"}
        stroke="#103F5E"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
