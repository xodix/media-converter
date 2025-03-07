import { saveAs } from "file-saver";
import JSZip from "jszip";

const form = document.getElementsByTagName("form")[0];
const imgInput = document.getElementById("file") as HTMLInputElement;
const errorPrompt = document.getElementById("error") as HTMLDivElement;

function appendError(error: string) {
  errorPrompt.textContent = error;
  errorPrompt.style.display = "block";
  console.error(error);

  const errors = localStorage.getItem("errors");
  if (errors === null) localStorage.setItem("errors", error);
  else localStorage.setItem("errors", errors + ";" + error);
}

enum ImageType {
  "image/png",
  "image/jpeg",
  "image/svg",
  "image/webp",
}

interface ImageRepresentation {
  element: HTMLCanvasElement;
  inputFormat: ImageType;
}

class Configuration {
  width: number;
  height: number;
  outputFormat: ImageType;
  imgs: ImageRepresentation[];

  constructor() {
    this.width = 300;
    this.height = 300;
    this.outputFormat = ImageType["image/webp"];
    this.imgs = [];
  }

  changeDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  changeFormat(format: ImageType) {
    this.outputFormat = format;
  }

  addImage(image: ImageRepresentation) {
    this.imgs.push(image);
  }
}

const configuration = new Configuration();

function handleFileChange(_: Event) {
  errorPrompt.style.display = "none";
  const files = imgInput.files;
  if (!files) {
    appendError("could not get files");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // TODO
    if (!(file.type in ImageType)) {
      appendError("Wrong file format was somehow selected");
    }

    const url = URL.createObjectURL(file);

    const image = new Image(configuration.width, configuration.height);
    image.onload = addImage;
    image.src = url;

    console.log(url);
  }
}
imgInput?.addEventListener("change", handleFileChange);

const imagesElement = document.getElementById("images") as HTMLDivElement;
function handleSubmit(_: Event) {
  errorPrompt.style.display = "none";
  let zippy = new JSZip();
  const canvases = imagesElement.children;
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i] as HTMLCanvasElement;
    let imageData = canvas.toDataURL("image/png", 0.8);

    zippy.file(`image${i}.png`, imageData.split(",")[1], {
      base64: true,
    });
  }

  zippy.generateAsync({ type: "blob" }).then((zip_archive) => {
    console.log("save as zip");
    saveAs(zip_archive, "images.zip");
  });
}
form.addEventListener("submit", handleSubmit);

function addImage(e: Event) {
  const canvasElement = document.createElement("canvas");
  canvasElement.width = configuration.width;
  canvasElement.height = configuration.height;
  const ctx = canvasElement.getContext("2d");
  if (ctx === null) {
    appendError("could not get the 2D context of the canvas.");
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
    element: canvasElement,
    inputFormat: ImageType["image/jpeg"],
  });

  imagesElement.appendChild(canvasElement);
}
