import fs from "node:fs/promises";

const CONFIG_PATH = new URL("../config/menu.json", import.meta.url);

function parseArgs(argv) {
  const args = {
    meal: "all",
    date: null
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--meal") {
      args.meal = argv[++i];
    } else if (arg === "--date") {
      args.date = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

function todayInKorea() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  return formatter.format(new Date()).replaceAll("-", "");
}

function formatDisplayDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function normalizeDate(value) {
  if (!value) return todayInKorea();
  const normalized = value.replaceAll("-", "");
  if (!/^\d{8}$/.test(normalized)) {
    throw new Error(`Invalid date: ${value}. Use YYYYMMDD or YYYY-MM-DD.`);
  }
  return normalized;
}

async function loadConfig() {
  return JSON.parse(await fs.readFile(CONFIG_PATH, "utf8"));
}

async function fetchMenus(config, date) {
  const url = `${config.apiBaseUrl}/${date}/${date}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Menu API failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function formatFood(food, config) {
  const vegan = food.isVegan ? `${config.veganMark} ` : "";
  if (config.includeEnglishNames && food.name_eng) {
    return `${vegan}${food.name_kor} / ${food.name_eng}`;
  }
  return `${vegan}${food.name_kor}`;
}

function formatType(menu, typeConfig, config) {
  const label = typeConfig.label ? `${typeConfig.label}: ` : "";

  if (!menu || !Array.isArray(menu.foods) || menu.foods.length === 0) {
    return `${label}${config.emptyText}`;
  }

  const foods = menu.foods.map((food) => formatFood(food, config)).join(", ");
  const nutrition = config.includeNutrition
    ? ` (${menu.kcal ?? 0}kcal, 단백질 ${menu.protein ?? 0}g)`
    : "";

  return `${label}${foods}${nutrition}`;
}

function formatMeal(apiMenus, mealKey, config, date) {
  const meal = config.meals[mealKey];
  if (!meal) {
    throw new Error(`Unknown meal: ${mealKey}. Use breakfast, lunch, dinner, or all.`);
  }

  const lines = [`${meal.title} (${formatDisplayDate(date)})`];
  for (const typeConfig of meal.types) {
    const menu = apiMenus.find((item) => String(item.date) === date && item.type === typeConfig.key);
    lines.push(formatType(menu, typeConfig, config));
  }

  return lines.join("\n");
}

function formatOutput(apiMenus, mealKey, config, date) {
  if (mealKey === "all") {
    return config.mealOrder.map((key) => formatMeal(apiMenus, key, config, date)).join("\n\n");
  }
  return formatMeal(apiMenus, mealKey, config, date);
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  console.log("Usage: node scripts/render-menu.mjs [--meal breakfast|lunch|dinner|all] [--date YYYYMMDD]");
  process.exit(0);
}

const config = await loadConfig();
const currentDate = normalizeDate(args.date);
const menus = await fetchMenus(config, currentDate);
console.log(formatOutput(menus, args.meal, config, currentDate));
