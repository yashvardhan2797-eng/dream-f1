import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { api } from "./routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4000);
const WEB_DIST = process.env.WEB_DIST || path.resolve(__dirname, "../../web/dist");

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use("/api", api);

if (existsSync(WEB_DIST)) {
  app.use(express.static(WEB_DIST));
  app.get("*", (_req, res) => res.sendFile(path.join(WEB_DIST, "index.html")));
} else {
  app.get("/", (_req, res) =>
    res.json({ application: "Formula Fan", status: "Running", hint: "Build the web app (web/) to serve the UI from here." }),
  );
}

app.use((err, _req, res, _next) => {
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 502;
  console.error(`[api] ${err.message}`);
  res.status(status).json({ error: err.message });
});

app.listen(PORT, () => console.log(`Formula Fan API listening on http://localhost:${PORT}`));
