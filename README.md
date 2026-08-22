# Plant Care Companion

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-Donate-yellow?logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/edotropico)

> Progressive Web App for indoor plant care. Tracks watering, fertilizing, and treatments, counts new and lost leaves, and uses this data to provide a diagnosis rather than just reminding you of deadlines.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)
![Offline First](https://img.shields.io/badge/Offline-First-green)
![No Tracking](https://img.shields.io/badge/Tracking-None-lightgrey)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Functions entirely offline, installs to the Home screen, and is optimized for smartphone use by managing data storage locally. No data is sent to external servers.

## Live Demo

[Open Plant Care](https://edotropico.github.io/plant-care-companion)

## Features

- **Reality-calibrated rhythms**: compares the set interval with your actual habits and suggests corrections.
- **Guided diagnosis**: input visual symptoms — on leaves, soil, or stem — to identify probable causes across 19 problem categories.
- **Leaf balance**: compares new leaves against lost leaves, cross-referencing the type of loss (dead, dried, yellowed) with the watering rhythm.
- **Reference guides**: 11 soil mix recipes, 8 water types, 25 botanical profiles detailing family, origin, and toxicity.
- **Plant-sitter booklet**: printable day-by-day instructions for absences.
- **History**: monthly calendar, leaf timelines, and next leaf prediction.
- English and Italian localization, light and dark themes, 115 badges.

## Data Storage

Data is stored in the browser's `localStorage` under the `cura-piante:v2` key. No accounts or network calls are utilized. Use More -> Save a copy to export all data to a JSON file, which can be restored via the Restore function.

## Structure

.
├── index.html          single page: PWA metadata, shell, splash screen
├── manifest.json       name, icons, colors, full screen mode
├── sw.js               service worker: enables offline access
├── css/
│   └── style.css       main stylesheet
├── js/
│   └── app.js          compiled bundle (generated, do not edit manually)
├── src/
│   ├── app.jsx         source code: components, botanical data, logic
│   └── index.jsx       entry point, service worker registration
└── icons/
    ├── icon-192.png    Android and manifest icon
    ├── icon-512.png    large icon, maskable version included
    ├── apple-touch-icon-180.png
    └── splash/         splash screens for iOS devices

## Development

npm install
npm run dev      # recompile on save
npm run serve    # open on http://localhost:8080

Modifications are made in `src/app.jsx` and `css/style.css`. The `js/app.js` file is generated. Rebuild with `npm run build` **before every commit** to prevent discrepancies between the source and the online version.

## Deployment

GitHub Pages: Access repository settings, Pages section, select `main` source and `/root` folder. HTTPS is required for the service worker, which is provided by GitHub Pages.

iPhone: Open the URL in Safari, select Share -> Add to Home Screen.

## Contributing

Personal open-source project. Ideas, suggestions, and bug reports are accepted via Issues or Pull Requests.

## License

MIT — see [LICENSE](LICENSE). Original SVG plant illustrations are subject to the same license.

### Support the project

If this application assists in maintaining your plants, consider supporting its development:

* [Buy Me a Coffee](https://www.buymeacoffee.com/edotropico)
* [Revolut](https://revolut.me/edotropico)

---

Developed by **edotropico**.
