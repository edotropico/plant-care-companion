import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx";

createRoot(document.getElementById("radice")).render(<App />);

/* quando finisce di montare *winkwink* toglie la schermata di react */
requestAnimationFrame(() => {
  const avvio = document.getElementById("avvio");
  if (avvio) { avvio.classList.add("via"); setTimeout(() => avvio.remove(), 500); }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

console.log("%cPlant Care Companion", "font:600 14px Georgia,serif;color:#3B7B92",
  "\ndi Edoardo Giangrandi \u00b7 MIT");
