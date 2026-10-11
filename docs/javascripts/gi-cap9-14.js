/* Grafici interattivi dei capitoli 9 e 14 di «Programmazione lineare»
 * (Teoria della dualità; Analisi di sensitività).
 *
 * Ricette per il motore interattivi.js (formato nel commento in testa al motore):
 *   dualita-debole  primale e duale affiancati, x̄ e π̄ trascinabili:
 *                   c'x̄ ≤ b'π̄ (dualità debole), uguaglianza solo agli ottimi
 *                   (dualità forte); sfida: «porta c'x̄ = b'π̄» (cap. 9)
 *   sensitivita     c1 + δ oppure b1 + δ: intervallo di ottimalità della base,
 *                   vertice ottimo, prezzo ombra e z* lineare (cap. 14)
 *
 * Dati: i problemi del catalogo (CATALOGO di catalogo_pl.js, frazioni esatte
 * "num/den"), solo quelli con n = 2; tutti i conti che si leggono (vertici,
 * ottimo duale, intervalli, prezzi ombra) sono fatti in frazioni esatte.
 * Colori come nelle dispense: regioni ammissibili rosse, ottimi e rette di
 * livello blu, punti ammissibili non ottimi e basi non più ottime viola.
 * Nessuna etichetta di testo nei grafici: i valori sono nelle letture.
 */
