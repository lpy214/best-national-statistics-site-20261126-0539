// China in Figures — routing and rendering. One page, hash routes:
// #/overview #/population #/economy #/employment #/prices #/trade
// #/energy #/regions #/sources. Every view is built from CIF in data.js.
(function () {
  "use strict";

  var view = document.getElementById("view");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("#main-nav a"));

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function kpiCards(items) {
    return '<div class="kpi-grid">' + items.map(function (k) {
      return '<div class="kpi"><div class="k-label">' + esc(k.label) + '</div>' +
        '<div class="k-value">' + esc(k.value) + '</div>' +
        (k.change ? '<div class="k-change">' + esc(k.change) + '</div>' : '') +
        (k.source ? '<div class="k-source">' + esc(k.source) + '</div>' : '') +
        (k.extra ? '<div class="k-source">' + esc(k.extra) + '</div>' : '') +
        '</div>';
    }).join("") + "</div>";
  }

  function tableHtml(heads, rows) {
    var h = "<table class=\"data-table\"><thead><tr>" +
      heads.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") +
      "</tr></thead><tbody>";
    rows.forEach(function (r) {
      h += "<tr>" + r.map(function (c, i) {
        return "<td>" + esc(c) + "</td>";
      }).join("") + "</tr>";
    });
    return h + "</tbody></table>";
  }

  function csvButton(id, filename) {
    return '<button type="button" data-csv="' + id + '" data-file="' + esc(filename) + '">Download table as CSV</button>';
  }

  function seriesTable(series, valueLabel) {
    var rows = series.years.map(function (y, i) { return [String(y), String(series.values[i])]; });
    return tableHtml(["Year", valueLabel], rows);
  }

  function downloadCsv(filename, heads, rows) {
    var lines = [heads.join(",")].concat(rows.map(function (r) {
      return r.map(function (c) {
        var s = String(c);
        return s.indexOf(",") >= 0 || s.indexOf('"') >= 0 ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(",");
    }));
    var blob = new Blob([lines.join("\n")], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // Each table registers its CSV data here when its view renders.
  var csvStore = {};

  function registerCsv(id, filename, heads, rows) {
    csvStore[id] = { filename: filename, heads: heads, rows: rows };
  }

  view.addEventListener("click", function (ev) {
    var btn = ev.target.closest ? ev.target.closest("[data-csv]") : null;
    if (!btn) return;
    var entry = csvStore[btn.getAttribute("data-csv")];
    if (entry) downloadCsv(entry.filename, entry.heads, entry.rows);
  });

  // ---------- views ----------

  function renderOverview() {
    var html = '<h1>China at a glance</h1>' +
      '<p class="lede">The headline numbers for the world\u2019s second-largest economy, ' +
      'each with its source and year. Pick a section above, or search the indicator index below.</p>' +
      kpiCards(CIF.kpis2024) +
      '<section class="card"><h2>Find an indicator</h2>' +
      '<div class="toolbar"><input type="search" id="indicator-search" placeholder="Try \u201cGDP\u201d, \u201cbirths\u201d, \u201cexports\u201d\u2026" aria-label="Search indicators"></div>' +
      '<div class="search-results" id="indicator-results"></div></section>' +
      '<div class="two-col">' +
      '<section class="card"><h2>GDP, 2015\u20132024</h2><div class="chart-wrap" id="chart-gdp"></div>' +
      '<p class="source-note">Trillion yuan, current prices. Source: NBS.</p></section>' +
      '<section class="card"><h2>Population, 2015\u20132024</h2><div class="chart-wrap" id="chart-pop"></div>' +
      '<p class="source-note">Million people at year-end. Source: NBS.</p></section></div>' +
      '<section class="card"><h2>Latest releases</h2><ul class="plain">' +
      CIF.latestReleases.map(function (r) {
        return '<li><span class="item-date">' + esc(r.date) + '</span>' + esc(r.title) +
          ' <span class="item-source">— ' + esc(r.source) + '</span></li>';
      }).join("") + '</ul></section>';

    view.innerHTML = html;
    document.getElementById("chart-gdp").appendChild(
      CIFCharts.lineChart({ labels: CIF.series.gdp.years, values: CIF.series.gdp.values, unit: "trillion yuan", color: "#b3352c", yLabel: "¥tn" }));
    document.getElementById("chart-pop").appendChild(
      CIFCharts.lineChart({ labels: CIF.series.population.years, values: CIF.series.population.values, unit: "million", color: "#0e6e64", yLabel: "million" }));

    var input = document.getElementById("indicator-search");
    var results = document.getElementById("indicator-results");
    function showResults(q) {
      var query = q.trim().toLowerCase();
      var list = CIF.indicators.filter(function (ind) {
        return !query || ind.name.toLowerCase().indexOf(query) >= 0 || ind.value.toLowerCase().indexOf(query) >= 0;
      });
      if (!list.length) {
        results.innerHTML = '<p class="empty-note">No indicator matches \u201c' + esc(q.trim()) + '\u201d. Try \u201cGDP\u201d, \u201cprice\u201d or \u201cenergy\u201d.</p>';
        return;
      }
      results.innerHTML = list.map(function (ind) {
        return '<a href="#/' + ind.section + '"><span class="r-name">' + esc(ind.name) + '</span>' +
          '<span class="r-value">' + esc(ind.value) + '</span></a>';
      }).join("");
    }
    input.addEventListener("input", function () { showResults(input.value); });
    showResults("");
  }

  function renderPopulation() {
    var s = CIF.series.population;
    registerCsv("pop", "china-population-2015-2024.csv", ["Year", "Population (million)"],
      s.years.map(function (y, i) { return [y, s.values[i]]; }));
    view.innerHTML = '<h1>Population</h1>' +
      '<p class="lede">China\u2019s population peaked in 2021 and has fallen for three straight years. ' +
      'Two in three residents now live in cities.</p>' +
      kpiCards(CIF.birthsDeaths2024.concat([
        { label: "Population, end-2024", value: "1,408.28m", change: "−1.39m on 2023", source: "NBS, 2024" },
        { label: "Urbanisation rate", value: "67.0%", change: "+0.84 pts on 2023", source: "NBS, 2024" }
      ])) +
      '<section class="card"><h2>Population at year-end, 2015\u20132024</h2>' +
      '<div class="chart-wrap" id="chart-pop"></div>' +
      '<p class="source-note">' + esc(s.source) + '. ' + esc(s.note) + '</p></section>' +
      '<section class="card"><h2>The numbers</h2><div class="table-scroll">' +
      seriesTable(s, "Population (million)") + '</div>' +
      '<div class="toolbar">' + csvButton("pop", "china-population-2015-2024.csv") + '</div>' +
      '<p class="source-note">' + esc(s.source) + '.</p></section>';
    document.getElementById("chart-pop").appendChild(
      CIFCharts.lineChart({ labels: s.years, values: s.values, unit: "million", color: "#0e6e64", yLabel: "million" }));
  }

  function renderEconomy() {
    var g = CIF.series.gdp, gr = CIF.series.gdpGrowth;
    registerCsv("gdp", "china-gdp-2015-2024.csv", ["Year", "GDP (trillion yuan)", "Growth (%)"],
      g.years.map(function (y, i) { return [y, g.values[i], gr.values[i]]; }));
    view.innerHTML = '<h1>Economy</h1>' +
      '<p class="lede">GDP reached ¥134.91 trillion in 2024, growing 5.0% in real terms. ' +
      'Services now produce well over half of output.</p>' +
      kpiCards([
        { label: "GDP, 2024", value: "¥134.91tn", change: "+5.0% real growth", source: "NBS, 2024" },
        { label: "GDP per capita, 2024", value: "¥95,749", change: "+5.1% in real terms", source: "NBS, 2024" },
        { label: "Services share of GDP", value: "56.7%", change: "tertiary sector, 2024", source: "NBS, 2024" },
        { label: "R&D spending", value: "¥3.61tn", change: "2.68% of GDP", source: "NBS, 2024" }
      ]) +
      '<div class="two-col">' +
      '<section class="card"><h2>GDP, 2015\u20132024</h2><div class="chart-wrap" id="chart-gdp"></div>' +
      '<p class="source-note">Trillion yuan, current prices. Source: NBS.</p></section>' +
      '<section class="card"><h2>Real growth, 2015\u20132024</h2><div class="chart-wrap" id="chart-growth"></div>' +
      '<p class="source-note">Percent, year on year. Source: NBS.</p></section></div>' +
      '<section class="card"><h2>What makes up GDP, 2024</h2><div class="chart-side">' +
      '<div class="chart-wrap" id="chart-sectors"></div><div class="chart-text">' +
      '<p>Services dominate: ¥76.56 trillion of the ¥134.91 trillion total. Industry and construction ' +
      'add ¥49.21 trillion; agriculture, forestry, fishing and mining add ¥9.14 trillion.</p>' +
      '<p class="source-note">Source: NBS, 2024. Shares: services 56.7%, secondary 36.5%, primary 6.8%.</p></div></div></section>' +
      '<section class="card"><h2>The numbers</h2><div class="table-scroll">' +
      tableHtml(["Year", "GDP (¥tn)", "Growth (%)"], g.years.map(function (y, i) {
        return [String(y), String(g.values[i]), String(gr.values[i])];
      })) + '</div><div class="toolbar">' + csvButton("gdp", "china-gdp-2015-2024.csv") + '</div>' +
      '<p class="source-note">Source: NBS. GDP at current prices; growth in real terms.</p></section>';
    document.getElementById("chart-gdp").appendChild(
      CIFCharts.lineChart({ labels: g.years, values: g.values, unit: "trillion yuan", color: "#b3352c", yLabel: "¥tn" }));
    document.getElementById("chart-growth").appendChild(
      CIFCharts.barChart({ labels: gr.years, values: gr.values, unit: "%", color: "#b3352c" }));
    document.getElementById("chart-sectors").appendChild(
      CIFCharts.donutChart({
        parts: [
          { label: "Services", value: 56.7, color: "#b3352c" },
          { label: "Industry & construction", value: 36.5, color: "#0e6e64" },
          { label: "Agriculture", value: 6.8, color: "#b98a2f" }
        ],
        center: "¥134.91tn", centerLabel: "GDP, 2024"
      }));
  }

  function renderEmployment() {
    var u = CIF.series.unemployment, inc = CIF.series.income;
    registerCsv("income", "china-income-2015-2024.csv", ["Year", "Per capita disposable income (yuan)"],
      inc.years.map(function (y, i) { return [y, inc.values[i]]; }));
    view.innerHTML = '<h1>Employment &amp; income</h1>' +
      '<p class="lede">12.56 million new urban jobs were created in 2024, and the average surveyed ' +
      'unemployment rate held at 5.1%.</p>' +
      kpiCards(CIF.employmentFacts) +
      '<div class="two-col">' +
      '<section class="card"><h2>Urban surveyed unemployment, 2018\u20132024</h2><div class="chart-wrap" id="chart-unemp"></div>' +
      '<p class="source-note">Percent, annual average. Source: NBS.</p></section>' +
      '<section class="card"><h2>Disposable income, 2015\u20132024</h2><div class="chart-wrap" id="chart-income"></div>' +
      '<p class="source-note">Yuan per person. Source: NBS.</p></section></div>' +
      '<section class="card"><h2>The numbers</h2><div class="table-scroll">' +
      seriesTable(inc, "Disposable income (yuan)") + '</div>' +
      '<div class="toolbar">' + csvButton("income", "china-income-2015-2024.csv") + '</div>' +
      '<p class="source-note">' + esc(inc.source) + '. ' + esc(inc.note) + '</p></section>';
    document.getElementById("chart-unemp").appendChild(
      CIFCharts.lineChart({ labels: u.years, values: u.values, unit: "%", color: "#b3352c", yLabel: "%" }));
    document.getElementById("chart-income").appendChild(
      CIFCharts.lineChart({ labels: inc.years, values: inc.values, unit: "yuan", color: "#0e6e64", yLabel: "¥" }));
  }

  function renderPrices() {
    var c = CIF.series.cpi;
    registerCsv("cpi", "china-cpi-2015-2024.csv", ["Year", "CPI change (%)"],
      c.years.map(function (y, i) { return [y, c.values[i]]; }));
    view.innerHTML = '<h1>Prices</h1>' +
      '<p class="lede">Consumer prices were nearly flat in 2024, rising just 0.2% — the second year in a row ' +
      'at that level, after a 2.9% rise in 2019.</p>' +
      kpiCards([
        { label: "CPI, 2024", value: "+0.2%", change: "annual average", source: "NBS, 2024" },
        { label: "PPI, 2024", value: "−2.2%", change: "producer prices, annual average", source: "NBS, 2024" },
        { label: "CPI, 2019 peak", value: "+2.9%", change: "highest in the last decade", source: "NBS, 2019" }
      ]) +
      '<section class="card"><h2>Consumer price index, 2015\u20132024</h2>' +
      '<div class="chart-wrap" id="chart-cpi"></div>' +
      '<p class="source-note">' + esc(c.source) + '. ' + esc(c.note) + '</p></section>' +
      '<section class="card"><h2>The numbers</h2><div class="table-scroll">' +
      seriesTable(c, "CPI change (%)") + '</div>' +
      '<div class="toolbar">' + csvButton("cpi", "china-cpi-2015-2024.csv") + '</div>' +
      '<p class="source-note">' + esc(c.source) + '.</p></section>';
    document.getElementById("chart-cpi").appendChild(
      CIFCharts.lineChart({ labels: c.years, values: c.values, unit: "%", color: "#b3352c", yLabel: "%" }));
  }

  function renderTrade() {
    var t = CIF.series.trade, ex = CIF.series.exports, im = CIF.series.imports;
    registerCsv("trade", "china-trade-2015-2024.csv", ["Year", "Total (trillion yuan)", "Exports", "Imports"],
      t.years.map(function (y, i) { return [y, t.values[i], ex.values[i], im.values[i]]; }));
    view.innerHTML = '<h1>Trade</h1>' +
      '<p class="lede">Goods trade reached a record ¥43.85 trillion in 2024 — exports ¥25.45 trillion, ' +
      'imports ¥18.39 trillion, a surplus of ¥7.06 trillion.</p>' +
      kpiCards([
        { label: "Total goods trade, 2024", value: "¥43.85tn", change: "+5.0% on 2023", source: "GACC, 2024" },
        { label: "Exports, 2024", value: "¥25.45tn", change: "+7.1% on 2023", source: "GACC, 2024" },
        { label: "Imports, 2024", value: "¥18.39tn", change: "+2.3% on 2023", source: "GACC, 2024" },
        { label: "Trade surplus, 2024", value: "¥7.06tn", change: "exports minus imports", source: "GACC, 2024" }
      ]) +
      '<section class="card"><h2>Exports and imports, 2015\u20132024</h2>' +
      '<div class="chart-wrap" id="chart-trade"></div>' +
      '<p class="source-note">Trillion yuan. Red: exports; teal: imports. Source: GACC.</p></section>' +
      '<section class="card"><h2>Biggest trading partners, 2024</h2><div class="table-scroll">' +
      tableHtml(["Partner", "Trade (¥tn)", "Note"], CIF.tradePartners2024.map(function (p) {
        return [p.partner, String(p.value), p.note];
      })) + '</div><p class="source-note">Source: GACC, 2024.</p></section>' +
      '<section class="card"><h2>The numbers</h2><div class="table-scroll">' +
      tableHtml(["Year", "Total (¥tn)", "Exports (¥tn)", "Imports (¥tn)"], t.years.map(function (y, i) {
        return [String(y), String(t.values[i]), String(ex.values[i]), String(im.values[i])];
      })) + '</div><div class="toolbar">' + csvButton("trade", "china-trade-2015-2024.csv") + '</div>' +
      '<p class="source-note">' + esc(t.source) + '. ' + esc(t.note) + '</p></section>';
    document.getElementById("chart-trade").appendChild(
      CIFCharts.lineChart({
        labels: t.years,
        series: [
          { values: ex.values, color: "#b3352c", label: "Exports" },
          { values: im.values, color: "#0e6e64", label: "Imports" }
        ],
        unit: "trillion yuan", yLabel: "¥tn"
      }));
  }

  function renderEnergy() {
    view.innerHTML = '<h1>Energy &amp; environment</h1>' +
      '<p class="lede">Coal still supplies just over half of China\u2019s energy, but non-fossil sources ' +
      'reached a fifth of consumption in 2024, and renewables are now 56% of installed capacity.</p>' +
      kpiCards(CIF.energyFacts) +
      '<section class="card"><h2>Where the energy comes from, 2024</h2><div class="chart-side">' +
      '<div class="chart-wrap" id="chart-mix"></div><div class="chart-text">' +
      '<p>Coal\u2019s share fell 1.6 points in a year, to 53.2%. Non-fossil energy — hydro, nuclear, wind ' +
      'and solar — reached 20.0% of consumption, and 1,889 GW of renewable capacity was on the grid ' +
      'by the end of the year.</p>' +
      '<p class="source-note">Shares of total energy consumption. Source: NBS Statistical Communiqué 2024; ' +
      'capacity: National Energy Administration, end-2024.</p></div></div></section>' +
      '<section class="card"><h2>The numbers</h2><div class="table-scroll">' +
      tableHtml(["Source", "Share of energy use (%)"], CIF.energyMix2024.map(function (m) {
        return [m.label, String(m.value)];
      })) + '</div><p class="source-note">Source: NBS, 2024.</p></section>' +
      '<section class="card"><h2>Also in 2024</h2><ul class="plain">' +
      '<li><strong>Grain output 706.5 million tonnes</strong> — up 1.6%, a record harvest. <span class="item-source">NBS, 2024</span></li>' +
      '<li><strong>Forest coverage 24.02%</strong> — the figure published for 2023, the latest release. <span class="item-source">National Forestry and Grassland Administration, 2023</span></li>' +
      '<li><strong>High-speed rail 48,000 km</strong> — in operation by the end of 2024. <span class="item-source">National Railway Administration, 2024</span></li>' +
      '<li><strong>Express parcels 174.5 billion</strong> — delivered in 2024. <span class="item-source">State Post Bureau, 2024</span></li>' +
      '</ul></section>';
    document.getElementById("chart-mix").appendChild(
      CIFCharts.donutChart({
        parts: [
          { label: "Coal", value: 53.2, color: "#3a3a3a" },
          { label: "Crude oil", value: 18.0, color: "#b3352c" },
          { label: "Natural gas", value: 8.8, color: "#b98a2f" },
          { label: "Non-fossil", value: 20.0, color: "#0e6e64" }
        ],
        center: "5.96bn tce", centerLabel: "energy use, 2024"
      }));
  }

  function renderRegions() {
    registerCsv("regions", "china-provinces-gdp-2024.csv", ["Province", "GDP (trillion yuan)", "Growth (%)"],
      CIF.regions2024.map(function (r) { return [r.name, r.gdp, r.growth]; }));
    view.innerHTML = '<h1>Regions</h1>' +
      '<p class="lede">Guangdong and Jiangsu each produce more than ¥13 trillion a year — together more than ' +
      'a fifth of national GDP. Compare any two provinces below.</p>' +
      '<section class="card"><h2>Top 10 provinces by GDP, 2024</h2><div class="table-scroll">' +
      tableHtml(["#", "Province", "GDP (¥tn)", "Growth (%)"], CIF.regions2024.map(function (r, i) {
        return [String(i + 1), r.name, String(r.gdp), String(r.growth)];
      })) + '</div><div class="toolbar">' + csvButton("regions", "china-provinces-gdp-2024.csv") + '</div>' +
      '<p class="source-note">Provincial GDP at current prices. Sources: provincial statistical bureaus and NBS, 2024.</p></section>' +
      '<section class="card"><h2>Compare two provinces</h2>' +
      '<div class="toolbar">' +
      '<label class="field">First province<select id="cmp-a"></select></label>' +
      '<label class="field">Second province<select id="cmp-b"></select></label>' +
      '</div><div class="chart-wrap" id="chart-cmp"></div>' +
      '<p class="source-note" id="cmp-note"></p></section>';
    var selA = document.getElementById("cmp-a"), selB = document.getElementById("cmp-b");
    CIF.regions2024.forEach(function (r, i) {
      selA.add(new Option(r.name + " — ¥" + r.gdp + "tn", String(i)));
      selB.add(new Option(r.name + " — ¥" + r.gdp + "tn", String(i)));
    });
    selA.value = "0"; selB.value = "1";
    function drawCompare() {
      var a = CIF.regions2024[Number(selA.value)], b = CIF.regions2024[Number(selB.value)];
      var wrap = document.getElementById("chart-cmp");
      wrap.innerHTML = "";
      wrap.appendChild(CIFCharts.barChart({
        labels: [a.name, b.name], values: [a.gdp, b.gdp], unit: "trillion yuan", color: "#b3352c", height: 260
      }));
      var bigger = a.gdp >= b.gdp ? a : b, smaller = a.gdp >= b.gdp ? b : a;
      document.getElementById("cmp-note").textContent =
        bigger.name + " (\u00a5" + bigger.gdp + "tn) is " + (bigger.gdp / smaller.gdp).toFixed(2) +
        "\u00d7 the size of " + smaller.name + " (\u00a5" + smaller.gdp + "tn). Growth in 2024: " +
        a.name + " " + a.growth + "%, " + b.name + " " + b.growth + "%.";
    }
    selA.addEventListener("change", drawCompare);
    selB.addEventListener("change", drawCompare);
    drawCompare();
  }

  function renderSources() {
    view.innerHTML = '<h1>Sources &amp; notes</h1>' +
      '<p class="lede">Every figure on this site comes from an official release. This page lists them, ' +
      'and how the numbers are handled.</p>' +
      '<section class="card"><h2>Where the numbers come from</h2><ul class="plain">' +
      CIF.sources.map(function (s) {
        return '<li><strong>' + esc(s.body) + '</strong><br><span class="item-source">' + esc(s.detail) + '</span></li>';
      }).join("") +
      '<li><strong>National Railway Administration; State Post Bureau</strong><br>' +
      '<span class="item-source">High-speed rail length and express parcel volumes, 2024.</span></li>' +
      '</ul></section>' +
      '<section class="card"><h2>Notes on the data</h2><ul class="plain">' +
      '<li><strong>Latest full year.</strong> All headline figures are for 2024, the latest year with a complete set of releases at the time this site was built.</li>' +
      '<li><strong>Revisions.</strong> GDP and population figures are the revised values published with the 2024 releases; earlier years may differ slightly from the numbers first announced at the time.</li>' +
      '<li><strong>Rounding.</strong> Shares and growth rates are shown as published; a set of shares may add to 99.9 or 100.1 because of rounding.</li>' +
      '<li><strong>What \u201csurveyed unemployment\u201d means.</strong> The urban surveyed unemployment rate is the NBS monthly survey of urban workers; it has been published since 2018 and is not the same as registered unemployment.</li>' +
      '<li><strong>Current vs real.</strong> GDP levels are at current prices; growth rates are in real terms (price changes stripped out).</li>' +
      '</ul></section>' +
      '<section class="card"><h2>About this site</h2>' +
      '<p>China in Figures is an independent, unofficial reader of public statistics. It is not affiliated ' +
      'with the National Bureau of Statistics of China or any other body named here. The site is a set of ' +
      'static files: it works offline, makes no network requests, and stores nothing about its visitors.</p>' +
      '<p>Built for the make.fun \u201cbest national statistics site\u201d bounty, November 2026.</p></section>';
  }

  var routes = {
    overview: { title: "China in Figures — National Statistics", render: renderOverview },
    population: { title: "Population — China in Figures", render: renderPopulation },
    economy: { title: "Economy — China in Figures", render: renderEconomy },
    employment: { title: "Employment & Income — China in Figures", render: renderEmployment },
    prices: { title: "Prices — China in Figures", render: renderPrices },
    trade: { title: "Trade — China in Figures", render: renderTrade },
    energy: { title: "Energy & Environment — China in Figures", render: renderEnergy },
    regions: { title: "Regions — China in Figures", render: renderRegions },
    sources: { title: "Sources & Notes — China in Figures", render: renderSources }
  };

  function currentRoute() {
    var hash = (location.hash || "#/overview").replace(/^#\/?/, "");
    return routes[hash] ? hash : "overview";
  }

  function render() {
    var route = currentRoute();
    document.title = routes[route].title;
    navLinks.forEach(function (a) {
      if (a.getAttribute("data-route") === route) a.classList.add("active");
      else a.classList.remove("active");
    });
    routes[route].render();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);
  render();
})();
