import fs from "node:fs/promises";
import path from "node:path";

const API_BASE_URL = "https://food.podac.poapper.com/v1/menus/period";
const API_DIR = path.resolve("docs/api");

function todayInKorea() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(new Date()).replaceAll("-", "");
}

function normalizeDate(value) {
  const date = (value || todayInKorea()).replaceAll("-", "");
  if (!/^\d{8}$/.test(date)) {
    throw new Error(`Invalid date: ${value}. Use YYYYMMDD or YYYY-MM-DD.`);
  }
  return date;
}

async function fetchMenu(date) {
  const response = await fetch(`${API_BASE_URL}/${date}/${date}`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) {
    throw new Error(`POSTECH menu API failed: ${response.status} ${response.statusText}`);
  }
  const menus = await response.json();
  if (!Array.isArray(menus)) {
    throw new Error("POSTECH menu API returned a non-array payload.");
  }
  return menus;
}

async function main() {
  const dateArg = process.argv.includes("--date")
    ? process.argv[process.argv.indexOf("--date") + 1]
    : null;
  const date = normalizeDate(dateArg);
  const menus = await fetchMenu(date);

  await fs.mkdir(API_DIR, { recursive: true });
  const payload = {
    date,
    source: `${API_BASE_URL}/${date}/${date}`,
    cachedAt: new Date().toISOString(),
    timezone: "Asia/Seoul",
    menus
  };

  const json = `${JSON.stringify(payload, null, 2)}\n`;
  await fs.writeFile(path.join(API_DIR, `${date}.json`), json, "utf8");
  await fs.writeFile(path.join(API_DIR, "today.json"), json, "utf8");

  console.log(`Cached ${menus.length} menu entries for ${date}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
