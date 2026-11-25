/* Grafici interattivi dei capitoli 1-5 di «Programmazione lineare» (JSXGraph).
 *
 * Ricette per il motore interattivi.js (formato documentato nel commento in
 * testa al motore); ognuna si registra in window.GI_RICETTE:
 *   livello-lineare  funzione lineare c'x: rette di livello e gradiente (cap. 1)
 *   poliedro         semispazi e poliedri in R^2, vertici esatti (cap. 2)
 *   metodo-grafico   la retta di livello c'x = k scorre fino al vertice ottimo (cap. 4)
 *   esiti            ottimo unico, ottimi multipli, illimitato, inammissibile (cap. 5)
 *
 * I problemi vengono dal catalogo P0-P86 (catalogo_pl.js, const CATALOGO, numeri
 * in frazioni esatte "num/den"): qui si usano solo quelli con n = 2. I vertici
 * si ricalcolano in aritmetica intera esatta (intersezioni di due rette e
 * verifica di tutti i vincoli) e si confrontano con quelli del catalogo.
 *
 * Colori come nelle figure delle dispense: regione ammissibile rossa (riempimento
 * al 20% e bordo rosso), rette dei vincoli rosse continue, rette di livello
 * c'x = k blu tratteggiate (anche quella che scorre; il suo cursore k è
 * blu, --gi-livello), gradiente c freccia blu, vertice ottimo (o lato ottimo) blu,
 * altri vertici neri. Nessuna etichetta di testo sul grafico: valori e
 * spiegazioni stanno nelle letture e nella legenda.
 */
