const TEAM_COLOURS = {
  mercedes: "#27F4D2",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  red_bull: "#3671C6",
  williams: "#64C4FF",
  aston_martin: "#229971",
  alpine: "#0093CC",
  rb: "#6692FF",
  sauber: "#52E252",
  audi: "#C0C0C0",
  haas: "#B6BABD",
  cadillac: "#004C97",
};

export function teamColour(teamOrId = "") {
  const key = teamOrId.toLowerCase().replace(/ f1 team| racing| formula 1| /g, (m) => (m === " " ? "_" : ""));
  for (const [id, colour] of Object.entries(TEAM_COLOURS)) {
    if (key.includes(id) || id.includes(key)) return colour;
  }
  return "#00E5FF";
}
