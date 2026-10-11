/* Grafici interattivi dei capitoli 6-8 di «Programmazione lineare» (JSXGraph).
 *
 * Ricette per il motore interattivi.js (formato documentato nel commento in
 * testa al motore); ognuna si registra in window.GI_RICETTE:
 *   simplesso-passi  l'algoritmo del simplesso passo per passo: dizionario,
 *                    colonna pivot (regola di Bland), riga pivot (rapporto
 *                    minimo) e cammino lungo gli spigoli della regione (cap. 6)
 *
 * I problemi vengono dal catalogo P0-P86 (catalogo_pl.js, const CATALOGO, numeri
 * in frazioni esatte "num/den"): problemi di tipo A con n = 2, cioè
 * max c'x, Ax <= b, x >= 0 con b >= 0, per cui la base delle variabili di
 * scarto x_{n+1}, …, x_{n+m} dà subito il dizionario iniziale. Tutti i pivot
 * sono calcolati in aritmetica esatta (classe Frazione); il vertice ottimo e
 * z* trovati si confrontano con quelli del catalogo.
 *
 * Notazione dei dizionari come nelle dispense (06_SIMPLEX_ALGORITHM):
 *   x_i = b̄_i − Σ_{j∈N} ā_ij x_j  (i ∈ B),    z = z̄ + Σ_{j∈N} c̄_j x_j.
 * Colori come nelle dispense: regione ammissibile rossa, vertici visitati e
 * cammino del simplesso viola, vertice ottimo blu; la colonna pivot ha il colore
 * del cursore (arancio), la riga pivot il secondo colore (verde acqua). Nessuna
 * etichetta di testo sul grafico: valori e spiegazioni stanno nelle letture e
 * nella legenda.
 */
