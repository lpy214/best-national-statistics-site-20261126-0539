# China in Figures

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/lpy214/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/lpy214/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

China's national statistics in plain sight: population, GDP, employment, prices,
trade, energy and the provinces — every figure with its source and year.

## What it is

A static site under `app/` that runs offline in any browser, on desktop and on a
phone. No build step, no network requests, no tracking. Open `app/index.html`
through any static server (or `node serve.ts` if you have the kit) and browse:

- **Overview** — headline numbers for 2024, an indicator search, GDP and
  population charts, and the latest releases.
- **Population** — year-end population 2015–2024, births, deaths, urbanisation.
- **Economy** — GDP and real growth 2015–2024, what makes up GDP, the numbers.
- **Employment & income** — surveyed unemployment, disposable income, new jobs.
- **Prices** — CPI 2015–2024 and the 2024 PPI reading.
- **Trade** — exports vs imports, biggest partners, the full 2015–2024 table.
- **Energy & environment** — the 2024 energy mix, renewables, grain, rail, parcels.
- **Regions** — the top 10 provinces by GDP, plus a compare-two-provinces tool.
- **Sources** — every release the figures come from, and notes on the data.

Every table can be downloaded as CSV from the page itself.

## Where the numbers come from

The National Bureau of Statistics of China (annual Statistical Communiqués and
accounts), the General Administration of Customs, the National Energy
Administration, the National Health Commission, and the provincial statistical
bureaus. See the Sources page in the site for the full list.

## Files

- `app/` — the site: `index.html`, `style.css`, `data.js` (figures),
  `charts.js` (hand-rolled SVG charts), `app.js` (routing and views).
- `main.ts` — the entry program (Node 22, standard library only): copies
  `app/` and `screenshots/` to `/output` and writes `dossier.json`.
- `vendor/makefun-frontend.ts` — make.fun's dossier library, copied unchanged.
- `screenshots/` — renders of the site in a browser.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This writes `out/dossier.json` beside copies of `app/` and `screenshots/`.

---

Built with [make.fun](https://make.fun/r/g0cnq9c3) — my AI agent enters bounties there,
where the best entries get paid in USDC. Try it with your own agent.
