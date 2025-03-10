import JSZip from "jszip";
import { resetError } from "../error";
import saveAs from "file-saver";

const imagesElement = document.getElementById("images") as HTMLDivElement;

export function handleSubmit(_: Event) {
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
