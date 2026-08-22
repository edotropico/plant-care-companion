/* Plant Care Companion — dati botanici e di cura.
   Autore: Edoardo Giangrandi — © 2026, licenza MIT */

export const MISCELE = {
  "aroidee-epifite": {
    titolo: "Aroidee epifite",
    parti: ["50% corteccia di pino fine", "20% perlite", "20% sfagno", "10% carbone vegetale"],
    perche: "Radici aeree abituate ad aggrapparsi alla corteccia degli alberi: vogliono aria fra le radici, non terra. Il terriccio universale qui è la causa più comune di stallo.",
  },
  "aroidee-terrestri": {
    titolo: "Aroidee da terra",
    parti: ["40% terriccio universale", "30% corteccia fine", "20% perlite", "10% lapillo o carbone"],
    perche: "Vogliono un composto ricco ma che resti soffice: la corteccia crea i vuoti d'aria, la perlite impedisce che si compatti.",
  },
  "marantacee": {
    titolo: "Marantacee",
    parti: ["50% fibra di cocco o torba", "30% perlite", "20% corteccia fine"],
    perche: "Substrato acido che resta umido senza diventare fango. Non deve mai asciugare del tutto, ma nemmeno ristagnare.",
  },
  "peperomie": {
    titolo: "Peperomie",
    parti: ["40% terriccio universale", "40% perlite o pomice", "20% corteccia fine"],
    perche: "Foglie carnose che l'acqua se la tengono da sole: le radici devono asciugare in fretta. Stare strette nel vaso va benissimo.",
  },
  "sansevierie": {
    titolo: "Sansevierie",
    parti: ["60% terriccio per cactus", "40% pomice o lapillo"],
    perche: "Il substrato più drenante di tutti. Se resta umido più di qualche giorno, il rizoma marcisce dal basso senza dare segnali.",
  },
  "palme": {
    titolo: "Palme",
    parti: ["60% terriccio universale", "20% pomice o sabbia grossa", "20% corteccia"],
    perche: "Deve trattenere umidità in profondità senza compattarsi: è l'unica del gruppo che non gradisce di asciugare del tutto.",
  },
  "felci": {
    titolo: "Felci",
    parti: ["50% terriccio universale", "30% fibra di cocco", "20% perlite"],
    perche: "Umido e leggero. Le radici sono fini e superficiali: un composto pesante le soffoca in fretta.",
  },
  "facili": {
    titolo: "Generico da appartamento",
    parti: ["70% terriccio universale", "30% perlite"],
    perche: "Per le piante che non fanno storie. La perlite serve comunque: il terriccio da solo si compatta dopo pochi mesi.",
  },
  "grasse": {
    titolo: "Piante grasse",
    parti: ["50% terriccio per cactus", "30% pomice o lapillo", "20% sabbia grossa"],
    perche: "Deve asciugare in due o tre giorni. Le rosette marciscono dal colletto, quindi meglio finire con uno strato di lapillo in superficie per tenere le foglie sollevate dal bagnato.",
  },
  "felci-epifite": {
    titolo: "Felci epifite",
    parti: ["40% corteccia fine", "30% fibra di cocco", "20% perlite", "10% sfagno"],
    perche: "Il Phlebodium in natura cresce sui tronchi, non nella terra: il rizoma peloso deve restare in superficie, mai interrato, o marcisce.",
  },
  "acqua": {
    titolo: "Ancora in acqua",
    parti: ["Nessun substrato per ora"],
    perche: "Quando le radici arrivano a 4-5 cm, primo invaso in un vaso piccolo con la miscela adatta alla specie. Più tardi si aspetta, peggio si adattano.",
  },
};