(function () {
  "use strict";
  const GI = window.GI;
  const T = GI.T;
  const CAT = () => window.CATALOGO || (typeof CATALOGO !== "undefined" ? CATALOGO : {}); // eslint-disable-line no-undef

  // ------------------------------------------------------------ frazioni esatte
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  class Frazione {
    constructor(n, d = 1) {
      if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error("Frazione non valida: " + n + "/" + d);
      if (d < 0) { n = -n; d = -d; }
      const g = mcd(n, d);
      this.n = n / g + 0; // + 0: niente -0
      this.d = d / g;
    }
    static da(s) { const [a, b] = String(s).split("/"); return new Frazione(parseInt(a, 10), b ? parseInt(b, 10) : 1); }
    piu(q) { return new Frazione(this.n * q.d + q.n * this.d, this.d * q.d); }
    meno(q) { return new Frazione(this.n * q.d - q.n * this.d, this.d * q.d); }
    per(q) { return new Frazione(this.n * q.n, this.d * q.d); }
    diviso(q) { return new Frazione(this.n * q.d, this.d * q.n); }
    opposto() { return new Frazione(-this.n, this.d); }
    abs() { return new Frazione(Math.abs(this.n), this.d); }
    segno() { return Math.sign(this.n); }
    confronta(q) { return this.meno(q).segno(); }
    uguale(q) { return this.n === q.n && this.d === q.d; }
    valore() { return this.n / this.d; }
    /** TeX: interi come tali, frazioni con \tfrac (segno davanti) */
    tex() { return this.d === 1 ? String(this.n) : `${this.n < 0 ? "-" : ""}\\tfrac{${Math.abs(this.n)}}{${this.d}}`; }
  }
  const ZERO = new Frazione(0), UNO = new Frazione(1);

  // ------------------------------------------------------------ colori
  const scuro = () => (document.body && document.body.getAttribute("data-md-color-scheme")) === "slate";
  const COL = (st) => {
    const pr = (k, chiaro, buio) => {
      const v = st.colore(k);
      return /^(#|rgb|hsl)/.test(v) ? v : scuro() ? buio : chiaro;
    };
    return {
      rosso: pr("ammissibile", "#E03131", "#FF6B6B"), blu: pr("ottimo", "#1971C2", "#4DABF7"),
      viola: pr("locale", "#9C36B5", "#DA77F2"), grigio: pr("orig", "#9aa5b1", "#6b7b8f"),
      a: pr("a", "#D9480F", "#FF8A4C"), b: pr("b", "#0E7490", "#3BC9DB"),
    };
  };
  const tinta = (c, html) => `<strong style="color:${c}">${html}</strong>`;
  const colTex = (c, tex) => `{\\color{${c}}{${tex}}}`;
  const SEP = () => (GI.EN ? ",\\ " : ";\\ ");
  const coppiaQ = (p) => `\\big(${p[0].tex()}${SEP()}${p[1].tex()}\\big)`;
  const insieme = (I) => `\\{${I.map((j) => j + 1).join(",")}\\}`;
  const xv = (j) => `x_{${j + 1}}`;

  // ------------------------------------------------------------ geometria (come in gi-cap1-5.js)
  const vincoliDi = (P) => {
    const V = [];
    P.A.forEach((riga, i) => V.push({ a: riga.map((s) => Frazione.da(s).valore()), b: Frazione.da(P.b[i]).valore() }));
    V.push({ a: [-1, 0], b: 0, segno: true }, { a: [0, -1], b: 0, segno: true });
    return V;
  };
  const taglia = (P, a, b) => {
    const out = [], f = (p) => a[0] * p[0] + a[1] * p[1] - b, tol = 1e-9 * (1 + Math.abs(b));
    for (let k = 0; k < P.length; k++) {
      const p = P[k], q = P[(k + 1) % P.length], fp = f(p), fq = f(q);
      if (fp <= tol) out.push(p);
      if ((fp < -tol && fq > tol) || (fp > tol && fq < -tol)) {
        const t = fp / (fp - fq);
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    return out;
  };
  const poligono = (V, L) => {
    let P = [[-L, -L], [L, -L], [L, L], [-L, L]];
    for (const v of V) { if (!P.length) break; P = taglia(P, v.a, v.b); }
    return P;
  };
  const retta = (board, v, attr) =>
    board.create("line", [-v.b, v.a[0], v.a[1]],
      Object.assign({ fixed: true, highlight: false, withLabel: false, straightFirst: true, straightLast: true }, attr));
  const vistaDi = (P) => {
    const vs = (P && P.vertici ? P.vertici : []).map((v) => v.map((s) => Frazione.da(s).valore()));
    let X = 0, Y = 0;
    for (const [x, y] of vs) { X = Math.max(X, x); Y = Math.max(Y, y); }
    X = Math.max(5, X * 1.3 + 0.6); Y = Math.max(4.2, Y * 1.3 + 0.6);
    return [-1.2, Y, X, -1.2];
  };

  // ------------------------------------------------------------ il simplesso (Bland)
  // Forma standard: A x + I x_S = b, variabili x_1..x_{n+m} (indici 0..n+m-1).
  // Il tableau tiene, per ogni riga i (variabile in base B[i]), i coefficienti ā_ij
  // di tutte le variabili (identità sulle colonne in base) e b̄_i; cbar[j] i costi
  // ridotti (0 sulle colonne in base), zbar il valore della funzione obiettivo.
  const cacheSimplesso = {};
  const simplesso = (k) => {
    if (cacheSimplesso[k]) return cacheSimplesso[k];
    const P = CAT()[k], n = P.n, m = P.m, N = n + m;
    let A = P.A.map((r, i) => [...r.map(Frazione.da), ...Array.from({ length: m }, (_, j) => (i === j ? UNO : ZERO))]);
    let b = P.b.map(Frazione.da);
    let c = [...P.c.map(Frazione.da), ...Array(m).fill(ZERO)];
    let z = ZERO, B = Array.from({ length: m }, (_, i) => n + i);
    const passi = [];
    for (let it = 0; it < 50; it++) {
      const Nn = [...Array(N).keys()].filter((j) => !B.includes(j));
      const x = Array(N).fill(ZERO);
      B.forEach((j, i) => { x[j] = b[i]; });
      const passo = { B: B.slice(), N: Nn, A: A.map((r) => r.slice()), b: b.slice(), c: c.slice(), z, x, vertice: [x[0], x[1]] };
      passo.positivi = Nn.filter((j) => c[j].segno() > 0);
      passi.push(passo);
      if (!passo.positivi.length) { passo.esito = "ottimo"; break; }
      const p = Math.min(...passo.positivi); // regola di Bland: indice minimo
      passo.p = p;
      passo.rapporti = [];
      B.forEach((j, i) => { if (A[i][p].segno() > 0) passo.rapporti.push({ i, j, t: b[i].diviso(A[i][p]) }); });
      if (!passo.rapporti.length) { passo.esito = "illimitato"; break; }
      // rapporto minimo; a parità, la variabile in base di indice minimo (Bland)
      let best = passo.rapporti[0];
      for (const q of passo.rapporti) { const s = q.t.confronta(best.t); if (s < 0 || (s === 0 && q.j < best.j)) best = q; }
      passo.r = best.i; passo.tm = best.t;
      // pivot
      const r = best.i, piv = A[r][p];
      A[r] = A[r].map((v) => v.diviso(piv)); b[r] = b[r].diviso(piv);
      for (let i = 0; i < m; i++) {
        if (i === r || A[i][p].segno() === 0) continue;
        const f = A[i][p];
        A[i] = A[i].map((v, j) => v.meno(f.per(A[r][j]))); b[i] = b[i].meno(f.per(b[r]));
      }
      const f = c[p];
      c = c.map((v, j) => v.meno(f.per(A[r][j]))); z = z.piu(f.per(b[r]));
      B[r] = p;
    }
    const fine = passi[passi.length - 1];
    // verifica con il catalogo: vertice ottimo, z* e vertici del cammino
    const xs = P.x.map(Frazione.da), zs = Frazione.da(P.z);
    const vCat = (P.vertici || []).map((v) => v.map(Frazione.da));
    const verificato = P.esito === "opt" && fine.esito === "ottimo" && fine.z.uguale(zs) &&
      fine.vertice[0].uguale(xs[0]) && fine.vertice[1].uguale(xs[1]) &&
      passi.every((s) => vCat.some((w) => w[0].uguale(s.vertice[0]) && w[1].uguale(s.vertice[1])));
    if (!verificato) console.warn("PL: il simplesso su " + k + " non coincide con il catalogo");
    const S = { P, n, m, passi, K: passi.length - 1, verificato, xs, zs, V: vincoliDi(P) };
    S.poli = poligono(S.V, 80);
    return (cacheSimplesso[k] = S);
  };

  // ------------------------------------------------------------ testi
  // termine «± coef x_j» di una colonna del dizionario (vuoto se il coefficiente è 0)
  const termine = (q, j) => {
    if (q.segno() === 0) return "";
    const a = q.abs(), coef = a.n === 1 && a.d === 1 ? "" : a.tex() + "\\,";
    return `{}${q.segno() < 0 ? "-" : "+"} ${coef}${xv(j)}`;
  };
  // il dizionario del passo s come array: righe delle variabili in base (ordinate
  // per indice), poi z; colonna pivot e riga pivot colorate, elemento pivot riquadrato
  const dizionario = (s, C) => {
    const ordine = s.B.map((j, i) => ({ j, i })).sort((u, w) => u.j - w.j);
    const colonne = s.N.slice().sort((u, w) => u - w);
    const righe = ordine.map(({ j, i }) => {
      const rp = i === s.r;
      const cell = (tex) => (rp ? colTex(C.b, tex) : tex);
      const celle = [cell(xv(j)), "=", cell(s.b[i].tex())];
      for (const q of colonne) {
        let t = termine(s.A[i][q].opposto(), q);
        if (q === s.p && t) t = rp ? `\\boxed{${colTex(C.a, t)}}` : colTex(C.a, t);
        else if (t) t = cell(t);
        celle.push(t);
      }
      return celle.join(" & ");
    });
    const zc = ["z", "=", s.z.tex(), ...colonne.map((q) => {
      const t = termine(s.c[q], q);
      return q === s.p && t ? colTex(C.a, t) : t;
    })];
    return `\\begin{array}{rcr${"l".repeat(colonne.length)}}${righe.join(" \\\\ ")} \\\\ \\hline ${zc.join(" & ")}\\end{array}`;
  };

  // il passo corrente (cursore k, intero fra 0 e K)
  const passoCorrente = (st) => {
    const S = simplesso(st.chiave()), k = Math.max(0, Math.min(S.K, Math.round(st.p().k || 0)));
    return { S, k, s: S.passi[k] };
  };
  const cursoreK = (st) => st.el.querySelector(".gi-ctrl input[type=range]");
  // intervallo del cursore: da 0 al numero di iterazioni del problema scelto
  const preparaK = (st) => {
    const k = st.chiave(), S = simplesso(k), inp = cursoreK(st);
    if (!inp) return;
    inp.max = S.K;
    if (st.dati.ultima !== k) inp.value = 0;
    st.dati.ultima = k;
  };

  const PROB_SIMPLESSO = ["P10", "P2", "P4", "P8", "P0"];
  const voci = (lista) => Object.fromEntries(lista.map((k) => [k, { tex: k, etichetta: k }]));

  window.GI_RICETTE = window.GI_RICETTE || {};

  // ================================================================
  // L'algoritmo del simplesso, un pivot alla volta (cap. 6)
  // ================================================================
  window.GI_RICETTE["simplesso-passi"] = {
    titolo: T("Il simplesso passo per passo", "The simplex method step by step"),
    sottotitolo: T("da un vertice a un vertice adiacente, finché nessun costo ridotto è positivo",
      "from a vertex to an adjacent one, until no reduced cost is positive"),
    funzioni: voci(PROB_SIMPLESSO),
    iniziale: "P10",
    etichettaFunzioni: T("Problema (catalogo)", "Problem (catalogue)"),
    parametri: [
      { k: "k", nome: "k", min: 0, max: 2, step: 1, val: 0, colore: "a", cifre: 0,
        descr: T("iterazione: \\(k = 0\\) è il dizionario iniziale (in base le variabili di scarto); premi ▶ per percorrere il cammino",
          "iteration: \\(k = 0\\) is the initial dictionary (slack variables in the basis); press ▶ to walk along the path") },
    ],
    vista: (k) => vistaDi(CAT()[k]),
    stessaScala: true,
    legenda: (st) => {
      const C = COL(st);
      return [
        [C.rosso, T("regione ammissibile \\(F\\)", "feasible region \\(F\\)"), "pieno"],
        [C.grigio, T("rette dei vincoli", "constraint lines"), "dashed"],
        [C.viola, T("cammino del simplesso", "simplex path"), ""],
        [C.viola, T("vertici visitati", "visited vertices"), "punto"],
        [C.a, T("prossimo pivot", "next pivot"), "dashed"],
        [C.blu, T("vertice ottimo", "optimal vertex"), "punto"],
      ];
    },
    monta(board, st) {
      preparaK(st);
      const S = simplesso(st.chiave()), C = COL(st);
      const pt = (s) => [s.vertice[0].valore(), s.vertice[1].valore()];
      const k = () => passoCorrente(st).k;
      // i numeri sugli assi un po' più lontani: i vertici sugli assi non li coprono
      try {
        const ax = board.defaultAxes || {};
        if (ax.x) ax.x.defaultTicks.setAttribute({ label: { offset: [0, -11], anchorX: "middle", anchorY: "top" } });
        if (ax.y) ax.y.defaultTicks.setAttribute({ label: { offset: [-11, 0], anchorX: "right", anchorY: "middle" } });
      } catch (e) { /* assi senza tacche: niente da spostare */ }
      if (S.poli.length) GI.spezzata(board, () => S.poli.concat([S.poli[0]]), {
        strokeColor: C.rosso, strokeWidth: 2, fillColor: C.rosso, fillOpacity: 0.18, fixed: true,
      });
      for (const v of S.V) if (!v.segno) retta(board, v, { strokeColor: C.grigio, strokeWidth: 1.2, dash: 2 });
      // il cammino percorso fino all'iterazione k
      GI.spezzata(board, () => S.passi.slice(0, k() + 1).map(pt), { strokeColor: C.viola, strokeWidth: 4, fixed: true });
      // il prossimo spigolo (se c'è un pivot da fare)
      const prossimo = () => S.passi[Math.min(k() + 1, S.K)];
      board.create("arrow", [[() => pt(S.passi[k()])[0], () => pt(S.passi[k()])[1]], [() => pt(prossimo())[0], () => pt(prossimo())[1]]], {
        strokeColor: C.a, strokeWidth: 3, dash: 2, fixed: true, highlight: false, withLabel: false,
        lastArrow: { type: 2, size: 5 }, visible: () => k() < S.K,
      });
      // vertici già visitati (piccoli, viola)
      GI.nuvola(board, 12, () => S.passi.slice(0, k()).map(pt), { size: 4, fillColor: C.viola, strokeColor: C.viola });
      // vertice corrente: viola finché non è ottimo, blu all'ultima iterazione
      const att = { name: "", fixed: true, size: 7, showInfobox: false, highlight: false, withLabel: false };
      board.create("point", [() => pt(S.passi[k()])[0], () => pt(S.passi[k()])[1]],
        Object.assign({}, att, { fillColor: C.viola, strokeColor: C.viola, visible: () => k() < S.K || S.passi[S.K].esito !== "ottimo" }));
      board.create("point", [() => pt(S.passi[k()])[0], () => pt(S.passi[k()])[1]],
        Object.assign({}, att, { fillColor: C.blu, strokeColor: C.blu, visible: () => k() === S.K && S.passi[S.K].esito === "ottimo" }));
    },
    formula(p, st) {
      const { k, s } = passoCorrente(st);
      return `k = ${k}:\\quad (\\bar x_1${SEP()}\\bar x_2) = ${coppiaQ(s.vertice)},\\quad \\bar z = ${s.z.tex()}`;
    },
    letture(p, st) {
      const { S, k, s } = passoCorrente(st), C = COL(st);
      const BN = `\\(\\mathcal B = ${insieme(s.B.slice().sort((u, w) => u - w))}\\), \\(\\mathcal N = ${insieme(s.N)}\\)`;
      let r = T(`<strong>Dizionario</strong> dell'iterazione \\(${k}\\), ${BN}:<br>`, `<strong>Dictionary</strong> at iteration \\(${k}\\), ${BN}:<br>`);
      r += `\\(${dizionario(s, C)}\\)<br>`;
      const sol = s.x.map((v, j) => `\\bar x_{${j + 1}} = ${v.tex()}`).join("\\), \\(");
      r += T(`Soluzione di base (\\(\\boldsymbol x_{\\mathcal N} = \\boldsymbol 0\\)): \\(${sol}\\), di valore \\(\\bar z = ${s.z.tex()}\\).<br>`,
        `Basic solution (\\(\\boldsymbol x_{\\mathcal N} = \\boldsymbol 0\\)): \\(${sol}\\), of value \\(\\bar z = ${s.z.tex()}\\).<br>`);
      if (s.esito === "ottimo") {
        const cn = s.N.map((j) => `\\bar c_{${j + 1}} = ${s.c[j].tex()}`).join("\\), \\(");
        r += T(`Costi ridotti \\(${cn}\\): ${tinta(C.blu, "nessuno è positivo")}, STOP. La soluzione di base è ottima: \\(\\tilde{\\boldsymbol x} = ${coppiaQ(s.vertice)}\\), \\(z^* = ${s.z.tex()}\\)`,
          `Reduced costs \\(${cn}\\): ${tinta(C.blu, "none is positive")}, STOP. The basic solution is optimal: \\(\\tilde{\\boldsymbol x} = ${coppiaQ(s.vertice)}\\), \\(z^* = ${s.z.tex()}\\)`);
        r += S.verificato
          ? T(` (coincide con il catalogo), dopo \\(${S.K}\\) pivot.`, ` (it matches the catalogue), after \\(${S.K}\\) pivots.`)
          : ".";
        return r;
      }
      if (s.esito === "illimitato") {
        return r + T(`La colonna \\(${xv(s.p)}\\) non ha coefficienti \\(\\bar a_{i${s.p + 1}} > 0\\): il problema è illimitato.`,
          `Column \\(${xv(s.p)}\\) has no coefficient \\(\\bar a_{i${s.p + 1}} > 0\\): the problem is unbounded.`);
      }
      const pos = s.positivi.map((j) => `\\bar c_{${j + 1}} = ${s.c[j].tex()}`).join("\\), \\(");
      r += T(`${tinta(C.a, "Colonna pivot")}: costi ridotti positivi \\(${pos}\\); regola di Bland (indice minimo): entra \\(${colTex(C.a, xv(s.p))}\\).<br>`,
        `${tinta(C.a, "Pivot column")}: positive reduced costs \\(${pos}\\); Bland's rule (smallest index): \\(${colTex(C.a, xv(s.p))}\\) enters.<br>`);
      const rap = s.rapporti.map((q) => `${xv(q.j)}\\!: ${s.b[q.i].tex()} \\,/\\, ${s.A[q.i][s.p].tex()} = ${q.t.tex()}`).join("\\); \\(");
      const esce = s.B[s.r];
      r += T(`${tinta(C.b, "Riga pivot")}: rapporti \\(\\bar b_i / \\bar a_{i${s.p + 1}}\\) con \\(\\bar a_{i${s.p + 1}} > 0\\): \\(${rap}\\); il minimo è \\(t_m = ${s.tm.tex()}\\): esce \\(${colTex(C.b, xv(esce))}\\).<br>`,
        `${tinta(C.b, "Pivot row")}: ratios \\(\\bar b_i / \\bar a_{i${s.p + 1}}\\) with \\(\\bar a_{i${s.p + 1}} > 0\\): \\(${rap}\\); the minimum is \\(t_m = ${s.tm.tex()}\\): \\(${colTex(C.b, xv(esce))}\\) leaves.<br>`);
      const nuovo = S.passi[k + 1];
      r += T(`Lungo lo spigolo ${tinta(C.a, "tratteggiato")} \\(${xv(s.p)}\\) sale da \\(0\\) a \\(${s.tm.tex()}\\): si arriva in \\(${coppiaQ(nuovo.vertice)}\\) e \\(z\\) cresce di \\(\\bar c_{${s.p + 1}}\\, t_m = ${nuovo.z.meno(s.z).tex()}\\).`,
        `Along the ${tinta(C.a, "dashed")} edge \\(${xv(s.p)}\\) grows from \\(0\\) to \\(${s.tm.tex()}\\): we reach \\(${coppiaQ(nuovo.vertice)}\\) and \\(z\\) increases by \\(\\bar c_{${s.p + 1}}\\, t_m = ${nuovo.z.meno(s.z).tex()}\\).`);
      return r;
    },
    domanda: T("In P10 premi ▶ e segui il cammino: a ogni pivot la variabile che esce dalla base indica quale vincolo diventa attivo \\((x_{n+i} = 0)\\). Il valore \\(\\bar z\\) diminuisce mai? In P0, perché il simplesso passa per \\((2; 0)\\) prima di arrivare all'ottimo, anche se \\(c_2 > c_1\\)?",
      "In P10 press ▶ and follow the path: at each pivot the variable that leaves the basis tells which constraint becomes active \\((x_{n+i} = 0)\\). Does \\(\\bar z\\) ever decrease? In P0, why does the simplex method go through \\((2, 0)\\) before reaching the optimum, even though \\(c_2 > c_1\\)?"),
  };
})();
