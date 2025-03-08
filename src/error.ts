const errorPrompt = document.getElementById("error") as HTMLDivElement;
export function appendError(error: string) {
  errorPrompt.textContent = error;
  errorPrompt.style.display = "block";
  console.error(error);

  const errors = localStorage.getItem("errors");
  if (errors === null) localStorage.setItem("errors", error);
  else localStorage.setItem("errors", errors + ";" + error);
}

export function resetError() {
  errorPrompt.style.display = "none";
}
