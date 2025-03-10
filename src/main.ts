import { configuration } from "./config";
import { changeColor } from "./events/color";
import { handleDimensionChange } from "./events/dimensions";
import { handleSubmit } from "./events/download";
import { handleFileChange, handleCancel } from "./events/file";

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
heightInput.addEventListener("input", () => console.log(configuration));
