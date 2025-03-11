import { configuration } from "../config";
import { redrawToGrayscale } from "../grayscale";
import { addImage } from "./file";

export async function handleFetch(_: Event) {
  const images = [];
  for (let i = 0; i < 5; i++) {
    const image = fetch(
      `https://picsum.photos/${configuration.width}/${configuration.height}`,
      { method: "GET" }
    );
    images.push(image);
  }
  //TODO
  const blobs = images.map(async (response) => (await response).blob());
  const imageURLs = blobs.map(async (blob) => URL.createObjectURL(await blob));
  let loadedObj = { loaded: 0 };
  for (let i = 0; i < imageURLs.length; i++) {
    let image = new Image(configuration.width, configuration.height);
    image.src = await imageURLs[i];
    image.alt = "randomPicture" + i;
    image.onload = (e) => addImage(e, loadedObj);
  }

  if (configuration.blackAndWhite) {
    const int = setInterval(() => {
      if (loadedObj.loaded === imageURLs.length) {
        redrawToGrayscale();
        clearInterval(int);
      }
    }, 100);
  }
}
