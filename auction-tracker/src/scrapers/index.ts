import type { Source } from "../db/schema.js";
import type { Scraper } from "./types.js";
import { izsolesScraper } from "./izsoles.js";
import { ssScraper } from "./ss.js";
import { city24Scraper } from "./city24.js";

export const scrapers: Record<Source, Scraper> = {
  izsoles: izsolesScraper,
  ss: ssScraper,
  city24: city24Scraper,
};

export function getScraper(source: Source): Scraper {
  return scrapers[source];
}

export * from "./types.js";
