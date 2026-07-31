import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { api } from "./routes.js";
import { startScheduler } from "../jobs/scheduler.js";

const app = express();
app.use(express.json());

app.use("/api", api);
app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve the static UI from src/public (copied next to the compiled server too).
const here = dirname(fileURLToPath(import.meta.url));
// Works both compiled (dist/server -> dist/public) and via tsx (src/server -> src/public).
const candidates = [join(here, "..", "public"), join(here, "..", "..", "src", "public")];
const publicDir = candidates.find((p) => existsSync(p)) ?? join(here, "..", "public");
app.use(express.static(publicDir));

const port = Number(process.env.PORT ?? 5000);
app.listen(port, "0.0.0.0", () => {
  console.log(`auction-tracker listening on http://0.0.0.0:${port}`);
  startScheduler();
});
