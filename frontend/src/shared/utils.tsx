export function getTargetDimensions(digit: string) {
  const targetWidth = digit === ":" ? 220 : 440;
  const targetHeight = digit.toUpperCase() === "AM" || digit.toUpperCase() === "PM" ? 400 : 800;
  return { targetWidth, targetHeight };
}

// async load image
export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}
