import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Configuration } from "./config";
import { appendError, resetError } from "./error";

const form = document.getElementsByTagName("form")[0];

const imgInput = document.getElementById("file") as HTMLInputElement;
const widthInput = document.getElementById("width") as HTMLInputElement;
const heightInput = document.getElementById("height") as HTMLInputElement;

const blackAndWhiteRadio = document.getElementById("bw") as HTMLInputElement;
const colorRadio = document.getElementById("clr") as HTMLInputElement;

const imagesElement = document.getElementById("images") as HTMLDivElement;

const configuration = new Configuration();

function redrawImages() {
  for (let i = 0; i < configuration.imgs.length; i++) {
    const { canvas, imageURL, fileName } = configuration.imgs[i];

    const imageElement = new Image(configuration.width, configuration.height);
    imageElement.src = imageURL;
    imageElement.onload = (e) => {
      canvas.width = configuration.width;
      canvas.height = configuration.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        e.target as HTMLImageElement,
        0,
        0,
        configuration.width,
        configuration.height
      );
      imageElement.onload = null;
    };
    imageElement.alt = fileName;
  }
}
let dimensionTimer: number = 0;
function handleDimensionChange(_: Event) {
  clearTimeout(dimensionTimer);
  dimensionTimer = setTimeout(() => {
    configuration.changeDimensions(+widthInput.value, +heightInput.value);
    if (configuration.imgs.length === 0) return;

    for (let i = 0; i < configuration.imgs.length; i++) {
      const { canvas } = configuration.imgs[i];
      canvas.width = configuration.width;
      canvas.height = configuration.height;
    }

    redrawImages();
  }, 1000);
}
widthInput.addEventListener("input", handleDimensionChange);
heightInput.addEventListener("input", handleDimensionChange);

function changeColor(_: Event) {
  if (colorRadio.checked) {
    redrawImages();
    return;
  }

  for (let i = 0; i < configuration.imgs.length; i++) {
    const { canvas } = configuration.imgs[i];

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) {
      appendError("Could not get the context [grayscale]");
      return;
    }
    const imageData = ctx.getImageData(
      0,
      0,
      configuration.width,
      configuration.height
    );

    if (!imageData) {
      appendError("Could not find the data of the image [grayscale]");
      return;
    }

    // r, g, b, alpha, ...
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // grayscale = (r+g+b)/3
      // r, g, b => grayscale, grayscale, grayscale
      const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;

      data[i] = grayscale;
      data[i + 1] = grayscale;
      data[i + 2] = grayscale;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
colorRadio.addEventListener("change", changeColor);
blackAndWhiteRadio.addEventListener("change", changeColor);

function handleFileChange(_: Event) {
  resetError();
  imagesElement.innerHTML = "";
  const files = imgInput.files;
  if (!files) {
    appendError("could not get files [changing files]");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // TODO check file.type from all of them
    if (false) {
      appendError("Wrong file format was somehow selected [changing files]");
    }

    const url = URL.createObjectURL(file);

    const image = new Image(configuration.width, configuration.height);
    image.onload = addImage;
    image.src = url;
    image.alt = file.name;
  }
}
imgInput.addEventListener("change", handleFileChange);

function handleSubmit(_: Event) {
  resetError();
  let zippy = new JSZip();
  const canvases = imagesElement.children;
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i] as HTMLCanvasElement;
    // TODO The config should dictate the output format.
    let imageData = canvas.toDataURL("image/png", 0.8);

    zippy.file(
      `${canvas.getAttribute("alt")?.split(".")[0]}.png`,
      imageData.split(",")[1],
      {
        base64: true,
      }
    );
  }

  zippy.generateAsync({ type: "blob" }).then((zip_archive) => {
    saveAs(zip_archive, "images.zip");
  });
}
form.addEventListener("submit", handleSubmit);

function addImage(e: Event) {
  const canvas = document.createElement("canvas");
  canvas.width = configuration.width;
  canvas.height = configuration.height;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (ctx === null) {
    appendError("could not get the 2D context of the canvas. [adding image]");
    return;
  }
  ctx.drawImage(
    e.target as HTMLImageElement,
    0,
    0,
    configuration.width,
    configuration.height
  );
  configuration.imgs.push({
    canvas,
    imageURL: (e.target as HTMLImageElement).src,
    fileName: (e.target as HTMLImageElement).alt,
  });
  canvas.role = "img";
  canvas.setAttribute("alt", (e.target as HTMLImageElement).alt);

  imagesElement.appendChild(canvas);
}
