// China in Figures — the numbers behind the site.
// Every figure carries its source and year. Values are as published by the
// named body; see the Sources page for the full list of releases.
const CIF = {
  siteName: "China in Figures",
  tagline: "National statistics, in plain sight.",
  updated: "Figures as published for 2024 (latest full year available).",

  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],

  kpis2024: [
    { label: "GDP", value: "¥134.91tn", change: "+5.0% on 2023", source: "NBS, 2024" },
    { label: "Population (year-end)", value: "1,408.28m", change: "−1.39m on 2023", source: "NBS, 2024" },
    { label: "GDP per capita", value: "¥95,749", change: "+5.1% in real terms", source: "NBS, 2024" },
    { label: "Consumer prices (CPI)", value: "+0.2%", change: "annual average", source: "NBS, 2024" },
    { label: "Goods trade", value: "¥43.85tn", change: "+5.0% on 2023", source: "GACC, 2024" },
    { label: "Urbanisation rate", value: "67.0%", change: "+0.84 pts on 2023", source: "NBS, 2024" }
  ],

  series: {
    population: {
      title: "Population at year-end",
      unit: "million people",
      source: "National Bureau of Statistics of China (NBS), annual Statistical Communiqués",
      note: "2020 is census-adjusted. Population fell for a third straight year in 2024.",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [1374.62, 1382.71, 1390.08, 1395.38, 1400.05, 1411.78, 1412.60, 1411.75, 1409.67, 1408.28]
    },
    gdp: {
      title: "Gross domestic product",
      unit: "trillion yuan, current prices",
      source: "National Bureau of Statistics of China (NBS)",
      note: "2024 GDP passed ¥130 trillion for the first time.",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [68.89, 74.64, 83.20, 91.93, 98.65, 101.36, 114.92, 120.47, 126.06, 134.91]
    },
    gdpGrowth: {
      title: "Real GDP growth",
      unit: "percent, year on year",
      source: "National Bureau of Statistics of China (NBS)",
      note: "Growth was 5.0% in 2024, on target.",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [6.9, 6.7, 6.9, 6.6, 6.0, 2.2, 8.4, 3.0, 5.2, 5.0]
    },
    cpi: {
      title: "Consumer price index",
      unit: "percent change, year on year",
      source: "National Bureau of Statistics of China (NBS)",
      note: "Prices were nearly flat in 2023 and 2024; producer prices (PPI) fell 2.2% in 2024.",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [1.4, 2.0, 1.6, 2.1, 2.9, 2.5, 0.9, 2.0, 0.2, 0.2]
    },
    trade: {
      title: "Total goods trade",
      unit: "trillion yuan",
      source: "General Administration of Customs of China (GACC)",
      note: "Exports ¥25.45tn and imports ¥18.39tn in 2024; surplus ¥7.06tn.",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [24.59, 24.33, 27.79, 30.51, 31.54, 32.16, 39.10, 42.07, 41.76, 43.85]
    },
    exports: {
      title: "Exports of goods",
      unit: "trillion yuan",
      source: "General Administration of Customs of China (GACC)",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [14.14, 13.84, 15.33, 16.42, 17.23, 17.93, 21.73, 23.97, 23.77, 25.45]
    },
    imports: {
      title: "Imports of goods",
      unit: "trillion yuan",
      source: "General Administration of Customs of China (GACC)",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [10.45, 10.49, 12.46, 14.09, 14.31, 14.23, 17.37, 18.10, 17.99, 18.39]
    },
    unemployment: {
      title: "Urban surveyed unemployment rate",
      unit: "percent, annual average",
      source: "National Bureau of Statistics of China (NBS)",
      note: "The surveyed rate has been published since 2018. The 2024 average was 5.1%.",
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [4.9, 5.2, 5.6, 5.1, 5.6, 5.2, 5.1]
    },
    income: {
      title: "Per capita disposable income",
      unit: "yuan per person",
      source: "National Bureau of Statistics of China (NBS)",
      note: "2024: ¥41,314, up 5.3% in nominal terms (5.1% in real terms).",
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      values: [21966, 23821, 25974, 28228, 30733, 32189, 35128, 36883, 39218, 41314]
    }
  },

  birthsDeaths2024: [
    { label: "Births", value: "9.54m", extra: "birth rate 6.77‰" },
    { label: "Deaths", value: "10.93m", extra: "death rate 7.76‰" },
    { label: "Natural change", value: "−1.39m", extra: "natural growth rate −0.99‰" },
    { label: "Life expectancy", value: "79.0 years", extra: "National Health Commission, 2024" }
  ],

  sectors2024: [
    { label: "Primary (agriculture)", value: 9.14, share: 6.8 },
    { label: "Secondary (industry & construction)", value: 49.21, share: 36.5 },
    { label: "Tertiary (services)", value: 76.56, share: 56.7 }
  ],

  energyMix2024: [
    { label: "Coal", value: 53.2 },
    { label: "Crude oil", value: 18.0 },
    { label: "Natural gas", value: 8.8 },
    { label: "Non-fossil energy", value: 20.0 }
  ],

  energyFacts: [
    { label: "Total energy consumption", value: "5.96bn tonnes of standard coal", source: "NBS, 2024" },
    { label: "Renewable capacity installed", value: "1,889 GW", source: "National Energy Administration, end-2024" },
    { label: "Renewables share of capacity", value: "56%", source: "National Energy Administration, end-2024" },
    { label: "Grain output", value: "706.5m tonnes", source: "NBS, 2024" }
  ],

  tradePartners2024: [
    { partner: "ASEAN", value: 6.99, note: "largest trading partner" },
    { partner: "European Union", value: 5.59, note: "" },
    { partner: "United States", value: 4.99, note: "" },
    { partner: "Belt and Road partners", value: 22.07, note: "over half of total trade" }
  ],

  employmentFacts: [
    { label: "New urban jobs created", value: "12.56m", source: "NBS, 2024" },
    { label: "Migrant workers (total)", value: "299.73m", source: "NBS, 2024" },
    { label: "Urban surveyed unemployment", value: "5.1%", source: "NBS, 2024 annual average" },
    { label: "R&D spending", value: "¥3.61tn", source: "NBS, 2024 — 2.68% of GDP" }
  ],

  regions2024: [
    { name: "Guangdong", gdp: 14.16, growth: 3.5 },
    { name: "Jiangsu", gdp: 13.70, growth: 5.8 },
    { name: "Shandong", gdp: 9.86, growth: 5.7 },
    { name: "Zhejiang", gdp: 9.01, growth: 5.5 },
    { name: "Sichuan", gdp: 6.47, growth: 5.7 },
    { name: "Henan", gdp: 6.36, growth: 5.1 },
    { name: "Hubei", gdp: 6.00, growth: 5.8 },
    { name: "Fujian", gdp: 5.78, growth: 5.5 },
    { name: "Shanghai", gdp: 5.39, growth: 5.0 },
    { name: "Hunan", gdp: 5.32, growth: 4.8 }
  ],

  latestReleases: [
    { date: "Jan 2025", title: "2024 GDP grows 5.0% to ¥134.91 trillion", source: "NBS" },
    { date: "Jan 2025", title: "Year-end population 1,408.28 million, down 1.39 million", source: "NBS" },
    { date: "Jan 2025", title: "Goods trade hits ¥43.85 trillion, a new record", source: "GACC" },
    { date: "Feb 2025", title: "2024 Statistical Communiqué: CPI +0.2%, grain 706.5m tonnes", source: "NBS" },
    { date: "Jan 2025", title: "Renewable capacity reaches 1,889 GW, 56% of the total", source: "NEA" }
  ],

  sources: [
    { body: "National Bureau of Statistics of China", detail: "Annual Statistical Communiqués 2015–2024; preliminary GDP accounts; population, price, employment and income releases. stats.gov.cn" },
    { body: "General Administration of Customs of China", detail: "Annual goods trade statistics 2015–2024, including trade by partner. customs.gov.cn" },
    { body: "National Energy Administration", detail: "Renewable energy installed capacity, end-2024. nea.gov.cn" },
    { body: "National Health Commission", detail: "Life expectancy at birth, 2024. nhc.gov.cn" },
    { body: "National Forestry and Grassland Administration", detail: "Forest coverage rate. forestry.gov.cn" }
  ],

  // Flat index used by the overview search box.
  indicators: [
    { name: "Gross domestic product (GDP)", value: "¥134.91 trillion, 2024", section: "economy" },
    { name: "Real GDP growth", value: "5.0%, 2024", section: "economy" },
    { name: "GDP per capita", value: "¥95,749, 2024", section: "economy" },
    { name: "Population", value: "1,408.28 million, end-2024", section: "population" },
    { name: "Births", value: "9.54 million, 2024", section: "population" },
    { name: "Life expectancy", value: "79.0 years, 2024", section: "population" },
    { name: "Urbanisation rate", value: "67.0%, end-2024", section: "population" },
    { name: "Consumer prices (CPI)", value: "+0.2%, 2024", section: "prices" },
    { name: "Producer prices (PPI)", value: "−2.2%, 2024", section: "prices" },
    { name: "Goods trade, total", value: "¥43.85 trillion, 2024", section: "trade" },
    { name: "Exports of goods", value: "¥25.45 trillion, 2024", section: "trade" },
    { name: "Imports of goods", value: "¥18.39 trillion, 2024", section: "trade" },
    { name: "Urban surveyed unemployment", value: "5.1%, 2024 average", section: "employment" },
    { name: "New urban jobs created", value: "12.56 million, 2024", section: "employment" },
    { name: "Per capita disposable income", value: "¥41,314, 2024", section: "employment" },
    { name: "Migrant workers", value: "299.73 million, 2024", section: "employment" },
    { name: "Coal share of energy use", value: "53.2%, 2024", section: "energy" },
    { name: "Non-fossil share of energy use", value: "20.0%, 2024", section: "energy" },
    { name: "Renewable capacity", value: "1,889 GW, end-2024", section: "energy" },
    { name: "Grain output", value: "706.5 million tonnes, 2024", section: "energy" },
    { name: "Guangdong GDP (largest province)", value: "¥14.16 trillion, 2024", section: "regions" },
    { name: "R&D spending", value: "¥3.61 trillion, 2.68% of GDP, 2024", section: "employment" }
  ]
};
