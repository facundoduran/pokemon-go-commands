document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".copy-btn");
  const toast = document.getElementById("toast");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const command = btn.getAttribute("data-command");
      if (!command) {
        console.warn("No hay data-command en el botón");
        showToast("Error: comando vacío");
        return;
      }

      // Intento moderno primero
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(command);
          showToast("Comando copiado ✅");
          return;
        } catch (err) {
          console.error("Clipboard API falló:", err);
        }
      }

      // Fallback para navegadores donde la Clipboard API no está disponible
      try {
        fallbackCopyText(command);
        showToast("Comando copiado ✅");
      } catch (err) {
        console.error("Fallback de copia falló:", err);
        showToast("No se pudo copiar 😢");
      }
    });
  });

  function fallbackCopyText(text) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    tempTextArea.setAttribute("readonly", "");
    tempTextArea.style.position = "fixed";
    tempTextArea.style.top = "-1000px";
    tempTextArea.style.left = "-1000px";
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    if (!successful) {
      throw new Error("document.execCommand('copy') devolvió false");
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 1500);
  }
});
