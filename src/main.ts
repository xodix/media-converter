import { configuration } from "./config";
import { handleBlur } from "./events/blur";
import { changeColor } from "./events/color";
import { handleDimensionChange } from "./events/dimensions";
import { handleSubmit } from "./events/download";
import { handleFetch } from "./events/fetchRandom";
import { handleFileChange, handleCancel } from "./events/file";
import { handleFormatChange } from "./events/format";

window.addEventListener("DOMContentLoaded", () => {
  configuration.load();
  // file change
  const imgInput = document.getElementById("file") as HTMLInputElement;
  imgInput.addEventListener("change", handleFileChange);
  imgInput.addEventListener("cancel", handleCancel);

  // download
  const form = document.getElementsByTagName("form")[0];
  form.addEventListener("submit", handleSubmit);
  form.addEventListener("reset", handleCancel);

  // color changes
  const blackAndWhiteRadio = document.getElementById("bw") as HTMLInputElement;
  const colorRadio = document.getElementById("clr") as HTMLInputElement;
  colorRadio.addEventListener("change", changeColor);
  blackAndWhiteRadio.addEventListener("change", changeColor);

  // dimension changes
  const widthInput = document.getElementById("width") as HTMLInputElement;
  const heightInput = document.getElementById("height") as HTMLInputElement;
  widthInput.addEventListener("input", handleDimensionChange);
  heightInput.addEventListener("input", handleDimensionChange);

  // debug
  const configButton = document.getElementById("config") as HTMLButtonElement;
  configButton.addEventListener("click", () => console.log(configuration));

  // format
  const formatSelect = document.getElementById("format") as HTMLSelectElement;
  formatSelect.addEventListener("change", handleFormatChange);

  // fetch random from API
  const fetchButton = document.getElementById("fetch") as HTMLButtonElement;
  fetchButton.addEventListener("click", handleFetch);

  const blurCheckbox = document.getElementById("blur") as HTMLInputElement;
  blurCheckbox.addEventListener("change", handleBlur);
});

window.addEventListener("beforeunload", () => configuration.save());
