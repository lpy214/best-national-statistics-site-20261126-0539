// China in Figures — hand-rolled SVG charts. No library, no network:
// every chart is drawn from the numbers in data.js as inline SVG.
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  function el(name, attrs, text) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function niceTicks(min, max, count) {
    var span = max - min || 1;
    var step = Math.pow(10, Math.floor(Math.log10(span / count)));
    var err = (span / count) / step;
    if (err >= 7.5) step *= 10;
    else if (err >= 3.5) step *= 5;
    else if (err >= 1.5) step *= 2;
    var lo = Math.floor(min / step) * step;
    var out = [];
    for (var v = lo; v <= max + step * 0.5; v += step) out.push(v);
    return out;
  }

  function fmt(v) {
    if (Math.abs(v) >= 1000) return String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (Math.abs(v) >= 100) return String(Math.round(v * 10) / 10);
    return String(Math.round(v * 100) / 100);
  }

  // A line chart. opts: { labels, values, unit, color, height, yLabel }
  // or { labels, series: [{ values, color, label }], ... } for several lines.
  function lineChart(opts) {
    var W = 720, H = opts.height || 300;
    var padL = 64, padR = 16, padT = 14, padB = 34;
    var iw = W - padL - padR, ih = H - padT - padB;
    var allSeries = opts.series ? opts.series : [{ values: opts.values, color: opts.color || "#b3352c", label: "" }];
    var vals = [];
    allSeries.forEach(function (s) { vals = vals.concat(s.values); });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    var span = max - min || 1;
    min = min - span * 0.08; max = max + span * 0.08;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": opts.title || "line chart" });
    var ticks = niceTicks(min, max, 4).filter(function (t) { return t >= min - 1e-9 && t <= max + 1e-9; });
    ticks.forEach(function (t) {
      var y = padT + ih - ((t - min) / (max - min)) * ih;
      svg.appendChild(el("line", { x1: padL, y1: y, x2: W - padR, y2: y, stroke: "#e3ddd2", "stroke-width": 1 }));
      svg.appendChild(el("text", { x: padL - 8, y: y + 4, "text-anchor": "end", "font-size": 12, fill: "#6b6558" }, fmt(t)));
    });
    var n = allSeries[0].values.length;
    function px(i) { return padL + (i / (n - 1)) * iw; }
    function py(v) { return padT + ih - ((v - min) / (max - min)) * ih; }
    allSeries.forEach(function (s) {
      var path = s.values.map(function (v, i) { return (i === 0 ? "M" : "L") + px(i).toFixed(1) + "," + py(v).toFixed(1); }).join(" ");
      svg.appendChild(el("path", { d: path, fill: "none", stroke: s.color, "stroke-width": 2.5, "stroke-linejoin": "round" }));
      s.values.forEach(function (v, i) {
        var c = el("circle", { cx: px(i), cy: py(v), r: 4, fill: s.color, stroke: "#fff", "stroke-width": 1.5 });
        var t = el("title", {}, opts.labels[i] + ": " + fmt(v) + (opts.unit ? " " + opts.unit : "") + (s.label ? " (" + s.label + ")" : ""));
        c.appendChild(t);
        svg.appendChild(c);
      });
    });
    opts.labels.forEach(function (lab, i) {
      if (i === 0 || i === n - 1 || i % 3 === 0) {
        svg.appendChild(el("text", { x: px(i), y: H - 10, "text-anchor": "middle", "font-size": 12, fill: "#6b6558" }, String(lab)));
      }
    });
    if (opts.yLabel) {
      svg.appendChild(el("text", { x: 8, y: padT + 4, "font-size": 12, fill: "#6b6558" }, opts.yLabel));
    }
    if (opts.series) {
      allSeries.forEach(function (s, i) {
        var ly = padT + 4 + i * 18;
        svg.appendChild(el("line", { x1: W - 150, y1: ly - 4, x2: W - 128, y2: ly - 4, stroke: s.color, "stroke-width": 2.5 }));
        svg.appendChild(el("text", { x: W - 122, y: ly, "font-size": 12, fill: "#1d2b36" }, s.label));
      });
    }
    return svg;
  }

  // A vertical bar chart. opts: { labels, values, unit, color, height }
  function barChart(opts) {
    var W = 720, H = opts.height || 300;
    var padL = 64, padR = 16, padT = 14, padB = 34;
    var iw = W - padL - padR, ih = H - padT - padB;
    var vals = opts.values;
    var max = Math.max.apply(null, vals);
    var min = Math.min(0, Math.min.apply(null, vals));
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": opts.title || "bar chart" });
    var ticks = niceTicks(min, max, 4).filter(function (t) { return t >= min - 1e-9 && t <= max + 1e-9; });
    ticks.forEach(function (t) {
      var y = padT + ih - ((t - min) / (max - min)) * ih;
      svg.appendChild(el("line", { x1: padL, y1: y, x2: W - padR, y2: y, stroke: "#e3ddd2", "stroke-width": 1 }));
      svg.appendChild(el("text", { x: padL - 8, y: y + 4, "text-anchor": "end", "font-size": 12, fill: "#6b6558" }, fmt(t)));
    });
    var n = vals.length;
    var slot = iw / n;
    var bw = Math.min(46, slot * 0.62);
    var zeroY = padT + ih - ((0 - min) / (max - min)) * ih;
    vals.forEach(function (v, i) {
      var x = padL + i * slot + (slot - bw) / 2;
      var y = py(v);
      function py(val) { return padT + ih - ((val - min) / (max - min)) * ih; }
      var h = Math.abs(zeroY - y);
      var rect = el("rect", { x: x, y: Math.min(y, zeroY), width: bw, height: Math.max(h, 1.5), fill: v < 0 ? "#0e6e64" : (opts.color || "#b3352c"), rx: 2 });
      rect.appendChild(el("title", {}, opts.labels[i] + ": " + fmt(v) + (opts.unit ? " " + opts.unit : "")));
      svg.appendChild(rect);
      svg.appendChild(el("text", { x: padL + i * slot + slot / 2, y: H - 10, "text-anchor": "middle", "font-size": 12, fill: "#6b6558" }, String(opts.labels[i])));
      if (n <= 12) {
        svg.appendChild(el("text", { x: padL + i * slot + slot / 2, y: Math.min(y, zeroY) - 5, "text-anchor": "middle", "font-size": 11, fill: "#1d2b36" }, fmt(v)));
      }
    });
    return svg;
  }

  // A donut chart. opts: { parts: [{label, value, color}], center }
  function donutChart(opts) {
    var W = 340, H = 300, cx = 170, cy = 140, r = 105, hole = 62;
    var total = opts.parts.reduce(function (s, p) { return s + p.value; }, 0);
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": opts.title || "donut chart" });
    var a0 = -Math.PI / 2;
    opts.parts.forEach(function (p) {
      var frac = p.value / total;
      var a1 = a0 + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      var xi1 = cx + hole * Math.cos(a1), yi1 = cy + hole * Math.sin(a1);
      var xi0 = cx + hole * Math.cos(a0), yi0 = cy + hole * Math.sin(a0);
      var d = "M" + x0.toFixed(1) + "," + y0.toFixed(1) + " A" + r + "," + r + " 0 " + large + " 1 " + x1.toFixed(1) + "," + y1.toFixed(1) +
        " L" + xi1.toFixed(1) + "," + yi1.toFixed(1) + " A" + hole + "," + hole + " 0 " + large + " 0 " + xi0.toFixed(1) + "," + yi0.toFixed(1) + " Z";
      var path = el("path", { d: d, fill: p.color, stroke: "#faf6ef", "stroke-width": 2 });
      path.appendChild(el("title", {}, p.label + ": " + p.value + (opts.unit || "%")));
      svg.appendChild(path);
      a0 = a1;
    });
    svg.appendChild(el("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 22, "font-weight": 700, fill: "#1d2b36" }, opts.center || ""));
    svg.appendChild(el("text", { x: cx, y: cy + 18, "text-anchor": "middle", "font-size": 12, fill: "#6b6558" }, opts.centerLabel || ""));
    var ly = H - opts.parts.length * 20 - 4;
    opts.parts.forEach(function (p, i) {
      svg.appendChild(el("rect", { x: 14, y: ly + i * 20, width: 12, height: 12, fill: p.color, rx: 2 }));
      svg.appendChild(el("text", { x: 32, y: ly + i * 20 + 10, "font-size": 12, fill: "#1d2b36" }, p.label + " — " + p.value + (opts.unit || "%")));
    });
    return svg;
  }

  window.CIFCharts = { lineChart: lineChart, barChart: barChart, donutChart: donutChart };
})();
