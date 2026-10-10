/* Motore di calcolo del laboratorio di Programmazione lineare.
 *
 * Aritmetica ESATTA con frazioni (BigInt), come nelle dispense: lo studente
 * vede 7/2 e non 3.4999999.
 * Ogni algoritmo restituisce i PASSI con la notazione delle note:
 *   - dizionari  x_i = b̄_i − Σ ā_ij x_j  (i ∈ B),  z = z̄ + Σ c̄_j x_j  (j ∈ N),
 *     righe ordinate per indice della variabile basica, colonne per indice
 *     della non basica; scarti x_{n+i}; variabile ausiliaria x_0 in prima posizione;
 *   - simplesso: colonna pivot con il costo ridotto massimo (parità: indice
 *     minimo) oppure regola di Bland; riga pivot: rapporto minimo t_m, parità
 *     risolte con l'indice minimo fra le righe con ā_rp > 0;
 *   - Fase 0: primo pivot speciale sulla b_i più negativa (indice minimo);
 *   - simplesso duale: riga pivot = basica di indice minimo con b̄_r < 0,
 *     rapporti c̄_j / ā_rj sulle ā_rj < 0, s_m, parità per indice minimo;
 *   - simplesso rivisto: π A_B = c'_B, A_B d = A_p (rivisto primale);
 *     A_B b̄ = b, u A_B = e'_r (rivisto duale). I moltiplicatori sono π.
 *
 * Il motore non contiene testo in una lingua: restituisce dati e LaTeX
 * neutro; le frasi sono in laboratorio.js (TXT.it / TXT.en).
 * Funziona nel browser (oggetto globale PL) e in Node (require), dove lo
 * usano i test (test/test_pl.js) che lo confrontano con test/genera_casi.py.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PL = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ------------------------------------------------------------------ frazioni
  function gcd(a, b) {
    if (a < 0n) a = -a;
    if (b < 0n) b = -b;
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }

  class Frac {
    constructor(n, d) {
      n = BigInt(n);
      d = d === undefined ? 1n : BigInt(d);
      if (d === 0n) throw new Error("division by zero");
      if (d < 0n) { n = -n; d = -d; }
      const g = gcd(n, d) || 1n;
      this.n = n / g;
      this.d = d / g;
    }
    static of(x) {
      if (x instanceof Frac) return x;
      if (typeof x === "bigint") return new Frac(x);
      if (typeof x === "number") {
        if (Number.isInteger(x)) return new Frac(BigInt(x));
        return Frac.parse(String(x));
      }
      const f = Frac.parse(String(x));
      if (!f) throw new Error("not a number: " + x);
      return f;
    }
    /** "3", "-3/4", "0.25", "1,5" (virgola italiana), "-.5" → Frac, oppure null */
    static parse(s) {
      if (s === null || s === undefined) return null;
      s = String(s).trim().replace(/\s+/g, "").replace(/−/g, "-").replace(",", ".");
      if (s === "" || s === "+" || s === "-") return null;
      let m = s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
      if (m) {
        const d = BigInt(m[2]);
        if (d === 0n) return null;
        return new Frac(BigInt(m[1]), d);
      }
      m = s.match(/^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/);
      if (!m || (m[2] === "" && (m[3] === undefined || m[3] === ""))) return null;
      const sign = m[1] === "-" ? -1n : 1n;
      const dec = m[3] || "";
      let n = BigInt((m[2] || "0") + dec) * sign;
      let d = 10n ** BigInt(dec.length);
      const e = m[4] ? parseInt(m[4], 10) : 0;
      if (Math.abs(e) > 60) return null;
      if (e > 0) n *= 10n ** BigInt(e);
      if (e < 0) d *= 10n ** BigInt(-e);
      return new Frac(n, d);
    }
    add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
    div(o) { o = Frac.of(o); if (o.n === 0n) throw new Error("division by zero"); return new Frac(this.n * o.d, this.d * o.n); }
    neg() { return new Frac(-this.n, this.d); }
    abs() { return this.n < 0n ? this.neg() : this; }
    inv() { return new Frac(this.d, this.n); }
    isZero() { return this.n === 0n; }
    isOne() { return this.n === 1n && this.d === 1n; }
    isInt() { return this.d === 1n; }
    sign() { return this.n > 0n ? 1 : this.n < 0n ? -1 : 0; }
    eq(o) { o = Frac.of(o); return this.n === o.n && this.d === o.d; }
    cmp(o) { o = Frac.of(o); const a = this.n * o.d, b = o.n * this.d; return a < b ? -1 : a > b ? 1 : 0; }
    lt(o) { return this.cmp(o) < 0; }
    gt(o) { return this.cmp(o) > 0; }
    le(o) { return this.cmp(o) <= 0; }
    ge(o) { return this.cmp(o) >= 0; }
    toNumber() { return Number(this.n) / Number(this.d); }
    toString() { return this.d === 1n ? this.n.toString() : this.n + "/" + this.d; }
    /** LaTeX: 3, -3, \frac{3}{4}, -\frac{3}{4} */
    tex() {
      if (this.d === 1n) return this.n.toString();
      const a = this.n < 0n ? -this.n : this.n;
      return (this.n < 0n ? "-" : "") + "\\frac{" + a + "}{" + this.d + "}";
    }
    /** con le parentesi se negativo (prodotti: 2 \cdot (-3)) */
    texP() { return this.n < 0n ? "(" + this.tex() + ")" : this.tex(); }
  }
  const ZERO = new Frac(0n), ONE = new Frac(1n);
  const F = (x) => Frac.of(x);
  const sum = (arr) => arr.reduce((s, x) => s.add(x), ZERO);

  // ------------------------------------------------------------------ algebra lineare esatta
  /** risolve M x = r (M quadrata) con Gauss–Jordan; null se singolare */
  function solveSystem(M, r) {
    const m = M.length;
    const a = M.map((row, i) => row.map(F).concat([F(r[i])]));
    for (let col = 0; col < m; col++) {
      let piv = -1;
      for (let i = col; i < m; i++) if (!a[i][col].isZero()) { piv = i; break; }
      if (piv < 0) return null;
      [a[col], a[piv]] = [a[piv], a[col]];
      const p = a[col][col];
      a[col] = a[col].map((v) => v.div(p));
      for (let i = 0; i < m; i++) {
        if (i === col || a[i][col].isZero()) continue;
        const f = a[i][col];
        a[i] = a[i].map((v, k) => v.sub(f.mul(a[col][k])));
      }
    }
    return a.map((row) => row[m]);
  }
  const transpose = (M) => (M.length ? M[0].map((_, j) => M.map((r) => r[j])) : []);
  /** rango e una soluzione particolare di M x = r (M qualsiasi): {rank, x|null, consistent} */
  function solveAny(M, r) {
    const m = M.length, n = m ? M[0].length : 0;
    const a = M.map((row, i) => row.map(F).concat([F(r[i])]));
    const pivCols = [];
    let row = 0;
    for (let col = 0; col < n && row < m; col++) {
      let piv = -1;
      for (let i = row; i < m; i++) if (!a[i][col].isZero()) { piv = i; break; }
      if (piv < 0) continue;
      [a[row], a[piv]] = [a[piv], a[row]];
      const p = a[row][col];
      a[row] = a[row].map((v) => v.div(p));
      for (let i = 0; i < m; i++) {
        if (i === row || a[i][col].isZero()) continue;
        const f = a[i][col];
        a[i] = a[i].map((v, k) => v.sub(f.mul(a[row][k])));
      }
      pivCols.push(col);
      row++;
    }
    for (let i = row; i < m; i++) if (!a[i][n].isZero()) return { rank: row, x: null, consistent: false };
    const x = Array.from({ length: n }, () => ZERO);
    pivCols.forEach((c, i) => (x[c] = a[i][n]));
    return { rank: row, x: x, consistent: true, unique: row === n };
  }

  // ------------------------------------------------------------------ problemi
  const SENSES = ["<=", "=", ">="];
  const SIGNS = [">=0", "free", "<=0"];
  /** LP in forma generale: max/min c'x, a_i x (<=|=|>=) b_i, x_j (>=0|free|<=0) */
  function makeLP(sense, c, A, b, rel, sign) {
    const n = c.length, m = A.length;
    return {
      sense: sense === "min" ? "min" : "max", n: n, m: m,
      c: c.map(F), A: A.map((r) => r.map(F)), b: b.map(F),
      rel: rel ? rel.slice() : Array(m).fill("<="),
      sign: sign ? sign.slice() : Array(n).fill(">=0"),
    };
  }
  const REL_ALIAS = { "<=": "<=", "=<": "<=", "≤": "<=", ">=": ">=", "=>": ">=", "≥": ">=", "=": "=", "==": "=" };
  function splitNums(s) {
    const t = String(s).split(",").map((x) => x.trim());
    const v = t.map((x) => Frac.parse(x));
    return v.some((x) => x === null) ? null : v;
  }
  /** "max:5,2|-1,3<=12|1,2<=12|3,-2<=8|sgn:+,f,-" → LP (null se non valido) */
  function parseLP(s) {
    if (!s) return null;
    const parts = String(s).split("|").map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return null;
    const m0 = parts[0].match(/^(max|min)\s*:(.*)$/i);
    if (!m0) return null;
    const c = splitNums(m0[2]);
    if (!c || !c.length) return null;
    const n = c.length, A = [], b = [], rel = [];
    let sign = Array(n).fill(">=0");
    for (const p of parts.slice(1)) {
      const ms = p.match(/^sgn\s*:(.*)$/i);
      if (ms) {
        const t = ms[1].split(",").map((x) => x.trim());
        if (t.length !== n) return null;
        sign = t.map((x) => (x === "+" || x === ">=0" ? ">=0" : x === "-" || x === "<=0" ? "<=0" : x === "f" || x === "free" ? "free" : null));
        if (sign.some((x) => !x)) return null;
        continue;
      }
      const mr = p.match(/^(.*?)(<=|>=|=<|=>|≤|≥|==|=)(.*)$/);
      if (!mr) return null;
      const row = splitNums(mr[1]), rhs = Frac.parse(mr[3]);
      if (!row || row.length !== n || !rhs) return null;
      A.push(row); b.push(rhs); rel.push(REL_ALIAS[mr[2]]);
    }
    if (!A.length) return null;
    return makeLP(m0[1].toLowerCase(), c, A, b, rel, sign);
  }
  function lpToString(lp) {
    let s = lp.sense + ":" + lp.c.map(String).join(",");
    lp.A.forEach((r, i) => (s += "|" + r.map(String).join(",") + lp.rel[i] + lp.b[i]));
    if (lp.sign.some((x) => x !== ">=0")) s += "|sgn:" + lp.sign.map((x) => (x === ">=0" ? "+" : x === "<=0" ? "-" : "f")).join(",");
    return s;
  }
  const isCanonical = (lp) => lp.sense === "max" && lp.rel.every((r) => r === "<=") && lp.sign.every((s) => s === ">=0");

  /** Forma canonica di massimo (il simplesso sui dizionari parte da lì).
   * min → max di −c; ≥ → moltiplicato per −1; = → due vincoli ≤;
   * x_j ≤ 0 → x_j = −x_j^+;  x_j libera → x_j = x_j^+ − x_j^-.
   * Restituisce {lp: {n,m,c,A,b,names}, cols:[{j,s}], rows:[{i,s}], objSign, identity} */
  function toCanonical(g) {
    const cols = [], names = [];
    for (let j = 0; j < g.n; j++) {
      if (g.sign[j] === ">=0") { cols.push({ j: j, s: 1 }); names.push("x_{" + (j + 1) + "}"); }
      else if (g.sign[j] === "<=0") { cols.push({ j: j, s: -1 }); names.push("x_{" + (j + 1) + "}^{+}"); }
      else { cols.push({ j: j, s: 1 }); names.push("x_{" + (j + 1) + "}^{+}"); cols.push({ j: j, s: -1 }); names.push("x_{" + (j + 1) + "}^{-}"); }
    }
    const rows = [];
    for (let i = 0; i < g.m; i++) {
      if (g.rel[i] === "<=") rows.push({ i: i, s: 1 });
      else if (g.rel[i] === ">=") rows.push({ i: i, s: -1 });
      else { rows.push({ i: i, s: 1 }); rows.push({ i: i, s: -1 }); }
    }
    const os = g.sense === "max" ? 1 : -1;
    const lp = {
      n: cols.length, m: rows.length, names: names,
      c: cols.map((cl) => g.c[cl.j].mul(os * cl.s)),
      A: rows.map((rw) => cols.map((cl) => g.A[rw.i][cl.j].mul(rw.s * cl.s))),
      b: rows.map((rw) => g.b[rw.i].mul(rw.s)),
    };
    return { lp: lp, cols: cols, rows: rows, objSign: os, identity: isCanonical(g) };
  }
  /** canonico semplice: {n,m,c,A,b} con nomi x_1..x_n */
  function canonical(c, A, b) {
    const n = c.length;
    return { n: n, m: A.length, c: c.map(F), A: A.map((r) => r.map(F)), b: b.map(F), names: Array.from({ length: n }, (_, j) => "x_{" + (j + 1) + "}") };
  }
  /** nome LaTeX della variabile di indice k (0 = x_0, 1..n strutturali, n+1..n+m scarti) */
  function varName(lp, k) {
    if (k === 0) return "x_{0}";
    if (k <= lp.n) return (lp.names && lp.names[k - 1]) || "x_{" + k + "}";
    return "x_{" + k + "}";
  }
  /** colonna k della matrice (A | I) (k = 1..n+m) */
  function column(lp, k) {
    if (k <= lp.n) return lp.A.map((r) => r[k - 1]);
    return lp.A.map((_, i) => (i === k - lp.n - 1 ? ONE : ZERO));
  }
  /** costo della variabile k (scarti: 0) */
  const cost = (lp, k) => (k >= 1 && k <= lp.n ? lp.c[k - 1] : ZERO);

  // ------------------------------------------------------------------ dizionari
  /* D = {B:[...], N:[...], b:[b̄ per riga], A:[[ā_ij]], z: z̄, c:[c̄_j], obj:"z"|"w"|"zhat"}
   * righe nell'ordine di B, colonne nell'ordine di N, entrambi crescenti. */
  function cloneDict(D) {
    return { B: D.B.slice(), N: D.N.slice(), b: D.b.slice(), A: D.A.map((r) => r.slice()), z: D.z, c: D.c.slice(), obj: D.obj };
  }
  /** dizionario iniziale della base degli scarti */
  function initialDict(lp, cvec, obj) {
    const cc = cvec || lp.c;
    return {
      B: Array.from({ length: lp.m }, (_, i) => lp.n + i + 1),
      N: Array.from({ length: lp.n }, (_, j) => j + 1),
      b: lp.b.slice(), A: lp.A.map((r) => r.slice()), z: ZERO, c: cc.slice(), obj: obj || "z",
    };
  }
  /** riordina righe e colonne per indice crescente */
  function sortDict(D) {
    const ri = D.B.map((v, i) => i).sort((x, y) => D.B[x] - D.B[y]);
    const ci = D.N.map((v, j) => j).sort((x, y) => D.N[x] - D.N[y]);
    return {
      B: ri.map((i) => D.B[i]), N: ci.map((j) => D.N[j]), b: ri.map((i) => D.b[i]),
      A: ri.map((i) => ci.map((j) => D.A[i][j])), z: D.z, c: ci.map((j) => D.c[j]), obj: D.obj,
    };
  }
  /** pivot: entra x_p (p ∈ N), esce x_r (r ∈ B). Restituisce il nuovo dizionario. */
  function pivotDict(D, p, r) {
    const ri = D.B.indexOf(r), pj = D.N.indexOf(p);
    if (ri < 0 || pj < 0) throw new Error("pivot: indices");
    const a = D.A[ri][pj];
    if (a.isZero()) throw new Error("pivot: zero element");
    const newN = D.N.map((j) => (j === p ? r : j));
    // riga di x_p: x_p = b̄_r/a − Σ_{j≠p} (ā_rj/a) x_j − (1/a) x_r
    const prow = D.N.map((j, k) => (k === pj ? ONE.div(a) : D.A[ri][k].div(a)));
    const pb = D.b[ri].div(a);
    const B2 = [], b2 = [], A2 = [];
    D.B.forEach((i, k) => {
      if (k === ri) { B2.push(p); b2.push(pb); A2.push(prow); return; }
      const aip = D.A[k][pj];
      B2.push(i);
      b2.push(D.b[k].sub(aip.mul(pb)));
      A2.push(D.N.map((j, q) => (q === pj ? ZERO : D.A[k][q]).sub(aip.mul(prow[q]))));
    });
    const cp = D.c[pj];
    const c2 = D.N.map((j, q) => (q === pj ? ZERO : D.c[q]).sub(cp.mul(prow[q])));
    return sortDict({ B: B2, N: newN, b: b2, A: A2, z: D.z.add(cp.mul(pb)), c: c2, obj: D.obj });
  }
  /** valori di tutte le variabili 0..tot nel dizionario */
  function dictValues(D, tot) {
    const x = Array.from({ length: tot + 1 }, () => ZERO);
    D.B.forEach((i, k) => (x[i] = D.b[k]));
    return x;
  }
  /** dizionario determinato da una base (per i test e per il rivisto) */
  function dictFromBasis(lp, B, obj) {
    B = B.slice().sort((x, y) => x - y);
    const all = Array.from({ length: lp.n + lp.m }, (_, k) => k + 1);
    const N = all.filter((k) => B.indexOf(k) < 0);
    const AB = lp.A.map((_, i) => B.map((k) => column(lp, k)[i]));
    const bb = solveSystem(AB, lp.b);
    if (!bb) return null;
    const cols = N.map((k) => solveSystem(AB, column(lp, k)));
    const Ab = B.map((_, i) => cols.map((col) => col[i]));
    const cB = B.map((k) => cost(lp, k));
    const z = sum(cB.map((ci, i) => ci.mul(bb[i])));
    const c = N.map((k, q) => cost(lp, k).sub(sum(cB.map((ci, i) => ci.mul(Ab[i][q])))));
    return { B: B, N: N, b: bb, A: Ab, z: z, c: c, obj: obj || "z" };
  }
  const dictKey = (D) => D.B.join(",");
  function dictEq(D, E) {
    const eqv = (u, v) => u.length === v.length && u.every((x, i) => x.eq(v[i]));
    return D.B.join() === E.B.join() && D.N.join() === E.N.join() && eqv(D.b, E.b) && D.z.eq(E.z) && eqv(D.c, E.c) &&
      D.A.every((r, i) => eqv(r, E.A[i]));
  }

  // ------------------------------------------------------------------ regole di pivot
  /** colonna pivot: "largest" (c̄ massimo, parità indice minimo) o "bland" (indice minimo) */
  function chooseColumn(D, rule, exclude) {
    let best = -1;
    D.N.forEach((j, q) => {
      if (exclude && exclude.indexOf(j) >= 0) return;
      if (!D.c[q].gt(ZERO)) return;
      if (best < 0) { best = q; return; }
      if (rule === "bland") return;               // il primo (indice minimo) resta
      if (D.c[q].gt(D.c[best])) best = q;          // parità: resta l'indice minore
    });
    return best < 0 ? null : D.N[best];
  }
  /** test dei rapporti sulla colonna p: [{i, b, a, ratio|null}], t_m, r (indice minimo fra i rapporti minimi) */
  function ratioTest(D, p) {
    const pj = D.N.indexOf(p);
    const ratios = D.B.map((i, k) => ({ i: i, b: D.b[k], a: D.A[k][pj], ratio: D.A[k][pj].gt(ZERO) ? D.b[k].div(D.A[k][pj]) : null }));
    let tm = null, r = null;
    ratios.forEach((q) => {
      if (q.ratio === null) return;
      if (tm === null || q.ratio.lt(tm)) { tm = q.ratio; r = q.i; }   // B è crescente: la prima parità è l'indice minimo
    });
    const ties = ratios.filter((q) => q.ratio !== null && q.ratio.eq(tm)).map((q) => q.i);
    return { ratios: ratios, tm: tm, r: r, ties: ties };
  }

  /** simplesso primale sui dizionari a partire da D0.
   * Restituisce {dicts:[D0..Dk], iters:[{p, r, ratios, tm, ties, degenerate}], outcome:"optimal"|"unbounded"|"cycle"|"maxiter", ray} */
  function primalSimplex(D0, opt) {
    opt = opt || {};
    const rule = opt.rule || "largest";
    const maxIter = opt.maxIter || 60;
    const dicts = [D0], iters = [];
    const seen = {};
    seen[dictKey(D0)] = 0;
    let D = D0;
    for (let it = 0; it < maxIter; it++) {
      const p = chooseColumn(D, rule, opt.exclude);
      if (p === null) return { dicts: dicts, iters: iters, outcome: "optimal" };
      const rt = ratioTest(D, p);
      if (rt.r === null) {
        // raggio: x_p = t, x_i = b̄_i − t ā_ip
        const pj = D.N.indexOf(p);
        return { dicts: dicts, iters: iters, outcome: "unbounded",
          ray: { p: p, cp: D.c[pj], dir: D.B.map((i, k) => ({ i: i, b: D.b[k], d: D.A[k][pj].neg() })), ratios: rt.ratios } };
      }
      const E = pivotDict(D, p, rt.r);
      iters.push({ p: p, r: rt.r, ratios: rt.ratios, tm: rt.tm, ties: rt.ties, degenerate: rt.tm.isZero() });
      dicts.push(E);
      D = E;
      const key = dictKey(E);
      if (seen[key] !== undefined) return { dicts: dicts, iters: iters, outcome: "cycle", cycleFrom: seen[key] };
      seen[key] = dicts.length - 1;
    }
    return { dicts: dicts, iters: iters, outcome: "maxiter" };
  }

  /** riga obiettivo di un dizionario per il vettore dei costi cfun(k) (sostituzione delle basiche) */
  function restoreObjective(lp, D, obj) {
    const cB = D.B.map((k) => cost(lp, k));
    const z = sum(cB.map((ci, i) => ci.mul(D.b[i])));
    const c = D.N.map((k, q) => cost(lp, k).sub(sum(cB.map((ci, i) => ci.mul(D.A[i][q])))));
    return { B: D.B.slice(), N: D.N.slice(), b: D.b.slice(), A: D.A.map((r) => r.slice()), z: z, c: c, obj: obj || "z" };
  }

  // ------------------------------------------------------------------ Fase 0
  /** Fase 0 (problema ausiliario con x_0 in prima posizione).
   * {aux:{dicts, iters}, special:{r}, extra:{r:0,p}|null, outcome:"infeasible"|"feasible"|"cycle", w, start: dizionario del problema originale} */
  function phaseZero(lp, opt) {
    opt = opt || {};
    const D0 = {
      B: Array.from({ length: lp.m }, (_, i) => lp.n + i + 1),
      N: [0].concat(Array.from({ length: lp.n }, (_, j) => j + 1)),
      b: lp.b.slice(), A: lp.A.map((r) => [F(-1)].concat(r)), z: ZERO,
      c: [F(-1)].concat(lp.c.map(() => ZERO)), obj: "w",
    };
    // pivot speciale: entra x_0, esce la basica con b_i più negativo (indice minimo)
    let rk = 0;
    D0.b.forEach((v, k) => { if (v.lt(D0.b[rk])) rk = k; });
    const r = D0.B[rk];
    const D1 = pivotDict(D0, 0, r);
    const run = primalSimplex(D1, { rule: opt.rule, maxIter: opt.maxIter });
    const res = { D0: D0, special: { p: 0, r: r, b: D0.b[rk] }, aux: run, extra: null };
    if (run.outcome !== "optimal") { res.outcome = run.outcome === "cycle" ? "cycle" : "error"; return res; }
    let Dend = run.dicts[run.dicts.length - 1];
    res.w = Dend.z;
    if (Dend.z.lt(ZERO)) { res.outcome = "infeasible"; return res; }
    if (Dend.B.indexOf(0) >= 0) {
      // x_0 basica a valore 0: un pivot (degenere) la fa uscire, colonna di indice minimo con ā_0j ≠ 0
      const k0 = Dend.B.indexOf(0);
      const q = Dend.N.findIndex((j, q2) => !Dend.A[k0][q2].isZero());
      const p = Dend.N[q];
      const E = pivotDict(Dend, p, 0);
      res.extra = { p: p, r: 0, a: Dend.A[k0][q], before: Dend, after: E };
      Dend = E;
    }
    // si toglie x_0 da N e si ripristina l'obiettivo originale
    const q0 = Dend.N.indexOf(0);
    const noX0 = {
      B: Dend.B.slice(), N: Dend.N.filter((j) => j !== 0), b: Dend.b.slice(),
      A: Dend.A.map((row) => row.filter((_, q) => q !== q0)), z: ZERO, c: [], obj: "z",
    };
    res.withoutX0 = noX0;
    res.start = restoreObjective(lp, noX0, "z");
    res.outcome = "feasible";
    return res;
  }

  /** soluzione completa di un LP canonico: Fase 0 se serve, poi il simplesso */
  function solveCanonical(lp, opt) {
    opt = opt || {};
    const needP0 = lp.b.some((v) => v.lt(ZERO));
    let p0 = null, D0;
    if (needP0) {
      p0 = phaseZero(lp, opt);
      if (p0.outcome !== "feasible") return { phase0: p0, outcome: p0.outcome === "infeasible" ? "infeasible" : p0.outcome };
      D0 = p0.start;
    } else D0 = initialDict(lp);
    const run = primalSimplex(D0, opt);
    const out = { phase0: p0, run: run, outcome: run.outcome };
    const Dl = run.dicts[run.dicts.length - 1];
    if (run.outcome === "optimal") {
      out.x = dictValues(Dl, lp.n + lp.m).slice(1);
      out.z = Dl.z;
      out.pi = duals(lp, Dl);
    }
    return out;
  }
  /** soluzione duale letta dal dizionario ottimo: π_i = −c̄_{n+i} (0 se x_{n+i} è basica) */
  function duals(lp, D) {
    return Array.from({ length: lp.m }, (_, i) => {
      const q = D.N.indexOf(lp.n + i + 1);
      return q < 0 ? ZERO : D.c[q].neg();
    });
  }

  // ------------------------------------------------------------------ simplesso duale
  /** un passo duale: riga r (indice minimo con b̄_r < 0), rapporti c̄_j/ā_rj sulle ā_rj < 0 */
  function dualRatio(D) {
    const rk = D.b.findIndex((v) => v.lt(ZERO));
    if (rk < 0) return null;
    const r = D.B[rk];
    const cands = D.N.map((j, q) => ({ j: j, a: D.A[rk][q], c: D.c[q], ratio: D.A[rk][q].lt(ZERO) ? D.c[q].div(D.A[rk][q]) : null }));
    let sm = null, p = null;
    cands.forEach((q) => { if (q.ratio !== null && (sm === null || q.ratio.lt(sm))) { sm = q.ratio; p = q.j; } });
    const ties = cands.filter((q) => q.ratio !== null && q.ratio.eq(sm)).map((q) => q.j);
    return { r: r, br: D.b[rk], cands: cands, sm: sm, p: p, ties: ties };
  }
  function dualSimplexFrom(D0, opt) {
    opt = opt || {};
    const maxIter = opt.maxIter || 60;
    const dicts = [D0], iters = [];
    const seen = {};
    seen[dictKey(D0)] = 0;
    let D = D0;
    for (let it = 0; it < maxIter; it++) {
      const st = dualRatio(D);
      if (!st) return { dicts: dicts, iters: iters, outcome: "optimal" };
      if (st.p === null) return { dicts: dicts, iters: iters, outcome: "infeasible", certificate: st };
      const E = pivotDict(D, st.p, st.r);
      st.degenerate = st.sm.isZero();
      iters.push(st);
      dicts.push(E);
      D = E;
      const key = dictKey(E);
      if (seen[key] !== undefined) return { dicts: dicts, iters: iters, outcome: "cycle", cycleFrom: seen[key] };
      seen[key] = dicts.length - 1;
    }
    return { dicts: dicts, iters: iters, outcome: "maxiter" };
  }
  /** simplesso duale su un LP canonico.
   * Se c ≤ 0 la base degli scarti è ammissibile per il duale. Altrimenti (caso
   * generale delle note) si sostituisce c con ĉ (opt.chat: "zero" | "min") ≤ 0,
   * si cerca una base primale ammissibile con il duale e poi si riparte con il
   * simplesso primale sul c originale. */
  function dualSimplex(lp, opt) {
    opt = opt || {};
    const dualFeasible = lp.c.every((v) => v.le(ZERO));
    if (dualFeasible) {
      const run = dualSimplexFrom(initialDict(lp), opt);
      const out = { mode: "direct", run: run, outcome: run.outcome };
      if (run.outcome === "optimal") {
        const Dl = run.dicts[run.dicts.length - 1];
        out.x = dictValues(Dl, lp.n + lp.m).slice(1); out.z = Dl.z; out.pi = duals(lp, Dl);
      }
      return out;
    }
    const chat = lp.c.map((v) => (opt.chat === "min" ? (v.lt(ZERO) ? v : ZERO) : ZERO));
    const run1 = dualSimplexFrom(initialDict(lp, chat, "zhat"), opt);
    const out = { mode: "modified", chat: chat, run1: run1 };
    if (run1.outcome !== "optimal") { out.outcome = run1.outcome; return out; }
    const Dm = run1.dicts[run1.dicts.length - 1];
    const start = restoreObjective(lp, Dm, "z");
    const run2 = primalSimplex(start, opt);
    out.start = start; out.run2 = run2; out.outcome = run2.outcome;
    if (run2.outcome === "optimal") {
      const Dl = run2.dicts[run2.dicts.length - 1];
      out.x = dictValues(Dl, lp.n + lp.m).slice(1); out.z = Dl.z; out.pi = duals(lp, Dl);
    }
    return out;
  }

  // ------------------------------------------------------------------ simplesso rivisto
  /** matrice di base A_B (colonne di (A | I) nell'ordine di B) */
  function basisMatrix(lp, B) { return lp.A.map((_, i) => B.map((k) => column(lp, k)[i])); }
  /** simplesso rivisto primale. Base iniziale: scarti se b ≥ 0, altrimenti quella trovata dalla Fase 0.
   * Ogni iterazione: {B, N, AB, cB, pi, z, cbar:[{j, c, piA, cbar}], p, Ap, d, ratios, tm, r, bbar, bnew} */
  function revisedPrimal(lp, opt) {
    opt = opt || {};
    const rule = opt.rule || "largest";
    const maxIter = opt.maxIter || 60;
    let B, bbar, p0 = null;
    if (lp.b.some((v) => v.lt(ZERO))) {
      p0 = phaseZero(lp, opt);
      if (p0.outcome !== "feasible") return { phase0: p0, iters: [], outcome: p0.outcome };
      B = p0.start.B.slice();
      bbar = solveSystem(basisMatrix(lp, B), lp.b);
    } else {
      B = Array.from({ length: lp.m }, (_, i) => lp.n + i + 1);
      bbar = lp.b.slice();
    }
    const iters = [];
    const seen = {};
    for (let it = 0; it < maxIter; it++) {
      const N = [];
      for (let k = 1; k <= lp.n + lp.m; k++) if (B.indexOf(k) < 0) N.push(k);
      const AB = basisMatrix(lp, B);
      const cB = B.map((k) => cost(lp, k));
      // π A_B = c'_B  ⇔  A_B' π' = c_B
      const pi = solveSystem(transpose(AB), cB);
      const z = sum(pi.map((v, i) => v.mul(lp.b[i])));
      const cbar = N.map((j) => {
        const piA = sum(column(lp, j).map((a, i) => a.mul(pi[i])));
        return { j: j, c: cost(lp, j), piA: piA, cbar: cost(lp, j).sub(piA) };
      });
      const st = { B: B.slice(), N: N, AB: AB, cB: cB, pi: pi, z: z, cbar: cbar, bbar: bbar.slice() };
      iters.push(st);
      // colonna pivot con la stessa regola dei dizionari
      const fake = { N: N, c: cbar.map((x) => x.cbar) };
      const p = chooseColumn(fake, rule);
      if (p === null) return { phase0: p0, iters: iters, outcome: "optimal", x: valuesFrom(lp, B, bbar), z: z, pi: pi };
      const Ap = column(lp, p);
      const d = solveSystem(AB, Ap);
      st.p = p; st.Ap = Ap; st.d = d;
      const ratios = B.map((i, k) => ({ i: i, b: bbar[k], a: d[k], ratio: d[k].gt(ZERO) ? bbar[k].div(d[k]) : null }));
      st.ratios = ratios;
      let tm = null, rk = -1;
      // parità: indice minimo della variabile basica (B qui non è ordinata)
      ratios.forEach((q, k) => { if (q.ratio !== null && (tm === null || q.ratio.lt(tm) || (q.ratio.eq(tm) && q.i < B[rk]))) { tm = q.ratio; rk = k; } });
      if (rk < 0) { st.unbounded = true; return { phase0: p0, iters: iters, outcome: "unbounded" }; }
      st.tm = tm; st.r = B[rk]; st.degenerate = tm.isZero();
      const nb = bbar.map((v, k) => (k === rk ? tm : v.sub(tm.mul(d[k]))));
      const B2 = B.map((k, q) => (q === rk ? p : k));
      // si tiene la base ordinata, come nei dizionari
      const ord = B2.map((_, q) => q).sort((x, y) => B2[x] - B2[y]);
      B = ord.map((q) => B2[q]); bbar = ord.map((q) => nb[q]);
      st.bnew = bbar.slice(); st.Bnew = B.slice();
      const key = B.join(",");
      if (seen[key]) return { phase0: p0, iters: iters, outcome: "cycle" };
      seen[key] = true;
    }
    return { phase0: p0, iters: iters, outcome: "maxiter" };
  }
  function valuesFrom(lp, B, bbar) {
    const x = Array.from({ length: lp.n + lp.m }, () => ZERO);
    B.forEach((k, q) => (x[k - 1] = bbar[q]));
    return x;
  }
  /** simplesso rivisto duale (serve c ≤ 0: la base degli scarti è ammissibile per il duale).
   * Ogni iterazione: {B, N, AB, bbar, r, u, row:[{j, Aj, a}], cands, sm, p, cbar (prima), cbarNew} */
  function revisedDual(lp, opt) {
    opt = opt || {};
    const maxIter = opt.maxIter || 60;
    if (!lp.c.every((v) => v.le(ZERO))) return { iters: [], outcome: "notdualfeasible" };
    let B = Array.from({ length: lp.m }, (_, i) => lp.n + i + 1);
    let N = Array.from({ length: lp.n }, (_, j) => j + 1);
    let cbar = lp.c.slice();     // allineati a N
    const iters = [];
    const seen = {};
    for (let it = 0; it < maxIter; it++) {
      const AB = basisMatrix(lp, B);
      const bbar = solveSystem(AB, lp.b);
      const st = { B: B.slice(), N: N.slice(), AB: AB, bbar: bbar, cbar: cbar.slice() };
      iters.push(st);
      const rk = bbar.findIndex((v) => v.lt(ZERO));
      if (rk < 0) {
        const cB = B.map((k) => cost(lp, k));
        const z = sum(cB.map((v, q) => v.mul(bbar[q])));
        st.z = z;
        const pi = solveSystem(transpose(AB), cB);
        return { iters: iters, outcome: "optimal", x: valuesFrom(lp, B, bbar), z: z, pi: pi };
      }
      const r = B[rk];
      const e = B.map((_, q) => (q === rk ? ONE : ZERO));
      const u = solveSystem(transpose(AB), e);       // u A_B = e'_r
      const row = N.map((j) => {
        const Aj = column(lp, j);
        return { j: j, Aj: Aj, a: sum(Aj.map((v, i) => v.mul(u[i]))) };
      });
      const cands = row.map((x, q) => ({ j: x.j, a: x.a, c: cbar[q], ratio: x.a.lt(ZERO) ? cbar[q].div(x.a) : null }));
      Object.assign(st, { r: r, br: bbar[rk], e: e, u: u, row: row, cands: cands });
      let sm = null, p = null;
      cands.forEach((q) => { if (q.ratio !== null && (sm === null || q.ratio.lt(sm))) { sm = q.ratio; p = q.j; } });
      if (p === null) { st.infeasible = true; return { iters: iters, outcome: "infeasible" }; }
      st.sm = sm; st.p = p; st.degenerate = sm.isZero();
      // c̄_j ← c̄_j − s_m ā_rj (j ≠ p),  c̄_r ← −s_m
      const pq = N.indexOf(p);
      const newN = N.map((j) => (j === p ? r : j));
      const newc = N.map((j, q) => (q === pq ? sm.neg() : cbar[q].sub(sm.mul(row[q].a))));
      const ordN = newN.map((_, q) => q).sort((x, y) => newN[x] - newN[y]);
      N = ordN.map((q) => newN[q]); cbar = ordN.map((q) => newc[q]);
      B = B.map((k) => (k === r ? p : k)).sort((x, y) => x - y);
      st.Nnew = N.slice(); st.cbarNew = cbar.slice(); st.Bnew = B.slice();
      const key = B.join(",");
      if (seen[key]) return { iters: iters, outcome: "cycle" };
      seen[key] = true;
    }
    return { iters: iters, outcome: "maxiter" };
  }

  // ------------------------------------------------------------------ dualità
  /** Duale di un LP in forma generale con la tabella di conversione.
   * Primale di massimo: ≤ → π_i ≥ 0, = → π_i libera, ≥ → π_i ≤ 0;
   *                     x_j ≥ 0 → vincolo ≥ c_j, libera → = c_j, x_j ≤ 0 → ≤ c_j.
   * Primale di minimo: la tabella si legge da destra a sinistra. */
  function buildDual(g) {
    const max = g.sense === "max";
    const varSign = (rel) => (max ? { "<=": ">=0", "=": "free", ">=": "<=0" } : { ">=": ">=0", "=": "free", "<=": "<=0" })[rel];
    const consRel = (sg) => (max ? { ">=0": ">=", free: "=", "<=0": "<=" } : { ">=0": "<=", free: "=", "<=0": ">=" })[sg];
    const d = makeLP(max ? "min" : "max", g.b, transpose(g.A), g.c, g.sign.map(consRel), g.rel.map(varSign));
    const rules = {
      vars: g.rel.map((rel, i) => ({ i: i, rel: rel, sign: varSign(rel) })),
      cons: g.sign.map((sg, j) => ({ j: j, sign: sg, rel: consRel(sg) })),
    };
    return { dual: d, rules: rules };
  }
  const relOk = (lhs, rel, rhs) => (rel === "<=" ? lhs.le(rhs) : rel === ">=" ? lhs.ge(rhs) : lhs.eq(rhs));
  const signOk = (v, sg) => (sg === ">=0" ? v.ge(ZERO) : sg === "<=0" ? v.le(ZERO) : true);
  /** ammissibilità di x per un LP generale: {cons:[{i, lhs, rel, b, ok, slack}], signs:[{j, v, sign, ok}], ok, obj} */
  function feasibility(g, x) {
    const cons = g.A.map((row, i) => {
      const lhs = sum(row.map((a, j) => a.mul(x[j])));
      return { i: i, lhs: lhs, rel: g.rel[i], b: g.b[i], ok: relOk(lhs, g.rel[i], g.b[i]), slack: lhs.sub(g.b[i]) };
    });
    const signs = x.map((v, j) => ({ j: j, v: v, sign: g.sign[j], ok: signOk(v, g.sign[j]) }));
    return { cons: cons, signs: signs, ok: cons.every((c) => c.ok) && signs.every((s) => s.ok), obj: sum(g.c.map((c, j) => c.mul(x[j]))) };
  }
  /** verifica degli scarti complementari per una coppia (x̄, π̄) */
  function checkCS(g, x, pi) {
    x = x.map(F); pi = pi.map(F);
    const { dual } = buildDual(g);
    const pf = feasibility(g, x), df = feasibility(dual, pi);
    // π_i (a_i x − b_i) = 0  e  x_j (c_j − π A_j) = 0
    const rowsCS = pf.cons.map((c) => ({ i: c.i, pi: pi[c.i], slack: c.slack, prod: pi[c.i].mul(c.slack), ok: pi[c.i].mul(c.slack).isZero() }));
    const colsCS = df.cons.map((c) => ({ j: c.i, x: x[c.i], slack: c.lhs.sub(dual.b[c.i]), piA: c.lhs, c: dual.b[c.i], prod: x[c.i].mul(c.lhs.sub(dual.b[c.i])), ok: x[c.i].mul(c.lhs.sub(dual.b[c.i])).isZero() }));
    const csOk = rowsCS.every((r) => r.ok) && colsCS.every((r) => r.ok);
    return { dual: dual, primal: pf, dualF: df, rowsCS: rowsCS, colsCS: colsCS, csOk: csOk,
      z: pf.obj, w: df.obj, optimal: pf.ok && df.ok && csOk };
  }
  /** Procedura delle note: dato x̄ ammissibile, gli scarti complementari danno un sistema
   * per π̄ (π A_j = c_j se x̄_j ≠ 0; π_i = 0 se il vincolo i non è attivo); se π̄ è
   * ammissibile per il duale, x̄ è ottima. Se il sistema ha infinite soluzioni si
   * cerca una π̄ ammissibile risolvendo un LP (Fase 0). */
  function csFromX(g, x) {
    x = x.map(F);
    const { dual } = buildDual(g);
    const pf = feasibility(g, x);
    const res = { primal: pf, dual: dual, feasible: pf.ok };
    if (!pf.ok) return res;
    const eqs = [];
    x.forEach((v, j) => { if (!v.isZero()) eqs.push({ kind: "col", j: j, coef: g.A.map((r) => r[j]), rhs: g.c[j] }); });
    pf.cons.forEach((c) => { if (!c.slack.isZero()) eqs.push({ kind: "row", i: c.i, coef: g.A.map((_, k) => (k === c.i ? ONE : ZERO)), rhs: ZERO }); });
    res.eqs = eqs;
    const M = eqs.map((e) => e.coef), r = eqs.map((e) => e.rhs);
    const sol = eqs.length ? solveAny(M, r) : { consistent: true, unique: g.m === 0, x: Array(g.m).fill(ZERO), rank: 0 };
    res.system = sol;
    if (!sol.consistent) { res.optimal = false; res.reason = "inconsistent"; return res; }
    if (sol.unique) {
      res.pi = sol.x;
      res.dualF = feasibility(dual, sol.x);
      res.optimal = res.dualF.ok;
      res.reason = res.optimal ? "unique-feasible" : "unique-infeasible";
      return res;
    }
    // infinite soluzioni: esiste π ammissibile per il duale che soddisfa le equazioni?
    const A2 = dual.A.map((row) => row.slice()), b2 = dual.b.slice(), rel2 = dual.rel.slice();
    eqs.forEach((e) => { A2.push(e.coef.slice()); b2.push(e.rhs); rel2.push("="); });
    const feas = makeLP("max", dual.c.map(() => ZERO), A2, b2, rel2, dual.sign);
    const sv = solveGeneral(feas, { rule: "bland" });
    if (sv.outcome === "optimal") {
      res.pi = sv.x; res.dualF = feasibility(dual, sv.x); res.optimal = true; res.reason = "lp-feasible";
    } else { res.optimal = false; res.reason = "lp-infeasible"; }
    return res;
  }
  /** risolve un LP generale (via forma canonica): {outcome, x (variabili originali), z, canon, sol} */
  function solveGeneral(g, opt) {
    const cv = toCanonical(g);
    const sol = solveCanonical(cv.lp, opt);
    const out = { outcome: sol.outcome, canon: cv, sol: sol };
    if (sol.outcome === "optimal") {
      out.x = backToOriginal(g, cv, sol.x);
      out.z = sol.z.mul(cv.objSign);
      out.pi = dualsToOriginal(g, cv, sol.pi);
    }
    return out;
  }
  /** soluzione duale del problema originale dai moltiplicatori del canonico:
   * π_i = (±1 obiettivo) · Σ (±1 riga) π'_riga */
  function dualsToOriginal(g, cv, piC) {
    const pi = Array.from({ length: g.m }, () => ZERO);
    cv.rows.forEach((rw, k) => (pi[rw.i] = pi[rw.i].add(piC[k].mul(rw.s * cv.objSign))));
    return pi;
  }
  /** dai valori delle variabili canoniche (strutturali, poi scarti) a quelli originali */
  function backToOriginal(g, cv, xc) {
    const x = Array.from({ length: g.n }, () => ZERO);
    cv.cols.forEach((cl, k) => (x[cl.j] = x[cl.j].add(xc[k].mul(cl.s))));
    return x;
  }

  // ------------------------------------------------------------------ LaTeX (neutro rispetto alla lingua)
  const B_ = "\\pazocal{B}", N_ = "\\pazocal{N}";
  /** coefficiente·variabile senza segno: 1 → "x", 3 → "3\,x", 1/2 → "\frac{1}{2}\,x" */
  function texMag(c, v) { const a = c.abs(); return a.isOne() ? v : a.tex() + "\\," + v; }
  /** combinazione lineare in riga: "5\,x_1 + 2\,x_2" (zeri omessi; "0" se tutti nulli) */
  function texLin(coefs, names, opt) {
    opt = opt || {};
    let s = "";
    coefs.forEach((c, k) => {
      if (c.isZero()) return;
      if (s === "") s = (c.sign() < 0 ? "-" : "") + texMag(c, names[k]);
      else s += (c.sign() < 0 ? " - " : " + ") + texMag(c, names[k]);
    });
    return s === "" ? (opt.zero === undefined ? "0" : opt.zero) : s;
  }
  const texSet = (S) => "\\{" + S.join(",\\; ") + "\\}";
  const texVec = (v) => "\\begin{pmatrix}" + v.map((x) => (x instanceof Frac ? x.tex() : x)).join(" \\\\[0.4ex] ") + "\\end{pmatrix}";
  const texRow = (v) => "\\begin{pmatrix}" + v.map((x) => (x instanceof Frac ? x.tex() : x)).join(" & ") + "\\end{pmatrix}";
  const texMat = (M) => "\\begin{pmatrix}" + M.map((r) => r.map((x) => x.tex()).join(" & ")).join(" \\\\[0.4ex] ") + "\\end{pmatrix}";
  const REL_TEX = { "<=": "\\le", ">=": "\\ge", "=": "=" };
  const SIGN_TEX = { ">=0": "\\ge", "<=0": "\\le", free: "\\gtreqless" };

  /** problema in forma tabellare (come nelle note): opt.st = "\\text{subject to}", opt.v = "x" o "\\pi" */
  function texLP(g, opt) {
    opt = opt || {};
    const v = opt.v || "x";
    const names = opt.names || Array.from({ length: g.n }, (_, j) => v + "_{" + (j + 1) + "}");
    const spec = "r" + "r" + "cr".repeat(g.n - 1) + "cr";
    const cells = (coefs) => {
      const out = [];
      let first = true;
      coefs.forEach((c, k) => {
        if (k > 0) out.push(c.isZero() || first ? "" : c.sign() < 0 ? "-" : "+");
        if (c.isZero()) { out.push(""); return; }
        out.push(first ? (c.sign() < 0 ? "-" : "") + texMag(c, names[k]) : texMag(c, names[k]));
        first = false;
      });
      if (first) out[out.length - 1] = "0";
      return out;
    };
    const rows = [];
    rows.push(["\\" + g.sense].concat(cells(g.c)).concat(["", ""]).join(" & "));
    g.A.forEach((r, i) => rows.push([i === 0 ? opt.st || "\\text{subject to}" : ""].concat(cells(r)).concat([REL_TEX[g.rel[i]], g.b[i].tex()]).join(" & ")));
    // segni delle variabili, raggruppati come nelle note
    SIGNS.forEach((sg) => {
      const idx = g.sign.map((s, j) => (s === sg ? j : -1)).filter((j) => j >= 0);
      if (!idx.length) return;
      const cl = [""];
      for (let j = 0; j < g.n; j++) {
        if (j > 0) cl.push("");
        const k = idx.indexOf(j);
        cl.push(k < 0 ? "" : names[j] + (k < idx.length - 1 ? "," : ""));
      }
      cl.push(SIGN_TEX[sg], "0");
      rows.push(cl.join(" & "));
    });
    return "\\begin{array}{" + spec + "cr}" + rows.join(" \\\\[0.6ex] ") + "\\end{array}";
  }

  /** dizionario come nelle note (cases + colonne allineate).
   * opt: {names(k) → TeX, p (colonna pivot), r (riga pivot), objLabel, zeros (mostra 0·x nella riga obiettivo)} */
  function texDict(D, nameOf, opt) {
    opt = opt || {};
    const nn = D.N.length;
    const spec = "rcr" + "cr".repeat(nn);
    const hl = (s, on, col) => (on ? "\\" + (col || "red") + "{" + s + "}" : s);
    const line = (label, b0, coefs, isObj, rowIsPivot) => {
      const cells = [label, "=", b0];
      coefs.forEach((cf, q) => {
        const j = D.N[q];
        const colPiv = opt.p !== undefined && opt.p === j;
        if (cf.isZero() && !(isObj && opt.zeros)) { cells.push("", ""); return; }
        cells.push(cf.sign() < 0 ? "-" : "+");
        const t = texMag(cf, nameOf(j));
        cells.push(hl(t, colPiv || rowIsPivot, rowIsPivot && colPiv ? "red" : colPiv ? "blue" : "red"));
      });
      return cells.join(" & ");
    };
    const rows = D.B.map((i, k) => {
      const isR = opt.r !== undefined && opt.r === i;
      return line(hl(nameOf(i), isR, "red"), D.b[k].tex(), D.A[k].map((a) => a.neg()), false, isR);
    });
    const objLabel = opt.objLabel || (D.obj === "w" ? "-w" : D.obj === "zhat" ? "\\hat z" : "z");
    rows.push(line(objLabel, D.z.tex(), D.c, true, false));
    return "\\left\\{\\begin{array}{" + spec + "}" + rows.join(" \\\\[1ex] ") + "\\end{array}\\right.";
  }

  /** test dei rapporti come nelle note: sistema in t e t_m */
  function texRatios(rt, nameOf, tmName) {
    tmName = tmName || "t_{m}";
    const left = rt.ratios.map((q) => "\\underbrace{" + q.b.tex() + " - t \\cdot " + q.a.texP() + " \\ge 0}_{" + nameOf(q.i) + " \\ge 0}");
    const right = rt.ratios.map((q) => {
      if (q.a.isZero()) return q.b.tex() + " \\ge 0";
      const v = q.b.div(q.a).tex();
      return q.a.gt(ZERO) ? "t \\le " + v : "t \\ge " + v;
    });
    return "\\begin{cases}" + left.join(" \\\\[1ex] ") + "\\end{cases}\\qquad\\begin{cases}" + right.join(" \\\\[1ex] ") + "\\end{cases}";
  }

  // ------------------------------------------------------------------ istanze casuali (per «Esercitati»)
  function rnd(a, b, rng) { return a + Math.floor((rng || Math.random)() * (b - a + 1)); }
  const maxDen = (xs) => xs.reduce((m, x) => (x.d > m ? x.d : m), 1n);
  function dictDen(D) { return maxDen(D.b.concat(D.c, [D.z], ...D.A)); }
  /** genera un LP canonico «pulito». opt: {n, m, kind: "primal"|"phase0"|"dual", rng} */
  function genLP(opt) {
    opt = opt || {};
    const rng = opt.rng || Math.random;
    const kind = opt.kind || "primal";
    for (let tries = 0; tries < 400; tries++) {
      const n = opt.n || rnd(2, 3, rng), m = opt.m || rnd(2, 3, rng);
      const A = Array.from({ length: m }, () => Array.from({ length: n }, () => {
        const v = rnd(-2, 5, rng);
        return rng() < 0.15 ? 0 : v;
      }));
      let c, b;
      if (kind === "dual") {
        c = Array.from({ length: n }, () => -rnd(1, 5, rng));
        b = Array.from({ length: m }, () => rnd(-8, 10, rng));
        if (!b.some((v) => v < 0)) b[rnd(0, m - 1, rng)] = -rnd(2, 8, rng);
        for (let i = 0; i < m; i++) if (b[i] < 0) for (let j = 0; j < n; j++) if (rng() < 0.6) A[i][j] = -Math.abs(A[i][j] || 1);
      } else {
        c = Array.from({ length: n }, () => rnd(1, 6, rng));
        b = Array.from({ length: m }, () => rnd(2, 15, rng));
        if (kind === "phase0") {
          const i0 = rnd(0, m - 1, rng);
          b[i0] = -rnd(1, 6, rng);
          for (let j = 0; j < n; j++) A[i0][j] = -rnd(0, 2, rng);
          if (A[i0].every((v) => v === 0)) A[i0][0] = -1;
          if (rng() < 0.4) c[rnd(0, n - 1, rng)] = -rnd(1, 3, rng);
        }
      }
      const lp = canonical(c, A, b);
      let ok = true, den = 1n, nit = 0;
      if (kind === "dual") {
        const r = dualSimplex(lp, {});
        if (r.outcome !== "optimal" && r.outcome !== "infeasible") ok = false;
        else { r.run.dicts.forEach((D) => { const d = dictDen(D); if (d > den) den = d; }); nit = r.run.iters.length; }
        if (nit < 1 || nit > 3) ok = false;
        if (r.outcome === "infeasible" && rng() < 0.7) ok = false;   // più spesso un ottimo
      } else {
        const r = solveCanonical(lp, { rule: "largest" });
        if (r.outcome !== "optimal" && !(kind === "phase0" && r.outcome === "infeasible")) ok = false;
        const all = [];
        if (r.phase0) { all.push(...r.phase0.aux.dicts); if (r.phase0.start) all.push(r.phase0.start); nit += r.phase0.aux.iters.length; }
        if (r.run) { all.push(...r.run.dicts); nit += r.run.iters.length; }
        all.forEach((D) => { const d = dictDen(D); if (d > den) den = d; });
        if (r.run && (r.run.iters.length < (kind === "primal" ? 2 : 0) || r.run.iters.length > 3)) ok = false;
        if (kind === "phase0" && r.outcome === "infeasible" && rng() < 0.7) ok = false;
      }
      if (ok && den <= 6n) return lp;
    }
    return canonical([5, 2], [[-1, 3], [1, 2], [3, -2]], [12, 12, 8]);
  }
  /** LP generale casuale (costruttore del duale, scarti complementari) */
  function genGeneral(opt) {
    opt = opt || {};
    const rng = opt.rng || Math.random;
    const n = opt.n || rnd(2, 4, rng), m = opt.m || rnd(2, 4, rng);
    const A = Array.from({ length: m }, () => Array.from({ length: n }, () => (rng() < 0.2 ? 0 : rnd(-4, 6, rng))));
    const c = Array.from({ length: n }, () => rnd(-5, 8, rng));
    const b = Array.from({ length: m }, () => rnd(-6, 20, rng));
    const rel = Array.from({ length: m }, () => SENSES[rnd(0, 2, rng)]);
    const sign = Array.from({ length: n }, () => SIGNS[rng() < 0.6 ? 0 : rnd(1, 2, rng)]);
    return makeLP(rng() < 0.5 ? "max" : "min", c, A, b, rel, sign);
  }

  return {
    Frac: Frac, ZERO: ZERO, ONE: ONE, F: F,
    solveSystem: solveSystem, solveAny: solveAny, transpose: transpose,
    makeLP: makeLP, parseLP: parseLP, lpToString: lpToString, isCanonical: isCanonical, toCanonical: toCanonical,
    canonical: canonical, varName: varName, column: column, cost: cost, backToOriginal: backToOriginal,
    initialDict: initialDict, pivotDict: pivotDict, sortDict: sortDict, cloneDict: cloneDict, dictValues: dictValues,
    dictFromBasis: dictFromBasis, dictEq: dictEq, restoreObjective: restoreObjective,
    chooseColumn: chooseColumn, ratioTest: ratioTest, dualRatio: dualRatio,
    primalSimplex: primalSimplex, phaseZero: phaseZero, solveCanonical: solveCanonical, duals: duals,
    dualSimplexFrom: dualSimplexFrom, dualSimplex: dualSimplex,
    basisMatrix: basisMatrix, revisedPrimal: revisedPrimal, revisedDual: revisedDual,
    buildDual: buildDual, feasibility: feasibility, checkCS: checkCS, csFromX: csFromX, solveGeneral: solveGeneral, dualsToOriginal: dualsToOriginal,
    texMag: texMag, texLin: texLin, texSet: texSet, texVec: texVec, texRow: texRow, texMat: texMat, texLP: texLP,
    texDict: texDict, texRatios: texRatios, REL_TEX: REL_TEX, SIGN_TEX: SIGN_TEX, B_: B_, N_: N_,
    SENSES: SENSES, SIGNS: SIGNS, gen: { lp: genLP, general: genGeneral, rnd: rnd },
  };
});