export const EN_MISCELE = {
  "aroidee-epifite": { titolo: "Epiphytic aroids", parti: ["50% fine pine bark", "20% perlite", "20% sphagnum", "10% charcoal"],
    perche: "Aerial roots evolved to grip tree bark: they want air between them, not soil. Standard potting compost here is the most common reason a plant stalls." },
  "aroidee-terrestri": { titolo: "Ground aroids", parti: ["40% potting compost", "30% fine bark", "20% perlite", "10% lava rock or charcoal"],
    perche: "Rich but loose: the bark creates air pockets, the perlite stops it compacting." },
  "marantacee": { titolo: "Prayer plants", parti: ["50% coco coir or peat", "30% perlite", "20% fine bark"],
    perche: "Acidic mix that stays damp without turning to mud. It must never dry out completely, nor stay waterlogged." },
  "peperomie": { titolo: "Peperomias", parti: ["40% potting compost", "40% perlite or pumice", "20% fine bark"],
    perche: "Fleshy leaves hold their own water: the roots need to dry fast. Being pot-bound suits them." },
  "sansevierie": { titolo: "Snake plants", parti: ["60% cactus compost", "40% pumice or lava rock"],
    perche: "The sharpest-draining mix of all. If it stays damp for more than a few days the rhizome rots from below with no warning." },
  "palme": { titolo: "Palms", parti: ["60% potting compost", "20% pumice or coarse sand", "20% bark"],
    perche: "Must hold moisture deep down without compacting: the only one here that dislikes drying out completely." },
  "felci": { titolo: "Ferns", parti: ["50% potting compost", "30% coco coir", "20% perlite"],
    perche: "Damp and light. The roots are fine and shallow: a heavy mix suffocates them quickly." },
  "felci-epifite": { titolo: "Epiphytic ferns", parti: ["40% fine bark", "30% coco coir", "20% perlite", "10% sphagnum"],
    perche: "Phlebodium grows on trunks, not in soil: the furry rhizome must sit on the surface, never buried, or it rots." },
  "grasse": { titolo: "Succulents", parti: ["50% cactus compost", "30% pumice or lava rock", "20% coarse sand"],
    perche: "It has to dry in two or three days. Rosettes rot at the collar, so a top layer of grit keeps the leaves off the wet." },
  "facili": { titolo: "General houseplant", parti: ["70% potting compost", "30% perlite"],
    perche: "For the plants that don't make a fuss. The perlite still matters: compost alone compacts within months." },
  "acqua": { titolo: "Still in water", parti: ["No mix for now"],
    perche: "Once roots reach 4-5 cm, first pot into a small container with the right mix for the species. The longer you wait, the worse they adapt." },
};

export const ACQUE = [
  { id: "rubinetto", t: "Rubinetto", costo: "gratis",
    come: "Direttamente dal lavandino.",
    risolve: "Va benissimo per la maggior parte delle piante d'appartamento.",
    problema: "Se la tua zona ha acqua dura, lascia depositi di calcare e con gli anni alza il pH del terriccio.", },

  { id: "riposata", t: "Riposata una notte", costo: "gratis",
    come: "Riempi una brocca aperta e lasciala fuori 12-24 ore prima di usarla.",
    risolve: "Il cloro evapora e l'acqua arriva a temperatura ambiente, il che evita lo shock alle radici.",
    problema: "Non toglie il calcare: quello resta tutto. E se il tuo acquedotto usa cloramine al posto del cloro, non evaporano nemmeno quelle.", },

  { id: "demi", t: "Demineralizzata", costo: "circa 1 € per 5 litri",
    come: "Al supermercato, nel reparto ferri da stiro. Cerca la tacca che dice solo \u201cacqua demineralizzata\u201d, senza profumi né additivi: quelle profumate rovinano le radici.",
    risolve: "Zero calcare e zero sali. È la soluzione più semplice ed economica che esista.",
    problema: "Essendo priva di minerali, a lungo andare la pianta dipende solo dal concime: non saltarlo.", },

  { id: "piovana", t: "Piovana", costo: "gratis",
    come: "Un secchio sul balcone quando piove. Scarta i primi minuti di pioggia, che lavano via lo sporco dall'aria, e tienila al buio: alla luce diventa verde di alghe in una settimana.",
    risolve: "È l'acqua migliore in assoluto: leggermente acida, senza calcare, con qualche minerale utile.",
    problema: "Non è raccoglibile tutto l'anno, e non usarla se scende da una grondaia trattata o da un tetto in bitume.", },

  { id: "condensa", t: "Condensa del deumidificatore", costo: "gratis",
    come: "È l'acqua nella tanica del deumidificatore o dello split del condizionatore.",
    risolve: "È praticamente distillata: zero calcare. Il modo più economico di avere acqua pura senza comprarla.",
    problema: "Solo se l'apparecchio è pulito: nei filtri sporchi si accumulano batteri. Mai usarla su piante che poi mangi.", },

  { id: "osmosi", t: "Osmosi inversa", costo: "150-400 € l'impianto",
    come: "Un filtro sotto il lavello che spinge l'acqua attraverso una membrana finissima e trattiene quasi tutto. Alcuni frigoriferi e caraffe avanzate ce l'hanno già.",
    risolve: "Acqua pura come la distillata, ma dal rubinetto e senza comprare bottiglie.",
    problema: "Costa, va installata, e per ogni litro buono ne scarta due o tre. Ha senso solo se la usi anche per bere.", },

  { id: "caraffa", t: "Caraffa filtrante", costo: "30 € più i filtri",
    come: "Le classiche caraffe da frigorifero.",
    risolve: "Abbassa un po' la durezza e toglie il cloro.",
    problema: "Non demineralizza: riduce il calcare solo in parte, e la capacità cala man mano che il filtro si esaurisce. Meglio di niente, lontana dalla demineralizzata.", },

  { id: "bollita", t: "Bollita", costo: "gratis",
    come: "Si fa bollire e si lascia raffreddare, usando solo la parte superiore.",
    risolve: "Fa precipitare sul fondo una parte del calcare, quello dei carbonati.",
    problema: "Gli altri sali restano e anzi si concentrano, perché parte dell'acqua evapora. È il rimedio che sembra intelligente e funziona meno di tutti.", },
];

