function toggleText() {
  const button = document.querySelector(".toggle-text-button");
  if (!button) return;

  const text = document.getElementById("text");
  if (!text) return;

  button.addEventListener("click", () => (text.hidden = !text.hidden));
}
