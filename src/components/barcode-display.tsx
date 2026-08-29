"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

type BarcodeDisplayProps = {
  value: string;
  className?: string;
  height?: number;
};

export function BarcodeDisplay({
  value,
  className,
  height = 60,
}: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value) return;

    try {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        width: 2,
        height,
        displayValue: true,
        fontSize: 14,
        margin: 12,
        background: "transparent",
      });
    } catch {
      svgRef.current.innerHTML = "";
    }
  }, [value, height]);

  return (
    <svg
      ref={svgRef}
      className={className}
      role="img"
      aria-label={`Código de barras ${value}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
