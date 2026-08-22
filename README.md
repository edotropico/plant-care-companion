# Plant Care Companion

Progressive Web App per la cura delle piante d'appartamento. Tiene il ritmo di
annaffiature, concime e trattamenti, conta le foglie nuove e quelle perse, e da
quei dati ricava una diagnosi invece di limitarsi a ricordarti le scadenze.

Funziona senza rete, si installa sulla schermata Home e non manda niente a
nessun server: tutto resta nel telefono.

## Cosa fa

- **Ritmi calibrati sulla realtà**: confronta l'intervallo che hai impostato con
  quello che segui davvero, e ti propone di correggerlo.
- **Diagnosi guidata**: si parte da quello che vedi — sulle foglie, sul
  terriccio, sul fusto — e in due o tre tocchi si arriva alla causa probabile,
  fra diciannove problemi divisi per categoria.
- **Bilancio fogliare**: foglie nuove contro foglie perse, con il tipo di
  perdita (morta, secca, ingiallita) incrociato col tuo ritmo di annaffiatura.
- **Guide**: undici ricette di substrato, otto tipi d'acqua, venticinque schede
  botaniche con famiglia, origine e tossicità.
- **Libretto per chi ti annaffia**: istruzioni giorno per giorno da stampare
  quando parti.
- **Storico**: calendario del mese, linee del tempo delle foglie, previsione
  della prossima.
- Italiano e inglese, tema chiaro e scuro, centoquindici distintivi.

## Struttura

```
.
├── index.html          pagina unica: metadati PWA, guscio, schermata di avvio
├── manifest.json       nome, icone, colori, modalità a schermo intero
├── sw.js               service worker: l'app si apre anche senza rete
├── css/
│   └── style.css       tutto il foglio di stile
├── js/
│   └── app.js          pacchetto compilato (generato, non si modifica a mano)
├── src/
│   ├── app.jsx         il sorgente vero: componenti, dati botanici, logica
│   └── index.jsx       punto d'ingresso, registra il service worker
└── icons/
    ├── icon-192.png    icona per Android e per il manifest
    ├── icon-512.png    icona grande, anche in versione maskable
    ├── apple-touch-icon-180.png
    └── splash/         schermate di avvio per gli iPhone recenti
```

## Come si sviluppa

```bash
npm install
npm run dev      # ricompila a ogni salvataggio
npm run serve    # apre su http://localhost:8080
```

Si modifica `src/app.jsx` e `css/style.css`. Il file `js/app.js` è generato:
va rigenerato con `npm run build` **prima di ogni commit**, altrimenti online
finisce una versione diversa da quella del sorgente.

## Come si pubblica

Su GitHub Pages: impostazioni del repository, sezione Pages, sorgente
`main` e cartella `/root`. Serve HTTPS perché il service worker funzioni, e
GitHub Pages ce l'ha già.

Su iPhone: si apre l'indirizzo in Safari, poi Condividi → Aggiungi alla
schermata Home.

## Dove finiscono i dati

Nel `localStorage` del browser, sotto la chiave `cura-piante:v2`. Non c'è
nessun account e nessuna chiamata di rete. Da Altro → Salva copia si esporta
tutto in un file JSON, che si rimette da Ripristina.

## Licenza

MIT — vedi [LICENSE](LICENSE).
Le illustrazioni SVG delle piante sono originali e ricadono nella stessa licenza.

---

Fatto da **Edoardo Giangrandi**.
