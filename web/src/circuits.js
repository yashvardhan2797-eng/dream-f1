/** Maps Jolpica circuitIds and OpenF1 circuit_short_name/location values to layout images in /public/circuits. */
const CIRCUITS = {
  australia: ["albert_park", "melbourne"],
  shanghai: ["shanghai"],
  suzuka: ["suzuka"],
  bahrain: ["bahrain", "sakhir"],
  jeddah: ["jeddah"],
  miami: ["miami"],
  imola: ["imola"],
  monaco: ["monaco", "monte carlo"],
  barcelona: ["catalunya", "barcelona"],
  montreal: ["villeneuve", "montreal", "montréal"],
  austria: ["red_bull_ring", "spielberg", "austria"],
  silverstone: ["silverstone"],
  spa: ["spa", "spa-francorchamps"],
  hungary: ["hungaroring", "budapest", "hungary"],
  zandvoort: ["zandvoort"],
  monza: ["monza"],
  madrid: ["madring", "madrid"],
  baku: ["baku", "bak"],
  singapore: ["marina_bay", "singapore"],
  austin: ["americas", "austin"],
  mexico: ["rodriguez", "mexico city", "mexico"],
  interlagos: ["interlagos", "sao paulo", "são paulo"],
  "las-vegas": ["vegas", "las vegas"],
  qatar: ["losail", "lusail", "qatar"],
  "yas-marina": ["yas_marina", "yas island", "abu dhabi"],
};

const LOOKUP = new Map();
for (const [slug, keys] of Object.entries(CIRCUITS)) {
  LOOKUP.set(slug, slug);
  for (const k of keys) LOOKUP.set(k.toLowerCase(), slug);
}

export function circuitImage(...candidates) {
  for (const c of candidates) {
    if (!c) continue;
    const slug = LOOKUP.get(String(c).toLowerCase());
    if (slug) return `/circuits/${slug}.png`;
  }
  return null;
}
