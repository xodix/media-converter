export function createGaussianKernel(radius: number): number[][] {
  console.time("Kernel");
  const deviation = radius / 2;
  const variance = deviation * deviation;
  const divisor = 2 * Math.PI * variance;
  const matrix: number[][] = [];

  let sum = 0;
  for (let x = -radius; x < radius; x++) {
    matrix.push([]);
    const row = matrix[x + radius];
    const row_constant = Math.exp(-(x * x) / (2 * variance));

    for (let y = -radius; y < radius; y++) {
      const result =
        (row_constant * Math.exp(-(y * y) / (2 * variance))) / divisor;
      sum += result;
      row.push(result);
    }
  }

  // normalize kernel
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] /= sum;
    }
  }
  console.timeEnd("Kernel");

  return matrix;
}

function getIndex(width: number, x: number, y: number): number {
  return width * y * 4 + x * 4;
}

function createBoxKernel(radius: number): number[][] {
  const kernel: number[][] = [];

  for (let i = 0; i < radius; i++) {
    kernel.push([]);

    for (let j = 0; j < radius; j++) {
      kernel[i].push(1 / (radius * radius));
    }
  }

  return kernel;
}

function applyKernel(
  arr: Uint8ClampedArray<ArrayBufferLike>,
  width: number,
  mid: [number, number],
  kernel: number[][]
) {
  let r = 0;
  let g = 0;
  let b = 0;
  const halfKernelWidth = Math.floor(kernel.length / 2);

  for (let x = -halfKernelWidth; x < halfKernelWidth; x++) {
    for (let y = -halfKernelWidth; y < halfKernelWidth; y++) {
      const pixel = getIndex(width, mid[0] + x, mid[1] + y);
      const weight = kernel[x + halfKernelWidth][y + halfKernelWidth];
      r += arr[pixel] * weight;
      g += arr[pixel + 1] * weight;
      b += arr[pixel + 2] * weight;
    }
  }

  const main_pixel = getIndex(width, mid[0], mid[1]);
  arr[main_pixel] = Math.floor(r);
  arr[main_pixel + 1] = Math.floor(g);
  arr[main_pixel + 2] = Math.floor(b);
}

export function boxBlur(
  arr: Uint8ClampedArray<ArrayBufferLike>,
  width: number,
  height: number,
  radius: number
) {
  console.time("Blurring");
  console.assert(
    height > radius && width > radius,
    "Radius cannot be larger than width or height."
  );

  const boxKernel = createBoxKernel(radius);

  // array is represented as {r,g,b,a}[]
  const byteWidth = width * 4;
  const halfKernelWidth = Math.ceil(boxKernel.length / 2);

  const heightBoundary = height - halfKernelWidth;
  const widthBoundary = byteWidth - halfKernelWidth;
  for (let y = halfKernelWidth; y < heightBoundary; y++) {
    for (let x = halfKernelWidth; x < widthBoundary; x++) {
      applyKernel(arr, width, [x, y], boxKernel);
    }
  }
  console.timeEnd("Blurring");
}

const gaussianKernel = createGaussianKernel(4);
export function gaussianBlur(
  arr: Uint8ClampedArray<ArrayBufferLike>,
  width: number,
  height: number,
  radius: number
) {
  console.time("Blurring");
  console.assert(
    height > radius && width > radius,
    "Radius cannot be larger than width or height."
  );

  // array is represented as {r,g,b,a}[]
  const byteWidth = width * 4;
  const halfKernelWidth = Math.ceil(gaussianKernel.length / 2);

  const heightBoundary = height - halfKernelWidth;
  const widthBoundary = byteWidth - halfKernelWidth;
  for (let y = halfKernelWidth; y < heightBoundary; y++) {
    for (let x = halfKernelWidth; x < widthBoundary; x++) {
      applyKernel(arr, width, [x, y], gaussianKernel);
    }
  }
  console.timeEnd("Blurring");
}