(function () {
  "use strict";
  window.GI_RICETTE = window.GI_RICETTE || {};

  // =============================================================== frazioni
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const Q = (n, d = 1) => {
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d);
    return { n: n / g, d: d / g };
  };
  const qp = (s) => { const [a, b] = String(s).split("/"); return Q(parseInt(a, 10), b ? parseInt(b, 10) : 1); };
  const add = (p, q) => Q(p.n * q.d + q.n * p.d, p.d * q.d);
  const sub = (p, q) => Q(p.n * q.d - q.n * p.d, p.d * q.d);
  const mul = (p, q) => Q(p.n * q.n, p.d * q.d);
  const div = (p, q) => Q(p.n * q.d, p.d * q.n);
  const neg = (p) => Q(-p.n, p.d);
  const sgn = (p) => Math.sign(p.n);
  const cmp = (p, q) => sgn(sub(p, q));
  const fl = (p) => p.n / p.d;
  const ZERO = Q(0), UNO = Q(1);
  // valore di un cursore (passi di 1/4) come frazione esatta
  const daCursore = (x) => Q(Math.round(x * 4), 4);
  const dot = (g, x) => add(mul(g[0], x[0]), mul(g[1], x[1]));
  // soluzione esatta di [g1; g2] y = [h1; h2] (null se singolare)
  const risolvi = (g1, g2, h1, h2) => {
    const det = sub(mul(g1[0], g2[1]), mul(g1[1], g2[0]));
    if (!det.n) return null;
    return [div(sub(mul(h1, g2[1]), mul(g1[1], h2)), det), div(sub(mul(g1[0], h2), mul(g2[0], h1)), det)];
  };
  const ugualiQ = (u, v) => !cmp(u[0], v[0]) && !cmp(u[1], v[1]);

  // ============================================================== TeX
  const EN = () => !!(window.GI && window.GI.EN);
  const T = (it, en) => (EN() ? en : it);
  const num = (x, c = 2) => window.GI.num(x, c);
  const fr = (p) => (p.d === 1 ? String(p.n) : `${p.n < 0 ? "-" : ""}\\tfrac{${Math.abs(p.n)}}{${p.d}}`);
  const sep = () => (EN() ? ",\\ " : ";\\ ");
  const coppiaQ = (v) => `\\big(${fr(v[0])}${sep()}${fr(v[1])}\\big)`;
  const coppiaF = (v, c = 2) => `\\big(${num(v[0], c)}${sep()}${num(v[1], c)}\\big)`;
  const estremo = (p, segno) => (p ? fr(p) : segno > 0 ? "+\\infty" : "-\\infty");
  /** espressione lineare: coefficienti (frazioni) e nomi delle variabili */
  const lin = (coef, vars) => {
    let s = "";
    coef.forEach((q, i) => {
      if (!q.n) return;
      const a = Q(Math.abs(q.n), q.d), meno = q.n < 0;
      const k = a.n === 1 && a.d === 1 ? "" : fr(a) + "\\,";
      s += s ? (meno ? " - " : " + ") : meno ? "-" : "";
      s += k + vars[i];
    });
    return s || "0";
  };
  const X = ["x_1", "x_2"], PI = ["\\pi_1", "\\pi_2"];
  const bx = "\\bar{\\boldsymbol x}", bpi = "\\bar{\\boldsymbol \\pi}";

  // ============================================================== catalogo
  const catalogo = () => window.CATALOGO || (typeof CATALOGO !== "undefined" ? CATALOGO : {}); // eslint-disable-line no-undef
  /** problema del catalogo in frazioni: G y <= h con le righe di A e i vincoli -x_j <= 0 */
  const problema = (k) => {
    const P = catalogo()[k];
    if (!P) throw new Error("problema " + k + " assente dal catalogo");
    const c = P.c.map(qp), A = P.A.map((r) => r.map(qp)), b = P.b.map(qp);
    return { nome: k, m: P.m, c, A, b, z: P.z != null ? qp(P.z) : null, x: P.x ? P.x.map(qp) : null };
  };
  const righe = (A) => A.concat([[neg(UNO), ZERO], [ZERO, neg(UNO)]]);
  const termini = (b) => b.concat([ZERO, ZERO]);
  /** vertici esatti di { y : G y <= h } */
  const vertici = (G, h) => {
    const V = [];
    for (let i = 0; i < G.length; i++) for (let j = i + 1; j < G.length; j++) {
      const v = risolvi(G[i], G[j], h[i], h[j]);
      if (!v || !G.every((g, r) => cmp(dot(g, v), h[r]) <= 0)) continue;
      if (!V.some((w) => ugualiQ(w, v))) V.push(v);
    }
    return V;
  };
  const attivi = (G, h, v) => G.map((g, r) => (!cmp(dot(g, v), h[r]) ? r : -1)).filter((r) => r >= 0);

  // -------------------------------------------------------- geometria in virgola mobile
  const Gf = (G) => G.map((g) => g.map(fl));
  const dentro = (Gn, hn, x, y, tol = 1e-9) => Gn.every((g, r) => g[0] * x + g[1] * y <= hn[r] + tol);
  /** il poligono { G y <= h } tagliato dal riquadro [x0, x1] x [y0, y1] (Sutherland-Hodgman) */
  const ritaglio = (Gn, hn, box) => {
    const [x0, y1, x1, y0] = box;
    let P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    Gn.forEach((g, r) => {
      const f = (p) => hn[r] - g[0] * p[0] - g[1] * p[1];
      const Rr = [];
      for (let i = 0; i < P.length; i++) {
        const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b);
        if (fa >= 0) Rr.push(a);
        if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); Rr.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); }
      }
      P = Rr;
    });
    return P.length ? P.concat([P[0]]) : [];
  };
  /** riquadro quadrato che contiene l'origine e i punti, con margine */
  const riquadro = (punti, margine = 0.18) => {
    const xs = punti.map((p) => p[0]).concat([0]), ys = punti.map((p) => p[1]).concat([0]);
    const a = Math.min(...xs), b = Math.max(...xs), c = Math.min(...ys), d = Math.max(...ys);
    const S = Math.max(b - a, d - c, 1), pad = margine * S, L = S + 2 * pad;
    return [a - pad, c - pad + L, a - pad + L, c - pad];
  };

  // ------------------------------------------------------------ colori e oggetti
  const scuro = () => (document.body && document.body.getAttribute("data-md-color-scheme")) === "slate";
  const COL = (st) => ({
    rosso: st.colore("ammissibile"), blu: st.colore("ottimo"), viola: st.colore("locale"),
    grigio: st.colore("orig"), nero: scuro() ? "#E9ECEF" : "#212529",
  });
  const tinta = (st, nome, html) => `<strong style="color:${COL(st)[nome]}">${html}</strong>`;
  const val = (v) => (typeof v === "function" ? v() : v);
  // colore che dipende dallo stato (come in gi-cap1.js): si rimette a ogni aggiornamento
  function coloreVivo(board, el, colore, campi = ["strokeColor", "fillColor"]) {
    const applica = () => {
      const c = colore();
      if (c === el._giColore) return;
      el._giColore = c;
      const a = {};
      for (const f of campi) { a[f] = c; a["highlight" + f[0].toUpperCase() + f.slice(1)] = c; }
      el.setAttribute(a);
      const rr = board.renderer, vp = el.visProp;
      rr.setObjectStrokeColor(el, c, val(vp.strokeopacity));
      if (campi.includes("fillColor")) rr.setObjectFillColor(el, c, val(vp.fillopacity));
    };
    applica();
    board.on("update", applica);
    return el;
  }
  const opzioniAssi = (st) => {
    const muted = st.colore("muted"), line = st.colore("line");
    const a = { strokeColor: muted, ticks: { strokeColor: line, majorHeight: -1, label: { strokeColor: muted } } };
    return { x: a, y: a };
  };

  /** punto trascinabile chiuso nella regione, che si aggancia ai vertici esatti */
  function puntoRegione(board, st, S, nome, regione) {
    const C = COL(st);
    const P = board.create("point", S[nome].slice(), {
      name: "", size: 6, fillColor: C.viola, strokeColor: C.viola, showInfobox: false, withLabel: false,
    });
    P.on("drag", () => {
      const R = regione();
      let x = P.X(), y = P.Y();
      if (!dentro(R.Gn, R.hn, x, y)) {
        const [x0, y0] = S[nome];
        let lo = 0, hi = 1;
        for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (dentro(R.Gn, R.hn, x0 + m * (x - x0), y0 + m * (y - y0))) lo = m; else hi = m; }
        x = x0 + lo * (x - x0); y = y0 + lo * (y - y0);
      }
      // aggancio a un vertice: lì i valori diventano esatti
      const bb = board.getBoundingBox(), tol = 0.035 * (bb[2] - bb[0]);
      let q = null;
      for (const v of R.V) if (Math.hypot(fl(v[0]) - x, fl(v[1]) - y) < tol) { q = v; break; }
      if (q) { x = fl(q[0]); y = fl(q[1]); }
      S[nome] = [x, y];
      S[nome + "q"] = q;
      P.setPositionDirectly(JXG.COORDS_BY_USER, [x, y]);
    });
    return P;
  }
  /** un punto interno vicino al vertice v (per le posizioni iniziali) */
  const internoVicino = (Gn, hn, v, box) => {
    const L = box[2] - box[0], marg = 0.06 * L;
    let best = null, dmin = Infinity;
    for (let i = 0; i <= 60; i++) for (let j = 0; j <= 60; j++) {
      const x = box[0] + (L * i) / 60, y = box[3] + ((box[1] - box[3]) * j) / 60;
      if (!Gn.every((g, r) => (hn[r] - g[0] * x - g[1] * y) / Math.hypot(g[0], g[1]) >= marg)) continue;
      const d = Math.hypot(x - v[0], y - v[1]);
      if (d < dmin) { dmin = d; best = [x, y]; }
    }
    return best || v.slice();
  };

  // =====================================================================
  // 1. Dualità debole e forte (cap. 9)
  // =====================================================================
  const PROBLEMI_D = ["P2", "P3", "P4", "P5", "P7", "P8", "P11", "P16"];
  const datiDuale = (k) => {
    const P = problema(k);
    const G = righe(P.A), h = termini(P.b);
    // duale: min b'π, A'π >= c, π >= 0, cioè -A'π <= -c, -π <= 0
    const At = [[P.A[0][0], P.A[1][0]], [P.A[0][1], P.A[1][1]]];
    const GD = righe(At.map((r) => r.map(neg))), hD = termini(P.c.map(neg));
    const V = vertici(G, h), VD = vertici(GD, hD);
    const piOtt = VD.reduce((a, v) => (!a || cmp(dot(P.b, v), dot(P.b, a)) < 0 ? v : a), null);
    const w = dot(P.b, piOtt);
    const boxP = riquadro(V.map((v) => v.map(fl))), boxD = riquadro(VD.map((v) => v.map(fl)));
    const peggioreP = V.reduce((a, v) => (!a || cmp(dot(P.c, v), dot(P.c, a)) < 0 ? v : a), null);
    const peggioreD = VD.reduce((a, v) => (!a || cmp(dot(P.b, v), dot(P.b, a)) > 0 ? v : a), null);
    return {
      P, G, h, GD, hD, V, VD, piOtt, w, boxP, boxD,
      Gn: Gf(G), hn: h.map(fl), GDn: Gf(GD), hDn: hD.map(fl),
      x0: internoVicino(Gf(G), h.map(fl), peggioreP.map(fl), boxP),
      p0: internoVicino(Gf(GD), hD.map(fl), peggioreD.map(fl), boxD),
    };
  };
  const cacheD = {};
  const DD = (k) => (cacheD[k] = cacheD[k] || datiDuale(k));
  // stato dei due punti, per problema
  const statoD = (st) => {
    const k = st.chiave(), d = DD(k);
    st.dati[k] = st.dati[k] || { x: d.x0.slice(), xq: null, p: d.p0.slice(), pq: null };
    return st.dati[k];
  };
  // valori dei due obiettivi: esatti (frazioni) se il punto è agganciato a un vertice
  const valori = (st) => {
    const d = DD(st.chiave()), S = statoD(st);
    const zx = S.xq ? dot(d.P.c, S.xq) : null, wp = S.pq ? dot(d.P.b, S.pq) : null;
    const zf = zx ? fl(zx) : fl(d.P.c[0]) * S.x[0] + fl(d.P.c[1]) * S.x[1];
    const wf = wp ? fl(wp) : fl(d.P.b[0]) * S.p[0] + fl(d.P.b[1]) * S.p[1];
    const xOtt = !!(S.xq && ugualiQ(S.xq, d.P.x)), pOtt = !!(S.pq && ugualiQ(S.pq, d.piOtt));
    const pari = zx && wp ? !cmp(zx, wp) : Math.abs(zf - wf) < 1e-9;
    return { d, S, zx, wp, zf, wf, xOtt, pOtt, pari, gap: wf - zf };
  };
  const vTex = (q, f) => (q ? fr(q) : num(f, 2));
  const arrayProblema = (d, duale) => {
    const P = d.P;
    if (!duale) {
      return `\\begin{array}{rl}\\max & ${lin(P.c, X)}\\\\` +
        P.A.map((r, i) => `& ${lin(r, X)} \\le ${fr(P.b[i])}`).join("\\\\") + `\\\\ & x_1,\\ x_2 \\ge 0\\end{array}`;
    }
    const At = [[P.A[0][0], P.A[1][0]], [P.A[0][1], P.A[1][1]]];
    return `\\begin{array}{rl}\\min & ${lin(P.b, PI)}\\\\` +
      At.map((r, j) => `& ${lin(r, PI)} \\ge ${fr(P.c[j])}`).join("\\\\") + `\\\\ & \\pi_1,\\ \\pi_2 \\ge 0\\end{array}`;
  };

  /** le due board affiancate: quella del motore (primale) e una seconda (duale) */
  function preparaCoppia(board, st) {
    const D = st.dati;
    const boardEl = board.containerObj;
    if (!D.coppia || !st.el.contains(D.coppia)) {
      const coppia = document.createElement("div");
      coppia.className = "gi-coppia";
      coppia.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:.7em;align-items:end";
      boardEl.parentNode.insertBefore(coppia, boardEl);
      const colonna = () => {
        const c = document.createElement("div");
        const t = document.createElement("div");
        t.style.cssText = "text-align:center;font-size:.85em;margin-bottom:.3em";
        c.append(t);
        coppia.append(c);
        return [c, t];
      };
      const [c1, t1] = colonna(), [c2, t2] = colonna();
      c1.append(boardEl);
      const el2 = document.createElement("div");
      el2.className = "gi-board jxgbox";
      el2.id = boardEl.id + "-duale";
      el2.setAttribute("aria-label", T("Grafico interattivo: problema duale", "Interactive graph: dual problem"));
      c2.append(el2);
      [boardEl, el2].forEach((e) => (e.style.aspectRatio = "1 / 1"));
      Object.assign(D, { coppia, t1, t2, el2 });
      // le colonne cambiano larghezza (pagina stretta, MathJax che compone i titoli):
      // le due board seguono il loro riquadro e tengono la vista del problema
      if (window.ResizeObserver) {
        let attesa = false;
        const adatta = () => {
          attesa = false;
          if (!st.el.contains(coppia)) return;
          const k = st.chiave();
          [[st.board, boardEl, () => DD(k).boxP], [D.b2, el2, () => DD(k).boxD]].forEach(([bd, e, box]) => {
            if (!bd || !e.clientWidth) return;
            if (Math.abs(bd.canvasWidth - e.clientWidth) < 1 && Math.abs(bd.canvasHeight - e.clientHeight) < 1) return;
            bd.resizeContainer(e.clientWidth, e.clientHeight, true);
            bd.setBoundingBox(box(), true);
            bd.fullUpdate();
          });
        };
        D.osserva = new ResizeObserver(() => { if (!attesa) { attesa = true; requestAnimationFrame(adatta); } });
        D.osserva.observe(boardEl); D.osserva.observe(el2);
      }
    }
    // la board del motore è nata più larga: si adatta alla colonna
    board.resizeContainer(boardEl.clientWidth, boardEl.clientHeight, true);
    const d = DD(st.chiave());
    board.setBoundingBox(d.boxP, true);
    const tit = (nome, tex) => `<div><div style="font-weight:700;color:var(--gi-muted)">${nome}</div>\\(${tex}\\)</div>`;
    D.t1.innerHTML = window.GI.mj(tit(T("Primale \\(LP\\)", "Primal \\(LP\\)"), arrayProblema(d, false)));
    D.t2.innerHTML = window.GI.mj(tit(T("Duale \\(D(LP)\\)", "Dual \\(D(LP)\\)"), arrayProblema(d, true)));
    window.GI.typeset(D.t1); window.GI.typeset(D.t2);
    if (D.b2) { try { JXG.JSXGraph.freeBoard(D.b2); } catch (e) { /* già liberata */ } }
    D.b2 = JXG.JSXGraph.initBoard(D.el2.id, {
      boundingbox: d.boxD, axis: true, keepAspectRatio: true, showCopyright: false, showNavigation: false,
      pan: { enabled: true, needShift: false, needTwoFingers: true }, zoom: { wheel: true, needShift: true },
      defaultAxes: opzioniAssi(st),
    });
    return D.b2;
  }

  /** regione, retta di livello, direzione di miglioramento e punto trascinabile */
  function disegnaLato(bd, st, S, nome, regione, obiettivo, verso, ottimo) {
    const C = COL(st);
    const R = regione();
    bd.create("curve", [[0], [0]], { strokeColor: C.rosso, strokeWidth: 2, fillColor: C.rosso, fillOpacity: 0.16, highlight: false, fixed: true })
      .updateDataArray = function () {
        const b = bd.getBoundingBox(), L = b[2] - b[0];
        const P = ritaglio(R.Gn, R.hn, [b[0] - L, b[1] + L, b[2] + L, b[3] - L]);
        this.dataX = P.map((p) => p[0]); this.dataY = P.map((p) => p[1]);
      };
    // vertici (neri, piccoli)
    R.V.forEach((v) => bd.create("point", [fl(v[0]), fl(v[1])], {
      name: "", size: 2.5, fixed: true, fillColor: C.nero, strokeColor: C.nero, highlight: false, showInfobox: false, withLabel: false,
    }));
    const g = obiettivo.map(fl);
    // retta di livello per il punto: g'y = g'(punto)
    bd.create("line", [() => -(g[0] * S[nome][0] + g[1] * S[nome][1]), g[0], g[1]], {
      strokeColor: C.blu, strokeWidth: 1.6, dash: 2, highlight: false, fixed: true,
    });
    // direzione di miglioramento: c (max) per il primale, -b (min) per il duale
    const L = () => { const bb = bd.getBoundingBox(); return 0.16 * (bb[2] - bb[0]) / Math.hypot(g[0], g[1]); };
    bd.create("arrow", [[() => S[nome][0], () => S[nome][1]], [() => S[nome][0] + verso * g[0] * L(), () => S[nome][1] + verso * g[1] * L()]], {
      strokeColor: C.blu, strokeWidth: 2.2, highlight: false, fixed: true,
    });
    const P = puntoRegione(bd, st, S, nome, regione);
    coloreVivo(bd, P, () => (ottimo() ? C.blu : C.viola));
    return P;
  }

  window.GI_RICETTE["dualita-debole"] = () => ({
    titolo: T("Dualità debole e forte", "Weak and strong duality"),
    sottotitolo: T("\\(\\boldsymbol c'\\bar{\\boldsymbol x} \\le \\boldsymbol b'\\bar{\\boldsymbol \\pi}\\) per ogni coppia ammissibile",
      "\\(\\boldsymbol c'\\bar{\\boldsymbol x} \\le \\boldsymbol b'\\bar{\\boldsymbol \\pi}\\) for every feasible pair"),
    funzioni: Object.fromEntries(PROBLEMI_D.map((k) => [k, { tex: k, etichetta: k }])),
    iniziale: "P2",
    etichettaFunzioni: T("Problema del catalogo (\\(m = 2\\))", "Problem of the catalogue (\\(m = 2\\))"),
    vista: (k) => DD(k).boxP,
    stessaScala: true,
    rapporto: "1 / 1",
    legenda: (st) => [
      ["ammissibile", T("regioni ammissibili di \\(LP\\) e \\(D(LP)\\)", "feasible regions of \\(LP\\) and \\(D(LP)\\)"), "pieno"],
      ["ottimo", T("rette di livello per \\(\\bar{\\boldsymbol x}\\) e \\(\\bar{\\boldsymbol \\pi}\\)", "level lines through \\(\\bar{\\boldsymbol x}\\) and \\(\\bar{\\boldsymbol \\pi}\\)"), "dashed"],
      ["ottimo", T("direzioni di miglioramento \\(\\boldsymbol c\\) e \\(-\\boldsymbol b\\)", "improving directions \\(\\boldsymbol c\\) and \\(-\\boldsymbol b\\)"), ""],
      [COL(st).nero, T("vertici", "vertices"), "punto"],
      ["locale", T("\\(\\bar{\\boldsymbol x}\\), \\(\\bar{\\boldsymbol \\pi}\\) ammissibili", "feasible \\(\\bar{\\boldsymbol x}\\), \\(\\bar{\\boldsymbol \\pi}\\)"), "punto"],
      ["ottimo", T("ottimi", "optimal"), "punto"],
    ],
    monta(board, st) {
      const d = DD(st.chiave()), S = statoD(st);
      const b2 = preparaCoppia(board, st);
      const D = st.dati;
      D.Px = disegnaLato(board, st, S, "x", () => ({ Gn: d.Gn, hn: d.hn, V: d.V }), d.P.c, 1, () => valori(st).xOtt);
      D.Pp = disegnaLato(b2, st, S, "p", () => ({ Gn: d.GDn, hn: d.hDn, V: d.VD }), d.P.b, -1, () => valori(st).pOtt);
      b2.on("update", () => st.testi());
      b2.update();
    },
    aggiorna(board, st) {
      const D = st.dati, S = statoD(st);
      if (S.riposiziona && D.Px) {
        S.riposiziona = false;
        D.Px.setPositionDirectly(JXG.COORDS_BY_USER, S.x);
        D.Pp.setPositionDirectly(JXG.COORDS_BY_USER, S.p);
      }
      if (D.b2) D.b2.update();
    },
    formula(p, st) {
      const v = valori(st), C = COL(st);
      const cx = `\\color{${v.xOtt ? C.blu : C.viola}}{${vTex(v.zx, v.zf)}}`, bp = `\\color{${v.pOtt ? C.blu : C.viola}}{${vTex(v.wp, v.wf)}}`;
      return `\\boldsymbol c'${bx} = ${cx} \\;${v.pari ? "=" : "\\le"}\\; ${bp} = \\boldsymbol b'${bpi}`;
    },
    letture(p, st) {
      const v = valori(st), P = v.d.P, S = v.S;
      const xs = S.xq ? coppiaQ(S.xq) : coppiaF(S.x), ps = S.pq ? coppiaQ(S.pq) : coppiaF(S.p);
      let r = `\\(${bx} = ${xs}\\), \\(LB(${bx}) = \\boldsymbol c'${bx} = ${vTex(v.zx, v.zf)}\\)<br>` +
        `\\(${bpi} = ${ps}\\), \\(UB(${bpi}) = \\boldsymbol b'${bpi} = ${vTex(v.wp, v.wf)}\\)<br>`;
      r += T(`Dualità debole: \\(LB(${bx}) \\le z(LP) \\le UB(${bpi})\\), quindi l'ottimo sta fra \\(${vTex(v.zx, v.zf)}\\) e \\(${vTex(v.wp, v.wf)}\\)`,
        `Weak duality: \\(LB(${bx}) \\le z(LP) \\le UB(${bpi})\\), so the optimum lies between \\(${vTex(v.zx, v.zf)}\\) and \\(${vTex(v.wp, v.wf)}\\)`);
      if (v.pari) {
        r += T(`. ${tinta(st, "blu", "Uguaglianza")}: per la dualità forte \\(${bx}\\) e \\(${bpi}\\) sono entrambi ottimi, con \\(z(LP) = ${fr(P.z)} = z(D(LP))\\).`,
          `. ${tinta(st, "blu", "Equality")}: by strong duality \\(${bx}\\) and \\(${bpi}\\) are both optimal, with \\(z(LP) = ${fr(P.z)} = z(D(LP))\\).`);
      } else {
        r += T(`; il divario è \\(\\boldsymbol b'${bpi} - \\boldsymbol c'${bx} = ${num(v.gap, 2)} > 0\\).`,
          `; the gap is \\(\\boldsymbol b'${bpi} - \\boldsymbol c'${bx} = ${num(v.gap, 2)} > 0\\).`);
        if (v.xOtt) r += T(` \\(${bx}\\) è ${tinta(st, "blu", "ottimo")}: \\(z(LP) = ${fr(P.z)}\\).`, ` \\(${bx}\\) is ${tinta(st, "blu", "optimal")}: \\(z(LP) = ${fr(P.z)}\\).`);
        if (v.pOtt) r += T(` \\(${bpi}\\) è ${tinta(st, "blu", "ottimo")}: \\(z(D(LP)) = ${fr(v.d.w)}\\).`, ` \\(${bpi}\\) is ${tinta(st, "blu", "optimal")}: \\(z(D(LP)) = ${fr(v.d.w)}\\).`);
      }
      return r;
    },
    domanda: T("Trascina \\(\\bar{\\boldsymbol x}\\) nella regione del primale e \\(\\bar{\\boldsymbol \\pi}\\) in quella del duale (vicino a un vertice il punto si aggancia). Riesci a ottenere \\(\\boldsymbol c'\\bar{\\boldsymbol x} > \\boldsymbol b'\\bar{\\boldsymbol \\pi}\\)? Dove devono stare i due punti perché valga l'uguaglianza, e che cosa dice allora la dualità forte?",
      "Drag \\(\\bar{\\boldsymbol x}\\) in the primal region and \\(\\bar{\\boldsymbol \\pi}\\) in the dual one (near a vertex the point snaps to it). Can you get \\(\\boldsymbol c'\\bar{\\boldsymbol x} > \\boldsymbol b'\\bar{\\boldsymbol \\pi}\\)? Where must the two points be for equality to hold, and what does strong duality say then?"),
    sfida: {
      testo: T("Porta \\(\\bar{\\boldsymbol x}\\) e \\(\\bar{\\boldsymbol \\pi}\\) in modo che \\(\\boldsymbol c'\\bar{\\boldsymbol x} = \\boldsymbol b'\\bar{\\boldsymbol \\pi}\\): il metro misura quanto si è chiuso il divario.",
        "Move \\(\\bar{\\boldsymbol x}\\) and \\(\\bar{\\boldsymbol \\pi}\\) so that \\(\\boldsymbol c'\\bar{\\boldsymbol x} = \\boldsymbol b'\\bar{\\boldsymbol \\pi}\\): the meter shows how much of the gap is closed."),
      genera(k, st) {
        const d = DD(k), S = statoD(st);
        Object.assign(S, { x: d.x0.slice(), xq: null, p: d.p0.slice(), pq: null, riposiziona: true });
        const g0 = (fl(d.P.b[0]) * d.p0[0] + fl(d.P.b[1]) * d.p0[1]) - (fl(d.P.c[0]) * d.x0[0] + fl(d.P.c[1]) * d.x0[1]);
        return { gap0: Math.max(g0, 1e-6), k };
      },
      vicinanza: (p, b, st) => Math.max(0, 1 - valori(st).gap / b.gap0),
      vinta: (p, b, st) => valori(st).pari,
      aiuto(p, b, st) {
        const v = valori(st);
        if (!v.xOtt) return T("\\(\\bar{\\boldsymbol x}\\) non è ancora ottimo: spostalo nella direzione di \\(\\boldsymbol c\\) (la freccia) finché la retta di livello tocca la regione in un solo vertice.",
          "\\(\\bar{\\boldsymbol x}\\) is not optimal yet: move it along \\(\\boldsymbol c\\) (the arrow) until the level line touches the region at a single vertex.");
        if (!v.pOtt) return T("\\(\\bar{\\boldsymbol x}\\) è ottimo; ora \\(\\bar{\\boldsymbol \\pi}\\): il duale è un problema di minimo, spostalo nella direzione di \\(-\\boldsymbol b\\) fino all'ultimo vertice.",
          "\\(\\bar{\\boldsymbol x}\\) is optimal; now \\(\\bar{\\boldsymbol \\pi}\\): the dual is a minimisation problem, move it along \\(-\\boldsymbol b\\) to the last vertex.");
        return "";
      },
    },
  });

  // =====================================================================
  // 2. Analisi di sensitività (cap. 14)
  // =====================================================================
  const PROBLEMI_S = ["P10", "P2", "P3", "P4", "P5", "P7", "P8"];
  const datiSens = (k) => {
    const P = problema(k), G = righe(P.A), h = termini(P.b), xt = P.x;
    const att = attivi(G, h, xt); // non degeneri: due righe attive
    const [ra, rb] = att;
    // c = λa ga + λb gb (moltiplicatori: prezzi ombra dei vincoli, costi ridotti cambiati di segno per gli assi)
    const lam = risolvi([G[ra][0], G[rb][0]], [G[ra][1], G[rb][1]], P.c[0], P.c[1]);
    const mu = risolvi([G[ra][0], G[rb][0]], [G[ra][1], G[rb][1]], UNO, ZERO);
    // c1 + δ: λ + δ μ >= 0
    let cLo = null, cHi = null;
    [0, 1].forEach((i) => {
      if (!mu[i].n) return;
      const t = div(neg(lam[i]), mu[i]);
      if (sgn(mu[i]) > 0) { if (!cLo || cmp(t, cLo) > 0) cLo = t; } else if (!cHi || cmp(t, cHi) < 0) cHi = t;
    });
    // b1 + δ: x(δ) = x̃ + δ d, con d dal sistema delle righe attive
    const e = (r) => (r === 0 ? UNO : ZERO);
    const dir = risolvi(G[ra], G[rb], e(ra), e(rb));
    let bLo = null, bHi = null;
    G.forEach((g, r) => {
      if (r === ra || r === rb) return;
      const kq = sub(dot(g, dir), e(r)), s = sub(h[r], dot(g, xt));
      if (!kq.n) return;
      const t = div(s, kq);
      if (sgn(kq) > 0) { if (!bHi || cmp(t, bHi) < 0) bHi = t; } else if (!bLo || cmp(t, bLo) > 0) bLo = t;
    });
    const pi1 = ra === 0 ? lam[0] : rb === 0 ? lam[1] : ZERO;
    // base: x_j non di base se x_j = 0 è attivo (riga m + j), x_{n+i} se il vincolo i è attivo
    const nonBase = att.map((r) => (r < P.m ? 2 + r + 1 : r - P.m + 1)).sort((a, b) => a - b);
    const base = [];
    for (let j = 1; j <= 2 + P.m; j++) if (!nonBase.includes(j)) base.push(j);
    // ampiezza del cursore e vista
    // il cursore va un po' oltre gli estremi finiti dell'intervallo (per vedere la base
    // cambiare), entro un tetto proporzionato ai dati del problema
    const corsa = (lo, hi, tetto) => {
      const R0 = Math.ceil(tetto / 2);
      const mn = lo ? Math.floor(1.25 * fl(lo) - 1) : -R0, mx = hi ? Math.ceil(1.25 * fl(hi) + 1) : R0;
      return [Math.max(-tetto, Math.min(-1, mn)), Math.min(tetto, Math.max(1, mx))];
    };
    const corsaC = corsa(cLo, cHi, Math.max(4, Math.ceil(2 * Math.max(...P.c.map((q) => Math.abs(fl(q)))))));
    const tettoB = Math.max(4, Math.ceil(Math.abs(fl(P.b[0]))));
    const corsaB = corsa(bLo, bHi, tettoB);
    const V = vertici(G, h);
    const box0 = riquadro(V.map((v) => v.map(fl)));
    const L0 = box0[2] - box0[0];
    // con b1 + δ la regione cresce: si accorcia la corsa finché tutti i vertici
    // (e quindi il vertice ottimo) restano in una vista al più 1,5 volte quella iniziale
    const boxCon = (dd) => { const hh = h.slice(); hh[0] = add(h[0], daCursore(dd)); return riquadro(vertici(G, hh).map((v) => v.map(fl)).concat(V.map((v) => v.map(fl))), 0.18); };
    while (corsaB[1] > 1 && boxCon(corsaB[1])[2] - boxCon(corsaB[1])[0] > 1.5 * L0) corsaB[1] = Math.max(1, Math.floor(corsaB[1] * 0.8));
    const passoB = Math.max(-corsaB[0], corsaB[1]) > 16 ? 1 : 0.25;
    const boxPiu = boxCon(corsaB[1]);
    const box = boxPiu[2] - boxPiu[0] > L0 ? boxPiu : box0;
    return { P, G, h, xt, att, lam, cLo, cHi, dir, bLo, bHi, pi1, base, nonBase, corsaC, corsaB, passoB, box };
  };
  const cacheS = {};
  const DS = (k) => (cacheS[k] = cacheS[k] || datiSens(k));
  const modoS = (st) => st.dati.modoS || "c";
  // dati correnti (c1 + δ oppure b1 + δ) e ottimo esatto per enumerazione dei vertici
  const correnti = (st) => {
    const k = st.chiave(), s = DS(k), P = s.P;
    const dq = daCursore(st.p().d);
    const mc = modoS(st) === "c";
    const c = mc ? [add(P.c[0], dq), P.c[1]] : P.c;
    const h = s.h.slice();
    if (!mc) h[0] = add(h[0], dq);
    const V = vertici(s.G, h);
    let z = null, ott = [];
    for (const v of V) {
      const zv = dot(c, v);
      if (!z || cmp(zv, z) > 0) { z = zv; ott = [v]; } else if (!cmp(zv, z)) ott.push(v);
    }
    const lo = mc ? s.cLo : s.bLo, hi = mc ? s.cHi : s.bHi;
    const dentroI = (!lo || cmp(dq, lo) >= 0) && (!hi || cmp(dq, hi) <= 0);
    const bordo = (lo && !cmp(dq, lo)) || (hi && !cmp(dq, hi));
    // soluzione di base di B con i dati correnti
    const xB = mc ? s.xt : [add(s.xt[0], mul(dq, s.dir[0])), add(s.xt[1], mul(dq, s.dir[1]))];
    return { s, P, dq, mc, c, h, V, z, ott, lo, hi, dentroI, bordo, xB, Gn: Gf(s.G), hn: h.map(fl) };
  };

  // i pulsanti «c1 / b1» accanto a quelli dei problemi, e il cursore adattato al problema
  function preparaModo(st) {
    const D = st.dati;
    if (!D.chipsModo || !st.el.contains(D.chipsModo)) {
      const dopo = st.el.querySelector(".gi-chips");
      const tit = window.GI.h("div", {}, `<strong>${T("Dato che cambia", "Data that changes")}</strong>`);
      const box = window.GI.h("div", { class: "gi-chips" });
      [["c", "c_1 + \\delta"], ["b", "b_1 + \\delta"]].forEach(([m, tex]) => {
        const b = window.GI.h("button", { class: "gi-chip", "aria-pressed": String(modoS(st) === m) }, `\\(${tex}\\)`);
        b.onclick = () => {
          if (modoS(st) === m) return;
          D.modoS = m;
          box.querySelectorAll(".gi-chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
          // «Azzera» del motore: δ = 0 e grafico (con la legenda) ridisegnato per il nuovo dato
          const azzera = st.el.querySelector(".gi-btn");
          if (azzera) azzera.click(); else { adattaCursore(st); st.imposta("d", 0); }
        };
        box.append(b);
      });
      dopo.after(tit, box);
      window.GI.typeset(tit); window.GI.typeset(box);
      D.chipsModo = box;
    }
    adattaCursore(st);
  }
  function adattaCursore(st) {
    const s = DS(st.chiave()), inp = st.el.querySelector('input[type="range"]');
    if (!inp) return;
    const [mn, mx] = modoS(st) === "c" ? s.corsaC : s.corsaB, passo = modoS(st) === "c" ? 0.25 : s.passoB;
    const v = parseFloat(inp.value);
    Object.assign(inp, { min: mn, max: mx, step: passo });
    inp.value = Math.max(mn, Math.min(mx, Math.round(v / passo) * passo));
  }

  window.GI_RICETTE["sensitivita"] = () => ({
    titolo: T("Analisi di sensitività", "Sensitivity analysis"),
    sottotitolo: T("fin dove la base ottima resta ottima?", "how far does the optimal basis stay optimal?"),
    funzioni: Object.fromEntries(PROBLEMI_S.map((k) => [k, { tex: k, etichetta: k }])),
    iniziale: "P10",
    etichettaFunzioni: T("Problema del catalogo", "Problem of the catalogue"),
    parametri: [
      { k: "d", nome: "\\delta", min: -6, max: 6, step: 0.25, val: 0,
        descr: T("si somma al dato scelto sopra: \\(c_1\\) (vettore dei costi) o \\(b_1\\) (termine noto); premi ▶ per farlo scorrere",
          "is added to the data chosen above: \\(c_1\\) (objective-function vector) or \\(b_1\\) (right-hand side); press ▶ to sweep it") },
    ],
    vista: (k) => DS(k).box,
    stessaScala: true,
    legenda: (st) => [
      ["ammissibile", T("regione ammissibile \\(F\\)", "feasible region \\(F\\)"), "pieno"],
      ["orig", modoS(st) === "c" ? T("rette dei vincoli attivi nella base ottima", "lines of the constraints active in the optimal basis")
        : T("\\(F\\) con il \\(b_1\\) originale", "\\(F\\) with the original \\(b_1\\)"), "dashed"],
      ["ottimo", T("retta di livello ottima \\(\\boldsymbol c'\\boldsymbol x = z^*\\)", "optimal level line \\(\\boldsymbol c'\\boldsymbol x = z^*\\)"), "dashed"],
      ["ottimo", T("\\(\\boldsymbol c\\)", "\\(\\boldsymbol c\\)"), ""],
      ["ottimo", T("vertice ottimo", "optimal vertex"), "punto"],
      ["locale", T("soluzione di base non più ottima", "basic solution no longer optimal"), "punto"],
    ],
    monta(board, st) {
      preparaModo(st);
      const C = COL(st), cur = () => st.dati.cur || (st.dati.cur = correnti(st));
      const s = DS(st.chiave());
      const bb = () => { const b = board.getBoundingBox(); const L = b[2] - b[0]; return [b[0] - L, b[1] + L, b[2] + L, b[3] - L]; };
      // F originale (grigia tratteggiata), solo quando si muove b1
      GI_spezzata(board, () => (modoS(st) === "b" && cur().dq.n ? ritaglio(Gf(s.G), s.h.map(fl), bb()) : []), { strokeColor: C.grigio, strokeWidth: 1.6, dash: 2 });
      // rette dei due vincoli attivi nella base ottima (con i dati correnti), solo con c1
      s.att.forEach((r) => {
        const g = s.G[r].map(fl);
        board.create("line", [() => -fl(cur().h[r]), g[0], g[1]], {
          strokeColor: C.grigio, strokeWidth: 1.3, dash: 2, highlight: false, fixed: true, visible: () => modoS(st) === "c",
        });
      });
      // regione corrente
      GI_spezzata(board, () => ritaglio(cur().Gn, cur().hn, bb()), { strokeColor: C.rosso, strokeWidth: 2, fillColor: C.rosso, fillOpacity: 0.16 });
      // spigolo ottimo (ottimi multipli agli estremi dell'intervallo)
      GI_spezzata(board, () => (cur().ott.length > 1 ? cur().ott.map((v) => v.map(fl)) : []), { strokeColor: C.blu, strokeWidth: 5, strokeOpacity: 0.8 });
      // retta di livello ottima e vettore c dal vertice ottimo
      board.create("line", [() => (cur().z ? -fl(cur().z) : NaN), () => fl(cur().c[0]), () => fl(cur().c[1])], {
        strokeColor: C.blu, strokeWidth: 1.8, dash: 2, highlight: false, fixed: true, visible: () => !!cur().z,
      });
      const o = () => (cur().ott[0] ? cur().ott[0].map(fl) : [NaN, NaN]);
      const Lc = () => { const b = board.getBoundingBox(); const c = cur().c.map(fl); return 0.16 * (b[2] - b[0]) / (Math.hypot(c[0], c[1]) || 1); };
      board.create("arrow", [[() => o()[0], () => o()[1]], [() => o()[0] + fl(cur().c[0]) * Lc(), () => o()[1] + fl(cur().c[1]) * Lc()]], {
        strokeColor: C.blu, strokeWidth: 2.4, highlight: false, fixed: true, visible: () => !!cur().z,
      });
      // la soluzione di base di B quando non è più ottima (viola)
      board.create("point", [() => fl(cur().xB[0]), () => fl(cur().xB[1])], {
        name: "", size: 5, fixed: true, highlight: false, showInfobox: false, withLabel: false, fillColor: C.viola, strokeColor: C.viola,
        visible: () => !cur().dentroI,
      });
      // vertici ottimi correnti (blu)
      [0, 1].forEach((i) => board.create("point", [() => (cur().ott[i] ? fl(cur().ott[i][0]) : NaN), () => (cur().ott[i] ? fl(cur().ott[i][1]) : NaN)], {
        name: "", size: 5.5, fixed: true, highlight: false, showInfobox: false, withLabel: false, fillColor: C.blu, strokeColor: C.blu,
        visible: () => !!cur().ott[i],
      }));
    },
    aggiorna(board, st) { st.dati.cur = correnti(st); },
    formula(p, st) {
      const k = correnti(st), P = k.P;
      const d = st.col("d", num(p.d, 2));
      if (k.mc) {
        const c1 = st.col("d", `${num(fl(k.c[0]), 2)}`);
        return `c_1 = ${fr(P.c[0])} + (${d}) = ${c1}:\\quad \\max\\ ${c1}\\,x_1 ${sgn(P.c[1]) < 0 ? "-" : "+"} ${lin([Q(Math.abs(P.c[1].n), P.c[1].d)], ["x_2"])}`;
      }
      const b1 = st.col("d", `${num(fl(k.h[0]), 2)}`);
      return `b_1 = ${fr(P.b[0])} + (${d}) = ${b1}:\\quad ${lin(P.A[0], X)} \\le ${b1}`;
    },
    letture(p, st) {
      const k = correnti(st), s = k.s, P = k.P;
      const B = `\\pazocal{B} = \\{${s.base.join(",\\ ")}\\}`;
      const ivTex = `${estremo(k.lo, -1)} \\le \\delta \\le ${estremo(k.hi, 1)}`;
      let r = T(`Base ottima del problema dato: \\(${B}\\), con \\(\\tilde{\\boldsymbol x} = ${coppiaQ(s.xt)}\\) e \\(z(LP) = ${fr(P.z)}\\).<br>`,
        `Optimal basis of the given problem: \\(${B}\\), with \\(\\tilde{\\boldsymbol x} = ${coppiaQ(s.xt)}\\) and \\(z(LP) = ${fr(P.z)}\\).<br>`);
      if (k.mc) {
        const c1lo = k.lo ? fr(add(P.c[0], k.lo)) : "-\\infty", c1hi = k.hi ? fr(add(P.c[0], k.hi)) : "+\\infty";
        r += T(`Intervallo di ottimalità (ammissibilità duale, \\(\\bar{\\boldsymbol c} \\le \\boldsymbol 0\\)): \\(${ivTex}\\), cioè \\(${c1lo} \\le c_1 \\le ${c1hi}\\).<br>`,
          `Optimality interval (dual feasibility, \\(\\bar{\\boldsymbol c} \\le \\boldsymbol 0\\)): \\(${ivTex}\\), i.e. \\(${c1lo} \\le c_1 \\le ${c1hi}\\).<br>`);
        if (k.dentroI) {
          r += T(`\\(\\delta = ${num(p.d, 2)}\\) è nell'intervallo: ${tinta(st, "blu", "la base resta ottima")} e la soluzione ottima non cambia; \\(z^* = z(LP) + \\delta\\,\\tilde x_1 = ${fr(P.z)} + (${num(p.d, 2)}) \\cdot ${fr(s.xt[0])} = ${fr(k.z)}\\).`,
            `\\(\\delta = ${num(p.d, 2)}\\) is in the interval: ${tinta(st, "blu", "the basis stays optimal")} and the optimal solution does not change; \\(z^* = z(LP) + \\delta\\,\\tilde x_1 = ${fr(P.z)} + (${num(p.d, 2)}) \\cdot ${fr(s.xt[0])} = ${fr(k.z)}\\).`);
          if (k.bordo) r += T(" Siamo a un estremo: le rette di livello sono parallele a uno dei due spigoli per \\(\\tilde{\\boldsymbol x}\\), e tutto lo spigolo è ottimo.",
            " We are at an endpoint: the level lines are parallel to one of the two edges through \\(\\tilde{\\boldsymbol x}\\), and the whole edge is optimal.");
        } else {
          r += T(`\\(\\delta = ${num(p.d, 2)}\\) è fuori dall'intervallo: un costo ridotto è positivo, ${tinta(st, "viola", "la base non è più ottima")}. Nuovo vertice ottimo \\(${coppiaQ(k.ott[0])}\\), con \\(z^* = ${fr(k.z)}\\).`,
            `\\(\\delta = ${num(p.d, 2)}\\) is outside the interval: a reduced cost is positive, ${tinta(st, "viola", "the basis is no longer optimal")}. New optimal vertex \\(${coppiaQ(k.ott[0])}\\), with \\(z^* = ${fr(k.z)}\\).`);
        }
        return r;
      }
      r += T(`Prezzo ombra del vincolo 1: \\(\\pi_1 = ${fr(s.pi1)}\\). Intervallo (ammissibilità primale, \\(\\bar{\\boldsymbol b} \\ge \\boldsymbol 0\\)): \\(${ivTex}\\).<br>`,
        `Shadow price of constraint 1: \\(\\pi_1 = ${fr(s.pi1)}\\). Interval (primal feasibility, \\(\\bar{\\boldsymbol b} \\ge \\boldsymbol 0\\)): \\(${ivTex}\\).<br>`);
      if (!k.V.length) {
        return r + T(`Con \\(b_1 = ${num(fl(k.h[0]), 2)}\\) ${tinta(st, "viola", "la regione ammissibile è vuota")}: il problema è inammissibile.`,
          `With \\(b_1 = ${num(fl(k.h[0]), 2)}\\) ${tinta(st, "viola", "the feasible region is empty")}: the problem is infeasible.`);
      }
      if (k.dentroI) {
        r += T(`${tinta(st, "blu", "La base resta ottima")}: il vertice ottimo si sposta in \\(${coppiaQ(k.xB)}\\) e \\(z^* = z(LP) + \\delta\\,\\pi_1 = ${fr(P.z)} + (${num(p.d, 2)}) \\cdot ${fr(s.pi1)} = ${fr(k.z)}\\), lineare in \\(\\delta\\).`,
          `${tinta(st, "blu", "The basis stays optimal")}: the optimal vertex moves to \\(${coppiaQ(k.xB)}\\) and \\(z^* = z(LP) + \\delta\\,\\pi_1 = ${fr(P.z)} + (${num(p.d, 2)}) \\cdot ${fr(s.pi1)} = ${fr(k.z)}\\), linear in \\(\\delta\\).`);
        if (!s.pi1.n) r += T(" Il vincolo 1 non è attivo in \\(\\tilde{\\boldsymbol x}\\): il suo prezzo ombra è nullo e né il vertice né \\(z^*\\) cambiano.",
          " Constraint 1 is not active at \\(\\tilde{\\boldsymbol x}\\): its shadow price is zero and neither the vertex nor \\(z^*\\) change.");
      } else {
        r += T(`Fuori dall'intervallo la soluzione di base \\(${coppiaQ(k.xB)}\\) ${tinta(st, "viola", "non è più ammissibile")}: cambia base, il nuovo vertice ottimo è \\(${coppiaQ(k.ott[0])}\\) con \\(z^* = ${fr(k.z)}\\) (la formula lineare darebbe \\(${fr(add(P.z, mul(k.dq, s.pi1)))}\\)).`,
          `Outside the interval the basic solution \\(${coppiaQ(k.xB)}\\) ${tinta(st, "viola", "is no longer feasible")}: the basis changes, the new optimal vertex is \\(${coppiaQ(k.ott[0])}\\) with \\(z^* = ${fr(k.z)}\\) (the linear formula would give \\(${fr(add(P.z, mul(k.dq, s.pi1)))}\\)).`);
      }
      return r;
    },
    domanda: T("Con \\(c_1 + \\delta\\) premi ▶: la retta di livello ruota attorno al vertice ottimo finché \\(\\delta\\) resta nell'intervallo; a un estremo diventa parallela a uno spigolo. Poi passa a \\(b_1 + \\delta\\): il vertice scorre lungo una retta e \\(z^*\\) cresce di \\(\\pi_1\\) per ogni unità di \\(b_1\\). Che succede in P10, dove il vincolo 1 non è attivo?",
      "With \\(c_1 + \\delta\\) press ▶: the level line rotates around the optimal vertex as long as \\(\\delta\\) stays in the interval; at an endpoint it becomes parallel to an edge. Then switch to \\(b_1 + \\delta\\): the vertex slides along a line and \\(z^*\\) grows by \\(\\pi_1\\) per unit of \\(b_1\\). What happens in P10, where constraint 1 is not active?"),
  });

  // spezzata del motore, chiamata solo al montaggio (window.GI esiste di sicuro)
  const GI_spezzata = (board, punti, attr) => window.GI.spezzata(board, punti, Object.assign({ fixed: true }, attr));
})();
