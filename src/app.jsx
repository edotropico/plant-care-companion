/*
 * Plant Care Companion
 * Progressive Web App per la cura delle piante d'appartamento: tiene il ritmo
 * di annaffiature, concime e cure, conta le foglie nuove e quelle perse,
 * e da quei dati ricava una diagnosi.
 *
 * Autore: Edoardo Giangrandi
 * © 2026 — licenza MIT
 */

import React, { useState, useEffect, useMemo, useRef } from "react";

import { BOTANICA, EN_BOTANICA, BOT_PIU } from "./dati/botanica.js";
import { PROBLEMI, EN_PROBLEMI } from "./dati/problemi.js";
import { MISCELE, EN_MISCELE, ACQUE, EN_ACQUE } from "./dati/guide.js";
import { SPECIE, PROFILI, EN_PROFILI, VASI, CANDIDATE } from "./dati/specie.js";
const BASE1 = "#2E5545", BASE2 = "#4C7A63", BASE3 = "#89AF97", CO = "#8A6A4A", AC = "#8FBECF", VE = "var(--scheda)";

const TINTE = {
  alocasia: ["#0E2415", "#183B22", "#4E7357"],     // amazonica: quasi nera davvero

  marantacee: ["#2C5A52", "#468A78", "#84B3A2"],   // più fredde
  sansevierie: ["#3B4F3F", "#5C7460", "#93A894"],  // grigio-verdi
  anthurium: ["#16311F", "#2B4A32", "#6E8F74"],    // quasi nere
  succulente: ["#40614A", "#688A6C", "#A0BCA0"],   // chiare
  felci: ["#2A5340", "#487B5F", "#8AB39A"],
  grasse: ["#4E6E52", "#7E9A72", "#9DB48C"],
};
const FAMIGLIA = {
  maranta: "marantacee", calathea: "marantacee", fittonia: "marantacee",
  snake: "sansevierie", "snake-intrecciata": "sansevierie",
  "anthurium-regale": "anthurium", "anthurium-serra": "anthurium", polly: "alocasia", alocasia: "alocasia",
  raindrop: "succulente", peperomia: "succulente",
  felce: "felci", palma: "felci", "felce-montagna": "felci", sedum: "grasse",
};

function Illustrazione({ tipo, stadio = "adulta" }) {
  const p = { viewBox: "0 0 64 64", width: "100%", height: "100%", "aria-hidden": "true" };
  const giovane = stadio === "giovane", matura = stadio === "matura";
  const quante = (arr) => arr.slice(0, giovane ? Math.max(1, Math.ceil(arr.length * 0.45)) : matura ? arr.length : Math.max(2, Math.ceil(arr.length * 0.75)));
  const tinta = TINTE[FAMIGLIA[tipo]];
  const [F1, F2, F3] = tinta || [BASE1, BASE2, BASE3];
  switch (tipo) {
    case "deliciosa":
      return (
        <svg {...p}>
          <path d="M32 4c14 6 24 20 20 36-3 13-14 20-20 20s-17-7-20-20C8 24 18 10 32 4z" fill={F2} />
          <path d="M32 8v50" stroke={F1} strokeWidth="1.6" />
          {giovane ? (
            <path d="M32 16l-11 7M32 16l11 7M32 28l-13 8M32 28l13 8M32 40l-10 7M32 40l10 7" stroke={F1} strokeWidth="1" opacity=".6" />
          ) : (
            <>
              {/* fenditure dal margine: compaiono con l'età adulta */}
              {[[0.30, 7], [0.50, 7], [0.70, 7.5]].map(([t, prof], k) => [1, -1].map((l) => {
                const y = 12 + t * 42;
                return <path key={`${k}${l}`} d={`M${32 + l * 25} ${y} L${32 + l * prof} ${y - 2.5}`}
                  stroke={VE} strokeWidth="2.6" strokeLinecap="round" />;
              }))}
              {matura && [[0.38, 12], [0.58, 13], [0.76, 12]].map(([t, d], k) => [1, -1].map((l) => (
                <ellipse key={`b${k}${l}`} cx={32 + l * d} cy={12 + t * 42} rx="3.1" ry="1.8" fill={VE}
                  transform={`rotate(${16 * l} ${32 + l * d} ${12 + t * 42})`} />
              )))}
            </>
          )}
        </svg>
      );
    case "adansonii":
      return (
        <svg {...p}>
          <rect x="30" y="10" width="4" height="50" rx="2" fill={CO} />
          <path d="M30 16c-9 1-16 8-15 16 6 3 15-1 18-8 1-4 0-7-3-8z" fill={F2} />
          <ellipse cx="21" cy="25" rx="3.4" ry="2" fill={VE} transform="rotate(-20 21 25)" />
          <ellipse cx="26" cy="20" rx="2.4" ry="1.5" fill={VE} transform="rotate(-20 26 20)" />
          <path d="M34 32c9 1 16 8 15 16-6 3-15-1-18-8-1-4 0-7 3-8z" fill={F3} />
          <ellipse cx="43" cy="41" rx="3.4" ry="2" fill={VE} transform="rotate(20 43 41)" />
          <ellipse cx="38" cy="36" rx="2.4" ry="1.5" fill={VE} transform="rotate(20 38 36)" />
          <path d="M30 46c-8 1-14 7-13 14 5 2 13-1 16-7 1-3 0-6-3-7z" fill={F2} />
          <ellipse cx="22" cy="54" rx="3" ry="1.8" fill={VE} transform="rotate(-20 22 54)" />
        </svg>
      );
    case "adansonii-solo":
      return (
        <svg {...p}>
          <rect x="30" y="10" width="4" height="50" rx="2" fill={CO} />
          {quante([[16, 1, F2], [32, -1, F3], [46, 1, F2]]).map(([y, l, c], i) => (
            <g key={i} transform={l === 1 ? undefined : "translate(64,0) scale(-1,1)"}>
              <path d={`M30 ${y}c-9 1-16 8-15 16 6 3 15-1 18-8 1-4 0-7-3-8z`} fill={c} />
              {/* la variegatura mint: settori verde chiaro, non bianchi */}
              <path d={`M27 ${y + 3}c-6 2-10 6-10 11 4 2 9-1 11-6 1-2 1-4-1-5z`} fill="#AFD6A4" />
              {!giovane && <ellipse cx="21" cy={y + 9} rx="3.4" ry="2" fill={VE} transform={`rotate(-20 21 ${y + 9})`} />}
              {matura && <ellipse cx="26" cy={y + 4} rx="2.4" ry="1.5" fill={VE} transform={`rotate(-20 26 ${y + 4})`} />}
            </g>
          ))}
        </svg>
      );
    case "palma":
      return (
        <svg {...p}>
          <path d="M32 60V44" stroke={CO} strokeWidth="3" strokeLinecap="round" />
          {quante([[-1, 1, F1], [1, 1, F1], [-1, 0.78, F2], [1, 0.78, F2], [0, 0.92, F1]]).map(([lato, sc, c], i) => (
            <g key={i} transform={`translate(32,44) scale(${lato === 0 ? 1 : lato * sc},${sc})`}>
              {/* rachide arcuata verso l'esterno, come una vera Kentia */}
              <path d="M0 0C0 -18 6 -30 18 -36" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" />
              {[0.18, 0.36, 0.54, 0.72, 0.9].map((t, k) => {
                const x = 18 * t * t * (3 - 2 * t) * 1.05;
                const y = -36 * (t * (2 - t));
                const lung = 11 - k * 1.1;
                return (
                  <g key={k}>
                    <path d={`M${x} ${y} L${x - lung * 0.35} ${y + lung}`} stroke={c} strokeWidth="1.9" strokeLinecap="round" />
                    <path d={`M${x} ${y} L${x + lung * 0.75} ${y + lung * 0.55}`} stroke={c} strokeWidth="1.9" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>
          ))}
        </svg>
      );
    case "pothos-acqua":
      return (
        <svg {...p}>
          <path d="M22 30h20v22a6 6 0 01-6 6h-8a6 6 0 01-6-6V30z" fill={AC} opacity=".55" />
          <path d="M22 30h20v22a6 6 0 01-6 6h-8a6 6 0 01-6-6V30z" fill="none" stroke={F1} strokeWidth="1.4" />
          <path d="M22 38h20" stroke="#fff" strokeWidth="1.2" opacity=".8" />
          <path d="M32 30V16c0-4 6-6 10-6" stroke={F1} strokeWidth="1.4" fill="none" />
          <path d="M42 6c5 0 8 3 8 7s-4 6-8 4-4-9 0-11z" fill={F3} />
          <path d="M36 16c-5 0-8 3-8 6s4 5 7 3 4-8 1-9z" fill={F2} />
          <path d="M30 44c3 2 4 6 2 9" stroke={F1} strokeWidth="1" fill="none" />
        </svg>
      );
    case "alocasia":
      return (
        <svg {...p}>
          <path d="M30 60V34M38 60V38" stroke={F1} strokeWidth="2" strokeLinecap="round" />
          <path d="M22 34c-4-12 2-24 8-28 6 4 12 16 8 28-4 5-12 5-16 0z" fill={F2} />
          <path d="M30 8v26" stroke={F1} strokeWidth="1.2" />
          <path d="M30 16l-6 6M30 16l6 6M30 24l-6 6M30 24l6 6" stroke={F1} strokeWidth=".9" />
          <path d="M40 44c-3-9 1-18 6-21 4 3 9 12 6 21-3 4-9 4-12 0z" fill={F3} />
          <path d="M46 23v21" stroke={F1} strokeWidth="1" />
        </svg>
      );
    case "anthurium-regale":
      return (
        <svg {...p}>
          <path d="M32 60V36" stroke={CO} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M32 6c14 8 20 18 16 26-4 7-11 6-16 4-5 2-12 3-16-4C8 24 18 14 32 6z" fill={F1} />
          <path d="M32 10v26M32 18l-11 6M32 18l11 6M32 28l-9 6M32 28l9 6" stroke={F3} strokeWidth="1" />
        </svg>
      );
    case "anthurium-serra":
      return (
        <svg {...p}>
          <rect x="12" y="14" width="40" height="42" rx="4" fill={AC} opacity=".2" stroke={F1} strokeWidth="1.4" />
          <circle cx="22" cy="20" r="1" fill={F1} /><circle cx="32" cy="20" r="1" fill={F1} /><circle cx="42" cy="20" r="1" fill={F1} />
          <path d="M32 30c5 4 7 12 5 18-2 5-8 5-10 0-2-6 0-14 5-18z" fill={F1} />
          <path d="M32 32v16" stroke={F3} strokeWidth=".9" />
          <path d="M32 30v-4" stroke={CO} strokeWidth="1.6" />
        </svg>
      );
    case "polkadot":
      return (
        <svg {...p}>
          <path d="M32 60V40" stroke={F1} strokeWidth="1.6" />
          {quante([[20, 30, -30], [44, 30, 30], [26, 44, -20], [38, 44, 20], [32, 20, 0]]).map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="9" ry="6" fill={F2} />
              <circle cx={x - 4} cy={y - 1} r="1.3" fill="#E8A9B8" />
              <circle cx={x + 3} cy={y + 2} r="1.3" fill="#E8A9B8" />
              <circle cx={x + 1} cy={y - 3} r="1.1" fill="#E8A9B8" />
            </g>
          ))}
          <path d="M32 40l-9-8M32 40l10-8M32 48l-5-4M32 48l5-4" stroke={F1} strokeWidth="1" />
        </svg>
      );
    case "raindrop":
      return (
        <svg {...p}>
          {quante([[20, 26], [44, 24], [32, 14], [26, 40], [40, 40]]).map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y - 9}c7 4 9 10 5 14s-12 2-14-3 2-9 9-11z`} fill={i % 2 ? F3 : F2} />
              <path d={`M${x} ${y + 5}L32 56`} stroke={F1} strokeWidth="1.2" />
            </g>
          ))}
          <path d="M32 56v4" stroke={F1} strokeWidth="2" />
        </svg>
      );
    case "maranta":
      return (
        <svg {...p}>
          {quante([[16, 40, -50], [48, 40, 50], [24, 26, -22], [40, 26, 22], [32, 46, 0]]).map(([x, y, r], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="11" ry="7" fill={i % 2 ? F2 : F3} />
              <path d={`M${x - 10} ${y}h20`} stroke={F1} strokeWidth="1" />
              <path d={`M${x - 5} ${y - 4}l3 4-3 4M${x + 1} ${y - 4}l3 4-3 4`} stroke={F1} strokeWidth=".9" fill="none" />
            </g>
          ))}
        </svg>
      );
    case "calathea":
      return (
        <svg {...p}>
          {quante([-18, 0, 18]).map((r, i) => (
            <g key={i} transform={`rotate(${r} 32 58)`}>
              <path d="M32 58V34" stroke={CO} strokeWidth="1.6" />
              <ellipse cx="32" cy="24" rx="8" ry="13" fill={i === 1 ? F2 : F3} />
              <path d="M32 12v24" stroke={F1} strokeWidth="1" />
              <path d="M32 18l-6 3M32 18l6 3M32 26l-6 3M32 26l6 3" stroke={F1} strokeWidth=".8" />
            </g>
          ))}
        </svg>
      );
    case "spider":
      return (
        <svg {...p}>
          {quante([-75, -45, -15, 15, 45, 75]).map((r, i) => (
            <path key={i} d="M32 44C32 30 30 18 32 10c2 8 0 20 0 34z" fill={i % 2 ? F2 : F3} transform={`rotate(${r} 32 46)`} />
          ))}
          <path d="M26 46h12v10a4 4 0 01-4 4h-4a4 4 0 01-4-4V46z" fill={CO} />
        </svg>
      );
    case "snake":
      return (
        <svg {...p}>
          {quante([-8, 0, 8, 16]).map((r, i) => (
            <g key={i} transform={`rotate(${r} 32 58)`}>
              <path d="M32 56c-3-10-3-30 0-46 3 16 3 36 0 46z" fill={i % 2 ? F1 : F2} />
              <path d="M30 30h4M30 40h4M30 20h4" stroke={F3} strokeWidth="1" />
            </g>
          ))}
        </svg>
      );
    case "snake-intrecciata":
      return (
        <svg {...p}>
          {quante([-22, -8, 8, 22]).map((r, i) => (
            <path key={i} d="M32 58C28 40 30 22 32 8c4 14 4 34 0 50z" fill={i % 2 ? F1 : F2} transform={`rotate(${r} 32 58)`} />
          ))}
          <path d="M20 44c8 4 16 4 24 0M20 34c8 4 16 4 24 0" stroke={F3} strokeWidth="1.2" fill="none" />
        </svg>
      );
    case "pothos":
      return (
        <svg {...p}>
          <path d="M32 8c0 14-8 22-8 34" stroke={F1} strokeWidth="1.4" fill="none" />
          <path d="M32 8c0 14 8 22 8 34" stroke={F1} strokeWidth="1.4" fill="none" />
          {quante([[18, 26], [46, 26], [16, 44], [48, 44], [32, 14]]).map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 8}c7 2 10 8 7 12s-11 4-13-1 0-9 6-11z`} fill={i % 2 ? F2 : F3} />
          ))}
        </svg>
      );
    case "felce":
      return (
        <svg {...p}>
          {quante([-25, 0, 25]).map((r, i) => (
            <g key={i} transform={`rotate(${r} 32 58)`}>
              <path d="M32 58C32 40 32 20 32 8" stroke={F1} strokeWidth="1.2" />
              {[14, 22, 30, 38, 46].map((y, j) => (
                <g key={j}>
                  <ellipse cx={32 - (7 - j * 0.8)} cy={y} rx={5 - j * 0.5} ry="2" fill={F2} transform={`rotate(-25 26 ${y})`} />
                  <ellipse cx={32 + (7 - j * 0.8)} cy={y} rx={5 - j * 0.5} ry="2" fill={F3} transform={`rotate(25 38 ${y})`} />
                </g>
              ))}
            </g>
          ))}
        </svg>
      );
    case "edera-acqua":
      return (
        <svg {...p}>
          <path d="M24 34h16v18a5 5 0 01-5 5h-6a5 5 0 01-5-5V34z" fill={AC} opacity=".55" stroke={F1} strokeWidth="1.4" />
          <path d="M24 40h16" stroke="#fff" strokeWidth="1.2" opacity=".8" />
          <path d="M32 34V18" stroke={F1} strokeWidth="1.3" />
          {[[20, 16], [44, 14], [32, 8]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 6}l4 3 4-3-2 5 4 2-5 1v4l-3-3-3 3v-4l-5-1 4-2z`} fill={i % 2 ? F2 : F3} />
          ))}
          <path d="M32 22l-10-4M32 20l11-5" stroke={F1} strokeWidth="1" />
        </svg>
      );
    case "pilea-acqua":
      return (
        <svg {...p}>
          <path d="M24 36h16v16a5 5 0 01-5 5h-6a5 5 0 01-5-5V36z" fill={AC} opacity=".55" stroke={F1} strokeWidth="1.4" />
          <path d="M24 42h16" stroke="#fff" strokeWidth="1.2" opacity=".8" />
          <path d="M32 36V24M32 30l-9-4M32 28l10-5" stroke={F1} strokeWidth="1.2" />
          <circle cx="22" cy="24" r="7" fill={F2} /><circle cx="22" cy="24" r="1.4" fill={F1} />
          <circle cx="43" cy="21" r="6" fill={F3} /><circle cx="43" cy="21" r="1.2" fill={F1} />
          <circle cx="32" cy="14" r="5" fill={F2} /><circle cx="32" cy="14" r="1.1" fill={F1} />
        </svg>
      );
    case "peperomia":
      return (
        <svg {...p}>
          {quante([[20, 30], [44, 28], [32, 18], [26, 44], [40, 42]]).map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx="9" ry="7.5" fill={i % 2 ? F1 : F2} />
              <ellipse cx={x - 2} cy={y - 2} rx="3" ry="2" fill={F3} opacity=".4" />
              <path d={`M${x} ${y + 6}L32 58`} stroke={F1} strokeWidth="1.2" />
            </g>
          ))}
        </svg>
      );
    case "spatifillo":
      return (
        <svg {...p}>
          {[-30, -12, 12, 30].map((r, i) => (
            <g key={i} transform={`rotate(${r} 32 60)`}>
              <path d="M32 60V38" stroke={F1} strokeWidth="1.4" />
              <path d="M32 8c7 8 9 20 5 27-3 5-7 5-10 0-4-7-2-19 5-27z" fill={i % 2 ? F1 : F2} />
              <path d="M32 12v24" stroke={F3} strokeWidth=".9" />
            </g>
          ))}
          <path d="M40 44V22" stroke={F3} strokeWidth="1.4" />
          <path d="M40 22c6-6 9-2 6 5-2 5-6 6-6 1z" fill="#FBFDF9" stroke={F1} strokeWidth="1" />
          <path d="M41 24c2 1 2 5 1 7" stroke="#D9C68A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "fittonia":
      return (
        <svg {...p}>
          {quante([[16, 46, -28, F1], [48, 46, 28, F1], [22, 32, -16, F2], [42, 32, 16, F2], [32, 18, 0, F1], [32, 45, 0, F2]]).map(([x, y, r, c], i) => (
            <g key={i} transform={`rotate(${r} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="10.5" ry="7.2" fill={c} />
              <path d={`M${x - 9.5} ${y}h19`} stroke="#EDF3EC" strokeWidth="1.3" strokeLinecap="round" />
              <path d={`M${x - 5} ${y}l-1.6-3.2M${x - 1} ${y}l-1.6-3.2M${x + 3} ${y}l-1.6-3.2M${x - 5} ${y}l-1.6 3.2M${x - 1} ${y}l-1.6 3.2M${x + 3} ${y}l-1.6 3.2`}
                stroke="#EDF3EC" strokeWidth=".8" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      );
    case "sedum":
      return <svg {...p}><path d="M12 52h40l-3 8H15z" fill="#8A6A4A"/><path d="M26.7 46.0 Q31.5 42.3 32.8 42.5 Q31.5 42.3 28.7 37.5 Z" fill="#7E9A72"/><path d="M19.7 46.9 Q26.6 47.5 27.3 48.3 Q26.6 47.5 29.8 42.8 Z" fill="#7E9A72"/><path d="M14.5 43.4 Q18.2 47.8 17.7 48.7 Q18.2 47.8 25.0 46.7 Z" fill="#7E9A72"/><path d="M14.9 38.0 Q12.7 43.0 11.4 43.3 Q12.7 43.0 18.0 46.4 Z" fill="#7E9A72"/><path d="M20.6 34.9 Q14.1 36.7 13.1 36.1 Q14.1 36.7 14.0 42.0 Z" fill="#7E9A72"/><path d="M27.4 36.4 Q21.5 33.6 21.5 32.7 Q21.5 33.6 16.0 36.8 Z" fill="#7E9A72"/><path d="M30.1 41.4 Q29.3 36.1 30.2 35.5 Q29.3 36.1 22.6 34.8 Z" fill="#7E9A72"/><path d="M47.2 48.8 Q52.1 46.6 53.1 47.0 Q52.1 46.6 51.3 42.4 Z" fill="#4E6E52"/><path d="M41.5 48.3 Q46.7 49.9 47.0 50.7 Q46.7 49.9 50.6 46.7 Z" fill="#4E6E52"/><path d="M38.4 44.6 Q40.0 48.7 39.4 49.3 Q40.0 48.7 45.7 49.0 Z" fill="#4E6E52"/><path d="M40.3 40.4 Q37.1 44.0 36.0 44.0 Q37.1 44.0 40.2 47.5 Z" fill="#4E6E52"/><path d="M45.7 39.0 Q40.1 39.3 39.4 38.6 Q40.1 39.3 38.4 43.4 Z" fill="#4E6E52"/><path d="M50.6 41.3 Q46.8 38.1 47.0 37.3 Q46.8 38.1 41.5 39.7 Z" fill="#4E6E52"/><path d="M51.3 45.7 Q52.2 41.4 53.1 41.1 Q52.2 41.4 47.3 39.2 Z" fill="#4E6E52"/><path d="M37.6 31.9 Q42.5 28.8 43.6 29.1 Q42.5 28.8 40.5 24.3 Z" fill="#C08B57"/><path d="M31.2 32.2 Q37.4 33.2 37.8 34.0 Q37.4 33.2 40.8 29.2 Z" fill="#C08B57"/><path d="M26.9 28.6 Q29.8 32.9 29.2 33.7 Q29.8 32.9 36.0 32.4 Z" fill="#C08B57"/><path d="M27.9 23.8 Q25.3 28.1 24.1 28.3 Q25.3 28.1 29.7 31.6 Z" fill="#C08B57"/><path d="M33.5 21.4 Q27.4 22.5 26.5 21.9 Q27.4 22.5 26.6 27.3 Z" fill="#C08B57"/><path d="M39.5 23.2 Q34.5 20.3 34.5 19.4 Q34.5 20.3 29.1 22.8 Z" fill="#C08B57"/><path d="M41.3 27.9 Q41.2 23.1 42.1 22.6 Q41.2 23.1 35.3 21.5 Z" fill="#C08B57"/><path d="M16.1 33.1 Q20.5 31.8 21.2 32.2 Q20.5 31.8 20.5 28.2 Z" fill="#9DB48C"/><path d="M11.4 32.2 Q15.5 34.0 15.6 34.7 Q15.5 34.0 19.2 31.8 Z" fill="#9DB48C"/><path d="M9.5 28.9 Q10.2 32.4 9.5 32.9 Q10.2 32.4 14.8 33.2 Z" fill="#9DB48C"/><path d="M11.7 25.6 Q8.5 28.3 7.6 28.2 Q8.5 28.3 10.5 31.5 Z" fill="#9DB48C"/><path d="M16.4 24.9 Q11.7 24.7 11.2 24.1 Q11.7 24.7 9.6 27.9 Z" fill="#9DB48C"/><path d="M20.1 27.3 Q17.4 24.3 17.7 23.7 Q17.4 24.3 12.8 25.1 Z" fill="#9DB48C"/><path d="M19.9 30.9 Q21.3 27.5 22.2 27.3 Q21.3 27.5 17.6 25.3 Z" fill="#9DB48C"/></svg>;
    case "felce-blu":
      return <svg {...p}><path d="M32 60V53" stroke="#4E7C86" strokeWidth="2.4" strokeLinecap="round"/><g transform="translate(12,22) rotate(-38) scale(0.46)"><path d="M0 44.0 L19.1 31.1" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 44.0 L-19.1 31.1" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 33.0 L16.4 21.9" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 33.0 L-16.4 21.9" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 22.0 L13.7 12.7" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 22.0 L-13.7 12.7" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 11.0 L11.1 3.5" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 11.0 L-11.1 3.5" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 47 L0 12" stroke="#83B6BE" strokeWidth="3" strokeLinecap="round"/></g><g transform="translate(52,22) rotate(38) scale(0.46)"><path d="M0 44.0 L19.1 31.1" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 44.0 L-19.1 31.1" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 33.0 L16.4 21.9" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 33.0 L-16.4 21.9" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 22.0 L13.7 12.7" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 22.0 L-13.7 12.7" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 11.0 L11.1 3.5" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 11.0 L-11.1 3.5" stroke="#83B6BE" strokeWidth="5.4" strokeLinecap="round" fill="none"/><path d="M0 47 L0 12" stroke="#83B6BE" strokeWidth="3" strokeLinecap="round"/></g><g transform="translate(32,10) rotate(0) scale(0.82)"><path d="M0 44.0 L19.1 31.1" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 44.0 L-19.1 31.1" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 33.0 L16.4 21.9" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 33.0 L-16.4 21.9" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 22.0 L13.7 12.7" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 22.0 L-13.7 12.7" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 11.0 L11.1 3.5" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 11.0 L-11.1 3.5" stroke="#3E7B85" strokeWidth="5.8" strokeLinecap="round" fill="none"/><path d="M0 47 L0 12" stroke="#3E7B85" strokeWidth="3" strokeLinecap="round"/></g></svg>;
    case "felce-montagna":
      return <svg {...p}><g transform="rotate(-46 32 58) translate(32,0)"><path d="M0 57 L0 22" stroke="#487B5F" strokeWidth="1.3" strokeLinecap="round"/><ellipse cx="2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(-28 2.5 56.0)" fill="#487B5F"/><ellipse cx="-2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(28 -2.5 56.0)" fill="#487B5F"/><ellipse cx="3.5" cy="51.8" rx="3.5" ry="1.7" transform="rotate(-28 3.5 51.8)" fill="#487B5F"/><ellipse cx="-3.5" cy="51.8" rx="3.5" ry="1.7" transform="rotate(28 -3.5 51.8)" fill="#487B5F"/><ellipse cx="4.2" cy="47.5" rx="4.2" ry="1.7" transform="rotate(-28 4.2 47.5)" fill="#487B5F"/><ellipse cx="-4.2" cy="47.5" rx="4.2" ry="1.7" transform="rotate(28 -4.2 47.5)" fill="#487B5F"/><ellipse cx="4.6" cy="43.2" rx="4.6" ry="1.7" transform="rotate(-28 4.6 43.2)" fill="#487B5F"/><ellipse cx="-4.6" cy="43.2" rx="4.6" ry="1.7" transform="rotate(28 -4.6 43.2)" fill="#487B5F"/><ellipse cx="4.6" cy="39.0" rx="4.6" ry="1.7" transform="rotate(-28 4.6 39.0)" fill="#487B5F"/><ellipse cx="-4.6" cy="39.0" rx="4.6" ry="1.7" transform="rotate(28 -4.6 39.0)" fill="#487B5F"/><ellipse cx="4.3" cy="34.8" rx="4.3" ry="1.7" transform="rotate(-28 4.3 34.8)" fill="#487B5F"/><ellipse cx="-4.3" cy="34.8" rx="4.3" ry="1.7" transform="rotate(28 -4.3 34.8)" fill="#487B5F"/><ellipse cx="3.6" cy="30.5" rx="3.6" ry="1.7" transform="rotate(-28 3.6 30.5)" fill="#487B5F"/><ellipse cx="-3.6" cy="30.5" rx="3.6" ry="1.7" transform="rotate(28 -3.6 30.5)" fill="#487B5F"/><ellipse cx="2.6" cy="26.2" rx="2.6" ry="1.7" transform="rotate(-28 2.6 26.2)" fill="#487B5F"/><ellipse cx="-2.6" cy="26.2" rx="2.6" ry="1.7" transform="rotate(28 -2.6 26.2)" fill="#487B5F"/><ellipse cx="1.4" cy="22.0" rx="1.4" ry="1.7" transform="rotate(-28 1.4 22.0)" fill="#487B5F"/><ellipse cx="-1.4" cy="22.0" rx="1.4" ry="1.7" transform="rotate(28 -1.4 22.0)" fill="#487B5F"/></g><g transform="rotate(-24 32 58) translate(32,0)"><path d="M0 57 L0 12" stroke="#2A5340" strokeWidth="1.3" strokeLinecap="round"/><ellipse cx="2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(-28 2.5 56.0)" fill="#2A5340"/><ellipse cx="-2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(28 -2.5 56.0)" fill="#2A5340"/><ellipse cx="3.5" cy="50.5" rx="3.5" ry="1.7" transform="rotate(-28 3.5 50.5)" fill="#2A5340"/><ellipse cx="-3.5" cy="50.5" rx="3.5" ry="1.7" transform="rotate(28 -3.5 50.5)" fill="#2A5340"/><ellipse cx="4.2" cy="45.0" rx="4.2" ry="1.7" transform="rotate(-28 4.2 45.0)" fill="#2A5340"/><ellipse cx="-4.2" cy="45.0" rx="4.2" ry="1.7" transform="rotate(28 -4.2 45.0)" fill="#2A5340"/><ellipse cx="4.6" cy="39.5" rx="4.6" ry="1.7" transform="rotate(-28 4.6 39.5)" fill="#2A5340"/><ellipse cx="-4.6" cy="39.5" rx="4.6" ry="1.7" transform="rotate(28 -4.6 39.5)" fill="#2A5340"/><ellipse cx="4.6" cy="34.0" rx="4.6" ry="1.7" transform="rotate(-28 4.6 34.0)" fill="#2A5340"/><ellipse cx="-4.6" cy="34.0" rx="4.6" ry="1.7" transform="rotate(28 -4.6 34.0)" fill="#2A5340"/><ellipse cx="4.3" cy="28.5" rx="4.3" ry="1.7" transform="rotate(-28 4.3 28.5)" fill="#2A5340"/><ellipse cx="-4.3" cy="28.5" rx="4.3" ry="1.7" transform="rotate(28 -4.3 28.5)" fill="#2A5340"/><ellipse cx="3.6" cy="23.0" rx="3.6" ry="1.7" transform="rotate(-28 3.6 23.0)" fill="#2A5340"/><ellipse cx="-3.6" cy="23.0" rx="3.6" ry="1.7" transform="rotate(28 -3.6 23.0)" fill="#2A5340"/><ellipse cx="2.6" cy="17.5" rx="2.6" ry="1.7" transform="rotate(-28 2.6 17.5)" fill="#2A5340"/><ellipse cx="-2.6" cy="17.5" rx="2.6" ry="1.7" transform="rotate(28 -2.6 17.5)" fill="#2A5340"/><ellipse cx="1.4" cy="12.0" rx="1.4" ry="1.7" transform="rotate(-28 1.4 12.0)" fill="#2A5340"/><ellipse cx="-1.4" cy="12.0" rx="1.4" ry="1.7" transform="rotate(28 -1.4 12.0)" fill="#2A5340"/></g><g transform="rotate(0 32 58) translate(32,0)"><path d="M0 57 L0 6" stroke="#2A5340" strokeWidth="1.3" strokeLinecap="round"/><ellipse cx="2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(-28 2.5 56.0)" fill="#2A5340"/><ellipse cx="-2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(28 -2.5 56.0)" fill="#2A5340"/><ellipse cx="3.5" cy="49.8" rx="3.5" ry="1.7" transform="rotate(-28 3.5 49.8)" fill="#2A5340"/><ellipse cx="-3.5" cy="49.8" rx="3.5" ry="1.7" transform="rotate(28 -3.5 49.8)" fill="#2A5340"/><ellipse cx="4.2" cy="43.5" rx="4.2" ry="1.7" transform="rotate(-28 4.2 43.5)" fill="#2A5340"/><ellipse cx="-4.2" cy="43.5" rx="4.2" ry="1.7" transform="rotate(28 -4.2 43.5)" fill="#2A5340"/><ellipse cx="4.6" cy="37.2" rx="4.6" ry="1.7" transform="rotate(-28 4.6 37.2)" fill="#2A5340"/><ellipse cx="-4.6" cy="37.2" rx="4.6" ry="1.7" transform="rotate(28 -4.6 37.2)" fill="#2A5340"/><ellipse cx="4.6" cy="31.0" rx="4.6" ry="1.7" transform="rotate(-28 4.6 31.0)" fill="#2A5340"/><ellipse cx="-4.6" cy="31.0" rx="4.6" ry="1.7" transform="rotate(28 -4.6 31.0)" fill="#2A5340"/><ellipse cx="4.3" cy="24.8" rx="4.3" ry="1.7" transform="rotate(-28 4.3 24.8)" fill="#2A5340"/><ellipse cx="-4.3" cy="24.8" rx="4.3" ry="1.7" transform="rotate(28 -4.3 24.8)" fill="#2A5340"/><ellipse cx="3.6" cy="18.5" rx="3.6" ry="1.7" transform="rotate(-28 3.6 18.5)" fill="#2A5340"/><ellipse cx="-3.6" cy="18.5" rx="3.6" ry="1.7" transform="rotate(28 -3.6 18.5)" fill="#2A5340"/><ellipse cx="2.6" cy="12.2" rx="2.6" ry="1.7" transform="rotate(-28 2.6 12.2)" fill="#2A5340"/><ellipse cx="-2.6" cy="12.2" rx="2.6" ry="1.7" transform="rotate(28 -2.6 12.2)" fill="#2A5340"/><ellipse cx="1.4" cy="6.0" rx="1.4" ry="1.7" transform="rotate(-28 1.4 6.0)" fill="#2A5340"/><ellipse cx="-1.4" cy="6.0" rx="1.4" ry="1.7" transform="rotate(28 -1.4 6.0)" fill="#2A5340"/></g><g transform="rotate(24 32 58) translate(32,0)"><path d="M0 57 L0 12" stroke="#2A5340" strokeWidth="1.3" strokeLinecap="round"/><ellipse cx="2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(-28 2.5 56.0)" fill="#2A5340"/><ellipse cx="-2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(28 -2.5 56.0)" fill="#2A5340"/><ellipse cx="3.5" cy="50.5" rx="3.5" ry="1.7" transform="rotate(-28 3.5 50.5)" fill="#2A5340"/><ellipse cx="-3.5" cy="50.5" rx="3.5" ry="1.7" transform="rotate(28 -3.5 50.5)" fill="#2A5340"/><ellipse cx="4.2" cy="45.0" rx="4.2" ry="1.7" transform="rotate(-28 4.2 45.0)" fill="#2A5340"/><ellipse cx="-4.2" cy="45.0" rx="4.2" ry="1.7" transform="rotate(28 -4.2 45.0)" fill="#2A5340"/><ellipse cx="4.6" cy="39.5" rx="4.6" ry="1.7" transform="rotate(-28 4.6 39.5)" fill="#2A5340"/><ellipse cx="-4.6" cy="39.5" rx="4.6" ry="1.7" transform="rotate(28 -4.6 39.5)" fill="#2A5340"/><ellipse cx="4.6" cy="34.0" rx="4.6" ry="1.7" transform="rotate(-28 4.6 34.0)" fill="#2A5340"/><ellipse cx="-4.6" cy="34.0" rx="4.6" ry="1.7" transform="rotate(28 -4.6 34.0)" fill="#2A5340"/><ellipse cx="4.3" cy="28.5" rx="4.3" ry="1.7" transform="rotate(-28 4.3 28.5)" fill="#2A5340"/><ellipse cx="-4.3" cy="28.5" rx="4.3" ry="1.7" transform="rotate(28 -4.3 28.5)" fill="#2A5340"/><ellipse cx="3.6" cy="23.0" rx="3.6" ry="1.7" transform="rotate(-28 3.6 23.0)" fill="#2A5340"/><ellipse cx="-3.6" cy="23.0" rx="3.6" ry="1.7" transform="rotate(28 -3.6 23.0)" fill="#2A5340"/><ellipse cx="2.6" cy="17.5" rx="2.6" ry="1.7" transform="rotate(-28 2.6 17.5)" fill="#2A5340"/><ellipse cx="-2.6" cy="17.5" rx="2.6" ry="1.7" transform="rotate(28 -2.6 17.5)" fill="#2A5340"/><ellipse cx="1.4" cy="12.0" rx="1.4" ry="1.7" transform="rotate(-28 1.4 12.0)" fill="#2A5340"/><ellipse cx="-1.4" cy="12.0" rx="1.4" ry="1.7" transform="rotate(28 -1.4 12.0)" fill="#2A5340"/></g><g transform="rotate(46 32 58) translate(32,0)"><path d="M0 57 L0 22" stroke="#487B5F" strokeWidth="1.3" strokeLinecap="round"/><ellipse cx="2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(-28 2.5 56.0)" fill="#487B5F"/><ellipse cx="-2.5" cy="56.0" rx="2.5" ry="1.7" transform="rotate(28 -2.5 56.0)" fill="#487B5F"/><ellipse cx="3.5" cy="51.8" rx="3.5" ry="1.7" transform="rotate(-28 3.5 51.8)" fill="#487B5F"/><ellipse cx="-3.5" cy="51.8" rx="3.5" ry="1.7" transform="rotate(28 -3.5 51.8)" fill="#487B5F"/><ellipse cx="4.2" cy="47.5" rx="4.2" ry="1.7" transform="rotate(-28 4.2 47.5)" fill="#487B5F"/><ellipse cx="-4.2" cy="47.5" rx="4.2" ry="1.7" transform="rotate(28 -4.2 47.5)" fill="#487B5F"/><ellipse cx="4.6" cy="43.2" rx="4.6" ry="1.7" transform="rotate(-28 4.6 43.2)" fill="#487B5F"/><ellipse cx="-4.6" cy="43.2" rx="4.6" ry="1.7" transform="rotate(28 -4.6 43.2)" fill="#487B5F"/><ellipse cx="4.6" cy="39.0" rx="4.6" ry="1.7" transform="rotate(-28 4.6 39.0)" fill="#487B5F"/><ellipse cx="-4.6" cy="39.0" rx="4.6" ry="1.7" transform="rotate(28 -4.6 39.0)" fill="#487B5F"/><ellipse cx="4.3" cy="34.8" rx="4.3" ry="1.7" transform="rotate(-28 4.3 34.8)" fill="#487B5F"/><ellipse cx="-4.3" cy="34.8" rx="4.3" ry="1.7" transform="rotate(28 -4.3 34.8)" fill="#487B5F"/><ellipse cx="3.6" cy="30.5" rx="3.6" ry="1.7" transform="rotate(-28 3.6 30.5)" fill="#487B5F"/><ellipse cx="-3.6" cy="30.5" rx="3.6" ry="1.7" transform="rotate(28 -3.6 30.5)" fill="#487B5F"/><ellipse cx="2.6" cy="26.2" rx="2.6" ry="1.7" transform="rotate(-28 2.6 26.2)" fill="#487B5F"/><ellipse cx="-2.6" cy="26.2" rx="2.6" ry="1.7" transform="rotate(28 -2.6 26.2)" fill="#487B5F"/><ellipse cx="1.4" cy="22.0" rx="1.4" ry="1.7" transform="rotate(-28 1.4 22.0)" fill="#487B5F"/><ellipse cx="-1.4" cy="22.0" rx="1.4" ry="1.7" transform="rotate(28 -1.4 22.0)" fill="#487B5F"/></g></svg>;
    case "polly":
      return (
        <svg {...p}>
          <path d="M32 39v21" stroke="#2E5545" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M32 7c8 6 18 18 19.5 27 1.2 7.4-3.6 13-9.6 12-4-.7-7.4-3.6-9.9-7.6-2.5 4-5.9 6.9-9.9 7.6-6 1-10.8-4.6-9.6-12C14 25 24 13 32 7z"
            fill="#1B3A2E" stroke="#EDF3EC" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M32 9v29" stroke="#EDF3EC" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M32 17l13.5 5M32 17l-13.5 5M32 27l16 7.5M32 27l-16 7.5" stroke="#EDF3EC" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path d="M32 58V30" stroke={F1} strokeWidth="1.6" />
          <path d="M32 30c-10 0-16-7-15-16 9-1 16 6 15 16zM32 30c10 0 16-7 15-16-9-1-16 6-15 16z" fill={F2} />
          <path d="M32 44c-8 0-13-5-12-12 7 0 13 5 12 12z" fill={F3} />
        </svg>
      );
  }
}

