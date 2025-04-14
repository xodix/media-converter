export function turnBufferBlackAndWhite(
  data: Uint8ClampedArray<ArrayBufferLike>
) {
  // (r, g, b, alpha)[]
  for (let i = 0; i < data.length; i += 4) {
    // grayscale = (r+g+b)/3
    // r, g, b => grayscale, grayscale, grayscale
    const grayscale = Math.round(
      data[i] * 0.3 + data[i + 1] * 0.6 + data[i + 2] * 0.3
    );

    data[i] = grayscale;
    data[i + 1] = grayscale;
    data[i + 2] = grayscale;
  }
}