export const EN_ACQUE = {
  rubinetto: { t: "Tap water", costo: "free", come: "Straight from the tap.",
    risolve: "Fine for most houseplants.",
    problema: "In hard-water areas it leaves limescale and slowly raises the pH of the soil." },
  riposata: { t: "Left to stand overnight", costo: "free", come: "Fill an open jug and leave it out for 12-24 hours.",
    risolve: "Chlorine evaporates and the water reaches room temperature, avoiding root shock.",
    problema: "It does not remove limescale, and if your supplier uses chloramine that doesn't evaporate either." },
  demi: { t: "Distilled", costo: "about €1 for 5 litres", come: "Supermarket, in the iron and steam-cleaner aisle. Look for pure distilled water with no perfume or additives, which damage roots.",
    risolve: "No limescale and no salts. The simplest and cheapest answer there is.",
    problema: "Being mineral-free, the plant depends entirely on fertiliser: don't skip it." },
  piovana: { t: "Rainwater", costo: "free", come: "A bucket on the balcony. Discard the first few minutes, which wash dust out of the air, and store it in the dark or it turns green within a week.",
    risolve: "The best water there is: slightly acidic, limescale-free, with a few useful minerals.",
    problema: "Not available all year, and not to be used if it runs off a treated gutter or a bitumen roof." },
  condensa: { t: "Dehumidifier condensate", costo: "free", come: "The water in the tank of a dehumidifier or air conditioner.",
    risolve: "Essentially distilled: no limescale at all. The cheapest way to get pure water without buying it.",
    problema: "Only if the unit is clean: bacteria build up in dirty filters. Never on edible plants." },
  osmosi: { t: "Reverse osmosis", costo: "€150-400 for the system", come: "An under-sink filter that pushes water through a very fine membrane which holds back almost everything.",
    risolve: "Water as pure as distilled, straight from the tap and without buying bottles.",
    problema: "Costly, needs installing, and wastes two or three litres for every good one. Only worth it if you drink it too." },
  caraffa: { t: "Filter jug", costo: "€30 plus cartridges", come: "The classic fridge jug.",
    risolve: "Lowers hardness a little and removes chlorine.",
    problema: "It does not demineralise: it only partly reduces limescale, and its capacity fades as the cartridge ages." },
  bollita: { t: "Boiled", costo: "free", come: "Boil it, let it cool and use only the top part.",
    risolve: "Some of the limescale, the carbonate part, settles at the bottom.",
    problema: "The other salts stay and actually concentrate, because some water evaporates. The remedy that sounds clever and works least." },
};
