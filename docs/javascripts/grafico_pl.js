/* Metodo grafico per i problemi di PL con due variabili (JSXGraph).
 *
 * Nelle pagine:  <div class="gpl" data-problema="P2"></div>
 * I problemi del catalogo vengono da catalogo_pl.js (generato da
 * python/catalogo.py); si puo' anche scrivere un problema a mano.
 * Tutti i numeri mostrati (vertici, valori, esito) sono calcolati in frazioni
 * esatte: l'aritmetica in virgola mobile serve solo a disegnare.
 * La copia inglese differisce solo per LINGUA.
 */
(function () {
  "use strict";
  const LINGUA = "it";

  // ------------------------------------------------------------------ testi
  const TESTI = {
    it: {
      titolo: "Metodo grafico", sottotitolo: "regione ammissibile, gradiente, curve di livello",
      esplora: "Esplora", prova: "Prova tu",
      problema: "Problema", tuo: "scritto da te", tipo: "Tipo",
      scrivi: "Scrivi il tuo problema", disegna: "Disegna",
      aiutoEditor: "Una riga per la funzione obiettivo (<code>max</code> o <code>min</code>), una per ogni vincolo con <code>&lt;=</code>, <code>&gt;=</code> o <code>=</code>. Le variabili sono <code>x1</code> e <code>x2</code>, non negative. Frazioni come <code>7/2</code>.",
      errEditor: "Non riesco a leggere la riga",
      errObiettivo: "La prima riga deve iniziare con max o min.",
      errVuoto: "Serve almeno un vincolo.",
      sogg: "\\text{soggetto a}",
      livello: "retta di livello", valore: "valore",
      coord: "coordinate dei vertici", simplesso: "vertici visitati dal simplesso",
      regola: "regola", bland: "Bland (indice minimo)", massimo: "costo ridotto massimo",
      vertici: "Vertici di \\(F\\)", vertice: "vertice", nessunVertice: "\\(F = \\emptyset\\): nessun vertice.",
      legF: "\\(F \\subseteq \\R^2\\)", legVincoli: "vincoli", legLivello: "\\(\\boldsymbol c'\\boldsymbol x = k\\)",
      legGrad: "\\(\\nabla f\\)", legVertici: "vertici", legSimplesso: "simplesso", legOttimo: "ottimo",
      interseca: "La retta di livello interseca \\(F\\).", nonInterseca: "La retta di livello non interseca \\(F\\).",
      ottimoUnico: (x, z) => `<strong>Ottimo unico</strong> in \\(\\tilde{\\boldsymbol x} = ${x}\\), con \\(z(LP) = ${z}\\). Spostando la retta di livello nel verso del gradiente, l'ultimo punto di \\(F\\) che tocca è questo vertice.`,
      ottimoUnicoMin: (x, z) => `<strong>Ottimo unico</strong> in \\(\\tilde{\\boldsymbol x} = ${x}\\), con \\(z(LP) = ${z}\\). Il problema è di minimo: la retta di livello si sposta nel verso opposto al gradiente, e l'ultimo punto di \\(F\\) che tocca è questo vertice.`,
      multipliSeg: (a, b, z) => `<strong>Ottimi multipli</strong>: sono ottimi tutti i punti del segmento fra \\(${a}\\) e \\(${b}\\), con \\(z(LP) = ${z}\\). Il gradiente è perpendicolare a quel lato di \\(F\\): la retta di livello ottima lo contiene tutto.`,
      multipliRaggio: (a, d, z) => `<strong>Ottimi multipli</strong>: sono ottimi tutti i punti della semiretta che parte da \\(${a}\\) nella direzione \\(${d}\\), con \\(z(LP) = ${z}\\). La retta di livello ottima contiene un lato illimitato di \\(F\\).`,
      tuttoOttimo: "Il vettore dei costi è nullo: ogni punto di \\(F\\) è ottimo, con \\(z(LP) = 0\\).",
      illimitato: (d, cd) => `<strong>Problema illimitato</strong>: \\(F\\) è illimitata e lungo la direzione \\(\\boldsymbol d = ${d}\\) si ha \\(\\boldsymbol c'\\boldsymbol d = ${cd}\\). La retta di livello si sposta senza fine e interseca sempre \\(F\\).`,
      illimitatoMin: (d, cd) => `<strong>Problema illimitato</strong>: \\(F\\) è illimitata e lungo la direzione \\(\\boldsymbol d = ${d}\\) si ha \\(\\boldsymbol c'\\boldsymbol d = ${cd} < 0\\). Il problema è di minimo: la retta di livello scende senza fine e interseca sempre \\(F\\).`,
      inammissibile: (s) => `<strong>Problema inammissibile</strong>: \\(F = \\emptyset\\), nessun punto soddisfa tutti i vincoli. ${s}`,
      incompatibili: (l) => `Già ${l} sono incompatibili con \\(x_1, x_2 \\ge 0\\).`,
      incompatibile: (l) => `Già ${l} non ha punti con \\(x_1, x_2 \\ge 0\\).`,
      ilVincolo: "il vincolo", iVincoli: "i vincoli", e: "e",
      intero: (z, xs) => `P6 è un problema intero: qui si vede il suo rilassamento continuo. I punti interi di \\(F\\) sono in grigio; l'ottimo intero vale \\(${z}\\) e si raggiunge in ${xs}.`,
      interoGen: (z, xs) => `Il problema è intero: qui si vede il suo rilassamento continuo. I punti interi di \\(F\\) sono in grigio; l'ottimo intero vale \\(${z}\\) e si raggiunge in ${xs}.`,
      soloA: "Il percorso del simplesso si vede qui solo quando \\(\\boldsymbol b \\ge \\boldsymbol 0\\) (problemi di tipo A): si parte dall'origine. Negli altri casi serve la Fase 0 o il simplesso duale.",
      passi: (k) => `Il simplesso visita ${k} soluzioni di base, a partire dall'origine.`,
      passiDeg: (k, d) => `Il simplesso visita ${k} soluzioni di base, a partire dall'origine (con ${d} pivot degeneri, che non cambiano il punto).`,
      provaTesto: "Trascina il punto blu: la retta di livello si sposta. Portala nell'ultima posizione in cui tocca \\(F\\), nel verso del gradiente (per un problema di minimo, nel verso opposto). Poi rispondi.",
      provaTestoMin: "Il problema è di minimo. Trascina il punto blu e porta la retta di livello nell'ultima posizione in cui tocca \\(F\\), nel verso opposto al gradiente. Poi rispondi.",
      bOttimo: "L'ottimo è qui", bIllimitato: "È illimitato", bInammissibile: "È inammissibile", bSoluzione: "Mostra la soluzione",
      giusto: (x, z) => `Giusto. \\(z(LP) = ${z}\\), raggiunto in \\(${x}\\).`,
      giustoMultipli: (z) => `Giusto. \\(z(LP) = ${z}\\), e la retta ottima contiene un intero lato di \\(F\\): gli ottimi sono infiniti.`,
      presto: "Non ancora: la retta interseca \\(F\\) e si può spostare ancora nel verso giusto senza lasciarla.",
      presto0: "Non ancora: la retta non tocca \\(F\\). Avvicinala alla regione rossa.",
      oltre: "Troppo oltre: la retta non tocca più \\(F\\). Torna indietro.",
      noIllimitato: "No: \\(F\\) è limitata nel verso in cui migliora la funzione obiettivo. Cerca l'ultima retta che la tocca.",
      noInammissibile: "No: \\(F\\) non è vuota, è la regione rossa.",
      siIllimitato: "Giusto: la retta di livello si sposta senza fine nel verso giusto e interseca sempre \\(F\\).",
      siInammissibile: "Giusto: nessun punto soddisfa tutti i vincoli insieme.",
      noOttimoUnb: "No: per quanto sposti la retta, interseca ancora \\(F\\). Prova a trascinarla molto più in là.",
      noOttimoInf: "No: \\(F\\) è vuota, non c'è nessun punto da toccare.",
      noUnbInf: "No: prima ancora, \\(F\\) è vuota.",
      noInfUnb: "No: \\(F\\) non è vuota; guarda la regione rossa.",
      sbagliatoEsito: "No, ripensaci.",
      vincolo: (i) => `(${i})`,
      gruppi: { A: "Tipo A", B: "Tipo B", C: "Tipo C", D: "Tipo D" },
      domandaTit: "Domanda.",
      domanda: "Perché l'ottimo, se esiste, si trova sempre in un vertice di \\(F\\)? Che cosa deve succedere al gradiente perché gli ottimi siano infiniti?",
      ariaBoard: "Grafico interattivo del metodo grafico",
    },
    en: {
      titolo: "Graphical method", sottotitolo: "feasible region, gradient, level curves",
      esplora: "Explore", prova: "Try it",
      problema: "Problem", tuo: "your own", tipo: "Type",
      scrivi: "Write your own problem", disegna: "Draw",
      aiutoEditor: "One line for the objective function (<code>max</code> or <code>min</code>), one for each constraint with <code>&lt;=</code>, <code>&gt;=</code> or <code>=</code>. The variables are <code>x1</code> and <code>x2</code>, non-negative. Fractions like <code>7/2</code>.",
      errEditor: "Cannot read the line",
      errObiettivo: "The first line must start with max or min.",
      errVuoto: "At least one constraint is needed.",
      sogg: "\\text{subject to}",
      livello: "level line", valore: "value",
      coord: "vertex coordinates", simplesso: "vertices visited by the simplex",
      regola: "rule", bland: "Bland (smallest index)", massimo: "largest reduced cost",
      vertici: "Vertices of \\(F\\)", vertice: "vertex", nessunVertice: "\\(F = \\emptyset\\): no vertices.",
      legF: "\\(F \\subseteq \\R^2\\)", legVincoli: "constraints", legLivello: "\\(\\boldsymbol c'\\boldsymbol x = k\\)",
      legGrad: "\\(\\nabla f\\)", legVertici: "vertices", legSimplesso: "simplex", legOttimo: "optimum",
      interseca: "The level line intersects \\(F\\).", nonInterseca: "The level line does not intersect \\(F\\).",
      ottimoUnico: (x, z) => `<strong>Unique optimum</strong> at \\(\\tilde{\\boldsymbol x} = ${x}\\), with \\(z(LP) = ${z}\\). Moving the level line in the direction of the gradient, the last point of \\(F\\) it touches is this vertex.`,
      ottimoUnicoMin: (x, z) => `<strong>Unique optimum</strong> at \\(\\tilde{\\boldsymbol x} = ${x}\\), with \\(z(LP) = ${z}\\). The problem is a minimization: the level line moves opposite to the gradient, and the last point of \\(F\\) it touches is this vertex.`,
      multipliSeg: (a, b, z) => `<strong>Multiple optima</strong>: every point of the segment between \\(${a}\\) and \\(${b}\\) is optimal, with \\(z(LP) = ${z}\\). The gradient is perpendicular to that edge of \\(F\\): the optimal level line contains all of it.`,
      multipliRaggio: (a, d, z) => `<strong>Multiple optima</strong>: every point of the half-line starting at \\(${a}\\) in the direction \\(${d}\\) is optimal, with \\(z(LP) = ${z}\\). The optimal level line contains an unbounded edge of \\(F\\).`,
      tuttoOttimo: "The objective-function vector is zero: every point of \\(F\\) is optimal, with \\(z(LP) = 0\\).",
      illimitato: (d, cd) => `<strong>Unbounded problem</strong>: \\(F\\) is unbounded and along the direction \\(\\boldsymbol d = ${d}\\) we have \\(\\boldsymbol c'\\boldsymbol d = ${cd}\\). The level line moves forever and always intersects \\(F\\).`,
      illimitatoMin: (d, cd) => `<strong>Unbounded problem</strong>: \\(F\\) is unbounded and along the direction \\(\\boldsymbol d = ${d}\\) we have \\(\\boldsymbol c'\\boldsymbol d = ${cd} < 0\\). The problem is a minimization: the level line goes down forever and always intersects \\(F\\).`,
      inammissibile: (s) => `<strong>Infeasible problem</strong>: \\(F = \\emptyset\\), no point satisfies all the constraints. ${s}`,
      incompatibili: (l) => `Already ${l} are incompatible with \\(x_1, x_2 \\ge 0\\).`,
      incompatibile: (l) => `Already ${l} has no point with \\(x_1, x_2 \\ge 0\\).`,
      ilVincolo: "constraint", iVincoli: "constraints", e: "and",
      intero: (z, xs) => `P6 is an integer problem: here we see its continuous relaxation. The integer points of \\(F\\) are in grey; the integer optimum is \\(${z}\\), attained at ${xs}.`,
      interoGen: (z, xs) => `The problem is an integer one: here we see its continuous relaxation. The integer points of \\(F\\) are in grey; the integer optimum is \\(${z}\\), attained at ${xs}.`,
      soloA: "The path of the simplex is shown here only when \\(\\boldsymbol b \\ge \\boldsymbol 0\\) (Type A problems): it starts from the origin. Otherwise Phase 0 or the dual simplex is needed.",
      passi: (k) => `The simplex visits ${k} basic solutions, starting from the origin.`,
      passiDeg: (k, d) => `The simplex visits ${k} basic solutions, starting from the origin (with ${d} degenerate pivots, which do not change the point).`,
      provaTesto: "Drag the blue point: the level line moves. Bring it to the last position where it touches \\(F\\), in the direction of the gradient. Then answer.",
      provaTestoMin: "The problem is a minimization. Drag the blue point and bring the level line to the last position where it touches \\(F\\), opposite to the gradient. Then answer.",
      bOttimo: "The optimum is here", bIllimitato: "It is unbounded", bInammissibile: "It is infeasible", bSoluzione: "Show the solution",
      giusto: (x, z) => `Right. \\(z(LP) = ${z}\\), attained at \\(${x}\\).`,
      giustoMultipli: (z) => `Right. \\(z(LP) = ${z}\\), and the optimal line contains a whole edge of \\(F\\): there are infinitely many optima.`,
      presto: "Not yet: the line intersects \\(F\\) and can still move in the right direction without leaving it.",
      presto0: "Not yet: the line does not touch \\(F\\). Move it towards the red region.",
      oltre: "Too far: the line no longer touches \\(F\\). Go back.",
      noIllimitato: "No: \\(F\\) is bounded in the direction where the objective function improves. Look for the last line that touches it.",
      noInammissibile: "No: \\(F\\) is not empty, it is the red region.",
      siIllimitato: "Right: the level line moves forever in the right direction and always intersects \\(F\\).",
      siInammissibile: "Right: no point satisfies all the constraints together.",
      noOttimoUnb: "No: however far you move the line, it still intersects \\(F\\). Try dragging it much further.",
      noOttimoInf: "No: \\(F\\) is empty, there is no point to touch.",
      noUnbInf: "No: even before that, \\(F\\) is empty.",
      noInfUnb: "No: \\(F\\) is not empty; look at the red region.",
      sbagliatoEsito: "No, think again.",
      vincolo: (i) => `(${i})`,
      gruppi: { A: "Type A", B: "Type B", C: "Type C", D: "Type D" },
      domandaTit: "Question.",
      domanda: "Why is the optimum, when it exists, always attained at a vertex of \\(F\\)? What must happen to the gradient for the optima to be infinitely many?",
      ariaBoard: "Interactive plot of the graphical method",
    },
  };
  const T = TESTI[LINGUA];
  const VIRGOLA = LINGUA === "it";

  // ------------------------------------------------------------------ frazioni esatte
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  class Frac {
    constructor(n, d = 1n) {
      n = BigInt(n); d = BigInt(d);
      if (d === 0n) throw new Error("divisione per zero");
      if (d < 0n) { n = -n; d = -d; }
      const g = gcd(n, d) || 1n;
      this.n = n / g; this.d = d / g;
    }
    static of(x) {
      if (x instanceof Frac) return x;
      if (typeof x === "number") return new Frac(BigInt(x));
      const f = Frac.parse(x);
      if (!f) throw new Error("numero non valido: " + x);
      return f;
    }
    /** "3", "-7/2", "0.25", "1,5" -> Frac, oppure null */
    static parse(s) {
      s = String(s).trim().replace(/\s+/g, "").replace(/−/g, "-").replace(",", ".");
      let m = s.match(/^([+-]?\d+)\/(\d+)$/);
      if (m) return BigInt(m[2]) === 0n ? null : new Frac(BigInt(m[1]), BigInt(m[2]));
      m = s.match(/^([+-]?)(\d*)(?:\.(\d*))?$/);
      if (!m || (m[2] === "" && !m[3])) return null;
      const dec = m[3] || "";
      return new Frac(BigInt((m[1] === "-" ? "-" : "") + (m[2] || "0") + dec), 10n ** BigInt(dec.length));
    }
    add(o) { return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { return new Frac(this.n * o.d, this.d * o.n); }
    neg() { return new Frac(-this.n, this.d); }
    sign() { return this.n > 0n ? 1 : this.n < 0n ? -1 : 0; }
    isZero() { return this.n === 0n; }
    cmp(o) { const a = this.n * o.d, b = o.n * this.d; return a < b ? -1 : a > b ? 1 : 0; }
    eq(o) { return this.n === o.n && this.d === o.d; }
    num() { return Number(this.n) / Number(this.d); }
    toString() { return this.d === 1n ? String(this.n) : this.n + "/" + this.d; }
    tex() {
      if (this.d === 1n) return String(this.n);
      const s = this.n < 0n ? "-" : "";
      return `${s}\\tfrac{${this.n < 0n ? -this.n : this.n}}{${this.d}}`;
    }
  }
  const ZERO = new Frac(0n), UNO = new Frac(1n);
  const dot = (a, x) => a[0].mul(x[0]).add(a[1].mul(x[1]));
  const punto = (x) => `\\left(${x[0].tex()},\\, ${x[1].tex()}\\right)`;
  const puntoTxt = (x) => `(${x[0]}, ${x[1]})`;
  const numTxt = (x, cifre = 2) => {
    let s = (Math.round(x * 10 ** cifre) / 10 ** cifre).toFixed(cifre).replace(/\.?0+$/, "");
    if (s === "-0") s = "0";
    return VIRGOLA ? s.replace(".", "{,}") : s;
  };

  // ------------------------------------------------------------------ utilità DOM
  const css = (el, v) => getComputedStyle(el).getPropertyValue(v).trim();
  // ogni formula \(...\) va in uno span «arithmatex»: è l'unica classe che il MathJax della collana elabora
  const mj = (html) => String(html).replace(/\\\((.+?)\\\)/gs, (m) => `<span class="arithmatex">${m}</span>`);
  const h = (tag, attrs = {}, html = "") => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    e.innerHTML = mj(html);
    return e;
  };
  const typeset = (el) => {
    if (window.componiFormule) return window.componiFormule([el]);
    return new Promise((ok) => setTimeout(() => ok(typeset(el)), 150));
  };

  // ------------------------------------------------------------------ il problema
  // { nome, senso: "max"|"min", c: [Frac, Frac], vincoli: [{ a: [Frac, Frac], rel, b: Frac }], intero, tipo }
  function daCatalogo(d) {
    return {
      nome: d.nome, senso: d.senso, tipo: d.tipo, intero: !!d.intero,
      c: d.c.map(Frac.of),
      vincoli: d.A.map((r, i) => ({ a: r.map(Frac.of), rel: d.rel[i], b: Frac.of(d.b[i]) })),
    };
  }

  const TERMINE = /([+-]?)(\d+(?:[.,]\d+)?(?:\/\d+)?)?\*?x_?\{?([12])\}?/g;
  function lineare(s) {
    s = s.replace(/\s+/g, "").replace(/[·⋅]/g, "*").replace(/−/g, "-");
    if (s.replace(TERMINE, "") !== "") return null;
    const a = [ZERO, ZERO];
    for (const m of s.matchAll(TERMINE)) {
      let v = m[2] ? Frac.parse(m[2]) : UNO;
      if (!v) return null;
      if (m[1] === "-") v = v.neg();
      a[+m[3] - 1] = a[+m[3] - 1].add(v);
    }
    return a;
  }
  function leggiTesto(txt) {
    const righe = txt.split(/[\n;]+/).map((r) => r.trim()).filter((r) => r);
    const m0 = righe.length ? righe[0].match(/^(max|min)\s*(?:z\s*=)?\s*(.*)$/i) : null;
    if (!m0) throw new Error(T.errObiettivo);
    const c = lineare(m0[2]);
    if (!c) throw new Error(`${T.errEditor}: «${righe[0]}»`);
    const vincoli = [];
    for (const r of righe.slice(1)) {
      if (/x_?1\s*,\s*x_?2/.test(r)) continue;                 // condizioni di segno: sempre >= 0
      const m = r.replace(/≤/g, "<=").replace(/≥/g, ">=").match(/^(.*?)(<=|>=|=<|=>|=|<|>)(.*)$/);
      const a = m ? lineare(m[1]) : null, b = m ? Frac.parse(m[3]) : null;
      if (!a || !b) throw new Error(`${T.errEditor}: «${r}»`);
      const rel = { "<=": "<=", "=<": "<=", "<": "<=", ">=": ">=", "=>": ">=", ">": ">=", "=": "=" }[m[2]];
      vincoli.push({ a, rel, b });
    }
    if (!vincoli.length) throw new Error(T.errVuoto);
    return { nome: null, senso: m0[1].toLowerCase(), c, vincoli, intero: false, tipo: null };
  }
  const relTxt = { "<=": "<=", ">=": ">=", "=": "=" };
  function linTxt(a) {
    let s = "";
    a.forEach((v, j) => {
      if (v.isZero()) return;
      const abs = v.sign() < 0 ? v.neg() : v;
      s += (s ? (v.sign() < 0 ? " - " : " + ") : (v.sign() < 0 ? "-" : "")) + (abs.eq(UNO) ? "" : abs.toString() + " ") + `x${j + 1}`;
    });
    return s || "0";
  }
  const testoDa = (p) => [`${p.senso} ${linTxt(p.c)}`, ...p.vincoli.map((v) => `${linTxt(v.a)} ${relTxt[v.rel]} ${v.b}`)].join("\n");

  function linTex(a) {
    let s = "";
    a.forEach((v, j) => {
      if (v.isZero()) return;
      const abs = v.sign() < 0 ? v.neg() : v;
      s += (s ? (v.sign() < 0 ? " - " : " + ") : (v.sign() < 0 ? "-" : "")) + (abs.eq(UNO) ? "" : abs.tex() + "\\,") + `x_${j + 1}`;
    });
    return s || "0";
  }
  const relTex = { "<=": "\\le", ">=": "\\ge", "=": "=" };
  function problemaTex(p) {
    const righe = p.vincoli.map((v, i) => `${i === 0 ? T.sogg : ""} & ${linTex(v.a)} ${relTex[v.rel]} ${v.b.tex()}`);
    const segni = p.intero ? "x_1,\\, x_2 \\in \\Z_{\\ge 0}" : "x_1,\\, x_2 \\ge 0";
    return `\\begin{array}{rl} \\${p.senso} & ${linTex(p.c)} \\\\ ${righe.join(" \\\\ ")} \\\\ & ${segni} \\end{array}`;
  }

  // ------------------------------------------------------------------ analisi esatta (n = 2)
  // forma di massimo con vincoli <=:  max cm'x, righe r.a x <= r.b, x >= 0
  function analizza(p) {
    const segno = p.senso === "max" ? UNO : UNO.neg();
    const cm = p.c.map((v) => v.mul(segno));
    const righe = [];
    p.vincoli.forEach((v, i) => {
      if (v.rel !== ">=") righe.push({ a: v.a, b: v.b, i });
      if (v.rel !== "<=") righe.push({ a: v.a.map((t) => t.neg()), b: v.b.neg(), i });
    });
    const tutte = [...righe, { a: [UNO.neg(), ZERO], b: ZERO, i: -1 }, { a: [ZERO, UNO.neg()], b: ZERO, i: -2 }];
    const ammissibile = (x, R = tutte) => R.every((r) => dot(r.a, x).cmp(r.b) <= 0);
    const verticiDi = (R) => {
      const V = new Map();
      for (let s = 0; s < R.length; s++) for (let t = s + 1; t < R.length; t++) {
        const [a, b] = [R[s], R[t]];
        const det = a.a[0].mul(b.a[1]).sub(a.a[1].mul(b.a[0]));
        if (det.isZero()) continue;
        const x = [a.b.mul(b.a[1]).sub(a.a[1].mul(b.b)).div(det), a.a[0].mul(b.b).sub(a.b.mul(b.a[0])).div(det)];
        if (ammissibile(x, R)) V.set(x.join(","), x);
      }
      return [...V.values()];
    };
    const V = verticiDi(tutte);
    // raggi estremi del cono di recessione: d = (t, 1 - t), t in [0, 1]
    const ts = [ZERO, UNO];
    for (const r of righe) {
      const den = r.a[0].sub(r.a[1]);
      if (!den.isZero()) { const t = r.a[1].neg().div(den); if (t.sign() > 0 && t.cmp(UNO) < 0) ts.push(t); }
    }
    const raggi = [];
    for (const t of ts) {
      const d = [t, UNO.sub(t)];
      if (righe.every((r) => dot(r.a, d).sign() <= 0) && !raggi.some((q) => q[0].eq(d[0]))) raggi.push(d);
    }
    const intero = (d) => {                                     // multiplo intero primitivo
      const l = d[0].d * d[1].d / gcd(d[0].d, d[1].d);
      const n = d.map((v) => v.n * (l / v.d));
      const g = gcd(n[0], n[1]) || 1n;
      return n.map((v) => new Frac(v / g));
    };
    const A = { p, cm, segno, righe, V, raggi: V.length ? raggi : [], ammissibile };
    const zOrig = (v) => v.mul(segno);
    if (!V.length) {
      A.esito = "inf";
      // il piu' piccolo sottoinsieme di vincoli gia' incompatibile con x >= 0
      const m = p.vincoli.length;
      const assi = tutte.slice(-2);
      for (let k = 1; k <= m && !A.nucleo; k++) {
        const scegli = (da, pref) => {
          if (A.nucleo) return;
          if (pref.length === k) {
            const R = righe.filter((r) => pref.includes(r.i)).concat(assi);
            if (!verticiDi(R).length) A.nucleo = pref.slice();
            return;
          }
          for (let i = da; i < m; i++) scegli(i + 1, [...pref, i]);
        };
        scegli(0, []);
      }
      return A;
    }
    const migliora = raggi.filter((d) => dot(cm, d).sign() > 0);
    if (migliora.length) {
      A.esito = "unb";
      A.raggio = intero(migliora[0]);
      A.base = V.reduce((b, v) => (dot(cm, v).cmp(dot(cm, b)) > 0 ? v : b), V[0]);
      return A;
    }
    A.esito = "opt";
    A.z = V.reduce((z, v) => { const t = dot(cm, v); return t.cmp(z) > 0 ? t : z; }, dot(cm, V[0]));
    A.ottimi = V.filter((v) => dot(cm, v).eq(A.z));
    A.raggiOttimi = raggi.filter((d) => dot(cm, d).isZero()).map(intero);
    A.multipli = A.ottimi.length > 1 || A.raggiOttimi.length > 0;
    A.zero = cm.every((v) => v.isZero());
    A.zOrig = zOrig(A.z);
    if (p.intero) {
      let best = null, arg = [];
      const X = Math.floor(Math.max(...V.map((v) => v[0].num()))), Y = Math.floor(Math.max(...V.map((v) => v[1].num())));
      A.interi = [];
      for (let i = 0; i <= X; i++) for (let j = 0; j <= Y; j++) {
        const q = [new Frac(i), new Frac(j)];
        if (!ammissibile(q)) continue;
        A.interi.push(q);
        const t = dot(cm, q);
        if (!best || t.cmp(best) > 0) { best = t; arg = [q]; } else if (t.eq(best)) arg.push(q);
      }
      A.zIntero = zOrig(best); A.xIntero = arg;
    }
    return A;
  }

  // simplesso primale sui dizionari, solo con b >= 0: restituisce i punti (x1, x2) visitati
  function percorsoSimplesso(A, regola) {
    const R = A.righe, m = R.length;
    if (R.some((r) => r.b.sign() < 0)) return null;
    const N = 2 + m;
    const Tab = R.map((r, i) => [...r.a, ...R.map((_, k) => (k === i ? UNO : ZERO)), r.b]);
    const c = [...A.cm, ...R.map(() => ZERO)];
    const base = R.map((_, i) => 2 + i);
    const punto = () => { const x = [ZERO, ZERO]; base.forEach((j, i) => { if (j < 2) x[j] = Tab[i][N]; }); return x; };
    const P = [punto()];
    let degeneri = 0, raggio = null;
    for (let it = 0; it < 60; it++) {
      const rid = [];
      for (let j = 0; j < N; j++) {
        let s = c[j];
        base.forEach((bj, i) => { s = s.sub(c[bj].mul(Tab[i][j])); });
        rid.push(s);
      }
      let q = -1;
      for (let j = 0; j < N; j++) {
        if (base.includes(j) || rid[j].sign() <= 0) continue;
        if (q < 0 || (regola === "massimo" && rid[j].cmp(rid[q]) > 0)) q = j;
        if (regola !== "massimo") break;
      }
      if (q < 0) break;
      let r = -1, best = null;
      for (let i = 0; i < m; i++) {
        if (Tab[i][q].sign() <= 0) continue;
        const t = Tab[i][N].div(Tab[i][q]);
        if (r < 0 || t.cmp(best) < 0 || (t.eq(best) && base[i] < base[r])) { r = i; best = t; }
      }
      if (r < 0) { raggio = true; break; }
      const pv = Tab[r][q];
      Tab[r] = Tab[r].map((v) => v.div(pv));
      for (let i = 0; i < m; i++) {
        if (i === r || Tab[i][q].isZero()) continue;
        const f = Tab[i][q];
        Tab[i] = Tab[i].map((v, j) => v.sub(f.mul(Tab[r][j])));
      }
      base[r] = q;
      const x = punto(), ult = P[P.length - 1];
      if (x[0].eq(ult[0]) && x[1].eq(ult[1])) degeneri++; else P.push(x);
    }
    return { punti: P, degeneri, raggio };
  }

  // ------------------------------------------------------------------ geometria (virgola mobile, solo per disegnare)
  function taglia(poli, a, b) {                     // Sutherland-Hodgman con a.x <= b
    const out = [], f = (q) => a[0] * q[0] + a[1] * q[1] - b, eps = 1e-12;
    for (let i = 0; i < poli.length; i++) {
      const P = poli[i], Q = poli[(i + 1) % poli.length], fp = f(P), fq = f(Q);
      if (fp <= eps) out.push(P);
      if ((fp < -eps && fq > eps) || (fp > eps && fq < -eps)) {
        const t = fp / (fp - fq);
        out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
      }
    }
    return out;
  }

  // ------------------------------------------------------------------ motore
  const CAT = () => (typeof CATALOGO !== "undefined" ? CATALOGO : window.CATALOGO) || {};
  const DUE = () => Object.values(CAT()).filter((d) => d.n === 2);

  function monta(el) {
    if (el.dataset.montato) return;
    el.dataset.montato = "1";
    el.classList.add("gi");
    el.innerHTML = "";

    let prob = null, An = null, modo = "esplora", board = null, k = null, kFrac = null, testi = [];
    let mostraCoord = true, mostraSimplesso = false, regola = "bland", G = null, geo = null, risposta = null, percorso = null;

    // --- intestazione
    const testa = h("div", { class: "gi-testa" }, `<span class="gi-titolo">${T.titolo}<small>${T.sottotitolo}</small></span>`);
    const tabs = h("div", { class: "gi-tabs" });
    const tEsplora = h("button", { class: "gi-tab", "aria-selected": "true" }, T.esplora);
    const tProva = h("button", { class: "gi-tab", "aria-selected": "false" }, T.prova);
    tabs.append(tEsplora, tProva);
    testa.append(tabs);
    el.append(testa);

    const corpo = h("div", { class: "gi-corpo" });
    const sx = h("div"), dx = h("div");
    corpo.append(sx, dx);
    el.append(corpo);

    const formula = h("div", { class: "gi-formula gpl-formula" });
    const bid = "gpl-" + Math.random().toString(36).slice(2);
    const boardEl = h("div", { class: "gi-board jxgbox gpl-board", id: bid, "aria-label": T.ariaBoard });
    const livello = h("div", { class: "gpl-livello" });
    const legenda = h("div", { class: "gi-legenda" });
    sx.append(formula, boardEl, livello, legenda);

    // --- scelta del problema
    const scelta = h("div", { class: "gpl-scelta" });
    const sel = h("select", { "aria-label": T.problema });
    const gruppi = {};
    for (const d of DUE()) {
      if (!gruppi[d.tipo]) { gruppi[d.tipo] = h("optgroup", { label: T.gruppi[d.tipo] || d.tipo }); sel.append(gruppi[d.tipo]); }
      gruppi[d.tipo].append(new Option(d.nome, d.nome));
    }
    const optTuo = new Option(T.tuo, "__tuo");
    sel.append(optTuo);
    scelta.append(h("label", {}, `<strong>${T.problema}</strong>`), sel);
    dx.append(scelta);

    const editor = h("details", { class: "gpl-editor" }, `<summary>${T.scrivi}</summary>`);
    const area = h("textarea", { rows: "5", spellcheck: "false", "aria-label": T.scrivi });
    const bDisegna = h("button", { class: "gi-btn primario" }, T.disegna);
    const errore = h("div", { class: "gpl-errore", hidden: "" });
    editor.append(h("small", {}, T.aiutoEditor), area, bDisegna, errore);
    dx.append(editor);

    // --- cursore della retta di livello
    const ctrl = h("div", { class: "gi-ctrl", style: "--c: var(--gpl-blu)" });
    const riga = h("div", { class: "gi-riga" });
    const valK = h("span", { class: "gi-val" });
    riga.append(h("span", { class: "gi-nome", style: "color: var(--gpl-blu)" }, "\\(k\\)"), valK);
    const inK = h("input", { type: "range", min: "0", max: "1000", step: "1", value: "500", "aria-label": T.livello });
    ctrl.append(riga, inK, h("small", {}, `${T.livello} \\(\\boldsymbol c'\\boldsymbol x = k\\)`));
    dx.append(ctrl);

    // --- opzioni
    const opzioni = h("div", { class: "gpl-opzioni" });
    const chk = (testo, val, f) => {
      const l = h("label", {}), c = h("input", { type: "checkbox" });
      c.checked = val; c.onchange = () => f(c.checked);
      l.append(c, h("span", {}, " " + testo));
      return l;
    };
    const selRegola = h("select", { "aria-label": T.regola });
    selRegola.append(new Option(T.bland, "bland"), new Option(T.massimo, "massimo"));
    selRegola.onchange = () => { regola = selRegola.value; ridisegna(); };
    const rigaRegola = h("div", { class: "gpl-regola" }, `${T.regola}: `);
    rigaRegola.append(selRegola);
    opzioni.append(chk(T.coord, true, (v) => { mostraCoord = v; ridisegna(); }),
      chk(T.simplesso, false, (v) => { mostraSimplesso = v; rigaRegola.hidden = !v; ridisegna(); }), rigaRegola);
    rigaRegola.hidden = true;
    dx.append(opzioni);

    const letture = h("div", { class: "gi-letture" });
    const tabella = h("div", { class: "gpl-tabella" });
    dx.append(letture, tabella);

    const pEsplora = h("div", { class: "gi-domanda" }, `<strong>${T.domandaTit}</strong> ${T.domanda}`);
    dx.append(pEsplora);

    // --- prova tu
    const pProva = h("div", { class: "gpl-prova", hidden: "" });
    const provaTesto = h("p");
    const bOtt = h("button", { class: "gi-btn primario" }, T.bOttimo);
    const bUnb = h("button", { class: "gi-btn" }, T.bIllimitato);
    const bInf = h("button", { class: "gi-btn" }, T.bInammissibile);
    const bSol = h("button", { class: "gi-btn" }, T.bSoluzione);
    const esito = h("div", { class: "gpl-esito", hidden: "" });
    pProva.append(provaTesto, bOtt, bUnb, bInf, bSol, esito);
    dx.append(pProva);

    const colore = (k2) => css(el, "--gpl-" + k2);

    // ---------------------------------------------------------------- caricamento
    function carica(p) {
      prob = p; An = analizza(p); risposta = null;
      area.value = testoDa(p);
      errore.hidden = true;
      k = null; kFrac = null;
      ridisegna();
    }

    // ---------------------------------------------------------------- disegno
    function vista() {
      const pts = An.V.map((v) => [v[0].num(), v[1].num()]);
      if (An.esito === "inf") {                       // intersezioni delle rette dei vincoli e degli assi
        const R = An.righe;
        for (const r of R) {
          if (!r.a[0].isZero()) pts.push([r.b.div(r.a[0]).num(), 0]);
          if (!r.a[1].isZero()) pts.push([0, r.b.div(r.a[1]).num()]);
        }
        for (let s = 0; s < R.length; s++) for (let t = s + 1; t < R.length; t++) {
          const a = R[s], b = R[t], det = a.a[0].mul(b.a[1]).sub(a.a[1].mul(b.a[0]));
          if (det.isZero()) continue;
          pts.push([a.b.mul(b.a[1]).sub(a.a[1].mul(b.b)).div(det).num(), a.a[0].mul(b.b).sub(a.b.mul(b.a[0])).div(det).num()]);
        }
      }
      const pos = pts.filter((q) => q[0] > -1e-9 && q[1] > -1e-9);
      let X = Math.max(1, ...pos.map((q) => q[0])), Y = Math.max(1, ...pos.map((q) => q[1]));
      const ill = An.esito === "unb" || (An.raggi && An.raggi.length);
      if (ill) { X = X * 1.7 + 1; Y = Y * 1.7 + 1; }
      const L = Math.max(X, Y);
      X = Math.max(X, L / 2.2); Y = Math.max(Y, L / 2.2);    // niente strisce troppo schiacciate
      return [-0.14 * L, Y * 1.18, X * 1.18, -0.14 * L];
    }

    function ridisegna() {
      if (!prob) return;
      if (board) JXG.JSXGraph.freeBoard(board);
      testi = [];
      const bb = vista();
      const muted = colore("muted"), griglia = colore("griglia");
      board = JXG.JSXGraph.initBoard(bid, {
        boundingbox: bb, keepAspectRatio: true, axis: true, showCopyright: false, showNavigation: false,
        pan: { enabled: true, needShift: false, needTwoFingers: true }, zoom: { wheel: true, needShift: true },
        defaultAxes: {
          x: { strokeColor: muted, strokeWidth: 1.5, highlight: false, ticks: { visible: false } },
          y: { strokeColor: muted, strokeWidth: 1.5, highlight: false, ticks: { visible: false } },
        },
      });
      const [x0, y1, x1, y0] = board.getBoundingBox();
      const ux = (x1 - x0) / board.canvasWidth, uy = (y1 - y0) / board.canvasHeight;   // unita' per pixel
      const fisso = { fixed: true, highlight: false, showInfobox: false, withLabel: false };
      const testo = (x, y, html, classe, ax = "middle", ay = "middle") => {
        const t = board.create("text", [x, y, mj(html)], Object.assign({ display: "html", parse: false, anchorX: ax, anchorY: ay, cssClass: "gpl-t " + classe, highlightCssClass: "gpl-t " + classe }, fisso));
        testi.push(t); return t;
      };
      const R = An.righe, rosso = colore("rosso"), blu = colore("blu"), viola = colore("viola"), nero = colore("nero");

      // regione ammissibile, tagliata sulla finestra
      let poli = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
      for (const r of [...R, { a: [UNO.neg(), ZERO], b: ZERO }, { a: [ZERO, UNO.neg()], b: ZERO }]) poli = taglia(poli, r.a.map((v) => v.num()), r.b.num());
      geo = { poli, centro: null };
      const sulBordo = (q) => Math.abs(q[0] - x0) < 1e-9 || Math.abs(q[0] - x1) < 1e-9 || Math.abs(q[1] - y0) < 1e-9 || Math.abs(q[1] - y1) < 1e-9;

      // griglia sulle coordinate dei vertici (grid = major delle note) e tick in frazioni
      const xs = new Map(), ys = new Map();
      for (const v of An.V) { xs.set(v[0].toString(), v[0]); ys.set(v[1].toString(), v[1]); }
      for (const v of xs.values()) {
        board.create("segment", [[v.num(), y0], [v.num(), y1]], Object.assign({ strokeColor: griglia, strokeWidth: 1, dash: 2 }, fisso));
        testo(v.num(), -6 * uy, `\\(${v.tex()}\\)`, "gpl-tick", "middle", "top");
      }
      for (const v of ys.values()) {
        board.create("segment", [[x0, v.num()], [x1, v.num()]], Object.assign({ strokeColor: griglia, strokeWidth: 1, dash: 2 }, fisso));
        if (!v.isZero()) testo(-7 * ux, v.num(), `\\(${v.tex()}\\)`, "gpl-tick", "right", "middle");
      }
      testo(x1 - 8 * ux, 14 * uy, "\\(x_1\\)", "gpl-asse", "right", "bottom");
      testo(12 * ux, y1 - 8 * uy, "\\(x_2\\)", "gpl-asse", "left", "top");

      // rette dei vincoli con etichetta
      p0: for (const [i, v] of prob.vincoli.entries()) {
        const a = v.a.map((t) => t.num()), b = v.b.num();
        if (Math.abs(a[0]) < 1e-15 && Math.abs(a[1]) < 1e-15) continue p0;
        board.create("line", [-b, a[0], a[1]], Object.assign({ strokeColor: rosso, strokeWidth: 1.5, strokeOpacity: 0.55, dash: v.rel === "=" ? 0 : 1 }, fisso));
        // punto della retta dentro la finestra, verso un estremo, per l'etichetta
        const seg = taglia(taglia(taglia(taglia([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], [1, 0], x1 - 30 * ux), [-1, 0], -(x0 + 30 * ux)), [0, 1], y1 - 20 * uy), [0, -1], -(y0 + 20 * uy));
        const sulla = [];
        for (let s = 0; s < seg.length; s++) {
          const P = seg[s], Q = seg[(s + 1) % seg.length];
          const fp = a[0] * P[0] + a[1] * P[1] - b, fq = a[0] * Q[0] + a[1] * Q[1] - b;
          if (fp === 0) sulla.push(P);
          else if (fp * fq < 0) { const t = fp / (fp - fq); sulla.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
        }
        if (sulla.length >= 2) {
          sulla.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
          const f = 0.72 - 0.1 * (i % 3);
          const P = [sulla[0][0] + f * (sulla[1][0] - sulla[0][0]), sulla[0][1] + f * (sulla[1][1] - sulla[0][1])];
          const nrm = Math.hypot(a[0] / ux, a[1] / uy) || 1;
          const off = 14, dxp = (a[0] / ux) / nrm * off, dyp = (a[1] / uy) / nrm * off;   // dalla parte non ammissibile
          testo(P[0] + dxp * ux, P[1] + dyp * uy, `\\(${linTex(v.a)} = ${v.b.tex()}\\)`, "gpl-vincolo");
        }
      }

      if (poli.length >= 3) {
        board.create("polygon", poli, { fillColor: rosso, fillOpacity: 0.2, borders: { visible: false }, vertices: { visible: false }, fixed: true, highlight: false, hasInnerPoints: false });
        for (let s = 0; s < poli.length; s++) {
          const P = poli[s], Q = poli[(s + 1) % poli.length];
          const sulloStessoBordo = sulBordo(P) && sulBordo(Q) && (Math.abs(P[0] - Q[0]) < 1e-9 || Math.abs(P[1] - Q[1]) < 1e-9);
          if (!sulloStessoBordo) board.create("segment", [P, Q], Object.assign({ strokeColor: rosso, strokeWidth: 4.5 }, fisso));
        }
        const cx = poli.reduce((s, q) => s + q[0], 0) / poli.length, cy = poli.reduce((s, q) => s + q[1], 0) / poli.length;
        geo.centro = [cx, cy];
        // etichetta F: fra il centro e il vertice del poligono piu' vicino all'origine
        const q0 = poli.reduce((m, q) => (Math.hypot(q[0], q[1]) < Math.hypot(m[0], m[1]) ? q : m), poli[0]);
        testo(0.55 * cx + 0.45 * q0[0], 0.55 * cy + 0.45 * q0[1], "\\(F \\subseteq \\R^2\\)", "gpl-F");
      } else {
        geo.centro = [(x0 + x1) / 2, (y0 + y1) / 2];
      }

      // punti interi (problemi interi)
      if (An.interi) for (const q of An.interi) board.create("point", [q[0].num(), q[1].num()], Object.assign({ size: 1.8, fillColor: muted, strokeColor: muted, name: "" }, fisso));

      // gradiente e retta di livello
      const c = prob.c.map((v) => v.num()), nc = Math.hypot(c[0], c[1]);
      const C = geo.centro;
      const lati = Math.min(x1 - x0, y1 - y0);
      const kVal = (q) => c[0] * q[0] + c[1] * q[1];
      const angoli = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(kVal);
      const kmin = Math.min(...angoli), kmax = Math.max(...angoli);
      geo.kmin = kmin; geo.kmax = kmax;
      if (nc > 0) {
        const u = [c[0] / nc, c[1] / nc], L = 0.2 * lati;
        board.create("line", [C, [C[0] + u[0], C[1] + u[1]]], Object.assign({ strokeColor: blu, strokeWidth: 1, strokeOpacity: 0.35, dash: 1 }, fisso));
        board.create("arrow", [C, [C[0] + L * u[0], C[1] + L * u[1]]], Object.assign({ strokeColor: blu, strokeWidth: 3, lastArrow: { type: 2, size: 5 } }, fisso));
        testo(C[0] + 1.12 * L * u[0] + 10 * ux, C[1] + 1.12 * L * u[1] + 10 * uy, "\\(\\nabla f\\)", "gpl-blu");
        if (k === null) { k = kVal(C); kFrac = null; }
        const kNow = () => k;
        board.create("line", [() => -kNow(), c[0], c[1]], Object.assign({ strokeColor: blu, strokeWidth: 3, dash: 2 }, fisso));
        const guida = board.create("line", [C, [C[0] + u[0], C[1] + u[1]]], { visible: false, fixed: true });
        const s0 = (k - kVal(C)) / nc;
        G = board.create("glider", [C[0] + s0 * u[0], C[1] + s0 * u[1], guida], { name: "", size: 6, fillColor: blu, strokeColor: "#ffffff", strokeWidth: 2, showInfobox: false, highlightFillColor: blu });
        G.on("drag", () => impostaK(kVal([G.X(), G.Y()]), true));
      } else {
        G = null;
      }
      ctrl.hidden = nc === 0;

      // vertici, ottimo, illimitatezza
      const sol = () => modo === "esplora" || risposta === "mostra";
      const etichetta = (v, cls) => {
        if (!mostraCoord) return;
        testo(v[0].num() + 7 * ux, v[1].num() + 7 * uy, `\\(${punto(v)}\\)`, cls, "left", "bottom");
      };
      if (An.esito === "opt" && An.multipli && !An.zero) {
        const O = An.ottimi;
        if (O.length > 1) board.create("segment", [[O[0][0].num(), O[0][1].num()], [O[1][0].num(), O[1][1].num()]], Object.assign({ strokeColor: blu, strokeWidth: 7, visible: sol }, fisso));
        if (An.raggiOttimi.length) {
          const d = An.raggiOttimi[0].map((t) => t.num()), nd = Math.hypot(d[0], d[1]), P = O[0].map((t) => t.num());
          board.create("arrow", [P, [P[0] + 3 * lati * d[0] / nd, P[1] + 3 * lati * d[1] / nd]], Object.assign({ strokeColor: blu, strokeWidth: 7, visible: sol }, fisso));
        }
      }
      if (An.esito === "unb") {
        const d = An.raggio.map((t) => t.num()), nd = Math.hypot(d[0], d[1]), P = An.base.map((t) => t.num()), L = 0.35 * lati;
        board.create("arrow", [P, [P[0] + L * d[0] / nd, P[1] + L * d[1] / nd]], Object.assign({ strokeColor: blu, strokeWidth: 4, lastArrow: { type: 2, size: 5 }, visible: sol }, fisso));
        const t = testo(P[0] + 1.1 * L * d[0] / nd + 6 * ux, P[1] + 1.1 * L * d[1] / nd, `\\(\\boldsymbol d = ${punto(An.raggio)}\\)`, "gpl-blu", "left", "middle");
        t.setAttribute({ visible: sol });
      }
      const ottimo = (v) => An.esito === "opt" && !An.zero && An.ottimi.some((o) => o[0].eq(v[0]) && o[1].eq(v[1]));
      for (const v of An.V) {
        board.create("point", [v[0].num(), v[1].num()], Object.assign({ name: "", size: 3.5, fillColor: nero, strokeColor: nero }, fisso));
        if (ottimo(v)) board.create("point", [v[0].num(), v[1].num()], Object.assign({ name: "", size: 5.5, fillColor: blu, strokeColor: blu, visible: sol }, fisso));
        etichetta(v, ottimo(v) ? "gpl-nero gpl-forte" : "gpl-nero");
      }

      // percorso del simplesso
      percorso = null;
      if (mostraSimplesso && An.esito !== "inf") {
        percorso = percorsoSimplesso(An, regola);
        if (percorso) {
          const P = percorso.punti.map((q) => [q[0].num(), q[1].num()]);
          for (let s = 0; s + 1 < P.length; s++) board.create("arrow", [P[s], P[s + 1]], Object.assign({ strokeColor: viola, strokeWidth: 3, lastArrow: { type: 2, size: 4 } }, fisso));
          P.forEach((q, s) => {
            board.create("point", q, Object.assign({ name: "", size: 4.5, fillColor: viola, strokeColor: viola }, fisso));
            testo(q[0] - 8 * ux, q[1] - 8 * uy, `\\(${s}\\)`, "gpl-viola gpl-forte", "right", "top");
          });
        }
      }

      scriviLegenda();
      scriviTesti();
      impostaK(k, false);
      typeset(boardEl).then(() => {
        testi.forEach((t) => { t.needsSizeUpdate = true; t.updateSize(); });
        if (board) board.fullUpdate();
      });
    }

    // ---------------------------------------------------------------- retta di livello
    function impostaK(val, daTrascinamento) {
      if (val === null || !prob || !G) { aggiornaLivello(); return; }
      // aggancio ai valori esatti nei vertici (e all'ottimo)
      const c = prob.c.map((v) => v.num()), nc = Math.hypot(c[0], c[1]);
      const tol = 9 * (geo.kmax - geo.kmin) / 600;
      kFrac = null; k = val;
      let migliore = null;
      for (const v of An.V) {
        const t = dot(prob.c, v), d = Math.abs(t.num() - val);
        if (d < tol && (!migliore || d < migliore[1])) migliore = [t, d];
      }
      if (migliore) { kFrac = migliore[0]; k = kFrac.num(); }
      if (daTrascinamento || migliore) {
        const C = geo.centro, kc = c[0] * C[0] + c[1] * C[1], s = (k - kc) / nc;
        G.setPositionDirectly(JXG.COORDS_BY_USER, [C[0] + s * c[0] / nc, C[1] + s * c[1] / nc]);
      }
      inK.value = String(Math.round(1000 * (k - geo.kmin) / (geo.kmax - geo.kmin)));
      board.update();
      aggiornaLivello();
    }
    inK.addEventListener("input", () => {
      if (!geo) return;
      const v = geo.kmin + (geo.kmax - geo.kmin) * (+inK.value) / 1000;
      const C = geo.centro, c = prob.c.map((t) => t.num()), nc = Math.hypot(c[0], c[1]);
      k = v;
      const s = (k - (c[0] * C[0] + c[1] * C[1])) / nc;
      if (G) G.setPositionDirectly(JXG.COORDS_BY_USER, [C[0] + s * c[0] / nc, C[1] + s * c[1] / nc]);
      impostaK(v, false);
    });

    // la retta c'x = k interseca F?  (esatto se k e' un valore esatto, altrimenti in virgola mobile)
    function intersecaF() {
      if (An.esito === "inf") return false;
      const val = An.V.map((v) => dot(prob.c, v).num());
      const dirs = An.raggi.map((d) => dot(prob.c, d).num());
      const hi = dirs.some((t) => t > 0) ? Infinity : Math.max(...val);
      const lo = dirs.some((t) => t < 0) ? -Infinity : Math.min(...val);
      const e = 1e-9 * (1 + Math.abs(k));
      return k >= lo - e && k <= hi + e;
    }

    function aggiornaLivello() {
      if (!prob) return;
      const kt = k === null ? "" : kFrac ? kFrac.tex() : numTxt(k);
      valK.innerHTML = mj(k === null ? "" : `\\(${kt}\\)`);
      const nota = modo === "esplora" ? ` &nbsp; <span class="gpl-nota">${intersecaF() ? T.interseca : T.nonInterseca}</span>` : "";
      livello.innerHTML = mj(k === null ? "" : `\\(${linTex(prob.c)} = ${kt}\\)${nota}`);
      typeset(livello); typeset(valK);
    }

    // ---------------------------------------------------------------- testi a lato
    function scriviLegenda() {
      const voci = [["rosso", T.legF, "solid", 6], ["rosso", T.legVincoli, "dotted", 2], ["blu", T.legLivello, "dashed", 3], ["blu", T.legGrad, "solid", 3], ["nero", T.legVertici, "dot"]];
      if (mostraSimplesso && percorso) voci.push(["viola", T.legSimplesso, "dot"]);
      if (An.esito === "opt" && modo === "esplora") voci.push(["blu", T.legOttimo, "dot"]);
      legenda.innerHTML = mj(voci.map(([k2, t, s, w]) => s === "dot"
        ? `<span><b class="gpl-pallino" style="background:var(--gpl-${k2})"></b>${t}</span>`
        : `<span><i style="border-color:var(--gpl-${k2});border-top-style:${s};border-top-width:${w}px"></i>${t}</span>`).join(""));
      typeset(legenda);
    }

    function esitoHtml() {
      const A = An, p = prob;
      if (A.esito === "inf") {
        let s = "";
        if (A.nucleo) {
          const l = A.nucleo.map((i) => `\\(${linTex(p.vincoli[i].a)} ${relTex[p.vincoli[i].rel]} ${p.vincoli[i].b.tex()}\\)`);
          s = l.length === 1 ? T.incompatibile(`${T.ilVincolo} ${l[0]}`) : T.incompatibili(`${T.iVincoli} ${l.slice(0, -1).join(", ")} ${T.e} ${l[l.length - 1]}`);
        }
        return T.inammissibile(s);
      }
      if (A.esito === "unb") {
        const cd = dot(p.c, A.raggio);
        return p.senso === "max" ? T.illimitato(punto(A.raggio), cd.tex()) : T.illimitatoMin(punto(A.raggio), cd.tex());
      }
      if (A.zero) return T.tuttoOttimo;
      let s;
      if (A.multipli && A.ottimi.length > 1) s = T.multipliSeg(punto(A.ottimi[0]), punto(A.ottimi[1]), A.zOrig.tex());
      else if (A.multipli) s = T.multipliRaggio(punto(A.ottimi[0]), punto(A.raggiOttimi[0]), A.zOrig.tex());
      else s = (p.senso === "max" ? T.ottimoUnico : T.ottimoUnicoMin)(punto(A.ottimi[0]), A.zOrig.tex());
      if (A.zIntero) {
        const xs = A.xIntero.map((q) => `\\(${punto(q)}\\)`).join(", ");
        s += "<br>" + (p.nome === "P6" ? T.intero : T.interoGen)(A.zIntero.tex(), xs);
      }
      return s;
    }

    function scriviTesti() {
      formula.innerHTML = mj(`\\(${problemaTex(prob)}\\)`);
      typeset(formula);
      if (modo === "esplora") {
        let s = esitoHtml();
        if (mostraSimplesso && An.esito !== "inf") {
          if (!percorso) s += `<br>${T.soloA}`;
          else s += "<br>" + (percorso.degeneri ? T.passiDeg(percorso.punti.length, percorso.degeneri) : T.passi(percorso.punti.length));
        }
        letture.innerHTML = mj(s);
        letture.hidden = false;
        typeset(letture);
        // tabella dei vertici con il valore della funzione obiettivo
        if (!An.V.length) tabella.innerHTML = mj(T.nessunVertice);
        else {
          const ord = An.V.slice().sort((a, b) => a[0].cmp(b[0]) || a[1].cmp(b[1]));
          tabella.innerHTML = mj(`<div class="gpl-tit">${T.vertici}</div><table class="gi-tabella"><tr><th>${T.vertice}</th><th>\\(\\boldsymbol c'\\boldsymbol x\\)</th></tr>` +
            ord.map((v) => {
              const z = dot(prob.c, v), ott = An.esito === "opt" && !An.zero && An.ottimi.some((o) => o[0].eq(v[0]) && o[1].eq(v[1]));
              return `<tr class="${ott ? "gpl-ott" : ""}"><td>\\(${punto(v)}\\)</td><td>\\(${z.tex()}\\)</td></tr>`;
            }).join("") + "</table>");
        }
        tabella.hidden = false;
        typeset(tabella);
      } else {
        letture.hidden = true; tabella.hidden = true;
        provaTesto.innerHTML = mj(prob.senso === "max" ? T.provaTesto : T.provaTestoMin);
        typeset(provaTesto);
      }
    }

    // ---------------------------------------------------------------- prova tu
    function rispondi(scelta) {
      const A = An;
      let ok = false, msg;
      if (scelta === "opt") {
        if (A.esito === "unb") msg = T.noOttimoUnb;
        else if (A.esito === "inf") msg = T.noOttimoInf;
        else {
          const z = dot(prob.c, A.ottimi[0]).num(), tol = 1.5 * 9 * (geo.kmax - geo.kmin) / 600;
          const avanti = prob.senso === "max" ? 1 : -1;          // verso in cui migliora
          const scarto = avanti * (k - z);
          if (Math.abs(k - z) <= tol) { ok = true; msg = A.multipli ? T.giustoMultipli(A.zOrig.tex()) : T.giusto(punto(A.ottimi[0]), A.zOrig.tex()); }
          else if (scarto < 0) msg = intersecaF() ? T.presto : T.presto0;
          else msg = T.oltre;
        }
      } else if (scelta === "unb") {
        if (A.esito === "unb") { ok = true; msg = T.siIllimitato; } else msg = A.esito === "inf" ? T.noUnbInf : T.noIllimitato;
      } else {
        if (A.esito === "inf") { ok = true; msg = T.siInammissibile; } else msg = A.esito === "unb" ? T.noInfUnb : T.noInammissibile;
      }
      esito.className = "gpl-esito " + (ok ? "giusto" : "sbagliato");
      esito.innerHTML = mj(msg);
      esito.hidden = false;
      typeset(esito);
    }
    bOtt.onclick = () => rispondi("opt");
    bUnb.onclick = () => rispondi("unb");
    bInf.onclick = () => rispondi("inf");
    bSol.onclick = () => {
      risposta = "mostra";
      esito.className = "gpl-esito"; esito.innerHTML = mj(esitoHtml()); esito.hidden = false; typeset(esito);
      board.update();
    };

    function setModo(m) {
      modo = m; risposta = null;
      tEsplora.setAttribute("aria-selected", String(m === "esplora"));
      tProva.setAttribute("aria-selected", String(m === "prova"));
      pEsplora.hidden = m !== "esplora";
      pProva.hidden = m !== "prova";
      opzioni.hidden = m !== "esplora";
      esito.hidden = true;
      if (m === "prova" && geo) {                       // si riparte da una retta lontana dall'ottimo
        const avanti = prob.senso === "max" ? 1 : -1;
        k = avanti > 0 ? geo.kmin + 0.2 * (geo.kmax - geo.kmin) : geo.kmax - 0.2 * (geo.kmax - geo.kmin);
        if (mostraSimplesso) { mostraSimplesso = false; opzioni.querySelectorAll("input")[1].checked = false; rigaRegola.hidden = true; }
      }
      ridisegna();
      if (m === "prova" && G) impostaK(k, true);
    }
    tEsplora.onclick = () => setModo("esplora");
    tProva.onclick = () => setModo("prova");

    // ---------------------------------------------------------------- eventi
    sel.onchange = () => {
      if (sel.value === "__tuo") { editor.open = true; area.focus(); return; }
      carica(daCatalogo(CAT()[sel.value]));
      if (modo === "prova") setModo("prova");
    };
    bDisegna.onclick = () => {
      try {
        const p = leggiTesto(area.value);
        sel.value = "__tuo";
        carica(p);
        if (modo === "prova") setModo("prova");
      } catch (e) {
        errore.textContent = e.message; errore.hidden = false;
      }
    };
    new MutationObserver(() => ridisegna()).observe(document.body, { attributes: true, attributeFilter: ["data-md-color-scheme"] });

    // ---------------------------------------------------------------- avvio
    const iniziale = el.dataset.problema && CAT()[el.dataset.problema] && CAT()[el.dataset.problema].n === 2 ? el.dataset.problema : "P0";
    if (CAT()[iniziale]) { sel.value = iniziale; carica(daCatalogo(CAT()[iniziale])); }
    else if (el.dataset.testo) { sel.value = "__tuo"; carica(leggiTesto(el.dataset.testo)); }
    typeset(el);
  }

  function montaTutti() {
    if (!window.JXG) return;
    document.querySelectorAll(".gpl").forEach(monta);
  }
  if (window.document$) document$.subscribe(montaTutti);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montaTutti);
  else montaTutti();
  window.GraficoPL = { Frac, analizza, percorsoSimplesso, leggiTesto, daCatalogo };
})();
