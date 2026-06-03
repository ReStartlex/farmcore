"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeroVisual } from "@/components/sections/HeroVisual";

const Hero3D = dynamic(() => import("@/components/sections/Hero3D"), { ssr: false });

function canRender3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

/**
 * На мощных десктопах показываем 3D-сцену (lazy, без SSR),
 * на остальном — лёгкую стеклянную карточку HeroVisual.
 */
export function HeroStage() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    setUse3D(canRender3D());
  }, []);

  if (!use3D) return <HeroVisual />;
  return <Hero3D />;
}
