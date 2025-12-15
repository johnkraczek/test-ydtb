import { CropArea } from "./types";

// Canvas helper for cropping
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

export async function getCroppedImg(imageSrc: string, pixelCrop: CropArea): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return "";
  }

  // set canvas size to match the bounding box
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // draw image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const fileUrl = window.URL.createObjectURL(blob);
      resolve(fileUrl);
    }, 'image/jpeg');
  });
}

export const generateSlug = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
};

export const getColorClasses = (color: string) => {
  const map: Record<string, { bg: string, text: string, softBg: string }> = {
    slate: { bg: "bg-slate-600", text: "text-slate-600", softBg: "bg-slate-100" },
    red: { bg: "bg-red-600", text: "text-red-600", softBg: "bg-red-100" },
    orange: { bg: "bg-orange-600", text: "text-orange-600", softBg: "bg-orange-100" },
    amber: { bg: "bg-amber-600", text: "text-amber-600", softBg: "bg-amber-100" },
    yellow: { bg: "bg-yellow-600", text: "text-yellow-600", softBg: "bg-yellow-100" },
    lime: { bg: "bg-lime-600", text: "text-lime-600", softBg: "bg-lime-100" },
    green: { bg: "bg-green-600", text: "text-green-600", softBg: "bg-green-100" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", softBg: "bg-emerald-100" },
    teal: { bg: "bg-teal-600", text: "text-teal-600", softBg: "bg-teal-100" },
    cyan: { bg: "bg-cyan-600", text: "text-cyan-600", softBg: "bg-cyan-100" },
    sky: { bg: "bg-sky-600", text: "text-sky-600", softBg: "bg-sky-100" },
    blue: { bg: "bg-blue-600", text: "text-blue-600", softBg: "bg-blue-100" },
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", softBg: "bg-indigo-100" },
    violet: { bg: "bg-violet-600", text: "bg-violet-600", softBg: "bg-violet-100" },
    purple: { bg: "bg-purple-600", text: "text-purple-600", softBg: "bg-purple-100" },
    fuchsia: { bg: "bg-fuchsia-600", text: "text-fuchsia-600", softBg: "bg-fuchsia-100" },
    pink: { bg: "bg-pink-600", text: "text-pink-600", softBg: "bg-pink-100" },
    rose: { bg: "bg-rose-600", text: "text-rose-600", softBg: "bg-rose-100" },
  };
  return map[color] || map.indigo;
};