export async function downloadBarcodeAsPng(
  svg: SVGSVGElement,
  filename: string
): Promise<void> {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const pngBlob = await svgToPngBlob(url, svg);
    const pngUrl = URL.createObjectURL(pngBlob);
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
    link.click();
    URL.revokeObjectURL(pngUrl);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function svgToPngBlob(url: string, svg: SVGSVGElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 3;
      const width =
        svg.width.baseVal.value || svg.viewBox.baseVal.width || img.width;
      const height =
        svg.height.baseVal.value || svg.viewBox.baseVal.height || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No se pudo crear el canvas"));
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("No se pudo generar la imagen"));
        },
        "image/png",
        1
      );
    };
    img.onerror = () => reject(new Error("No se pudo renderizar el código"));
    img.src = url;
  });
}