const LUCI = ["Sole diretto", "Luce brillante", "Luce indiretta brillante", "Luce indiretta", "Tollera la penombra"];
const TAG = { forte: "va forte", ripresa: "in ripresa", cura: "in sofferenza", nuovo: "da capire" };

const CONCIME = {
  "Monstera deliciosa": 21, "Monstera adansonii": 21, "Monstera adansonii Mint (variegata)": 24,
  "Howea forsteriana (kentia)": 30, "Epipremnum aureum (pothos)": 21, "Alocasia": 21,
  "Alocasia amazonica (Polly)": 21,
  "Anthurium regale": 14, "Anthurium warocqueanum": 14, "Hypoestes (polka dot)": 21,
  "Peperomia polybotrya (raindrop)": 45, "Peperomia obtusifolia": 45,
  "Maranta leuconeura": 21, "Calathea": 21, "Fittonia albivenis": 21, "Chlorophytum (spider plant)": 30,
  "Sansevieria (snake plant)": 60, "Sansevieria intrecciata": 60, "Felce": 30,
  "Hedera helix (edera)": 30, "Pilea peperomioides": 28, "Philodendron": 21,
  "Spathiphyllum (spatifillo)": 21, "Altro": 28,
};
const concimeDi = (specie) => CONCIME[specie] || 28;

const SEME = [];   // si parte da zero: le piante le aggiungi tu

const STANZE_BASE = ["Salotto", "Camera", "Bagno", "Cucina", "Studio", "Corridoio", "Balcone"];

const specieBreve = (s) => (s || "").replace(/\s*\(.*\)\s*/, "").trim();

const oggiStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const parseData = (s) => {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date();  // data mancante o storta: oggi
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(y, m - 1, d);
  return Number.isNaN(t.getTime()) ? new Date() : t;
};
const giorniDa = (s) => Math.round((parseData(oggiStr()) - parseData(s)) / 86400000);
let LOCALE = "it-IT";
const formattaData = (s) => parseData(s).toLocaleDateString(LOCALE, { day: "numeric", month: "short" });
const nuovoId = () => Math.random().toString(36).slice(2, 10);

const ritmoReale = (storico) => {
  if (!storico || storico.length < 3) return null;
  const salti = [];
  for (let i = 0; i < storico.length - 1; i++) {
    const d = Math.round((parseData(storico[i]) - parseData(storico[i + 1])) / 86400000);
    if (d > 0 && d < 120) salti.push(d);
  }
  if (salti.length < 2) return null;
  return Math.round(salti.reduce((a, b) => a + b, 0) / salti.length);
};

const crescita = (foglie) => {
  if (!foglie || !foglie.length) return null;
  const recenti = foglie.filter((f) => giorniDa(f) <= 90).length;

  const distinte = [...new Set(foglie)].sort();
  const salti = [];
  for (let i = 1; i < distinte.length; i++) {
    const d = Math.round((parseData(distinte[i]) - parseData(distinte[i - 1])) / 86400000);
    if (d > 0 && d < 400) salti.push(d);
  }

  let ogni = null, prossima = null, finestra = null;
  if (salti.length >= 1 && distinte.length >= 2) {
    const ord = [...salti].sort((a, b) => a - b);
    ogni = ord.length % 2 ? ord[(ord.length - 1) / 2]            // mediana: regge un ritardo isolato
      : Math.round((ord[ord.length / 2 - 1] + ord[ord.length / 2]) / 2);
    if (ogni >= 5) {
      const ultima = distinte[distinte.length - 1];
      prossima = ogni - giorniDa(ultima);                        // giorni da oggi, può essere negativo
      const scarto = salti.length > 1
        ? Math.round(Math.sqrt(salti.reduce((a, x) => a + (x - ogni) ** 2, 0) / salti.length))
        : Math.round(ogni * 0.3);
      finestra = Math.max(2, Math.min(ogni, scarto));
    }
  }
  return { totale: foglie.length, recenti, ogni, prossima, finestra, sicurezza: salti.length };
};

const cureDi = (p, stagione) => {
  const out = [];
  const voce = (chiave, etichetta, giorni, ultimo) =>
    out.push({ chiave, etichetta, restanti: ultimo ? giorni - giorniDa(ultimo) : 0, mai: !ultimo });
  const sospesa = (chiave, etichetta, motivo) => out.push({ chiave, etichetta, sospeso: motivo });

  const daRinvaso = p.ultimoRinvaso ? giorniDa(p.ultimoRinvaso) : null;

  const f = STAGIONI[stagione] || STAGIONI.piena;
  if (!f.concime) sospesa("concime", "Concime", "siamo in riposo, riprenderemo a marzo");
  else if (daRinvaso !== null && daRinvaso < 35) sospesa("concime", "Concime", `rinvasata ${daRinvaso} giorni fa, il substrato nuovo basta`);
  else if (p.tag === "cura") sospesa("concime", "Concime", "sta male, brucerebbe le radici");
  else if (p.modo === "acqua") sospesa("concime", "Concime", "in acqua, solo dose debolissima a radici fatte");
  else voce("concime", "Concime", Math.round(p.concime * f.concime), p.ultimoConcime);

  if (p.spray) voce("spray", "Tonico fogliare", 7, p.ultimoSpray);

  if (p.radicante) {
    if (stagione === "riposo") sospesa("radicante", "Radicante", "in riposo le radici non crescono");
    else voce("radicante", "Radicante", 14, p.ultimoRadicante);
  }

  if (p.pulizia) voce("pulizia", "Pulizia foglie", 21, p.ultimaPulizia);

  if (p.rotazione) voce("rotazione", "Quarto di giro", 7, p.ultimaRotazione);

  if (p.sostegno && p.sostegno !== "nessuno" && p.sostegno !== "pensile")
    voce("legatura", "Lega i getti nuovi", 21, p.ultimaLegatura);

  if (p.rinvaso > 0) {
    if (stagione === "riposo") sospesa("rinvaso", "Rinvaso", "di routine si aspetta marzo, ma se ci sono radici marce si fa subito");
    else if (stagione === "rallenta") sospesa("rinvaso", "Rinvaso", "la finestra si chiude a metà settembre, salvo emergenze");
    else voce("rinvaso", "Rinvaso", p.rinvaso * 30, p.ultimoRinvaso);
  }

  if (p.neemRestanti > 0)
    voce("neem", `Neem (ne restano ${p.neemRestanti})`, 7, p.neemUltimo);

  return out;
};

const ultimaAzione = (p) => {
  const tutte = [...(p.storico || []), ...(p.foglie || []), ...(p.storicoTrattamenti || []), ...(p.storicoConcime || [])];
  if (!tutte.length) return null;
  return tutte.sort().at(-1);
};

const messaggiDi = (p, stagione, en = false) => {
  const m = [];
  const agg = (pri, tono, testo) => m.push({ pri, tono, testo });
  const azione = ultimaAzione(p);
  const daAzione = azione ? giorniDa(azione) : null;
  const ultimaFoglia = p.foglie?.[0] ? giorniDa(p.foglie[0]) : null;

  if (p.restanti < -Math.max(3, Math.round(p.intervallo * 0.5)))
    agg(100, "allerta", en ? `You are well past due: ${Math.abs(p.restanti)} days more than usual.` : `Sei parecchio oltre: ${Math.abs(p.restanti)} giorni in più del solito.`);

  if (p.tag === "cura" && daAzione !== null && daAzione > 14)
    agg(95, "allerta", en ? `It is marked as struggling and you have not touched it for ${daAzione} days.` : `È segnata come sofferente e non la tocchi da ${daAzione} giorni.`);

  if (p.cresc?.ogni && ultimaFoglia !== null && ultimaFoglia > p.cresc.ogni * 2)
    agg(92, "allerta", en ? `It made a leaf every ${p.cresc.ogni} days, but the last one was ${ultimaFoglia} days ago. Take a close look.` : `Faceva una foglia ogni ${p.cresc.ogni} giorni, ma l'ultima risale a ${ultimaFoglia}. Guardala da vicino.`);

  if (p.neemRestanti > 0) {
    const r = p.neemUltimo ? 7 - giorniDa(p.neemUltimo) : 0;
    agg(88, "neutro", r > 0
      ? en ? `Neem cycle: next pass in ${r} ${r === 1 ? "day" : "days"}.` : `Ciclo neem: la prossima passata tra ${r} ${r === 1 ? "giorno" : "giorni"}.`
      : en ? `Neem cycle: due now, ${p.neemRestanti} to go.` : `Ciclo neem: tocca ora, ne restano ${p.neemRestanti}.`);
  }

  const conc = p.cure.find((c) => c.chiave === "concime");
  if (conc && !conc.sospeso && conc.restanti < -14)
    agg(80, "attesa", en ? `Feeding is ${Math.abs(conc.restanti)} days behind.` : `Il concime è indietro di ${Math.abs(conc.restanti)} giorni.`);

  if (p.modo === "acqua" && daAzione !== null && p.storico?.length >= 3)
    agg(70, "neutro", en ? "In water for a while now: past 5 cm of root, moving it to soil goes worse." : "In acqua da un po': se le radici superano i 5 cm, il trapianto in terra riesce peggio.");

  const pul = p.cure.find((c) => c.chiave === "pulizia");
  if (pul && pul.mai)
    agg(60, "attesa", en ? "You have never cleaned the leaves: dust cuts photosynthesis more than you would think." : "Le foglie non le hai mai pulite: la polvere riduce la fotosintesi più di quanto sembri.");

  if (stagione === "riposo")
    agg(50, "neutro", en ? "Dormant season: it drinks less and feeding is paused until March." : "Siamo in riposo: beve meno e il concime è sospeso fino a marzo.");
  if (stagione === "ripresa")
    agg(48, "buono", en ? "Waking up: feed at half strength, and a good window for repotting." : "Stagione di ripresa: concime a mezza dose e finestra buona per il rinvaso.");

  if (p.perdite?.length) {
    const g30 = (t) => p.perdite.filter((x) => x.tipo === t && giorniDa(x.data) <= 30).length;
    const perse90 = p.perdite.filter((x) => giorniDa(x.data) <= 90).length;
    const nuove90 = (p.foglie || []).filter((f) => giorniDa(f) <= 90).length;
    if (perse90 > nuove90 && perse90 >= 3)
      agg(88, "male", en ? `${perse90} leaves lost in three months against ${nuove90} new: open its card, there's a hypothesis waiting.`
                         : `${perse90} foglie perse in tre mesi contro ${nuove90} nuove: apri la scheda, c'è un'ipotesi che ti aspetta.`);
    else if (g30("gialla") >= 2)
      agg(76, "attesa", en ? `${g30("gialla")} leaves yellowed this month: check the soil before watering again.`
                           : `${g30("gialla")} foglie ingiallite questo mese: tocca il terriccio prima di riannaffiare.`);
    else if (g30("secca") >= 2)
      agg(74, "attesa", en ? `${g30("secca")} leaves dried this month: it's usually dry air or limescale, not thirst.`
                           : `${g30("secca")} foglie secche questo mese: di solito è aria secca o calcare, non sete.`);
  }

  if (p.altezzaPalo && p.altezzaPianta && Number(p.altezzaPianta) >= Number(p.altezzaPalo) * 0.88)
    agg(72, "attesa", en ? `It has nearly reached the top of the pole (${p.altezzaPianta} of ${p.altezzaPalo} cm): extend it or it will have to trail.` : `È arrivata quasi in cima al palo (${p.altezzaPianta} su ${p.altezzaPalo} cm): prolungalo o dovrà ricadere.`);

  if (p.sostegno === "palo-cocco" && p.restanti <= 0)
    agg(66, "neutro", en ? "When you water it, wet the pole too: that is what makes the leaves big." : "Quando la annaffi bagna anche il palo: è quello che fa venire le foglie grandi.");

  if (p.cresc?.prossima !== null && p.cresc?.prossima !== undefined && p.cresc.ogni) {
    const g = p.cresc.prossima, f = p.cresc.finestra || 3;
    const fiducia = p.cresc.sicurezza >= 3 ? "" : en ? " (estimate still rough)" : " (stima ancora incerta)";
    if (g > 0 && g <= f + 3)
      agg(46, "buono", en ? `A new leaf should appear within ${g + f} days${fiducia}.` : `Dovrebbe spuntare una foglia nuova entro ${g + f} giorni${fiducia}.`);
    else if (g <= 0 && g > -f * 2)
      agg(47, "buono", en ? `A new leaf is due about now: look at the centre${fiducia}.` : `Una foglia nuova è attesa in questi giorni: guardala al centro${fiducia}.`);
  }

  if (ultimaFoglia !== null && ultimaFoglia <= 7)
    agg(45, "buono", ultimaFoglia === 0 ? "Foglia nuova oggi." : `Foglia nuova ${ultimaFoglia} ${ultimaFoglia === 1 ? "giorno" : "giorni"} fa: sta lavorando.`);

  if (p.cresc?.recenti >= 3)
    agg(42, "buono", en ? `${p.cresc.recenti} leaves in three months: this is its good spell.` : `${p.cresc.recenti} foglie in tre mesi: è il suo periodo buono.`);

  if (p.ritmo && Math.abs(p.ritmo - p.giorni) <= 1 && p.storico?.length >= 4)
    agg(38, "buono", en ? "You water it on a very steady rhythm, keep it up." : "La annaffi con un ritmo molto regolare, continua così.");

  if (p.storico?.[0] && giorniDa(p.storico[0]) === 0)
    agg(35, "buono", en ? "Watered today." : "Annaffiata oggi.");

  if (!p.foglie?.length)
    agg(20, "attesa", en ? "No leaves recorded yet: counting them is the simplest way to notice a slowdown." : "Nessuna foglia ancora segnata: contarle è il modo più semplice per accorgersi se rallenta.");

  agg(1, "neutro", daAzione !== null && daAzione < 7 ? (en ? "Nothing to do, it is fine." : "Niente da fare, è a posto.") : (en ? "All quiet here." : "Tutto tranquillo da queste parti."));

  return m.sort((a, b) => b.pri - a.pri);
};

