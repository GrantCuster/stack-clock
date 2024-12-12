export function getTargetDimensions(digit: string) {
  const targetWidth = digit === ":" ? 220 : 440;
  const targetHeight = digit.toUpperCase() === "AM" || digit.toUpperCase() === "PM" ? 400 : 800;
  return { targetWidth, targetHeight };
}
