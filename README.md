# 🌿 Plant Care PWA

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-Donate-yellow?logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/edotropico)

> A lightweight Progressive Web App for the daily care of indoor plants — built to diagnose, not just remind.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)
![Offline First](https://img.shields.io/badge/Offline-First-green)
![No Tracking](https://img.shields.io/badge/Tracking-None-lightgrey)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ What it does

* **Diagnosis, not just reminders.** Start from what you see — on the leaves, the soil, the stem, the growth — and reach a probable cause in two or three taps, across 19 problem cards grouped by category.
* **Rhythms calibrated on reality.** It compares the interval you set with the one you actually keep, and offers to correct it.
* **Leaf balance.** New leaves against lost ones, with the type of loss (dead, dried, yellowed) cross-referenced with your watering rhythm to suggest a cause.
* **Reference built in.** 11 soil-mix recipes, 8 water types, 25 botanical profiles with family, origin, habitat and toxicity.
* **Plant-sitter booklet.** Printable day-by-day instructions for when you travel.
* **Seasons that matter.** Four phases across the year, automatically stretching intervals and pausing feeding.
* **Italian and English**, light / dark / system themes, 115 badges.
* **Installable** on iOS and Android, straight to the home screen.

## 🚀 Try it live

🔗 [Open Plant Care](https://edotropico.github.io/plant-care-companion)

## 🔒 Your data

Everything is stored in your browser's `localStorage` under `cura-piante:v2`. No account, no server, no network calls, no analytics. Export the whole collection to a JSON file from **More → Save a copy**, and restore it on another device.

## 🛠️ Tech stack

* React 18 + JSX, bundled with esbuild into a single file
* Plain CSS, no framework
* Service Worker + Web App Manifest
* Hand-drawn SVG illustrations, one per species

## 🧑‍💻 Development

```bash
npm install
npm run dev      # rebuilds on save
npm run serve    # http://localhost:8080
```

Edit `src/app.jsx` and `css/style.css`.

> **`js/app.js` is generated.** Run `npm run build` before every commit, or the deployed app won't match the source.

## 📁 Structure

```
index.html      shell, PWA metadata, splash screen
manifest.json   name, icons, colours, standalone display
sw.js           service worker: opens without a connection
css/style.css   the whole stylesheet
js/app.js       compiled bundle (generated)
src/app.jsx     the real source: components, botanical data, logic
src/index.jsx   entry point, registers the service worker
icons/          app icons and iOS splash screens
```

## 🤝 Contributing

This is a personal open-source project. Ideas, suggestions and bug reports are welcome — open an *Issue* or a *Pull Request*.

## 📄 License

Distributed under the MIT License. See the `LICENSE` file for details. The SVG plant illustrations are original work and fall under the same licence.

### ☕ Support the project

If this app helps you keep your plants alive, consider supporting its development:

* ☕ [Buy Me a Coffee](https://www.buymeacoffee.com/edotropico)
* 💳 [Revolut](https://revolut.me/edotropico)

---

Made by **edotropico**.