function Glifo({ nome }) {
  const c = { viewBox: "0 0 24 24", width: "100%", height: "100%", fill: "none",
    stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (nome) {
    case "goccia": return <svg {...c}><path d="M12 3c3.5 4.5 5.5 7.4 5.5 10.2a5.5 5.5 0 11-11 0C6.5 10.4 8.5 7.5 12 3z" /></svg>;
    case "gocce": return <svg {...c}><path d="M8 3c2.4 3.2 3.8 5.2 3.8 7.1a3.8 3.8 0 11-7.6 0C4.2 8.2 5.6 6.2 8 3z" /><path d="M16.5 11c1.9 2.6 3 4.2 3 5.7a3 3 0 11-6 0c0-1.5 1.1-3.1 3-5.7z" /></svg>;
    case "orologio": return <svg {...c}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.2 2" /></svg>;
    case "foglia": return <svg {...c}><path d="M20 4c0 8.8-4.4 13.5-11 13.5H5C5 9.4 10 4 20 4z" /><path d="M4.5 20c2-4.5 5-7.5 9-9.5" /></svg>;
    case "germoglio": return <svg {...c}><path d="M12 21v-7" /><path d="M12 14c-4.5 0-6.5-2.5-6.5-6.5 4 0 6.5 2 6.5 6.5z" /><path d="M12 14c4 0 6-2.2 6-5.8-3.6 0-6 1.8-6 5.8z" /></svg>;
    case "serra": return <svg {...c}><path d="M3 20V10l9-6 9 6v10" /><path d="M12 4.5V20M3 12h18M3 16h18" /></svg>;
    case "giungla": return <svg {...c}><path d="M12 21c0-7 3-11 8-12-1 7-4 10-8 12z" /><path d="M12 21c0-6-2.5-9.5-7-10.5.8 6 3.5 8.8 7 10.5z" /><path d="M12 12c0-4 1.5-6.5 4-8-.5 4-2 6.4-4 8z" /></svg>;
    case "cuore": return <svg {...c}><path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0112 8a4.4 4.4 0 017.5 2.4c0 5-7.5 9.6-7.5 9.6z" /></svg>;
    case "scintilla": return <svg {...c}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></svg>;
    case "bottiglia": return <svg {...c}><path d="M10 3h4v3.2l2.5 3.4V20a1 1 0 01-1 1h-7a1 1 0 01-1-1V9.6L10 6.2z" /><path d="M7.5 13.5h9" /></svg>;
    case "vaso": return <svg {...c}><path d="M5 9h14l-1.5 11h-11z" /><path d="M4 6.5h16v2.5H4z" /><path d="M12 6.5C12 3.5 14 2 16.5 2c0 3-2 4.5-4.5 4.5z" /></svg>;
    case "vasi": return <svg {...c}><path d="M3 11h7l-1 9H4z" /><path d="M2.4 9h8.2v2H2.4z" /><path d="M14 8h7l-1 12h-5z" /><path d="M13.4 6h8.2v2h-8.2z" /></svg>;
    case "casa": return <svg {...c}><path d="M4 10.5L12 4l8 6.5V20H4z" /><path d="M9.5 20v-6h5v6" /></svg>;
    case "etichetta": return <svg {...c}><path d="M3.5 11.5l8-8H20v8.5l-8 8z" /><circle cx="16" cy="8" r="1.4" /></svg>;
    case "barattolo": return <svg {...c}><path d="M7 9h10v9a3 3 0 01-3 3h-4a3 3 0 01-3-3z" /><path d="M7 13h10" /><path d="M12 9V5c0-1.5 1.5-2.5 3.5-2.5" /></svg>;
    case "mappa": return <svg {...c}><path d="M3 6.5l6-2.5 6 2.5 6-2.5v13l-6 2.5-6-2.5-6 2.5z" /><path d="M9 4v13M15 6.5v13" /></svg>;
    case "griglia": return <svg {...c}><rect x="3.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.4" /><path d="M14 17l2.2 2.2L20.5 15" /></svg>;
    case "luna": return <svg {...c}><path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" /></svg>;
    case "disco": return <svg {...c}><path d="M4 5.5A1.5 1.5 0 015.5 4h10L20 8.5v10A1.5 1.5 0 0118.5 20h-13A1.5 1.5 0 014 18.5z" /><path d="M8 4v5h6V4M8 20v-6h8v6" /></svg>;
    case "monstera": return <svg {...c}><path d="M12 21v-7" /><path d="M12 14c-5 0-8-3.6-8-8.5C10 5.5 12 9 12 14z" /><path d="M12 14c5 0 8-3.6 8-8.5C14 5.5 12 9 12 14z" /><path d="M6.5 7.5h3M14.5 7.5h3M8.5 10.5h2M13.5 10.5h2" /></svg>;
    case "alocasia": return <svg {...c}><path d="M12 21v-8" /><path d="M12 13c-4 0-6-3.5-6-7 0-2 3-4 6-4s6 2 6 4c0 3.5-2 7-6 7z" /><path d="M12 3v10M12 6.5l-3.5 2M12 6.5l3.5 2" /></svg>;
    case "cuorefoglia": return <svg {...c}><path d="M12 20V13" /><path d="M12 13c-5.5 0-8-3-8-6.5C4 4 7 3 12 3s8 1 8 3.5C20 10 17.5 13 12 13z" /><path d="M12 4v9" /></svg>;
    case "sansevieria": return <svg {...c}><path d="M12 21c-1.5-5-1.5-12 0-18 1.5 6 1.5 13 0 18z" /><path d="M7 21c-1-4-.5-9 1-13" /><path d="M17 21c1-4 .5-9-1-13" /></svg>;
    case "maranta": return <svg {...c}><ellipse cx="12" cy="12" rx="8.5" ry="5.5" /><path d="M3.5 12h17" /><path d="M8 9.5l2 2.5-2 2.5M13 9.5l2 2.5-2 2.5" /></svg>;
    case "corona": return <svg {...c}><path d="M4 17l-1.5-9 5 3.5L12 4l4.5 7.5 5-3.5L20 17z" /><path d="M4 20h16" /></svg>;
    case "radici": return <svg {...c}><path d="M12 3v9" /><path d="M12 12c-2.5 1.5-3.5 4-3.5 8M12 12c2.5 1.5 3.5 4 3.5 8M12 12v9" /><path d="M9 6.5L12 8l3-1.5" /></svg>;
    case "calendario": return <svg {...c}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
    case "stella": return <svg {...c}><path d="M12 3l2.7 6.1 6.3.6-4.8 4.3 1.4 6.4L12 17.1 6.4 20.4l1.4-6.4L3 9.7l6.3-.6z" /></svg>;
    case "spunta": return <svg {...c}><circle cx="12" cy="12" r="8.5" /><path d="M8 12.3l2.8 2.8L16.2 9.5" /></svg>;
    case "bussola": return <svg {...c}><circle cx="12" cy="12" r="8.5" /><path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z" /></svg>;
    case "annega": return <svg {...c}><path d="M12 2.5c3.5 4.5 5.5 7.4 5.5 10.2a5.5 5.5 0 11-11 0C6.5 9.9 8.5 7 12 2.5z" /><path d="M3 20.5c1.6-1.2 3.2-1.2 4.8 0s3.2 1.2 4.8 0 3.2-1.2 4.8 0 2.2 1.1 2.6 1.1" /></svg>;
    case "assetata": return <svg {...c}><path d="M12 2.5c3.5 4.5 5.5 7.4 5.5 10.2a5.5 5.5 0 11-11 0" strokeDasharray="3 3" /><path d="M4 4l16 16" /></svg>;
    case "insetto": return <svg {...c}><ellipse cx="12" cy="13.5" rx="5" ry="7" /><path d="M12 6.5V4M9.7 5.2L8.4 3.4M14.3 5.2l1.3-1.8" /><path d="M7 10.5L3.5 9M7 14H3.5M7 17.5L3.8 19.4M17 10.5L20.5 9M17 14h3.5M17 17.5l3.2 1.9" /><path d="M7.2 13.5h9.6" /></svg>;
    case "fungo": return <svg {...c}><path d="M3.5 11.5a8.5 6.5 0 0117 0z" /><path d="M9.5 11.5v5a2.5 2.5 0 005 0v-5" /><circle cx="8.5" cy="8.5" r="1" /><circle cx="14.5" cy="7.8" r="1.2" /></svg>;
    case "sole": return <svg {...c}><circle cx="12" cy="12" r="4.4" /><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" /></svg>;
    case "vapore": return <svg {...c}><path d="M6 20.5c0-2 1.2-2.5 1.2-4.5S6 13.5 6 11.5M12 20.5c0-2 1.2-2.5 1.2-4.5S12 13.5 12 11.5M18 20.5c0-2 1.2-2.5 1.2-4.5S18 13.5 18 11.5" /><path d="M4.5 7.5c1.5-3 5-4.5 7.5-4.5s6 1.5 7.5 4.5" /></svg>;
    case "sale": return <svg {...c}><path d="M8 3h8l1.5 5.5H6.5z" /><path d="M6.5 8.5h11l1 12h-13z" /><path d="M10 13l.01 0M14 13l.01 0M12 16l.01 0" strokeWidth="2.2" /></svg>;
    case "lucchetto": return <svg {...c}><rect x="4.5" y="10.5" width="15" height="10" rx="2.2" /><path d="M8 10.5V7.8a4 4 0 018 0v2.7" /></svg>;
    default: return <svg {...c}><circle cx="12" cy="12" r="8.5" /></svg>;
  }
}

const DISTINTIVI = [
  { id: "prime", ic: "goccia", t: "Prime gocce", d: "La prima annaffiatura registrata", m: 1, v: (x) => x.acqua },
  { id: "mano", ic: "goccia", t: "Mano ferma", d: "Venticinque annaffiature", m: 25, v: (x) => x.acqua },
  { id: "costante", ic: "gocce", t: "Costanza", d: "Cento annaffiature", m: 100, v: (x) => x.acqua },
  { id: "veterano", ic: "gocce", t: "Veterano", d: "Trecento annaffiature", m: 300, v: (x) => x.acqua },
  { id: "puntuale", ic: "orologio", t: "Orologio", d: "Cinque piante annaffiate col ritmo previsto", m: 5, v: (x) => x.puntuali },
  { id: "svizzero", ic: "orologio", t: "Precisione svizzera", d: "Dieci piante annaffiate col ritmo previsto", m: 10, v: (x) => x.puntuali },

  { id: "pollice", ic: "foglia", t: "Pollice verde", d: "Dieci foglie nuove annotate", m: 10, v: (x) => x.foglie },
  { id: "serra", ic: "serra", t: "Serra in casa", d: "Quaranta foglie nuove", m: 40, v: (x) => x.foglie },
  { id: "giungla", ic: "giungla", t: "Giungla", d: "Centocinquanta foglie nuove", m: 150, v: (x) => x.foglie },
  { id: "primavera", ic: "germoglio", t: "Primavera", d: "Dieci foglie nuove in tre mesi", m: 10, v: (x) => x.foglie90 },

  { id: "medico", ic: "cuore", t: "Pronto soccorso", d: "Nessuna pianta segnata come sofferente", m: 1, v: (x) => (x.piante > 0 && x.sofferenti === 0 ? 1 : 0) },
  { id: "rianima", ic: "cuore", t: "Rianimatore", d: "Una pianta è passata da sofferente a in forma", m: 1, v: (x) => x.riprese },
  { id: "rianima3", ic: "cuore", t: "Mani sante", d: "Tre piante rimesse in sesto", m: 3, v: (x) => x.riprese },
  { id: "lucide", ic: "scintilla", t: "Foglie lucide", d: "Dieci pulizie delle foglie", m: 10, v: (x) => x.pulizie },
  { id: "nutre", ic: "bottiglia", t: "Nutrizionista", d: "Dieci concimazioni", m: 10, v: (x) => x.concimi },
  { id: "rinvasa", ic: "vaso", t: "Mani sporche", d: "Tre rinvasi registrati", m: 3, v: (x) => x.rinvasi },

  { id: "collezione", ic: "vasi", t: "Collezionista", d: "Venti piante seguite", m: 20, v: (x) => x.piante },
  { id: "casa", ic: "casa", t: "Casa piena", d: "Trenta piante seguite", m: 30, v: (x) => x.piante },
  { id: "botanico", ic: "etichetta", t: "Botanico", d: "Quindici specie diverse", m: 15, v: (x) => x.specie },
  { id: "propaga", ic: "barattolo", t: "Propagatore", d: "Tre piante in acqua insieme", m: 3, v: (x) => x.inAcqua },
  { id: "stanze", ic: "mappa", t: "Padrone di casa", d: "Piante in quattro stanze diverse", m: 4, v: (x) => x.stanzeUsate },
  { id: "ordinato", ic: "griglia", t: "Tutto a posto", d: "Ogni pianta ha la sua stanza assegnata", m: 1, v: (x) => (x.piante > 0 && x.senzaStanza === 0 ? 1 : 0) },

  { id: "stagioni", ic: "luna", t: "Due stagioni", d: "Aver usato la modalità riposo", m: 1, v: (x) => x.riposoUsato },
  { id: "archivio", ic: "disco", t: "Archivista", d: "Aver salvato una copia dei dati", m: 1, v: (x) => x.copiaFatta },

  { id: "fenestra", ic: "monstera", t: "Fenestrata", g: "piante", d: "Una foglia nuova sulla Monstera deliciosa", m: 1, v: (x) => x.fDeliciosa },
  { id: "risorta", ic: "alocasia", t: "Ritorno dal buio", g: "piante", d: "Una foglia nuova su un'Alocasia", m: 1, v: (x) => x.fAlocasia },
  { id: "velluto", ic: "cuorefoglia", t: "Questione di velluto", g: "piante", d: "Una foglia nuova sull'Anthurium regale", m: 1, v: (x) => x.fRegale },
  { id: "sansa", ic: "sansevieria", t: "Anche i sassi crescono", g: "piante", d: "Una foglia nuova su una Sansevieria", m: 1, v: (x) => x.fSansevieria },
  { id: "marante", ic: "maranta", t: "Preghiera esaudita", g: "piante", d: "Cinque foglie nuove sulle Marantacee", m: 5, v: (x) => x.fMarantacee },

  { id: "regina", ic: "corona", t: "La regina", g: "piante", segreto: true, d: "Una foglia nuova sull'Anthurium warocqueanum: la più lenta che hai", m: 1, v: (x) => x.fWaro },
  { id: "radici", ic: "radici", t: "Prima terra", segreto: true, d: "Una talea cresciuta in acqua è passata al vaso", m: 1, v: (x) => x.invasate },
  { id: "maratona", ic: "gocce", t: "Cinque in un colpo", segreto: true, d: "Cinque piante annaffiate nello stesso giorno", m: 1, v: (x) => (x.maxGiornoAcqua >= 5 ? 1 : 0) },
  { id: "completo", ic: "stella", t: "Giornata piena", segreto: true, d: "Acqua, concime, una cura e una foglia nuova nello stesso giorno", m: 1, v: (x) => x.giornoCompleto },
  { id: "tripletta", ic: "giungla", t: "Tripletta", segreto: true, d: "Tre foglie nuove nello stesso giorno", m: 1, v: (x) => (x.maxFoglieGiorno >= 3 ? 1 : 0) },
  { id: "fedele", ic: "calendario", t: "Sei mesi insieme", segreto: true, d: "Sei mesi dalla prima registrazione", m: 1, v: (x) => (x.eta >= 180 ? 1 : 0) },
  { id: "anno", ic: "calendario", t: "Un anno verde", segreto: true, d: "Un anno intero di registrazioni", m: 1, v: (x) => (x.eta >= 365 ? 1 : 0) },
  { id: "vecchia", ic: "barattolo", t: "Vecchia amica", segreto: true, d: "Cinquanta annaffiature sulla stessa pianta", m: 1, v: (x) => (x.maxStorico >= 50 ? 1 : 0) },
  { id: "inverno", ic: "luna", t: "Passato l'inverno", segreto: true, d: "Registrazioni sia a dicembre che a marzo: hai attraversato la stagione difficile", m: 1, v: (x) => x.inverno },
  { id: "primavera2", ic: "vaso", t: "Rinvaso puntuale", segreto: true, d: "Un rinvaso fatto tra marzo e maggio, il periodo ideale", m: 1, v: (x) => x.rinvasoGiusto },
  { id: "buio", ic: "luna", t: "Notte e giorno", segreto: true, d: "Aver provato sia il tema chiaro che quello scuro", m: 2, v: (x) => x.temiProvati },
  { id: "quattro", ic: "vasi", t: "Quattro in una", segreto: true, d: "Più piante nello stesso vaso, contate come una", m: 1, v: (x) => x.fSedum > 0 || x.haSedum },
  { id: "zero", ic: "spunta", t: "Nessuno indietro", segreto: true, d: "Almeno dieci piante e nemmeno una in ritardo", m: 1, v: (x) => (x.piante >= 10 && x.inRitardo === 0 ? 1 : 0) },
  { id: "grassa", ic: "germoglio", g: "piante", t: "Rosette al sole", d: "Una foglia nuova su una succulenta", m: 1, v: (x) => x.fSedum },
  { id: "epifita", ic: "foglia", g: "piante", t: "Sui tronchi", d: "Una foglia nuova sulla felce blu", m: 1, v: (x) => x.fBlu },
  { id: "aperto", ic: "casa", t: "Anche fuori", d: "Una pianta che vive sul balcone", m: 1, v: (x) => x.balcone },
  { id: "erbario", ic: "etichetta", t: "Erbario", d: "Venti specie diverse", m: 20, v: (x) => x.specie },
  { id: "pienoregime", ic: "cuore", t: "Pieno regime", d: "Dodici piante in forma nello stesso momento", m: 12, v: (x) => x.forti },
  { id: "cinque", ic: "mappa", t: "Casa verde", d: "Piante in cinque stanze diverse", m: 5, v: (x) => x.stanzeUsate },
  { id: "acqua500", ic: "gocce", t: "Cinquecento volte", d: "Cinquecento annaffiature registrate", m: 500, v: (x) => x.acqua },
  { id: "acqua1000", ic: "gocce", t: "Mille", d: "Mille annaffiature registrate", m: 1000, v: (x) => x.acqua },
  { id: "foglie300", ic: "giungla", t: "Trecento foglie", d: "Trecento foglie nuove annotate", m: 300, v: (x) => x.foglie },
  { id: "specie25", ic: "etichetta", t: "Venticinque specie", d: "Venticinque specie diverse in casa", m: 25, v: (x) => x.specie },
  { id: "specie30", ic: "etichetta", t: "Orto botanico", d: "Trenta specie diverse", m: 30, v: (x) => x.specie },
  { id: "piante40", ic: "vasi", t: "Quaranta vasi", d: "Quaranta piante seguite insieme", m: 40, v: (x) => x.piante },
  { id: "pulizie30", ic: "scintilla", t: "Foglie sempre pulite", d: "Trenta pulizie registrate", m: 30, v: (x) => x.pulizie },
  { id: "concimi30", ic: "bottiglia", t: "Dispensa", d: "Trenta concimazioni", m: 30, v: (x) => x.concimi },
  { id: "cure50", ic: "cuore", t: "Cinquanta cure", d: "Cinquanta trattamenti registrati", m: 50, v: (x) => x.trattamenti },
  { id: "cure150", ic: "cuore", t: "Centocinquanta cure", d: "Centocinquanta trattamenti registrati", m: 150, v: (x) => x.trattamenti },
  { id: "rinvasi5", ic: "vaso", t: "Cinque rinvasi", d: "Cinque piante rinvasate almeno una volta", m: 5, v: (x) => x.rinvasi },
  { id: "rinvasi10", ic: "vaso", t: "Rinvasatore seriale", d: "Dieci piante rinvasate", m: 10, v: (x) => x.rinvasi },
  { id: "puntuali15", ic: "orologio", t: "Quindici a tempo", d: "Quindici piante col ritmo previsto", m: 15, v: (x) => x.puntuali },
  { id: "cresc20", ic: "germoglio", t: "Stagione generosa", d: "Venti foglie nuove in tre mesi", m: 20, v: (x) => x.foglie90 },
  { id: "cresc40", ic: "giungla", t: "Esplosione", d: "Quaranta foglie nuove in tre mesi", m: 40, v: (x) => x.foglie90 },
  { id: "eta30", ic: "calendario", t: "Primo mese", d: "Un mese di registrazioni", m: 1, v: (x) => (x.eta >= 30 ? 1 : 0) },
  { id: "eta90", ic: "calendario", t: "Tre mesi", d: "Tre mesi di storia alle spalle", m: 1, v: (x) => (x.eta >= 90 ? 1 : 0) },
  { id: "eta730", ic: "calendario", t: "Due anni", d: "Due anni di registrazioni continue", m: 1, v: (x) => (x.eta >= 730 ? 1 : 0) },
  { id: "rotazioni", ic: "bussola", t: "Sempre dritte", d: "Venti quarti di giro registrati", m: 20, v: (x) => x.rotazioni },
  { id: "legature", ic: "radici", t: "Guidate su", d: "Dieci legature ai sostegni", m: 10, v: (x) => x.legature },

  { id: "famiglie5", ic: "etichetta", t: "Cinque famiglie", d: "Cinque famiglie botaniche diverse", m: 5, v: (x) => x.famiglie },
  { id: "famiglie8", ic: "etichetta", t: "Otto famiglie", d: "Otto famiglie botaniche diverse", m: 8, v: (x) => x.famiglie },
  { id: "aroidee", ic: "monstera", t: "Aroidofilo", d: "Dieci Araceae in casa", m: 10, v: (x) => x.aroidee },
  { id: "marantacee", ic: "maranta", t: "Piante che pregano", d: "Tre Marantaceae insieme", m: 3, v: (x) => x.marantacee },
  { id: "duefelci", ic: "foglia", t: "Due felci", d: "Due felci diverse", m: 2, v: (x) => x.felci },
  { id: "grasse3", ic: "germoglio", t: "Un po' di deserto", d: "Tre piante grasse o succulente", m: 3, v: (x) => x.grasse },
  { id: "acquacoltura", ic: "barattolo", t: "Vasi di vetro", d: "Cinque piante in acqua insieme", m: 5, v: (x) => x.inAcqua },
  { id: "datearrivo", ic: "calendario", t: "Anagrafe", d: "Ogni pianta ha la sua data di arrivo", m: 1, v: (x) => (x.piante > 0 && x.senzaArrivo === 0 ? 1 : 0) },
  { id: "vasimisura", ic: "vaso", t: "Tutto misurato", d: "Ogni pianta ha la misura del vaso", m: 1, v: (x) => (x.piante > 0 && x.senzaVaso === 0 ? 1 : 0) },
  { id: "sostegni", ic: "radici", t: "Chi sale sale", d: "Cinque piante con un sostegno", m: 5, v: (x) => x.conSostegno },
  { id: "traslochi", ic: "mappa", t: "Trasloco", d: "Una pianta spostata di stanza", m: 1, v: (x) => x.traslochi },
  { id: "traslochi5", ic: "mappa", t: "Sempre in movimento", d: "Cinque spostamenti di stanza registrati", m: 5, v: (x) => x.traslochi },

  { id: "unadieci", ic: "foglia", t: "Dieci su una", d: "Una sola pianta con dieci foglie annotate", m: 10, v: (x) => x.maxFoglie },
  { id: "unaventi", ic: "giungla", t: "Venti su una", d: "Una sola pianta con venti foglie annotate", m: 20, v: (x) => x.maxFoglie },
  { id: "trecinque", ic: "vasi", t: "Tre in forma", d: "Tre piante con almeno cinque foglie ciascuna", m: 3, v: (x) => x.treCinque },
  { id: "matura", ic: "serra", t: "Adulta", d: "Una pianta segnata come matura", m: 1, v: (x) => x.mature },
  { id: "mature5", ic: "giungla", t: "Cinque adulte", d: "Cinque piante mature", m: 5, v: (x) => x.mature },
  { id: "polly", ic: "alocasia", g: "piante", t: "Vetrata", d: "Una foglia nuova sulla Polly", m: 1, v: (x) => x.fPolly },
  { id: "fittonia", ic: "maranta", g: "piante", t: "Merletto nuovo", d: "Una foglia nuova sulla fittonia", m: 1, v: (x) => x.fFittonia },
  { id: "phlebo", ic: "foglia", g: "piante", t: "Sui tronchi, davvero", d: "Tre foglie nuove sulla felce blu", m: 3, v: (x) => x.fBlu },
  { id: "peperomia", ic: "germoglio", g: "piante", t: "Parente del pepe", d: "Una foglia nuova su una peperomia", m: 1, v: (x) => x.fPeperomia },
  { id: "pothos", ic: "foglia", g: "piante", t: "Da Moorea", d: "Cinque foglie nuove su un pothos", m: 5, v: (x) => x.fPothos },

  { id: "nomeio", ic: "spunta", t: "Presentazioni", d: "Hai messo il tuo nome nel profilo", m: 1, v: (x) => x.haNome },
  { id: "fotoio", ic: "scintilla", t: "Con la tua faccia", d: "Hai messo una foto nel profilo", m: 1, v: (x) => x.haFoto },
  { id: "libretto", ic: "disco", t: "Parto tranquillo", d: "Hai generato il libretto per chi annaffia", m: 1, v: (x) => x.libFatto },
  { id: "diagnosi", ic: "bussola", t: "Dottore", d: "Hai usato la diagnosi guidata", m: 1, v: (x) => x.diagFatta },
  { id: "cercato", ic: "bussola", t: "Cercatore", d: "Hai usato la ricerca", m: 1, v: (x) => x.ricFatta },
  { id: "griglia", ic: "griglia", t: "Vista d'insieme", d: "Hai provato la modalità griglia", m: 1, v: (x) => x.grigliaProvata },
  { id: "quattrostagioni", ic: "luna", t: "Quattro stagioni", d: "Hai usato tutte e quattro le fasi dell'anno", m: 4, v: (x) => x.stagioniProvate },
  { id: "archiviata", ic: "disco", t: "Se ne è andata", d: "Hai archiviato una pianta invece di cancellarla", m: 1, v: (x) => x.archiviate },
  { id: "archiviate5", ic: "disco", t: "Memoria lunga", d: "Cinque piante nell'archivio", m: 5, v: (x) => x.archiviate },

  { id: "gigante", ic: "serra", segreto: true, t: "Fuori scala", d: "Una pianta arrivata in cima al proprio sostegno", m: 1, v: (x) => x.inCima },
  { id: "neemfinito", ic: "insetto", segreto: true, t: "Battaglia vinta", d: "Un ciclo di neem portato a termine per intero", m: 1, v: (x) => x.neemCompletati },
  { id: "neemtre", ic: "insetto", segreto: true, t: "Tre battaglie", d: "Tre cicli di neem completati", m: 3, v: (x) => x.neemCompletati },
  { id: "rinascita", ic: "cuore", segreto: true, t: "Rinascita", d: "Una foglia nuova su una pianta segnata come sofferente", m: 1, v: (x) => x.fogliaInCura },
  { id: "dieciazioni", ic: "stella", segreto: true, t: "Giornata campale", d: "Dieci registrazioni in un solo giorno", m: 1, v: (x) => (x.maxGiornoTotale >= 10 ? 1 : 0) },
  { id: "mesepieno", ic: "calendario", segreto: true, t: "Mese pieno", d: "Almeno una registrazione in venti giorni diversi dello stesso mese", m: 1, v: (x) => x.meseFitto },
  { id: "settimane", ic: "spunta", segreto: true, t: "Otto settimane", d: "Otto settimane di fila con almeno una cura", m: 8, v: (x) => x.settimaneFila },
  { id: "nessunritardo20", ic: "spunta", segreto: true, t: "Venti pronte", d: "Venti piante e nemmeno una in ritardo", m: 1, v: (x) => (x.piante >= 20 && x.inRitardo === 0 ? 1 : 0) },
  { id: "tuttenote", ic: "etichetta", segreto: true, t: "Ognuna la sua storia", d: "Ogni pianta ha una nota scritta", m: 1, v: (x) => (x.piante > 0 && x.senzaNota === 0 ? 1 : 0) },
  { id: "tuttasalute", ic: "cuore", segreto: true, t: "Tutte in forma", d: "Ogni pianta segnata come in forma", m: 1, v: (x) => (x.piante > 0 && x.forti === x.piante ? 1 : 0) },
  { id: "veterana", ic: "calendario", segreto: true, t: "La più fedele", d: "Una pianta con te da più di tre anni", m: 1, v: (x) => x.piuVecchia },
  { id: "sedici", ic: "vasi", segreto: true, t: "Sedici in una stanza", d: "Sedici piante nella stessa stanza", m: 16, v: (x) => x.maxPerStanza },
  { id: "acquapura", ic: "goccia", segreto: true, t: "Solo acqua buona", d: "Otto piante che ricevono acqua demineralizzata o riposata", m: 8, v: (x) => x.acquaDelicata },
  { id: "notturno", ic: "luna", segreto: true, t: "Le due stagioni estreme", d: "Aver usato sia la piena estate che il pieno riposo", m: 2, v: (x) => x.estremi },
  { id: "collezionetotale", ic: "corona", segreto: true, t: "Il grande giardino", d: "Cinquanta piante seguite insieme", m: 50, v: (x) => x.piante },
  { id: "curioso", ic: "bussola", t: "Esploratore", segreto: true, d: "Aver visitato Storico, Terricci e il profilo", m: 3, v: (x) => x.esplorate },
];

const NOTE_MESE = [
  "Il mese più buio dell'anno: acqua ridotta al minimo, niente concime, e occhio all'aria secca dei termosifoni.",
  "La luce comincia a tornare ma le piante dormono ancora. Buon momento per procurarti corteccia, perlite e vasi in vista di marzo.",
  "Riparte tutto: è il mese dei rinvasi e del ritorno al concime, meglio a metà dose per le prime due volte. Rimetti la stagione su crescita.",
  "Crescita piena. Le prime foglie nuove arrivano adesso: segnale che gli intervalli invernali vanno accorciati.",
  "Il mese di massimo vigore, il migliore per talee e propagazioni. Tutto quello che tagli adesso radica in fretta.",
  "Col caldo i consumi d'acqua salgono. Attenzione al sole diretto attraverso i vetri, che scotta le foglie in poche ore.",
  "Mese critico: caldo secco e ragnetto rosso. Controlla il rovescio delle foglie più spesso del solito.",
  "Se parti, raggruppa le assetate in bagno e lascia stare le grasse. Al rientro, controllo parassiti su tutto.",
  "Ultimo concime pieno dell'anno e ultima finestra utile per un rinvaso leggero: dopo, le radici non fanno in tempo a riprendersi.",
  "Si rallenta: passa la stagione a riposo. I termosifoni che si accendono asciugano l'aria di colpo, più del terriccio.",
  "Poca luce e crescita quasi ferma. Riduci l'acqua e sospendi del tutto il concime.",
  "Minimo assoluto. Non rinvasare, non potare, non concimare: qualsiasi stress ora non viene recuperato.",
];

const MOTIVI = {
  morta: "Non ce l'ha fatta",
  regalata: "Regalata",
  ceduta: "Data via",
  altro: "Altro",
};

function vibra(intensita = "breve") {
  try {
    if (navigator.vibrate) { navigator.vibrate(intensita === "forte" ? [12, 30, 18] : 10); return; }
    const scatto = document.getElementById("scatto-tattile");
    if (scatto) { scatto.checked = !scatto.checked; scatto.dispatchEvent(new Event("change")); }
  } catch { /* niente vibrazione: pazienza */ }
}

const STAGIONI = {
  ripresa:  { t: "Ripresa", mesi: "marzo-maggio", acqua: 1.0, concime: 1.0, dose: "mezza dose le prime due volte",
              nota: "Riparte tutto: è la finestra giusta per i rinvasi e per ricominciare a concimare, ma piano." },
  piena:    { t: "Piena",   mesi: "giugno-agosto", acqua: 0.85, concime: 0.85, dose: "dose piena",
              nota: "Massimo vigore e consumi d'acqua più alti: gli intervalli si accorciano da soli." },
  rallenta: { t: "Rallentamento", mesi: "settembre-novembre", acqua: 1.3, concime: 1.6, dose: "ultima concimazione a settembre",
              nota: "La luce cala e la crescita frena. Si allunga fra un'annaffiatura e l'altra e si chiude col concime." },
  riposo:   { t: "Riposo",  mesi: "dicembre-febbraio", acqua: 1.75, concime: 0, dose: "niente concime",
              nota: "Le piante dormono. Acqua molto ridotta, concime sospeso e nessun intervento traumatico." },
};
const ORDINE_STAGIONI = ["ripresa", "piena", "rallenta", "riposo"];
const stagioneDelMese = (m) => (m >= 2 && m <= 4 ? "ripresa" : m >= 5 && m <= 7 ? "piena" : m >= 8 && m <= 10 ? "rallenta" : "riposo");

const SOSTEGNI = {
  nessuno:   { t: "Nessuno", nota: "" },
  "palo-cocco": { t: "Palo di cocco", nota: "Bagnalo a ogni annaffiatura: le radici aeree ci si aggrappano solo se è umido, ed è questo che fa crescere le foglie più grandi." },
  tutore:    { t: "Tutore singolo", nota: "Legature morbide e larghe: un filo stretto strozza il fusto man mano che ingrossa." },
  traliccio: { t: "Traliccio o arco", nota: "Guida i getti man mano, non tutti insieme: i tralci maturi si spezzano se piegati di colpo." },
  pensile:   { t: "Vaso pensile", nota: "Ricade invece di salire: taglia le punte ogni tanto o si spoglia alla base." },
};

const CATEGORIE = {
  troppa:  { t: "Troppa acqua", ic: "annega" },
  poca:    { t: "Poca acqua", ic: "assetata" },
  bestie:  { t: "Parassiti", ic: "insetto" },
  funghi:  { t: "Funghi", ic: "fungo" },
  concime: { t: "Concime", ic: "sale" },
  aria:    { t: "Umidità", ic: "vapore" },
  luce:    { t: "Luce", ic: "sole" },
};

const ZONE = [
  { k: "foglie", t: "Sulle foglie" },
  { k: "terra", t: "Sul terriccio" },
  { k: "base", t: "Sul fusto o alla base" },
  { k: "crescita", t: "Nella crescita" },
  { k: "bestie", t: "Vedo insetti" },
];

const SINTOMI = [
  { z: "foglie", t: "Ingialliscono", d: "Come è il terriccio adesso?",
    r: [["Bagnato o umido", ["marciume-radici"]], ["Asciutto", ["sete", "carenza"]]] },
  { z: "foglie", t: "Punte e bordi marroni e croccanti", esiti: ["punte-secche", "sali"] },
  { z: "foglie", t: "Macchie brune con alone giallo", esiti: ["macchie-fungine"] },
  { z: "foglie", t: "Macchie chiare o sbiancate", esiti: ["scottatura"] },
  { z: "foglie", t: "Patina bianca polverosa", esiti: ["oidio"] },
  { z: "foglie", t: "Aree argentate e foglie deformi", esiti: ["tripidi"] },
  { z: "foglie", t: "Afflosciate di colpo", d: "Come è il terriccio adesso?",
    r: [["Asciutto", ["sete"]], ["Bagnato", ["marciume-radici"]]] },
  { z: "foglie", t: "Arricciate verso l'interno", esiti: ["arricciate", "punte-secche"] },
  { z: "foglie", t: "Appiccicose al tatto", esiti: ["cocciniglia-bruna"] },

  { z: "terra", t: "Muffa bianca soffice in superficie", esiti: ["muffa-terriccio"] },
  { z: "terra", t: "Crosta bianca dura sul bordo", esiti: ["sali"] },
  { z: "terra", t: "Resta bagnato per giorni", esiti: ["substrato-bagnato", "marciume-radici"] },
  { z: "terra", t: "L'acqua scorre via subito", esiti: ["idrorepellente"] },
  { z: "terra", t: "Moscerini che volano via", esiti: ["sciaridi"] },

  { z: "base", t: "Base molle e scura", esiti: ["marciume-colletto"] },
  { z: "base", t: "Batuffoli bianchi cotonosi", esiti: ["cocciniglia-farinosa"] },
  { z: "base", t: "Crosticine marroni attaccate", esiti: ["cocciniglia-bruna"] },

  { z: "crescita", t: "Steli lunghi e foglie distanti", esiti: ["filatura"] },
  { z: "crescita", t: "Foglie nuove piccole e pallide", esiti: ["carenza", "filatura"] },
  { z: "crescita", t: "Ferma da mesi", d: "Da quanto non la rinvasi?",
    r: [["Più di due anni o non lo so", ["substrato-bagnato", "carenza"]], ["Di recente", ["marciume-radici", "filatura"]]] },

  { z: "bestie", t: "Ragnatele finissime e puntini mobili", esiti: ["ragnetto"] },
  { z: "bestie", t: "Batuffoli bianchi cotonosi", esiti: ["cocciniglia-farinosa"] },
  { z: "bestie", t: "Scudetti marroni immobili", esiti: ["cocciniglia-bruna"] },
  { z: "bestie", t: "Moscerini attorno al vaso", esiti: ["sciaridi"] },
  { z: "bestie", t: "Insetti minuscoli e velocissimi", esiti: ["tripidi"] },
];

const ILLUSTRAZIONI = ["deliciosa", "adansonii", "adansonii-solo", "pothos", "pothos-acqua", "alocasia", "polly",
  "anthurium-regale", "anthurium-serra", "spatifillo", "maranta", "calathea", "fittonia", "polkadot",
  "raindrop", "peperomia", "sedum", "snake", "snake-intrecciata", "spider", "palma", "felce", "felce-blu",
  "felce-montagna", "edera-acqua", "pilea-acqua", "generica"];

const EN = {
  "Oggi ti sei preso cura di parecchie.": "You've looked after quite a few today.",
  "Bel giro, oggi.": "Good round today.",
  "Le hai fatte quasi tutte, per oggi basta così.": "Nearly all done, that's enough for today.",
  "Questa settimana qualcosa si è aperto.": "Something unfurled this week.",
  "Stanno spingendo: due foglie nuove in sette giorni.": "They're pushing: two new leaves in seven days.",
  "Si vede che è la loro stagione.": "You can tell it's their season.",
  "Il mese sta andando bene, anche se questa settimana è tranquilla.": "The month is going well, even if this week is quiet.",
  "Nessuna novità oggi, ma il mese racconta un'altra storia.": "Nothing new today, but the month tells another story.",
  "Sei in pari con tutte.": "You're square with all of them.",
  "Nessuna ti sta aspettando.": "None of them is waiting on you.",
  "Tutto fatto, e senza fretta.": "All done, and unhurried.",
  "Stanno bene tutte, oggi non ti serve l'app.": "They're all fine; you don't need the app today.",
  "Giornata senza pensieri.": "A day without worries.",
  "Puoi anche solo guardarle.": "You can just look at them.",
  "Sei in orario con tutte.": "You're on time with every one.",
  "Niente di urgente all'orizzonte.": "Nothing urgent on the horizon.",
  "Una e hai finito.": "One and you're finished.",
  "Solo una ti aspetta.": "Only one is waiting.",
  "Un paio ti aspettano, niente di grave.": "A couple are waiting, nothing serious.",
  "Due o tre da sistemare, cinque minuti.": "Two or three to sort, five minutes.",
  "Qualcuna è indietro, ma nulla di serio.": "A few are behind, but nothing serious.",
  "Qualche foglia se n'è andata: capita, guarda con calma.": "A few leaves have gone: it happens, look calmly.",
  "Un po' di foglie perse questa settimana. Succede a tutti.": "Some leaves lost this week. It happens to everyone.",
  "Le altre stanno bene, concentrati su chi fatica.": "The rest are fine; focus on the ones struggling.",
  "Qualcuna è in convalescenza, il resto va da sé.": "A couple are convalescing, the rest looks after itself.",
  "Stagione lenta: fanno poco e va bene così.": "Slow season: they do little, and that's fine.",
  "Dormono. Il momento migliore per lasciarle stare.": "They're asleep. The best time to leave them be.",
  "D'inverno la cura migliore è non intervenire.": "In winter the best care is no care at all.",
  "Si stanno svegliando.": "They're waking up.",
  "È il mese in cui riparte tutto.": "This is the month everything restarts.",
  "Primavera: da qui in poi si corre.": "Spring: from here on it's fast.",
  "Col caldo bevono di più: occhio ai vasi piccoli.": "They drink more in the heat: watch the small pots.",
  "Piena estate, il momento di massimo vigore.": "High summer, the moment of peak vigour.",
  "La luce cala e loro rallentano: è normale.": "Light is fading and they're slowing: that's normal.",
  "Si va verso il riposo, senza fretta.": "Heading towards dormancy, unhurried.",
  "Ventiquattro vasi e tutto sotto controllo.": "Two dozen pots and all under control.",
  "Una piccola giungla, e la conosci a memoria.": "A small jungle, and you know it by heart.",
  "perse": "lost",
  "Bilancio delle foglie": "Leaf balance",
  "Foglie perse": "Leaves lost",
  "morte": "dead",
  "secche": "dried",
  "ingiallite": "yellowed",
  "Foglia morta": "Dead leaf",
  "Foglia secca": "Dried leaf",
  "Foglia ingiallita": "Yellowed leaf",
  "Apro l'elenco…": "Opening your plants…",
  "Sospesi": "Paused",
  "foglia": "leaf",
  "giorni tra foglie": "days between leaves",
  "adattato alla stagione di": "adjusted for the",
  "La prossima foglia è attesa tra": "The next leaf is expected in",
  "La prossima foglia era attesa": "The next leaf was expected",
  "Il mese più produttivo finora è": "The most productive month so far is",
  "il più fermo": "the slowest",
  "con": "with",
  "Come si ottiene.": "How to get it.",
  "Risolve.": "Fixes.",
  "Attenzione.": "Watch out.",
  "foglie nuove negli ultimi tre mesi su": "new leaves in the last three months across",
  "piante su": "plants of",
  "le annaffi col ritmo previsto": "you water on their planned rhythm",
  "Arrivata": "Arrived",
  "giorni fa": "days ago",
  "fa": "ago",
  "ultimo rinvaso": "last repot",
  "vaso": "pot",
  "gg": "d",
  "e": "and",
  "seguita da": "followed by",
  "e altre": "and",
  "ha rallentato rispetto al proprio ritmo": "has slowed against its own rhythm",
  "hanno rallentato rispetto al proprio ritmo": "have slowed against their own rhythm",
  "In": "In",
  "ogni pianta ha fatto in media": "each plant averaged",
  "foglie in sei mesi, contro": "leaves in six months, against",
  "Se una pianta fatica, prova a spostarla.": "If a plant struggles, try moving it.",
  "Su": "Of",
  "piante con abbastanza storia,": "plants with enough history,",
  "le annaffi con un ritmo diverso da quello previsto. La più lontana è": "you water on a different rhythm than planned. The furthest off is",
  "giorni invece di": "days instead of",
  "è passata in": "moved to",
  "il": "on",
  "foglie prima": "leaves before",
  "dopo": "after",
  "non la tocchi da": "you haven't touched it for",
  "Capita sempre a quella che sta nell'angolo.": "It's always the one in the corner.",
  "Nessuna foglia nuova segnata negli ultimi tre mesi.": "No new leaves recorded in the last three months.",
  "Piante": "Plants", "Storico": "History", "Terricci": "Soil mixes", "Acqua": "Water",
  "Problemi": "Problems", "Profilo": "Profile", "Il mio profilo": "My profile",
  "Cerca una pianta": "Search plants", "Altro": "More", "Aggiungi": "Add",
  "Oggi": "Today", "Tutte": "All", "Da seguire": "Watch", "Lascia stare": "Leave alone",
  "Pulisci": "Clear", "Cerca": "Search", "Chiudi": "Close", "Annulla": "Cancel", "Salva": "Save",
  "Modifica": "Edit", "Elimina": "Delete", "Archivia": "Archive", "Scheda": "Details", "Fatto": "Done",
  "Bene": "Nice", "Vedi tutti": "See all", "chiudi": "close", "ricomincia": "start over",
  "annulla": "undo", "nascondi": "hide", "dettagli": "details", "salta": "skip",
  "oggi": "today", "domani": "tomorrow", "Nessuna pianta": "No plants",
  "Sono tutte a posto": "Everything is fine", "Domani tocca a una": "One is due tomorrow",
  "ha sete": "is thirsty", "vuole acqua nuova": "needs fresh water",
  "piante ti aspettano": "plants are waiting", "piante": "plants", "pianta": "plant",
  "in sofferenza": "struggling", "va forte": "thriving", "in ripresa": "recovering", "da capire": "settling in",
  "stagione di": "season:", "annaffia": "water", "cambio acqua": "water change",
  "ultima": "last", "annulla annaffiatura": "undo watering", "+ foglia nuova": "+ new leaf",
  "Annaffiata": "Watered", "Acqua cambiata": "Water changed",
  "Concime": "Fertiliser", "Tonico fogliare": "Foliar tonic", "Radicante": "Rooting hormone",
  "Pulizia foglie": "Leaf cleaning", "Neem": "Neem", "Quarto di giro": "Quarter turn",
  "Rinvaso": "Repotting", "Lega i getti nuovi": "Tie in new growth",
  "sospeso": "paused", "mai dato": "never done", "da dare": "due",
  "Avvia ciclo neem": "Start neem cycle", "Neem: nessun ciclo in corso": "Neem: no cycle running",
  "Nuova pianta": "New plant", "Modifica pianta": "Edit plant", "Specie": "Species",
  "Come la chiami": "What you call it", "Ogni quanti giorni": "Every how many days",
  "Ultima volta": "Last time", "Coltivazione": "Grown in", "In terra": "In soil", "In acqua": "In water",
  "Come sta": "How it is", "Luce": "Light", "Nota": "Note", "Non specificata": "Not set",
  "Concime ogni quanti giorni": "Fertilise every how many days", "Trattamenti": "Treatments",
  "Tonico fogliare ogni settimana": "Weekly foliar tonic", "Radicante ogni 14 giorni": "Rooting hormone every 14 days",
  "Come annaffiarla": "How to water it", "Che acqua": "Which water",
  "Consiglio sul posizionamento": "Placement advice", "Substrato": "Soil mix", "Misura vaso": "Pot size",
  "Rinvaso ogni (mesi)": "Repot every (months)", "Ultimo rinvaso": "Last repot",
  "Un quarto di giro ogni settimana": "A quarter turn every week", "Arrivata in casa il": "Arrived home on",
  "Sostegno": "Support", "Nessuno": "None", "Palo di cocco": "Coir pole", "Tutore singolo": "Single stake",
  "Traliccio o arco": "Trellis or arch", "Vaso pensile": "Hanging pot",
  "Altezza sostegno (cm)": "Support height (cm)", "Altezza pianta (cm)": "Plant height (cm)",
  "Quanto è grande": "How big it is", "Giovane": "Young", "Adulta": "Adult", "Matura": "Mature",
  "Illustrazione": "Illustration", "Il tuo nome": "Your name", "Aggiungi il tuo nome": "Add your name",
  "togli foto": "remove photo", "Cambia foto": "Change photo",
  "rubinetto": "tap water", "riposata una notte": "left to stand overnight", "demineralizzata": "distilled",
  "piovana": "rainwater", "Rubinetto": "Tap water", "Riposata una notte": "Left to stand overnight",
  "Demineralizzata o piovana": "Distilled or rainwater",
  "Sole diretto": "Direct sun", "Luce brillante": "Bright light",
  "Luce indiretta brillante": "Bright indirect light", "Luce indiretta": "Indirect light",
  "Tollera la penombra": "Tolerates low light", "Qualsiasi luce": "Any light",
  "Stagione": "Season", "Aspetto": "Appearance", "Sistema": "System", "Chiaro": "Light", "Scuro": "Dark",
  "Schede": "Cards", "Compatte": "Compact", "Estese": "Expanded", "Griglia": "Grid",
  "Raggruppamento": "Grouping", "Per urgenza": "By urgency", "Per stanza": "By room",
  "Stanze": "Rooms", "Assegna le stanze": "Assign rooms", "Copia di sicurezza": "Backup",
  "Salva copia": "Save a copy", "Ripristina": "Restore", "Se parti": "When you travel",
  "Libretto per chi annaffia": "Plant sitter booklet", "Lingua": "Language", "Italiano": "Italian", "Inglese": "English",
  "Ripresa": "Waking up", "Piena": "Peak", "Rallentamento": "Slowing down", "Riposo": "Dormant",
  "marzo-maggio": "March-May", "giugno-agosto": "June-August",
  "settembre-novembre": "September-November", "dicembre-febbraio": "December-February",
  "Cosa ho imparato": "What I've learned", "Come stanno": "How they are", "Distintivi": "Badges",
  "Archivio": "Archive", "vanno forte": "thriving", "in mezzo": "in between", "soffrono": "struggling",
  "Segreto": "Secret", "Si scopre facendo qualcosa di particolare.": "Unlocked by doing something specific.",
  "segreti": "secret", "di": "of", "era segreto": "was secret",
  "Distintivo sbloccato": "Badge unlocked", "distintivi sbloccati": "badges unlocked",
  "Si comincia": "Just starting", "Pollice verde vero": "A real green thumb",
  "Ci sai fare": "You know what you're doing", "Sulla buona strada": "On the right track",
  "In rodaggio": "Warming up", "foglie": "leaves", "acqua": "water", "concime": "fertiliser", "cure": "care",
  "annaffiature": "waterings", "foglie nuove": "new leaves", "concimazioni": "fertilisings", "trattamenti": "treatments",
  "Ultime dodici settimane": "Last twelve weeks", "Quando sono arrivate le foglie": "When the leaves arrived",
  "Quando le hai annaffiate": "When you watered", "Foglie nuove per mese": "New leaves per month",
  "Previsto contro reale": "Planned vs actual", "Chi cresce di più": "Fastest growers",
  "previsto": "planned", "reale": "actual", "tonico o radicante": "tonic or rooting hormone",
  "foglia nuova": "new leaf", "Il mese scorso": "Last month",
  "Cosa vedi?": "What do you see?", "Sulle foglie": "On the leaves", "Sul terriccio": "On the soil",
  "Sul fusto o alla base": "On the stem or base", "Nella crescita": "In how it grows",
  "Vedo insetti": "I see insects", "Tutti i problemi": "All problems", "Tutti": "All",
  "Troppa acqua": "Too much water", "Poca acqua": "Too little water", "Parassiti": "Pests",
  "Funghi": "Fungi", "Umidità": "Humidity", "A cosa è soggetta": "What it's prone to",
  "Da una delle tue piante": "From one of your plants",
  "Chi è": "About it", "Famiglia": "Family", "Origine": "Origin", "Come vive": "How it lives",
  "Dove è stata": "Where it has been", "Substrato e vaso": "Soil and pot", "Cure in corso": "Care due",
  "Sei mesi": "Six months", "Con te da": "With you for", "anno": "year", "anni": "years",
  "mese": "month", "mesi": "months", "giorni": "days", "giorno": "day",
  "Annaffiature": "Waterings", "Foglie nuove": "New leaves", "Concimazioni": "Fertilisings", "Cure": "Care",
  "Ancora niente.": "Nothing yet.", "mai rinvasata": "never repotted", "Nessuna cura programmata.": "No care scheduled.",
  "Come ti sto valutando": "How I'm scoring you",
  "Perché conta": "Why it matters",
  "Cinque regole che valgono per tutte": "Five rules that apply to all",
  "La regola che salva più piante": "The rule that saves the most plants",
  "Oggi lascia stare": "Leave these alone today",
  "Parti da quello che vedi": "Start from what you see",
  "Non annaffiare": "Don't water",
  "Non concimare": "Don't fertilise",
  "Non rinvasare": "Don't repot",
  "Non bagnare le foglie": "Don't wet the leaves",
  "Non toccare la patina": "Don't touch the bloom",
  "Non interrare il rizoma": "Don't bury the rhizome",
  "Dove sta ognuna": "Where each one lives",
  "Istruzioni per chi annaffia": "Instructions for your plant sitter",
  "Stampa": "Print",
  "Giorno per giorno": "Day by day",
  "Da non toccare": "Don't touch",
  "Dove sono e come si annaffiano": "Where they are and how to water them",
  "Se qualcosa va storto": "If something goes wrong",
  "Attenzione all'acqua": "Careful with the water",
  "Tre regole che valgono per tutte": "Three rules for everything",
  "Riepilogo": "Summary",
  "Nascondi": "Hide",
  "La stanza che funziona": "The room that works",
  "I ritmi veri": "Your real rhythms",
  "Quando crescono": "When they grow",
  "Gli spostamenti": "The moves",
  "La più dimenticata": "The most neglected",
  "Il cimitero": "The graveyard",
  "Andate altrove": "Gone to a new home",
  "Prime gocce": "First drops",
  "La prima annaffiatura registrata": "Your first recorded watering",
  "Mano ferma": "Steady hand",
  "Venticinque annaffiature": "Twenty-five waterings",
  "Costanza": "Consistency",
  "Cento annaffiature": "A hundred waterings",
  "Veterano": "Veteran",
  "Trecento annaffiature": "Three hundred waterings",
  "Orologio": "Clockwork",
  "Cinque piante annaffiate col ritmo previsto": "Five plants watered on their planned rhythm",
  "Precisione svizzera": "Swiss precision",
  "Dieci piante annaffiate col ritmo previsto": "Ten plants watered on their planned rhythm",
  "Pollice verde": "Green thumb",
  "Dieci foglie nuove annotate": "Ten new leaves recorded",
  "Serra in casa": "Greenhouse at home",
  "Quaranta foglie nuove": "Forty new leaves",
  "Giungla": "Jungle",
  "Centocinquanta foglie nuove": "A hundred and fifty new leaves",
  "Primavera": "Springtime",
  "Dieci foglie nuove in tre mesi": "Ten new leaves in three months",
  "Pronto soccorso": "First aid",
  "Nessuna pianta segnata come sofferente": "No plant marked as struggling",
  "Rianimatore": "Reviver",
  "Una pianta è passata da sofferente a in forma": "A plant went from struggling to thriving",
  "Mani sante": "Healing hands",
  "Tre piante rimesse in sesto": "Three plants brought back",
  "Foglie lucide": "Shiny leaves",
  "Dieci pulizie delle foglie": "Ten leaf cleanings",
  "Nutrizionista": "Nutritionist",
  "Dieci concimazioni": "Ten feedings",
  "Mani sporche": "Dirty hands",
  "Tre rinvasi registrati": "Three repottings recorded",
  "Collezionista": "Collector",
  "Venti piante seguite": "Twenty plants tracked",
  "Casa piena": "Full house",
  "Trenta piante seguite": "Thirty plants tracked",
  "Botanico": "Botanist",
  "Quindici specie diverse": "Fifteen different species",
  "Propagatore": "Propagator",
  "Tre piante in acqua insieme": "Three plants in water at once",
  "Padrone di casa": "Householder",
  "Piante in quattro stanze diverse": "Plants in four different rooms",
  "Tutto a posto": "All in order",
  "Ogni pianta ha la sua stanza assegnata": "Every plant has a room assigned",
  "Due stagioni": "Two seasons",
  "Aver usato la modalità riposo": "You used dormant mode",
  "Archivista": "Archivist",
  "Aver salvato una copia dei dati": "You saved a backup",
  "Fenestrata": "Fenestrated",
  "Una foglia nuova sulla Monstera deliciosa": "A new leaf on the Monstera deliciosa",
  "Ritorno dal buio": "Back from the dark",
  "Una foglia nuova su un'Alocasia": "A new leaf on an Alocasia",
  "Questione di velluto": "A matter of velvet",
  "Una foglia nuova sull'Anthurium regale": "A new leaf on the Anthurium regale",
  "Anche i sassi crescono": "Even stones grow",
  "Una foglia nuova su una Sansevieria": "A new leaf on a snake plant",
  "Preghiera esaudita": "Prayer answered",
  "Cinque foglie nuove sulle Marantacee": "Five new leaves on the prayer plants",
  "Rosette al sole": "Rosettes in the sun",
  "Una foglia nuova su una succulenta": "A new leaf on a succulent",
  "Sui tronchi": "On the trunks",
  "Una foglia nuova sulla felce blu": "A new leaf on the blue fern",
  "Anche fuori": "Outdoors too",
  "Una pianta che vive sul balcone": "A plant living on the balcony",
  "Erbario": "Herbarium",
  "Venti specie diverse": "Twenty different species",
  "Pieno regime": "Full swing",
  "Dodici piante in forma nello stesso momento": "Twelve thriving plants at once",
  "Casa verde": "Green house",
  "Piante in cinque stanze diverse": "Plants in five different rooms",
  "Cinquecento volte": "Five hundred times",
  "Cinquecento annaffiature registrate": "Five hundred waterings recorded",
  "Mille": "A thousand",
  "Mille annaffiature registrate": "A thousand waterings recorded",
  "Trecento foglie": "Three hundred leaves",
  "Trecento foglie nuove annotate": "Three hundred new leaves recorded",
  "Venticinque specie": "Twenty-five species",
  "Venticinque specie diverse in casa": "Twenty-five different species at home",
  "Orto botanico": "Botanical garden",
  "Trenta specie diverse": "Thirty different species",
  "Quaranta vasi": "Forty pots",
  "Quaranta piante seguite insieme": "Forty plants tracked at once",
  "Foglie sempre pulite": "Always clean",
  "Trenta pulizie registrate": "Thirty cleanings recorded",
  "Dispensa": "Well stocked",
  "Trenta concimazioni": "Thirty feedings",
  "Cinquanta cure": "Fifty treatments",
  "Cinquanta trattamenti registrati": "Fifty treatments recorded",
  "Centocinquanta cure": "A hundred and fifty treatments",
  "Centocinquanta trattamenti registrati": "A hundred and fifty treatments recorded",
  "Cinque rinvasi": "Five repottings",
  "Cinque piante rinvasate almeno una volta": "Five plants repotted at least once",
  "Rinvasatore seriale": "Serial repotter",
  "Dieci piante rinvasate": "Ten plants repotted",
  "Quindici a tempo": "Fifteen on time",
  "Quindici piante col ritmo previsto": "Fifteen plants on their planned rhythm",
  "Stagione generosa": "Generous season",
  "Venti foglie nuove in tre mesi": "Twenty new leaves in three months",
  "Esplosione": "Explosion",
  "Quaranta foglie nuove in tre mesi": "Forty new leaves in three months",
  "Primo mese": "First month",
  "Un mese di registrazioni": "One month of records",
  "Tre mesi": "Three months",
  "Tre mesi di storia alle spalle": "Three months of history behind you",
  "Due anni": "Two years",
  "Due anni di registrazioni continue": "Two continuous years of records",
  "Sempre dritte": "Always straight",
  "Venti quarti di giro registrati": "Twenty quarter turns recorded",
  "Guidate su": "Trained up",
  "Dieci legature ai sostegni": "Ten ties to supports",
  "Cinque famiglie": "Five families",
  "Cinque famiglie botaniche diverse": "Five different botanical families",
  "Otto famiglie": "Eight families",
  "Otto famiglie botaniche diverse": "Eight different botanical families",
  "Aroidofilo": "Aroid lover",
  "Dieci Araceae in casa": "Ten Araceae at home",
  "Piante che pregano": "Praying plants",
  "Tre Marantaceae insieme": "Three Marantaceae together",
  "Due felci": "Two ferns",
  "Due felci diverse": "Two different ferns",
  "Un po' di deserto": "A bit of desert",
  "Tre piante grasse o succulente": "Three succulents",
  "Vasi di vetro": "Glass jars",
  "Cinque piante in acqua insieme": "Five plants in water at once",
  "Anagrafe": "Records office",
  "Ogni pianta ha la sua data di arrivo": "Every plant has its arrival date",
  "Tutto misurato": "All measured",
  "Ogni pianta ha la misura del vaso": "Every plant has its pot size",
  "Chi sale sale": "Climbers",
  "Cinque piante con un sostegno": "Five plants with a support",
  "Trasloco": "Moving day",
  "Una pianta spostata di stanza": "A plant moved to another room",
  "Sempre in movimento": "Always moving",
  "Cinque spostamenti di stanza registrati": "Five room moves recorded",
  "Dieci su una": "Ten on one",
  "Una sola pianta con dieci foglie annotate": "A single plant with ten leaves recorded",
  "Venti su una": "Twenty on one",
  "Una sola pianta con venti foglie annotate": "A single plant with twenty leaves recorded",
  "Tre in forma": "Three in form",
  "Tre piante con almeno cinque foglie ciascuna": "Three plants with at least five leaves each",
  "Adulta": "Grown up",
  "Una pianta segnata come matura": "A plant marked as mature",
  "Cinque adulte": "Five grown up",
  "Cinque piante mature": "Five mature plants",
  "Vetrata": "Stained glass",
  "Una foglia nuova sulla Polly": "A new leaf on the Polly",
  "Merletto nuovo": "New lace",
  "Una foglia nuova sulla fittonia": "A new leaf on the fittonia",
  "Sui tronchi, davvero": "On the trunks, really",
  "Tre foglie nuove sulla felce blu": "Three new leaves on the blue fern",
  "Parente del pepe": "Pepper's cousin",
  "Una foglia nuova su una peperomia": "A new leaf on a peperomia",
  "Da Moorea": "From Moorea",
  "Cinque foglie nuove su un pothos": "Five new leaves on a pothos",
  "Presentazioni": "Introductions",
  "Hai messo il tuo nome nel profilo": "You added your name to the profile",
  "Con la tua faccia": "With your face",
  "Hai messo una foto nel profilo": "You added a photo to the profile",
  "Parto tranquillo": "Off you go",
  "Hai generato il libretto per chi annaffia": "You generated the plant sitter booklet",
  "Dottore": "Doctor",
  "Hai usato la diagnosi guidata": "You used the guided diagnosis",
  "Cercatore": "Seeker",
  "Hai usato la ricerca": "You used the search",
  "Vista d'insieme": "Overview",
  "Hai provato la modalità griglia": "You tried grid mode",
  "Quattro stagioni": "Four seasons",
  "Hai usato tutte e quattro le fasi dell'anno": "You used all four phases of the year",
  "Se ne è andata": "It moved on",
  "Hai archiviato una pianta invece di cancellarla": "You archived a plant instead of deleting it",
  "Memoria lunga": "Long memory",
  "Cinque piante nell'archivio": "Five plants in the archive",
  "Fuori scala": "Off the scale",
  "Una pianta arrivata in cima al proprio sostegno": "A plant that reached the top of its support",
  "Battaglia vinta": "Battle won",
  "Un ciclo di neem portato a termine per intero": "A neem cycle carried through to the end",
  "Tre battaglie": "Three battles",
  "Tre cicli di neem completati": "Three neem cycles completed",
  "Rinascita": "Rebirth",
  "Una foglia nuova su una pianta segnata come sofferente": "A new leaf on a plant marked as struggling",
  "Giornata campale": "Big day",
  "Dieci registrazioni in un solo giorno": "Ten records in a single day",
  "Mese pieno": "Full month",
  "Almeno una registrazione in venti giorni diversi dello stesso mese": "At least one record on twenty different days of the same month",
  "Otto settimane": "Eight weeks",
  "Otto settimane di fila con almeno una cura": "Eight straight weeks with at least one bit of care",
  "Venti pronte": "Twenty ready",
  "Venti piante e nemmeno una in ritardo": "Twenty plants and not one overdue",
  "Ognuna la sua storia": "Each with a story",
  "Ogni pianta ha una nota scritta": "Every plant has a note written",
  "Tutte in forma": "All thriving",
  "Ogni pianta segnata come in forma": "Every plant marked as thriving",
  "La più fedele": "The most loyal",
  "Una pianta con te da più di tre anni": "A plant with you for more than three years",
  "Sedici in una stanza": "Sixteen in a room",
  "Sedici piante nella stessa stanza": "Sixteen plants in the same room",
  "Solo acqua buona": "Only good water",
  "Otto piante che ricevono acqua demineralizzata o riposata": "Eight plants getting distilled or standing water",
  "Le due stagioni estreme": "Both extremes",
  "Aver usato sia la piena estate che il pieno riposo": "You used both peak summer and full dormancy",
  "Il grande giardino": "The great garden",
  "Cinquanta piante seguite insieme": "Fifty plants tracked at once",
  "La regina": "The queen",
  "Una foglia nuova sull'Anthurium warocqueanum: la più lenta che hai": "A new leaf on the Anthurium warocqueanum, the slowest you have",
  "Prima terra": "First soil",
  "Una talea cresciuta in acqua è passata al vaso": "A water-rooted cutting moved into a pot",
  "Cinque in un colpo": "Five at once",
  "Cinque piante annaffiate nello stesso giorno": "Five plants watered on the same day",
  "Giornata piena": "A full day",
  "Acqua, concime, una cura e una foglia nuova nello stesso giorno": "Water, feed, a treatment and a new leaf on the same day",
  "Tripletta": "Hat-trick",
  "Tre foglie nuove nello stesso giorno": "Three new leaves on the same day",
  "Sei mesi insieme": "Six months together",
  "Sei mesi dalla prima registrazione": "Six months since your first record",
  "Un anno verde": "A green year",
  "Un anno intero di registrazioni": "A full year of records",
  "Vecchia amica": "Old friend",
  "Cinquanta annaffiature sulla stessa pianta": "Fifty waterings on the same plant",
  "Nessuno indietro": "Nobody left behind",
  "Almeno dieci piante e nemmeno una in ritardo": "At least ten plants and not one overdue",
  "Esploratore": "Explorer",
  "Aver visitato Storico, Terricci e il profilo": "You visited History, Soil mixes and the profile",
  "Passato l'inverno": "Winter survived",
  "Registrazioni sia a dicembre che a marzo: hai attraversato la stagione difficile": "Records in both December and March: you got through the hard season",
  "Rinvaso puntuale": "Well-timed repot",
  "Un rinvaso fatto tra marzo e maggio, il periodo ideale": "A repot done between March and May, the ideal window",
  "Notte e giorno": "Night and day",
  "Aver provato sia il tema chiaro che quello scuro": "You tried both the light and the dark theme",
  "Quattro in una": "Four in one",
  "Più piante nello stesso vaso, contate come una": "Several plants in one pot, counted as one",
  "Questa settimana non hai saltato niente.": "You haven't missed a thing this week.",
  "C'è aria di crescita, in casa.": "There's growth in the air at home.",
  "Va tutto liscio, non c'è niente da fare.": "All smooth, nothing to do.",
  "Nessuna in ritardo: puoi respirare.": "None overdue: you can breathe.",
  "Ne manca una sola, poi sei a posto.": "Just one left, then you're done.",
  "scorri a destra per annaffiare": "swipe right to water",
  "a sinistra per aprire la scheda": "swipe left to open the details",
  "Nessuna pianta da annaffiare oggi.": "No plants to water today.",
  "Nessuna pianta da tenere d'occhio.": "No plants to keep an eye on.",
  "Puoi anche non aprire l'app fino a domani.": "You needn't open the app again until tomorrow.",
  "Vuol dire che stanno tutte abbastanza bene.": "It means they're all doing well enough.",
  "Prova col nome, la specie o la stanza.": "Try the name, the species or the room.",
  "Vedile tutte": "See them all",
  "Quanto è grande": "How big it is",
  "Giovane": "Young",
  "Adulta": "Adult",
  "Matura": "Mature",
  "mostra quelli da sbloccare": "show the locked ones",
  "nascondi quelli da sbloccare": "hide the locked ones",
  "Il mese scorso": "Last month",
  "è stata la migliore con": "was the best with",
  "Nessuna foglia nuova segnata nel mese.": "No new leaves recorded this month.",
  "Da guardare da vicino:": "Worth a closer look:",
  "In ritardo adesso:": "Overdue right now:",
  "Metà dei danni alle piante d'appartamento nasce dal fare qualcosa, non dal dimenticarsene. Queste stanno bene così come sono.": "Half the damage done to houseplants comes from doing something, not from forgetting. These are fine exactly as they are.",
  "Sulle foglie": "On the leaves",
  "Sul terriccio": "On the soil",
  "Sul fusto o alla base": "On the stem or base",
  "Nella crescita": "In how it grows",
  "Vedo insetti": "I see insects",
  "Ingialliscono": "Yellowing",
  "Punte e bordi marroni e croccanti": "Brown crispy tips and edges",
  "Macchie brune con alone giallo": "Brown spots with a yellow halo",
  "Macchie chiare o sbiancate": "Pale or bleached patches",
  "Patina bianca polverosa": "White powdery film",
  "Aree argentate e foglie deformi": "Silvery patches and deformed leaves",
  "Afflosciate di colpo": "Suddenly collapsed",
  "Arricciate verso l'interno": "Curling inwards",
  "Appiccicose al tatto": "Sticky to the touch",
  "Muffa bianca soffice in superficie": "Soft white mould on top",
  "Crosta bianca dura sul bordo": "Hard white crust on the rim",
  "Resta bagnato per giorni": "Stays wet for days",
  "L'acqua scorre via subito": "Water runs straight through",
  "Moscerini che volano via": "Small flies taking off",
  "Base molle e scura": "Soft dark base",
  "Batuffoli bianchi cotonosi": "White cottony tufts",
  "Crosticine marroni attaccate": "Brown scabs stuck on",
  "Steli lunghi e foglie distanti": "Long stems, widely spaced leaves",
  "Foglie nuove piccole e pallide": "Small pale new leaves",
  "Ferma da mesi": "Stalled for months",
  "Ragnatele finissime e puntini mobili": "Fine webbing and moving dots",
  "Scudetti marroni immobili": "Motionless brown scales",
  "Moscerini attorno al vaso": "Flies around the pot",
  "Insetti minuscoli e velocissimi": "Tiny very fast insects",
  "Come è il terriccio adesso?": "How is the soil right now?",
  "Bagnato o umido": "Wet or damp",
  "Asciutto": "Dry",
  "Bagnato": "Wet",
  "Da quanto non la rinvasi?": "How long since you repotted it?",
  "Più di due anni o non lo so": "More than two years, or I don't know",
  "Di recente": "Recently",
  "Dove hai notato il problema?": "Where did you notice it?",
  "che aspetto ha?": "what does it look like?",
  "Ecco le cause più probabili, in ordine.": "Here are the most likely causes, in order.",
  "Ripresa": "Waking up",
  "Piena": "Peak",
  "Rallentamento": "Slowing down",
  "Riposo": "Dormant",
  "mezza dose le prime due volte": "half strength the first two times",
  "dose piena": "full strength",
  "ultima concimazione a settembre": "last feed in September",
  "niente concime": "no feeding",
  "Riparte tutto: è la finestra giusta per i rinvasi e per ricominciare a concimare, ma piano.": "Everything restarts: the right window for repotting and for feeding again, gently.",
  "Massimo vigore e consumi d'acqua più alti: gli intervalli si accorciano da soli.": "Peak vigour and higher water use: the intervals shorten by themselves.",
  "La luce cala e la crescita frena. Si allunga fra un'annaffiatura e l'altra e si chiude col concime.": "Light drops and growth slows. Intervals stretch and feeding closes for the year.",
  "Le piante dormono. Acqua molto ridotta, concime sospeso e nessun intervento traumatico.": "The plants are asleep. Much less water, no feeding, nothing traumatic.",
  "Nessuno": "None",
  "Palo di cocco": "Coir pole",
  "Tutore singolo": "Single stake",
  "Traliccio o arco": "Trellis or arch",
  "Vaso pensile": "Hanging pot",
  "Bagnalo a ogni annaffiatura: le radici aeree ci si aggrappano solo se è umido, ed è questo che fa crescere le foglie più grandi.": "Wet it every time you water: aerial roots only grip if it's damp, and that's what makes the leaves grow bigger.",
  "Legature morbide e larghe: un filo stretto strozza il fusto man mano che ingrossa.": "Soft, wide ties: a tight wire strangles the stem as it thickens.",
  "Guida i getti man mano, non tutti insieme: i tralci maturi si spezzano se piegati di colpo.": "Guide the shoots as they grow, not all at once: mature stems snap if bent suddenly.",
  "Ricade invece di salire: taglia le punte ogni tanto o si spoglia alla base.": "It trails instead of climbing: pinch the tips now and then or it goes bare at the base.",
  "va forte": "thriving",
  "in ripresa": "recovering",
  "in sofferenza": "struggling",
  "da capire": "settling in",
  "Non ce l'ha fatta": "Didn't make it",
  "Regalata": "Given away",
  "Data via": "Passed on",
  "Altro": "Other",
  "Sole diretto": "Direct sun",
  "Luce brillante": "Bright light",
  "Luce indiretta brillante": "Bright indirect light",
  "Luce indiretta": "Indirect light",
  "Tollera la penombra": "Tolerates low light",
  "Qualsiasi luce": "Any light",
  "hanno ancora acqua a sufficienza: il terriccio è umido e aggiungerne è il modo più comune di far marcire le radici": "they still have enough water: the soil is damp, and adding more is the commonest way to rot roots",
  "il concime è sospeso per un motivo, e darlo comunque brucia radici già in difficoltà": "feeding is paused for a reason, and doing it anyway burns roots already in trouble",
  "sono arrivate o sono state rinvasate da poco: il trapianto adesso è solo stress": "they arrived or were repotted recently: moving them now is pure stress",
  "acqua sul velluto o nel cuore della rosetta lascia macchie o fa marcire il colletto": "water on velvet leaves or in the heart of a rosette leaves marks or rots the crown",
  "la cera che le protegge dal sole non ricresce dove la sfiori con le dita": "the wax that shields them from the sun never returns where your fingers touch it",
  "sono epifite: quel rizoma peloso deve restare in superficie o marcisce": "they're epiphytes: that furry rhizome must stay on the surface or it rots",
  "La stanza che funziona": "The room that works",
  "Serve qualche mese di foglie segnate in almeno due stanze diverse.": "It needs a few months of recorded leaves in at least two different rooms.",
  "Dopo tre annaffiature per pianta saprò se i tuoi intervalli reali corrispondono a quelli che ti sei dato.": "After three waterings per plant I'll know whether your real intervals match the ones you set.",
  "Con foglie segnate in almeno tre mesi diversi saprai qual è il tuo periodo buono.": "With leaves recorded across three different months you'll know your good season.",
  "Quando sposterai una pianta di stanza, confronterò le foglie prima e dopo.": "When you move a plant to another room, I'll compare the leaves before and after.",
  "Le piante di casa": "The plants at home",
  "Meglio poca acqua che troppa: quasi tutte muoiono annegate, nessuna muore per un giorno di ritardo.": "Better too little than too much: almost all of them drown, none dies from one late day.",
  "Se una pianta non è nell'elenco del giorno,": "If a plant isn't on that day's list,",
  "non toccarla": "leave it alone",
  "svuota sempre il sottovaso": "always empty the saucer",
  "l'acqua ferma fa marcire le radici": "standing water rots the roots",
  "In questo periodo non c'è niente da fare.": "There's nothing to do in this period.",
  "Una pianta afflosciata di colpo ha solo sete: annaffiala e si rialza in un'ora.": "A suddenly flopping plant is just thirsty: water it and it stands up within the hour.",
  "Foglie gialle e terra bagnata significano troppa acqua: lascia stare e non annaffiare.": "Yellow leaves and wet soil mean too much water: leave it and don't water.",
  "Nel dubbio, infila un dito nel terriccio per due centimetri: se è umido, aspetta.": "When in doubt, push a finger two centimetres into the soil: if it's damp, wait.",
  "Il rinvaso di routine va da marzo ad agosto": "Routine repotting runs from March to August",
  "Il rinvaso di soccorso non ha stagione.": "Emergency repotting has no season.",
  "Vaso solo 2-4 cm più largo.": "A pot only 2-4 cm wider.",
  "Niente strato di argilla sul fondo.": "No clay layer at the bottom.",
  "Dopo il rinvaso, un mese senza concime.": "After repotting, a month with no feeding.",
  "Annaffiatura leggera": "A light watering",
  "Nessuna foglia nuova segnata": "No new leaves recorded",
  "+ foglia nuova": "+ new leaf",
  "annulla": "undo",
  "mai fatto": "never done",
  "Pulizia foglie ogni tre settimane": "Leaf cleaning every three weeks",
  "Scopri quanto è dura la tua.": "Find out how hard yours is.",
  "Metà e metà funziona benissimo.": "Half and half works fine.", "Concimata": "Fed", "Fatto": "Done", "da fare": "due",
  "mai dato": "never done",
  "Fatto": "Done",
  "da dare": "due",
  "sospeso": "paused",
  "foglia segnata": "leaf recorded",
  "foglie segnate": "leaves recorded",
  "una ogni": "one every",
  "negli ultimi 3 mesi": "in the last 3 months",
  "Concime: mai dato · ogni": "Feeding: never done · every",
  "Concime da dare": "Feeding due",
  "Concime tra": "Feeding in",
  "Concime sospeso:": "Feeding paused:",
  "Neem: nessun ciclo in corso": "Neem: no cycle running",
  "Avvia ciclo neem": "Start neem cycle",
  "Ciclo neem in corso:": "Neem cycle running:",
  "interrompi": "stop",
  "passaggio alla fine": "pass to go",
  "passaggi alla fine": "passes to go",
  "Nei fatti la annaffi ogni": "In practice you water it every",
  "non": "not",
  "Usa": "Use",
  "Vaso solo 2-4 cm più largo.": "A pot only 2-4 cm wider.",
  "Uno troppo grande resta bagnato dove non ci sono radici, ed è lì che parte il marciume.": "Too big and it stays wet where there are no roots, and that's where rot begins.",
  "È il consiglio più diffuso e più sbagliato: non drena, alza il livello dell'acqua stagnante verso le radici.": "The most repeated and most wrong advice: it doesn't drain, it raises the standing water towards the roots.",
  "quando la pianta ha la forza di rifare radici. Il periodo migliore è la primavera, ma fino a fine estate restano settimane utili di crescita. Da metà settembre in poi meglio aspettare.": "while the plant can still make new roots. Spring is best, but useful growing weeks remain until late summer. From mid-September on, better to wait.",
  "Radici marce, substrato esaurito o compattato, pianta che soffoca in un vaso troppo stretto: in questi casi si interviene subito, anche a dicembre. Il rischio di aspettare è più grande di quello di rinvasare.": "Rotten roots, spent or compacted mix, a plant choking in too small a pot: act at once, even in December. Waiting is riskier than repotting.",
  "Il substrato nuovo ne ha già, e le radici tagliate si bruciano.": "The fresh mix already has some, and cut roots burn.",
  "subito dopo, poi si aspetta che asciughi bene: le radici cercano l'acqua e si allungano.": "straight after, then let it dry well: the roots go looking for water and stretch.",
  "siamo in riposo, riprenderemo a marzo": "we're dormant, back in March",
  "sta male, brucerebbe le radici": "it's struggling, it would burn the roots",
  "in acqua, solo dose debolissima a radici fatte": "in water: only a very weak dose once rooted",
  "in riposo le radici non crescono": "roots don't grow while dormant",
  "di routine si aspetta marzo, ma se ci sono radici marce si fa subito": "routine repotting waits for March, but rotten roots are dealt with at once",
  "la finestra si chiude a metà settembre, salvo emergenze": "the window closes mid-September, emergencies aside",
  "Il mese più buio dell'anno: acqua ridotta al minimo, niente concime, e occhio all'aria secca dei termosifoni.": "The darkest month of the year: minimal water, no feeding, and watch the dry air from radiators.",
  "La luce comincia a tornare ma le piante dormono ancora. Buon momento per procurarti corteccia, perlite e vasi in vista di marzo.": "Light is returning but the plants are still asleep. A good time to stock up on bark, perlite and pots for March.",
  "Riparte tutto: è il mese dei rinvasi e del ritorno al concime, meglio a metà dose per le prime due volte. Rimetti la stagione su crescita.": "Everything restarts: the month for repotting and for feeding again, at half strength the first two times.",
  "Crescita piena. Le prime foglie nuove arrivano adesso: segnale che gli intervalli invernali vanno accorciati.": "Full growth. The first new leaves arrive now: a sign the winter intervals need shortening.",
  "Il mese di massimo vigore, il migliore per talee e propagazioni. Tutto quello che tagli adesso radica in fretta.": "The month of peak vigour, the best for cuttings. Anything you cut now roots quickly.",
  "Col caldo i consumi d'acqua salgono. Attenzione al sole diretto attraverso i vetri, che scotta le foglie in poche ore.": "Water use rises with the heat. Watch out for direct sun through glass, which scorches leaves within hours.",
  "Mese critico: caldo secco e ragnetto rosso. Controlla il rovescio delle foglie più spesso del solito.": "A critical month: dry heat and spider mites. Check the leaf undersides more often than usual.",
  "Se parti, raggruppa le assetate in bagno e lascia stare le grasse. Al rientro, controllo parassiti su tutto.": "If you travel, group the thirsty ones in the bathroom and leave the succulents be. Check everything for pests when you're back.",
  "Ultimo concime pieno dell'anno e ultima finestra utile per un rinvaso leggero: dopo, le radici non fanno in tempo a riprendersi.": "The last full feed of the year and the last window for a light repot: after this the roots can't recover in time.",
  "Si rallenta: passa la stagione a riposo. I termosifoni che si accendono asciugano l'aria di colpo, più del terriccio.": "Slowing down: switch the season to dormant. Radiators coming on dry the air suddenly, more than the soil.",
  "Poca luce e crescita quasi ferma. Riduci l'acqua e sospendi del tutto il concime.": "Little light and growth nearly stopped. Cut back the water and stop feeding altogether.",
  "Minimo assoluto. Non rinvasare, non potare, non concimare: qualsiasi stress ora non viene recuperato.": "Absolute minimum. Don't repot, don't prune, don't feed: any stress now won't be recovered.",
  "Non riesco a salvare. L'ultima modifica potrebbe perdersi chiudendo la chat.": "Can't save. The last change may be lost if you close the app.",
  "Non riesco a leggere questa immagine.": "Can't read this image.",
  "Non riesco a salvare il profilo: forse la foto è troppo grande.": "Can't save the profile: the photo may be too large.",
  "Il file non è un backup valido. Serve un JSON esportato da questa app.": "That file isn't a valid backup. It needs to be a JSON exported from this app.",
  "senza stanza": "no room set",
  "Riserva d'acqua di ogni pianta": "Each plant's water reserve",
  "Il punteggio ha senso dopo qualche settimana di registrazioni: per ora è solo un punto di partenza.": "The score only means something after a few weeks of records: for now it's just a starting point.",
  "Pesa la salute delle piante, quanto rispetti i ritmi che ti sei dato, le foglie nuove e la costanza. Annaffiare più del necessario non alza il punteggio.": "It weighs plant health, how well you keep to your own intervals, new leaves and consistency. Watering more than needed does not raise it.",
  "Aggiungi la data di arrivo da Modifica": "Add the arrival date from Edit",
  " Con più foglie segnate la stima diventerà precisa.": " With more leaves recorded the estimate will sharpen.",
  "Togli questa data": "Remove this date",
  "Aggiungi una stanza tua": "Add a room of your own",
  "Compare nel pannello Stanze": "Shown in the Rooms panel",
  "distintivi su": "badges of", "Apro l'elenco…": "Opening your plants…", "Nessuna foglia nuova segnata": "No new leaves recorded",
  "Da assegnare": "Unassigned", "Non tossica.": "Not toxic.",
};

const t = (s, lingua) => (lingua === "en" ? (EN[s] ?? s) : s);

const PASSI_INTRO = [
  { ill: "deliciosa", t: "La colonna d'acqua", te: "The water column",
    d: "Ogni pianta ha una riserva che si svuota giorno dopo giorno. Piena vuol dire appena annaffiata, vuota vuol dire che tocca a lei. La striscia in cima è tutta la casa a colpo d'occhio.",
    de: "Each plant has a reservoir that empties day by day. Full means just watered, empty means it's due. The strip at the top shows the whole house at a glance." },
  { ill: "maranta", t: "Conta le foglie", te: "Count the leaves",
    d: "Ogni volta che vedi spuntare una foglia nuova, premi \u201c+ foglia nuova\u201d. Dopo qualche mese l'app conosce il ritmo di ognuna, prevede la prossima e ti avvisa quando rallenta: è il modo più precoce per accorgersi che qualcosa non va.",
    de: "Whenever you spot a new leaf, tap \u201c+ new leaf\u201d. After a few months the app knows each plant's rhythm, predicts the next leaf and warns you when it slows: the earliest way to notice something is wrong." },
  { ill: "anthurium-regale", t: "Non solo acqua", te: "Not just water",
    d: "Concime, tonico, pulizia delle foglie, rinvaso e un quarto di giro a settimana hanno ritmi diversi, e si sospendono da soli quando non vanno dati. Nelle guide trovi il terriccio giusto, l'acqua giusta e la diagnosi dei problemi.",
    de: "Feeding, foliar tonic, leaf cleaning, repotting and a weekly quarter turn all run on their own rhythms, and pause themselves when they shouldn't be done. The guides cover the right soil mix, the right water and a symptom-based diagnosis." },
  { ill: "snake", t: "Si scorre", te: "Swipe it",
    d: "Trascina una scheda a destra per annaffiare, a sinistra per aprirla. Ogni azione si può annullare, e in \u201cLascia stare\u201d trovi cosa oggi è meglio non toccare.",
    de: "Swipe a card right to water, left to open it. Every action can be undone, and \u201cLeave alone\u201d shows what's best not touched today." },
];

const TOLLERA_ASCIUTTO = ["sansevierie", "grasse", "peperomie", "facili", "aroidee-terrestri", "palme"];

const CHIAVE = "cura-piante:v2";
const CHIAVE_IO = "cura-piante:io";   // nome e foto stanno a parte: la foto è pesante

export default function CuraPiante() {
  const [piante, setPiante] = useState([]);
  const [stagione, setStagione] = useState(() => stagioneDelMese(new Date().getMonth()));
  const [filtro, setFiltro] = useState("tutte");
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [form, setForm] = useState(null);
  const [dataAperta, setDataAperta] = useState(null);
  const [vista, setVista] = useState("urgenza");
  const [stanzeAperto, setStanzeAperto] = useState(false);
  const [stanzeExtra, setStanzeExtra] = useState([]);
  const [nuovaStanza, setNuovaStanza] = useState("");
  const [densita, setDensita] = useState(typeof window !== "undefined" && window.innerWidth < 640 ? "compatta" : "estesa");
  const compatte = densita === "compatta";
  const [espanse, setEspanse] = useState(() => new Set());
  const [vistaPiante, setVistaPiante] = useState("urgenza");
  const barraRef = useRef(null);

  const ancoraBarra = () => {
    const n = barraRef.current;
    if (!n) return;
    const y = n.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > y) window.scrollTo({ top: y, behavior: "auto" });
  };

  const vaiA = (v) => {
    ancoraBarra();
    setVista(v);
    if (["grafici", "terricci", "profilo", "acqua", "problemi"].includes(v)) setEsplorate((e) => (e.includes(v) ? e : [...e, v]));
  };
  const [impostazioni, setImpostazioni] = useState(false);
  const [evidenziata, setEvidenziata] = useState(null);
  const [riposoUsato, setRiposoUsato] = useState(false);
  const [copiaFatta, setCopiaFatta] = useState(false);
  const [meseVisto, setMeseVisto] = useState(null);
  const [riepilogoAperto, setRiepilogoAperto] = useState(false);
  const [esplorate, setEsplorate] = useState([]);
  const [usato, setUsato] = useState([]);
  const [stagioniProvate, setStagioniProvate] = useState([]);
  const segna = (k) => setUsato((u) => (k === "neem-finito" || !u.includes(k) ? [...u, k] : u));
  const [io, setIo] = useState({ nome: "", foto: "" });
  const [modificaIo, setModificaIo] = useState(false);
  const [archiviando, setArchiviando] = useState(null);
  const [dettaglio, setDettaglio] = useState(null);
  const [intro, setIntro] = useState(0);
  const [introVista, setIntroVista] = useState(true);
  const [nuovaData, setNuovaData] = useState({});
  const [testaRidotta, setTestaRidotta] = useState(false);
  const [gestiUsati, setGestiUsati] = useState(0);
  const [cerca, setCerca] = useState("");
  const [uscenti, setUscenti] = useState([]);
  const eranoRef = useRef([]);
  const contestoRef = useRef("");
  const [barraFerma, setBarraFerma] = useState(false);
  const [giuDiMolto, setGiuDiMolto] = useState(false);
  const sondaRef = useRef(null);
  const [libretto, setLibretto] = useState(null);
  const [catProblema, setCatProblema] = useState("tutte");
  const [problemaSingolo, setProblemaSingolo] = useState(null);
  const [distintiviVisti, setDistintiviVisti] = useState(null);
  const [prudenza, setPrudenza] = useState(0);
  const [nuoviDistintivi, setNuoviDistintivi] = useState([]);
  const [mostraMancanti, setMostraMancanti] = useState(false);
  const [diag, setDiag] = useState({ zona: null, sintomo: null, risposta: null });
  const [tuttiProblemi, setTuttiProblemi] = useState(false);

  useEffect(() => {
    const scorri = () => {
      setTestaRidotta((r) => (r ? window.scrollY > 40 : window.scrollY > 110));
      const n = barraRef.current;
      const sicuro = sondaRef.current?.offsetHeight || 0;
      if (n) setBarraFerma(n.getBoundingClientRect().top <= sicuro + 1);
      setGiuDiMolto(window.scrollY > window.innerHeight * 1.8);
    };
    window.addEventListener("scroll", scorri, { passive: true });
    return () => window.removeEventListener("scroll", scorri);
  }, []);
  const [trascina, setTrascina] = useState(null);
  const tocco = useRef(null);

  const SOGLIA = 72;
  const inizioTocco = (e, id) => {
    const t = e.touches[0];
    tocco.current = { id, x0: t.clientX, y0: t.clientY, asse: null };
  };
  const muoviTocco = (e) => {
    const c = tocco.current;
    if (!c) return;
    const t = e.touches[0];
    const dx = t.clientX - c.x0, dy = t.clientY - c.y0;
    if (!c.asse) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      c.asse = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (c.asse !== "x") return;
    setTrascina({ id: c.id, dx: Math.max(-140, Math.min(140, dx)) });
  };
  const fineTocco = (p) => {
    const c = tocco.current, t = trascina;
    tocco.current = null;
    setTrascina(null);
    if (!c || !t || t.id !== p.id) return;
    if (t.dx > SOGLIA) { vibra("forte"); annaffia(p.id); setGestiUsati((n) => n + 1); }
    else if (t.dx < -SOGLIA) { vibra(); setDettaglio(p.id); setGestiUsati((n) => n + 1); }
  };
  const [tema, setTema] = useState("sistema");
  const [lingua, setLingua] = useState("it");
  const L = (x) => t(x, lingua);
  const cura = (p, campo) => {
    const v = p[campo] || "";
    if (lingua !== "en") return v;
    const it = PROFILI[p.specie]?.[campo];
    return it && v === it ? (EN_PROFILI[p.specie]?.[campo] || v) : v;
  };
  LOCALE = lingua === "en" ? "en-GB" : "it-IT";
  const [temiProvati, setTemiProvati] = useState([]);
  const [sistemaScuro, setSistemaScuro] = useState(false);
  const [annullo, setAnnullo] = useState(null);
  const orologioAnnullo = useRef(null);

  const conAnnullo = (testo, trasforma) => {
    setAnnullo({ piante, testo });
    setPiante(trasforma(piante));
    clearTimeout(orologioAnnullo.current);
    orologioAnnullo.current = setTimeout(() => setAnnullo(null), 25000);
  };

  const tornaIndietro = () => {
    if (!annullo) return;
    setPiante(annullo.piante);
    setAnnullo(null);
    clearTimeout(orologioAnnullo.current);
  };

  const apriChiudi = (id) =>
    setEspanse((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  useEffect(() => {
    (async () => {
      let stato = null;
      try {
        const r = await window.storage.get(CHIAVE);
        if (r?.value) stato = JSON.parse(r.value);
      } catch { /* prima apertura */ }
      try {
        const r = await window.storage.get(CHIAVE_IO);
        if (r?.value) setIo(JSON.parse(r.value));
      } catch { /* nessun profilo salvato */ }
      const CALCOLATI = ["intervallo", "restanti", "pieno", "stato", "cedimento", "fresca", "lato",
        "ritmo", "cresc", "cure", "messaggio", "conc", "tratt"];
      const normalizza = (grezzo) => {
        const p = { ...grezzo };
        CALCOLATI.forEach((k) => delete p[k]);
        const pr = PROFILI[p.specie] || PROFILI["Altro"];
        return {
          ...p,
          ultima: p.ultima || oggiStr(),
          foglie: p.foglie || [],
          storico: p.storico || [],
          storicoConcime: p.storicoConcime || [],
          storicoTrattamenti: p.storicoTrattamenti || [],
          giorni: p.giorni || pr.giorni,
          concime: p.concime || pr.concime,
          ultimoConcime: p.ultimoConcime ?? null,
          spray: p.spray ?? !!pr.spray,
          radicante: p.radicante ?? !!pr.radicante,
          pulizia: p.pulizia ?? !!pr.pulizia,
          rotazione: p.rotazione ?? !!pr.rotazione,
          ultimoSpray: p.ultimoSpray ?? null,
          ultimoRadicante: p.ultimoRadicante ?? null,
          ultimaPulizia: p.ultimaPulizia ?? null,
          ultimaRotazione: p.ultimaRotazione ?? null,
          ultimaLegatura: p.ultimaLegatura ?? null,
          neemRestanti: p.neemRestanti ?? 0,
          neemUltimo: p.neemUltimo ?? null,
          miscela: p.miscela || pr.miscela,
          rinvaso: p.rinvaso !== undefined ? p.rinvaso : pr.rinvaso,
          ultimoRinvaso: p.ultimoRinvaso ?? null,
          vaso: p.vaso || "",
        materiale: p.materiale || "plastica",
        foro: p.foro !== undefined ? p.foro : true,
          sostegno: p.sostegno || pr.sostegno || "nessuno",
          altezzaPalo: p.altezzaPalo ?? "",
          altezzaPianta: p.altezzaPianta ?? "",
          metodo: p.metodo !== undefined ? p.metodo : (pr.metodo || ""),
          tipoAcqua: p.tipoAcqua !== undefined ? p.tipoAcqua : (pr.tipoAcqua || ""),
          consiglio: p.consiglio !== undefined ? p.consiglio : (pr.consiglio || ""),
          arrivo: p.arrivo ?? null,
          stadio: p.stadio || "adulta",
            perdite: p.perdite || [],
          storicoStanza: p.storicoStanza || (p.stanza ? [{ stanza: p.stanza, da: p.arrivo || oggiStr() }] : []),
        };
      };

      if (stato?.piante?.length) {
        setPiante(stato.piante.map(normalizza));
        setStagione(STAGIONI[stato.stagione] ? stato.stagione : stagioneDelMese(new Date().getMonth()));
        setStanzeExtra(stato.stanzeExtra || []);
        setRiposoUsato(!!stato.riposoUsato);
        setCopiaFatta(!!stato.copiaFatta);
        setMeseVisto(stato.meseVisto ?? null);
        setEsplorate(stato.esplorate || []);
        setUsato(stato.usato || []);
        setStagioniProvate(stato.stagioniProvate || []);
        setDistintiviVisti(stato.distintiviVisti || null);
        setPrudenza(stato.prudenza ?? 0);
        setTema(stato.tema || "sistema");
        setLingua(stato.lingua || (typeof navigator !== "undefined" && /^en/i.test(navigator.language || "") ? "en" : "it"));
        setTemiProvati(stato.temiProvati || []);
        setGestiUsati(stato.gestiUsati ?? 0);
        if (stato.densita) setDensita(stato.densita);
        setIntroVista(!!stato.introVista);
        if (!stato.introVista) setIntro(1);
      } else {
        setLingua(typeof navigator !== "undefined" && /^en/i.test(navigator.language || "") ? "en" : "it");
        setStagione(stagioneDelMese(new Date().getMonth()));
        setIntro(1);
        setIntroVista(false);
      }
      setCaricamento(false);
    })();
  }, []);

  useEffect(() => {
    if (caricamento) return;
    (async () => {
      try {
        await window.storage.set(CHIAVE, JSON.stringify({ piante, stagione, stanzeExtra, riposoUsato, copiaFatta, meseVisto, esplorate, tema, densita, temiProvati, gestiUsati, usato, stagioniProvate, distintiviVisti, lingua, introVista }));
        setErrore(null);
      } catch {
        setErrore(L("Non riesco a salvare. L'ultima modifica potrebbe perdersi chiudendo la chat."));
      }
    })();
  }, [piante, stagione, stanzeExtra, riposoUsato, copiaFatta, meseVisto, esplorate, tema, densita, temiProvati, gestiUsati, usato, stagioniProvate, distintiviVisti, lingua, introVista, caricamento]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSistemaScuro(mq.matches);
    const cambia = (e) => setSistemaScuro(e.matches);
    mq.addEventListener?.("change", cambia);
    return () => mq.removeEventListener?.("change", cambia);
  }, []);

  const scuro = tema === "scuro" || (tema === "sistema" && sistemaScuro);

  const pannelloAperto = !!(dettaglio || form || libretto || stanzeAperto || impostazioni || archiviando || riepilogoAperto);
  useEffect(() => {
    if (!pannelloAperto) return;
    const y = window.scrollY;
    const corpo = document.body;
    const prima = { position: corpo.style.position, top: corpo.style.top, width: corpo.style.width };
    corpo.style.position = "fixed";
    corpo.style.top = `-${y}px`;
    corpo.style.width = "100%";
    return () => {
      corpo.style.position = prima.position;
      corpo.style.top = prima.top;
      corpo.style.width = prima.width;
      window.scrollTo(0, y);
    };
  }, [pannelloAperto]);

  useEffect(() => {
    if (caricamento) return;
    const q = scuro ? "scuro" : "chiaro";
    setTemiProvati((t) => (t.includes(q) ? t : [...t, q]));
  }, [scuro, caricamento]);

  useEffect(() => {
    document.documentElement.style.background = scuro ? "#0E1915" : "#E4EAE1";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", scuro ? "#0E1915" : "#16241F");
  }, [scuro]);

  const fase = STAGIONI[stagione] || STAGIONI.piena;
  const fattore = fase.acqua;

  const attive = useMemo(() => piante.filter((p) => !p.archiviata), [piante]);

  const calcolate = useMemo(
    () =>
      attive
        .map((p) => {
          const fVaso = p.modo === "acqua" ? 1 : (VASI[p.materiale]?.f ?? 1) * (p.foro === false ? 1.25 : 1);
          const fMargine = p.modo !== "acqua" && prudenza > 0 && TOLLERA_ASCIUTTO.includes(p.miscela)
            ? 1 + prudenza * 0.15 : 1;
          const intervallo = p.modo === "acqua" ? p.giorni
            : Math.max(1, Math.round(p.giorni * fattore * fVaso * fMargine));
          const restanti = intervallo - giorniDa(p.ultima);
          const base = {
            ...p, intervallo, restanti,
            pieno: Math.max(0, Math.min(1, restanti / intervallo)),
            stato: restanti < 0 ? "secca" : restanti <= 0 ? "oggi" : "ok",
            cedimento: restanti >= 0
              ? 0
              : Math.min(1, Math.abs(restanti) / Math.max(4, intervallo * 1.3)) * (p.modo === "acqua" ? 0.45 : 1),
            fresca: p.storico?.[0] === oggiStr(),
            lato: (p.id.charCodeAt(0) + (p.id.charCodeAt(1) || 0)) % 2 ? 1 : -1,
            ritmo: ritmoReale(p.storico),
            cresc: crescita(p.foglie),
            cure: cureDi(p, stagione),
          };
          base.messaggio = messaggiDi(base, stagione, lingua === "en")[0];
          return base;
        })
        .sort((a, b) => a.restanti - b.restanti),
    [attive, fattore, stagione, lingua]
  );

  const visibili = calcolate
    .filter((p) => (["tutte", "fermo"].includes(filtro) ? true : filtro === "oggi" ? p.restanti <= 0 : p.tag === "cura" || p.tag === "ripresa"))
    .filter((p) => {
      const q = cerca.trim().toLowerCase();
      if (!q) return true;
      return [p.nome, p.specie, p.stanza, p.nota].filter(Boolean).some((t) => t.toLowerCase().includes(q));
    });
  const dasete = calcolate.filter((p) => p.restanti <= 0).length;

  const annaffia = (id) => {
    vibra("forte");
    const p = piante.find((x) => x.id === id);
    conAnnullo(`${p?.modo === "acqua" ? "Acqua cambiata" : "Annaffiata"}: ${p?.nome}`,
      (ps) => ps.map((q) => (q.id === id ? { ...q, ultima: oggiStr(), storico: [oggiStr(), ...(q.storico || [])].slice(0, 30) } : q)));
  };

  const TIPI_PERDITA = { morta: "Foglia morta", secca: "Foglia secca", gialla: "Foglia ingiallita" };

  const segnaPerdita = (id, tipo) => {
    vibra();
    const oggi = oggiStr();
    const q = piante.find((x) => x.id === id);
    conAnnullo(`${L(TIPI_PERDITA[tipo])}: ${q?.nome}`, (ps) => ps.map((x) =>
      x.id === id ? { ...x, perdite: [{ data: oggi, tipo }, ...(x.perdite || [])].slice(0, 200) } : x));
  };

  const togliPerdita = (id, i) => {
    const q = piante.find((x) => x.id === id);
    conAnnullo(`${lingua === "en" ? "Removed a loss from" : "Tolta una perdita a"} ${q?.nome}`, (ps) => ps.map((x) =>
      x.id === id ? { ...x, perdite: (x.perdite || []).filter((_, k) => k !== i) } : x));
  };

  const aggiungiFoglia = (id) => {
    vibra();
    const p = piante.find((x) => x.id === id);
    conAnnullo(`Foglia nuova: ${p?.nome}`,
      (ps) => ps.map((q) => (q.id === id ? { ...q, foglie: [oggiStr(), ...(q.foglie || [])] } : q)));
  };

  const annullaAnnaffiatura = (id) => {
    const p = piante.find((x) => x.id === id);
    conAnnullo(`Annaffiatura tolta: ${p?.nome}`, (ps) => ps.map((q) => {
      if (q.id !== id) return q;
      const resto = (q.storico || []).filter((d) => d !== oggiStr());
      return { ...q, storico: resto, ultima: resto[0] || q.ultima };
    }));
  };

  const annullaFoglia = (id) =>
    setPiante((ps) => ps.map((p) => (p.id === id ? { ...p, foglie: (p.foglie || []).slice(1) } : p)));

  const NOMI_CURA = { concime: "Concime", spray: "Tonico fogliare", radicante: "Radicante",
    pulizia: "Pulizia foglie", neem: "Neem", rotazione: "Quarto di giro", rinvaso: "Rinvaso" };

  const fattaCura = (id, chiave) => {
    vibra();
    const pi = piante.find((x) => x.id === id);
    conAnnullo(`${NOMI_CURA[chiave] || "Cura"}: ${pi?.nome}`, (ps) => ps.map((p) => {
      if (p.id !== id) return p;
      const oggi = oggiStr();
      if (chiave === "concime")
        return { ...p, ultimoConcime: oggi, storicoConcime: [oggi, ...(p.storicoConcime || [])].slice(0, 30) };
      const campo = { spray: "ultimoSpray", radicante: "ultimoRadicante", pulizia: "ultimaPulizia",
      neem: "neemUltimo", rotazione: "ultimaRotazione", rinvaso: "ultimoRinvaso",
      legatura: "ultimaLegatura" }[chiave];
      let extra = {};
      if (chiave === "neem") {
        const restano = Math.max(0, (p.neemRestanti || 0) - 1);
        extra = { neemRestanti: restano };
        if (restano === 0) segna("neem-finito");
      }
      return { ...p, [campo]: oggi, ...extra,
        storicoTrattamenti: [oggi, ...(p.storicoTrattamenti || [])].slice(0, 60) };
    }));
  };

  const avviaNeem = (id) =>
    setPiante((ps) => ps.map((p) => (p.id === id ? { ...p, neemRestanti: 3, neemUltimo: null } : p)));
  const fermaNeem = (id) =>
    setPiante((ps) => ps.map((p) => (p.id === id ? { ...p, neemRestanti: 0 } : p)));

  const applicaRitmo = (id, giorni) =>
    setPiante((ps) => ps.map((p) => (p.id === id ? { ...p, giorni } : p)));

  const caricaFoto = (file) => {
    const lettore = new FileReader();
    lettore.onload = () => {
      const img = new Image();
      img.onload = () => {
        const L = 240;
        const tela = document.createElement("canvas");
        tela.width = tela.height = L;
        const ctx = tela.getContext("2d");
        const lato = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - lato) / 2, (img.height - lato) / 2, lato, lato, 0, 0, L, L);
        salvaIo({ ...io, foto: tela.toDataURL("image/jpeg", 0.75) });
      };
      img.onerror = () => setErrore(L("Non riesco a leggere questa immagine."));
      img.src = lettore.result;
    };
    lettore.readAsDataURL(file);
  };

  const salvaIo = async (nuovo) => {
    setIo(nuovo);
    try { await window.storage.set(CHIAVE_IO, JSON.stringify(nuovo)); }
    catch { setErrore(L("Non riesco a salvare il profilo: forse la foto è troppo grande.")); }
  };

  const esporta = () => {
    const blob = new Blob([JSON.stringify({ piante, stagione, stanzeExtra }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `piante-${oggiStr()}.json`;
    a.click();
    setCopiaFatta(true);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const importa = (file) => {
    const lettore = new FileReader();
    lettore.onload = () => {
      try {
        const d = JSON.parse(lettore.result);
        if (!Array.isArray(d.piante) || !d.piante.length) throw new Error("vuoto");
        if (window.confirm(`Il file contiene ${d.piante.length} piante e sostituisce l'elenco attuale. Procedo?`)) {
          setPiante(d.piante);
          setStagione(d.stagione || "crescita");
          setStanzeExtra(d.stanzeExtra || []);
        }
      } catch {
        setErrore(L("Il file non è un backup valido. Serve un JSON esportato da questa app."));
      }
    };
    lettore.readAsText(file);
  };

  const archivia = (id, motivo) => {
    const p = piante.find((x) => x.id === id);
    conAnnullo(`Archiviata: ${p?.nome}`, (ps) => ps.map((q) =>
      q.id === id ? { ...q, archiviata: { data: oggiStr(), motivo } } : q));
    setArchiviando(null);
  };

  const ripristina = (id) => {
    const p = piante.find((x) => x.id === id);
    conAnnullo(`Rimessa nell'elenco: ${p?.nome}`, (ps) => ps.map((q) => {
      if (q.id !== id) return q;
      const { archiviata, ...resto } = q;
      return { ...resto, ultima: oggiStr() };
    }));
  };

  const CAMPI_STORIA = {
    storico: L("Annaffiature"), foglie: L("Foglie nuove"),
    storicoConcime: L("Concimazioni"), storicoTrattamenti: L("Cure"),
  };

  const togliDataStoria = (id, campo, data) => {
    const p = piante.find((x) => x.id === id);
    conAnnullo(`Tolta una data da ${p?.nome}`, (ps) => ps.map((q) => {
      if (q.id !== id) return q;
      const lista = [...(q[campo] || [])];
      const i = lista.indexOf(data);
      if (i > -1) lista.splice(i, 1);   // toglie una sola occorrenza
      const resto = lista;
      return campo === "storico" ? { ...q, storico: resto, ultima: resto[0] || q.ultima } : { ...q, [campo]: resto };
    }));
  };

  const aggiungiDataStoria = (id, campo, data) => {
    if (!data) return;
    const p = piante.find((x) => x.id === id);
    conAnnullo(`Aggiunta una data a ${p?.nome}`, (ps) => ps.map((q) => {
      if (q.id !== id) return q;
      const nuovo = [...new Set([data, ...(q[campo] || [])])].sort().reverse();
      return campo === "storico" ? { ...q, storico: nuovo, ultima: nuovo[0] } : { ...q, [campo]: nuovo };
    }));
  };

  const impostaStanza = (id, stanza) =>
    setPiante((ps) => ps.map((p) => {
      if (p.id !== id || p.stanza === stanza) return p;
      const storia = [...(p.storicoStanza || [])];
      if (storia.length) storia[storia.length - 1] = { ...storia[storia.length - 1], a: oggiStr() };
      if (stanza) storia.push({ stanza, da: oggiStr() });
      return { ...p, stanza, storicoStanza: storia };
    }));

  const vaiAllaScheda = (id) => {
    if (vista !== vistaPiante) { setVista(vistaPiante); setDettaglio(id); return; }
    const p = calcolate.find((x) => x.id === id);
    if (p && filtro !== "tutte") {
      const inFiltro = filtro === "oggi" ? p.restanti <= 0 : p.tag === "cura" || p.tag === "ripresa";
      if (!inFiltro) setFiltro("tutte");
    }
    setEspanse((s) => new Set(s).add(id));
    setEvidenziata(id);
    setTimeout(() => {
      document.getElementById(`pianta-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    setTimeout(() => setEvidenziata((e) => (e === id ? null : e)), 2200);
  };

  const impostaUltima = (id, data) =>
    setPiante((ps) => ps.map((p) => (p.id === id ? { ...p, ultima: data } : p)));

  const elimina = (id, nome) => {
    const p = piante.find((x) => x.id === id);
    const storia = (p?.storico?.length || 0) + (p?.foglie?.length || 0) + (p?.storicoConcime?.length || 0);
    const messaggio = storia
      ? `${nome} ha ${storia} registrazioni. Eliminandola perdi anche la sua storia: se non la vuoi più seguire, "Archivia" la conserva. Elimino comunque?`
      : `Elimino ${nome}?`;
    if (window.confirm(messaggio))
      conAnnullo(`Eliminata: ${nome}`, (ps) => ps.filter((q) => q.id !== id));
  };

  const apriNuova = () =>
    setForm({ id: null, nome: "", specie: "Altro", giorni: 7, luce: "Luce indiretta", ill: "generica", modo: "terra", tag: "nuovo", nota: "", ultima: oggiStr(), concime: 28, ultimoConcime: null, foglie: [] });

  const salvaForm = () => {
    if (!form.nome.trim()) return;
    const prec = piante.find((x) => x.id === form.id);
    const CALCOLATI = ["intervallo", "restanti", "pieno", "stato", "cedimento", "fresca", "lato",
      "ritmo", "cresc", "cure", "messaggio", "conc", "tratt"];
    const d = { ...form, nome: form.nome.trim(), giorni: Math.max(1, Number(form.giorni) || 7) };
    CALCOLATI.forEach((k) => delete d[k]);
    if (prec) {
      if (prec.tag === "cura" && ["forte", "ripresa"].includes(d.tag)) d.giaRipresa = true;
      if (prec.modo === "acqua" && d.modo === "terra") d.giaInvasata = true;
      if (prec.stanza !== d.stanza) {
        const storia = [...(prec.storicoStanza || [])];
        if (storia.length) storia[storia.length - 1] = { ...storia[storia.length - 1], a: oggiStr() };
        if (d.stanza) storia.push({ stanza: d.stanza, da: oggiStr() });
        d.storicoStanza = storia;
      }
    }
    setPiante((ps) => (d.id ? ps.map((p) => (p.id === d.id ? { ...p, ...d } : p)) : [...ps, { ...d, id: nuovoId(), storico: [] }]));
    setForm(null);
  };

  const cambiaSpecie = (nome) => {
    const s = SPECIE.find((x) => x.nome === nome);
    const base = PROFILI[nome] || PROFILI["Altro"];
    const pr = lingua === "en" ? { ...base, ...(EN_PROFILI[nome] || EN_PROFILI["Altro"]) } : base;
    setForm((f) => ({
      ...f, specie: nome,
      giorni: s && s.nome !== "Altro" ? s.giorni : f.giorni,
      concime: pr.concime,
      luce: s && s.luce ? s.luce : f.luce,
      ill: s ? s.ill : f.ill,
      miscela: pr.miscela, rinvaso: pr.rinvaso, metodo: pr.metodo || "", tipoAcqua: pr.tipoAcqua || "",
      consiglio: pr.consiglio || "", sostegno: pr.sostegno || "nessuno",
      spray: !!pr.spray, radicante: !!pr.radicante, pulizia: !!pr.pulizia, rotazione: !!pr.rotazione,
      nome: f.nome || (s && s.nome !== "Altro" ? s.nome.split(" ")[0] : ""),
    }));
  };

  const incoraggiamento = () => {
    if (!calcolate.length) return null;
    const inRitardo = calcolate.filter((p) => p.restanti < 0).length;
    const settimana = calcolate.filter((p) => (p.storico || []).some((d) => giorniDa(d) <= 7)).length;
    const sofferenti = calcolate.filter((p) => p.tag === "cura").length;
    const foglieSett = calcolate.reduce((a, p) => a + (p.foglie || []).filter((f) => giorniDa(f) <= 7).length, 0);
    const foglieMese = calcolate.reduce((a, p) => a + (p.foglie || []).filter((f) => giorniDa(f) <= 30).length, 0);
    const oggiFatte = calcolate.filter((p) => p.ultima === oggiStr()).length;
    const perseSett = calcolate.reduce((a, p) => a + (p.perdite || []).filter((x) => giorniDa(x.data) <= 7).length, 0);
    const mese = new Date().getMonth();

    const pool = [];
    const agg = (cond, frasi) => { if (cond) pool.push(...frasi); };

    agg(oggiFatte >= 3, [
      "Oggi ti sei preso cura di parecchie.", "Bel giro, oggi.", "Le hai fatte quasi tutte, per oggi basta così.",
    ]);
    agg(foglieSett >= 2, [
      "C'è aria di crescita, in casa.", "Questa settimana qualcosa si è aperto.",
      "Stanno spingendo: due foglie nuove in sette giorni.", "Si vede che è la loro stagione.",
    ]);
    agg(foglieMese >= 5 && foglieSett < 2, [
      "Il mese sta andando bene, anche se questa settimana è tranquilla.",
      "Nessuna novità oggi, ma il mese racconta un'altra storia.",
    ]);
    agg(inRitardo === 0 && settimana >= 3, [
      "Questa settimana non hai saltato niente.", "Sei in pari con tutte.",
      "Nessuna ti sta aspettando.", "Tutto fatto, e senza fretta.",
    ]);
    agg(inRitardo === 0 && sofferenti === 0, [
      "Va tutto liscio, non c'è niente da fare.", "Stanno bene tutte, oggi non ti serve l'app.",
      "Giornata senza pensieri.", "Puoi anche solo guardarle.",
    ]);
    agg(inRitardo === 0, [
      "Nessuna in ritardo: puoi respirare.", "Sei in orario con tutte.", "Niente di urgente all'orizzonte.",
    ]);
    agg(inRitardo === 1, [
      "Ne manca una sola, poi sei a posto.", "Una e hai finito.", "Solo una ti aspetta.",
    ]);
    agg(inRitardo >= 2 && inRitardo <= 3, [
      "Un paio ti aspettano, niente di grave.", "Due o tre da sistemare, cinque minuti.",
      "Qualcuna è indietro, ma nulla di serio.",
    ]);
    agg(perseSett >= 2, [
      "Qualche foglia se n'è andata: capita, guarda con calma.",
      "Un po' di foglie perse questa settimana. Succede a tutti.",
    ]);
    agg(sofferenti >= 1 && sofferenti <= 2 && inRitardo === 0, [
      "Le altre stanno bene, concentrati su chi fatica.",
      "Qualcuna è in convalescenza, il resto va da sé.",
    ]);
    agg(stagione === "riposo", [
      "Stagione lenta: fanno poco e va bene così.", "Dormono. Il momento migliore per lasciarle stare.",
      "D'inverno la cura migliore è non intervenire.",
    ]);
    agg(stagione === "ripresa", [
      "Si stanno svegliando.", "È il mese in cui riparte tutto.", "Primavera: da qui in poi si corre.",
    ]);
    agg(stagione === "piena" && mese >= 6 && mese <= 7, [
      "Col caldo bevono di più: occhio ai vasi piccoli.", "Piena estate, il momento di massimo vigore.",
    ]);
    agg(stagione === "rallenta", [
      "La luce cala e loro rallentano: è normale.", "Si va verso il riposo, senza fretta.",
    ]);
    agg(calcolate.length >= 20, [
      `Ventiquattro vasi e tutto sotto controllo.`, "Una piccola giungla, e la conosci a memoria.",
    ]);

    if (!pool.length) return null;
    const seme = [...oggiStr()].reduce((a, c) => a + c.charCodeAt(0), 0);
    return pool[seme % pool.length];
  };

  const titolo = () => {
    const en = lingua === "en";
    if (!calcolate.length) return en ? "No plants yet" : "Nessuna pianta";
    if (dasete === 0) return calcolate[0].restanti === 1
      ? (en ? "One is due tomorrow" : "Domani tocca a una")
      : (en ? "Everything is fine" : "Sono tutte a posto");
    if (dasete === 1) return `${calcolate[0].nome} ${calcolate[0].modo === "acqua" ? (en ? "needs fresh water" : "vuole acqua nuova") : (en ? "is thirsty" : "ha sete")}`;
    return en ? `${dasete} plants are waiting` : `${dasete} piante ti aspettano`;
  };

  const statoTesto = (p) => {
    const n = Math.abs(p.restanti);
    if (p.restanti < 0) return lingua === "en" ? `${n} ${n === 1 ? "day" : "days"} overdue` : `in ritardo di ${n} ${n === 1 ? "giorno" : "giorni"}`;
    if (p.restanti <= 0) return lingua === "en" ? "today" : "oggi";
    if (p.restanti === 1) return lingua === "en" ? "tomorrow" : "domani";
    return lingua === "en" ? `in ${p.restanti} days` : `tra ${p.restanti} giorni`;
  };

  const stanzeTutte = useMemo(() => {
    const usate = piante.map((p) => p.stanza).filter(Boolean);
    return [...new Set([...STANZE_BASE, ...stanzeExtra, ...usate])];
  }, [piante, stanzeExtra]);

  const gruppi = useMemo(() => {
    const mappa = new Map();
    visibili.forEach((p) => {
      const k = p.stanza || L("Da assegnare");
      if (!mappa.has(k)) mappa.set(k, []);
      mappa.get(k).push(p);
    });
    return [...mappa.entries()].sort((a, b) =>
      a[0] === L("Da assegnare") ? 1 : b[0] === L("Da assegnare") ? -1 : a[0].localeCompare(b[0])
    );
  }, [visibili]);

  const grafici = useMemo(() => {
    const eventi = new Map(); // data -> conteggi per tipo
    const somma = (d, tipo) => {
      if (!eventi.has(d)) eventi.set(d, { acqua: 0, concime: 0, foglie: 0, tratt: 0 });
      eventi.get(d)[tipo] += 1;
    };
    piante.forEach((p) => {
      (p.storico || []).forEach((d) => somma(d, "acqua"));
      (p.storicoConcime || []).forEach((d) => somma(d, "concime"));
      (p.storicoTrattamenti || []).forEach((d) => somma(d, "tratt"));
      (p.foglie || []).forEach((d) => somma(d, "foglie"));
    });

    const oggi = parseData(oggiStr());
    const giornoSett = (oggi.getDay() + 6) % 7; // lunedì = 0
    const fine = new Date(oggi); fine.setDate(oggi.getDate() - giornoSett + 6);
    const settimane = [];
    for (let w = 11; w >= 0; w--) {
      const colonna = [];
      for (let g = 0; g < 7; g++) {
        const d = new Date(fine);
        d.setDate(fine.getDate() - w * 7 - (6 - g));
        const chiave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        colonna.push({ data: chiave, futuro: d > oggi, ...(eventi.get(chiave) || { acqua: 0, concime: 0, foglie: 0, tratt: 0 }) });
      }
      settimane.push(colonna);
    }

    const mesi = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date(oggi.getFullYear(), oggi.getMonth() - m, 1);
      const pref = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      let n = 0;
      piante.forEach((p) => (p.foglie || []).forEach((f) => { if (f.startsWith(pref)) n += 1; }));
      mesi.push({ etichetta: d.toLocaleDateString("it-IT", { month: "short" }), n });
    }

    const giorniFinestra = 180;
    const linea = calcolate
      .filter((p) => p.foglie?.some((f) => giorniDa(f) <= giorniFinestra))
      .map((p) => ({
        nome: p.nome,
        punti: p.foglie.filter((f) => giorniDa(f) <= giorniFinestra)
          .map((f) => ({ data: f, x: 100 - (giorniDa(f) / giorniFinestra) * 100 })),
        attesa: p.cresc?.ogni && p.cresc.prossima > 0 && p.cresc.prossima <= 45
          ? { x: 100 + (p.cresc.prossima / giorniFinestra) * 100, giorni: p.cresc.prossima }
          : null,
      }))
      .sort((a, b) => b.punti.length - a.punti.length);

    const tacche = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date(oggi.getFullYear(), oggi.getMonth() - m, 1);
      const dist = Math.round((oggi - d) / 86400000);
      if (dist <= giorniFinestra && dist >= 0)
        tacche.push({ etichetta: d.toLocaleDateString("it-IT", { month: "short" }), x: 100 - (dist / giorniFinestra) * 100 });
    }

    const lineaAcqua = calcolate
      .filter((p) => p.storico?.some((d) => giorniDa(d) <= giorniFinestra))
      .map((p) => ({
        nome: p.nome,
        punti: p.storico.filter((d) => giorniDa(d) <= giorniFinestra)
          .map((d) => ({ data: d, x: 100 - (giorniDa(d) / giorniFinestra) * 100 })),
      }))
      .sort((a, b) => b.punti.length - a.punti.length);

    const confronto = calcolate.filter((p) => p.ritmo).map((p) => ({ nome: p.nome, previsto: p.giorni, reale: p.ritmo }));
    const classifica = calcolate
      .filter((p) => p.cresc?.totale)
      .map((p) => ({ nome: p.nome, n: p.cresc.totale, ogni: p.cresc.ogni }))
      .sort((a, b) => b.n - a.n)
      .slice(0, 8);

    const totali = {
      acqua: piante.reduce((a, p) => a + (p.storico?.length || 0), 0),
      concime: piante.reduce((a, p) => a + (p.storicoConcime?.length || 0), 0),
      tratt: piante.reduce((a, p) => a + (p.storicoTrattamenti?.length || 0), 0),
      foglie: piante.reduce((a, p) => a + (p.foglie?.length || 0), 0),
    };

    return { settimane, mesi, confronto, classifica, totali, linea, lineaAcqua, tacche };
  }, [piante, calcolate]);

  const profilo = useMemo(() => {
    const acqua = piante.reduce((a, p) => a + (p.storico?.length || 0), 0);
    const foglie = piante.reduce((a, p) => a + (p.foglie?.length || 0), 0);
    const foglie90 = piante.reduce((a, p) => a + (p.foglie || []).filter((f) => giorniDa(f) <= 90).length, 0);
    const conRitmo = calcolate.filter((x) => x.ritmo);
    const puntuali = conRitmo.filter((x) => Math.abs(x.ritmo - x.giorni) <= 1).length;

    const fDi = (re) => piante.filter((p) => re.test(p.specie || "")).reduce((a, p) => a + (p.foglie?.length || 0), 0);

    const perGiorno = {};
    const conta = (d, t) => { (perGiorno[d] ||= { acqua: 0, foglie: 0, concime: 0, cure: 0 })[t] += 1; };
    piante.forEach((p) => {
      (p.storico || []).forEach((d) => conta(d, "acqua"));
      (p.foglie || []).forEach((d) => conta(d, "foglie"));
      (p.storicoConcime || []).forEach((d) => conta(d, "concime"));
      (p.storicoTrattamenti || []).forEach((d) => conta(d, "cure"));
    });
    const giorni = Object.values(perGiorno);
    const tutteLeDate = piante.flatMap((p) => [...(p.storico || []), ...(p.foglie || []), ...(p.storicoConcime || []), ...(p.storicoTrattamenti || [])]).sort();

    const dati = {
      acqua, foglie, foglie90, puntuali,
      piante: piante.length,
      specie: new Set(piante.map((p) => p.specie)).size,
      inAcqua: piante.filter((p) => p.modo === "acqua").length,
      sofferenti: piante.filter((p) => p.tag === "cura").length,
      forti: piante.filter((p) => p.tag === "forte").length,
      pulizie: piante.filter((p) => p.ultimaPulizia).length,
      concimi: piante.reduce((a, p) => a + (p.storicoConcime?.length || 0), 0),
      rinvasi: piante.filter((p) => p.ultimoRinvaso).length,
      riprese: piante.filter((p) => p.giaRipresa).length,
      invasate: piante.filter((p) => p.giaInvasata).length,
      stanzeUsate: new Set(piante.map((p) => p.stanza).filter(Boolean)).size,
      senzaStanza: piante.filter((p) => !p.stanza).length,
      inRitardo: calcolate.filter((p) => p.restanti < 0).length,
      fDeliciosa: fDi(/deliciosa/i),
      fAlocasia: fDi(/alocasia/i),
      fRegale: fDi(/regale/i),
      fWaro: fDi(/warocqueanum/i),
      fSansevieria: fDi(/sansevieria/i),
      fSedum: fDi(/sedum/i),
      fBlu: fDi(/phlebodium/i),
      haSedum: piante.some((q) => /sedum/i.test(q.specie || "")) ? 1 : 0,
      balcone: piante.some((q) => /balcon/i.test(q.stanza || "")) ? 1 : 0,
      inverno: (() => {
        const d = piante.flatMap((q) => [...(q.storico || []), ...(q.foglie || [])]);
        return d.some((x) => x.slice(5, 7) === "12") && d.some((x) => x.slice(5, 7) === "03") ? 1 : 0;
      })(),
      rinvasoGiusto: piante.some((q) => q.ultimoRinvaso && ["03", "04", "05"].includes(q.ultimoRinvaso.slice(5, 7))) ? 1 : 0,
      temiProvati: temiProvati.length,
      trattamenti: piante.reduce((a, q) => a + (q.storicoTrattamenti?.length || 0), 0),
      rotazioni: piante.filter((q) => q.ultimaRotazione).length * 4,
      legature: piante.filter((q) => q.ultimaLegatura).length * 3,
      famiglie: new Set(piante.map((q) => BOTANICA[q.specie]?.f).filter(Boolean)).size,
      aroidee: piante.filter((q) => BOTANICA[q.specie]?.f === "Araceae").length,
      marantacee: piante.filter((q) => BOTANICA[q.specie]?.f === "Marantaceae").length,
      felci: piante.filter((q) => /Polypodiaceae|Dryopteridaceae/.test(BOTANICA[q.specie]?.f || "")).length,
      grasse: piante.filter((q) => /Crassulaceae|Asparagaceae/.test(BOTANICA[q.specie]?.f || "")).length,
      senzaArrivo: piante.filter((q) => !q.arrivo).length,
      senzaVaso: piante.filter((q) => !q.vaso).length,
      senzaNota: piante.filter((q) => !q.nota?.trim()).length,
      conSostegno: piante.filter((q) => q.sostegno && q.sostegno !== "nessuno").length,
      traslochi: piante.reduce((a, q) => a + Math.max(0, (q.storicoStanza?.length || 1) - 1), 0),
      maxFoglie: piante.length ? Math.max(...piante.map((q) => q.foglie?.length || 0)) : 0,
      treCinque: piante.filter((q) => (q.foglie?.length || 0) >= 5).length,
      mature: piante.filter((q) => q.stadio === "matura").length,
      fPolly: fDi(/Polly/i),
      fFittonia: fDi(/fittonia/i),
      fPeperomia: fDi(/peperomia/i),
      fPothos: fDi(/epipremnum/i),
      haNome: io.nome?.trim() ? 1 : 0,
      haFoto: io.foto ? 1 : 0,
      libFatto: usato.includes("libretto") ? 1 : 0,
      diagFatta: usato.includes("diagnosi") ? 1 : 0,
      ricFatta: usato.includes("ricerca") ? 1 : 0,
      grigliaProvata: usato.includes("griglia") ? 1 : 0,
      stagioniProvate: stagioniProvate.length,
      estremi: ["piena", "riposo"].filter((k) => stagioniProvate.includes(k)).length,
      archiviate: piante.filter((q) => q.archiviata).length,
      inCima: piante.filter((q) => q.altezzaPalo && q.altezzaPianta && Number(q.altezzaPianta) >= Number(q.altezzaPalo) * 0.88).length,
      neemCompletati: usato.filter((u) => u === "neem-finito").length,
      fogliaInCura: piante.filter((q) => q.tag === "cura" && (q.foglie || []).some((f) => giorniDa(f) <= 60)).length,
      maxGiornoTotale: giorni.length ? Math.max(...giorni.map((g) => g.acqua + g.foglie + g.concime + g.cure)) : 0,
      meseFitto: (() => {
        const perMese = {};
        Object.keys(perGiorno).forEach((d) => { (perMese[d.slice(0, 7)] ||= new Set()).add(d); });
        return Object.values(perMese).some((v) => v.size >= 20) ? 1 : 0;
      })(),
      settimaneFila: (() => {
        const sett = new Set(Object.keys(perGiorno).map((d) => Math.floor(parseData(d) / 604800000)));
        if (!sett.size) return 0;
        const ord = [...sett].sort((a, b) => a - b);
        let best = 1, run = 1;
        for (let i = 1; i < ord.length; i++) { run = ord[i] === ord[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); }
        return best;
      })(),
      piuVecchia: piante.some((q) => q.arrivo && giorniDa(q.arrivo) > 1095) ? 1 : 0,
      maxPerStanza: (() => {
        const c = {};
        piante.forEach((q) => { if (q.stanza) c[q.stanza] = (c[q.stanza] || 0) + 1; });
        return Object.values(c).length ? Math.max(...Object.values(c)) : 0;
      })(),
      acquaDelicata: piante.filter((q) => /demineralizzata|riposata/.test(q.tipoAcqua || "")).length,
      fMarantacee: fDi(/maranta|calathea|fittonia/i),
      maxGiornoAcqua: giorni.length ? Math.max(...giorni.map((g) => g.acqua)) : 0,
      maxFoglieGiorno: giorni.length ? Math.max(...giorni.map((g) => g.foglie)) : 0,
      giornoCompleto: giorni.some((g) => g.acqua && g.foglie && g.concime && g.cure) ? 1 : 0,
      maxStorico: piante.length ? Math.max(...piante.map((p) => p.storico?.length || 0)) : 0,
      eta: tutteLeDate.length ? giorniDa(tutteLeDate[0]) : 0,
      esplorate: esplorate.length,
      riposoUsato: riposoUsato ? 1 : 0,
      copiaFatta: copiaFatta ? 1 : 0,
    };

    const salute = dati.piante ? (dati.forti + (dati.piante - dati.forti - dati.sofferenti) * 0.5) / dati.piante : 0;
    const punt = conRitmo.length ? puntuali / conRitmo.length : 0;
    const cresc = Math.min(1, dati.foglie90 / Math.max(3, dati.piante * 0.6));
    const cost = Math.min(1, acqua / Math.max(10, dati.piante * 2));
    const punteggio = Math.round(salute * 35 + punt * 25 + cresc * 25 + cost * 15);

    const etichetta =
      acqua < 5 ? "Si comincia"
      : punteggio >= 80 ? "Pollice verde vero"
      : punteggio >= 60 ? "Ci sai fare"
      : punteggio >= 40 ? "Sulla buona strada"
      : "In rodaggio";

    const presi = DISTINTIVI.filter((b) => b.v(dati) >= b.m);
    return { dati, punteggio, etichetta, conRitmo: conRitmo.length,
      presi: presi.length, segretiPresi: presi.filter((b) => b.segreto).length,
      segretiTot: DISTINTIVI.filter((b) => b.segreto).length };
  }, [piante, calcolate, riposoUsato, copiaFatta, esplorate, temiProvati, io, usato, stagioniProvate]);

  const autopsia = (p) => {
    const fine = p.archiviata?.data || oggiStr();
    const st = (p.storico || []).filter((d) => d <= fine).sort();
    const ultimi = st.filter((d) => (parseData(fine) - parseData(d)) / 86400000 <= 120);
    const salti = [];
    for (let i = 1; i < ultimi.length; i++)
      salti.push(Math.round((parseData(ultimi[i]) - parseData(ultimi[i - 1])) / 86400000));
    const medio = salti.length ? Math.round(salti.reduce((a, b) => a + b, 0) / salti.length) : null;
    const previsto = p.giorni || 7;
    const giorniConTe = p.arrivo ? Math.round((parseData(fine) - parseData(p.arrivo)) / 86400000) : null;
    const ultimaFoglia = p.foglie?.[0] ? Math.round((parseData(fine) - parseData(p.foglie[0])) / 86400000) : null;
    const en = lingua === "en";

    let causa, epitaffio;
    if (medio !== null && medio < previsto * 0.6) {
      causa = en
        ? `You watered it every ${medio} days instead of the ${previsto} it needed: nearly twice as often. The roots stayed wet without ever drying out.`
        : `La annaffiavi ogni ${medio} giorni invece dei ${previsto} previsti: quasi il doppio del necessario. Le radici sono rimaste bagnate senza mai asciugare.`;
      epitaffio = en ? "Died of too much love" : "Morta di troppe attenzioni";
    } else if (medio !== null && medio > previsto * 2) {
      causa = en
        ? `On average ${medio} days passed between waterings, against the ${previsto} it needed. It went thirsty for long stretches.`
        : `Passavano in media ${medio} giorni fra un'annaffiatura e l'altra, contro i ${previsto} che le servivano. Le è mancata l'acqua a lungo.`;
      epitaffio = en ? "Forgotten in a corner" : "Dimenticata in un angolo";
    } else if (!st.length) {
      causa = en ? "No watering was ever recorded: there isn't enough data to say what happened."
                 : "Non c'è nessuna annaffiatura registrata: non ci sono abbastanza dati per capire cosa sia successo.";
      epitaffio = en ? "Slipped away quietly" : "Andata via in silenzio";
    } else if (p.tag === "cura") {
      causa = en
        ? `It was already marked as struggling and never recovered.${ultimaFoglia !== null ? ` The last new leaf was ${ultimaFoglia} days earlier.` : " It never produced a new leaf while you had it."}`
        : `Era già segnata come sofferente e non si è ripresa.${ultimaFoglia !== null ? ` L'ultima foglia nuova risaliva a ${ultimaFoglia} giorni prima.` : " Non ha mai prodotto foglie nuove da quando la seguivi."}`;
      epitaffio = en ? "Arrived already ailing" : "Arrivata già malandata";
    } else if (ultimaFoglia !== null && ultimaFoglia > 120) {
      causa = en
        ? `Watering was regular, but it hadn't made a new leaf in ${ultimaFoglia} days: the problem was elsewhere, light or roots.`
        : `Le annaffiature erano regolari, ma non faceva una foglia nuova da ${ultimaFoglia} giorni: il problema era altrove, luce o radici.`;
      epitaffio = en ? "Stalled for too long" : "Ferma da troppo tempo";
    } else {
      causa = en ? "The care looks regular. It happens: not every death has an explanation in the data."
                 : "Le cure sembravano regolari. Capita: non tutte le morti hanno una spiegazione nei dati.";
      epitaffio = en ? "Nobody knows why" : "Nessuno sa perché";
    }
    return { causa, epitaffio, medio, previsto, giorniConTe, foglie: p.foglie?.length || 0 };
  };

  const bilancio = (p) => {
    const dentro = (arr, gg) => (arr || []).filter((x) => giorniDa(x.data || x) <= gg);
    const per90 = dentro(p.perdite, 90);
    const per30 = dentro(p.perdite, 30);
    const conta = (arr, t) => arr.filter((x) => x.tipo === t).length;
    const nuove90 = dentro(p.foglie, 90).length;
    const b = {
      totali: (p.perdite || []).length,
      morte: conta(p.perdite || [], "morta"), secche: conta(p.perdite || [], "secca"), gialle: conta(p.perdite || [], "gialla"),
      morte30: conta(per30, "morta"), secche30: conta(per30, "secca"), gialle30: conta(per30, "gialla"),
      perse90: per90.length, nuove90, netto: nuove90 - per90.length,
    };

    const st = (p.storico || []).filter((d) => giorniDa(d) <= 60).sort();
    const salti = [];
    for (let i = 1; i < st.length; i++) salti.push(Math.round((parseData(st[i]) - parseData(st[i - 1])) / 86400000));
    const medio = salti.length ? salti.reduce((a, x) => a + x, 0) / salti.length : null;
    b.bagnaTroppo = medio !== null && medio < p.intervallo * 0.7;
    b.bagnaPoco = medio !== null && medio > p.intervallo * 1.5;

    const en = lingua === "en";
    const ipotesi = [];
    if (b.gialle30 >= 2 && b.bagnaTroppo) ipotesi.push({ id: "marciume-radici",
      t: en ? `${b.gialle30} yellowing leaves in a month, and you water it every ${Math.round(medio)} days against the ${p.intervallo} planned: the likeliest cause is roots staying wet.`
            : `${b.gialle30} foglie ingiallite in un mese, e la annaffi ogni ${Math.round(medio)} giorni contro i ${p.intervallo} previsti: la causa più probabile sono le radici sempre bagnate.` });
    else if (b.gialle30 >= 2) ipotesi.push({ id: "carenza",
      t: en ? `${b.gialle30} yellowing leaves in a month with regular watering: look at feeding and light before touching the water.`
            : `${b.gialle30} foglie ingiallite in un mese con annaffiature regolari: guarda concime e luce prima di toccare l'acqua.` });
    if (b.secche30 >= 2) ipotesi.push({ id: "punte-secche",
      t: en ? `${b.secche30} leaves dried in a month: dry air or limescale in the water, not thirst.`
            : `${b.secche30} foglie secche in un mese: aria secca o calcare nell'acqua, non sete.` });
    if (b.morte30 >= 2) ipotesi.push({ id: b.bagnaTroppo ? "marciume-radici" : "sete",
      t: en ? `${b.morte30} leaves lost in a month: check the roots before anything else.`
            : `${b.morte30} foglie perse in un mese: controlla le radici prima di ogni altra cosa.` });

    if (!ipotesi.length && b.perse90 && b.netto >= 0)
      ipotesi.push({ id: null, t: en
        ? `It shed ${b.perse90} and made ${nuove90} in three months: normal turnover, the plant is gaining.`
        : `Ne ha perse ${b.perse90} e fatte ${nuove90} in tre mesi: ricambio normale, la pianta è in attivo.` });
    if (b.perse90 > nuove90 && b.perse90 >= 3)
      ipotesi.unshift({ id: null, t: en
        ? `In three months it lost ${b.perse90} leaves and made ${nuove90}: it's going backwards.`
        : `In tre mesi ha perso ${b.perse90} foglie e ne ha fatte ${nuove90}: sta arretrando.` });
    b.ipotesi = ipotesi;
    return b;
  };

  const imparato = useMemo(() => {
    const voci = [];

    const perStanza = {};
    calcolate.forEach((p) => {
      const k = p.stanza || L("senza stanza");
      (perStanza[k] ||= { piante: 0, foglie: 0 });
      perStanza[k].piante += 1;
      perStanza[k].foglie += (p.foglie || []).filter((f) => giorniDa(f) <= 180).length;
    });
    const stanze = Object.entries(perStanza).filter(([k, v]) => k !== L("senza stanza") && v.piante >= 2)
      .map(([k, v]) => ({ k, media: v.foglie / v.piante, piante: v.piante }))
      .sort((a, b) => b.media - a.media);
    if (stanze.length >= 2 && stanze[0].media > 0)
      voci.push({ t: L("La stanza che funziona"),
        d: `${L("In")} ${stanze[0].k} ${L("ogni pianta ha fatto in media")} ${stanze[0].media.toFixed(1)} ${L("foglie in sei mesi, contro")} ${stanze[stanze.length - 1].media.toFixed(1)} ${L("In").toLowerCase()} ${stanze[stanze.length - 1].k}. ${L("Se una pianta fatica, prova a spostarla.")}`,
        pronto: true });
    else voci.push({ t: L("La stanza che funziona"), d: L("Serve qualche mese di foglie segnate in almeno due stanze diverse."), pronto: false });

    const scarti = calcolate.filter((p) => p.ritmo).map((p) => ({ nome: p.nome, previsto: p.giorni, reale: p.ritmo, d: p.ritmo - p.giorni }));
    const lontani = scarti.filter((x) => Math.abs(x.d) >= 2).sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
    if (lontani.length)
      voci.push({ t: L("I ritmi veri"), pronto: true,
        d: `${L("Su")} ${scarti.length} ${L("piante con abbastanza storia,")} ${lontani.length} ${L("le annaffi con un ritmo diverso da quello previsto. La più lontana è")} ${lontani[0].nome}: ${lontani[0].reale} ${L("giorni invece di")} ${lontani[0].previsto}.` });
    else voci.push({ t: L("I ritmi veri"), pronto: false, d: L("Dopo tre annaffiature per pianta saprò se i tuoi intervalli reali corrispondono a quelli che ti sei dato.") });

    const perMese = {};
    calcolate.forEach((p) => (p.foglie || []).forEach((f) => { perMese[f.slice(5, 7)] = (perMese[f.slice(5, 7)] || 0) + 1; }));
    const mesi = Object.entries(perMese).sort((a, b) => b[1] - a[1]);
    if (mesi.length >= 3) {
      const nome = (m) => new Date(2000, Number(m) - 1, 1).toLocaleDateString(LOCALE, { month: "long" });
      voci.push({ t: L("Quando crescono"), pronto: true,
        d: `${L("Il mese più produttivo finora è")} ${nome(mesi[0][0])} ${L("con")} ${mesi[0][1]} ${L("foglie")}, ${L("il più fermo")} ${nome(mesi[mesi.length - 1][0])} ${L("con")} ${mesi[mesi.length - 1][1]}.` });
    } else voci.push({ t: L("Quando crescono"), pronto: false, d: L("Con foglie segnate in almeno tre mesi diversi saprai qual è il tuo periodo buono.") });

    const spostate = calcolate.filter((p) => (p.storicoStanza?.length || 0) > 1);
    if (spostate.length) {
      const s0 = spostate[0];
      const cambio = s0.storicoStanza[s0.storicoStanza.length - 1].da;
      const prima = (s0.foglie || []).filter((f) => f < cambio).length;
      const dopo = (s0.foglie || []).filter((f) => f >= cambio).length;
      voci.push({ t: L("Gli spostamenti"), pronto: true,
        d: `${s0.nome} ${L("è passata in")} ${s0.stanza} ${L("il")} ${formattaData(cambio)}: ${prima} ${L("foglie prima")}, ${dopo} ${L("dopo")}.` });
    } else voci.push({ t: L("Gli spostamenti"), pronto: false, d: L("Quando sposterai una pianta di stanza, confronterò le foglie prima e dopo.") });

    const trascurate = calcolate.map((p) => ({ nome: p.nome, g: ultimaAzione(p) ? giorniDa(ultimaAzione(p)) : 999 }))
      .sort((a, b) => b.g - a.g).filter((x) => x.g < 900);
    if (trascurate.length && trascurate[0].g > 20)
      voci.push({ t: L("La più dimenticata"), pronto: true,
        d: `${trascurate[0].nome} ${L("non la tocchi da")} ${trascurate[0].g} ${L("giorni")}. ${L("Capita sempre a quella che sta nell'angolo.")}` });

    return voci;
  }, [calcolate]);

  useEffect(() => {
    if (caricamento || !piante.length) return;
    const presi = DISTINTIVI.filter((b) => b.v(profilo.dati) >= b.m).map((b) => b.id);
    if (!Array.isArray(distintiviVisti)) { setDistintiviVisti(presi); return; }   // prima volta: nessun annuncio
    const nuovi = presi.filter((id) => !distintiviVisti.includes(id));
    if (nuovi.length) {
      setNuoviDistintivi(nuovi.map((id) => DISTINTIVI.find((b) => b.id === id)).filter(Boolean));
      setDistintiviVisti(presi);
      vibra("forte");
    }
  }, [profilo, caricamento, piante.length, distintiviVisti]);

  const riepilogo = useMemo(() => {
    const oggi = parseData(oggiStr());
    const primoDiQuesto = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
    const scorso = new Date(oggi.getFullYear(), oggi.getMonth() - 1, 1);
    const chiaveMese = `${scorso.getFullYear()}-${String(scorso.getMonth() + 1).padStart(2, "0")}`;
    const nel = (arr) => (arr || []).filter((d) => d.startsWith(chiaveMese)).length;

    const perPianta = calcolate
      .map((p) => ({ nome: p.nome, foglie: nel(p.foglie), acqua: nel(p.storico) }))
      .filter((x) => x.foglie > 0)
      .sort((a, b) => b.foglie - a.foglie);

    const rallentate = calcolate.filter((p) => {
      const uf = p.foglie?.[0] ? giorniDa(p.foglie[0]) : null;
      return p.cresc?.ogni && uf !== null && uf > p.cresc.ogni * 2;
    }).map((p) => p.nome);

    return {
      mese: scorso.toLocaleDateString("it-IT", { month: "long", year: "numeric" }),
      chiaveMese,
      foglie: calcolate.reduce((a, p) => a + nel(p.foglie), 0),
      acqua: calcolate.reduce((a, p) => a + nel(p.storico), 0),
      concime: calcolate.reduce((a, p) => a + nel(p.storicoConcime), 0),
      cure: calcolate.reduce((a, p) => a + nel(p.storicoTrattamenti), 0),
      perPianta,
      rallentate,
      inRitardo: calcolate.filter((p) => p.restanti < 0).map((p) => p.nome),
      noteOra: NOTE_MESE[oggi.getMonth()],
      meseOra: oggi.toLocaleDateString("it-IT", { month: "long" }),
      giorniDalPrimo: Math.round((oggi - primoDiQuesto) / 86400000),
    };
  }, [calcolate]);

  const chiudiRiepilogo = () => { setMeseVisto(riepilogo.chiaveMese); setRiepilogoAperto(false); };

  useEffect(() => {
    if (caricamento || !piante.length) return;
    const haStoria = piante.some((p) => p.storico?.length || p.foglie?.length);
    if (haStoria && riepilogo.giorniDalPrimo <= 6 && meseVisto !== riepilogo.chiaveMese) setRiepilogoAperto(true);
  }, [caricamento, piante, meseVisto, riepilogo.chiaveMese, riepilogo.giorniDalPrimo]);

  const bloccoRiepilogo = (
    <>
      <div className="cp-salute" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div><b>{riepilogo.foglie}</b><span>{L("foglie")}</span></div>
        <div><b>{riepilogo.acqua}</b><span>{L("acqua")}</span></div>
        <div><b>{riepilogo.concime}</b><span>{L("Concime").toLowerCase()}</span></div>
        <div><b>{riepilogo.cure}</b><span>{L("cure")}</span></div>
      </div>

      {riepilogo.perPianta.length > 0 ? (
        <p className="cp-riep-testo">
          <b>{riepilogo.perPianta[0].nome}</b> {L("è stata la migliore con")} {riepilogo.perPianta[0].foglie}{" "}
          {L(riepilogo.perPianta[0].foglie === 1 ? "foglia nuova" : "foglie nuove")}
          {riepilogo.perPianta.length > 1 && `, ${L("seguita da")} ${riepilogo.perPianta.slice(1, 3).map((x) => x.nome).join(L("e") === "and" ? " and " : " e ")}`}.
        </p>
      ) : (
        <p className="cp-riep-testo">Nessuna foglia nuova segnata nel mese.</p>
      )}

      {riepilogo.rallentate.length > 0 && (
        <p className="cp-riep-testo attenzione">
          {L("Da guardare da vicino:")} {riepilogo.rallentate.join(", ")} — {L(riepilogo.rallentate.length === 1 ? "ha rallentato rispetto al proprio ritmo" : "hanno rallentato rispetto al proprio ritmo")}.
        </p>
      )}

      {riepilogo.inRitardo.length > 0 && (
        <p className="cp-riep-testo attenzione">
          {L("In ritardo adesso:")} {riepilogo.inRitardo.slice(0, 6).join(", ")}
          {riepilogo.inRitardo.length > 6 && ` ${L("e altre")} ${riepilogo.inRitardo.length - 6}`}.
        </p>
      )}

      <p className="cp-riep-testo mese">
        <b>{riepilogo.meseOra.charAt(0).toUpperCase() + riepilogo.meseOra.slice(1)}:</b> {L(riepilogo.noteOra)}
      </p>
    </>
  );

  const riquadro = (p) => (
    <button key={p.id} className={`cp-riquadro ${p.stato}`} onClick={() => setDettaglio(p.id)}
      style={{ "--cedi": p.cedimento, "--lato": p.lato }}>
      <div className={`cp-riquadro-ill st-${p.stadio || "adulta"}`}>
        <Illustrazione tipo={p.ill} stadio={p.stadio} />
      </div>
      <span className="cp-riquadro-nome">{p.nome}</span>
      <span className="cp-riquadro-stato">{statoTesto(p)}</span>
    </button>
  );

  const pianoLibretto = (da, a) => {
    const inizio = parseData(da), fine = parseData(a);
    const giorni = new Map();
    const segna = (d, voce) => {
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!giorni.has(k)) giorni.set(k, []);
      giorni.get(k).push(voce);
    };
    calcolate.forEach((p) => {
      const proietta = (ultima, ogni, etichetta, urgente) => {
        if (!ogni || ogni < 1) return;
        let d = ultima ? parseData(ultima) : new Date(inizio);
        let guardia = 0;
        while (d < inizio && guardia++ < 400) d.setDate(d.getDate() + ogni);
        while (d <= fine && guardia++ < 400) {
          segna(new Date(d), { nome: p.nome, azione: etichetta, urgente, pianta: p });
          d.setDate(d.getDate() + ogni);
        }
      };
      proietta(p.ultima, p.intervallo, p.modo === "acqua" ? "cambio acqua" : "acqua", true);
      (p.cure || []).forEach((c) => {
        if (c.sospeso || !["concime", "neem"].includes(c.chiave)) return;
        const ogni = { concime: Math.round(p.concime * fase.concime), spray: 7, pulizia: 21,
          radicante: 14, neem: 7 }[c.chiave];
        const ultimo = { concime: p.ultimoConcime, spray: p.ultimoSpray, pulizia: p.ultimaPulizia,
          radicante: p.ultimoRadicante, neem: p.neemUltimo }[c.chiave];
        proietta(ultimo, ogni, c.etichetta.toLowerCase(), false);
      });
    });
    return [...giorni.entries()].sort().filter(([k]) => k >= da && k <= a);
  };

  const schedaProblema = (x0, k) => {
    const x = lingua === "en" ? { ...x0, ...EN_PROBLEMI[x0.id] } : x0;
    return (
    <section key={k} className="cp-grafico cp-problema">
      <div className="cp-prob-testa">
        <i className={`cp-prob-glifo ${x.cat}`}><Glifo nome={CATEGORIE[x.cat].ic} /></i>
        <div>
          <p className="cp-eyebrow" style={{ margin: 0 }}>{L(CATEGORIE[x.cat].t)}</p>
          <h2 className="cp-prob-titolo">{x.s}</h2>
        </div>
      </div>
      <p className="cp-perche">{x.c}</p>
      <ul className="cp-regole">{x.f.map((r, i) => <li key={i}>{r}</li>)}</ul>
      <p className="cp-quali" style={{ marginTop: 10 }}>
        {calcolate.filter((q) => (x.sp || []).some((k) => (q.specie || "").toLowerCase().includes(k.toLowerCase())))
          .map((q) => (
            <button key={q.id} className="cp-tag cp-tag-link" onClick={() => setDettaglio(q.id)}>{q.nome}</button>
          ))}
      </p>
      {x.cat === "bestie" && (
        <div className="cp-azione-problema">
          <span>{lingua === "en" ? "Start the neem cycle here, three passes seven days apart:" : "Parte da qui il ciclo di neem, tre passate a sette giorni:"}</span>
          <div className="cp-chips">
            {calcolate.filter((q) => (x.sp || []).some((k) => (q.specie || "").toLowerCase().includes(k.toLowerCase())))
              .map((q) => {
                const attivo = q.neemRestanti > 0;
                return (
                  <button key={q.id} className={`cp-chip ${attivo ? "scelta" : ""}`} disabled={attivo}
                    onClick={() => { avviaNeem(q.id); vibra("forte"); }}>
                    {attivo ? `${q.nome}: ${lingua === "en" ? "cycle running" : "ciclo in corso"}` : `${lingua === "en" ? "Start on" : "Avvia su"} ${q.nome}`}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </section>
    );
  };

  const chiaviVisibili = visibili.map((p) => p.id).join(",");
  const contesto = `${vista}|${filtro}|${cerca}|${densita}`;
  useEffect(() => {
    const ora = new Set(visibili.map((p) => p.id));
    const andate = eranoRef.current.filter((x) => !ora.has(x.p.id));
    const cambiataVista = contestoRef.current !== contesto;
    contestoRef.current = contesto;
    eranoRef.current = visibili.map((p, i) => ({ p, i }));
    if (!andate.length || cambiataVista || andate.length > 3) return;
    setUscenti((u) => [...u, ...andate.filter((a) => !u.some((x) => x.p.id === a.p.id))]);
    const ids = andate.map((a) => a.p.id);
    const t = setTimeout(() => setUscenti((u) => u.filter((x) => !ids.includes(x.p.id))), 400);
    return () => clearTimeout(t);
  }, [chiaviVisibili, contesto]);

  const conUscenti = (elenco) => {
    if (!uscenti.length) return elenco.map((p) => ({ p, esce: false }));
    const out = elenco.map((p) => ({ p, esce: false }));
    [...uscenti].sort((a, b) => a.i - b.i).forEach(({ p, i }) => {
      if (!out.some((x) => x.p.id === p.id)) out.splice(Math.min(i, out.length), 0, { p, esce: true });
    });
    return out;
  };

  const nonFare = useMemo(() => {
    const gruppi = [];
    const aggiungi = (titolo, motivo, elenco) => { if (elenco.length) gruppi.push({ titolo, motivo, elenco }); };

    aggiungi(L("Non annaffiare"), L("hanno ancora acqua a sufficienza: il terriccio è umido e aggiungerne è il modo più comune di far marcire le radici"),
      calcolate.filter((p) => p.restanti > Math.max(1, p.intervallo * 0.4)).map((p) => p.nome));

    aggiungi(L("Non concimare"), L("il concime è sospeso per un motivo, e darlo comunque brucia radici già in difficoltà"),
      calcolate.filter((p) => p.cure?.some((c) => c.chiave === "concime" && c.sospeso)).map((p) => p.nome));

    aggiungi(L("Non rinvasare"), L("sono arrivate o sono state rinvasate da poco: il trapianto adesso è solo stress"),
      calcolate.filter((p) => (p.arrivo && giorniDa(p.arrivo) < 40) || (p.ultimoRinvaso && giorniDa(p.ultimoRinvaso) < 60)).map((p) => p.nome));

    aggiungi(L("Non bagnare le foglie"), L("acqua sul velluto o nel cuore della rosetta lascia macchie o fa marcire il colletto"),
      calcolate.filter((p) => !p.spray && p.modo !== "acqua").map((p) => p.nome));

    aggiungi(L("Non toccare la patina"), L("la cera che le protegge dal sole non ricresce dove la sfiori con le dita"),
      calcolate.filter((p) => /sedum|crassul|echeveria/i.test(p.specie || "")).map((p) => p.nome));

    aggiungi(L("Non interrare il rizoma"), L("sono epifite: quel rizoma peloso deve restare in superficie o marcisce"),
      calcolate.filter((p) => /phlebodium/i.test(p.specie || "")).map((p) => p.nome));

    return gruppi;
  }, [calcolate]);

  const scheda = (p, esce = false) => {
    const aperta = !compatte || espanse.has(p.id);
    return (
          <article key={p.id} id={`pianta-${p.id}`}
            onTouchStart={(e) => inizioTocco(e, p.id)}
            onTouchMove={muoviTocco}
            onTouchEnd={() => fineTocco(p)}
            onTouchCancel={() => { tocco.current = null; setTrascina(null); }}
            style={trascina?.id === p.id
              ? { transform: `translateX(${trascina.dx}px)`, transition: "none",
                  "--pronto": Math.abs(trascina.dx) > SOGLIA ? 1 : 0 }
              : undefined}
            className={`cp-scheda ${esce ? "esce" : ""} ${p.stato} ${aperta ? "" : "ristretta"} ${evidenziata === p.id ? "evidenziata" : ""} ${p.fresca ? "fresca" : ""}`}>
            {trascina?.id === p.id && Math.abs(trascina.dx) > 6 && (
              <span className={`cp-gesto ${trascina.dx > 0 ? "acqua" : "scheda"}`}>
                {trascina.dx > 0 ? (p.modo === "acqua" ? "Acqua nuova" : "Annaffia") : "Apri scheda"}
              </span>
            )}
            <div className="cp-colonna"><div className="cp-colonna-liq" style={{ height: `${p.pieno * 100}%` }} /></div>
            <div className={`cp-ill st-${p.stadio || "adulta"}`} style={{ "--cedi": p.cedimento, "--lato": p.lato }}>
              <Illustrazione tipo={p.ill} stadio={p.stadio} />
            </div>
            <div className="cp-corpo">
              <button className="cp-riga1 cp-apri" onClick={() => compatte && apriChiudi(p.id)}
                aria-expanded={aperta} aria-label={`${p.nome}, ${statoTesto(p)}`}>
                <div className="cp-intestazione">
                  <p className="cp-soprannome">{p.nome}</p>
                  <h2 className="cp-nome">{specieBreve(p.specie)}</h2>
                </div>
                <span className="cp-stato">{statoTesto(p)}</span>
              </button>
              {p.messaggio && (
                <p className={`cp-messaggio ${p.messaggio.tono}`}>{p.messaggio.testo}</p>
              )}
              {!aperta && (
                <div className="cp-azioni">
                  <button className="cp-btn cp-btn-acqua" onClick={() => annaffia(p.id)}>
                    {L(p.modo === "acqua" ? "Acqua cambiata" : "Annaffiata")}
                  </button>
                  <button className="cp-link" onClick={() => apriChiudi(p.id)}>{L("dettagli")}</button>
                </div>
              )}
              {aperta && (<>
              <p className="cp-meta">
                {L(p.modo === "acqua" ? "cambio acqua" : "annaffia")} {lingua === "en" ? "every" : "ogni"} {p.intervallo} {L("giorni")}{p.luce ? ` · ${L(p.luce).toLowerCase()}` : ""}
                {p.tag && p.tag !== "forte" && <span className={`cp-tag ${p.tag}`}>{L(TAG[p.tag])}</span>}
              </p>
              {p.nota && <p className="cp-nota">{p.nota}</p>}

              <div className="cp-pannello">
                <div className="cp-stat">
                  {p.cresc ? (
                    <span>
                      <b>{p.cresc.totale}</b> {L(p.cresc.totale === 1 ? "foglia segnata" : "foglie segnate")}
                      {p.cresc.ogni ? ` · ${L("una ogni")} ${p.cresc.ogni} ${L("giorni")}` : ""}
                      {p.cresc.recenti ? ` · ${p.cresc.recenti} ${L("negli ultimi 3 mesi")}` : ""}
                    </span>
                  ) : (
                    <span>{L("Nessuna foglia nuova segnata")}</span>
                  )}
                  <button className="cp-mini" onClick={() => aggiungiFoglia(p.id)}>{L("+ foglia nuova")}</button>
                  <button className="cp-mini cp-mini-perdita" onClick={() => segnaPerdita(p.id, "gialla")}
                    title={L("Foglia ingiallita")}>+ {L("ingiallite").slice(0, -1)}a</button>
                  {p.cresc && <button className="cp-link" onClick={() => annullaFoglia(p.id)}>{L("annulla")}</button>}
                </div>

                {(() => {
                  const dovute = p.cure.filter((c) => !c.sospeso && c.restanti <= 0);
                  const attese = p.cure.filter((c) => !c.sospeso && c.restanti > 0);
                  const sospese = p.cure.filter((c) => c.sospeso);
                  return (
                    <>
                      {dovute.map((c) => (
                        <div key={c.chiave} className="cp-stat">
                          <b>{L(c.etichetta)} · {L(c.mai ? "mai fatto" : "da dare")}</b>
                          <button className="cp-mini" onClick={() => fattaCura(p.id, c.chiave)}>{L("Fatto")}</button>
                        </div>
                      ))}
                      {attese.length > 0 && (
                        <div className="cp-stat">
                          <span>{attese.map((c) => `${c.etichetta.toLowerCase()} tra ${c.restanti} gg`).join(" · ")}</span>
                        </div>
                      )}
                      {sospese.length > 0 && (
                        <div className="cp-stat">
                          <span>{L("Sospesi")}: {sospese.map((c) => `${L(c.etichetta).toLowerCase()} (${L(c.sospeso)})`).join(" · ")}</span>
                        </div>
                      )}
                      <div className="cp-stat">
                        {p.neemRestanti > 0 ? (
                          <>
                            <span>{L("Ciclo neem in corso:")} {p.neemRestanti} {L(p.neemRestanti === 1 ? "passaggio alla fine" : "passaggi alla fine")}</span>
                            <button className="cp-link" onClick={() => fermaNeem(p.id)}>{L("interrompi")}</button>
                          </>
                        ) : (
                          <>
                            <span>{L("Neem: nessun ciclo in corso")}</span>
                            <button className="cp-mini" onClick={() => avviaNeem(p.id)}>{L("Avvia ciclo neem")}</button>
                          </>
                        )}
                      </div>
                    </>
                  );
                })()}

                {p.ritmo && Math.abs(p.ritmo - p.giorni) >= 2 && (
                  <div className="cp-suggerimento">
                    <span>{L("Nei fatti la annaffi ogni")} {p.ritmo} {L("giorni")}, {L("non")} {p.giorni}.</span>
                    <button className="cp-mini" onClick={() => applicaRitmo(p.id, p.ritmo)}>{L("Usa")} {p.ritmo} {L("giorni")}</button>
                  </div>
                )}
              </div>

              {(p.metodo || p.tipoAcqua) && (
                <p className="cp-metodo">
                  {cura(p, "metodo")}
                  {p.tipoAcqua && <span className="cp-tipoacqua">{L("acqua")} {L(p.tipoAcqua)}</span>}
                </p>
              )}

              <div className="cp-azioni">
                <button className="cp-btn cp-btn-acqua" onClick={() => annaffia(p.id)}>
                  {L(p.modo === "acqua" ? "Acqua cambiata" : "Annaffiata")}
                </button>
                {p.storico?.[0] === oggiStr() && (
                  <button className="cp-link" onClick={() => annullaAnnaffiatura(p.id)}>annulla annaffiatura</button>
                )}
                {dataAperta === p.id ? (
                  <input className="cp-data" type="date" value={p.ultima} max={oggiStr()} autoFocus
                    onChange={(e) => e.target.value && impostaUltima(p.id, e.target.value)}
                    onBlur={() => setDataAperta(null)} />
                ) : (
                  <button className="cp-link" onClick={() => setDataAperta(p.id)}>
                    ultima: {formattaData(p.ultima)}
                  </button>
                )}
                <span style={{ flex: 1 }} />
                <button className="cp-link" onClick={() => setDettaglio(p.id)}>{L("Scheda")}</button>
                <button className="cp-link" onClick={() => setForm({ ...p })}>{L("Modifica")}</button>
                <button className="cp-link" onClick={() => setArchiviando(p)}>{L("Archivia")}</button>
                <button className="cp-link" onClick={() => elimina(p.id, p.nome)}>{L("Elimina")}</button>
                {compatte && <button className="cp-link" onClick={() => apriChiudi(p.id)}>{L("chiudi")}</button>}
              </div>
              </>)}
            </div>
          </article>
    );
  };

  if (caricamento)
    return <div className={`cp ${scuro ? "scuro" : ""}`}><div className="cp-wrap"><p className="cp-carica">{L("Apro l'elenco…")}</p></div></div>;

  return (
    <div className={`cp ${scuro ? "scuro" : ""}`}>
      
      <span ref={sondaRef} className="cp-sonda" aria-hidden="true" />
      <div className={`cp-fascia ${barraFerma ? "viva" : ""}`} aria-hidden="true" />
      {giuDiMolto && (
        <button className="cp-su" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={lingua === "en" ? "Back to top" : "Torna in cima"}
          title={lingua === "en" ? "Back to top" : "Torna in cima"}>↑</button>
      )}
      <div className={`cp-wrap ${testaRidotta && !["grafici", "terricci", "profilo", "acqua", "problemi"].includes(vista) ? "ridotta" : ""}`}>
        <p className="cp-eyebrow">{new Date().toLocaleDateString(LOCALE, { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="cp-titolo">{titolo()}</h1>
        {incoraggiamento() && <p className="cp-conforto">{L(incoraggiamento())}</p>}
        <p className="cp-sub">
          {calcolate.length} {L("piante")} · {calcolate.filter((p) => p.tag === "cura").length} {L("in sofferenza")} · {L("stagione di")} {L(fase.t).toLowerCase()}
        </p>

        {errore && <div className="cp-errore" role="alert">{errore}</div>}

        <div className="cp-mensola" aria-label={L("Riserva d'acqua di ogni pianta")}>
          {calcolate.map((p) => (
            <button key={p.id} className={`cp-tubo ${p.stato}`} title={`${p.nome} — ${statoTesto(p)}`}
              onClick={() => vaiAllaScheda(p.id)} aria-label={`${p.nome}, ${statoTesto(p)}. Vai alla scheda`}>
              <div className="cp-tubo-corpo"><div className="cp-tubo-liq" style={{ height: `${p.pieno * 100}%` }} /></div>
              <div className="cp-tubo-mini"><Illustrazione tipo={p.ill} stadio={p.stadio} /></div>
            </button>
          ))}
        </div>

        <nav className={`cp-nav ${barraFerma ? "agganciata" : ""}`} ref={barraRef} aria-label="Sezioni">
          <button aria-pressed={!["grafici", "terricci", "profilo", "acqua", "problemi"].includes(vista)} onClick={() => { ancoraBarra(); setVista(vistaPiante); }}>{L("Piante")}</button>
          <button aria-pressed={vista === "grafici"} onClick={() => vaiA("grafici")}>{L("Storico")}</button>
          <button aria-pressed={vista === "terricci"} onClick={() => vaiA("terricci")}>{L("Terricci")}</button>
          <button aria-pressed={vista === "acqua"} onClick={() => vaiA("acqua")}>{L("Acqua")}</button>
          <button aria-pressed={vista === "problemi"} onClick={() => vaiA("problemi")}>{L("Problemi")}</button>
          <button aria-pressed={vista === "profilo"} onClick={() => vaiA("profilo")}>{L("Profilo")}</button>
        </nav>

        <div className="cp-barra">
          {!["grafici", "terricci", "profilo", "acqua", "problemi"].includes(vista) && (
            <div className="cp-cerca">
              <input type="search" value={cerca} placeholder={L("Cerca una pianta")}
                onChange={(e) => { if (e.target.value) segna("ricerca"); setCerca(e.target.value); }} aria-label={L("Cerca")} />
              {cerca && <button onClick={() => setCerca("")} aria-label="Pulisci">×</button>}
            </div>
          )}
          <span style={{ flex: 1 }} />
          <button className="cp-link" onClick={() => setImpostazioni(true)}>{L("Altro")}</button>
          <button className="cp-btn" onClick={apriNuova}>{L("Aggiungi")}</button>
        </div>

        {!["grafici", "terricci", "profilo", "acqua", "problemi"].includes(vista) && (
          <div className="cp-modi" role="group" aria-label="Come guardare l'elenco">
            {[["oggi", "Oggi"], ["tutte", "Tutte"], ["cura", "Da seguire"], ["fermo", "Lascia stare"]].map(([k, et]) => (
              <button key={k} aria-pressed={filtro === k} onClick={() => setFiltro(k)}>{L(et)}</button>
            ))}
          </div>
        )}

        <div className="cp-sezione" key={vista}>
        {vista === "profilo" ? (
          <div className="cp-grafici">
            <section className="cp-grafico cp-io">
              <label className="cp-ritratto" title="Cambia foto">
                {io.foto ? <img src={io.foto} alt="" /> : <span>{(io.nome || "?").trim().charAt(0).toUpperCase()}</span>}
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => { if (e.target.files[0]) caricaFoto(e.target.files[0]); e.target.value = ""; }} />
              </label>
              <div className="cp-io-testo">
                {modificaIo ? (
                  <input className="cp-nome-campo" value={io.nome} autoFocus placeholder={L("Il tuo nome")}
                    onChange={(e) => setIo({ ...io, nome: e.target.value })}
                    onBlur={() => { salvaIo(io); setModificaIo(false); }}
                    onKeyDown={(e) => e.key === "Enter" && e.target.blur()} />
                ) : (
                  <button className="cp-io-nome" onClick={() => setModificaIo(true)}>
                    {io.nome?.trim() || L("Aggiungi il tuo nome")}
                  </button>
                )}
                <p className="cp-io-sotto">{L(profilo.etichetta)} · {profilo.presi} {L("distintivi su")} {DISTINTIVI.length}</p>
                <div className="cp-lingue">
                  <button aria-pressed={lingua === "it"} onClick={() => setLingua("it")}>Italiano</button>
                  <button aria-pressed={lingua === "en"} onClick={() => setLingua("en")}>English</button>
                </div>
                {io.foto && (
                  <button className="cp-link" onClick={() => salvaIo({ ...io, foto: "" })}>{L("togli foto")}</button>
                )}
              </div>
              <div className="cp-quadrante" style={{ "--q": `${profilo.punteggio * 3.6}deg` }}>
                <span>{profilo.punteggio}</span>
              </div>
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Come ti sto valutando")}</h2>
              <p className="cp-vuoto-testo" style={{ fontStyle: "normal" }}>
                {profilo.dati.acqua < 5
                  ? L("Il punteggio ha senso dopo qualche settimana di registrazioni: per ora è solo un punto di partenza.")
                  : L("Pesa la salute delle piante, quanto rispetti i ritmi che ti sei dato, le foglie nuove e la costanza. Annaffiare più del necessario non alza il punteggio.")}
              </p>
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Cosa ho imparato")}</h2>
              <div className="cp-imparato">
                {imparato.map((v) => (
                  <div key={v.t} className={`cp-lezione ${v.pronto ? "" : "attesa"}`}>
                    <b>{L(v.t)}</b>
                    <span>{L(v.d)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Come stanno")}</h2>
              <div className="cp-salute">
                <div><b>{profilo.dati.forti}</b><span>vanno forte</span></div>
                <div><b>{profilo.dati.piante - profilo.dati.forti - profilo.dati.sofferenti}</b><span>in mezzo</span></div>
                <div><b>{profilo.dati.sofferenti}</b><span>soffrono</span></div>
              </div>
              <p className="cp-vuoto-testo" style={{ marginTop: 12 }}>
                {profilo.dati.foglie90 > 0
                  ? `${profilo.dati.foglie90} ${L("foglie nuove negli ultimi tre mesi su")} ${profilo.dati.piante} ${L("piante")}.`
                  : L("Nessuna foglia nuova segnata negli ultimi tre mesi.")}
                {profilo.conRitmo > 0 && ` ${profilo.dati.puntuali} ${L("piante su")} ${profilo.conRitmo} ${L("le annaffi col ritmo previsto")}.`}
              </p>
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Il mese scorso")} · {riepilogo.mese}</h2>
              {bloccoRiepilogo}
            </section>

            {piante.some((p) => p.archiviata?.motivo === "morta") && (
              <section className="cp-grafico">
                <h2 className="cp-grafico-titolo">
                  {lingua === "en" ? "The graveyard" : "Il cimitero"}
                  <span className="cp-conteggio">{piante.filter((p) => p.archiviata?.motivo === "morta").length}</span>
                </h2>
                <p className="cp-perche">
                  {lingua === "en"
                    ? "Plants die on everyone. What matters is knowing why: under each stone is what the data says went wrong."
                    : "Le piante muoiono a tutti. Quello che conta è sapere perché: sotto ogni lapide c'è quello che dicono i dati."}
                </p>
                <div className="cp-cimitero">
                  {piante.filter((p) => p.archiviata?.motivo === "morta")
                    .sort((a, b) => b.archiviata.data.localeCompare(a.archiviata.data))
                    .map((p) => {
                      const a = autopsia(p);
                      return (
                        <div key={p.id} className="cp-lapide">
                          <div className="cp-lapide-cima">
                            <div className="cp-lapide-ill"><Illustrazione tipo={p.ill} stadio={p.stadio} /></div>
                            <div style={{ minWidth: 0 }}>
                              <p className="cp-lapide-qui">{lingua === "en" ? "Here lies" : "Qui giace"}</p>
                              <p className="cp-lapide-nome">{p.nome}</p>
                              <p className="cp-lapide-specie">{specieBreve(p.specie)}</p>
                              <p className="cp-lapide-epi">{a.epitaffio}</p>
                            </div>
                          </div>
                          <p className="cp-lapide-causa">{a.causa}</p>
                          <p className="cp-lapide-dati">
                            {formattaData(p.archiviata.data)}
                            {a.giorniConTe ? ` · ${a.giorniConTe} ${L("giorni")}` : ""}
                            {a.foglie ? ` · ${a.foglie} ${L("foglie")}` : ""}
                            {a.medio !== null ? ` · ${lingua === "en" ? "watered every" : "annaffiata ogni"} ${a.medio} ${L("giorni")} (${a.previsto})` : ""}
                          </p>
                          <button className="cp-link" onClick={() => ripristina(p.id)}>
                            {lingua === "en" ? "it's alive, bring it back" : "è viva, rimettila nell'elenco"}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {piante.some((p) => p.archiviata && p.archiviata.motivo !== "morta") && (
              <section className="cp-grafico">
                <h2 className="cp-grafico-titolo">
                  {lingua === "en" ? "Gone to a new home" : "Andate altrove"}
                  <span className="cp-conteggio">{piante.filter((p) => p.archiviata && p.archiviata.motivo !== "morta").length}</span>
                </h2>
                <div className="cp-archivio">
                  {piante.filter((p) => p.archiviata && p.archiviata.motivo !== "morta")
                    .sort((a, b) => b.archiviata.data.localeCompare(a.archiviata.data))
                    .map((p) => {
                      const inizio = p.arrivo || [...(p.storico || []), ...(p.foglie || [])].sort()[0];
                      const giorni = inizio ? Math.round((parseData(p.archiviata.data) - parseData(inizio)) / 86400000) : null;
                      return (
                        <div key={p.id} className="cp-arch-riga">
                          <div className="cp-arch-ill"><Illustrazione tipo={p.ill} stadio={p.stadio} /></div>
                          <div className="cp-arch-testo">
                            <p className="cp-soprannome">{p.nome}</p>
                            <p className="cp-arch-specie">{specieBreve(p.specie)}</p>
                            <p className="cp-arch-dati">
                              {L(MOTIVI[p.archiviata.motivo])} · {formattaData(p.archiviata.data)}
                              {p.foglie?.length ? ` · ${p.foglie.length} ${L("foglie")}` : ""}
                              {giorni ? ` · ${giorni} ${L("giorni")}` : ""}
                            </p>
                            <button className="cp-link" onClick={() => ripristina(p.id)}>
                              {lingua === "en" ? "bring it back" : "rimetti nell'elenco"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">
                {L("Distintivi")}
                <span className="cp-conteggio">
                  {profilo.presi} {L("di")} {DISTINTIVI.length} · {profilo.segretiPresi}/{profilo.segretiTot} {L("segreti")}
                </span>
              </h2>

              <div className="cp-distintivi">
                {DISTINTIVI.filter((b) => b.v(profilo.dati) >= b.m).map((b) => (
                  <div key={b.id} className={`cp-distintivo preso ${b.segreto ? "eraSegreto" : ""} ${b.g === "piante" ? "dipianta" : ""}`}>
                    <i className="cp-glifo"><Glifo nome={b.ic} /></i>
                    <b>{L(b.t)}</b>
                    <span>{L(b.d)}</span>
                  </div>
                ))}
              </div>

              <div className="cp-piu-avanti">
                <button className="cp-link" onClick={() => setMostraMancanti(!mostraMancanti)}>
                  {mostraMancanti ? L("nascondi quelli da sbloccare") : `${L("mostra quelli da sbloccare")} (${DISTINTIVI.length - profilo.presi})`}
                </button>
              </div>

              {mostraMancanti && (
                <div className="cp-distintivi" style={{ marginTop: 12 }}>
                  {DISTINTIVI.filter((b) => b.v(profilo.dati) < b.m).map((b) => {
                    const v = b.v(profilo.dati);
                    if (b.segreto) return (
                      <div key={b.id} className="cp-distintivo segreto">
                        <i className="cp-glifo"><Glifo nome="lucchetto" /></i>
                        <b>{L("Segreto")}</b>
                        <span>{L("Si scopre facendo qualcosa di particolare.")}</span>
                      </div>
                    );
                    return (
                      <div key={b.id} className={`cp-distintivo ${b.g === "piante" ? "dipianta" : ""}`}>
                        <i className="cp-glifo"><Glifo nome={b.ic} /></i>
                        <b>{L(b.t)}</b>
                        <span>{L(b.d)}</span>
                        {b.m > 1 && (
                          <>
                            <div className="cp-progresso"><i style={{ width: `${Math.min(100, (v / b.m) * 100)}%` }} /></div>
                            <em>{v} {L("di")} {b.m}</em>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        ) : vista === "problemi" ? (
          <div className="cp-grafici">
            {problemaSingolo && (() => {
              const x = PROBLEMI.find((q) => q.id === problemaSingolo);
              if (!x) return null;
              return (
                <>
                  <section className="cp-grafico">
                    <h2 className="cp-grafico-titolo">
                      {L("Da una delle tue piante")}
                      <button className="cp-link" onClick={() => setProblemaSingolo(null)}>{L("chiudi")}</button>
                    </h2>
                  </section>
                  {schedaProblema(x, "singolo")}
                </>
              );
            })()}

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">
                {L("Cosa vedi?")}
                {(diag.zona || diag.sintomo) && (
                  <button className="cp-link" onClick={() => setDiag({ zona: null, sintomo: null, risposta: null })}>{L("ricomincia")}</button>
                )}
              </h2>

              {!diag.zona && (
                <>
                  <p className="cp-perche">{L("Dove hai notato il problema?")}</p>
                  <div className="cp-chips">
                    {ZONE.map((z) => (
                      <button key={z.k} className="cp-chip"
                        onClick={() => { segna("diagnosi"); setDiag({ zona: z.k, sintomo: null, risposta: null }); }}>{L(z.t)}</button>
                    ))}
                  </div>
                </>
              )}

              {diag.zona && !diag.sintomo && (
                <>
                  <p className="cp-perche">{L(ZONE.find((z) => z.k === diag.zona)?.t)}: {L("che aspetto ha?")}</p>
                  <div className="cp-chips">
                    {SINTOMI.filter((x) => x.z === diag.zona).map((x) => (
                      <button key={x.t} className="cp-chip"
                        onClick={() => setDiag({ ...diag, sintomo: x.t, risposta: null })}>{L(x.t)}</button>
                    ))}
                  </div>
                </>
              )}

              {diag.sintomo && (() => {
                const sin = SINTOMI.find((x) => x.z === diag.zona && x.t === diag.sintomo);
                if (sin?.d && !diag.risposta) return (
                  <>
                    <p className="cp-perche"><b>{L(diag.sintomo)}.</b> {L(sin.d)}</p>
                    <div className="cp-chips">
                      {sin.r.map(([et]) => (
                        <button key={et} className="cp-chip" onClick={() => setDiag({ ...diag, risposta: et })}>{L(et)}</button>
                      ))}
                    </div>
                  </>
                );
                return <p className="cp-perche"><b>{L(diag.sintomo)}</b>{diag.risposta ? ` · ${L(diag.risposta)}` : ""}. {L("Ecco le cause più probabili, in ordine.")}</p>;
              })()}
            </section>

            {diag.sintomo && (() => {
              const sin = SINTOMI.find((x) => x.z === diag.zona && x.t === diag.sintomo);
              if (!sin) return null;
              const ids = sin.d ? (sin.r.find(([et]) => et === diag.risposta)?.[1] || null) : sin.esiti;
              if (!ids) return null;
              return ids.map((id, k) => {
                const x = PROBLEMI.find((q) => q.id === id);
                return x ? schedaProblema(x, k) : null;
              });
            })()}

            {!diag.sintomo && (
              <section className="cp-grafico">
                <h2 className="cp-grafico-titolo">{L("La regola che salva più piante")}</h2>
                <p className="cp-perche" style={{ marginBottom: 0 }}>
                  {lingua === "en"
                    ? "Touch the soil before you water. Most symptoms look alike and the same sign can mean opposite things: yellow leaves on wet soil and yellow leaves on dry soil are two different problems, and the first gets worse if you treat it like the second."
                    : "Prima di annaffiare, tocca il terriccio. Quasi tutti i sintomi si somigliano e lo stesso segno può voler dire cose opposte: foglie gialle su terra bagnata e foglie gialle su terra asciutta sono due problemi diversi, e il primo peggiora se lo tratti come il secondo."}
                </p>
              </section>
            )}

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">
                {L("Tutti i problemi")}
                <button className="cp-link" onClick={() => setTuttiProblemi(!tuttiProblemi)}>
                  {tuttiProblemi ? L("nascondi") : `${L("Vedi tutti")} (${PROBLEMI.length})`}
                </button>
              </h2>
              {tuttiProblemi && (
                <div className="cp-chips">
                  <button className={`cp-chip ${catProblema === "tutte" ? "scelta" : ""}`} onClick={() => setCatProblema("tutte")}>{L("Tutti")}</button>
                  {Object.entries(CATEGORIE).map(([k, v]) => (
                    <button key={k} className={`cp-chip ${catProblema === k ? "scelta" : ""}`} onClick={() => setCatProblema(k)}>{L(v.t)}</button>
                  ))}
                </div>
              )}
            </section>

            {tuttiProblemi && PROBLEMI.filter((x) => catProblema === "tutte" || x.cat === catProblema).map(schedaProblema)}
          </div>
        ) : vista === "acqua" ? (
          <div className="cp-grafici">
            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Perché conta")}</h2>
              <p className="cp-perche" style={{ marginBottom: 0 }}>
                {lingua === "en"
                  ? "The problem isn't chlorine, which evaporates on its own: it's limescale, the dissolved calcium and magnesium. That doesn't evaporate, and a little stays in the soil with every watering. After months the pH rises, the roots take up iron poorly and leaf tips go brown: it's the number one cause of brown tips, and it's almost always mistaken for thirst. The second culprit is fluoride, added in some water supplies, to which palms and spider plants are especially sensitive."
                  : "Il problema non è il cloro, che evapora da solo: è il calcare, cioè calcio e magnesio disciolti. Quello non evapora, e a ogni annaffiatura un po' ne resta nel terriccio. Dopo mesi il pH si alza, le radici assorbono peggio il ferro e le punte delle foglie si seccano: è la causa numero uno delle punte marroni, e viene quasi sempre scambiata per sete. Il secondo colpevole è il fluoro, aggiunto in certi acquedotti, a cui palme e Chlorophytum sono particolarmente sensibili."}
              </p>
            </section>

            {ACQUE.map((a0) => {
              const a = lingua === "en" ? { ...a0, ...EN_ACQUE[a0.id] } : a0;
              return (
                <section key={a0.id} className="cp-grafico">
                  <h2 className="cp-grafico-titolo">{a.t}<span className="cp-conteggio">{a.costo}</span></h2>
                  <p className="cp-acqua-riga"><b>{L("Come si ottiene.")}</b> {a.come}</p>
                  <p className="cp-acqua-riga buona"><b>{L("Risolve.")}</b> {a.risolve}</p>
                  <p className="cp-acqua-riga meno"><b>{L("Attenzione.")}</b> {a.problema}</p>
                  <p className="cp-quali">
                    {calcolate.filter((q) => (q.tipoAcqua || "") === a0.id ||
                      (a0.id === "demi" && /demineralizzata/.test(q.tipoAcqua || "")) ||
                      (a0.id === "riposata" && /riposata/.test(q.tipoAcqua || "")) ||
                      (a0.id === "rubinetto" && /rubinetto/.test(q.tipoAcqua || "")) ||
                      (a0.id === "piovana" && /piovana/.test(q.tipoAcqua || "")))
                      .map((q) => <span key={q.id} className="cp-tag" style={{ marginLeft: 0 }}>{q.nome}</span>)}
                  </p>
                </section>
              );
            })}

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{lingua === "en" ? "Two things worth knowing" : "Due cose da sapere"}</h2>
              <ul className="cp-regole">
                {lingua === "en" ? (<>
                  <li><b>Half and half works fine.</b> Pure distilled is rarely needed: mixed fifty-fifty with tap water it cuts the limescale enough and costs half as much.</li>
                  <li><b>Find out how hard yours is.</b> Your water company publishes the analysis online. Failing that, look at the bottom of your kettle: if it furs up fast, your water is hard.</li>
                </>) : (<>
                  <li><b>{L("Metà e metà funziona benissimo.")}</b> Demineralizzata pura non serve quasi mai: mescolata al cinquanta per cento con quella del rubinetto abbassa il calcare quanto basta e costa la metà.</li>
                  <li><b>{L("Scopri quanto è dura la tua.")}</b> Il gestore dell'acquedotto pubblica l'analisi sul sito, in gradi francesi: sotto i 15 °f il rubinetto va bene quasi ovunque, sopra i 25 °f conviene la demineralizzata per le delicate. Senza dati, guarda il fondo del bollitore: se si incrosta in fretta, è dura.</li>
                </>)}
              </ul>
            </section>
          </div>
        ) : vista === "terricci" ? (
          <div className="cp-grafici">
            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Cinque regole che valgono per tutte")}</h2>
              <ul className="cp-regole">
                <li><b>{L("Vaso solo 2-4 cm più largo.")}</b> {L("Uno troppo grande resta bagnato dove non ci sono radici, ed è lì che parte il marciume.")}</li>
                <li><b>{L("Niente strato di argilla sul fondo.")}</b> {L("È il consiglio più diffuso e più sbagliato: non drena, alza il livello dell'acqua stagnante verso le radici.")}</li>
                <li><b>{L("Il rinvaso di routine va da marzo ad agosto")}</b>, {L("quando la pianta ha la forza di rifare radici. Il periodo migliore è la primavera, ma fino a fine estate restano settimane utili di crescita. Da metà settembre in poi meglio aspettare.")}</li>
                <li><b>{L("Il rinvaso di soccorso non ha stagione.")}</b> {L("Radici marce, substrato esaurito o compattato, pianta che soffoca in un vaso troppo stretto: in questi casi si interviene subito, anche a dicembre. Il rischio di aspettare è più grande di quello di rinvasare.")}</li>
                <li><b>{L("Dopo il rinvaso, un mese senza concime.")}</b> {L("Il substrato nuovo ne ha già, e le radici tagliate si bruciano.")}</li>
                <li><b>{L("Annaffiatura leggera")}</b> {L("subito dopo, poi si aspetta che asciughi bene: le radici cercano l'acqua e si allungano.")}</li>
              </ul>
            </section>

            {Object.entries(MISCELE).map(([k, m0]) => {
              const m = lingua === "en" ? { ...m0, ...EN_MISCELE[k] } : m0;
              return (
              <section key={k} className="cp-grafico">
                <h2 className="cp-grafico-titolo">{m.titolo}</h2>
                <div className="cp-ricetta">
                  {m.parti.map((parte, i) => <span key={i} className="cp-parte">{parte}</span>)}
                </div>
                <p className="cp-perche">{m.perche}</p>
                <p className="cp-quali">
                  {calcolate.filter((q) => q.miscela === k).map((q) => (
                    <span key={q.id} className="cp-tag" style={{ marginLeft: 0 }}>{q.nome}</span>
                  ))}
                </p>
              </section>
            );})}
          </div>
        ) : vista === "grafici" ? (
          <div className="cp-grafici">
            <div className="cp-totali">
              <div><b>{grafici.totali.acqua}</b><span>{L("annaffiature")}</span></div>
              <div><b>{grafici.totali.foglie}</b><span>{L("foglie nuove")}</span></div>
              <div><b>{grafici.totali.concime}</b><span>{L("Concimazioni").toLowerCase()}</span></div>
              <div><b>{grafici.totali.tratt}</b><span>{L("trattamenti")}</span></div>
            </div>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">
                {new Date().toLocaleDateString(LOCALE, { month: "long", year: "numeric" })}
              </h2>
              {(() => {
                const oggi = new Date();
                const anno = oggi.getFullYear(), mese = oggi.getMonth();
                const primo = new Date(anno, mese, 1);
                const giorniMese = new Date(anno, mese + 1, 0).getDate();
                const vuoti = (primo.getDay() + 6) % 7;                 // la settimana comincia di lunedì
                const iniziali = lingua === "en"
                  ? ["M", "T", "W", "T", "F", "S", "S"]
                  : ["L", "M", "M", "G", "V", "S", "D"];
                const dati = Object.fromEntries(grafici.settimane.flat().map((g) => [g.data, g]));
                const celle = [];
                for (let k = 0; k < vuoti; k++) celle.push(null);
                for (let d = 1; d <= giorniMese; d++)
                  celle.push(`${anno}-${String(mese + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
                return (
                  <div className="cp-mese">
                    {iniziali.map((x, k) => <span key={k} className="cp-mese-iniziale">{x}</span>)}
                    {celle.map((data, k) => {
                      if (!data) return <span key={`v${k}`} className="cp-mese-vuoto" />;
                      const g = dati[data] || { acqua: 0, tratt: 0, concime: 0, foglie: 0 };
                      const num = Number(data.slice(-2));
                      const futuro = data > oggiStr();
                      const parti = [["acqua", g.acqua], ["tratt", g.tratt], ["concime", g.concime], ["foglie", g.foglie]]
                        .filter(([, n]) => n > 0);
                      return (
                        <div key={data}
                          className={`cp-mese-cella ${futuro ? "futuro" : ""} ${data === oggiStr() ? "oggi" : ""}`}
                          title={`${formattaData(data)}${parti.length ? " · " + parti.map(([t, n]) =>
                            `${n} ${{ acqua: L("acqua"), tratt: L("cure"), concime: L("Concime").toLowerCase(), foglie: L("foglie") }[t]}`).join(", ") : ""}`}>
                          <span className="cp-mese-num">{num}</span>
                          {parti.length > 0 && (
                            <span className="cp-mese-fette">
                              {parti.map(([t]) => <i key={t} className={`cp-fetta ${t}`} />)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
              <div className="cp-legenda">
                <span><i className="cp-punto acqua" />{L("acqua")}</span>
                <span><i className="cp-punto concime" />{L("Concime").toLowerCase()}</span>
                <span><i className="cp-punto tratt" />{L("tonico o radicante")}</span>
                <span><i className="cp-punto foglie" />{L("foglia nuova")}</span>
              </div>
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Quando sono arrivate le foglie")}</h2>
              {grafici.linea.length === 0 ? (
                <p className="cp-vuoto-testo">Ogni foglia che segni diventa un punto su questa linea. Con qualche mese di dati si vede a occhio chi ha rallentato e chi no.</p>
              ) : (
                <div className="cp-linea">
                  {grafici.linea.map((r) => (
                    <div key={r.nome} className="cp-linea-riga">
                      <span className="cp-conf-nome">{r.nome}</span>
                      <div className="cp-pista">
                        <div className="cp-pista-fondo" />
                        {r.punti.map((pt, k) => (
                          <i key={pt.data + k} className="cp-punto-foglia" style={{ left: `${pt.x}%` }} title={formattaData(pt.data)} />
                        ))}
                        {r.attesa && (
                          <i className="cp-punto-atteso" style={{ left: `${Math.min(99, r.attesa.x)}%` }}
                            title={`attesa fra circa ${r.attesa.giorni} giorni`} />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="cp-linea-riga">
                    <span className="cp-conf-nome" />
                    <div className="cp-pista cp-asse">
                      {grafici.tacche.map((t) => (
                        <span key={t.etichetta} className="cp-tacca" style={{ left: `${t.x}%` }}>{t.etichetta}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Quando le hai annaffiate")}</h2>
              {grafici.lineaAcqua.length === 0 ? (
                <p className="cp-vuoto-testo">Ogni annaffiatura diventa un punto. Punti regolari significano ritmo costante, gruppi separati da vuoti lunghi significano che ti dimentichi e poi recuperi.</p>
              ) : (
                <div className="cp-linea">
                  {grafici.lineaAcqua.map((r) => (
                    <div key={r.nome} className="cp-linea-riga">
                      <span className="cp-conf-nome">{r.nome}</span>
                      <div className="cp-pista">
                        <div className="cp-pista-fondo" />
                        {r.punti.map((pt, k) => (
                          <i key={pt.data + k} className="cp-punto-acqua" style={{ left: `${pt.x}%` }} title={formattaData(pt.data)} />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="cp-linea-riga">
                    <span className="cp-conf-nome" />
                    <div className="cp-pista cp-asse">
                      {grafici.tacche.map((t) => (
                        <span key={t.etichetta} className="cp-tacca" style={{ left: `${t.x}%` }}>{t.etichetta}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Foglie nuove per mese")}</h2>
              {grafici.totali.foglie === 0 ? (
                <p className="cp-vuoto-testo">Segna le foglie con "+ foglia nuova" e qui vedrai il ritmo di crescita di tutta la casa mese per mese.</p>
              ) : (
                <div className="cp-barre">
                  {grafici.mesi.map((m, i) => {
                    const max = Math.max(...grafici.mesi.map((x) => x.n), 1);
                    return (
                      <div key={i} className="cp-barra-col">
                        <div className="cp-barra-vaso">
                          <div className="cp-barra-riemp" style={{ height: `${(m.n / max) * 100}%` }} />
                        </div>
                        <span className="cp-barra-num">{m.n || ""}</span>
                        <span className="cp-barra-eti">{m.etichetta}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Previsto contro reale")}</h2>
              {grafici.confronto.length === 0 ? (
                <p className="cp-vuoto-testo">Dopo tre annaffiature per pianta qui compare il confronto tra l'intervallo previsto e quello con cui la annaffi davvero.</p>
              ) : (
                <div className="cp-confronto">
                  {grafici.confronto.map((c) => {
                    const max = Math.max(c.previsto, c.reale);
                    return (
                      <div key={c.nome} className="cp-conf-riga">
                        <span className="cp-conf-nome">{c.nome}</span>
                        <div className="cp-conf-barre">
                          <div className="cp-conf-b previsto" style={{ width: `${(c.previsto / max) * 100}%` }}>{c.previsto}</div>
                          <div className="cp-conf-b reale" style={{ width: `${(c.reale / max) * 100}%` }}>{c.reale}</div>
                        </div>
                      </div>
                    );
                  })}
                  <p className="cp-legenda"><span><i className="cp-punto previsto" />previsto</span><span><i className="cp-punto acqua" />reale</span></p>
                </div>
              )}
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Bilancio delle foglie")}</h2>
              <p className="cp-perche">
                {lingua === "en" ? "New leaves against leaves lost, over the last three months."
                                 : "Foglie nuove contro foglie perse, negli ultimi tre mesi."}
              </p>
              {(() => {
                const righe = calcolate.map((p) => {
                  const n = (p.foglie || []).filter((f) => giorniDa(f) <= 90).length;
                  const q = (p.perdite || []).filter((x) => giorniDa(x.data) <= 90).length;
                  return { id: p.id, nome: p.nome, n, q, netto: n - q };
                }).filter((r) => r.n || r.q).sort((a, b) => a.netto - b.netto || b.q - a.q);
                if (!righe.length) return (
                  <p className="cp-vuoto-testo">
                    {lingua === "en" ? "Nothing recorded yet." : "Ancora niente di segnato."}
                  </p>
                );
                const max = Math.max(...righe.map((r) => Math.max(r.n, r.q)), 1);
                return (
                  <div className="cp-bil">
                    <div className="cp-bil-testa">
                      <span>{L("perse")}</span>
                      <span>{L("nuove")}</span>
                    </div>
                    {righe.map((r) => (
                      <button key={r.id} className="cp-bil-riga" onClick={() => setDettaglio(r.id)}>
                        <span className="cp-bil-nome">{r.nome}</span>
                        <span className="cp-bil-pista">
                          <i className="cp-bil-asse" />
                          {r.q > 0 && (
                            <i className="cp-bil-barra perse" style={{ width: `${(r.q / max) * 50}%` }}>
                              <em>{r.q}</em>
                            </i>
                          )}
                          {r.n > 0 && (
                            <i className="cp-bil-barra nuove" style={{ width: `${(r.n / max) * 50}%` }}>
                              <em>{r.n}</em>
                            </i>
                          )}
                        </span>
                        <span className={`cp-bil-netto ${r.netto < 0 ? "male" : r.netto > 0 ? "bene" : ""}`}>
                          {r.netto > 0 ? "+" : ""}{r.netto}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </section>

            <section className="cp-grafico">
              <h2 className="cp-grafico-titolo">{L("Chi cresce di più")}</h2>
              {grafici.classifica.length === 0 ? (
                <p className="cp-vuoto-testo">Qui finiranno le piante che producono più foglie, con il loro ritmo medio.</p>
              ) : (
                <div className="cp-classifica">
                  {grafici.classifica.map((c) => (
                    <div key={c.nome} className="cp-cl-riga">
                      <span className="cp-conf-nome">{c.nome}</span>
                      <span className="cp-cl-val">
                        <b>{c.n}</b> {L(c.n === 1 ? "foglia" : "foglie")}{c.ogni ? ` · ${L("una ogni")} ${c.ogni} ${L("gg")}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : vista === "urgenza" ? (
          <>
          {filtro === "fermo" && (
            <section className="cp-grafico cp-nonfare">
              <h2 className="cp-grafico-titolo">{L("Oggi lascia stare")}</h2>
              <p className="cp-perche">
                {L("Metà dei danni alle piante d'appartamento nasce dal fare qualcosa, non dal dimenticarsene. Queste stanno bene così come sono.")}
              </p>
              {nonFare.map((g) => (
                <div key={g.titolo} className="cp-nf-gruppo">
                  <h3>{L(g.titolo)} <span>{g.elenco.length}</span></h3>
                  <p className="cp-nf-motivo">{L(g.motivo)}</p>
                  <p className="cp-quali">
                    {g.elenco.map((n) => <span key={n} className="cp-tag" style={{ marginLeft: 0 }}>{n}</span>)}
                  </p>
                </div>
              ))}
            </section>
          )}
          {filtro !== "fermo" && gestiUsati < 3 && visibili.length > 0 && densita !== "griglia" && (
            <div className="cp-suggerisce">
              <span><i className="cp-freccia">→</i> {L("scorri a destra per annaffiare")}</span>
              <span><i className="cp-freccia">←</i> {L("a sinistra per aprire la scheda")}</span>
              <button onClick={() => setGestiUsati(3)} aria-label="Ho capito">×</button>
            </div>
          )}
          {calcolate.length === 0 ? (
            <div className="cp-niente">
              <div className="cp-niente-ill"><Illustrazione tipo="deliciosa" stadio="adulta" /></div>
              <p className="cp-niente-t">{lingua === "en" ? "No plants yet" : "Ancora nessuna pianta"}</p>
              <p className="cp-niente-d">
                {lingua === "en"
                  ? "Add the ones you have at home. Each becomes a column of water that empties day by day: when it's empty, it's time to water."
                  : "Aggiungi quelle che hai in casa. Ognuna diventa una colonna d'acqua che si svuota giorno dopo giorno: quando è vuota, è ora di annaffiare."}
              </p>
              <div className="cp-chips" style={{ justifyContent: "center", marginBottom: 16 }}>
                {["Monstera deliciosa", "Epipremnum aureum (pothos)", "Sansevieria (snake plant)",
                  "Spathiphyllum (spatifillo)", "Calathea", "Chlorophytum (spider plant)"].map((sp) => (
                  <button key={sp} className="cp-chip" onClick={() => {
                    const spec = SPECIE.find((x) => x.nome === sp);
                    const base0 = PROFILI[sp] || PROFILI["Altro"];
                    const pr = lingua === "en" ? { ...base0, ...(EN_PROFILI[sp] || {}) } : base0;
                    apriNuova();
                    setTimeout(() => setForm((f) => ({ ...f, specie: sp, nome: specieBreve(sp).split(" ")[0],
                      giorni: spec?.giorni || pr.giorni, luce: spec?.luce || "", ill: spec?.ill || "generica",
                      concime: pr.concime, miscela: pr.miscela, rinvaso: pr.rinvaso, metodo: pr.metodo,
                      tipoAcqua: pr.tipoAcqua, consiglio: pr.consiglio, sostegno: pr.sostegno || "nessuno",
                      spray: !!pr.spray, radicante: !!pr.radicante, pulizia: !!pr.pulizia, rotazione: !!pr.rotazione })), 0);
                  }}>{specieBreve(sp)}</button>
                ))}
              </div>
              <button className="cp-btn" onClick={apriNuova}>{L("Aggiungi")}</button>
            </div>
          ) : filtro === "fermo" ? null : visibili.length === 0 ? (
            <div className="cp-niente">
              <div className="cp-niente-ill"><Illustrazione tipo="maranta" /></div>
              <p className="cp-niente-t">
                {cerca ? (lingua === "en" ? `No results for “${cerca}”.` : `Nessun risultato per “${cerca}”.`) : L(filtro === "oggi" ? "Nessuna pianta da annaffiare oggi." : "Nessuna pianta da tenere d'occhio.")}
              </p>
              <p className="cp-niente-d">
                {L(cerca ? "Prova col nome, la specie o la stanza." : filtro === "oggi" ? "Puoi anche non aprire l'app fino a domani." : "Vuol dire che stanno tutte abbastanza bene.")}
              </p>
              <button className="cp-btn cp-btn-ghost" onClick={() => { setFiltro("tutte"); setCerca(""); }}>{L("Vedile tutte")}</button>
            </div>
          ) : densita === "griglia"
            ? <div className="cp-griglia">{visibili.map((p) => riquadro(p))}</div>
            : <div className="cp-lista">{conUscenti(visibili).map(({ p, esce }) => scheda(p, esce))}</div>
          }
          </>
        ) : (
          gruppi.map(([stanza, elenco]) => (
            <section key={stanza} className="cp-gruppo">
              <h2 className="cp-stanza-titolo">
                {stanza}
                <span>{elenco.length} {elenco.length === 1 ? "pianta" : "piante"}</span>
              </h2>
              {densita === "griglia"
                ? <div className="cp-griglia">{elenco.map((p) => riquadro(p))}</div>
                : <div className="cp-lista">{conUscenti(elenco).map(({ p, esce }) => scheda(p, esce))}</div>}
            </section>
          ))
        )}
        </div>
      </div>

      {riepilogoAperto && (
        <div className="cp-velo" onClick={(e) => e.target === e.currentTarget && chiudiRiepilogo()}>
          <div className="cp-modale" role="dialog" aria-modal="true" aria-label="Riepilogo del mese">
            <p className="cp-eyebrow" style={{ margin: 0 }}>{L("Riepilogo")}</p>
            <h2 style={{ marginTop: 4 }}>{riepilogo.mese}</h2>
            {bloccoRiepilogo}
            <div className="cp-modale-azioni">
              <button className="cp-btn" onClick={chiudiRiepilogo}>{L("Chiudi")}</button>
            </div>
          </div>
        </div>
      )}

      {libretto && (() => {
        const piano = pianoLibretto(libretto.da, libretto.a);
        const coinvolte = new Set(piano.flatMap(([, v]) => v.map((x) => x.nome)));
        const ferme = calcolate.filter((p) => !coinvolte.has(p.nome));
        const delicate = calcolate.filter((p) => /demineralizzata|riposata/.test(p.tipoAcqua || ""));
        return (
          <div className="cp-velo cp-velo-pieno">
            <div className="cp-foglio cp-libretto" role="dialog" aria-modal="true">
              <div className="cp-solo-schermo">
                <div className="cp-foglio-testa">
                  <div style={{ minWidth: 0 }}>
                    <p className="cp-eyebrow" style={{ margin: 0 }}>Libretto</p>
                    <h2 className="cp-nome" style={{ fontSize: 24 }}>{L("Istruzioni per chi annaffia")}</h2>
                  </div>
                  <button className="cp-chiudi" onClick={() => setLibretto(null)} aria-label={L("Chiudi")}>×</button>
                </div>
                <div className="cp-periodo">
                  <label>Dal <input type="date" value={libretto.da} onChange={(e) => setLibretto({ ...libretto, da: e.target.value })} /></label>
                  <label>Al <input type="date" value={libretto.a} min={libretto.da} onChange={(e) => setLibretto({ ...libretto, a: e.target.value })} /></label>
                  <button className="cp-btn" onClick={() => window.print()}>{L("Stampa")}</button>
                </div>
              </div>

              <div className="cp-stampabile">
                <h1 className="cp-lib-titolo">{L("Le piante di casa")}{io.nome ? (lingua === "en" ? ` of ${io.nome}` : ` di ${io.nome}`) : ""}</h1>
                <p className="cp-lib-sotto">
                  Dal {formattaData(libretto.da)} al {formattaData(libretto.a)} · {calcolate.length} piante · stagione di {fase.t.toLowerCase()}
                </p>

                <section className="cp-lib-sez">
                  <h2>{L("Tre regole che valgono per tutte")}</h2>
                  <ul>
                    <li>{L("Meglio poca acqua che troppa: quasi tutte muoiono annegate, nessuna muore per un giorno di ritardo.")}</li>
                    <li>{lingua === "en" ? "After watering, " : "Dopo aver annaffiato, "}<b>{L("svuota sempre il sottovaso")}</b>: {L("l'acqua ferma fa marcire le radici")}.</li>
                    <li>{L("Se una pianta non è nell'elenco del giorno,")} <b>{L("non toccarla")}</b>.</li>
                  </ul>
                </section>

                {delicate.length > 0 && (
                  <section className="cp-lib-sez">
                    <h2>{L("Attenzione all'acqua")}</h2>
                    <p>Queste vogliono acqua demineralizzata (quella da ferro da stiro) oppure acqua di rubinetto
                      lasciata riposare una notte in una brocca aperta. Il rubinetto diretto lascia macchie e brucia le punte.</p>
                    <p className="cp-lib-elenco">{delicate.map((p) => `${p.nome} (${p.tipoAcqua})`).join(" · ")}</p>
                  </section>
                )}

                <section className="cp-lib-sez">
                  <h2>{L("Giorno per giorno")}</h2>
                  {piano.length === 0 && <p>{L("In questo periodo non c'è niente da fare.")}</p>}
                  {piano.map(([giorno, voci]) => (
                    <div key={giorno} className="cp-lib-giorno">
                      <h3>{parseData(giorno).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</h3>
                      <ul>
                        {voci.sort((a, b) => Number(b.urgente) - Number(a.urgente)).map((v, i) => (
                          <li key={i} className={v.urgente ? "acqua" : ""}>
                            <b>{v.nome}</b> — {v.azione}
                            {v.urgente && v.pianta.metodo ? `. ${v.pianta.metodo}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>

                {ferme.length > 0 && (
                  <section className="cp-lib-sez">
                    <h2>{L("Da non toccare")}</h2>
                    <p>In questo periodo non hanno bisogno di niente: {ferme.map((p) => p.nome).join(", ")}.</p>
                  </section>
                )}

                <section className="cp-lib-sez">
                  <h2>{L("Dove sono e come si annaffiano")}</h2>
                  {[...new Set(calcolate.map((p) => p.stanza || L("Da assegnare")))].sort().map((st) => (
                    <div key={st} className="cp-lib-stanza">
                      <h3>{st}</h3>
                      {calcolate.filter((p) => (p.stanza || L("Da assegnare")) === st).map((p) => (
                        <p key={p.id} className="cp-lib-pianta">
                          <b>{p.nome}</b> <i>{specieBreve(p.specie)}</i> — ogni {p.intervallo} giorni
                          {p.tipoAcqua ? `, ${L("acqua")} ${L(p.tipoAcqua)}` : ""}
                          {p.metodo ? `. ${p.metodo}` : ""}
                        </p>
                      ))}
                    </div>
                  ))}
                </section>

                <section className="cp-lib-sez">
                  <h2>{L("Se qualcosa va storto")}</h2>
                  <ul>
                    <li>{L("Una pianta afflosciata di colpo ha solo sete: annaffiala e si rialza in un'ora.")}</li>
                    <li>{L("Foglie gialle e terra bagnata significano troppa acqua: lascia stare e non annaffiare.")}</li>
                    <li>{L("Nel dubbio, infila un dito nel terriccio per due centimetri: se è umido, aspetta.")}</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        );
      })()}

      {intro > 0 && (() => {
        const passo = PASSI_INTRO[intro - 1];
        const en = lingua === "en";
        return (
          <div className="cp-velo">
            <div className="cp-modale cp-intro" role="dialog" aria-modal="true">
              <div className="cp-intro-ill"><Illustrazione tipo={passo.ill} stadio="matura" /></div>
              <p className="cp-eyebrow" style={{ margin: 0 }}>{intro} {L("di")} {PASSI_INTRO.length}</p>
              <h2 style={{ marginTop: 4 }}>{en ? passo.te : passo.t}</h2>
              <p className="cp-intro-testo">{en ? passo.de : passo.d}</p>
              <div className="cp-pallini">
                {PASSI_INTRO.map((_, i) => <i key={i} className={i + 1 === intro ? "attivo" : ""} />)}
              </div>
              <div className="cp-modale-azioni">
                <button className="cp-link" onClick={() => { setIntro(0); setIntroVista(true); }}>{en ? "skip" : "salta"}</button>
                <button className="cp-btn" onClick={() => {
                  vibra();
                  if (intro < PASSI_INTRO.length) setIntro(intro + 1);
                  else { setIntro(0); setIntroVista(true); }
                }}>{intro < PASSI_INTRO.length ? (en ? "Next" : "Avanti") : (en ? "Let's start" : "Cominciamo")}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {dettaglio && (() => {
        const p = calcolate.find((x) => x.id === dettaglio) || piante.find((x) => x.id === dettaglio);
        if (!p) return null;
        const conTe = p.arrivo ? giorniDa(p.arrivo) : null;
        const mesi = conTe !== null ? Math.floor(conTe / 30.4) : null;
        return (
          <div className="cp-velo cp-velo-pieno">
            <div className="cp-foglio" key={dettaglio} role="dialog" aria-modal="true">
              <div className="cp-foglio-testa">
                <div className="cp-foglio-ill"><Illustrazione tipo={p.ill} stadio={p.stadio} /></div>
                <div style={{ minWidth: 0 }}>
                  <p className="cp-soprannome">{p.nome}</p>
                  <h2 className="cp-nome" style={{ fontSize: 24 }}>{specieBreve(p.specie)}</h2>
                  <p className="cp-meta">
                    {conTe !== null
                      ? mesi >= 12 ? `${L("Con te da")} ${Math.floor(mesi / 12)} ${L(Math.floor(mesi / 12) === 1 ? "anno" : "anni")}${mesi % 12 ? ` ${L("e")} ${mesi % 12} ${L("mesi")}` : ""}`
                        : mesi >= 1 ? `${L("Con te da")} ${mesi} ${L(mesi === 1 ? "mese" : "mesi")}`
                        : `${L("Arrivata")} ${conTe} ${L("giorni fa")}`
                      : L("Aggiungi la data di arrivo da Modifica")}
                    {p.stanza ? ` · ${p.stanza}` : ""}
                  </p>
                </div>
                <button className="cp-chiudi" onClick={() => setDettaglio(null)} aria-label={L("Chiudi")}>×</button>
              </div>

              <div className="cp-salute" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 18 }}>
                <div><b>{p.foglie?.length || 0}</b><span>{L("foglie")}</span></div>
                <div><b>{p.storico?.length || 0}</b><span>{L("annaffiature")}</span></div>
                <div><b>{p.cresc?.ogni || "–"}</b><span>{L("giorni tra foglie")}</span></div>
              </div>

              {p.cresc?.ogni && p.cresc.prossima !== null && (
                <p className={`cp-previsione ${p.cresc.prossima <= 0 ? "ora" : ""}`}>
                  {p.cresc.prossima > 0
                    ? `${L("La prossima foglia è attesa tra")} ${Math.max(0, p.cresc.prossima - p.cresc.finestra)} ${L("e")} ${p.cresc.prossima + p.cresc.finestra} ${L("giorni")}.`
                    : `${L("La prossima foglia era attesa")} ${Math.abs(p.cresc.prossima)} ${L(Math.abs(p.cresc.prossima) === 1 ? "giorno" : "giorni")} ${L("giorni fa").split(" ").pop()}.`}
                  {p.cresc.sicurezza < 3 && L(" Con più foglie segnate la stima diventerà precisa.")}
                </p>
              )}

              <div className="cp-foglio-azioni">
                <button className="cp-btn cp-btn-acqua" onClick={() => annaffia(p.id)}>
                  {L(p.modo === "acqua" ? "Acqua cambiata" : "Annaffiata")}
                </button>
                <button className="cp-btn cp-btn-ghost" onClick={() => aggiungiFoglia(p.id)}>{L("+ foglia nuova")}</button>
                <span className="cp-meta" style={{ margin: 0 }}>
                  {L(p.modo === "acqua" ? "cambio acqua" : "annaffia")} {lingua === "en" ? "every" : "ogni"} {p.intervallo} {L("giorni")}
                  {p.intervallo !== p.giorni && <> · {L("adattato alla stagione di")} {L(fase.t).toLowerCase()}</>}
                </span>
              </div>

              {p.nota && <p className="cp-nota" style={{ marginBottom: 14 }}>{p.nota}</p>}
              {p.metodo && (
                <p className="cp-metodo" style={{ marginTop: 0, marginBottom: 14 }}>
                  {cura(p, "metodo")}{p.tipoAcqua && <span className="cp-tipoacqua">{L("acqua")} {L(p.tipoAcqua)}</span>}
                </p>
              )}

              <section className="cp-storia">
                <h3>{L("Cure in corso")}</h3>
                <div className="cp-cure-foglio">
                  {p.cure?.length ? p.cure.map((c) => (
                    <div key={c.chiave} className="cp-cura-riga">
                      <span>{L(c.etichetta)}</span>
                      {c.sospeso ? <em>{L("sospeso")}: {L(c.sospeso)}</em>
                        : c.restanti > 0 ? <em>tra {c.restanti} {c.restanti === 1 ? "giorno" : "giorni"}</em>
                        : <button className="cp-mini" onClick={() => fattaCura(p.id, c.chiave)}>{L("Fatto")}</button>}
                    </div>
                  )) : <span className="cp-vuoto-testo">{L("Nessuna cura programmata.")}</span>}
                </div>
              </section>

              {(() => {
                const b = bilancio(p);
                return (
                  <section className="cp-storia">
                    <h3>{L("Foglie perse")} <span>{b.totali}</span></h3>
                    <div className="cp-salute" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 12 }}>
                      <div><b>{b.morte}</b><span>{L("morte")}</span></div>
                      <div><b>{b.secche}</b><span>{L("secche")}</span></div>
                      <div><b>{b.gialle}</b><span>{L("ingiallite")}</span></div>
                    </div>

                    <div className="cp-perdite-azioni">
                      {Object.entries(TIPI_PERDITA).map(([k, et]) => (
                        <button key={k} className="cp-mini" onClick={() => segnaPerdita(p.id, k)}>+ {L(et).toLowerCase()}</button>
                      ))}
                    </div>

                    {b.totali > 0 && (
                      <p className={`cp-bilancio ${b.netto < 0 ? "male" : ""}`}>
                        {lingua === "en"
                          ? `Last three months: ${b.nuove90} new, ${b.perse90} lost.`
                          : `Ultimi tre mesi: ${b.nuove90} nuove, ${b.perse90} perse.`}
                      </p>
                    )}

                    {b.ipotesi.map((h, k) => (
                      <p key={k} className="cp-ipotesi">
                        {h.t}
                        {h.id && (
                          <button className="cp-link" onClick={() => { setDettaglio(null); setProblemaSingolo(h.id); vaiA("problemi"); }}>
                            {lingua === "en" ? "see what to do" : "vedi cosa fare"}
                          </button>
                        )}
                      </p>
                    ))}

                    {(p.perdite || []).length > 0 && (
                      <div className="cp-date" style={{ marginTop: 10 }}>
                        {(p.perdite || []).slice(0, 20).map((x, k) => (
                          <button key={k} className="cp-data-pill" onClick={() => togliPerdita(p.id, k)} title={L("Togli questa data")}>
                            {formattaData(x.data)} · {L(TIPI_PERDITA[x.tipo]).split(" ").pop().toLowerCase()} <i>×</i>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })()}

              {(() => {
                const suoi = PROBLEMI.filter((x) => (x.sp || []).some((k) => (p.specie || "").toLowerCase().includes(k.toLowerCase())));
                if (!suoi.length) return null;
                return (
                  <section className="cp-storia">
                    <h3>A cosa è soggetta <span>{suoi.length}</span></h3>
                    <div className="cp-chips">
                      {suoi.map((x) => (
                        <button key={x.id} className="cp-chip" onClick={() => {
                          setDettaglio(null); setProblemaSingolo(x.id); vaiA("problemi");
                        }}>{lingua === "en" ? (EN_PROBLEMI[x.id]?.s || x.s) : x.s}</button>
                      ))}
                    </div>
                  </section>
                );
              })()}

              {BOTANICA[p.specie] && (() => {
                const b = lingua === "en" ? { ...BOTANICA[p.specie], ...(EN_BOTANICA[p.specie] || {}) } : BOTANICA[p.specie];
                return (
                  <section className="cp-storia cp-botanica">
                    <h3>{L("Chi è")}</h3>
                    <p className="cp-bot-riga"><b>{L("Famiglia")}</b> {b.f}</p>
                    <p className="cp-bot-riga"><b>{L("Origine")}</b> {b.o}</p>
                    <p className="cp-bot-riga"><b>{L("Come vive")}</b> {b.h}</p>
                    <p className="cp-bot-curiosa">{b.c}</p>
                    <p className={`cp-bot-tossica ${/^(Tossica|Toxic|Mildly)/.test(b.t) ? "si" : ""}`}>{b.t}</p>
                  </section>
                );
              })()}

              {p.storicoStanza?.length > 0 && (
                <section className="cp-storia">
                  <h3>{L("Dove è stata")}</h3>
                  {p.storicoStanza.slice().reverse().map((t, i) => (
                    <p key={i} className="cp-meta" style={{ marginTop: 0 }}>
                      <b style={{ color: "var(--foglia)" }}>{t.stanza}</b> — dal {formattaData(t.da)}
                      {t.a ? ` al ${formattaData(t.a)}` : " (adesso)"}
                      {!t.a && ` · ${giorniDa(t.da)} ${L("giorni")}`}
                    </p>
                  ))}
                </section>
              )}

              {p.sostegno && p.sostegno !== "nessuno" && (
                <section className="cp-storia">
                  <h3>{L("Sostegno")}</h3>
                  <p className="cp-meta" style={{ marginTop: 0 }}>
                    {L(SOSTEGNI[p.sostegno]?.t)}
                    {p.altezzaPalo ? ` di ${p.altezzaPalo} cm` : ""}
                    {p.altezzaPianta ? `, pianta a ${p.altezzaPianta} cm` : ""}
                    {SOSTEGNI[p.sostegno]?.nota ? ` — ${L(SOSTEGNI[p.sostegno].nota)}` : ""}
                  </p>
                </section>
              )}

              <section className="cp-storia">
                <h3>{L("Substrato e vaso")}</h3>
                <p className="cp-meta" style={{ marginTop: 0 }}>
                  {(lingua === "en" ? EN_MISCELE[p.miscela] : MISCELE[p.miscela])?.titolo}: {(lingua === "en" ? EN_MISCELE[p.miscela] : MISCELE[p.miscela])?.parti.join(", ")}
                  {p.vaso ? ` · ${L("vaso")} ${p.vaso}` : ""}
                  {p.ultimoRinvaso ? ` · ${L("ultimo rinvaso")} ${formattaData(p.ultimoRinvaso)}` : ` · ${L("mai rinvasata")}`}
                </p>
              </section>

              {(p.foglie?.length > 1 || p.storico?.length > 1) && (
                <section className="cp-storia">
                  <h3>{L("Sei mesi")}</h3>
                  {[["foglie", "#4C7A63", p.foglie], ["acqua", "var(--acqua)", p.storico]].map(([et, col, dati]) => (
                    <div key={et} className="cp-linea-riga" style={{ marginBottom: 6 }}>
                      <span className="cp-conf-nome">{L(et)}</span>
                      <div className="cp-pista">
                        <div className="cp-pista-fondo" />
                        {(dati || []).filter((d) => giorniDa(d) <= 180).map((d, k) => (
                          <i key={d + k} style={{ position: "absolute", top: 4, width: 9, height: 9, marginLeft: -4.5,
                            borderRadius: "50%", background: col, border: "1.5px solid var(--carta)",
                            left: `${100 - (giorniDa(d) / 180) * 100}%` }} title={formattaData(d)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {Object.entries(CAMPI_STORIA).map(([campo, titolo]) => (
                <section key={campo} className="cp-storia">
                  <h3>{titolo} <span>{(p[campo] || []).length}</span></h3>
                  <div className="cp-date">
                    {(p[campo] || []).length === 0 && <span className="cp-vuoto-testo">{L("Ancora niente.")}</span>}
                    {(p[campo] || []).slice(0, 24).map((d, i) => (
                      <button key={`${campo}-${d}-${i}`} className="cp-data-pill" onClick={() => togliDataStoria(p.id, campo, d)}
                        title={L("Togli questa data")}>{formattaData(d)} <i>×</i></button>
                    ))}
                  </div>
                  <div className="cp-aggiungi-data">
                    <input type="date" max={oggiStr()} value={nuovaData[campo] || ""}
                      onChange={(e) => setNuovaData({ ...nuovaData, [campo]: e.target.value })} />
                    <button className="cp-mini" onClick={() => { aggiungiDataStoria(p.id, campo, nuovaData[campo]); setNuovaData({ ...nuovaData, [campo]: "" }); }}>
                      Aggiungi
                    </button>
                  </div>
                </section>
              ))}

              <div className="cp-modale-azioni">
                <button className="cp-btn cp-btn-ghost" onClick={() => { const q = piante.find((x) => x.id === p.id); setDettaglio(null); setForm({ ...q }); }}>{L("Modifica")}</button>
                <button className="cp-btn" onClick={() => setDettaglio(null)}>{L("Chiudi")}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {archiviando && (
        <div className="cp-velo" onClick={(e) => e.target === e.currentTarget && setArchiviando(null)}>
          <div className="cp-modale" role="dialog" aria-modal="true">
            <h2>Archiviare {archiviando.nome}?</h2>
            <p className="cp-aiuto" style={{ margin: "0 0 16px" }}>
              Esce dall'elenco e dai promemoria, ma la sua storia resta: foglie, date e statistiche le trovi nell'archivio.
            </p>
            {Object.entries(MOTIVI).map(([k, testo]) => (
              <button key={k} className="cp-btn cp-btn-ghost" style={{ display: "block", width: "100%", marginBottom: 8, textAlign: "left" }}
                onClick={() => archivia(archiviando.id, k)}>{testo}</button>
            ))}
            <div className="cp-modale-azioni">
              <button className="cp-btn cp-btn-ghost" onClick={() => setArchiviando(null)}>{L("Annulla")}</button>
            </div>
          </div>
        </div>
      )}

      {nuoviDistintivi.length > 0 && (
        <div className="cp-velo" onClick={() => setNuoviDistintivi([])}>
          <div className="cp-modale cp-festa" role="dialog" aria-modal="true">
            <p className="cp-eyebrow" style={{ margin: 0 }}>
              {nuoviDistintivi.length === 1 ? "Distintivo sbloccato" : `${nuoviDistintivi.length} distintivi sbloccati`}
            </p>
            {nuoviDistintivi.slice(0, 3).map((b) => (
              <div key={b.id} className={`cp-festa-uno ${b.segreto ? "segreto" : ""} ${b.g === "piante" ? "dipianta" : ""}`}>
                <i className="cp-festa-glifo"><Glifo nome={b.ic} /></i>
                <div>
                  <b>{L(b.t)}</b>
                  <span>{L(b.d)}</span>
                  {b.segreto && <em>{L("era segreto")}</em>}
                </div>
              </div>
            ))}
            {nuoviDistintivi.length > 3 && (
              <p className="cp-aiuto">e altri {nuoviDistintivi.length - 3}, li trovi nel profilo.</p>
            )}
            <div className="cp-modale-azioni">
              <button className="cp-btn cp-btn-ghost" onClick={() => { setNuoviDistintivi([]); vaiA("profilo"); }}>{L("Vedi tutti")}</button>
              <button className="cp-btn" onClick={() => setNuoviDistintivi([])}>{L("Bene")}</button>
            </div>
          </div>
        </div>
      )}

      {annullo && (
        <div className="cp-annullo" role="status">
          <span>{annullo.testo}</span>
          <button onClick={tornaIndietro}>{L("Annulla")}</button>
          <button className="cp-chiudi-annullo" onClick={() => setAnnullo(null)} aria-label="Nascondi">×</button>
        </div>
      )}

      {impostazioni && (
        <div className="cp-velo" onClick={(e) => e.target === e.currentTarget && setImpostazioni(false)}>
          <div className="cp-modale" role="dialog" aria-modal="true" aria-label="Impostazioni">
            <h2>{L("Altro")}</h2>

            <div className="cp-campo">
              <label>{L("Stagione")}</label>
              <div className="cp-fasi">
                {ORDINE_STAGIONI.map((k) => (
                  <button key={k} className={stagione === k ? "scelta" : ""} onClick={() => setStagione(k)}>
                    <b>{L(STAGIONI[k].t)}</b>
                    <span>{L(STAGIONI[k].mesi)}</span>
                  </button>
                ))}
              </div>
              <p className="cp-aiuto">
                {L(fase.nota)} {lingua === "en" ? "Watering intervals are" : "Gli intervalli"} d'acqua sono {fase.acqua === 1 ? "quelli di riferimento" :
                  fase.acqua > 1 ? `allungati del ${Math.round((fase.acqua - 1) * 100)}%` :
                  `accorciati del ${Math.round((1 - fase.acqua) * 100)}%`}, {lingua === "en" ? "and feeding is" : "e il concime"} {L(fase.dose)}.
                {stagione !== stagioneDelMese(new Date().getMonth()) &&
                  ` In questo mese di solito si sta in ${STAGIONI[stagioneDelMese(new Date().getMonth())].t.toLowerCase()}.`}
              </p>
            </div>

            <div className="cp-campo">
              <label>{L("Aspetto")}</label>
              <div className="cp-filtri" style={{ width: "fit-content" }}>
                <button aria-pressed={tema === "sistema"} onClick={() => setTema("sistema")}>{L("Sistema")}</button>
                <button aria-pressed={tema === "chiaro"} onClick={() => setTema("chiaro")}>{L("Chiaro")}</button>
                <button aria-pressed={tema === "scuro"} onClick={() => setTema("scuro")}>{L("Scuro")}</button>
              </div>
              <p className="cp-aiuto">Con "Sistema" segue l'impostazione del telefono e cambia da solo la sera.</p>
            </div>

            <div className="cp-campo">
              <label>{L("Raggruppamento")}</label>
              <div className="cp-filtri" style={{ width: "fit-content" }}>
                <button aria-pressed={vista === "urgenza"} onClick={() => { setVista("urgenza"); setVistaPiante("urgenza"); }}>{L("Per urgenza")}</button>
                <button aria-pressed={vista === "stanza"} onClick={() => { setVista("stanza"); setVistaPiante("stanza"); }}>{L("Per stanza")}</button>
              </div>
            </div>

            <div className="cp-campo">
              <label>{L("Schede")}</label>
              <div className="cp-filtri" style={{ width: "fit-content" }}>
                <button aria-pressed={densita === "compatta"} onClick={() => setDensita("compatta")}>{L("Compatte")}</button>
                <button aria-pressed={densita === "estesa"} onClick={() => setDensita("estesa")}>{L("Estese")}</button>
                <button aria-pressed={densita === "griglia"} onClick={() => { segna("griglia"); setDensita("griglia"); }}>{L("Griglia")}</button>
              </div>
              <p className="cp-aiuto">La griglia mostra solo le illustrazioni: tutte le piante in una schermata.</p>
            </div>

            <div className="cp-campo">
              <label>{L("Stanze")}</label>
              <button className="cp-btn cp-btn-ghost" onClick={() => { setImpostazioni(false); setStanzeAperto(true); }}>
                Assegna le stanze
              </button>
            </div>

            <div className="cp-campo">
              <label>{lingua === "en" ? "Margin on watering" : "Margine sull'acqua"}</label>
              <div className="cp-filtri" style={{ width: "fit-content" }}>
                {[[0, lingua === "en" ? "None" : "Nessuno"], [1, lingua === "en" ? "Some" : "Un po'"],
                  [2, lingua === "en" ? "Generous" : "Ampio"]].map(([k, et]) => (
                  <button key={k} aria-pressed={prudenza === k} onClick={() => setPrudenza(k)}>{et}</button>
                ))}
              </div>
              <p className="cp-aiuto">
                {prudenza === 0
                  ? (lingua === "en"
                    ? "Intervals as calculated. Most houseplants die drowned, not thirsty: a margin costs you nothing and protects the roots."
                    : "Intervalli come calcolati. Quasi tutte le piante d'appartamento muoiono annegate, non assetate: un margine non costa niente e protegge le radici.")
                  : (lingua === "en"
                    ? `Adds ${prudenza * 15}% to the interval — only for plants that take drying without harm. Prayer plants, ferns, fittonia and anthuriums are left alone.`
                    : `Aggiunge il ${prudenza * 15}% all'intervallo, ma solo alle piante che reggono di asciugare. Marantacee, felci, fittonia e anthurium restano come sono.`)}
              </p>
            </div>

            <div className="cp-campo">
              <label>{L("Se parti")}</label>
              <button className="cp-btn cp-btn-ghost" onClick={() => {
                const a = new Date(); a.setDate(a.getDate() + 14);
                setImpostazioni(false);
                segna("libretto");
                setLibretto({ da: oggiStr(), a: `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}-${String(a.getDate()).padStart(2, "0")}` });
              }}>{L("Libretto per chi annaffia")}</button>
              <p className="cp-aiuto">Le istruzioni giorno per giorno da stampare o mandare a chi ti sostituisce.</p>
            </div>

            <div className="cp-campo">
              <label>{L("Copia di sicurezza")}</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="cp-btn cp-btn-ghost" onClick={esporta}>{L("Salva copia")}</button>
                <label className="cp-btn cp-btn-ghost" style={{ cursor: "pointer" }}>
                  Ripristina
                  <input type="file" accept="application/json" style={{ display: "none" }}
                    onChange={(e) => { if (e.target.files[0]) importa(e.target.files[0]); e.target.value = ""; }} />
                </label>
              </div>
              <p className="cp-aiuto">Scarica un file con tutto l'elenco, da rimettere qui o sull'app del telefono.</p>
            </div>

            <div className="cp-modale-azioni">
              <button className="cp-btn" onClick={() => setImpostazioni(false)}>{L("Chiudi")}</button>
            </div>
          </div>
        </div>
      )}

      {stanzeAperto && (
        <div className="cp-velo" onClick={(e) => e.target === e.currentTarget && setStanzeAperto(false)}>
          <div className="cp-modale cp-modale-largo" role="dialog" aria-modal="true" aria-label={L("Assegna le stanze")}>
            <h2>{L("Dove sta ognuna")}</h2>
            <p className="cp-sub" style={{ marginBottom: 16 }}>
              Tocca la stanza giusta. Sotto ogni pianta trovi dove le converrebbe stare.
            </p>

            <div className="cp-campo" style={{ display: "flex", gap: 8 }}>
              <input value={nuovaStanza} placeholder={L("Aggiungi una stanza tua")} aria-label="Nuova stanza"
                onChange={(e) => setNuovaStanza(e.target.value)} />
              <button className="cp-btn cp-btn-ghost" style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  const n = nuovaStanza.trim();
                  if (n && !stanzeTutte.includes(n)) setStanzeExtra((s) => [...s, n]);
                  setNuovaStanza("");
                }}>{L("Aggiungi")}</button>
            </div>

            {calcolate.map((p) => (
              <div key={p.id} className="cp-assegna">
                <p className="cp-soprannome">{p.nome}</p>
                <p className="cp-assegna-specie">{specieBreve(p.specie)}</p>
                <div className="cp-chips">
                  {stanzeTutte.map((s) => (
                    <button key={s} className={`cp-chip ${p.stanza === s ? "scelta" : ""}`}
                      aria-pressed={p.stanza === s}
                      onClick={() => impostaStanza(p.id, p.stanza === s ? null : s)}>{s}</button>
                  ))}
                </div>
                {p.consiglio && <p className="cp-consiglio">{cura(p, "consiglio")}</p>}
              </div>
            ))}

            <div className="cp-modale-azioni">
              <button className="cp-btn" onClick={() => { setStanzeAperto(false); setVista("stanza"); }}>{L("Fatto")}</button>
            </div>
          </div>
        </div>
      )}

      {form && (
        <div className="cp-velo" onClick={(e) => e.target === e.currentTarget && setForm(null)}>
          <div className="cp-modale" role="dialog" aria-modal="true">
            <h2>{form.id ? "Modifica pianta" : "Nuova pianta"}</h2>
            <div className="cp-campo">
              <label htmlFor="s">{L("Specie")}</label>
              <select id="s" value={form.specie} onChange={(e) => cambiaSpecie(e.target.value)}>
                {SPECIE.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
              </select>
            </div>
            <div className="cp-campo">
              <label htmlFor="n">{L("Come la chiami")}</label>
              <input id="n" value={form.nome} autoFocus onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Stefani" />
            </div>
            <div className="cp-due">
              <div className="cp-campo">
                <label htmlFor="g">{L("Ogni quanti giorni")}</label>
                <input id="g" type="number" min="1" max="90" value={form.giorni} onChange={(e) => setForm({ ...form, giorni: e.target.value })} />
              </div>
              <div className="cp-campo">
                <label htmlFor="u">{L("Ultima volta")}</label>
                <input id="u" type="date" value={form.ultima} max={oggiStr()} onChange={(e) => setForm({ ...form, ultima: e.target.value })} />
              </div>
            </div>
            <div className="cp-due">
              <div className="cp-campo">
                <label htmlFor="m">{L("Coltivazione")}</label>
                <select id="m" value={form.modo} onChange={(e) => setForm({ ...form, modo: e.target.value })}>
                  <option value="terra">{L("In terra")}</option>
                  <option value="acqua">{L("In acqua")}</option>
                </select>
              </div>
              <div className="cp-campo">
                <label htmlFor="t">{L("Come sta")}</label>
                <select id="t" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                  <option value="forte">Va forte</option>
                  <option value="ripresa">In ripresa</option>
                  <option value="cura">In sofferenza</option>
                  <option value="nuovo">Da capire</option>
                </select>
              </div>
            </div>
            <div className="cp-campo">
              <label htmlFor="c">{L("Concime ogni quanti giorni")}</label>
              <input id="c" type="number" min="7" max="120" value={form.concime || 28}
                onChange={(e) => setForm({ ...form, concime: Math.max(7, Number(e.target.value) || 28) })} />
            </div>
            <div className="cp-campo">
              <label htmlFor="l">{L("Luce")}</label>
              <select id="l" value={form.luce} onChange={(e) => setForm({ ...form, luce: e.target.value })}>
                <option value="">{L("Non specificata")}</option>
                {LUCI.map((l) => <option key={l} value={l}>{L(l)}</option>)}
              </select>
            </div>
            <div className="cp-campo">
              <label>{L("Trattamenti")}</label>
              <label className="cp-spunta">
                <input type="checkbox" checked={!!form.spray}
                  onChange={(e) => setForm({ ...form, spray: e.target.checked })} />
                Tonico fogliare ogni settimana
              </label>
              <label className="cp-spunta">
                <input type="checkbox" checked={!!form.radicante}
                  onChange={(e) => setForm({ ...form, radicante: e.target.checked })} />
                Radicante ogni 14 giorni
              </label>
              <label className="cp-spunta">
                <input type="checkbox" checked={!!form.pulizia}
                  onChange={(e) => setForm({ ...form, pulizia: e.target.checked })} />
                Pulizia foglie ogni tre settimane
              </label>
            </div>
            <div className="cp-campo">
              <label>{L("Quanto è grande")}</label>
              <div className="cp-filtri" style={{ width: "fit-content" }}>
                {["giovane", "adulta", "matura"].map((k) => (
                  <button key={k} aria-pressed={(form.stadio || "giovane") === k}
                    onClick={() => setForm({ ...form, stadio: k })}>{k[0].toUpperCase() + k.slice(1)}</button>
                ))}
              </div>
              <p className="cp-aiuto">Cambia la dimensione del disegno: una monstera adulta non va disegnata come una talea.</p>
            </div>
            <div className="cp-campo">
              <label>{L("Illustrazione")}</label>
              <div className="cp-scelta-ill">
                {ILLUSTRAZIONI.map((k) => (
                  <button key={k} type="button" className={form.ill === k ? "scelta" : ""}
                    onClick={() => setForm({ ...form, ill: k })} aria-label={k} title={k}>
                    <Illustrazione tipo={k} />
                  </button>
                ))}
              </div>
            </div>
            <div className="cp-campo">
              <label htmlFor="so">{L("Sostegno")}</label>
              <select id="so" value={form.sostegno || "nessuno"} onChange={(e) => setForm({ ...form, sostegno: e.target.value })}>
                {Object.entries(SOSTEGNI).map(([k, v]) => <option key={k} value={k}>{L(v.t)}</option>)}
              </select>
              {SOSTEGNI[form.sostegno]?.nota && <p className="cp-aiuto">{L(SOSTEGNI[form.sostegno].nota)}</p>}
            </div>
            {["palo-cocco", "tutore", "traliccio"].includes(form.sostegno) && (
              <div className="cp-due">
                <div className="cp-campo">
                  <label htmlFor="hp">Altezza sostegno (cm)</label>
                  <input id="hp" type="number" min="0" max="400" value={form.altezzaPalo || ""}
                    onChange={(e) => setForm({ ...form, altezzaPalo: e.target.value })} />
                </div>
                <div className="cp-campo">
                  <label htmlFor="hv">Altezza pianta (cm)</label>
                  <input id="hv" type="number" min="0" max="400" value={form.altezzaPianta || ""}
                    onChange={(e) => setForm({ ...form, altezzaPianta: e.target.value })} />
                </div>
              </div>
            )}
            <div className="cp-campo">
              <label htmlFor="ar">{L("Arrivata in casa il")}</label>
              <input id="ar" type="date" value={form.arrivo || ""} max={oggiStr()}
                onChange={(e) => setForm({ ...form, arrivo: e.target.value || null })} />
            </div>
            <div className="cp-due">
              <div className="cp-campo">
                <label htmlFor="mi">{L("Substrato")}</label>
                <select id="mi" value={form.miscela || "facili"} onChange={(e) => setForm({ ...form, miscela: e.target.value })}>
                  {Object.entries(MISCELE).map(([k, m]) => <option key={k} value={k}>{m.titolo}</option>)}
                </select>
              </div>
              <div className="cp-campo">
                <label htmlFor="ma">{L("Materiale del vaso")}</label>
                <select id="ma" value={form.materiale || "plastica"}
                  onChange={(e) => setForm({ ...form, materiale: e.target.value })}>
                  {Object.entries(VASI).map(([k, v]) => (
                    <option key={k} value={k}>{lingua === "en" ? v.te : v.t}</option>
                  ))}
                </select>
              </div>
              <div className="cp-campo">
                <label htmlFor="va">{L("Misura vaso")}</label>
                <input id="va" value={form.vaso || ""} placeholder="14 cm"
                  onChange={(e) => setForm({ ...form, vaso: e.target.value })} />
              </div>
            </div>
            <div className="cp-due">
              <div className="cp-campo">
                <label htmlFor="ri">{L("Rinvaso ogni (mesi)")}</label>
                <input id="ri" type="number" min="0" max="60" value={form.rinvaso ?? 18}
                  onChange={(e) => setForm({ ...form, rinvaso: Math.max(0, Number(e.target.value) || 0) })} />
              </div>
              <div className="cp-campo">
                <label htmlFor="ur">{L("Ultimo rinvaso")}</label>
                <input id="ur" type="date" value={form.ultimoRinvaso || ""} max={oggiStr()}
                  onChange={(e) => setForm({ ...form, ultimoRinvaso: e.target.value || null })} />
              </div>
            </div>
            <div className="cp-campo">
              <label className="cp-spunta">
                <input type="checkbox" checked={!!form.rotazione}
                  onChange={(e) => setForm({ ...form, rotazione: e.target.checked })} />
                Un quarto di giro ogni settimana
              </label>
            </div>
            <div className="cp-campo">
              <label htmlFor="me">{L("Come annaffiarla")}</label>
              <textarea id="me" rows="2" value={form.metodo || ""}
                onChange={(e) => setForm({ ...form, metodo: e.target.value })}
                placeholder="Immersione dal basso, poi scola bene" />
            </div>
            <div className="cp-campo">
              <label htmlFor="ta">{L("Che acqua")}</label>
              <select id="ta" value={form.tipoAcqua || ""} onChange={(e) => setForm({ ...form, tipoAcqua: e.target.value })}>
                <option value="">{L("Non specificata")}</option>
                <option value="rubinetto">Rubinetto</option>
                <option value="riposata una notte">Riposata una notte</option>
                <option value="demineralizzata">Demineralizzata o piovana</option>
              </select>
            </div>
            <div className="cp-campo">
              <label htmlFor="co">{L("Consiglio sul posizionamento")}</label>
              <textarea id="co" rows="2" value={form.consiglio || ""}
                onChange={(e) => setForm({ ...form, consiglio: e.target.value })}
                placeholder={L("Compare nel pannello Stanze")} />
            </div>
            <div className="cp-campo">
              <label htmlFor="no">{L("Nota")}</label>
              <textarea id="no" rows="2" value={form.nota} onChange={(e) => setForm({ ...form, nota: e.target.value })} />
            </div>
            <div className="cp-modale-azioni">
              <button className="cp-btn cp-btn-ghost" onClick={() => setForm(null)}>{L("Annulla")}</button>
              <button className="cp-btn" onClick={salvaForm}>{form.id ? "Salva" : "Aggiungi"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
