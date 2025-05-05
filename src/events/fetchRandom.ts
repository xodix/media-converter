import { configuration } from "../config";
import { redrawImages } from "../draw";
import { appendError } from "../error";
import { addThrobber, removeThrobber } from "../throbber";

const imagesElement = document.getElementById("images") as HTMLDivElement;

export async function handleFetch(_: Event) {
  if (configuration.busy) return;
  configuration.busy = true;

  const centerElement = (document.getElementById("fetch") as HTMLDivElement)
    .children[0] as HTMLDivElement;
  addThrobber(centerElement);

  const images: Promise<Response>[] = [];
  for (let i = 0; i < 5; i++) {
    const image = fetch(
      `https://picsum.photos/${configuration.width}/${configuration.height}`,
      { method: "GET" }
    );
    images.push(image);
  }
  let x = 0;

  images.forEach(async (response, i) => {
    let imageURL;
    try {
      imageURL = URL.createObjectURL(await (await response).blob());
    } catch {
      appendError("Could not fetch random images.");
      configuration.busy = false;
      removeThrobber(centerElement);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = configuration.width;
    canvas.height = configuration.height;

    configuration.addImage({
      canvas: canvas,
      imageURL,
      fileName: "random-file" + i,
    });
    imagesElement.appendChild(canvas);
    x++;

    if (x === images.length) {
      redrawImages();
      configuration.busy = false;
      removeThrobber(centerElement);
    }
  });
}
