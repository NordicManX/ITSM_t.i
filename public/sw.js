// public/sw.js
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("fetch", () => {
  // O Chrome exige esse evento vazio para liberar o botão de Instalar App
});
