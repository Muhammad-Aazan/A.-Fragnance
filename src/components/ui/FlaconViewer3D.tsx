"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface FlaconViewer3DProps {
  modelSrc: string;
  poster?: string;
  alt?: string;
  autoRotate?: boolean;
}

export default function FlaconViewer3D({
  modelSrc,
  poster,
  alt = "3D Perfume Flacon",
  autoRotate = true,
}: FlaconViewer3DProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if customElements has model-viewer
    if (typeof window !== "undefined" && customElements.get("model-viewer")) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-[#fcfaf7] rounded-xl">
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        type="module"
        strategy="afterInteractive"
        onLoad={() => setIsLoaded(true)}
      />

      {/* 3D Web Component */}
      <div className="w-full h-full absolute inset-0 flex items-center justify-center">
        {/* @ts-ignore */}
        <model-viewer
          src={modelSrc}
          poster={poster}
          alt={alt}
          loading="lazy"
          reveal="auto"
          camera-controls
          auto-rotate={autoRotate ? "" : undefined}
          auto-rotate-delay="600"
          rotation-per-second="25deg"
          shadow-intensity="1.2"
          shadow-softness="0.9"
          exposure="1.15"
          touch-action="pan-y"
          interaction-prompt="auto"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            outline: "none",
          }}
        >
          {/* Slot for loading indicator */}
          <div slot="poster" className="w-full h-full flex items-center justify-center text-[#c6a56b] text-xs tracking-widest uppercase">
            Loading Artisanal 3D Glasswork...
          </div>
        {/* @ts-ignore */}
        </model-viewer>
      </div>

      {/* Interactive Helper Hint Badge */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-[#090909]/80 border border-[#28241d] backdrop-blur-sm px-3 py-1.5 text-[10px] text-[#aba69d] tracking-widest uppercase flex items-center gap-2">
        <span className="text-[#c6a56b] animate-pulse">●</span>
        <span>DRAG TO ROTATE 360° · SCROLL TO ZOOM</span>
      </div>
    </div>
  );
}