(function () {
  "use strict";
  const GI = window.GI;
  const T = GI.T, num = GI.num;
  const CAT = () => window.CATALOGO || (typeof CATALOGO !== "undefined" ? CATALOGO : {}); // eslint-disable-line no-undef

  // ------------------------------------------------------------ colori
  const scuro = () => (document.body && document.body.getAttribute("data-md-color-scheme")) === "slate";
  // dal CSS del grafico (--gi-…), con i colori delle dispense come riserva
  const COL = (st) => {
    const pr = (k, chiaro, buio) => {
      const v = st.colore(k);
      return /^(#|rgb|hsl)/.test(v) ? v : scuro() ? buio : chiaro;
    };
    return {
      rosso: pr("ammissibile", "#E03131", "#FF6B6B"), blu: pr("ottimo", "#1971C2", "#4DABF7"),
      grigio: pr("orig", "#9aa5b1", "#6b7b8f"), a: pr("a", "#D9480F", "#FF8A4C"), b: pr("b", "#0E7490", "#3BC9DB"),
      verde: scuro() ? "#69DB7C" : "#2F9E44", nero: scuro() ? "#E9ECEF" : "#212529",
    };
  };
  const tinta = (c, html) => `<strong style="color:${c}">${html}</strong>`;
  // stili delle figure delle dispense (TikZ): vincoli rossi continui, regione rossa al 20%,
  // rette di livello blu tratteggiate, vertici neri (l'ottimo blu)
  const ST_VINCOLO = (C) => ({ strokeColor: C.rosso, strokeWidth: 1.5, strokeOpacity: 0.75 });
  const ST_REGIONE = (C) => ({ strokeColor: C.rosso, strokeWidth: 3, fillColor: C.rosso, fillOpacity: 0.2, fixed: true });
  const ST_LIVELLO = (C) => ({ strokeColor: C.blu, strokeWidth: 2.5, dash: 2 });
  const ST_VERTICE = (C) => ({ size: 3.5, fillColor: C.nero, strokeColor: C.nero });

  // ------------------------------------------------------------ frazioni esatte
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const Qs = (s) => { const [n, d] = String(s).split("/"); return Q(parseInt(n, 10), d ? parseInt(d, 10) : 1); };
  const Qv = (q) => q.n / q.d;
  const Qeq = (a, b) => a.n === b.n && a.d === b.d;
  const Qadd = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
  const Qmul = (a, b) => Q(a.n * b.n, a.d * b.d);
  const Qtex = (q) => (q.d === 1 ? String(q.n) : `${q.n < 0 ? "-" : ""}\\tfrac{${Math.abs(q.n)}}{${q.d}}`);
  // coppia di coordinate: con la virgola decimale (IT) si separa con «;»
  const SEP = () => (GI.EN ? ",\\ " : ";\\ ");
  const coppia = (a, b) => `\\big(${a}${SEP()}${b}\\big)`;
  const coppiaQ = (p) => coppia(Qtex(p[0]), Qtex(p[1]));
  // le coordinate del vertice ottimo scritte accanto al punto blu, in frazioni (Fabio, 25/11/2026)
  const Qtxt = (q) => (q.d === 1 ? String(q.n) : `${q.n}/${q.d}`);
  const etichettaPunto = (p) => `(${Qtxt(p[0])}, ${Qtxt(p[1])})`;
  const TXT_BLU = { cssClass: "JXGtext gi-txt-blu", highlightCssClass: "JXGtext gi-txt-blu" };
  const TXT_ROSSO = { cssClass: "JXGtext gi-txt-rosso", highlightCssClass: "JXGtext gi-txt-rosso" };
  const PEDICI = ["\u2081", "\u2082", "\u2083"];
  // a_1 x_1 + a_2 x_2 = k in testo semplice (per le scritte dentro la figura)
  const linTxt = (qs) => {
    let t = "";
    qs.forEach((q, i) => {
      if (q.n === 0) return;
      const neg = q.n < 0, abs = Q(Math.abs(q.n), q.d), coef = abs.n === 1 && abs.d === 1 ? "" : Qtxt(abs);
      t += (t ? (neg ? " \u2212 " : " + ") : neg ? "\u2212" : "") + coef + "x" + PEDICI[i];
    });
    return t || "0";
  };
  // il vertice ottimo: tratteggi fino agli assi e i valori delle coordinate sugli assi
  const proiezioniOttimo = (board, A, st, C) => {
    const x = Qv(A.xs[0]), y = Qv(A.xs[1]), vis = () => mostraOttimo(st);
    const tr = { strokeColor: C.blu, strokeWidth: 1.5, dash: 2, fixed: true, highlight: false, visible: vis };
    board.create("segment", [[x, 0], [x, y]], tr);
    board.create("segment", [[0, y], [x, y]], tr);
    const st0 = Object.assign({ fixed: true, highlight: false, fontSize: 14, visible: vis }, TXT_BLU);
    board.create("text", [x, 0, Qtxt(A.xs[0])], Object.assign({ anchorX: "middle", anchorY: "top", offset: [0, -6] }, st0));
    board.create("text", [0, y, Qtxt(A.xs[1])], Object.assign({ anchorX: "right", anchorY: "middle", offset: [-6, 0] }, st0));
  };

  // a_1 x_1 + a_2 x_2 con coefficienti frazione (0, 1, -1 trattati a parte)
  const lin = (qs, vars = ["x_1", "x_2"]) => {
    let s = "";
    qs.forEach((q, i) => {
      if (q.n === 0) return;
      const neg = q.n < 0, abs = Q(Math.abs(q.n), q.d);
      const coef = abs.n === 1 && abs.d === 1 ? "" : Qtex(abs);
      s += (s ? (neg ? " - " : " + ") : neg ? "-" : "") + coef + vars[i];
    });
    return s || "0";
  };
  const REL = { "<=": "\\le", ">=": "\\ge", "=": "=" };

  /** modello di PL come nelle dispense (stesso codice in PL gi-cap1-5.js, PLI e MIP gi-comune.js):
   *  ogni x_j nella sua colonna, coefficienti allineati a destra (1 non si scrive, 0 lascia la
   *  colonna vuota), segni + − e relazioni ≤ = ≥ in colonna, termini noti allineati a destra.
   *  M = { senso: "max" | "min", c: [...], A: [[...], ...], b: [...],
   *        rel: ["<=" | "=" | ">=", ...] (assente: tutti <=), x: nomi TeX (assente: x_1 … x_n),
   *        dominio: "nonneg" (assente: riga x_1, …, x_n ≥ 0) | "interi" (x_1, …, x_n ∈ Z_+) | TeX | null }
   *  Coefficienti: numeri, oppure { s: segno (-1, 0, 1), t: TeX del valore assoluto } (frazioni,
   *  colori); termini noti: numeri o TeX. Restituisce un alignedat (senza \( \)). */
  const modelloPL = (M) => {
    const n = M.c.length, x = M.x || Array.from({ length: n }, (_, j) => `x_${j + 1}`);
    const co = (v) => (typeof v === "number" ? { s: Math.sign(v), t: String(Math.abs(v)) } : v);
    const REL = { "<=": "\\le", ">=": "\\ge", "=": "=" };
    // colonne: etichetta (r) | spazio (l) | x_1 (r) | segno (l) | x_2 (r) | … | x_n (r) | relazione (l) | termine noto (r)
    const termini = (riga) => {
      const out = [];
      let primo = true;
      riga.forEach((v, j) => {
        const q = co(v);
        if (!q.s) { if (j) out.push(""); out.push(""); return; }
        const t = (q.t === "1" ? "" : q.t) + x[j];
        if (j) out.push(primo ? "" : q.s < 0 ? "{}-{}" : "{}+{}");
        out.push((primo && q.s < 0 ? "{-}" : "") + t);   // {-}: meno unario, attaccato
        primo = false;
      });
      return out;
    };
    const righe = [[`\\${M.senso || "max"}`, "\\quad", ...termini(M.c)].join(" & ")];
    M.A.forEach((r, i) => {
      const rel = REL[(M.rel || [])[i] || "<="];
      righe.push(["", "", ...termini(r), `{}${rel}{}`, String(M.b[i])].join(" & "));
    });
    const dom = M.dominio === undefined ? "nonneg" : M.dominio;
    if (dom === "nonneg" || dom === "interi") {
      const cel = [];
      x.forEach((v, j) => { if (j) cel.push(""); cel.push(j < n - 1 ? `${v},` : v); });
      righe.push(["", "", ...cel, dom === "interi" ? "{}\\in{}" : "{}\\ge{}", dom === "interi" ? "\\mathbb{Z}_+" : "0"].join(" & "));
    } else if (dom) righe.push(`& \\rlap{${dom}}`);
    return `\\begin{alignedat}{${n + 2}}${righe.join(" \\\\ ")}\\end{alignedat}`;
  };
  GI.modelloPL = modelloPL;   // lo usano anche gi-cap6-8.js e gi-cap9-14.js

  // ------------------------------------------------------------ vincoli e regioni
  // un vincolo è {a: [a1, a2], b} e significa a1 x1 + a2 x2 <= b (interi, se possibile)
  const interi = (qs) => {
    // moltiplica la riga per il minimo comune multiplo dei denominatori
    const l = qs.reduce((m, q) => (m * q.d) / gcd(m, q.d), 1);
    return qs.map((q) => (q.n * l) / q.d);
  };
  const vincoliDi = (P, nonneg = true) => {
    const V = [];
    P.A.forEach((riga, i) => {
      const [a1, a2, b] = interi([...riga.map(Qs), Qs(P.b[i])]);
      if (P.rel[i] !== ">=") V.push({ a: [a1, a2], b });
      if (P.rel[i] !== "<=") V.push({ a: [-a1, -a2], b: -b });
    });
    if (nonneg) P.segni.forEach((s, j) => {
      if (s === ">=0") V.push({ a: j ? [0, -1] : [-1, 0], b: 0, segno: true });
      if (s === "<=0") V.push({ a: j ? [0, 1] : [1, 0], b: 0, segno: true });
    });
    return V;
  };
  // vertici esatti: intersezioni di due rette che soddisfano tutti i vincoli
  const verticiEsatti = (V) => {
    const out = [];
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
      const [p, q] = [V[i], V[j]];
      let d = p.a[0] * q.a[1] - p.a[1] * q.a[0];
      if (d === 0) continue;
      let n1 = p.b * q.a[1] - p.a[1] * q.b, n2 = p.a[0] * q.b - p.b * q.a[0];
      if (d < 0) { n1 = -n1; n2 = -n2; d = -d; }
      if (!V.every((v) => v.a[0] * n1 + v.a[1] * n2 <= v.b * d)) continue;
      const P = [Q(n1, d), Q(n2, d)];
      if (!out.some((o) => Qeq(o[0], P[0]) && Qeq(o[1], P[1]))) out.push(P);
    }
    return out.sort((u, w) => Qv(u[0]) - Qv(w[0]) || Qv(u[1]) - Qv(w[1]));
  };
  // la regione come poligono: il quadrato [-L, L]^2 tagliato da ogni semipiano (Sutherland-Hodgman)
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
  // vuoto / limitato / illimitato
  const classifica = (V) => {
    const vert = verticiEsatti(V), L = 1e4, P = poligono(V, L);
    if (!P.length) return { tipo: "vuoto", vert };
    const lontano = P.some((p) => Math.abs(p[0]) > L / 2 || Math.abs(p[1]) > L / 2);
    return { tipo: lontano ? "illimitato" : "limitato", vert };
  };
  // il tratto della retta c'x = k dentro il poligono P (o null)
  const trattoRetta = (P, c, z) => {
    const pts = [], f = (p) => c[0] * p[0] + c[1] * p[1] - z, tol = 1e-9 * (1 + Math.abs(z));
    for (let k = 0; k < P.length; k++) {
      const p = P[k], q = P[(k + 1) % P.length], fp = f(p), fq = f(q);
      if (Math.abs(fp) <= tol) pts.push(p);
      if ((fp < -tol && fq > tol) || (fp > tol && fq < -tol)) {
        const t = fp / (fp - fq);
        pts.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    if (!pts.length) return null;
    const u = (p) => -c[1] * p[0] + c[0] * p[1];
    let lo = pts[0], hi = pts[0];
    for (const p of pts) { if (u(p) < u(lo)) lo = p; if (u(p) > u(hi)) hi = p; }
    return [lo, hi];
  };
  // la retta a1 x1 + a2 x2 = b per JSXGraph: [-b, a1, a2] (equazione -b + a1 x + a2 y = 0)
  const retta = (board, coeff, attr) =>
    board.create("line", [() => -coeff().b, () => coeff().a[0], () => coeff().a[1]],
      Object.assign({ fixed: true, highlight: false, withLabel: false, straightFirst: true, straightLast: true }, attr));

  // vista che contiene i vertici del problema (e l'origine), un po' larga
  const vistaDi = (P) => {
    const vs = (P && P.vertici ? P.vertici : []).map((v) => v.map((s) => Qv(Qs(s))));
    let X = 0, Y = 0;
    for (const [x, y] of vs) { X = Math.max(X, x); Y = Math.max(Y, y); }
    if (P && P.raggio) { X = Math.max(X, 4); Y = Math.max(Y, 4); }
    X = Math.max(5, X * 1.3 + 0.6); Y = Math.max(4.2, Y * 1.3 + 0.6);
    return [-1.2, Y, X, -1.2];
  };

  // il problema come nelle dispense (modelloPL: x_j, segni e relazioni in colonna)
  const coefQ = (q) => ({ s: Math.sign(q.n), t: Qtex(Q(Math.abs(q.n), q.d)) });
  const sistema = (P) => modelloPL({
    senso: P.senso, c: P.c.map((v) => coefQ(Qs(v))), A: P.A.map((r) => r.map((v) => coefQ(Qs(v)))),
    rel: P.rel, b: P.b.map((v) => Qtex(Qs(v))), dominio: P.segni.every((v) => v === ">=0") ? "nonneg" : null,
  });

  // controlli del motore: gli input dei cursori (nell'ordine di parametri) e il pannello destro
  const pannello = (st) => st.el.querySelector(".gi-corpo").children[1];
  const cursori = (st) => st.el.querySelectorAll(".gi-ctrl input[type=range]");

  window.GI_RICETTE = window.GI_RICETTE || {};

  // ================================================================
  // 1. Funzione lineare: rette di livello e gradiente (cap. 1)
  // ================================================================
  const PASSI = [0.25, 0.5, 1, 2, 2.5, 5, 10];
  // passo fra i livelli delle rette di livello sottili: le rette distano circa 1
  const passoLivelli = (n) => PASSI.reduce((m, v) => (Math.abs(Math.log(v / n)) < Math.abs(Math.log(m / n)) ? v : m), 1);
  const par = (v, c) => (v < 0 ? `(${num(v, c)})` : num(v, c));

  window.GI_RICETTE["livello-lineare"] = {
    titolo: T("Rette di livello di una funzione lineare", "Level lines of a linear function"),
    sottotitolo: T("\\(f(\\boldsymbol x) = \\boldsymbol c'\\boldsymbol x\\) è costante sulle rette perpendicolari a \\(\\boldsymbol c\\)",
      "\\(f(\\boldsymbol x) = \\boldsymbol c'\\boldsymbol x\\) is constant on the lines perpendicular to \\(\\boldsymbol c\\)"),
    parametri: [
      { k: "c1", nome: "c_1", min: -3, max: 3, step: 0.5, val: 2, colore: "a",
        descr: T("prima componente del gradiente \\(\\boldsymbol c\\)", "first component of the gradient \\(\\boldsymbol c\\)") },
      { k: "c2", nome: "c_2", min: -3, max: 3, step: 0.5, val: 1, colore: "b",
        descr: T("seconda componente; trascina anche il punto \\(\\boldsymbol x\\)", "second component; drag the point \\(\\boldsymbol x\\) too") },
    ],
    vista: [-5, 4, 5, -4],
    stessaScala: true,
    legenda: (st) => {
      const C = COL(st);
      return [
        [C.blu, T("rette di livello \\(\\boldsymbol c'\\boldsymbol x = k\\) (sottili)", "level lines \\(\\boldsymbol c'\\boldsymbol x = k\\) (thin)"), "dashed"],
        [C.blu, T("retta di livello per \\(\\boldsymbol x\\) (spessa)", "level line through \\(\\boldsymbol x\\) (thick)"), "dashed"],
        [C.blu, T("gradiente \\(\\boldsymbol c\\) applicato in \\(\\boldsymbol x\\)", "gradient \\(\\boldsymbol c\\) drawn at \\(\\boldsymbol x\\)"), ""],
        [C.nero, T("il punto \\(\\boldsymbol x\\) (trascinabile)", "the point \\(\\boldsymbol x\\) (draggable)"), "punto"],
      ];
    },
    monta(board, st) {
      const D = st.dati, C = COL(st);
      if (!D.x) D.x = [1.5, 1];
      const c = () => [st.p().c1, st.p().c2];
      const nc = () => Math.hypot(...c());
      const passo = () => passoLivelli(nc() || 1);
      for (let j = -24; j <= 24; j++) {
        board.create("line", [() => -j * passo(), () => c()[0], () => c()[1]], {
          strokeColor: C.blu, strokeWidth: 1.2, strokeOpacity: 0.45, dash: 2, fixed: true, highlight: false, withLabel: false,
          visible: () => nc() > 0,
        });
      }
      const fx = () => c()[0] * D.x[0] + c()[1] * D.x[1];
      board.create("line", [() => -fx(), () => c()[0], () => c()[1]], Object.assign(ST_LIVELLO(C), {
        strokeWidth: 3, fixed: true, highlight: false, withLabel: false, visible: () => nc() > 0,
      }));
      board.create("arrow", [[() => D.x[0], () => D.x[1]], [() => D.x[0] + c()[0], () => D.x[1] + c()[1]]], {
        strokeColor: C.blu, strokeWidth: 3.5, fixed: true, highlight: false, withLabel: false,
        lastArrow: { type: 2, size: 5 }, visible: () => nc() > 0,
      });
      const X = board.create("point", D.x.slice(), {
        name: "", size: 5, fillColor: C.nero, strokeColor: C.nero, highlightFillColor: C.nero, highlightStrokeColor: C.nero,
        showInfobox: false, snapToGrid: true, snapSizeX: 0.1, snapSizeY: 0.1,
      });
      X.on("drag", () => { D.x = [X.X(), X.Y()]; });
    },
    formula(p, st) {
      const D = st.dati, x = D.x || [1.5, 1], f = p.c1 * x[0] + p.c2 * x[1];
      return `f(\\boldsymbol x) = ${p.c1 < 0 ? "-" : ""}${st.col("c1", num(Math.abs(p.c1), 1))}\\,x_1 ${p.c2 < 0 ? "-" : "+"} ${st.col("c2", num(Math.abs(p.c2), 1))}\\,x_2` +
        ` = ${st.col("c1", par(p.c1, 1))} \\cdot ${par(x[0], 1)} + ${st.col("c2", par(p.c2, 1))} \\cdot ${par(x[1], 1)} = ${num(f, 2)}`;
    },
    letture(p, st) {
      const C = COL(st), x = st.dati.x || [1.5, 1], f = p.c1 * x[0] + p.c2 * x[1], nc = Math.hypot(p.c1, p.c2);
      let r = T(`Punto \\(\\boldsymbol x = ${coppia(num(x[0], 1), num(x[1], 1))}\\): \\(k = \\boldsymbol c'\\boldsymbol x = ${num(f, 2)}\\).<br>`,
        `Point \\(\\boldsymbol x = ${coppia(num(x[0], 1), num(x[1], 1))}\\): \\(k = \\boldsymbol c'\\boldsymbol x = ${num(f, 2)}\\).<br>`);
      if (nc === 0) {
        return r + T("Con \\(\\boldsymbol c = \\boldsymbol 0\\) la funzione vale \\(0\\) dappertutto: l'unico insieme di livello non vuoto è tutto il piano (\\(k = 0\\)) e non c'è una direzione di crescita.",
          "With \\(\\boldsymbol c = \\boldsymbol 0\\) the function is \\(0\\) everywhere: the only non-empty level set is the whole plane (\\(k = 0\\)) and there is no direction of increase.");
      }
      r += T(`${tinta(C.blu, "Gradiente")} \\(\\nabla f(\\boldsymbol x) = \\boldsymbol c = ${coppia(num(p.c1, 1), num(p.c2, 1))}\\), lo stesso in ogni punto.<br>`,
        `${tinta(C.blu, "Gradient")} \\(\\nabla f(\\boldsymbol x) = \\boldsymbol c = ${coppia(num(p.c1, 1), num(p.c2, 1))}\\), the same at every point.<br>`);
      r += T(`${tinta(C.blu, "Retta di livello")} (spessa) per \\(\\boldsymbol x\\): \\(\\{\\boldsymbol x \\in \\R^2 : \\boldsymbol c'\\boldsymbol x = ${num(f, 2)}\\}\\), perpendicolare a \\(\\boldsymbol c\\).<br>`,
        `${tinta(C.blu, "Level line")} (thick) through \\(\\boldsymbol x\\): \\(\\{\\boldsymbol x \\in \\R^2 : \\boldsymbol c'\\boldsymbol x = ${num(f, 2)}\\}\\), perpendicular to \\(\\boldsymbol c\\).<br>`);
      const d = passoLivelli(nc);
      r += T(`Rette tratteggiate sottili: i livelli \\(k = 0, \\pm ${num(d, 2)}, \\pm ${num(2 * d, 2)}, \\dots\\); \\(f\\) cresce nel verso di \\(\\boldsymbol c\\).`,
        `Thin dashed lines: the levels \\(k = 0, \\pm ${num(d, 2)}, \\pm ${num(2 * d, 2)}, \\dots\\); \\(f\\) increases in the direction of \\(\\boldsymbol c\\).`);
      if (p.c1 === 0) r += T("<br>Con \\(c_1 = 0\\) le rette di livello sono orizzontali: \\(f\\) dipende solo da \\(x_2\\).", "<br>With \\(c_1 = 0\\) the level lines are horizontal: \\(f\\) depends only on \\(x_2\\).");
      else if (p.c2 === 0) r += T("<br>Con \\(c_2 = 0\\) le rette di livello sono verticali: \\(f\\) dipende solo da \\(x_1\\).", "<br>With \\(c_2 = 0\\) the level lines are vertical: \\(f\\) depends only on \\(x_1\\).");
      return r;
    },
    domanda: T("Metti \\(c_1 = 0\\): come diventano le rette di livello, e da quale variabile dipende \\(f\\)? Poi cambia il segno di entrambe le componenti (\\(\\boldsymbol c \\to -\\boldsymbol c\\)): le rette cambiano? E il verso in cui \\(f\\) cresce? Trascina \\(\\boldsymbol x\\) lungo la retta di livello spessa: che cosa resta costante?",
      "Set \\(c_1 = 0\\): what do the level lines become, and on which variable does \\(f\\) depend? Then change the sign of both components (\\(\\boldsymbol c \\to -\\boldsymbol c\\)): do the lines change? And the direction in which \\(f\\) increases? Drag \\(\\boldsymbol x\\) along the thick level line: what stays constant?"),
  };

  // ================================================================
  // 2. Semispazi e poliedri (cap. 2)
  // ================================================================
  const PROB_POLIEDRO = ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
  const voci = (lista) => Object.fromEntries(lista.map((k) => [k, { tex: k, etichetta: k }]));
  // i dati modificabili di ogni problema: A, b (interi, tutti in forma <=), vincolo scelto, x >= 0
  const datiPoliedro = (st) => {
    const k = st.chiave(), P = CAT()[k];
    st.dati.prob = st.dati.prob || {};
    if (!st.dati.prob[k]) {
      const V = vincoliDi(P, false);
      st.dati.prob[k] = { A: V.map((v) => v.a.slice()), b: V.map((v) => v.b), sel: 0, nonneg: true };
    }
    return st.dati.prob[k];
  };
  const vincoliPoliedro = (D) => {
    const V = D.A.map((a, i) => ({ a: a.slice(), b: D.b[i] }));
    if (D.nonneg) V.push({ a: [-1, 0], b: 0, segno: true }, { a: [0, -1], b: 0, segno: true });
    return V;
  };
  const scriviCursori = (st, D) => {
    const inp = cursori(st), v = [D.A[D.sel][0], D.A[D.sel][1], D.b[D.sel]];
    inp.forEach((el, i) => { el.value = v[i]; });
  };
  const disegnaControlliPoliedro = (st) => {
    const pan = pannello(st), D = datiPoliedro(st);
    // «Azzera» riporta anche i vincoli a quelli del catalogo
    const az = pan.querySelector(":scope > div > button.gi-btn");
    if (az && !az._plAvvolto) {
      const orig = az.onclick;
      az.onclick = () => { if (st.dati.prob) delete st.dati.prob[st.chiave()]; orig(); };
      az._plAvvolto = true;
    }
    const vecchio = pan.querySelector(".pl-vincoli");
    if (vecchio) vecchio.remove();
    const box = GI.h("div", { class: "pl-vincoli", style: "margin:.5em 0 .2em" },
      `<strong>${T("Vincolo da modificare", "Constraint to edit")}</strong>`);
    const chips = GI.h("div", { class: "gi-chips" });
    const ridisegna = () => { scriviCursori(st, datiPoliedro(st)); disegnaControlliPoliedro(st); st.aggiorna(); };
    D.A.forEach((_, i) => {
      const b = GI.h("button", { class: "gi-chip", "aria-pressed": String(i === D.sel), title: T("vincolo ", "constraint ") + (i + 1) }, `\\(${i + 1}\\)`);
      b.onclick = () => { datiPoliedro(st).sel = i; ridisegna(); };
      chips.append(b);
    });
    const piu = GI.h("button", { class: "gi-chip", title: T("aggiungi un vincolo", "add a constraint") }, "+");
    piu.disabled = D.A.length >= 4;
    piu.onclick = () => { const d = datiPoliedro(st); if (d.A.length < 4) { d.A.push([1, 1]); d.b.push(6); d.sel = d.A.length - 1; ridisegna(); } };
    const meno = GI.h("button", { class: "gi-chip", title: T("togli il vincolo scelto", "remove the chosen constraint") }, "−");
    meno.disabled = D.A.length <= 1;
    meno.onclick = () => { const d = datiPoliedro(st); if (d.A.length > 1) { d.A.splice(d.sel, 1); d.b.splice(d.sel, 1); d.sel = Math.max(0, d.sel - 1); ridisegna(); } };
    const segni = GI.h("button", { class: "gi-chip", "aria-pressed": String(D.nonneg) }, "\\(x_1, x_2 \\ge 0\\)");
    segni.onclick = () => { const d = datiPoliedro(st); d.nonneg = !d.nonneg; ridisegna(); };
    chips.append(piu, meno, segni);
    box.append(chips);
    pan.insertBefore(box, pan.querySelector(".gi-ctrl"));
    GI.typeset(box);
  };

  window.GI_RICETTE["poliedro"] = {
    titolo: T("Semispazi e poliedri", "Half-spaces and polyhedra"),
    sottotitolo: T("\\(\\{\\boldsymbol x \\in \\R^2 : \\boldsymbol A\\boldsymbol x \\le \\boldsymbol b\\}\\): intersezione di semipiani",
      "\\(\\{\\boldsymbol x \\in \\R^2 : \\boldsymbol A\\boldsymbol x \\le \\boldsymbol b\\}\\): an intersection of half-planes"),
    funzioni: voci(PROB_POLIEDRO),
    iniziale: "P2",
    etichettaFunzioni: T("Vincoli di partenza (catalogo)", "Starting constraints (catalogue)"),
    parametri: [
      { k: "a1", nome: "a_{1}", min: -10, max: 10, step: 1, val: 1, colore: "a",
        descr: T("coefficiente di \\(x_1\\) nel vincolo scelto", "coefficient of \\(x_1\\) in the chosen constraint") },
      { k: "a2", nome: "a_{2}", min: -10, max: 10, step: 1, val: 1, colore: "b",
        descr: T("coefficiente di \\(x_2\\)", "coefficient of \\(x_2\\)") },
      { k: "b", nome: "b", min: -40, max: 40, step: 1, val: 4, colore: "e",
        descr: T("termine noto: sposta la retta parallelamente a sé stessa", "right-hand side: moves the line parallel to itself") },
    ],
    vista: (k) => vistaDi(CAT()[k]),
    stessaScala: true,
    legenda: (st) => {
      const C = COL(st);
      return [
        [C.rosso, T("poliedro", "polyhedron"), "pieno"],
        [C.rosso, T("rette dei vincoli", "constraint lines"), ""],
        [C.rosso, T("retta del vincolo scelto (spessa)", "line of the chosen constraint (thick)"), ""],
        [C.nero, T("vertici", "vertices"), "punto"],
      ];
    },
    monta(board, st) {
      const C = COL(st), D = () => datiPoliedro(st);
      scriviCursori(st, D());
      disegnaControlliPoliedro(st);
      GI.spezzata(board, () => { const P = poligono(vincoliPoliedro(D()), 80); return P.length ? P.concat([P[0]]) : []; }, ST_REGIONE(C));
      for (let i = 0; i < 4; i++) {
        const v = () => { const d = D(); return i < d.A.length ? { a: d.A[i], b: d.b[i] } : { a: [0, 1], b: 0 }; };
        const ok = () => i < D().A.length && (D().A[i][0] !== 0 || D().A[i][1] !== 0);
        retta(board, v, Object.assign(ST_VINCOLO(C), { visible: () => ok() && i !== D().sel }));
        retta(board, v, { strokeColor: C.rosso, strokeWidth: 3.5, visible: () => ok() && i === D().sel });
      }
      GI.nuvola(board, 10, () => verticiEsatti(vincoliPoliedro(D())).map((p) => [Qv(p[0]), Qv(p[1])]),
        Object.assign(ST_VERTICE(C), { size: 4 }));
    },
    aggiorna(board, st) {
      const D = datiPoliedro(st), p = st.p();
      D.A[D.sel] = [p.a1, p.a2];
      D.b[D.sel] = p.b;
    },
    formula(p, st) {
      const D = datiPoliedro(st);
      const t = (v, k, x, primo) => `${v < 0 ? "-" : primo ? "" : "+"}${st.col(k, Math.abs(v))}\\,${x}`;
      return `\\text{${T("vincolo", "constraint")} ${D.sel + 1}:}\\quad ${t(p.a1, "a1", "x_1", true)} ${t(p.a2, "a2", "x_2", false)} \\le ${st.col("b", p.b)}`;
    },
    letture(p, st) {
      const D = datiPoliedro(st), C = COL(st), V = vincoliPoliedro(D), { tipo, vert } = classifica(V);
      const righe = D.A.map((a, i) => {
        const t = `${lin([Q(a[0]), Q(a[1])])} \\le ${D.b[i]}`;
        return i === D.sel ? `{\\color{${C.rosso}}{\\boldsymbol{${t}}}}` : t;
      });
      if (D.nonneg) righe.push("x_1,\\ x_2 \\ge 0");
      let r = `\\(\\begin{array}{l}${righe.join(" \\\\ ")}\\end{array}\\)<br>`;
      if (tipo === "vuoto") {
        r += T(`Il poliedro è ${tinta(C.rosso, "vuoto")}: nessun punto soddisfa tutti i vincoli insieme.`,
          `The polyhedron is ${tinta(C.rosso, "empty")}: no point satisfies all the constraints at once.`);
        return r;
      }
      r += tipo === "limitato"
        ? T(`Il poliedro è ${tinta(C.rosso, "limitato")} (un politopo).`, `The polyhedron is ${tinta(C.rosso, "bounded")} (a polytope).`)
        : T(`Il poliedro è ${tinta(C.rosso, "illimitato")}: contiene punti lontani quanto si vuole.`, `The polyhedron is ${tinta(C.rosso, "unbounded")}: it contains points as far away as we like.`);
      r += "<br>" + (vert.length
        ? T(`${tinta(C.nero, vert.length === 1 ? "1 vertice" : vert.length + " vertici")}: `, `${tinta(C.nero, vert.length === 1 ? "1 vertex" : vert.length + " vertices")}: `) +
          vert.map((v) => `\\(${coppiaQ(v)}\\)`).join(", ")
        : T("Nessun vertice: il poliedro contiene un'intera retta.", "No vertex: the polyhedron contains a whole line."));
      return r;
    },
    domanda: T("Parti da P2 e togli \\(x_1, x_2 \\ge 0\\): il poliedro resta limitato? Quanti vertici restano? Poi in P0 aggiungi un vincolo e porta \\(b\\) sotto zero con \\(a_1 = a_2 = 1\\): quando il poliedro diventa vuoto? In P2 senza \\(x_1, x_2 \\ge 0\\), riesci a renderlo di nuovo limitato con un vincolo in più?",
      "Start from P2 and remove \\(x_1, x_2 \\ge 0\\): does the polyhedron stay bounded? How many vertices are left? Then in P0 add a constraint and bring \\(b\\) below zero with \\(a_1 = a_2 = 1\\): when does the polyhedron become empty? In P2 without \\(x_1, x_2 \\ge 0\\), can you make it bounded again with one more constraint?"),
  };

  // ================================================================
  // 3-4. La retta di livello che scorre: metodo grafico ed esiti
  // ================================================================
  // analisi di un problema del catalogo: vincoli, vertici esatti e verifica di z*
  const cacheAnalisi = {};
  const analisi = (k) => {
    if (cacheAnalisi[k]) return cacheAnalisi[k];
    const P = CAT()[k], V = vincoliDi(P), vert = verticiEsatti(V), cq = P.c.map(Qs), c = cq.map(Qv);
    const valore = (v) => Qadd(Qmul(cq[0], v[0]), Qmul(cq[1], v[1]));
    const A = { P, V, vert, c, cq, valore, poli: poligono(V, 80) };
    if (P.esito === "opt") {
      const zq = Qs(P.z);
      let mio = null;
      for (const v of vert) { const z = valore(v); if (!mio || Qv(z) > Qv(mio)) mio = z; }
      A.zq = zq; A.zs = Qv(zq);
      A.xs = P.x.map(Qs);
      A.ottimi = P.vertici_ottimi.map((v) => v.map(Qs));
      A.verificato = !!mio && Qeq(mio, zq) && Qeq(valore(A.xs), zq);
    }
    const vCat = (P.vertici || []).map((v) => v.map(Qs));
    A.verticiOk = vCat.length === vert.length && vCat.every((w) => vert.some((v) => Qeq(v[0], w[0]) && Qeq(v[1], w[1])));
    if (!A.verticiOk || A.verificato === false) console.warn("PL: il calcolo dei vertici di " + k + " non coincide con il catalogo");
    if (P.raggio) A.raggio = P.raggio.map((s) => Qv(Qs(s)));
    // intervallo del cursore z
    const vals = vert.map((v) => Qv(valore(v)));
    if (P.esito === "opt") {
      let lo = Math.min(...vals);
      if (A.zs - lo < 1e-9) lo = A.zs - Math.max(4, Math.abs(A.zs));
      lo = Math.floor(lo);
      const step = (A.zs - lo) / 120;
      A.z = { lo, step, hi: lo + 150 * step };
    } else if (P.esito === "unb") {
      const lo = Math.floor(Math.min(...vals)), [x0, y1, x1, y0] = vistaDi(P);
      // fin quasi al bordo della vista: la retta resta visibile mentre taglia ancora F
      const bordo = Math.max(...[[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => c[0] * x + c[1] * y));
      const hi = lo + 0.8 * (bordo - lo);
      A.z = { lo, step: (hi - lo) / 150, hi };
    } else {
      A.z = { lo: 0, step: 0.05, hi: 8 };
    }
    return (cacheAnalisi[k] = A);
  };
  const tolZ = (A) => A.z.step / 2 + 1e-9;
  // imposta l'intervallo del cursore z per il problema scelto (min/max/step nel DOM)
  const preparaZ = (st) => {
    const k = st.chiave(), A = analisi(k), inp = cursori(st)[0];
    inp.min = A.z.lo; inp.max = A.z.hi; inp.step = A.z.step;
    if (st.dati.ultima !== k || +inp.value < A.z.lo || +inp.value > A.z.hi) inp.value = A.z.lo;
    st.dati.ultima = k;
  };
  const vinta = (p, st) => { const A = analisi(st.chiave()); return A.zs !== undefined && Math.abs(p.z - A.zs) <= tolZ(A); };
  const mostraOttimo = (st) => {
    const A = analisi(st.chiave()), z = st.p().z;
    if (A.zs === undefined) return false;
    if (st.modo() === "sfida") return vinta(st.p(), st);
    return z >= A.zs - tolZ(A);
  };

  // gli oggetti comuni: regione, rette dei vincoli, gradiente, retta di livello e suo tratto in F
  const disegnaProblema = (board, st) => {
    const A = analisi(st.chiave()), C = COL(st);
    if (A.poli.length) GI.spezzata(board, () => A.poli.concat([A.poli[0]]), ST_REGIONE(C));
    // la lettera F dentro la regione ammissibile (Fabio, 25/11/2026)
    if (A.poli.length > 2) {
      const cx = A.poli.reduce((t, q) => t + q[0], 0) / A.poli.length, cy = A.poli.reduce((t, q) => t + q[1], 0) / A.poli.length;
      board.create("text", [cx, cy, "F"], { fixed: true, highlight: false, anchorX: "middle", anchorY: "middle", fontSize: 22,
        cssStyle: "font-style:italic;font-family:serif", ...TXT_ROSSO });
    }
    for (const v of A.V) if (!v.segno) retta(board, () => v, ST_VINCOLO(C));
    // il gradiente: solo la direzione (lunghezza 1,5), applicato nell'origine
    const nc = Math.hypot(...A.c) || 1, s = 1.5 / nc;
    board.create("arrow", [[0, 0], [A.c[0] * s, A.c[1] * s]], {
      strokeColor: C.blu, strokeWidth: 3, fixed: true, highlight: false, withLabel: false, lastArrow: { type: 2, size: 5 },
    });
    // la retta di livello c'x = k (blu tratteggiata, come nelle dispense) e il suo tratto in F, più spesso
    retta(board, () => ({ a: A.c, b: st.p().z }), ST_LIVELLO(C));
    GI.spezzata(board, () => (A.poli.length ? trattoRetta(A.poli, A.c, st.p().z) || [] : []),
      Object.assign(ST_LIVELLO(C), { strokeWidth: 5.5, fixed: true }));
    // l'equazione della retta di livello, scritta in blu accanto alla retta e aggiornata con k
    const puntoScritta = () => {
      const [x0, y1, x1, y0] = board.getBoundingBox(), k = st.p().z, [c1, c2] = A.c, P = [];
      if (Math.abs(c2) > 1e-12) for (const x of [x0, x1]) { const y = (k - c1 * x) / c2; if (y >= y0 && y <= y1) P.push([x, y]); }
      if (Math.abs(c1) > 1e-12) for (const y of [y0, y1]) { const x = (k - c2 * y) / c1; if (x >= x0 && x <= x1) P.push([x, y]); }
      if (P.length < 2) return [NaN, NaN];
      P.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
      const a0 = P[0], b0 = P[P.length - 1], t = 0.8;
      return [a0[0] + t * (b0[0] - a0[0]), a0[1] + t * (b0[1] - a0[1])];
    };
    board.create("text", [() => puntoScritta()[0], () => puntoScritta()[1], () => `${linTxt(A.cq)} = ${num(st.p().z, 2)}`],
      Object.assign({ fixed: true, highlight: false, fontSize: 14, anchorX: "right", anchorY: "bottom", offset: [-8, 12],
        cssStyle: "font-weight:700" }, TXT_BLU));
    // i vertici di F, neri (l'ottimo, blu, lo disegna la ricetta sopra)
    GI.nuvola(board, 12, () => A.vert.map((v) => [Qv(v[0]), Qv(v[1])]), ST_VERTICE(C));
    return A;
  };
  const formulaZ = (p, st) => {
    const A = analisi(st.chiave());
    return `\\boldsymbol c'\\boldsymbol x = ${lin(A.cq)} = ${st.col("z", `k = ${num(p.z, 2)}`)}`;
  };
  // dove sta la retta rispetto a F
  const statoRetta = (p, st) => {
    const A = analisi(st.chiave()), C = COL(st), z = num(p.z, 2), zc = C.blu;
    if (!A.vert.length && A.P.esito === "inf") return T("La retta non incontra mai la regione ammissibile \\(F\\), per nessun \\(k\\): \\(F = \\emptyset\\).", "The line never meets the feasible region \\(F\\), for any \\(k\\): \\(F = \\emptyset\\).");
    const t = trattoRetta(A.poli, A.c, p.z);
    if (A.zs !== undefined && Math.abs(p.z - A.zs) <= tolZ(A)) {
      return A.P.multipli
        ? T(`Con \\(k = ${z}\\) la retta tocca la regione ammissibile \\(F\\) lungo ${tinta(C.blu, "un intero lato")}: è l'ultimo contatto, \\(k = z(LP)\\).`, `With \\(k = ${z}\\) the line touches the feasible region \\(F\\) along ${tinta(C.blu, "a whole edge")}: it is the last contact, \\(k = z(LP)\\).`)
        : T(`Con \\(k = ${z}\\) la retta tocca la regione ammissibile \\(F\\) ${tinta(C.blu, "in un solo vertice")}: è l'ultimo contatto, \\(k = z(LP)\\).`, `With \\(k = ${z}\\) the line touches the feasible region \\(F\\) ${tinta(C.blu, "at a single vertex")}: it is the last contact, \\(k = z(LP)\\).`);
    }
    if (t && Math.hypot(t[1][0] - t[0][0], t[1][1] - t[0][1]) < 1e-6) return T(`Con \\(k = ${z}\\) la retta tocca la regione ammissibile \\(F\\) in un solo vertice, ma non è l'ultimo contatto: aumenta \\(k\\).`,
      `With \\(k = ${z}\\) the line touches the feasible region \\(F\\) at a single vertex, but it is not the last contact: increase \\(k\\).`);
    if (t) return T(`Con \\(k = ${z}\\) la retta taglia la regione ammissibile \\(F\\) (${tinta(zc, "tratto spesso")}): ci sono soluzioni ammissibili di valore \\(${z}\\), quindi \\(z(LP) \\ge ${z}\\). Si può salire.`,
      `With \\(k = ${z}\\) the line cuts the feasible region \\(F\\) (${tinta(zc, "thick part")}): there are feasible solutions of value \\(${z}\\), so \\(z(LP) \\ge ${z}\\). We can go higher.`);
    if (A.zs !== undefined && p.z > A.zs) return T(`Con \\(k = ${z}\\) nessun punto della regione ammissibile \\(F\\) sta sulla retta: \\(k > z(LP)\\).`, `With \\(k = ${z}\\) no point of the feasible region \\(F\\) is on the line: \\(k > z(LP)\\).`);
    return T(`Con \\(k = ${z}\\) la retta non incontra la regione ammissibile \\(F\\): sali con \\(k\\).`, `With \\(k = ${z}\\) the line does not meet the feasible region \\(F\\): increase \\(k\\).`);
  };
  const parametroZ = (descr) => [{ k: "z", nome: "k", min: 0, max: 20, step: 0.01, val: 0, colore: "livello", cifre: 2, descr }];

  const PROB_GRAFICO = ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"];
  // ------------------------------------------------------------ vetrina (home della collana)
  /** Vetrina: l'app nella home della collana, <div class="gi" data-grafico="…" data-vetrina="…"> (sesto campo di
   *  APP in COLLANA/collana.py). Senza l'attributo non fa nulla: nel laboratorio l'app resta com'è.
   *  Va chiamata in monta(board, st) (dopo i comandi e i menu); agisce una volta sola per grafico:
   *  prepara(valore) porta l'app allo stato da mostrare (voce, istanza, passo: di solito il disegno completo),
   *  poi il pannello si alleggerisce: restano voci, cursori, ◀ ▶ «Esegui» e letture; spariscono «Prova tu»,
   *  «Azzera», i menu e i pulsanti delle istanze (sono nella pagina del laboratorio). */
  function vetrina(st, prepara) {
    const v = st.el.dataset.vetrina, D = st.dati;
    if (!v || D.vetrina) return;
    D.vetrina = true;
    st.el.classList.add("gi-vetrina");
    const corpo = st.el.querySelector(".gi-corpo");
    if (corpo) for (const c of corpo.children) c.style.minWidth = "0";   // la colonna unica del telefono non si allarga
    setTimeout(() => {
      try { prepara(v); } catch (e) { console.error("GI: vetrina «" + st.el.dataset.grafico + "»", e); }
      const pan = corpo && corpo.children[1];
      if (!pan) return;
      pan.querySelectorAll(".gi-domanda").forEach((e) => { e.hidden = true; });
      pan.querySelectorAll("select").forEach((e) => { if (!e.closest(".gi-comandi")) e.style.display = "none"; });
      pan.querySelectorAll(".gi-comandi").forEach((box) => {
        let dopo = false;
        for (const b of box.children) { if (dopo) b.style.display = "none"; if (b.tagName === "SELECT") dopo = true; }
      });
      for (const d of pan.children) {
        if (!d.classList.contains("gi-comandi") && d.children.length === 1 && d.firstElementChild.matches("button.gi-btn")) d.style.display = "none";
      }
    }, 40);
  }
  /** la voce k di «funzioni», come un clic sul suo pulsante */
  function scegliVoce(st, k) {
    if (!k || k === st.chiave()) return;
    const R = window.GI_RICETTE[st.el.dataset.grafico], i = Object.keys((R && (R.funzioni || R.funzioniCustom)) || {}).indexOf(k);
    const b = st.el.querySelectorAll(".gi-chip")[i];
    if (b) b.click();
  }
  /** il cursore del passo (l'ultimo del pannello) al passo k: k < 0 conta dalla fine, null è l'ultimo passo */
  function vaiAlPasso(st, k) {
    const cur = st.el.querySelectorAll(".gi-ctrl input[type=range]"), inp = cur[cur.length - 1];
    if (!inp) return;
    st.aggiorna();                           // il massimo del cursore lo fissa la ricetta in aggiorna
    const max = +inp.max, min = +inp.min;
    inp.value = String(k == null || isNaN(k) ? max : k < 0 ? Math.max(min, max + k) : Math.min(max, k));
    inp.dispatchEvent(new Event("input"));
  }

  window.GI_RICETTE["metodo-grafico"] = {
    titolo: T("Il metodo grafico", "The graphical method"),
    sottotitolo: T("la retta \\(\\boldsymbol c'\\boldsymbol x = k\\) scorre verso \\(\\boldsymbol c\\) finché tocca ancora la regione ammissibile \\(F\\)",
      "the line \\(\\boldsymbol c'\\boldsymbol x = k\\) slides along \\(\\boldsymbol c\\) as long as it still touches the feasible region \\(F\\)"),
    funzioni: voci(PROB_GRAFICO),
    iniziale: "P2",
    etichettaFunzioni: T("Problema (catalogo)", "Problem (catalogue)"),
    parametri: parametroZ(T("il livello della retta \\(\\boldsymbol c'\\boldsymbol x = k\\): premi ▶ per farla scorrere",
      "the level of the line \\(\\boldsymbol c'\\boldsymbol x = k\\): press ▶ to slide it")),
    vista: (k) => vistaDi(CAT()[k]),
    stessaScala: true,
    legenda: (st) => {
      const C = COL(st);
      return [
        [C.rosso, T("regione ammissibile \\(F\\)", "feasible region \\(F\\)"), "pieno"],
        [C.rosso, T("rette dei vincoli", "constraint lines"), ""],
        [C.blu, T("retta di livello \\(\\boldsymbol c'\\boldsymbol x = k\\)", "level line \\(\\boldsymbol c'\\boldsymbol x = k\\)"), "dashed"],
        [C.blu, T("\\(\\boldsymbol c\\): gradiente della funzione obiettivo", "\\(\\boldsymbol c\\): gradient of the objective function"), ""],
        [C.nero, T("vertici", "vertices"), "punto"],
        [C.blu, T("vertice ottimo", "optimal vertex"), "punto"],
      ];
    },
    monta(board, st) {
      preparaZ(st);
      const A = disegnaProblema(board, st), C = COL(st);
      board.create("point", [Qv(A.xs[0]), Qv(A.xs[1])], {
        name: "", fixed: true, size: 6, fillColor: C.blu, strokeColor: C.blu, showInfobox: false, highlight: false,
        visible: () => mostraOttimo(st),
      });
      proiezioniOttimo(board, A, st, C);
      // home della collana: data-vetrina="problema" (una voce), la retta di livello sul vertice ottimo
      vetrina(st, (v) => {
        scegliVoce(st, v.trim());
        const A2 = analisi(st.chiave()), inp = cursori(st)[0];
        if (inp && A2.zs !== undefined) { inp.value = String(A2.zs); inp.dispatchEvent(new Event("input")); }
      });
    },
    formula: (p, st) => formulaZ(p, st),
    letture(p, st) {
      const A = analisi(st.chiave()), C = COL(st);
      let r = `\\(${sistema(A.P)}\\)<br>` + statoRetta(p, st);
      if (mostraOttimo(st)) {
        r += "<br>" + T(`${tinta(C.blu, "Soluzione ottima")}: \\(\\tilde{\\boldsymbol x} = ${coppiaQ(A.xs)}\\)<br>${tinta(C.blu, "Valore ottimo")}: \\(z(LP) = ${Qtex(A.zq)}\\)`,
          `${tinta(C.blu, "Optimal solution")}: \\(\\tilde{\\boldsymbol x} = ${coppiaQ(A.xs)}\\)<br>${tinta(C.blu, "Optimal value")}: \\(z(LP) = ${Qtex(A.zq)}\\)`) +
          (A.verificato ? T(" (dal catalogo; coincide con il massimo di \\(\\boldsymbol c'\\boldsymbol x\\) sui vertici).", " (from the catalogue; it equals the maximum of \\(\\boldsymbol c'\\boldsymbol x\\) over the vertices).") : ".");
      }
      return r;
    },
    domanda: T("Premi ▶: in quale direzione si muove la retta quando \\(k\\) cresce, rispetto alla freccia \\(\\boldsymbol c\\)? Fermati quando la retta tocca la regione ammissibile \\(F\\) in un solo punto: è un vertice? Cambia problema: l'ultimo punto toccato è sempre un vertice?",
      "Press ▶: in which direction does the line move as \\(k\\) grows, compared with the arrow \\(\\boldsymbol c\\)? Stop when the line touches the feasible region \\(F\\) at a single point: is it a vertex? Change problem: is the last point touched always a vertex?"),
    sfida: {
      testo: T("Trova il valore di \\(k\\) per cui la retta \\(\\boldsymbol c'\\boldsymbol x = k\\) tocca <strong>l'ultimo punto</strong> della regione ammissibile.",
        "Find the value of \\(k\\) for which the line \\(\\boldsymbol c'\\boldsymbol x = k\\) touches the <strong>last point</strong> of the feasible region."),
      genera: () => ({}),
      vinta: (p, b, st) => vinta(p, st),
      vicinanza(p, b, st) {
        const A = analisi(st.chiave());
        return Math.max(0, 1 - Math.abs(p.z - A.zs) / (A.z.hi - A.z.lo));
      },
      aiuto(p, b, st) {
        const A = analisi(st.chiave());
        if (vinta(p, st)) return T("Ci sei: la retta tocca solo il vertice ottimo.", "You are there: the line touches only the optimal vertex.");
        return trattoRetta(A.poli, A.c, p.z)
          ? T("La retta taglia ancora la regione ammissibile \\(F\\): c'è spazio, aumenta \\(k\\).", "The line still cuts the feasible region \\(F\\): there is room, increase \\(k\\).")
          : p.z > A.zs
            ? T("La retta ha già lasciato la regione ammissibile \\(F\\): diminuisci \\(k\\).", "The line has already left the feasible region \\(F\\): decrease \\(k\\).")
            : T("Aumenta \\(k\\) finché la retta entra nella regione ammissibile \\(F\\).", "Increase \\(k\\) until the line enters the feasible region \\(F\\).");
      },
    },
  };

  const PROB_ESITI = ["P31", "P32", "P33", "P34", "P35", "P36", "P37", "P38", "P39", "P40"];   // il tipo D del catalogo
  window.GI_RICETTE["esiti"] = {
    titolo: T("Gli esiti di un problema di PL", "The outcomes of an LP problem"),
    sottotitolo: T("ottimo unico, ottimi multipli, illimitato, inammissibile", "unique optimum, multiple optima, unbounded, infeasible"),
    funzioni: voci(PROB_ESITI),
    iniziale: "P40",
    etichettaFunzioni: T("Problema (catalogo)", "Problem (catalogue)"),
    parametri: parametroZ(T("il livello della retta \\(\\boldsymbol c'\\boldsymbol x = k\\): premi ▶ per farla scorrere",
      "the level of the line \\(\\boldsymbol c'\\boldsymbol x = k\\): press ▶ to slide it")),
    vista: (k) => vistaDi(CAT()[k]),
    stessaScala: true,
    legenda: (st) => {
      const C = COL(st), P = CAT()[st.chiave()];
      const v = [
        ...(P.esito === "inf" ? [] : [[C.rosso, T("regione ammissibile \\(F\\)", "feasible region \\(F\\)"), "pieno"]]),
        [C.rosso, T("rette dei vincoli", "constraint lines"), ""],
        [C.blu, T("retta di livello \\(\\boldsymbol c'\\boldsymbol x = k\\)", "level line \\(\\boldsymbol c'\\boldsymbol x = k\\)"), "dashed"],
        [C.blu, T("\\(\\boldsymbol c\\): gradiente della funzione obiettivo", "\\(\\boldsymbol c\\): gradient of the objective function"), ""],
        ...(P.esito === "inf" ? [] : [[C.nero, T("vertici", "vertices"), "punto"]]),
      ];
      if (P.esito === "opt") v.push(P.multipli ? [C.blu, T("soluzioni ottime", "optimal solutions"), ""] : [C.blu, T("vertice ottimo", "optimal vertex"), "punto"]);
      if (P.esito === "unb") v.push([C.verde, T("raggio: direzione di crescita", "ray: direction of increase"), ""]);
      return v;
    },
    monta(board, st) {
      preparaZ(st);
      const A = disegnaProblema(board, st), C = COL(st), P = A.P;
      if (P.esito === "opt" && P.multipli) {
        // il segmento (o lato) delle soluzioni ottime: fra i vertici ottimi, e oltre se F è illimitata lungo il lato
        const seg = () => trattoRetta(A.poli, A.c, A.zs) || [];
        GI.spezzata(board, seg, { strokeColor: C.blu, strokeWidth: 7, fixed: true, visible: () => mostraOttimo(st) });
        GI.nuvola(board, 4, () => (mostraOttimo(st) ? A.ottimi.map((v) => [Qv(v[0]), Qv(v[1])]) : []), { size: 5, fillColor: C.blu, strokeColor: C.blu });
      } else if (P.esito === "opt") {
        board.create("point", [Qv(A.xs[0]), Qv(A.xs[1])], {
          name: "", fixed: true, size: 6, fillColor: C.blu, strokeColor: C.blu, showInfobox: false, highlight: false,
          visible: () => mostraOttimo(st),
        });
        proiezioniOttimo(board, A, st, C);
      } else if (P.esito === "unb") {
        // il raggio a partire dal vertice di valore massimo
        let v0 = A.vert[0];
        for (const v of A.vert) if (Qv(A.valore(v)) > Qv(A.valore(v0))) v0 = v;
        const x0 = [Qv(v0[0]), Qv(v0[1])], d = A.raggio, nd = Math.hypot(...d) || 1, s = 2.6 / nd;
        board.create("arrow", [x0, [x0[0] + d[0] * s, x0[1] + d[1] * s]], {
          strokeColor: C.verde, strokeWidth: 4, fixed: true, highlight: false, withLabel: false, lastArrow: { type: 2, size: 5 },
        });
        board.create("point", x0, { name: "", fixed: true, size: 3.5, fillColor: C.verde, strokeColor: C.verde, showInfobox: false, highlight: false });
      }
    },
    formula: (p, st) => formulaZ(p, st),
    letture(p, st) {
      const A = analisi(st.chiave()), C = COL(st), P = A.P;
      let r = `\\(${sistema(P)}\\)<br>`, esito;
      if (P.esito === "inf") {
        esito = T(`<strong>Inammissibile</strong>: i vincoli non hanno punti in comune, \\(F = \\emptyset\\) (non c'è niente di rosso).`,
          `<strong>Infeasible</strong>: the constraints have no common point, \\(F = \\emptyset\\) (nothing is red).`);
      } else if (P.esito === "unb") {
        const d = P.raggio.map(Qs), cd = A.valore(d);
        esito = T(`<strong>Illimitato</strong>: lungo il ${tinta(C.verde, "raggio")} \\(\\boldsymbol d = ${coppiaQ(d)}\\) si resta nella regione ammissibile \\(F\\) e \\(\\boldsymbol c'\\boldsymbol d = ${Qtex(cd)} > 0\\): \\(\\boldsymbol c'\\boldsymbol x\\) cresce senza limite, \\(z(LP) = +\\infty\\).`,
          `<strong>Unbounded</strong>: along the ${tinta(C.verde, "ray")} \\(\\boldsymbol d = ${coppiaQ(d)}\\) we stay in the feasible region \\(F\\) and \\(\\boldsymbol c'\\boldsymbol d = ${Qtex(cd)} > 0\\): \\(\\boldsymbol c'\\boldsymbol x\\) grows without limit, \\(z(LP) = +\\infty\\).`);
      } else if (P.multipli) {
        const [u, w] = A.ottimi;
        esito = T(`<strong>Ottimi multipli</strong><br>${tinta(C.blu, "Valore ottimo")}: \\(z(LP) = ${Qtex(A.zq)}\\), raggiunto in ${tinta(C.blu, "tutti i punti")} del lato da \\(${coppiaQ(u)}\\) a \\(${coppiaQ(w)}\\)${A.poli.some((q) => Math.abs(q[0]) > 40 || Math.abs(q[1]) > 40) ? " (qui la regione ammissibile \\(F\\) è illimitata, ma \\(\\boldsymbol c'\\boldsymbol x\\) no)" : ""}.`,
          `<strong>Multiple optima</strong><br>${tinta(C.blu, "Optimal value")}: \\(z(LP) = ${Qtex(A.zq)}\\), attained at ${tinta(C.blu, "every point")} of the edge from \\(${coppiaQ(u)}\\) to \\(${coppiaQ(w)}\\)${A.poli.some((q) => Math.abs(q[0]) > 40 || Math.abs(q[1]) > 40) ? " (here the feasible region \\(F\\) is unbounded, but \\(\\boldsymbol c'\\boldsymbol x\\) is not)" : ""}.`);
      } else {
        esito = T(`<strong>Ottimo unico</strong><br>${tinta(C.blu, "Soluzione ottima")}: \\(\\tilde{\\boldsymbol x} = ${coppiaQ(A.xs)}\\)<br>${tinta(C.blu, "Valore ottimo")}: \\(z(LP) = ${Qtex(A.zq)}\\).`,
          `<strong>Unique optimum</strong><br>${tinta(C.blu, "Optimal solution")}: \\(\\tilde{\\boldsymbol x} = ${coppiaQ(A.xs)}\\)<br>${tinta(C.blu, "Optimal value")}: \\(z(LP) = ${Qtex(A.zq)}\\).`);
      }
      // l'esito si legge quando la retta ha finito di scorrere (o subito, se non c'è un ultimo contatto)
      const fine = P.esito !== "opt" || mostraOttimo(st);
      return r + statoRetta(p, st) + "<br>" + (fine ? esito : T("Fai scorrere la retta fino in fondo per leggere l'esito.", "Slide the line all the way to read the outcome."));
    },
    domanda: T("Per ogni problema premi ▶ e guarda l'ultimo contatto fra la retta e la regione ammissibile \\(F\\): un punto, un lato, nessuno (la retta continua a tagliare la regione ammissibile \\(F\\)) o nessun contatto fin dall'inizio? In P36 la regione è illimitata: perché il problema ha comunque un ottimo?",
      "For each problem press ▶ and watch the last contact between the line and the feasible region \\(F\\): a point, an edge, none (the line keeps cutting the feasible region \\(F\\)) or no contact from the start? In P36 the region is unbounded: why does the problem still have an optimum?"),
  };
})();
