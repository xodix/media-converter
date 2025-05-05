import { configuration } from "../config";

export function handleFolderNameChange(e: Event) {
  const folderNameInput = e.target as HTMLInputElement;
  configuration.folderName = folderNameInput.value;
}
