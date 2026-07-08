"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export default function LoadingScreen({ isLoading, onFinished }: LoadingScreenProps) {
  const [visible, setVisible] = useState(isLoading);

  // Handle visibility transitions
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished();
      }, 400); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isLoading, onFinished]);

  if (!visible) return null;

  return (
    <div
      style={{
        backgroundColor: "var(--page-bg)",
        transition: "opacity 400ms cubic-bezier(0.25, 1, 0.5, 1)",
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* GPU-Accelerated Animation Keyframes */}
      <style jsx global>{`
        @keyframes line-slide {
          0% {
            transform: translateX(-150%);
          }
          100% {
            transform: translateX(250%);
          }
        }
        .animate-line-slide {
          will-change: transform;
          animation: line-slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Center Layout Container */}
      <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
        
        {/* Logo Container */}
        <div className="w-16 h-16 relative flex items-center justify-center">
          <Image
            src="/OpenLAW_icon.svg"
            alt="OpenLaw Logo Icon"
            width={64}
            height={64}
            priority
            className="object-contain"
          />
        </div>

        {/* Indeterminate GPU-Accelerated Loading Line */}
        <div 
          style={{ backgroundColor: "rgba(41, 47, 54, 0.08)" }}
          className="w-40 h-[3px] rounded-full overflow-hidden relative"
        >
          <div 
            style={{ backgroundColor: "#A41F13" }}
            className="absolute top-0 left-0 w-1/3 h-full rounded-full animate-line-slide"
          />
        </div>

        {/* Tips / Informative Message */}
        <div className="flex flex-col items-center gap-4 w-full">
          <p 
            style={{ color: "#292F36" }}
            className="text-[13px] font-semibold tracking-wide border-b border-[rgba(41,47,54,0.08)] pb-2 w-full text-center"
          >
            Tips for getting the best results:
          </p>
          <ul className="flex flex-col gap-2.5 text-xs text-[#8F7A6E] font-medium leading-relaxed w-full">
            <li className="flex items-start gap-2.5">
              <span style={{ color: "#A41F13" }} className="shrink-0 mt-0.5">•</span>
              <span>Search by statute, jurisprudence, or legal issuance.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span style={{ color: "#A41F13" }} className="shrink-0 mt-0.5">•</span>
              <span>Write your question naturally, like you are asking a person.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span style={{ color: "#A41F13" }} className="shrink-0 mt-0.5">•</span>
              <span>Check the sources shown under each answer.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span style={{ color: "#A41F13" }} className="shrink-0 mt-0.5">•</span>
              <span>Refine your query if the result is too broad.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span style={{ color: "#A41F13" }} className="shrink-0 mt-0.5">•</span>
              <span>Save helpful answers for future review.</span>
            </li>
          </ul>
          
          <span 
            style={{ color: "#8F7A6E" }}
            className="text-[9px] font-bold tracking-widest uppercase opacity-55 mt-4 w-full text-center"
          >
            Stay updated for more app features.
          </span>
        </div>
      </div>
    </div>
  );
}
