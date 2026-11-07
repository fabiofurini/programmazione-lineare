// Autovalutazione — domande generate del modulo «linear-programming»
// (Programmazione lineare / Linear Programming). Formato: QUIZ_SPEC.md.
// Ogni generatore: genera(rng, lingua) -> { testo, opzioni, corretta, spiegazione, verifica }.
// Il campo «verifica» (dati dell'istanza e valore di ogni opzione) serve solo ai controlli
// in quiz/verifica/: l'app lo ignora. L'istanza dipende solo da rng, non dalla lingua.
window.QUIZ_GEN = window.QUIZ_GEN || {};
(function () {
  "use strict";
  var MOD = "linear-programming";
  var G = (QUIZ_GEN[MOD] = QUIZ_GEN[MOD] || []);

  // ------------------------------------------------------------------ link
  var BASE = {
    it: "https://fabiofurini.github.io/programmazione-lineare/",
    en: "https://fabiofurini.github.io/linear-programming/"
  };
  var PAG = {
    "01-linear-functions": ["problemi-pl/01-funzioni-lineari/", "lp-problems/01-linear-functions/"],
    "02-polyhedra": ["problemi-pl/02-poliedri/", "lp-problems/02-polyhedra/"],
    "03-linear-optimization-problems": ["problemi-pl/03-problemi-ottimizzazione-lineare/", "lp-problems/03-linear-optimization-problems/"],
    "04-lp-problems": ["problemi-pl/04-problemi-pl/", "lp-problems/04-lp-problems/"],
    "05-outcomes-equivalences": ["problemi-pl/05-esiti-equivalenze/", "lp-problems/05-outcomes-equivalences/"],
    "06-simplex": ["simplesso/06-simplesso/", "simplex/06-simplex/"],
    "07-optimality-pivot": ["simplesso/07-ottimalita-pivot/", "simplex/07-optimality-pivot/"],
    "08-phase-zero": ["simplesso/08-fase-zero/", "simplex/08-phase-zero/"],
    "09-duality": ["dualita/09-dualita/", "duality/09-duality/"],
    "10-dual-simplex": ["dualita/10-simplesso-duale/", "duality/10-dual-simplex/"],
    "11-revised-simplex": ["metodi-avanzati/11-simplesso-rivisto/", "advanced-methods/11-revised-simplex/"],
    "12-revised-dual": ["metodi-avanzati/12-rivisto-duale/", "advanced-methods/12-revised-dual/"],
    "13-primal-dual": ["metodi-avanzati/13-primale-duale/", "advanced-methods/13-primal-dual/"],
    "14-sensitivity": ["metodi-avanzati/14-sensitivita/", "advanced-methods/14-sensitivity/"],
    "15-geometry": ["metodi-avanzati/15-geometria/", "advanced-methods/15-geometry/"],
    "16-modelling": ["modellazione/16-modellazione/", "modelling/16-modelling/"]
  };
  function link(cap, ancIt, ancEn) {
    if (ancEn === undefined) ancEn = ancIt;
    return {
      it: BASE.it + PAG[cap][0] + (ancIt ? "#" + ancIt : ""),
      en: BASE.en + PAG[cap][1] + (ancEn ? "#" + ancEn : "")
    };
  }

  // ------------------------------------------------------- frazioni esatte
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  function Q(n, d) {
    if (d === undefined) d = 1;
    if (d === 0) throw new Error("divisione per zero");
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d);
    this.n = n / g; this.d = d / g;
  }
  function q(x) { return x instanceof Q ? x : new Q(x, 1); }
  Q.prototype.add = function (o) { o = q(o); return new Q(this.n * o.d + o.n * this.d, this.d * o.d); };
  Q.prototype.sub = function (o) { o = q(o); return new Q(this.n * o.d - o.n * this.d, this.d * o.d); };
  Q.prototype.mul = function (o) { o = q(o); return new Q(this.n * o.n, this.d * o.d); };
  Q.prototype.div = function (o) { o = q(o); return new Q(this.n * o.d, this.d * o.n); };
  Q.prototype.neg = function () { return new Q(-this.n, this.d); };
  Q.prototype.abs = function () { return new Q(Math.abs(this.n), this.d); };
  Q.prototype.sgn = function () { return this.n > 0 ? 1 : (this.n < 0 ? -1 : 0); };
  Q.prototype.cmp = function (o) { return this.sub(o).sgn(); };
  Q.prototype.eq = function (o) { return this.cmp(o) === 0; };
  Q.prototype.isZero = function () { return this.n === 0; };
  Q.prototype.isOne = function () { return this.n === 1 && this.d === 1; };
  Q.prototype.tex = function () {
    if (this.d === 1) return String(this.n);
    return (this.n < 0 ? "-" : "") + "\\frac{" + Math.abs(this.n) + "}{" + this.d + "}";
  };
  Q.prototype.key = function () { return this.d === 1 ? String(this.n) : this.n + "/" + this.d; };
  function qmin(arr) { var m = arr[0]; arr.forEach(function (x) { if (x.cmp(m) < 0) m = x; }); return m; }
  function qmax(arr) { var m = arr[0]; arr.forEach(function (x) { if (x.cmp(m) > 0) m = x; }); return m; }

  // ------------------------------------------------------------ casualità
  function ri(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function nz(rng, a, b) { var v = 0; while (v === 0) v = ri(rng, a, b); return v; }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }
  // righe non nulle e a due a due non proporzionali (niente vincoli ripetuti o paralleli)
  function righeBuone(A) {
    for (var i = 0; i < A.length; i++) {
      if (A[i].every(function (v) { return v === 0; })) return false;
      for (var k = i + 1; k < A.length; k++) {
        var prop = true;
        for (var u = 0; u < A[i].length; u++) for (var w = u + 1; w < A[i].length; w++)
          if (A[i][u] * A[k][w] - A[i][w] * A[k][u] !== 0) prop = false;
        if (prop) return false;
      }
    }
    return true;
  }
  function tenta(f) {
    for (var k = 0; k < 4000; k++) { var r = f(); if (r) return r; }
    throw new Error("nessuna istanza valida");
  }

  // ------------------------------------------------------------- scrittura
  function xv(j) { return j < 10 ? "x_" + j : "x_{" + j + "}"; }
  function xs(n) { var r = []; for (var j = 1; j <= n; j++) r.push(xv(j)); return r; }
  function term(c, name) { var a = c.abs(); return (a.isOne() ? "" : a.tex() + "\\," ) + name; }
  // combinazione lineare (senza costante)
  function lin(coefs, names) {
    var s = "";
    coefs.forEach(function (c, k) {
      c = q(c); if (c.isZero()) return;
      if (s === "") s = (c.sgn() < 0 ? "-" : "") + term(c, names[k]);
      else s += (c.sgn() < 0 ? " - " : " + ") + term(c, names[k]);
    });
    return s === "" ? "0" : s;
  }
  // costante + combinazione lineare (la costante si scrive sempre, come nelle dispense)
  function aff(c0, coefs, names) {
    var s = q(c0).tex();
    coefs.forEach(function (c, k) {
      c = q(c); if (c.isZero()) return;
      s += (c.sgn() < 0 ? " - " : " + ") + term(c, names[k]);
    });
    return s;
  }
  var SOGG = { it: "\\text{soggetto a}", en: "\\text{subject to}" };
  var SEGNO = { le: "\\le", ge: "\\ge", eq: "=" };
  // problema LP: senso "max"/"min", c, righe (coefficienti), versi, termini noti, riga dei domini
  function lpTex(lang, senso, c, righe, versi, rhs, domini, nomi) {
    var n = c.length; nomi = nomi || xs(n);
    var s = "$\\begin{array}{rl} \\" + senso + " & " + lin(c, nomi);
    righe.forEach(function (r, i) {
      s += " \\\\ " + (i === 0 ? SOGG[lang] : "") + " & " + lin(r, nomi) + " " + SEGNO[versi[i]] + " " + q(rhs[i]).tex();
    });
    s += " \\\\ & " + (domini || nomi.join(", ") + " \\ge 0") + " \\end{array}$";
    return s;
  }
  function insieme(arr) { return "\\{" + arr.join(", ") + "\\}"; }
  function vett(arr) { return "(" + arr.map(function (v) { return q(v).tex(); }).join(", ") + ")"; }
  function colonna(arr) { return "\\begin{pmatrix} " + arr.map(function (v) { return q(v).tex(); }).join(" \\\\ ") + " \\end{pmatrix}"; }
  function matrice(M) {
    return "\\begin{pmatrix} " + M.map(function (r) { return r.map(function (v) { return q(v).tex(); }).join(" & "); }).join(" \\\\ ") + " \\end{pmatrix}";
  }
  function par(v) { v = q(v); return v.sgn() < 0 ? "(" + v.tex() + ")" : v.tex(); }

  // ---------------------------------------------------- dizionari del simplesso
  // D = { B:[..], N:[..], b:{i:Q}, a:{i:{j:Q}}, c:{j:Q}, z:Q }
  // con la convenzione delle dispense: x_i = b_i - sum_j a_ij x_j,  z = z + sum_j c_j x_j
  function ord(a) { return a.slice().sort(function (u, v) { return u - v; }); }
  function copiaD(D) {
    var E = { B: D.B.slice(), N: D.N.slice(), b: {}, a: {}, c: {}, z: D.z };
    D.B.forEach(function (i) { E.b[i] = D.b[i]; E.a[i] = {}; D.N.forEach(function (j) { E.a[i][j] = D.a[i][j]; }); });
    D.N.forEach(function (j) { E.c[j] = D.c[j]; });
    return E;
  }
  function dizIniziale(A, b, c) {
    var m = A.length, n = c.length;
    var D = { B: range(n + 1, n + m), N: range(1, n), b: {}, a: {}, c: {}, z: q(0) };
    for (var i = 0; i < m; i++) {
      D.b[n + 1 + i] = q(b[i]); D.a[n + 1 + i] = {};
      for (var j = 0; j < n; j++) D.a[n + 1 + i][j + 1] = q(A[i][j]);
    }
    for (var j2 = 0; j2 < n; j2++) D.c[j2 + 1] = q(c[j2]);
    return D;
  }
  function pivot(D, p, r) {
    var E = { B: ord(D.B.filter(function (i) { return i !== r; }).concat([p])),
              N: ord(D.N.filter(function (j) { return j !== p; }).concat([r])), b: {}, a: {}, c: {}, z: null };
    var arp = D.a[r][p];
    var bp = D.b[r].div(arp), ap = {};
    D.N.forEach(function (j) { if (j !== p) ap[j] = D.a[r][j].div(arp); });
    ap[r] = q(1).div(arp);
    E.b[p] = bp; E.a[p] = ap;
    D.B.forEach(function (i) {
      if (i === r) return;
      var aip = D.a[i][p];
      E.b[i] = D.b[i].sub(aip.mul(bp)); E.a[i] = {};
      E.N.forEach(function (j) {
        var vecchio = (j === r) ? q(0) : D.a[i][j];
        E.a[i][j] = vecchio.sub(aip.mul(ap[j]));
      });
    });
    var cp = D.c[p];
    E.z = D.z.add(cp.mul(bp));
    E.N.forEach(function (j) {
      var vecchio = (j === r) ? q(0) : D.c[j];
      E.c[j] = vecchio.sub(cp.mul(ap[j]));
    });
    return E;
  }
  // test dei rapporti (regola di Bland): restituisce {t, r} oppure null se illimitato
  function testRapporti(D, p) {
    var t = null, r = null;
    D.B.forEach(function (i) {
      var a = D.a[i][p];
      if (a.sgn() > 0) {
        var v = D.b[i].div(a);
        if (t === null || v.cmp(t) < 0 || (v.eq(t) && i < r)) { t = v; r = i; }
      }
    });
    return t === null ? null : { t: t, r: r };
  }
  function colonnaBland(D) {
    for (var k = 0; k < D.N.length; k++) if (D.c[D.N[k]].sgn() > 0) return D.N[k];
    return null;
  }
  // simplesso con la regola di Bland: { stato: "ottimo"|"illimitato"|"troppo", storia:[{D,p,r,t}], D }
  function simplesso(D0) {
    var D = D0, storia = [];
    for (var it = 0; it < 60; it++) {
      var p = colonnaBland(D);
      if (p === null) return { stato: "ottimo", storia: storia, D: D };
      var tr = testRapporti(D, p);
      if (!tr) return { stato: "illimitato", storia: storia, D: D, p: p };
      storia.push({ D: D, p: p, r: tr.r, t: tr.t });
      D = pivot(D, p, tr.r);
    }
    return { stato: "troppo", storia: storia, D: D };
  }
  // passo del simplesso duale (Bland): {r, p, s} oppure {r, p:null} (certificato di inammissibilità) oppure null (ottimo)
  function passoDuale(D) {
    var r = null;
    for (var k = 0; k < D.B.length; k++) if (D.b[D.B[k]].sgn() < 0) { r = D.B[k]; break; }
    if (r === null) return null;
    var s = null, p = null;
    D.N.forEach(function (j) {
      var a = D.a[r][j];
      if (a.sgn() < 0) {
        var v = D.c[j].div(a);
        if (s === null || v.cmp(s) < 0 || (v.eq(s) && j < p)) { s = v; p = j; }
      }
    });
    return { r: r, p: p, s: s };
  }
  function simplessoDuale(D0) {
    var D = D0, storia = [];
    for (var it = 0; it < 60; it++) {
      var ps = passoDuale(D);
      if (ps === null) return { stato: "ottimo", storia: storia, D: D };
      if (ps.p === null) return { stato: "inammissibile", storia: storia, D: D, r: ps.r };
      storia.push({ D: D, p: ps.p, r: ps.r, s: ps.s });
      D = pivot(D, ps.p, ps.r);
    }
    return { stato: "troppo", storia: storia, D: D };
  }
  function puntoD(D, n) { var x = []; for (var j = 1; j <= n; j++) x.push(D.B.indexOf(j) >= 0 ? D.b[j] : q(0)); return x; }
  function maxDen(D) {
    var m = D.z.d;
    D.B.forEach(function (i) { m = Math.max(m, D.b[i].d); D.N.forEach(function (j) { m = Math.max(m, D.a[i][j].d); }); });
    D.N.forEach(function (j) { m = Math.max(m, D.c[j].d); });
    return m;
  }
  function maxAbs(D) {
    var m = Math.abs(D.z.n);
    D.B.forEach(function (i) { m = Math.max(m, Math.abs(D.b[i].n)); D.N.forEach(function (j) { m = Math.max(m, Math.abs(D.a[i][j].n)); }); });
    D.N.forEach(function (j) { m = Math.max(m, Math.abs(D.c[j].n)); });
    return m;
  }
  function dizTex(D) {
    var s = "$\\begin{array}{rcl} ";
    D.B.forEach(function (i) {
      s += xv(i) + " & = & " + aff(D.b[i], D.N.map(function (j) { return D.a[i][j].neg(); }), D.N.map(xv)) + " \\\\ ";
    });
    s += "z & = & " + aff(D.z, D.N.map(function (j) { return D.c[j]; }), D.N.map(xv)) + " \\end{array}$";
    return s;
  }
  function partTex(D) {
    return "$\\pazocal{B} = " + insieme(D.B) + "$, $\\pazocal{N} = " + insieme(D.N) + "$";
  }
  function dizDati(D) {
    var o = { B: D.B, N: D.N, b: {}, a: {}, c: {}, z: D.z.key() };
    D.B.forEach(function (i) { o.b[i] = D.b[i].key(); o.a[i] = {}; D.N.forEach(function (j) { o.a[i][j] = D.a[i][j].key(); }); });
    D.N.forEach(function (j) { o.c[j] = D.c[j].key(); });
    return o;
  }
  function dizCasuale(rng, m, nn, amin, amax) {
    var idx = shuffle(rng, range(1, m + nn));
    var D = { B: ord(idx.slice(0, m)), N: ord(idx.slice(m)), b: {}, a: {}, c: {}, z: q(ri(rng, 0, 12)) };
    D.B.forEach(function (i) {
      D.b[i] = q(ri(rng, 1, 9)); D.a[i] = {};
      D.N.forEach(function (j) { D.a[i][j] = q(ri(rng, amin, amax)); });
    });
    D.N.forEach(function (j) { D.c[j] = q(ri(rng, -4, 5)); });
    return D;
  }

  // ---------------------------------------------------------- opzioni
  // giusta, sbagliate: {it, en, v}; restituisce null se due opzioni coincidono
  function impacchetta(rng, lang, giusta, sbagliate, testo, spieg, dati) {
    if (sbagliate.length !== 3) return null;
    var tutte = [giusta].concat(sbagliate);
    for (var a = 0; a < 4; a++) for (var b = a + 1; b < 4; b++) {
      if (tutte[a].v === tutte[b].v || tutte[a].it === tutte[b].it || tutte[a].en === tutte[b].en) return null;
    }
    var ordine = shuffle(rng, [0, 1, 2, 3]);
    return {
      testo: testo[lang],
      opzioni: ordine.map(function (k) { return tutte[k][lang]; }),
      corretta: ordine.indexOf(0),
      spiegazione: spieg[lang],
      verifica: { dati: dati, valori: ordine.map(function (k) { return tutte[k].v; }) }
    };
  }
  // testi comuni che rendono autocontenute le domande sui dizionari
  var DIZ_PRE = {
    it: "Nell'algoritmo del simplesso per un problema LP in forma standard di massimo (tutte le variabili $x_j \\ge 0$), si consideri il dizionario con ",
    en: "In the simplex algorithm for an LP problem in standard maximization form (all variables $x_j \\ge 0$), consider the dictionary with "
  };
  var DIZ_CONV = {
    it: " (nella riga di $x_i$ il coefficiente di $x_j$ è $-\\bar a_{ij}$; la riga di $z$ riporta il valore $\\bar z$ e i costi ridotti $\\bar c_j$)",
    en: " (in the row of $x_i$ the coefficient of $x_j$ is $-\\bar a_{ij}$; the row of $z$ shows the value $\\bar z$ and the reduced costs $\\bar c_j$)"
  };
  var BLAND = {
    it: "regola di Bland (colonna pivot: la variabile fuori base di indice minimo con $\\bar c_j > 0$; riga pivot: test dei rapporti $\\min\\{\\bar b_i / \\bar a_{ip} : \\bar a_{ip} > 0\\}$, a parità l'indice minimo)",
    en: "Bland's rule (pivot column: the non-basic variable with the smallest index and $\\bar c_j > 0$; pivot row: ratio test $\\min\\{\\bar b_i / \\bar a_{ip} : \\bar a_{ip} > 0\\}$, ties broken by the smallest index)"
  };
  var BLAND_D = {
    it: "regola di Bland del simplesso duale (riga pivot: la variabile in base di indice minimo con $\\bar b_r < 0$; colonna pivot: $\\min\\{\\bar c_j / \\bar a_{rj} : \\bar a_{rj} < 0\\}$, a parità l'indice minimo)",
    en: "Bland's rule of the dual simplex algorithm (pivot row: the basic variable with the smallest index and $\\bar b_r < 0$; pivot column: $\\min\\{\\bar c_j / \\bar a_{rj} : \\bar a_{rj} < 0\\}$, ties broken by the smallest index)"
  };
  var PIDEF = {
    it: " ($\\tilde\\pi_i$ è la variabile duale associata al vincolo $i$)",
    en: " ($\\tilde\\pi_i$ is the dual variable associated with constraint $i$)"
  };
  var AUXDEF = {
    it: "problema ausiliario del simplesso $\\max\\{-x_0 : \\sum_j a_{ij} x_j - x_0 \\le b_i~ \\forall i,~ {\\boldsymbol x} \\ge {\\boldsymbol 0},~ x_0 \\ge 0\\}$",
    en: "simplex auxiliary problem $\\max\\{-x_0 : \\sum_j a_{ij} x_j - x_0 \\le b_i~ \\forall i,~ {\\boldsymbol x} \\ge {\\boldsymbol 0},~ x_0 \\ge 0\\}$"
  };

  function opz(it, en, v) { return { it: it, en: en === undefined ? it : en, v: v }; }
  // sceglie fino a k candidati distinti fra loro e dalla giusta (per valore v)
  function scegli(cand, giusta, k) {
    var out = [], visti = {}; visti[giusta.v] = 1;
    for (var i = 0; i < cand.length && out.length < k; i++) {
      var c = cand[i]; if (!c || visti[c.v]) continue;
      visti[c.v] = 1; out.push(c);
    }
    return out.length === k ? out : null;
  }

  // ======================================================================
  // 1. Insiemi di livello (cap. 1)
  G.push({
    id: "lp-g-insieme-livello", livello: "facile", capitolo: "01-linear-functions",
    link: link("01-linear-functions", "box-4-def-levelsets"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var c1 = nz(rng, -5, 5), c2 = nz(rng, -5, 5);
        if (Math.abs(c1) === Math.abs(c2)) return null;
        var p = [ri(rng, -3, 4), ri(rng, -3, 4)];
        var f = function (x) { return c1 * x[0] + c2 * x[1]; };
        var k = f(p); if (k === 0) return null;
        var sw = [p[1], p[0]], gr = [p[0] + c1, p[1] + c2], ng = [-p[0], -p[1]];
        if (f(sw) === k) return null;
        var fx = lin([c1, c2], ["x_1", "x_2"]);
        var P = function (x) { return "$" + colonna(x) + "$"; };
        var mk = function (x) { return opz(P(x), P(x), x.join(",")); };
        var testo = {
          it: "Si consideri la funzione lineare $f({\\boldsymbol x}) = " + fx + "$. Quale dei seguenti punti appartiene all'insieme di livello $\\{{\\boldsymbol x} \\in \\R^2 : f({\\boldsymbol x}) = " + k + "\\}$?",
          en: "Consider the linear function $f({\\boldsymbol x}) = " + fx + "$. Which of the following points belongs to the level set $\\{{\\boldsymbol x} \\in \\R^2 : f({\\boldsymbol x}) = " + k + "\\}$?"
        };
        var conto = c1 + " \\cdot " + par(p[0]) + (c2 < 0 ? " - " : " + ") + Math.abs(c2) + " \\cdot " + par(p[1]) + " = " + k;
        var spieg = {
          it: "Si ha $" + conto + "$. Gli insiemi di livello sono rette perpendicolari al gradiente $\\nabla f = " + vett([c1, c2]) + "$: spostandosi lungo il gradiente il valore cambia, il punto opposto dà il valore $" + (-k) + "$ e scambiare le coordinate non conserva il valore.",
          en: "We have $" + conto + "$. The level sets are lines perpendicular to the gradient $\\nabla f = " + vett([c1, c2]) + "$: moving along the gradient changes the value, the opposite point gives the value $" + (-k) + "$ and swapping the coordinates does not preserve the value."
        };
        return impacchetta(rng, lingua, mk(p), [mk(sw), mk(gr), mk(ng)], testo, spieg, { c: [c1, c2], k: k });
      });
    }
  });

  // ======================================================================
  // 2. Appartenenza a un poliedro (cap. 2)
  G.push({
    id: "lp-g-poliedro-punto", livello: "facile", capitolo: "02-polyhedra",
    link: link("02-polyhedra", "box-3-defXX"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [], b = [], P = [ri(rng, 0, 3), ri(rng, 0, 3)];
        for (var i = 0; i < 3; i++) {
          var a = [ri(rng, -3, 3), ri(rng, -3, 3)];
          if (a[0] === 0 && a[1] === 0) return null;
          A.push(a); b.push(a[0] * P[0] + a[1] * P[1] + ri(rng, 0, 2));
        }
        if (!righeBuone(A)) return null;
        var viol = function (x) { var v = []; for (var i = 0; i < 3; i++) if (A[i][0] * x[0] + A[i][1] * x[1] > b[i]) v.push(i); return v; };
        var gruppi = [[], [], []];
        for (var x1 = -2; x1 <= 5; x1++) for (var x2 = -2; x2 <= 5; x2++) {
          if (x1 === P[0] && x2 === P[1]) continue;
          var v = viol([x1, x2]); if (v.length === 1) gruppi[v[0]].push([x1, x2]);
        }
        var scelti = [];
        shuffle(rng, [0, 1, 2]).forEach(function (g) { if (gruppi[g].length) scelti.push({ x: pick(rng, gruppi[g]), g: g }); });
        if (scelti.length < 3) return null;
        var righe = A.map(function (a, i) { return lin(a, ["x_1", "x_2"]) + " \\le " + b[i]; });
        var Pt = function (x) { return "$" + colonna(x) + "$"; };
        var testo = {
          it: "Si consideri il poliedro $P = \\{{\\boldsymbol x} \\in \\R^2 : " + righe.join(",~ ") + "\\}$. Quale dei seguenti punti appartiene a $P$?",
          en: "Consider the polyhedron $P = \\{{\\boldsymbol x} \\in \\R^2 : " + righe.join(",~ ") + "\\}$. Which of the following points belongs to $P$?"
        };
        var dett = function (lang) {
          return scelti.map(function (s) {
            var val = A[s.g][0] * s.x[0] + A[s.g][1] * s.x[1];
            return "$" + vett(s.x) + "$ " + (lang === "it" ? "viola il vincolo " : "violates constraint ") + (s.g + 1) + " ($" + val + " > " + b[s.g] + "$)";
          }).join("; ");
        };
        var spieg = {
          it: "Il punto $" + vett(P) + "$ soddisfa le tre disuguaglianze, quindi appartiene all'intersezione dei tre semispazi. Gli altri: " + dett("it") + ".",
          en: "The point $" + vett(P) + "$ satisfies the three inequalities, so it belongs to the intersection of the three half-spaces. The others: " + dett("en") + "."
        };
        var mk = function (x) { return opz(Pt(x), Pt(x), x.join(",")); };
        return impacchetta(rng, lingua, mk(P), scelti.map(function (s) { return mk(s.x); }), testo, spieg, { A: A, b: b });
      });
    }
  });

  // ======================================================================
  // 3. Soluzione ammissibile e lower bound (cap. 4)
  G.push({
    id: "lp-g-lower-bound", livello: "facile", capitolo: "04-lp-problems",
    link: link("04-lp-problems", "box-7-defLBCanonical"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var c = [ri(rng, 1, 6), ri(rng, 1, 6)]; if (c[0] === c[1]) return null;
        var A = [], b = [];
        for (var i = 0; i < 3; i++) { A.push([ri(rng, -2, 4), ri(rng, -2, 4)]); b.push(ri(rng, 4, 14)); }
        if (!righeBuone(A)) return null;
        var amm = function (x) { if (x[0] < 0 || x[1] < 0) return false; for (var i = 0; i < 3; i++) if (A[i][0] * x[0] + A[i][1] * x[1] > b[i]) return false; return true; };
        var soloVincoli = function (x) { for (var i = 0; i < 3; i++) if (A[i][0] * x[0] + A[i][1] * x[1] > b[i]) return false; return true; };
        var f = function (x) { return c[0] * x[0] + c[1] * x[1]; };
        var feas = [], inf1 = [], neg = [];
        for (var x1 = -3; x1 <= 7; x1++) for (var x2 = -3; x2 <= 7; x2++) {
          var x = [x1, x2];
          if (x1 >= 0 && x2 >= 0) { if (amm(x)) { if (x1 + x2 > 0) feas.push(x); } else inf1.push(x); }
          else if (soloVincoli(x) && (x1 >= -2 && x2 >= -2)) neg.push(x);
        }
        if (feas.length < 2 || !inf1.length || !neg.length) return null;
        var F = shuffle(rng, feas); var F1 = F[0], F2 = F[1];
        var I1 = pick(rng, inf1), N1 = pick(rng, neg);
        var vsw = c[1] * F2[0] + c[0] * F2[1]; if (vsw === f(F2)) return null;
        var mk = function (x, v) {
          return opz("$\\bar x_1 = " + x[0] + ",~ \\bar x_2 = " + x[1] + "$: " + "soluzione ammissibile con $LB(\\bar{\\boldsymbol x}) = " + v + "$",
                     "$\\bar x_1 = " + x[0] + ",~ \\bar x_2 = " + x[1] + "$: " + "feasible solution with $LB(\\bar{\\boldsymbol x}) = " + v + "$",
                     x.join(",") + "|" + v);
        };
        var testo = {
          it: "Si consideri il problema LP in forma canonica di massimo " + lpTex("it", "max", c, A, ["le", "le", "le"], b) + ", di valore ottimo $z(LP)$. Ogni soluzione ammissibile $\\bar{\\boldsymbol x}$ dà il lower bound $LB(\\bar{\\boldsymbol x}) = {\\boldsymbol c}'\\bar{\\boldsymbol x} \\le z(LP)$. Quale delle seguenti affermazioni è corretta?",
          en: "Consider the LP problem in canonical maximization form " + lpTex("en", "max", c, A, ["le", "le", "le"], b) + ", with optimal value $z(LP)$. Every feasible solution $\\bar{\\boldsymbol x}$ gives the lower bound $LB(\\bar{\\boldsymbol x}) = {\\boldsymbol c}'\\bar{\\boldsymbol x} \\le z(LP)$. Which of the following statements is correct?"
        };
        var violato = function (x) { for (var i = 0; i < 3; i++) if (A[i][0] * x[0] + A[i][1] * x[1] > b[i]) return i + 1; return 0; };
        var spieg = {
          it: "Il punto $" + vett(F1) + "$ soddisfa i tre vincoli e la non negatività, e $LB(\\bar{\\boldsymbol x}) = " + c[0] + " \\cdot " + F1[0] + " + " + c[1] + " \\cdot " + F1[1] + " = " + f(F1) + " \\le z(LP)$. Il punto $" + vett(I1) + "$ viola il vincolo " + violato(I1) + ", $" + vett(N1) + "$ viola la non negatività e per $" + vett(F2) + "$ il valore corretto è $" + f(F2) + "$.",
          en: "The point $" + vett(F1) + "$ satisfies the three constraints and non-negativity, and $LB(\\bar{\\boldsymbol x}) = " + c[0] + " \\cdot " + F1[0] + " + " + c[1] + " \\cdot " + F1[1] + " = " + f(F1) + " \\le z(LP)$. The point $" + vett(I1) + "$ violates constraint " + violato(I1) + ", $" + vett(N1) + "$ violates non-negativity and for $" + vett(F2) + "$ the correct value is $" + f(F2) + "$."
        };
        return impacchetta(rng, lingua, mk(F1, f(F1)), [mk(I1, f(I1)), mk(N1, f(N1)), mk(F2, vsw)], testo, spieg, { c: c, A: A, b: b });
      });
    }
  });

  // ======================================================================
  // 4. Metodo grafico (cap. 4)
  G.push({
    id: "lp-g-metodo-grafico", livello: "media", capitolo: "04-lp-problems",
    link: link("04-lp-problems", "413-metodo-grafico", "413-graphical-solution-method"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var V = [ri(rng, 1, 5), ri(rng, 1, 5)];
        var a1 = [ri(rng, 1, 5), ri(rng, 1, 5)], a2 = [ri(rng, 1, 5), ri(rng, 1, 5)];
        var b1 = a1[0] * V[0] + a1[1] * V[1], b2 = a2[0] * V[0] + a2[1] * V[1];
        var X = [new Q(b1, a1[0]), new Q(b2, a2[0])], Y = [new Q(b1, a1[1]), new Q(b2, a2[1])];
        var incrocio = (X[0].cmp(X[1]) < 0 && Y[0].cmp(Y[1]) > 0) || (X[0].cmp(X[1]) > 0 && Y[0].cmp(Y[1]) < 0);
        if (!incrocio) return null;
        var c = [ri(rng, 1, 6), ri(rng, 1, 6)];
        var z = function (x) { return q(x[0]).mul(c[0]).add(q(x[1]).mul(c[1])); };
        var PA = [qmin(X), q(0)], PC = [q(0), qmin(Y)], PV = [q(V[0]), q(V[1])];
        var E1 = [qmax(X), q(0)], E2 = [q(0), qmax(Y)];
        var vert = [PA, PV, PC];
        var vals = vert.map(z);
        var best = 0; for (var k = 1; k < 3; k++) if (vals[k].cmp(vals[best]) > 0) best = k;
        for (var k2 = 0; k2 < 3; k2++) if (k2 !== best && vals[k2].eq(vals[best])) return null;
        var E = z(E1).cmp(z(E2)) > 0 ? E1 : E2;
        var mk = function (x) {
          var s = "$\\tilde x_1 = " + x[0].tex() + ",~ \\tilde x_2 = " + x[1].tex() + ",~ z(\\, LP \\,) = " + z(x).tex() + "$";
          return opz(s, s, x[0].key() + "," + x[1].key() + "|" + z(x).key());
        };
        var altre = [0, 1, 2].filter(function (k) { return k !== best; }).map(function (k) { return mk(vert[k]); });
        var testo = {
          it: "Si risolva con il metodo grafico il problema LP " + lpTex("it", "max", c, [a1, a2], ["le", "le"], [b1, b2]) + " (la soluzione ottima è unica). Quali sono la soluzione ottima $\\tilde{\\boldsymbol x}$ e il valore ottimo $z(LP)$?",
          en: "Solve with the graphical method the LP problem " + lpTex("en", "max", c, [a1, a2], ["le", "le"], [b1, b2]) + " (the optimal solution is unique). What are the optimal solution $\\tilde{\\boldsymbol x}$ and the optimal value $z(LP)$?"
        };
        var elenco = vert.map(function (x) { return "$" + vett(x) + "$: $" + z(x).tex() + "$"; }).join(", ");
        var spieg = {
          it: "I vertici della regione ammissibile diversi dall'origine sono " + elenco + ": il valore massimo si ha in $" + vett(vert[best]) + "$. Il punto $" + vett(E) + "$ è l'intercetta del vincolo meno stringente sull'asse e non è ammissibile.",
          en: "The vertices of the feasible region other than the origin are " + elenco + ": the maximum value is attained at $" + vett(vert[best]) + "$. The point $" + vett(E) + "$ is the intercept of the less restrictive constraint on the axis and it is not feasible."
        };
        return impacchetta(rng, lingua, mk(vert[best]), altre.concat([mk(E)]), testo, spieg, { c: c, A: [a1, a2], b: [b1, b2] });
      });
    }
  });

  // ======================================================================
  // 5. Forme equivalenti: conteggio di variabili e vincoli (cap. 5)
  G.push({
    id: "lp-g-forme-equivalenti", livello: "facile", capitolo: "05-outcomes-equivalences",
    link: link("05-outcomes-equivalences", "box-10-defEquivalent"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var n = ri(rng, 3, 4);
        var tv = []; for (var j = 0; j < n; j++) tv.push(pick(rng, ["nn", "np", "fr"]));
        if (tv.indexOf("fr") < 0) return null;
        var tc = shuffle(rng, ["le", "ge", "eq"].concat([pick(rng, ["le", "ge", "eq"])]));
        var m = tc.length;
        var cnt = function (arr, t) { return arr.filter(function (x) { return x === t; }).length; };
        var nn = cnt(tv, "nn"), np = cnt(tv, "np"), fr = cnt(tv, "fr"), le = cnt(tc, "le"), ge = cnt(tc, "ge"), eq = cnt(tc, "eq");
        var base = nn + np + 2 * fr;
        var c = [], A = [], b = [];
        for (var j2 = 0; j2 < n; j2++) c.push(ri(rng, -4, 6));
        for (var i = 0; i < m; i++) { var r = []; for (var j3 = 0; j3 < n; j3++) r.push(ri(rng, -3, 5)); A.push(r); b.push(ri(rng, -3, 9)); }
        if (c.every(function (v) { return v === 0; })) return null;
        var senso = pick(rng, ["max", "min"]);
        var dom = tv.map(function (t, j) { return xv(j + 1) + (t === "nn" ? " \\ge 0" : t === "np" ? " \\le 0" : " \\gtreqless 0"); }).join(",~ ");
        var variante = rng() < 0.5 ? "std" : "can";
        var corr, d;
        if (variante === "std") { corr = [base + le + ge, m]; d = [[nn + np + fr + le + ge, m], [base + m, m], [base + le + ge, le + ge + 2 * eq]]; }
        else { corr = [base, le + ge + 2 * eq]; d = [[base, m], [nn + np + fr, le + ge + 2 * eq], [base + le + ge, le + ge + 2 * eq]]; }
        var mk = function (p) {
          return variante === "std"
            ? opz("$" + p[0] + "$ variabili non negative e $" + p[1] + "$ vincoli di uguaglianza", "$" + p[0] + "$ non-negative variables and $" + p[1] + "$ equality constraints", p.join(","))
            : opz("$" + p[0] + "$ variabili non negative e $" + p[1] + "$ vincoli di minore o uguale", "$" + p[0] + "$ non-negative variables and $" + p[1] + "$ less-than-or-equal-to constraints", p.join(","));
        };
        var lp = { it: lpTex("it", senso, c, A, tc, b, dom), en: lpTex("en", senso, c, A, tc, b, dom) };
        var testo = variante === "std" ? {
          it: "Si consideri il problema LP " + lp.it + ". Il problema LP equivalente in forma standard di massimo si ottiene con le trasformazioni usuali (un problema di minimo diventa di massimo cambiando segno alla funzione obiettivo, $x_j = -x_j^+$ per le variabili non positive, $x_j = x_j^+ - x_j^-$ per le variabili libere, una variabile di scarto o di surplus per ogni disuguaglianza). Quante variabili e quanti vincoli ha?",
          en: "Consider the LP problem " + lp.en + ". The equivalent LP problem in standard maximization form is obtained with the usual transformations (a minimization problem becomes a maximization one by changing the sign of the objective function, $x_j = -x_j^+$ for the non-positive variables, $x_j = x_j^+ - x_j^-$ for the free variables, one slack or surplus variable for each inequality). How many variables and constraints does it have?"
        } : {
          it: "Si consideri il problema LP " + lp.it + ". Il problema LP equivalente in forma canonica di massimo si ottiene con le trasformazioni usuali (un problema di minimo diventa di massimo cambiando segno alla funzione obiettivo, $x_j = -x_j^+$ per le variabili non positive, $x_j = x_j^+ - x_j^-$ per le variabili libere, vincoli di maggiore o uguale moltiplicati per $-1$, ogni vincolo di uguaglianza sostituito da due vincoli di minore o uguale). Quante variabili e quanti vincoli ha?",
          en: "Consider the LP problem " + lp.en + ". The equivalent LP problem in canonical maximization form is obtained with the usual transformations (a minimization problem becomes a maximization one by changing the sign of the objective function, $x_j = -x_j^+$ for the non-positive variables, $x_j = x_j^+ - x_j^-$ for the free variables, greater-than-or-equal-to constraints multiplied by $-1$, each equality constraint replaced by two less-than-or-equal-to constraints). How many variables and constraints does it have?"
        };
        var spieg = variante === "std" ? {
          it: "Le variabili diventano $" + nn + " + " + np + " + 2 \\cdot " + fr + " = " + base + "$ (ogni variabile libera ne richiede due), più una variabile di scarto o di surplus per ciascuna delle $" + (le + ge) + "$ disuguaglianze: in totale $" + corr[0] + "$. I vincoli restano $" + m + "$, tutti di uguaglianza; i vincoli di uguaglianza non ricevono variabili aggiuntive.",
          en: "The variables become $" + nn + " + " + np + " + 2 \\cdot " + fr + " = " + base + "$ (each free variable requires two), plus one slack or surplus variable for each of the $" + (le + ge) + "$ inequalities: $" + corr[0] + "$ in total. The constraints remain $" + m + "$, all equalities; the equality constraints receive no additional variable."
        } : {
          it: "Le variabili diventano $" + nn + " + " + np + " + 2 \\cdot " + fr + " = " + base + "$ (ogni variabile libera ne richiede due, nessuna variabile di scarto). I vincoli sono $" + (le + ge) + "$ disuguaglianze più due per ciascuno dei $" + eq + "$ vincoli di uguaglianza: $" + corr[1] + "$.",
          en: "The variables become $" + nn + " + " + np + " + 2 \\cdot " + fr + " = " + base + "$ (each free variable requires two, no slack variables). The constraints are $" + (le + ge) + "$ inequalities plus two for each of the $" + eq + "$ equality constraints: $" + corr[1] + "$."
        };
        return impacchetta(rng, lingua, mk(corr), d.map(mk), testo, spieg, { variante: variante, tv: tv, tc: tc });
      });
    }
  });

  // ======================================================================
  // 6. Regola di Bland: colonna e riga pivot (cap. 7)
  G.push({
    id: "lp-g-pivot-bland", livello: "facile", capitolo: "07-optimality-pivot",
    link: link("07-optimality-pivot", "regola-di-pivot-di-bland", "blands-pivot-rule"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var D = dizCasuale(rng, 3, 3, -3, 3);
        var pos = D.N.filter(function (j) { return D.c[j].sgn() > 0; });
        if (pos.length < 2) return null;
        var p = pos[0], tr = testRapporti(D, p);
        if (!tr) return null;
        var mk = function (pp, rr) {
          return opz("colonna pivot $" + xv(pp) + "$, riga pivot $" + xv(rr) + "$", "pivot column $" + xv(pp) + "$, pivot row $" + xv(rr) + "$", pp + "," + rr);
        };
        var giusta = mk(p, tr.r);
        var cand = [];
        // Dantzig: costo ridotto massimo
        var qd = pos[0]; pos.forEach(function (j) { if (D.c[j].cmp(D.c[qd]) > 0) qd = j; });
        if (qd !== p) { var t2 = testRapporti(D, qd); if (t2) cand.push(mk(qd, t2.r)); }
        // seconda colonna ammissibile per indice
        var t3 = testRapporti(D, pos[1]); if (t3) cand.push(mk(pos[1], t3.r));
        // rapporto massimo
        var rpos = D.B.filter(function (i) { return D.a[i][p].sgn() > 0; });
        if (rpos.length >= 2) {
          var rm = rpos[0]; rpos.forEach(function (i) { if (D.b[i].div(D.a[i][p]).cmp(D.b[rm].div(D.a[rm][p])) > 0) rm = i; });
          cand.push(mk(p, rm));
        }
        // elemento pivot più grande
        var rg = rpos[0]; rpos.forEach(function (i) { if (D.a[i][p].cmp(D.a[rg][p]) > 0) rg = i; });
        cand.push(mk(p, rg));
        // rapporto con il segno ignorato (anche coefficienti negativi)
        var rn = null, vn = null;
        D.B.forEach(function (i) { var a = D.a[i][p]; if (!a.isZero()) { var v = D.b[i].div(a.abs()); if (vn === null || v.cmp(vn) < 0) { vn = v; rn = i; } } });
        cand.push(mk(p, rn));
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var rapporti = rpos.map(function (i) { return "\\frac{" + D.b[i].tex() + "}{" + D.a[i][p].tex() + "}"; }).join(",~ ");
        var testo = {
          it: DIZ_PRE.it + partTex(D) + ": " + dizTex(D) + DIZ_CONV.it + ". Con la " + BLAND.it + ", quali sono la colonna pivot e la riga pivot?",
          en: DIZ_PRE.en + partTex(D) + ": " + dizTex(D) + DIZ_CONV.en + ". With " + BLAND.en + ", what are the pivot column and the pivot row?"
        };
        var spieg = {
          it: "La colonna pivot è la variabile fuori base di indice minimo con costo ridotto positivo: $" + xv(p) + "$ ($\\bar c_{" + p + "} = " + D.c[p].tex() + "$), non quella con il costo ridotto massimo. Test dei rapporti sulle righe con $\\bar a_{i" + p + "} > 0$: $t_m = \\min\\{" + rapporti + "\\} = " + tr.t.tex() + "$, raggiunto da $" + xv(tr.r) + "$ (indice minimo in caso di pareggio).",
          en: "The pivot column is the non-basic variable with the smallest index and a positive reduced cost: $" + xv(p) + "$ ($\\bar c_{" + p + "} = " + D.c[p].tex() + "$), not the one with the largest reduced cost. Ratio test on the rows with $\\bar a_{i" + p + "} > 0$: $t_m = \\min\\{" + rapporti + "\\} = " + tr.t.tex() + "$, attained by $" + xv(tr.r) + "$ (smallest index in case of ties)."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { D: dizDati(D) });
      });
    }
  });

  // ======================================================================
  // 7. Nuovo valore della funzione obiettivo dopo un'operazione di pivot (cap. 6)
  G.push({
    id: "lp-g-pivot-nuovo-z", livello: "facile", capitolo: "06-simplex",
    link: link("06-simplex", "631-determinare-una-nuova-soluzione-di-base-ammissibile", "631-determining-a-new-basic-feasible-solution"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var D = dizCasuale(rng, 3, 2, -3, 4);
        var cols = D.N.filter(function (j) { return D.c[j].sgn() > 0 && testRapporti(D, j); });
        if (!cols.length) return null;
        var p = pick(rng, cols), tr = testRapporti(D, p), cp = D.c[p];
        var nz_ = D.z.add(cp.mul(tr.t));
        var mk = function (v) { return opz("$" + v.tex() + "$", "$" + v.tex() + "$", v.key()); };
        var rpos = D.B.filter(function (i) { return D.a[i][p].sgn() > 0; });
        var rat = rpos.map(function (i) { return D.b[i].div(D.a[i][p]); });
        var cand = [];
        if (rat.length >= 2) cand.push(mk(D.z.add(cp.mul(qmax(rat)))));
        cand.push(mk(D.z.sub(cp.mul(tr.t))));
        cand.push(mk(D.z.add(tr.t)));
        var tutti = []; D.B.forEach(function (i) { if (!D.a[i][p].isZero()) tutti.push(D.b[i].div(D.a[i][p].abs())); });
        cand.push(mk(D.z.add(cp.mul(qmin(tutti)))));
        cand.push(mk(D.z.add(cp.mul(D.b[tr.r]))));
        var sb = scegli(cand, mk(nz_), 3); if (!sb) return null;
        var rapporti = rpos.map(function (i) { return "\\frac{" + D.b[i].tex() + "}{" + D.a[i][p].tex() + "}"; }).join(",~ ");
        var testo = {
          it: DIZ_PRE.it + partTex(D) + ": " + dizTex(D) + DIZ_CONV.it + ". Si esegue un'operazione di pivot con colonna pivot $" + xv(p) + "$ e riga pivot scelta con il test dei rapporti. Quanto vale $\\bar z$ nel nuovo dizionario?",
          en: DIZ_PRE.en + partTex(D) + ": " + dizTex(D) + DIZ_CONV.en + ". A pivoting operation is performed with pivot column $" + xv(p) + "$ and the pivot row chosen by the ratio test. What is the value of $\\bar z$ in the new dictionary?"
        };
        var spieg = {
          it: "Test dei rapporti: $t_m = \\min\\{" + rapporti + "\\} = " + tr.t.tex() + "$ (solo le righe con $\\bar a_{i" + p + "} > 0$). Il nuovo valore è $\\bar z + t_m \\, \\bar c_{" + p + "} = " + D.z.tex() + " + " + par(tr.t) + " \\cdot " + par(cp) + " = " + nz_.tex() + "$.",
          en: "Ratio test: $t_m = \\min\\{" + rapporti + "\\} = " + tr.t.tex() + "$ (only the rows with $\\bar a_{i" + p + "} > 0$). The new value is $\\bar z + t_m \\, \\bar c_{" + p + "} = " + D.z.tex() + " + " + par(tr.t) + " \\cdot " + par(cp) + " = " + nz_.tex() + "$."
        };
        return impacchetta(rng, lingua, mk(nz_), sb, testo, spieg, { D: dizDati(D), p: p });
      });
    }
  });

  // ======================================================================
  // 8. Esito di un dizionario: ottimo, illimitato, pivot degenere o non degenere (cap. 6)
  G.push({
    id: "lp-g-esito-dizionario", livello: "facile", capitolo: "06-simplex",
    link: link("06-simplex", "631-determinare-una-nuova-soluzione-di-base-ammissibile", "631-determining-a-new-basic-feasible-solution"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var sc = pick(rng, ["opt", "unb", "deg", "nd"]);
        var D = dizCasuale(rng, 3, 2, -3, 3);
        var p = pick(rng, D.N), altro = D.N[0] === p ? D.N[1] : D.N[0];
        if (sc === "opt") {
          D.N.forEach(function (j) { D.c[j] = q(ri(rng, -5, 0)); });
          if (D.N.every(function (j) { return D.c[j].isZero(); })) return null;
          D.B.forEach(function (i) { D.b[i] = q(ri(rng, 0, 8)); });
        } else if (sc === "unb") {
          D.c[p] = q(ri(rng, 1, 5)); D.c[altro] = q(ri(rng, -5, 0));
          D.B.forEach(function (i) { D.a[i][p] = q(ri(rng, -3, 0)); });
        } else if (sc === "deg") {
          D.c[p] = q(ri(rng, 1, 5)); D.c[altro] = q(ri(rng, -5, 0));
          var rp = D.B.filter(function (i) { return D.a[i][p].sgn() > 0; });
          if (!rp.length) return null;
          D.b[pick(rng, rp)] = q(0);
        } else {
          D.N.forEach(function (j) { D.c[j] = q(ri(rng, -3, 5)); });
          var ps = D.N.filter(function (j) { return D.c[j].sgn() > 0; });
          if (!ps.length) return null;
          if (!ps.every(function (j) { return testRapporti(D, j); })) return null;
        }
        // classificazione
        var bland = colonnaBland(D), stato, tm = null;
        if (bland === null) stato = "opt";
        else {
          var tr = testRapporti(D, bland);
          if (!tr) stato = "unb";
          else { tm = tr.t; stato = tm.isZero() ? "deg" : "nd"; }
        }
        if (stato !== sc) return null;
        var pB = (sc === "unb") ? p : (bland !== null ? bland : p);
        var tShow = (sc === "nd") ? tm : q(ri(rng, 1, 6));
        var O = {
          opt: opz("La soluzione di base ammissibile del dizionario è ottima.", "The basic feasible solution of the dictionary is optimal.", "opt"),
          unb: opz("Il problema LP è illimitato: la variabile $" + xv(pB) + "$ fornisce il certificato di illimitatezza.", "The LP problem is unbounded: the variable $" + xv(pB) + "$ gives the certificate of unboundedness.", "unb:" + pB),
          deg: opz("Con la regola di Bland serve un'operazione di pivot degenere ($t_m = 0$).", "With Bland's rule a degenerate pivoting operation is needed ($t_m = 0$).", "deg"),
          nd: opz("Con la regola di Bland serve un'operazione di pivot non degenere, con $t_m = " + tShow.tex() + "$.", "With Bland's rule a non-degenerate pivoting operation is needed, with $t_m = " + tShow.tex() + "$.", "nd:" + tShow.key())
        };
        var testo = {
          it: DIZ_PRE.it + partTex(D) + ": " + dizTex(D) + DIZ_CONV.it + ". Le operazioni di pivot seguono la " + BLAND.it + "; $t_m$ è il passo dato dal test dei rapporti. Quale delle seguenti affermazioni è corretta?",
          en: DIZ_PRE.en + partTex(D) + ": " + dizTex(D) + DIZ_CONV.en + ". Pivoting follows " + BLAND.en + "; $t_m$ is the step given by the ratio test. Which of the following statements is correct?"
        };
        var spieg = {
          opt: { it: "Si ha $\\bar{\\boldsymbol b} \\ge {\\boldsymbol 0}$ e tutti i costi ridotti sono non positivi: per le condizioni sufficienti di ottimalità la soluzione di base ammissibile è ottima.",
                 en: "We have $\\bar{\\boldsymbol b} \\ge {\\boldsymbol 0}$ and all the reduced costs are non-positive: by the sufficient conditions for optimality the basic feasible solution is optimal." },
          unb: { it: "La variabile $" + xv(p) + "$ ha costo ridotto positivo e $\\bar a_{i" + p + "} \\le 0$ per ogni $i \\in \\pazocal{B}$: aumentandola nessuna variabile in base diventa negativa e $z$ cresce senza limite.",
                 en: "The variable $" + xv(p) + "$ has a positive reduced cost and $\\bar a_{i" + p + "} \\le 0$ for every $i \\in \\pazocal{B}$: increasing it no basic variable becomes negative and $z$ grows without bound." },
          deg: { it: "La colonna pivot è $" + xv(bland) + "$ e una riga con $\\bar a_{i" + bland + "} > 0$ ha $\\bar b_i = 0$: il test dei rapporti dà $t_m = 0$, la soluzione è degenere e il valore di $z$ non cambia.",
                 en: "The pivot column is $" + xv(bland) + "$ and a row with $\\bar a_{i" + bland + "} > 0$ has $\\bar b_i = 0$: the ratio test gives $t_m = 0$, the solution is degenerate and the value of $z$ does not change." },
          nd: { it: "La colonna pivot (regola di Bland) è $" + xv(bland) + "$; nessuna colonna con costo ridotto positivo ha tutti i coefficienti $\\bar a_{ij} \\le 0$ e il test dei rapporti dà $t_m = " + (tm ? tm.tex() : "") + " > 0$.",
                en: "The pivot column (Bland's rule) is $" + xv(bland) + "$; no column with a positive reduced cost has all its coefficients $\\bar a_{ij} \\le 0$ and the ratio test gives $t_m = " + (tm ? tm.tex() : "") + " > 0$." }
        };
        var altre = ["opt", "unb", "deg", "nd"].filter(function (k) { return k !== sc; }).map(function (k) { return O[k]; });
        return impacchetta(rng, lingua, O[sc], altre, testo, spieg[sc], { D: dizDati(D) });
      });
    }
  });

  // ======================================================================
  // 9. Fase 0: operazione di pivot speciale (cap. 8)
  G.push({
    id: "lp-g-fase0-pivot-speciale", livello: "facile", capitolo: "08-phase-zero",
    link: link("08-phase-zero", "box-1-def-phase0"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var n = 2, m = 3;
        var b = shuffle(rng, [-ri(rng, 1, 9), -ri(rng, 1, 9), ri(rng, 1, 9)]);
        var negs = [0, 1, 2].filter(function (i) { return b[i] < 0; });
        if (b[negs[0]] === b[negs[1]]) return null;
        var A = [], c = [ri(rng, 1, 5), ri(rng, 1, 5)];
        for (var i = 0; i < m; i++) A.push([ri(rng, -3, 4), ri(rng, -3, 4)]);
        if (!righeBuone(A)) return null;
        var r = b[negs[0]] < b[negs[1]] ? negs[0] : negs[1];
        var s = r === negs[0] ? negs[1] : negs[0];
        var mk = function (k, v) {
          return opz("esce dalla base $" + xv(n + 1 + k) + "$ e $x_0 = " + v + "$", "$" + xv(n + 1 + k) + "$ leaves the basis and $x_0 = " + v + "$", (n + 1 + k) + "|" + v);
        };
        var nessuna = opz("nessuna variabile può uscire dalla base: il test dei rapporti non ha candidati", "no variable can leave the basis: the ratio test has no candidate", "none");
        var testo = {
          it: "Si consideri il problema LP " + lpTex("it", "max", c, A, ["le", "le", "le"], b) + " e il suo " + AUXDEF.it + ", in forma standard con le variabili di scarto $x_3, x_4, x_5$ in base (dizionario iniziale non ammissibile). Che cosa produce l'operazione di pivot speciale della Fase $0$?",
          en: "Consider the LP problem " + lpTex("en", "max", c, A, ["le", "le", "le"], b) + " and its " + AUXDEF.en + ", in standard form with the slack variables $x_3, x_4, x_5$ in the basis (infeasible initial dictionary). What does the special pivoting operation of Phase $0$ produce?"
        };
        var spieg = {
          it: "Nell'operazione di pivot speciale $x_0$ entra in base ed esce la variabile in base con il termine noto più negativo: $r \\in \\argmin\\{b_i\\}$, cioè $" + xv(n + 1 + r) + "$ con $b_" + (r + 1) + " = " + b[r] + "$. Dopo il pivot $x_0 = -b_" + (r + 1) + " = " + (-b[r]) + "$ e $x_i = b_i - b_" + (r + 1) + " \\ge 0$ per le altre variabili in base.",
          en: "In the special pivoting operation $x_0$ enters the basis and the basic variable with the most negative right-hand side leaves: $r \\in \\argmin\\{b_i\\}$, i.e., $" + xv(n + 1 + r) + "$ with $b_" + (r + 1) + " = " + b[r] + "$. After the pivot $x_0 = -b_" + (r + 1) + " = " + (-b[r]) + "$ and $x_i = b_i - b_" + (r + 1) + " \\ge 0$ for the other basic variables."
        };
        return impacchetta(rng, lingua, mk(r, -b[r]), [mk(s, -b[s]), mk(r, b[r]), nessuna], testo, spieg, { A: A, b: b, c: c });
      });
    }
  });

  // ======================================================================
  // 10. Scrivere il problema duale (cap. 9)
  G.push({
    id: "lp-g-scrivere-duale", livello: "facile", capitolo: "09-duality",
    link: link("09-duality", "box-1-def-dual"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [[ri(rng, -2, 5), ri(rng, -2, 5)], [ri(rng, -2, 5), ri(rng, -2, 5)]];
        if (A[0][1] === A[1][0]) return null;
        if (A[0][0] === 0 && A[0][1] === 0 || A[1][0] === 0 && A[1][1] === 0) return null;
        var b = [ri(rng, 1, 12), ri(rng, 1, 12)], c = [ri(rng, 1, 8), ri(rng, 1, 8)];
        if (b[0] === c[0] && b[1] === c[1]) return null;
        var pi = ["\\pi_1", "\\pi_2"];
        var At = [[A[0][0], A[1][0]], [A[0][1], A[1][1]]];
        var duale = function (lang, obj, M, verso, rhs) {
          return "$\\begin{array}{rl} \\min & " + lin(obj, pi) + " \\\\ " + SOGG[lang] + " & " + lin(M[0], pi) + " " + SEGNO[verso] + " " + rhs[0] +
            " \\\\ & " + lin(M[1], pi) + " " + SEGNO[verso] + " " + rhs[1] + " \\\\ & \\pi_1, \\pi_2 \\ge 0 \\end{array}$";
        };
        var mk = function (obj, M, verso, rhs) {
          return opz(duale("it", obj, M, verso, rhs), duale("en", obj, M, verso, rhs), JSON.stringify([obj, M, verso, rhs]));
        };
        var testo = {
          it: "Qual è il problema duale del problema LP in forma canonica di massimo " + lpTex("it", "max", c, A, ["le", "le"], b) + ", con la variabile duale $\\pi_i$ associata al vincolo $i$?",
          en: "What is the dual problem of the LP problem in canonical maximization form " + lpTex("en", "max", c, A, ["le", "le"], b) + ", with the dual variable $\\pi_i$ associated with constraint $i$?"
        };
        var spieg = {
          it: "Il duale è $\\min {\\boldsymbol b}'{\\boldsymbol \\pi}$ soggetto a ${\\boldsymbol A}'{\\boldsymbol \\pi} \\ge {\\boldsymbol c}$, ${\\boldsymbol \\pi} \\ge {\\boldsymbol 0}$: i termini noti diventano i costi, e il vincolo duale $j$ usa la colonna $j$ di ${\\boldsymbol A}$ (non la riga) con verso $\\ge$.",
          en: "The dual is $\\min {\\boldsymbol b}'{\\boldsymbol \\pi}$ subject to ${\\boldsymbol A}'{\\boldsymbol \\pi} \\ge {\\boldsymbol c}$, ${\\boldsymbol \\pi} \\ge {\\boldsymbol 0}$: the right-hand sides become the costs, and dual constraint $j$ uses column $j$ of ${\\boldsymbol A}$ (not the row) with direction $\\ge$."
        };
        return impacchetta(rng, lingua, mk(b, At, "ge", c), [mk(b, A, "ge", c), mk(b, At, "le", c), mk(c, At, "ge", b)], testo, spieg, { A: A, b: b, c: c });
      });
    }
  });

  // ---------------------------------------------------- problemi LP con ottimo «gentile»
  // problema in forma canonica di massimo risolto con il simplesso (Bland) dalla base delle variabili di scarto;
  // richiede ottimo unico e non degenere, numeri piccoli
  function lpGentile(rng, n, m, opzioni) {
    var o = opzioni || {};
    var A = [], b = [], c = [];
    for (var i = 0; i < m; i++) {
      var r = []; for (var j = 0; j < n; j++) r.push(ri(rng, o.amin === undefined ? 0 : o.amin, o.amax || 5));
      if (r.every(function (v) { return v <= 0; })) return null;
      A.push(r); b.push(ri(rng, o.bmin || 4, o.bmax || 20));
    }
    for (var j2 = 0; j2 < n; j2++) c.push(ri(rng, 1, o.cmax || 8));
    if (!righeBuone(A)) return null;
    var ris = simplesso(dizIniziale(A, b, c));
    if (ris.stato !== "ottimo") return null;
    var D = ris.D;
    if (D.N.some(function (j) { return D.c[j].sgn() >= 0; })) return null;   // ottimo unico
    if (D.B.some(function (i) { return D.b[i].sgn() <= 0; })) return null;   // non degenere
    if (maxDen(D) > (o.den || 8) || maxAbs(D) > (o.abs || 60)) return null;
    if (o.minPivot && ris.storia.length < o.minPivot) return null;
    for (var k = 0; k < ris.storia.length; k++) {
      if (ris.storia[k].t.isZero()) return null;
      if (maxDen(ris.storia[k].D) > (o.den || 8)) return null;
    }
    return { A: A, b: b, c: c, n: n, m: m, ris: ris, D: D };
  }
  function duali(D, n, m) { var p = []; for (var i = 1; i <= m; i++) p.push(D.N.indexOf(n + i) >= 0 ? D.c[n + i].neg() : q(0)); return p; }
  function vettOpz(nome, v) { return "$(" + v.map(function (_, i) { return nome + "_" + (i + 1); }).join(", ") + ") = " + vett(v) + "$"; }
  function chiave(v) { return v.map(function (x) { return q(x).key(); }).join(","); }

  // ======================================================================
  // 11. Soluzione duale ottima dal dizionario ottimo (cap. 9)
  G.push({
    id: "lp-g-duale-da-dizionario", livello: "facile", capitolo: "09-duality",
    link: link("09-duality", "box-9-theo-dual-2"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 3, { den: 6 }); if (!L) return null;
        var D = L.D, n = 2, m = 3;
        var pi = duali(D, n, m);
        var sg = pi.map(function (v) { return v.neg(); });
        var sl = []; for (var i = 1; i <= m; i++) sl.push(D.B.indexOf(n + i) >= 0 ? D.b[n + i] : q(0));
        var sh = []; for (var i2 = 1; i2 <= m; i2++) sh.push(D.N.indexOf(i2) >= 0 ? D.c[i2].neg() : q(0));
        var rev = pi.slice().reverse();
        var mk = function (v) { var s = vettOpz("\\tilde\\pi", v); return opz(s, s, chiave(v)); };
        var sb = scegli([mk(sg), mk(sl), mk(sh), mk(rev)], mk(pi), 3); if (!sb) return null;
        var testo = {
          it: "Il problema LP in forma canonica di massimo " + lpTex("it", "max", L.c, L.A, ["le", "le", "le"], L.b) + ", con variabili di scarto $x_3, x_4, x_5$, ha il dizionario ottimo " + dizTex(D) + DIZ_CONV.it + ". Qual è la soluzione ottima del problema duale" + PIDEF.it + "?",
          en: "The LP problem in canonical maximization form " + lpTex("en", "max", L.c, L.A, ["le", "le", "le"], L.b) + ", with slack variables $x_3, x_4, x_5$, has the optimal dictionary " + dizTex(D) + DIZ_CONV.en + ". What is the optimal solution of the dual problem" + PIDEF.en + "?"
        };
        var zz = "\\sum_i b_i \\tilde\\pi_i = " + L.b.map(function (bb, i) { return bb + " \\cdot " + par(pi[i]); }).join(" + ") + " = " + D.z.tex();
        var spieg = {
          it: "Come nella dimostrazione della dualità forte, $\\tilde\\pi_i = -\\bar c_{2+i}$: il costo ridotto della variabile di scarto $x_{2+i}$ cambiato di segno, e $0$ se la variabile di scarto è in base. Controllo: $" + zz + " = z(LP)$.",
          en: "As in the proof of Strong Duality, $\\tilde\\pi_i = -\\bar c_{2+i}$: the reduced cost of the slack variable $x_{2+i}$ with the opposite sign, and $0$ if the slack variable is basic. Check: $" + zz + " = z(LP)$."
        };
        return impacchetta(rng, lingua, mk(pi), sb, testo, spieg, { A: L.A, b: L.b, c: L.c });
      });
    }
  });

  // ======================================================================
  // 12. Scarti complementari (cap. 9)
  G.push({
    id: "lp-g-scarti-complementari", livello: "media", capitolo: "09-duality",
    link: link("09-duality", "box-16-theo-dual-3"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var x = [ri(rng, 1, 4), ri(rng, 1, 4)];
        var A = []; for (var i = 0; i < 3; i++) { var r = [ri(rng, 0, 4), ri(rng, 0, 4)]; if (r[0] === 0 && r[1] === 0) return null; A.push(r); }
        var att = shuffle(rng, [0, 1, 2]); var i1 = Math.min(att[0], att[1]), i2 = Math.max(att[0], att[1]), k = att[2];
        var det = A[i1][0] * A[i2][1] - A[i1][1] * A[i2][0]; if (det === 0 || !righeBuone(A)) return null;
        var b = A.map(function (r, i) { return r[0] * x[0] + r[1] * x[1] + (i === k ? ri(rng, 1, 4) : 0); });
        var p1 = ri(rng, 1, 4), p2 = ri(rng, 1, 4);
        var piv = [0, 0, 0]; piv[i1] = p1; piv[i2] = p2;
        var c = [A[i1][0] * p1 + A[i2][0] * p2, A[i1][1] * p1 + A[i2][1] * p2];
        var giusto = piv.map(q);
        // errore: righe al posto delle colonne (sistema non trasposto)
        var risolvi2 = function (M, rhs) { var d = M[0][0] * M[1][1] - M[0][1] * M[1][0]; if (d === 0) return null; return [new Q(rhs[0] * M[1][1] - M[0][1] * rhs[1], d), new Q(M[0][0] * rhs[1] - rhs[0] * M[1][0], d)]; };
        var cand = [];
        var w1 = risolvi2([A[i1], A[i2]], c);
        if (w1) { var v1 = [q(0), q(0), q(0)]; v1[i1] = w1[0]; v1[i2] = w1[1]; cand.push(v1); }
        var w2 = risolvi2([[A[k][0], A[i1][0]], [A[k][1], A[i1][1]]], c);
        if (w2) { var v2 = [q(0), q(0), q(0)]; v2[k] = w2[0]; v2[i1] = w2[1]; cand.push(v2); }
        var v3 = [q(0), q(0), q(0)]; v3[i1] = q(p2); v3[i2] = q(p1); cand.push(v3);
        var v4 = [q(0), q(0), q(0)]; v4[i1] = q(-p1); v4[i2] = q(-p2); cand.push(v4);
        var mk = function (v) { var s = vettOpz("\\tilde\\pi", v); return opz(s, s, chiave(v)); };
        var nonneg = function (v) { return v.every(function (t) { return t.sgn() >= 0; }); };
        cand = cand.filter(nonneg).concat(cand.filter(function (v) { return !nonneg(v); }));
        var sb = scegli(cand.map(mk), mk(giusto), 3); if (!sb) return null;
        var nomiPi = ["\\pi_" + (i1 + 1), "\\pi_" + (i2 + 1)];
        var eq1 = lin([A[i1][0], A[i2][0]], nomiPi) + " = " + c[0], eq2 = lin([A[i1][1], A[i2][1]], nomiPi) + " = " + c[1];
        var testo = {
          it: "La soluzione $\\tilde x_1 = " + x[0] + ",~ \\tilde x_2 = " + x[1] + "$ è ottima per il problema LP " + lpTex("it", "max", c, A, ["le", "le", "le"], b) + ". Usando gli scarti complementari, qual è la soluzione ottima del problema duale" + PIDEF.it + "?",
          en: "The solution $\\tilde x_1 = " + x[0] + ",~ \\tilde x_2 = " + x[1] + "$ is optimal for the LP problem " + lpTex("en", "max", c, A, ["le", "le", "le"], b) + ". Using Complementary Slackness, what is the optimal solution of the dual problem" + PIDEF.en + "?"
        };
        var spieg = {
          it: "Il vincolo " + (k + 1) + " non è attivo in $\\tilde{\\boldsymbol x}$, quindi $\\tilde\\pi_" + (k + 1) + " = 0$. Poiché $\\tilde x_1, \\tilde x_2 > 0$, i due vincoli duali sono attivi: $" + eq1 + "$ e $" + eq2 + "$ (colonne di ${\\boldsymbol A}$), da cui $\\tilde\\pi_" + (i1 + 1) + " = " + p1 + "$, $\\tilde\\pi_" + (i2 + 1) + " = " + p2 + "$.",
          en: "Constraint " + (k + 1) + " is not active at $\\tilde{\\boldsymbol x}$, hence $\\tilde\\pi_" + (k + 1) + " = 0$. Since $\\tilde x_1, \\tilde x_2 > 0$, both dual constraints are active: $" + eq1 + "$ and $" + eq2 + "$ (columns of ${\\boldsymbol A}$), which give $\\tilde\\pi_" + (i1 + 1) + " = " + p1 + "$, $\\tilde\\pi_" + (i2 + 1) + " = " + p2 + "$."
        };
        return impacchetta(rng, lingua, mk(giusto), sb, testo, spieg, { A: A, b: b, c: c, x: x });
      });
    }
  });

  // ======================================================================
  // 13. Operazione di pivot duale (cap. 10)
  G.push({
    id: "lp-g-pivot-duale", livello: "media", capitolo: "10-dual-simplex",
    link: link("10-dual-simplex", "box-8-def-dualpivot"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var D = dizCasuale(rng, 3, 3, -3, 3);
        D.z = q(ri(rng, -6, 12));
        D.N.forEach(function (j) { D.c[j] = q(ri(rng, -6, -1)); });
        D.B.forEach(function (i) { D.b[i] = q(ri(rng, -8, 6)); });
        var negs = D.B.filter(function (i) { return D.b[i].sgn() < 0; });
        if (negs.length < 2) return null;
        var ps = passoDuale(D); if (!ps || ps.p === null) return null;
        var zn = function (r, s) { return D.z.add(s.mul(D.b[r])); };
        var mk = function (r, p, z) {
          return opz("riga pivot $" + xv(r) + "$, colonna pivot $" + xv(p) + "$, nuovo $\\bar z = " + z.tex() + "$",
                     "pivot row $" + xv(r) + "$, pivot column $" + xv(p) + "$, new $\\bar z = " + z.tex() + "$", r + "," + p + "|" + z.key());
        };
        var giusta = mk(ps.r, ps.p, zn(ps.r, ps.s));
        var colPer = function (r, scelta) {
          var best = null, sv = null;
          D.N.forEach(function (j) {
            var a = D.a[r][j];
            var ok = scelta === "pos" ? a.sgn() > 0 : a.sgn() < 0;
            if (!ok) return;
            var v = scelta === "pos" ? D.c[j].div(a).abs() : D.c[j].div(a);
            var meglio = scelta === "max" ? (sv === null || v.cmp(sv) > 0) : (sv === null || v.cmp(sv) < 0);
            if (meglio) { sv = v; best = j; }
          });
          return best === null ? null : { p: best, s: sv };
        };
        var cand = [];
        var rmin = negs[0]; negs.forEach(function (i) { if (D.b[i].cmp(D.b[rmin]) < 0) rmin = i; });
        if (rmin !== ps.r) { var c1 = colPer(rmin, "min"); if (c1) cand.push(mk(rmin, c1.p, zn(rmin, c1.s))); }
        var c2 = colPer(ps.r, "max"); if (c2) cand.push(mk(ps.r, c2.p, zn(ps.r, c2.s)));
        var c3 = colPer(ps.r, "pos"); if (c3) cand.push(mk(ps.r, c3.p, zn(ps.r, c3.s)));
        cand.push(mk(ps.r, ps.p, D.z.sub(ps.s.mul(D.b[ps.r]))));
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var neg = D.N.filter(function (j) { return D.a[ps.r][j].sgn() < 0; });
        var rapporti = neg.map(function (j) { return "\\frac{" + D.c[j].tex() + "}{" + D.a[ps.r][j].tex() + "}"; }).join(",~ ");
        var testo = {
          it: "Nell'algoritmo del simplesso duale per un problema LP in forma standard di massimo (tutte le variabili $x_j \\ge 0$), si consideri il dizionario duale ammissibile ($\\bar c_j \\le 0$ per ogni $j$) con " + partTex(D) + ": " + dizTex(D) + DIZ_CONV.it + ". Si esegue un'operazione di pivot duale con la " + BLAND_D.it + ". Quali sono la riga pivot, la colonna pivot e il nuovo valore di $\\bar z$?",
          en: "In the dual simplex algorithm for an LP problem in standard maximization form (all variables $x_j \\ge 0$), consider the dual feasible dictionary ($\\bar c_j \\le 0$ for every $j$) with " + partTex(D) + ": " + dizTex(D) + DIZ_CONV.en + ". A dual pivoting operation is performed with " + BLAND_D.en + ". What are the pivot row, the pivot column and the new value of $\\bar z$?"
        };
        var spieg = {
          it: "La riga pivot è la variabile in base di indice minimo con valore negativo: $" + xv(ps.r) + "$ ($\\bar b_{" + ps.r + "} = " + D.b[ps.r].tex() + "$). Sulle colonne con $\\bar a_{" + ps.r + "j} < 0$: $s_m = \\min\\{" + rapporti + "\\} = " + ps.s.tex() + "$, raggiunto da $" + xv(ps.p) + "$. Il nuovo valore è $\\bar z + s_m \\bar b_{" + ps.r + "} = " + D.z.tex() + " + " + par(ps.s) + " \\cdot " + par(D.b[ps.r]) + " = " + zn(ps.r, ps.s).tex() + "$, che non aumenta.",
          en: "The pivot row is the basic variable with the smallest index and a negative value: $" + xv(ps.r) + "$ ($\\bar b_{" + ps.r + "} = " + D.b[ps.r].tex() + "$). On the columns with $\\bar a_{" + ps.r + "j} < 0$: $s_m = \\min\\{" + rapporti + "\\} = " + ps.s.tex() + "$, attained by $" + xv(ps.p) + "$. The new value is $\\bar z + s_m \\bar b_{" + ps.r + "} = " + D.z.tex() + " + " + par(ps.s) + " \\cdot " + par(D.b[ps.r]) + " = " + zn(ps.r, ps.s).tex() + "$, which does not increase."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { D: dizDati(D) });
      });
    }
  });

  // ---------------------------------------------------------- intervalli
  function intervallo(nome, lo, hi) {
    if (lo === null && hi === null) return "$" + nome + " \\in \\R$";
    if (lo === null) return "$" + nome + " \\le " + hi.tex() + "$";
    if (hi === null) return "$" + nome + " \\ge " + lo.tex() + "$";
    return "$" + lo.tex() + " \\le " + nome + " \\le " + hi.tex() + "$";
  }
  function chiaveInt(lo, hi) { return (lo === null ? "-inf" : lo.key()) + ";" + (hi === null ? "inf" : hi.key()); }
  function opzInt(nome, lo, hi) { var s = intervallo(nome, lo, hi); return opz(s, s, chiaveInt(lo, hi)); }
  function piu(x, d) { return x === null ? null : x.add(d); }

  // ======================================================================
  // 14. Sensitività: costo di una variabile fuori base (cap. 14)
  G.push({
    id: "lp-g-sens-costo-fuori-base", livello: "facile", capitolo: "14-sensitivity",
    link: link("14-sensitivity", "1421-coefficiente-di-costo-di-una-variabile-fuori-base", "1421-objective-function-coefficient-of-a-non-basic-variable"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 3, 2, { den: 6 }); if (!L) return null;
        var D = L.D;
        var orig = D.N.filter(function (j) { return j <= 3; }); if (!orig.length) return null;
        var k = pick(rng, orig), ck = q(L.c[k - 1]), cb = D.c[k];
        var nome = "c_" + k;
        var giusta = opzInt(nome, null, ck.sub(cb));
        var sb = [opzInt(nome, null, ck.add(cb)), opzInt(nome, ck.sub(cb), null), opzInt(nome, null, cb.neg())];
        var testo = {
          it: "Il problema LP " + lpTex("it", "max", L.c, L.A, ["le", "le"], L.b) + ", con variabili di scarto $x_4, x_5$, ha il dizionario ottimo " + dizTex(D) + DIZ_CONV.it + ". Si cambia solo il coefficiente $" + nome + "$ della funzione obiettivo. Per quali valori di $" + nome + "$ la base di questo dizionario resta ottima?",
          en: "The LP problem " + lpTex("en", "max", L.c, L.A, ["le", "le"], L.b) + ", with slack variables $x_4, x_5$, has the optimal dictionary " + dizTex(D) + DIZ_CONV.en + ". Only the objective-function coefficient $" + nome + "$ is changed. For which values of $" + nome + "$ does the basis of this dictionary remain optimal?"
        };
        var spieg = {
          it: "La variabile $" + xv(k) + "$ è fuori base: con $" + nome + " + \\delta$ cambia solo il suo costo ridotto, che diventa $\\bar c_" + k + " + \\delta = " + cb.tex() + " + \\delta$. La base resta ottima se $\\delta \\le -\\bar c_" + k + " = " + cb.neg().tex() + "$, cioè $" + nome + " \\le " + ck.tex() + " + " + cb.neg().tex() + " = " + ck.sub(cb).tex() + "$.",
          en: "The variable $" + xv(k) + "$ is non-basic: with $" + nome + " + \\delta$ only its reduced cost changes, and it becomes $\\bar c_" + k + " + \\delta = " + cb.tex() + " + \\delta$. The basis remains optimal if $\\delta \\le -\\bar c_" + k + " = " + cb.neg().tex() + "$, i.e., $" + nome + " \\le " + ck.tex() + " + " + cb.neg().tex() + " = " + ck.sub(cb).tex() + "$."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: L.A, b: L.b, c: L.c, k: k });
      });
    }
  });

  // ======================================================================
  // 15. Sensitività: costo di una variabile in base (cap. 14)
  G.push({
    id: "lp-g-sens-costo-in-base", livello: "media", capitolo: "14-sensitivity",
    link: link("14-sensitivity", "1422-coefficiente-di-costo-di-una-variabile-in-base", "1422-objective-function-coefficient-of-a-basic-variable"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 3, 2, { den: 6 }); if (!L) return null;
        var D = L.D;
        var orig = D.B.filter(function (i) { return i <= 3; }); if (!orig.length) return null;
        var k = pick(rng, orig), ck = q(L.c[k - 1]);
        var rp = D.N.filter(function (j) { return D.a[k][j].sgn() > 0; }), rn = D.N.filter(function (j) { return D.a[k][j].sgn() < 0; });
        if (!rp.length || !rn.length) return null;
        var rat = function (js) { return js.map(function (j) { return D.c[j].div(D.a[k][j]); }); };
        var lo = qmax(rat(rp)), hi = qmin(rat(rn));
        var nome = "c_" + k;
        var giusta = opzInt(nome, ck.add(lo), ck.add(hi));
        var cand = [opzInt(nome, ck.sub(hi), ck.sub(lo)), opzInt(nome, lo, hi), opzInt(nome, ck.add(qmin(rat(rp))), ck.add(qmax(rat(rn)))),
                    opzInt(nome, ck.add(lo), null), opzInt(nome, null, ck.add(hi))];
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var fr = function (js) { return rat(js).map(function (v) { return v.tex(); }).join(",~ "); };
        var testo = {
          it: "Il problema LP " + lpTex("it", "max", L.c, L.A, ["le", "le"], L.b) + ", con variabili di scarto $x_4, x_5$, ha il dizionario ottimo " + dizTex(D) + DIZ_CONV.it + ". Si cambia solo il coefficiente $" + nome + "$ della funzione obiettivo. Per quali valori di $" + nome + "$ la base di questo dizionario resta ottima?",
          en: "The LP problem " + lpTex("en", "max", L.c, L.A, ["le", "le"], L.b) + ", with slack variables $x_4, x_5$, has the optimal dictionary " + dizTex(D) + DIZ_CONV.en + ". Only the objective-function coefficient $" + nome + "$ is changed. For which values of $" + nome + "$ does the basis of this dictionary remain optimal?"
        };
        var spieg = {
          it: "$" + xv(k) + "$ è in base: con $" + nome + " + \\delta$ i costi ridotti diventano $\\bar c_j - \\delta \\bar a_{" + k + "j}$. Restano non positivi se $\\max\\{" + fr(rp) + "\\} \\le \\delta \\le \\min\\{" + fr(rn) + "\\}$, cioè $" + lo.tex() + " \\le \\delta \\le " + hi.tex() + "$; si somma poi $" + nome + " = " + ck.tex() + "$.",
          en: "$" + xv(k) + "$ is basic: with $" + nome + " + \\delta$ the reduced costs become $\\bar c_j - \\delta \\bar a_{" + k + "j}$. They remain non-positive if $\\max\\{" + fr(rp) + "\\} \\le \\delta \\le \\min\\{" + fr(rn) + "\\}$, i.e., $" + lo.tex() + " \\le \\delta \\le " + hi.tex() + "$; then $" + nome + " = " + ck.tex() + "$ is added."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: L.A, b: L.b, c: L.c, k: k });
      });
    }
  });

  // ======================================================================
  // 16. Sensitività: termine noto (cap. 14)
  G.push({
    id: "lp-g-sens-termine-noto", livello: "media", capitolo: "14-sensitivity",
    link: link("14-sensitivity", "143-variazioni-del-vettore-dei-termini-noti", "143-changes-in-the-right-hand-side-vector"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 3, { den: 6 }); if (!L) return null;
        var D = L.D, n = 2, m = 3;
        // inversa di A_B dalle colonne delle variabili di scarto
        var Binv = D.B.map(function () { return [q(0), q(0), q(0)]; });
        for (var kk = 1; kk <= m; kk++) {
          D.B.forEach(function (i, ri_) {
            if (D.N.indexOf(n + kk) >= 0) Binv[ri_][kk - 1] = D.a[i][n + kk];
            else Binv[ri_][kk - 1] = q(i === n + kk ? 1 : 0);
          });
        }
        var leg = range(1, m).filter(function (kk) { return D.N.indexOf(n + kk) >= 0; });
        if (!leg.length) return null;
        var k = pick(rng, leg), bk = q(L.b[k - 1]);
        var calcola = function (beta) {
          var lo = null, hi = null;
          D.B.forEach(function (i, r) {
            var be = beta[r]; if (be.isZero()) return;
            var v = D.b[i].neg().div(be);
            if (be.sgn() > 0) { if (lo === null || v.cmp(lo) > 0) lo = v; }
            else { if (hi === null || v.cmp(hi) < 0) hi = v; }
          });
          return [lo, hi];
        };
        var col = Binv.map(function (r) { return r[k - 1]; });
        var lh = calcola(col);
        if (lh[0] === null || lh[1] === null) return null;
        var nome = "b_" + k;
        var giusta = opzInt(nome, lh[0].add(bk), lh[1].add(bk));
        var rk = Binv[k - 1];
        var cand = [opzInt(nome, bk.sub(lh[1]), bk.sub(lh[0])), opzInt(nome, lh[0], lh[1])];
        var lr = calcola(rk); cand.push(opzInt(nome, piu(lr[0], bk), piu(lr[1], bk)));
        cand.push(opzInt(nome, lh[0].add(bk), null));
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var bbar = D.B.map(function (i) { return D.b[i]; });
        var testo = {
          it: "Il problema LP " + lpTex("it", "max", L.c, L.A, ["le", "le", "le"], L.b) + ", con variabili di scarto $x_3, x_4, x_5$, ha la base ottima $\\pazocal{B} = " + insieme(D.B) + "$ con ${\\boldsymbol A}_{\\pazocal{B}}^{-1} = " + matrice(Binv) + "$ e $\\bar{\\boldsymbol b} = " + colonna(bbar) + "$ (valori delle variabili in base, nell'ordine di $\\pazocal{B}$). Si cambia solo il termine noto $" + nome + "$. Per quali valori di $" + nome + "$ questa base resta ottima?",
          en: "The LP problem " + lpTex("en", "max", L.c, L.A, ["le", "le", "le"], L.b) + ", with slack variables $x_3, x_4, x_5$, has the optimal basis $\\pazocal{B} = " + insieme(D.B) + "$ with ${\\boldsymbol A}_{\\pazocal{B}}^{-1} = " + matrice(Binv) + "$ and $\\bar{\\boldsymbol b} = " + colonna(bbar) + "$ (values of the basic variables, in the order of $\\pazocal{B}$). Only the right-hand side $" + nome + "$ is changed. For which values of $" + nome + "$ does this basis remain optimal?"
        };
        var spieg = {
          it: "Con $" + nome + " + \\delta$ si ha $\\bar{\\boldsymbol b} + \\delta \\, {\\boldsymbol A}_{\\pazocal{B}}^{-1} {\\boldsymbol e}_" + k + " \\ge {\\boldsymbol 0}$, dove ${\\boldsymbol A}_{\\pazocal{B}}^{-1} {\\boldsymbol e}_" + k + " = " + colonna(col) + "$ è la colonna " + k + " (non la riga). Ne segue $" + lh[0].tex() + " \\le \\delta \\le " + lh[1].tex() + "$, e si somma $" + nome + " = " + bk.tex() + "$.",
          en: "With $" + nome + " + \\delta$ we need $\\bar{\\boldsymbol b} + \\delta \\, {\\boldsymbol A}_{\\pazocal{B}}^{-1} {\\boldsymbol e}_" + k + " \\ge {\\boldsymbol 0}$, where ${\\boldsymbol A}_{\\pazocal{B}}^{-1} {\\boldsymbol e}_" + k + " = " + colonna(col) + "$ is column " + k + " (not the row). It follows that $" + lh[0].tex() + " \\le \\delta \\le " + lh[1].tex() + "$, and $" + nome + " = " + bk.tex() + "$ is added."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: L.A, b: L.b, c: L.c, k: k, B: D.B });
      });
    }
  });

  // ---------------------------------------------------- matrici 2x2 (simplesso rivisto)
  function inv2(M) {
    var d = q(M[0][0]).mul(M[1][1]).sub(q(M[0][1]).mul(M[1][0]));
    if (d.isZero()) return null;
    return [[q(M[1][1]).div(d), q(M[0][1]).neg().div(d)], [q(M[1][0]).neg().div(d), q(M[0][0]).div(d)]];
  }
  function standard2(rng) {
    var A = [[ri(rng, -2, 5), ri(rng, -2, 5), 1, 0], [ri(rng, -2, 5), ri(rng, -2, 5), 0, 1]];
    var c = [ri(rng, 1, 8), ri(rng, 1, 8), 0, 0];
    return { A: A, c: c };
  }
  function colA(A, j) { return [A[0][j - 1], A[1][j - 1]]; }
  function stdTex(lang, S) {
    return "${\\boldsymbol A} = " + matrice(S.A) + "$, ${\\boldsymbol c}' = " + vett(S.c) + "$";
  }

  // ======================================================================
  // 17. Simplesso rivisto: primo sistema e costo ridotto (cap. 11)
  G.push({
    id: "lp-g-rivisto-pi", livello: "facile", capitolo: "11-revised-simplex",
    link: link("11-revised-simplex", "111-operazioni-di-pivot-con-due-sistemi-di-equazioni-lineari", "111-pivoting-operations-with-two-systems-of-linear-equations"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var S = standard2(rng);
        var B = ord(shuffle(rng, [1, 2, 3, 4]).slice(0, 2));
        if (B[0] > 2) return null;
        var N = [1, 2, 3, 4].filter(function (j) { return B.indexOf(j) < 0; });
        var AB = [[S.A[0][B[0] - 1], S.A[0][B[1] - 1]], [S.A[1][B[0] - 1], S.A[1][B[1] - 1]]];
        var Ai = inv2(AB); if (!Ai) return null;
        if (Math.abs(AB[0][0] * AB[1][1] - AB[0][1] * AB[1][0]) > 3) return null;
        var cB = [q(S.c[B[0] - 1]), q(S.c[B[1] - 1])];
        var pi = [cB[0].mul(Ai[0][0]).add(cB[1].mul(Ai[1][0])), cB[0].mul(Ai[0][1]).add(cB[1].mul(Ai[1][1]))];
        var pw = [Ai[0][0].mul(cB[0]).add(Ai[0][1].mul(cB[1])), Ai[1][0].mul(cB[0]).add(Ai[1][1].mul(cB[1]))];
        var p = pick(rng, N), Ap = colA(S.A, p);
        var red = function (v) { return q(S.c[p - 1]).sub(v[0].mul(Ap[0])).sub(v[1].mul(Ap[1])); };
        var cbar = red(pi);
        if (cbar.isZero()) return null;
        var mk = function (v, cb) {
          var s = "${\\boldsymbol \\pi} = " + vett(v) + "$, $\\bar c_" + p + " = " + cb.tex() + "$";
          return opz(s, s, chiave(v) + "|" + cb.key());
        };
        var giusta = mk(pi, cbar);
        var sb = scegli([mk(pw, red(pw)), mk(pi, cbar.neg()), mk(pw, red(pw).neg()), mk(pi.map(function (x) { return x.neg(); }), red(pi.map(function (x) { return x.neg(); })))], giusta, 3);
        if (!sb) return null;
        var testo = {
          it: "In un problema LP in forma standard di massimo con " + stdTex("it", S) + " e ${\\boldsymbol b} \\ge {\\boldsymbol 0}$, si consideri la base $\\pazocal{B} = " + insieme(B) + "$ (colonne ${\\boldsymbol A}_j$ di ${\\boldsymbol A}$, costi ${\\boldsymbol c}_{\\pazocal{B}}$ delle variabili in base nell'ordine di $\\pazocal{B}$). Il simplesso rivisto calcola il vettore riga ${\\boldsymbol \\pi} = {\\boldsymbol c}'_{\\pazocal{B}}{\\boldsymbol A}_{\\pazocal{B}}^{-1}$ risolvendo un sistema lineare. Quanto valgono ${\\boldsymbol \\pi}$ e il costo ridotto $\\bar c_" + p + "$ della variabile fuori base $" + xv(p) + "$?",
          en: "In an LP problem in standard maximization form with " + stdTex("en", S) + " and ${\\boldsymbol b} \\ge {\\boldsymbol 0}$, consider the basis $\\pazocal{B} = " + insieme(B) + "$ (columns ${\\boldsymbol A}_j$ of ${\\boldsymbol A}$, costs ${\\boldsymbol c}_{\\pazocal{B}}$ of the basic variables in the order of $\\pazocal{B}$). The revised simplex algorithm computes the row vector ${\\boldsymbol \\pi} = {\\boldsymbol c}'_{\\pazocal{B}}{\\boldsymbol A}_{\\pazocal{B}}^{-1}$ by solving a linear system. What are ${\\boldsymbol \\pi}$ and the reduced cost $\\bar c_" + p + "$ of the non-basic variable $" + xv(p) + "$?"
        };
        var spieg = {
          it: "Il primo sistema è ${\\boldsymbol \\pi} \\, {\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol c}'_{\\pazocal{B}}$ con ${\\boldsymbol A}_{\\pazocal{B}} = " + matrice(AB) + "$ e ${\\boldsymbol c}'_{\\pazocal{B}} = " + vett(cB) + "$ (vettore riga a sinistra, non ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol \\pi}' = {\\boldsymbol c}_{\\pazocal{B}}$): ${\\boldsymbol \\pi} = " + vett(pi) + "$. Poi $\\bar c_" + p + " = c_" + p + " - {\\boldsymbol \\pi} {\\boldsymbol A}_" + p + " = " + cbar.tex() + "$.",
          en: "The first system is ${\\boldsymbol \\pi} \\, {\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol c}'_{\\pazocal{B}}$ with ${\\boldsymbol A}_{\\pazocal{B}} = " + matrice(AB) + "$ and ${\\boldsymbol c}'_{\\pazocal{B}} = " + vett(cB) + "$ (row vector on the left, not ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol \\pi}' = {\\boldsymbol c}_{\\pazocal{B}}$): ${\\boldsymbol \\pi} = " + vett(pi) + "$. Then $\\bar c_" + p + " = c_" + p + " - {\\boldsymbol \\pi} {\\boldsymbol A}_" + p + " = " + cbar.tex() + "$."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: S.A, c: S.c, B: B, p: p });
      });
    }
  });

  // ======================================================================
  // 18. Simplesso duale rivisto: secondo sistema (cap. 12)
  G.push({
    id: "lp-g-rivisto-duale-u", livello: "facile", capitolo: "12-revised-dual",
    link: link("12-revised-dual", "121-operazioni-di-pivot-con-due-sistemi-di-equazioni-lineari", "121-pivoting-operations-with-two-systems-of-linear-equations"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var S = standard2(rng);
        var B = ord(shuffle(rng, [1, 2, 3, 4]).slice(0, 2));
        var N = [1, 2, 3, 4].filter(function (j) { return B.indexOf(j) < 0; });
        var AB = [[S.A[0][B[0] - 1], S.A[0][B[1] - 1]], [S.A[1][B[0] - 1], S.A[1][B[1] - 1]]];
        if (Math.abs(AB[0][0] * AB[1][1] - AB[0][1] * AB[1][0]) > 3) return null;
        var Ai = inv2(AB); if (!Ai) return null;
        var pos = ri(rng, 0, 1), r = B[pos];
        var u = Ai[pos];
        var uw = [Ai[0][pos], Ai[1][pos]];
        var uA = [q(AB[pos][0]), q(AB[pos][1])];
        var j = pick(rng, N), Aj = colA(S.A, j);
        var arj = function (v) { return v[0].mul(Aj[0]).add(v[1].mul(Aj[1])); };
        var mk = function (v) {
          var s = "${\\boldsymbol u} = " + vett(v) + "$, $\\bar a_{" + r + "" + j + "} = " + arj(v).tex() + "$";
          return opz(s, s, chiave(v) + "|" + arj(v).key());
        };
        var neg = u.map(function (x) { return x.neg(); });
        var sb = scegli([mk(uw), mk(uA), mk(neg)], mk(u), 3); if (!sb) return null;
        var testo = {
          it: "In un problema LP in forma standard di massimo con " + stdTex("it", S) + ", la base corrente è $\\pazocal{B} = " + insieme(B) + "$ e la riga pivot del simplesso duale rivisto è $" + xv(r) + "$. Risolvendo il secondo sistema ${\\boldsymbol u} \\, {\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol e}'_{" + r + "}$ (${\\boldsymbol e}_{" + r + "}$: vettore unitario della posizione di $" + xv(r) + "$ in $\\pazocal{B}$), quanto valgono ${\\boldsymbol u}$ e il coefficiente $\\bar a_{" + r + "" + j + "}$ della riga di $" + xv(r) + "$ in $\\bar{\\boldsymbol A} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol A}_{\\pazocal{N}}$?",
          en: "In an LP problem in standard maximization form with " + stdTex("en", S) + ", the current basis is $\\pazocal{B} = " + insieme(B) + "$ and the pivot row of the revised dual simplex algorithm is $" + xv(r) + "$. Solving the second system ${\\boldsymbol u} \\, {\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol e}'_{" + r + "}$ (${\\boldsymbol e}_{" + r + "}$: unit vector of the position of $" + xv(r) + "$ in $\\pazocal{B}$), what are ${\\boldsymbol u}$ and the coefficient $\\bar a_{" + r + "" + j + "}$ of the row of $" + xv(r) + "$ in $\\bar{\\boldsymbol A} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol A}_{\\pazocal{N}}$?"
        };
        var spieg = {
          it: "Con ${\\boldsymbol A}_{\\pazocal{B}} = " + matrice(AB) + "$, il vettore ${\\boldsymbol u} = {\\boldsymbol e}'_{" + r + "} {\\boldsymbol A}_{\\pazocal{B}}^{-1} = " + vett(u) + "$ è la riga di ${\\boldsymbol A}_{\\pazocal{B}}^{-1}$ associata a $" + xv(r) + "$ (non la colonna). Poi $\\bar a_{" + r + "" + j + "} = {\\boldsymbol u} \\, {\\boldsymbol A}_{" + j + "} = " + arj(u).tex() + "$.",
          en: "With ${\\boldsymbol A}_{\\pazocal{B}} = " + matrice(AB) + "$, the vector ${\\boldsymbol u} = {\\boldsymbol e}'_{" + r + "} {\\boldsymbol A}_{\\pazocal{B}}^{-1} = " + vett(u) + "$ is the row of ${\\boldsymbol A}_{\\pazocal{B}}^{-1}$ associated with $" + xv(r) + "$ (not the column). Then $\\bar a_{" + r + "" + j + "} = {\\boldsymbol u} \\, {\\boldsymbol A}_{" + j + "} = " + arj(u).tex() + "$."
        };
        return impacchetta(rng, lingua, mk(u), sb, testo, spieg, { A: S.A, B: B, r: r, j: j });
      });
    }
  });

  // ======================================================================
  // 19. Metodo primale-duale: passo duale (cap. 13)
  G.push({
    id: "lp-g-primale-duale-passo", livello: "facile", capitolo: "13-primal-dual",
    link: link("13-primal-dual", "133-il-passo-duale", "133-the-dual-step"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var J = ord(shuffle(rng, range(1, 7)).slice(0, 4));
        var s = J.map(function () { return ri(rng, 1, 9); }), Ay = J.map(function () { return ri(rng, -3, 4); });
        var posi = J.map(function (_, k) { return k; }).filter(function (k) { return Ay[k] > 0; });
        if (posi.length < 2) return null;
        if (!J.some(function (_, k) { return Ay[k] < 0; })) return null;
        var rat = function (k) { return new Q(s[k], Ay[k]); };
        var best = posi[0]; posi.forEach(function (k) { if (rat(k).cmp(rat(best)) < 0) best = k; });
        if (posi.some(function (k) { return k !== best && rat(k).eq(rat(best)); })) return null;
        var mk = function (th, k) {
          return opz("$\\theta = " + th.tex() + "$, entra nell'insieme ammesso l'indice $" + J[k] + "$", "$\\theta = " + th.tex() + "$, the index $" + J[k] + "$ enters the admissible set", th.key() + "|" + J[k]);
        };
        var cand = [];
        var wm = posi[0]; posi.forEach(function (k) { if (rat(k).cmp(rat(wm)) > 0) wm = k; }); cand.push(mk(rat(wm), wm));
        var inv = posi[0]; posi.forEach(function (k) { if (new Q(Ay[k], s[k]).cmp(new Q(Ay[inv], s[inv])) < 0) inv = k; }); cand.push(mk(new Q(Ay[inv], s[inv]), inv));
        var nzs = J.map(function (_, k) { return k; }).filter(function (k) { return Ay[k] !== 0; });
        var ab = nzs[0]; nzs.forEach(function (k) { if (new Q(s[k], Math.abs(Ay[k])).cmp(new Q(s[ab], Math.abs(Ay[ab]))) < 0) ab = k; }); cand.push(mk(new Q(s[ab], Math.abs(Ay[ab])), ab));
        var mn = nzs[0]; nzs.forEach(function (k) { if (rat(k).cmp(rat(mn)) < 0) mn = k; }); cand.push(mk(rat(mn), mn));
        var sb = scegli(cand, mk(rat(best), best), 3); if (!sb) return null;
        var dati = J.map(function (j, k) { return "$s_{" + j + "} = " + s[k] + ",~ {\\boldsymbol A}_{" + j + "}'{\\boldsymbol y} = " + Ay[k] + "$"; }).join("; ");
        var testo = {
          it: "Nel metodo primale-duale per $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ (${\\boldsymbol A}_j$: colonna $j$ di ${\\boldsymbol A}$), la soluzione duale ammissibile ${\\boldsymbol \\pi}$ ha scarti duali $s_j = c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi} \\ge 0$ e insieme ammesso $\\pazocal{J} = \\{j : s_j = 0\\}$. Il primale ristretto ha valore ottimo $\\xi(\\pazocal{J}) > 0$, ${\\boldsymbol y}$ è la soluzione ottima del suo duale e il passo duale ${\\boldsymbol \\pi} + \\theta\\,{\\boldsymbol y}$ usa il $\\theta$ più grande che mantiene tutti gli $s_j \\ge 0$. Per gli indici $j \\notin \\pazocal{J}$: " + dati + ". Quanto vale $\\theta$ e quale indice entra in $\\pazocal{J}$?",
          en: "In the primal-dual method for $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ (${\\boldsymbol A}_j$: column $j$ of ${\\boldsymbol A}$), the dual feasible solution ${\\boldsymbol \\pi}$ has dual slacks $s_j = c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi} \\ge 0$ and admissible set $\\pazocal{J} = \\{j : s_j = 0\\}$. The restricted primal problem has optimal value $\\xi(\\pazocal{J}) > 0$, ${\\boldsymbol y}$ is the optimal solution of its dual and the dual step ${\\boldsymbol \\pi} + \\theta\\,{\\boldsymbol y}$ uses the largest $\\theta$ keeping all $s_j \\ge 0$. For the indices $j \\notin \\pazocal{J}$: " + dati + ". What is $\\theta$ and which index enters $\\pazocal{J}$?"
        };
        var fr = posi.map(function (k) { return "\\frac{" + s[k] + "}{" + Ay[k] + "}"; }).join(",~ ");
        var spieg = {
          it: "$\\theta = \\min\\{ s_j / {\\boldsymbol A}_j'{\\boldsymbol y} : j \\notin \\pazocal{J},~ {\\boldsymbol A}_j'{\\boldsymbol y} > 0\\} = \\min\\{" + fr + "\\} = " + rat(best).tex() + "$: gli indici con ${\\boldsymbol A}_j'{\\boldsymbol y} \\le 0$ non limitano il passo. Il minimo è raggiunto da $j = " + J[best] + "$, la cui variabile duale di scarto si annulla.",
          en: "$\\theta = \\min\\{ s_j / {\\boldsymbol A}_j'{\\boldsymbol y} : j \\notin \\pazocal{J},~ {\\boldsymbol A}_j'{\\boldsymbol y} > 0\\} = \\min\\{" + fr + "\\} = " + rat(best).tex() + "$: the indices with ${\\boldsymbol A}_j'{\\boldsymbol y} \\le 0$ do not restrict the step. The minimum is attained by $j = " + J[best] + "$, whose dual slack becomes zero."
        };
        return impacchetta(rng, lingua, mk(rat(best), best), sb, testo, spieg, { J: J, s: s, Ay: Ay });
      });
    }
  });

  // ======================================================================
  // 20. Modelli: numero di variabili e di vincoli (cap. 16)
  G.push({
    id: "lp-g-modelli-dimensioni", livello: "facile", capitolo: "16-modelling",
    link: link("16-modelling", "161-dalla-descrizione-di-un-problema-a-un-modello-lp", "161-from-a-problem-description-to-an-lp-model"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var tipo = pick(rng, ["trasporto", "multi", "produzione"]);
        var corr, d, testo, spieg, parametri;
        if (tipo === "trasporto") {
          var s = ri(rng, 2, 6), r = ri(rng, 2, 7); if (s === r) return null;
          corr = [s * r, s + r]; parametri = [s, r]; d = [[s + r, s * r], [s * r, s * r], [s * r, 2 * (s + r)]];
          testo = { it: "Un'azienda spedisce un prodotto da $s = " + s + "$ magazzini, ciascuno con una disponibilità, a $r = " + r + "$ clienti, ciascuno con una domanda da soddisfare, con un costo unitario per ogni coppia magazzino-cliente. Nel modello LP di trasporto, con una variabile per la quantità spedita da ogni magazzino a ogni cliente, quante variabili e quanti vincoli (esclusi quelli di non negatività) ci sono?",
                    en: "A company ships a product from $s = " + s + "$ warehouses, each with an availability, to $r = " + r + "$ clients, each with a demand to satisfy, with a unit cost for every warehouse-client pair. In the LP transportation model, with one variable for the quantity shipped from every warehouse to every client, how many variables and how many constraints (excluding non-negativity) are there?" };
          spieg = { it: "Una variabile $x_{ij}$ per ogni coppia magazzino-cliente: $s \\cdot r = " + (s * r) + "$. Un vincolo di disponibilità per magazzino e un vincolo di domanda per cliente: $s + r = " + (s + r) + "$.",
                    en: "One variable $x_{ij}$ for each warehouse-client pair: $s \\cdot r = " + (s * r) + "$. One availability constraint per warehouse and one demand constraint per client: $s + r = " + (s + r) + "$." };
        } else if (tipo === "multi") {
          var n = ri(rng, 3, 12);
          corr = [2 * n, 2 * n]; parametri = [n]; d = [[n, 2 * n], [2 * n, n], [2 * n + 1, 2 * n]];
          testo = { it: "Un'azienda deve soddisfare la domanda $d_t$ di un prodotto in $n = " + n + "$ periodi, con produzione massima $p_t$ in ogni periodo. Nel modello LP multi-periodo, con variabili $x_t$ (produzione del periodo $t$) e $y_t$ (scorta a fine periodo $t$, con $y_0 = 0$ dato), un vincolo di bilancio delle scorte e un vincolo di capacità per periodo, quante variabili e quanti vincoli (esclusi quelli di non negatività) ci sono?",
                    en: "A company has to satisfy the demand $d_t$ of a product over $n = " + n + "$ periods, with maximum production $p_t$ in every period. In the multi-period LP model, with variables $x_t$ (production of period $t$) and $y_t$ (inventory at the end of period $t$, with $y_0 = 0$ given), one inventory balance constraint and one capacity constraint per period, how many variables and how many constraints (excluding non-negativity) are there?" };
          spieg = { it: "Le variabili sono $x_t$ e $y_t$ per $t = 1, \\dots, n$: $2n = " + (2 * n) + "$ ($y_0 = 0$ è un dato). I vincoli sono $n$ di bilancio delle scorte e $n$ di capacità: $2n = " + (2 * n) + "$.",
                    en: "The variables are $x_t$ and $y_t$ for $t = 1, \\dots, n$: $2n = " + (2 * n) + "$ ($y_0 = 0$ is a datum). The constraints are $n$ inventory balance constraints and $n$ capacity constraints: $2n = " + (2 * n) + "$." };
        } else {
          var rr = ri(rng, 2, 7), ss = ri(rng, 2, 7); if (rr === ss) return null;
          corr = [rr, ss]; parametri = [rr, ss]; d = [[ss, rr], [rr * ss, ss], [rr, rr + ss]];
          testo = { it: "Un'azienda fabbrica $r = " + rr + "$ prodotti, ciascuno con un profitto unitario, usando $s = " + ss + "$ risorse disponibili in quantità limitata; ogni unità di prodotto consuma una quantità nota di ogni risorsa. Nel modello LP di pianificazione della produzione, con una variabile per la quantità prodotta di ogni prodotto, quante variabili e quanti vincoli (esclusi quelli di non negatività) ci sono?",
                    en: "A company makes $r = " + rr + "$ products, each with a unit profit, using $s = " + ss + "$ resources available in limited quantity; every unit of product consumes a known quantity of every resource. In the LP production planning model, with one variable for the quantity produced of every product, how many variables and how many constraints (excluding non-negativity) are there?" };
          spieg = { it: "Una variabile $x_j$ per prodotto: $r = " + rr + "$. Un vincolo per risorsa (consumo non superiore alla disponibilità): $s = " + ss + "$.",
                    en: "One variable $x_j$ per product: $r = " + rr + "$. One constraint per resource (consumption not exceeding availability): $s = " + ss + "$." };
        }
        var mk = function (p) { return opz("$" + p[0] + "$ variabili e $" + p[1] + "$ vincoli", "$" + p[0] + "$ variables and $" + p[1] + "$ constraints", p.join(",")); };
        return impacchetta(rng, lingua, mk(corr), d.map(mk), testo, spieg, { tipo: tipo, parametri: parametri });
      });
    }
  });

  // ======================================================================
  // 21. (complessa) Simplesso completo (cap. 6)
  function opzPunto(x, z) {
    var s = "$\\tilde x_1 = " + q(x[0]).tex() + ",~ \\tilde x_2 = " + q(x[1]).tex() + ",~ z(\\, LP \\,) = " + q(z).tex() + "$";
    return opz(s, s, chiave(x) + "|" + q(z).key());
  }
  // soluzioni di base (ammissibili e non) di un problema con n = 2 e m = 3 in forma canonica
  function soluzioniBase(A, b, c) {
    var righe = A.map(function (r, i) { return { a: r, b: b[i] }; });
    righe.push({ a: [-1, 0], b: 0 }); righe.push({ a: [0, -1], b: 0 });
    var out = [];
    for (var i = 0; i < righe.length; i++) for (var k = i + 1; k < righe.length; k++) {
      var M = [righe[i].a, righe[k].a];
      var d = M[0][0] * M[1][1] - M[0][1] * M[1][0]; if (d === 0) continue;
      var x = [new Q(righe[i].b * M[1][1] - M[0][1] * righe[k].b, d), new Q(M[0][0] * righe[k].b - righe[i].b * M[1][0], d)];
      var amm = x[0].sgn() >= 0 && x[1].sgn() >= 0 && A.every(function (r, t) { return q(r[0]).mul(x[0]).add(q(r[1]).mul(x[1])).cmp(b[t]) <= 0; });
      var z = x[0].mul(c[0]).add(x[1].mul(c[1]));
      if (!out.some(function (o) { return o.x[0].eq(x[0]) && o.x[1].eq(x[1]); })) out.push({ x: x, z: z, amm: amm });
    }
    return out;
  }
  function passiTex(lang, storia, duale) {
    var s = storia.map(function (h) {
      if (duale) return lang === "it" ? "esce $" + xv(h.r) + "$, entra $" + xv(h.p) + "$" : "$" + xv(h.r) + "$ leaves, $" + xv(h.p) + "$ enters";
      return lang === "it" ? "entra $" + xv(h.p) + "$, esce $" + xv(h.r) + "$" : "$" + xv(h.p) + "$ enters, $" + xv(h.r) + "$ leaves";
    });
    return s.join("; ");
  }
  G.push({
    id: "lp-g-simplesso-completo", livello: "complessa", capitolo: "06-simplex",
    link: link("06-simplex", "64-pseudocodice-ad-alto-livello-dellalgoritmo-del-simplesso", "64-high-level-pseudo-code-of-the-simplex-algorithm"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 3, { amin: -1, amax: 5, minPivot: 2, den: 6, abs: 40 }); if (!L) return null;
        var D = L.D, x = puntoD(D, 2), z = D.z;
        var giusta = opzPunto(x, z);
        var st = L.ris.storia, pen = st[st.length - 1].D;
        var cand = [opzPunto(puntoD(pen, 2), pen.z)];
        var sbs = soluzioniBase(L.A, L.b, L.c);
        var inf = sbs.filter(function (o) { return !o.amm && o.z.cmp(z) > 0 && o.x[0].sgn() >= 0 && o.x[1].sgn() >= 0; });
        inf.sort(function (u, v) { return v.z.cmp(u.z); });
        inf.forEach(function (o) { cand.push(opzPunto(o.x, o.z)); });
        sbs.filter(function (o) { return o.amm; }).forEach(function (o) { cand.push(opzPunto(o.x, o.z)); });
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var testo = {
          it: "Si risolva il problema LP " + lpTex("it", "max", L.c, L.A, ["le", "le", "le"], L.b) + " con l'algoritmo del simplesso, partendo dalla base delle variabili di scarto $x_3, x_4, x_5$ e usando la " + BLAND.it + ". Quali sono la soluzione ottima $\\tilde{\\boldsymbol x}$ e il valore ottimo $z(LP)$?",
          en: "Solve the LP problem " + lpTex("en", "max", L.c, L.A, ["le", "le", "le"], L.b) + " with the simplex algorithm, starting from the basis of the slack variables $x_3, x_4, x_5$ and using " + BLAND.en + ". What are the optimal solution $\\tilde{\\boldsymbol x}$ and the optimal value $z(LP)$?"
        };
        var spieg = {
          it: "Operazioni di pivot: " + passiTex("it", st) + ". Il dizionario finale ha tutti i costi ridotti negativi, quindi $" + vett(x) + "$ con $z(LP) = " + z.tex() + "$ è l'unica soluzione ottima. Le altre opzioni sono un vertice visitato prima, vertici non ottimi o soluzioni di base non ammissibili.",
          en: "Pivoting operations: " + passiTex("en", st) + ". The final dictionary has all reduced costs negative, hence $" + vett(x) + "$ with $z(LP) = " + z.tex() + "$ is the unique optimal solution. The other options are a vertex visited earlier, non-optimal vertices or infeasible basic solutions."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: L.A, b: L.b, c: L.c });
      });
    }
  });

  // ======================================================================
  // 22. (complessa) Soluzione duale ottima dopo il simplesso (cap. 9)
  G.push({
    id: "lp-g-coppia-primale-duale", livello: "complessa", capitolo: "09-duality",
    link: link("09-duality", "box-9-theo-dual-2"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 3, { amin: -1, amax: 5, minPivot: 2, den: 6, abs: 40 }); if (!L) return null;
        var D = L.D, n = 2, m = 3, pi = duali(D, n, m);
        var st = L.ris.storia, pen = st[st.length - 1].D;
        var mk = function (v) { var s = vettOpz("\\tilde\\pi", v); return opz(s, s, chiave(v)); };
        var sl = []; for (var i = 1; i <= m; i++) sl.push(D.B.indexOf(n + i) >= 0 ? D.b[n + i] : q(0));
        var cand = [mk(duali(pen, n, m)), mk(pi.map(function (v) { return v.neg(); })), mk(sl), mk(pi.slice().reverse())];
        var sb = scegli(cand, mk(pi), 3); if (!sb) return null;
        var testo = {
          it: "Si risolva il problema LP " + lpTex("it", "max", L.c, L.A, ["le", "le", "le"], L.b) + " con l'algoritmo del simplesso, partendo dalla base delle variabili di scarto $x_3, x_4, x_5$ e usando la " + BLAND.it + ". Qual è la soluzione ottima del problema duale" + PIDEF.it + "?",
          en: "Solve the LP problem " + lpTex("en", "max", L.c, L.A, ["le", "le", "le"], L.b) + " with the simplex algorithm, starting from the basis of the slack variables $x_3, x_4, x_5$ and using " + BLAND.en + ". What is the optimal solution of the dual problem" + PIDEF.en + "?"
        };
        var zz = L.b.map(function (bb, i) { return bb + " \\cdot " + par(pi[i]); }).join(" + ");
        var spieg = {
          it: "Operazioni di pivot: " + passiTex("it", st) + ". Nel dizionario ottimo $\\tilde\\pi_i = -\\bar c_{2+i}$ (costo ridotto della variabile di scarto $x_{2+i}$ cambiato di segno, $0$ se in base). Controllo con la dualità forte: $" + zz + " = " + D.z.tex() + " = z(LP)$.",
          en: "Pivoting operations: " + passiTex("en", st) + ". In the optimal dictionary $\\tilde\\pi_i = -\\bar c_{2+i}$ (reduced cost of the slack variable $x_{2+i}$ with the opposite sign, $0$ if basic). Check with Strong Duality: $" + zz + " = " + D.z.tex() + " = z(LP)$."
        };
        return impacchetta(rng, lingua, mk(pi), sb, testo, spieg, { A: L.A, b: L.b, c: L.c });
      });
    }
  });

  // ======================================================================
  // 23. (complessa) Simplesso duale completo (cap. 10)
  G.push({
    id: "lp-g-simplesso-duale-completo", livello: "complessa", capitolo: "10-dual-simplex",
    link: link("10-dual-simplex", "105-pseudocodice-dellalgoritmo-del-simplesso-duale", "105-pseudo-code-of-the-dual-simplex-algorithm"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var c = [-ri(rng, 1, 8), -ri(rng, 1, 8)];
        var A = [], b = [];
        for (var i = 0; i < 3; i++) { A.push([ri(rng, -4, 4), ri(rng, -4, 4)]); b.push(ri(rng, -12, 10)); }
        if (b.filter(function (v) { return v < 0; }).length < 1 || !righeBuone(A)) return null;
        var ris = simplessoDuale(dizIniziale(A, b, c));
        if (ris.stato !== "ottimo" || ris.storia.length < 2) return null;
        var D = ris.D;
        if (D.N.some(function (j) { return D.c[j].sgn() >= 0; })) return null;
        if (maxDen(D) > 6 || maxAbs(D) > 40) return null;
        for (var k = 0; k < ris.storia.length; k++) { if (ris.storia[k].s.isZero() || maxDen(ris.storia[k].D) > 6) return null; }
        var x = puntoD(D, 2), z = D.z;
        var giusta = opzPunto(x, z);
        var cand = [];
        for (var h = ris.storia.length - 1; h >= 1; h--) { var Dh = ris.storia[h].D; cand.push(opzPunto(puntoD(Dh, 2), Dh.z)); }
        var sbs = soluzioniBase(A, b, c);
        var inf = sbs.filter(function (o) { return !o.amm && o.z.cmp(z) > 0 && o.x[0].sgn() >= 0 && o.x[1].sgn() >= 0; });
        inf.forEach(function (o) { cand.push(opzPunto(o.x, o.z)); });
        sbs.filter(function (o) { return o.amm; }).forEach(function (o) { cand.push(opzPunto(o.x, o.z)); });
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var testo = {
          it: "Si risolva il problema LP " + lpTex("it", "max", c, A, ["le", "le", "le"], b) + " con l'algoritmo del simplesso duale, partendo dalla base delle variabili di scarto $x_3, x_4, x_5$ (duale ammissibile perché ${\\boldsymbol c} \\le {\\boldsymbol 0}$) e usando la " + BLAND_D.it + ". Quali sono la soluzione ottima $\\tilde{\\boldsymbol x}$ e il valore ottimo $z(LP)$?",
          en: "Solve the LP problem " + lpTex("en", "max", c, A, ["le", "le", "le"], b) + " with the dual simplex algorithm, starting from the basis of the slack variables $x_3, x_4, x_5$ (dual feasible since ${\\boldsymbol c} \\le {\\boldsymbol 0}$) and using " + BLAND_D.en + ". What are the optimal solution $\\tilde{\\boldsymbol x}$ and the optimal value $z(LP)$?"
        };
        var spieg = {
          it: "Operazioni di pivot duali (prima la riga, poi la colonna): " + passiTex("it", ris.storia, true) + ". Il dizionario finale ha $\\bar{\\boldsymbol b} \\ge {\\boldsymbol 0}$ e costi ridotti negativi: $" + vett(x) + "$ con $z(LP) = " + z.tex() + "$. Le soluzioni intermedie non sono ammissibili e hanno valore maggiore.",
          en: "Dual pivoting operations (row first, then column): " + passiTex("en", ris.storia, true) + ". The final dictionary has $\\bar{\\boldsymbol b} \\ge {\\boldsymbol 0}$ and negative reduced costs: $" + vett(x) + "$ with $z(LP) = " + z.tex() + "$. The intermediate solutions are infeasible and have a larger value."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: A, b: b, c: c });
      });
    }
  });

  // ======================================================================
  // 24. (complessa) Fase 0 e simplesso: esito del problema (cap. 8)
  function fase0(A, b, c) {
    var n = c.length, m = A.length;
    // dizionario del problema ausiliario: x_i = b_i - sum a_ij x_j + x_0
    var D = { B: range(n + 1, n + m), N: [0].concat(range(1, n)), b: {}, a: {}, c: {}, z: q(0) };
    for (var i = 0; i < m; i++) {
      D.b[n + 1 + i] = q(b[i]); D.a[n + 1 + i] = { 0: q(-1) };
      for (var j = 0; j < n; j++) D.a[n + 1 + i][j + 1] = q(A[i][j]);
    }
    D.c[0] = q(-1); for (var j2 = 1; j2 <= n; j2++) D.c[j2] = q(0);
    var r = D.B[0]; D.B.forEach(function (ii) { if (D.b[ii].cmp(D.b[r]) < 0) r = ii; });
    var bSpec = D.b[r];
    D = pivot(D, 0, r);
    var ris = simplesso(D);
    if (ris.stato !== "ottimo") return { stato: "errore" };
    D = ris.D;
    if (D.z.sgn() < 0) return { stato: "inammissibile", w: D.z, bSpec: bSpec };
    if (D.B.indexOf(0) >= 0) {
      var jj = null; D.N.forEach(function (j) { if (jj === null && !D.a[0][j].isZero()) jj = j; });
      D = pivot(D, jj, 0);
    }
    var E = { B: D.B.slice(), N: D.N.filter(function (j) { return j !== 0; }), b: {}, a: {}, c: {}, z: q(0) };
    var cc = function (j) { return j <= n ? q(c[j - 1]) : q(0); };
    E.B.forEach(function (ii) { E.b[ii] = D.b[ii]; E.a[ii] = {}; E.N.forEach(function (j) { E.a[ii][j] = D.a[ii][j]; }); });
    E.z = q(0); E.B.forEach(function (ii) { E.z = E.z.add(cc(ii).mul(E.b[ii])); });
    E.N.forEach(function (j) { var v = cc(j); E.B.forEach(function (ii) { v = v.sub(cc(ii).mul(E.a[ii][j])); }); E.c[j] = v; });
    var r2 = simplesso(E);
    return { stato: r2.stato === "ottimo" ? "ottimo" : (r2.stato === "illimitato" ? "illimitato" : "errore"), D0: E, D: r2.D, bSpec: bSpec, w: q(0) };
  }
  G.push({
    id: "lp-g-fase0-esito", livello: "complessa", capitolo: "08-phase-zero",
    link: link("08-phase-zero", "84-riconoscere-i-problemi-lp-inammissibili", "84-detecting-infeasible-lp-problems"),
    genera: function (rng, lingua) {
      var obiettivo = pick(rng, ["inammissibile", "ottimo", "ottimo", "illimitato"]);
      return tenta(function () {
        var n = 2, m = 3, A = [], b = [], c = [ri(rng, -3, 5), ri(rng, -3, 5)];
        if (c[0] <= 0 && c[1] <= 0) return null;
        for (var i = 0; i < m; i++) { A.push([ri(rng, -3, 3), ri(rng, -3, 3)]); b.push(ri(rng, -6, 10)); }
        var nneg = b.filter(function (v) { return v < 0; }).length;
        if (nneg < 1 || nneg > 2 || !righeBuone(A)) return null;
        var F = fase0(A, b, c);
        if (F.stato !== obiettivo) return null;
        if (F.stato === "ottimo" && (maxDen(F.D) > 6 || maxAbs(F.D) > 50)) return null;
        if (F.stato === "inammissibile" && F.w.d > 6) return null;
        // valori candidati per le opzioni «ottimo» sbagliate
        var valori = [];
        var rel = { A: [], b: [] }; A.forEach(function (r, t) { if (b[t] >= 0) { rel.A.push(r); rel.b.push(b[t]); } });
        if (rel.A.length) { var R = simplesso(dizIniziale(rel.A, rel.b, c)); if (R.stato === "ottimo" && R.D.z.d <= 6) valori.push(R.D.z); }
        if (F.D0) valori.push(F.D0.z);
        soluzioniBase(A, b, c).forEach(function (o) { if (o.z.d <= 6) valori.push(o.z); });
        valori.push(q(0));
        var INF = function (v) { return opz("Il problema LP è inammissibile: il valore ottimo del problema ausiliario è $" + v.tex() + "$.", "The LP problem is infeasible: the optimal value of the auxiliary problem is $" + v.tex() + "$.", "inf:" + v.key()); };
        var UNB = opz("Il problema LP è illimitato.", "The LP problem is unbounded.", "unb");
        var OPT = function (v) { return opz("Il problema LP ammette soluzione ottima con $z(\\, LP \\,) = " + v.tex() + "$.", "The LP problem admits an optimal solution with $z(\\, LP \\,) = " + v.tex() + "$.", "opt:" + v.key()); };
        var giusta, sb;
        if (F.stato === "inammissibile") { giusta = INF(F.w); sb = scegli([UNB].concat(valori.map(OPT)), giusta, 3); }
        else if (F.stato === "illimitato") { giusta = UNB; sb = scegli([INF(F.bSpec)].concat(valori.map(OPT)), giusta, 3); }
        else { giusta = OPT(F.D.z); sb = scegli([INF(F.bSpec), UNB].concat(valori.map(OPT)), giusta, 3); }
        if (!sb) return null;
        var testo = {
          it: "Si applichino al problema LP " + lpTex("it", "max", c, A, ["le", "le", "le"], b) + " la Fase $0$, cioè il " + AUXDEF.it + " risolto con il simplesso dopo l'operazione di pivot speciale, e, se serve, l'algoritmo del simplesso; in entrambi si usa la " + BLAND.it + ". Quale affermazione è corretta?",
          en: "Apply to the LP problem " + lpTex("en", "max", c, A, ["le", "le", "le"], b) + " Phase $0$, i.e., the " + AUXDEF.en + " solved by the simplex algorithm after the special pivoting operation, and, if needed, the simplex algorithm; both use " + BLAND.en + ". Which statement is correct?"
        };
        var spieg;
        if (F.stato === "inammissibile") spieg = {
          it: "Il problema ausiliario ha valore ottimo $-\\tilde x_0 = " + F.w.tex() + " < 0$: per il teorema sull'ammissibilità di un problema LP il problema non ha soluzioni ammissibili.",
          en: "The auxiliary problem has optimal value $-\\tilde x_0 = " + F.w.tex() + " < 0$: by the theorem on the feasibility of an LP problem, the problem has no feasible solution." };
        else if (F.stato === "illimitato") spieg = {
          it: "La Fase $0$ termina con valore ottimo $0$ e fornisce una base ammissibile; il simplesso trova poi una variabile con costo ridotto positivo e tutti i coefficienti $\\bar a_{ip} \\le 0$: certificato di illimitatezza.",
          en: "Phase $0$ ends with optimal value $0$ and gives a feasible basis; the simplex algorithm then finds a variable with a positive reduced cost and all coefficients $\\bar a_{ip} \\le 0$: certificate of unboundedness." };
        else spieg = {
          it: "La Fase $0$ termina con valore ottimo $0$ (il problema è ammissibile) e fornisce la base iniziale; dopo aver sostituito la funzione obiettivo originale, il simplesso termina con $z(LP) = " + F.D.z.tex() + "$ nel vertice $" + vett(puntoD(F.D, 2)) + "$.",
          en: "Phase $0$ ends with optimal value $0$ (the problem is feasible) and gives the initial basis; after substituting the original objective function, the simplex algorithm ends with $z(LP) = " + F.D.z.tex() + "$ at the vertex $" + vett(puntoD(F.D, 2)) + "$." };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: A, b: b, c: c });
      });
    }
  });
  // ======================================================================
  // ARRICCHIMENTO (6 novembre 2026): almeno due generatori per capitolo con calcoli
  // ======================================================================

  function opzVal(v) { v = q(v); return opz("$" + v.tex() + "$", "$" + v.tex() + "$", v.key()); }
  function insiemeIdx(arr, lang) {
    if (!arr.length) return lang === "it" ? "nessun vincolo" : "no constraint";
    var parola = lang === "it" ? (arr.length === 1 ? "solo il vincolo " : "i vincoli ") : (arr.length === 1 ? "only constraint " : "constraints ");
    var e = arr.map(String);
    var lista = e.length === 1 ? e[0] : e.slice(0, -1).join(", ") + (lang === "it" ? " e " : " and ") + e[e.length - 1];
    return parola + lista;
  }

  // ----------------------------------------------------------------------
  // 25. Variazione di una funzione lineare lungo una direzione (cap. 1)
  G.push({
    id: "lp-g-variazione-direzione", livello: "facile", capitolo: "01-linear-functions",
    link: link("01-linear-functions", "box-2-def-gradient"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var c = [nz(rng, -5, 5), nz(rng, -5, 5)], d = [nz(rng, -3, 3), nz(rng, -3, 3)];
        var x = [ri(rng, -3, 4), ri(rng, -3, 4)], t = ri(rng, 2, 4);
        var cd = c[0] * d[0] + c[1] * d[1];
        if (cd === 0) return null;
        var giusta = t * cd;
        var fx = c[0] * x[0] + c[1] * x[1];
        var nuovo = c[0] * (x[0] + t * d[0]) + c[1] * (x[1] + t * d[1]);
        var cand = [opzVal(cd), opzVal(t * (c[0] * d[0] - c[1] * d[1])), opzVal(nuovo), opzVal(-giusta), opzVal(t * (c[0] * d[1] + c[1] * d[0]))];
        var sb = scegli(cand, opzVal(giusta), 3); if (!sb) return null;
        var fT = lin(c, ["x_1", "x_2"]);
        var testo = {
          it: "Si consideri la funzione lineare $f({\\boldsymbol x}) = " + fT + "$ su $\\R^2$, il punto $\\bar{\\boldsymbol x} = " + vett(x) + "$ e la direzione ${\\boldsymbol d} = " + vett(d) + "$. Quanto vale la variazione $f(\\bar{\\boldsymbol x} + " + t + "\\,{\\boldsymbol d}) - f(\\bar{\\boldsymbol x})$?",
          en: "Consider the linear function $f({\\boldsymbol x}) = " + fT + "$ on $\\R^2$, the point $\\bar{\\boldsymbol x} = " + vett(x) + "$ and the direction ${\\boldsymbol d} = " + vett(d) + "$. What is the change $f(\\bar{\\boldsymbol x} + " + t + "\\,{\\boldsymbol d}) - f(\\bar{\\boldsymbol x})$?"
        };
        var conto = t + " \\cdot (" + c[0] + " \\cdot " + par(d[0]) + " + " + par(c[1]) + " \\cdot " + par(d[1]) + ") = " + giusta;
        var spieg = {
          it: "Per linearità $f(\\bar{\\boldsymbol x} + t\\,{\\boldsymbol d}) - f(\\bar{\\boldsymbol x}) = t\\,{\\boldsymbol c}'{\\boldsymbol d} = " + conto + "$, qualunque sia $\\bar{\\boldsymbol x}$; il valore $" + nuovo + "$ è $f(\\bar{\\boldsymbol x} + " + t + "\\,{\\boldsymbol d})$, non la variazione.",
          en: "By linearity $f(\\bar{\\boldsymbol x} + t\\,{\\boldsymbol d}) - f(\\bar{\\boldsymbol x}) = t\\,{\\boldsymbol c}'{\\boldsymbol d} = " + conto + "$, whatever $\\bar{\\boldsymbol x}$ is; the value $" + nuovo + "$ is $f(\\bar{\\boldsymbol x} + " + t + "\\,{\\boldsymbol d})$, not the change."
        };
        if (nuovo === giusta) return null;
        return impacchetta(rng, lingua, opzVal(giusta), sb, testo, spieg, { c: c, d: d, x: x, t: t });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 26. Vincoli attivi in un punto di un poliedro (cap. 2)
  G.push({
    id: "lp-g-vincoli-attivi", livello: "facile", capitolo: "02-polyhedra",
    link: link("02-polyhedra", "box-2-texexpbox1"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var P = [ri(rng, 0, 3), ri(rng, 0, 3)], A = [], b = [], att = [];
        var nAtt = ri(rng, 1, 2);
        var quali = shuffle(rng, [0, 1, 2, 3]).slice(0, nAtt);
        for (var i = 0; i < 4; i++) {
          var a = [ri(rng, -3, 3), ri(rng, -3, 3)];
          if (a[0] === 0 && a[1] === 0) return null;
          var att_i = quali.indexOf(i) >= 0;
          A.push(a); b.push(a[0] * P[0] + a[1] * P[1] + (att_i ? 0 : ri(rng, 1, 4)));
          if (att_i) att.push(i + 1);
        }
        if (!righeBuone(A)) return null;
        var tutti = [1, 2, 3, 4];
        var mk = function (arr) { return opz(insiemeIdx(arr, "it"), insiemeIdx(arr, "en"), arr.join(",") || "-"); };
        var compl = tutti.filter(function (k) { return att.indexOf(k) < 0; });
        // errore tipico: vincoli «quasi attivi» (scarto 1) o il complemento
        var vicino = tutti.filter(function (k) { return att.indexOf(k) >= 0 || b[k - 1] - (A[k - 1][0] * P[0] + A[k - 1][1] * P[1]) === 1; });
        var unoSolo = [att[0]];
        var cand = [mk(compl), mk(vicino), mk(tutti), mk(att.length > 1 ? unoSolo : att.concat([compl[0]]).sort())];
        var sb = scegli(cand, mk(att), 3); if (!sb) return null;
        var righe = A.map(function (a, i) { return "(" + (i + 1) + ")~ " + lin(a, ["x_1", "x_2"]) + " \\le " + b[i]; });
        var testo = {
          it: "Si consideri il poliedro $P = \\{{\\boldsymbol x} \\in \\R^2 : " + righe.join(",~ ") + "\\}$ e il suo punto $\\bar{\\boldsymbol x} = " + vett(P) + "$. Un vincolo è attivo in $\\bar{\\boldsymbol x}$ se è soddisfatto all'uguaglianza, cioè se $\\bar{\\boldsymbol x}$ sta sul suo iperpiano di supporto. Quali vincoli sono attivi in $\\bar{\\boldsymbol x}$?",
          en: "Consider the polyhedron $P = \\{{\\boldsymbol x} \\in \\R^2 : " + righe.join(",~ ") + "\\}$ and its point $\\bar{\\boldsymbol x} = " + vett(P) + "$. A constraint is active at $\\bar{\\boldsymbol x}$ if it is satisfied with equality, i.e., if $\\bar{\\boldsymbol x}$ lies on its supporting hyperplane. Which constraints are active at $\\bar{\\boldsymbol x}$?"
        };
        var val = A.map(function (a) { return a[0] * P[0] + a[1] * P[1]; });
        var elenco = val.map(function (v, i) { return "(" + (i + 1) + ")~ " + v + (v === b[i] ? " = " : " < ") + b[i]; }).join(",~ ");
        var spieg = {
          it: "Sostituendo $\\bar{\\boldsymbol x}$: $" + elenco + "$. Sono attivi i vincoli con l'uguaglianza; gli altri sono soddisfatti con la disuguaglianza stretta.",
          en: "Substituting $\\bar{\\boldsymbol x}$: $" + elenco + "$. The constraints with equality are active; the others are satisfied with strict inequality."
        };
        return impacchetta(rng, lingua, mk(att), sb, testo, spieg, { A: A, b: b, x: P });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 27. Problema LP in una variabile (cap. 3)
  G.push({
    id: "lp-g-ottimo-una-variabile", livello: "facile", capitolo: "03-linear-optimization-problems",
    link: link("03-linear-optimization-problems", "312-soluzioni-ottime-e-valore-ottimo", "312-optimal-solutions-and-optimal-value"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var a = nz(rng, -4, 4), b0 = ri(rng, -5, 5), senso = pick(rng, ["max", "min"]);
        var tipo = pick(rng, ["int", "int", "giu", "su"]);
        var l = ri(rng, -4, 1), u = ri(rng, 2, 6);
        var f = function (x) { return a * x + b0; };
        var cresce = (senso === "max") === (a > 0);   // conviene aumentare x
        var dom, best = null;
        if (tipo === "int") { dom = l + " \\le x \\le " + u; best = cresce ? u : l; }
        else if (tipo === "su") { dom = "x \\ge " + l; best = cresce ? null : l; }
        else { dom = "x \\le " + u; best = cresce ? u : null; }
        var UNB = opz("Il problema è illimitato", "The problem is unbounded", "unb");
        var mk = function (x) { return opz("$\\tilde x = " + x + "$, $z(LP) = " + f(x) + "$", "$\\tilde x = " + x + "$, $z(LP) = " + f(x) + "$", x + "|" + f(x)); };
        var mkv = function (x, v) { return opz("$\\tilde x = " + x + "$, $z(LP) = " + v + "$", "$\\tilde x = " + x + "$, $z(LP) = " + v + "$", x + "|" + v); };
        var giusta, cand;
        var estremi = tipo === "int" ? [l, u] : (tipo === "su" ? [l] : [u]);
        if (best === null) {
          giusta = UNB;
          var e = estremi[0];
          cand = [mk(e), mkv(e, -f(e)), mk(0), mk(e + 1)];
        } else {
          giusta = mk(best);
          var altro = tipo === "int" ? (best === l ? u : l) : best + (cresce ? -1 : 1);
          cand = [mk(altro), mkv(best, a * best - b0), UNB, mk(0)];
        }
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var fT = (a === 1 ? "" : a === -1 ? "-" : a) + "x" + (b0 > 0 ? " + " + b0 : b0 < 0 ? " - " + (-b0) : "");
        var testo = {
          it: "Si consideri il problema LP in una variabile $\\" + senso + "\\{" + fT + " : " + dom + "\\}$, con soluzione ottima $\\tilde x$ e valore ottimo $z(LP)$ se esistono. Quale affermazione è corretta?",
          en: "Consider the LP problem in one variable $\\" + senso + "\\{" + fT + " : " + dom + "\\}$, with optimal solution $\\tilde x$ and optimal value $z(LP)$ if they exist. Which statement is correct?"
        };
        var dir = { it: cresce ? "conviene aumentare $x$" : "conviene diminuire $x$", en: cresce ? "it pays to increase $x$" : "it pays to decrease $x$" };
        var spieg = best === null ? {
          it: "Il coefficiente di $x$ è $" + a + "$: in un problema di " + (senso === "max" ? "massimo" : "minimo") + " " + dir.it + ", e in quella direzione la regione ammissibile non ha limite, quindi il problema è illimitato.",
          en: "The coefficient of $x$ is $" + a + "$: in a " + (senso === "max" ? "maximization" : "minimization") + " problem " + dir.en + ", and in that direction the feasible region has no bound, hence the problem is unbounded."
        } : {
          it: "Il coefficiente di $x$ è $" + a + "$: in un problema di " + (senso === "max" ? "massimo" : "minimo") + " " + dir.it + " fino all'estremo $\\tilde x = " + best + "$, con $z(LP) = " + a + " \\cdot " + par(best) + (b0 >= 0 ? " + " + b0 : " - " + (-b0)) + " = " + f(best) + "$.",
          en: "The coefficient of $x$ is $" + a + "$: in a " + (senso === "max" ? "maximization" : "minimization") + " problem " + dir.en + " up to the endpoint $\\tilde x = " + best + "$, with $z(LP) = " + a + " \\cdot " + par(best) + (b0 >= 0 ? " + " + b0 : " - " + (-b0)) + " = " + f(best) + "$."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { a: a, b0: b0, senso: senso, tipo: tipo, l: l, u: u });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 28. Proprietà dei problemi LP: costante additiva e fattore di scala (cap. 3)
  G.push({
    id: "lp-g-proprieta-scala", livello: "facile", capitolo: "03-linear-optimization-problems",
    link: link("03-linear-optimization-problems", "321-proprieta-dei-problemi-lp", "321-properties-of-lp-problems"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var vmin = ri(rng, -6, 4), vmax = vmin + ri(rng, 2, 9);
        var al = nz(rng, -3, 3), be = nz(rng, -6, 6);
        if (Math.abs(al) === 1) return null;
        var senso = pick(rng, ["min", "max"]);
        var base = senso === "min" ? (al > 0 ? vmin : vmax) : (al > 0 ? vmax : vmin);
        var giusta = al * base + be;
        var sbagliato = senso === "min" ? (al > 0 ? vmax : vmin) : (al > 0 ? vmin : vmax);
        var cand = [opzVal(al * sbagliato + be), opzVal(al * (base + be)), opzVal(base + be), opzVal(al * base - be)];
        var sb = scegli(cand, opzVal(giusta), 3); if (!sb) return null;
        var g = (al === -1 ? "-" : al) + "\\,{\\boldsymbol c}'{\\boldsymbol x}" + (be > 0 ? " + " + be : " - " + (-be));
        var testo = {
          it: "Sia $F \\subseteq \\R^n$ la regione ammissibile di un problema LP e si sappia che $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol x} \\in F\\} = " + vmin + "$ e $\\max\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol x} \\in F\\} = " + vmax + "$. Quanto vale $\\" + senso + "\\{" + g + " : {\\boldsymbol x} \\in F\\}$?",
          en: "Let $F \\subseteq \\R^n$ be the feasible region of an LP problem and assume that $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol x} \\in F\\} = " + vmin + "$ and $\\max\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol x} \\in F\\} = " + vmax + "$. What is $\\" + senso + "\\{" + g + " : {\\boldsymbol x} \\in F\\}$?"
        };
        var perche = { it: al > 0 ? "con un fattore positivo il problema di " + (senso === "min" ? "minimo" : "massimo") + " resta tale" : "con un fattore negativo il " + (senso === "min" ? "minimo" : "massimo") + " si ottiene dal " + (senso === "min" ? "massimo" : "minimo") + " di ${\\boldsymbol c}'{\\boldsymbol x}$",
                       en: al > 0 ? "with a positive factor the " + (senso === "min" ? "minimization" : "maximization") + " stays as it is" : "with a negative factor the " + (senso === "min" ? "minimum" : "maximum") + " comes from the " + (senso === "min" ? "maximum" : "minimum") + " of ${\\boldsymbol c}'{\\boldsymbol x}$" };
        var conto = al + " \\cdot " + par(base) + (be > 0 ? " + " + be : " - " + (-be)) + " = " + giusta;
        var spieg = {
          it: "La costante si somma al valore ottimo e il fattore lo moltiplica, ma " + perche.it + ": $" + conto + "$.",
          en: "The constant is added to the optimal value and the factor multiplies it, but " + perche.en + ": $" + conto + "$."
        };
        return impacchetta(rng, lingua, opzVal(giusta), sb, testo, spieg, { vmin: vmin, vmax: vmax, al: al, be: be, senso: senso });
      });
    }
  });

  // ----------------------------------------------------------------------
  // geometria di un problema con due variabili: vertici, ammissibilità, raggi
  function vertici2(A, b, versi) {
    var righe = A.map(function (r, i) { return { a: r, b: b[i] }; });
    righe.push({ a: [1, 0], b: 0 }); righe.push({ a: [0, 1], b: 0 });
    var amm = function (x) {
      if (x[0].sgn() < 0 || x[1].sgn() < 0) return false;
      for (var i = 0; i < A.length; i++) {
        var v = x[0].mul(A[i][0]).add(x[1].mul(A[i][1]));
        if (versi[i] === "le" ? v.cmp(b[i]) > 0 : v.cmp(b[i]) < 0) return false;
      }
      return true;
    };
    var tuttiP = [], vert = [];
    for (var i = 0; i < righe.length; i++) for (var k = i + 1; k < righe.length; k++) {
      var M = [righe[i].a, righe[k].a], d = M[0][0] * M[1][1] - M[0][1] * M[1][0];
      if (d === 0) continue;
      var x = [new Q(righe[i].b * M[1][1] - M[0][1] * righe[k].b, d), new Q(M[0][0] * righe[k].b - righe[i].b * M[1][0], d)];
      tuttiP.push(x);
      if (amm(x) && !vert.some(function (o) { return o[0].eq(x[0]) && o[1].eq(x[1]); })) vert.push(x);
    }
    return { vert: vert, tutti: tuttiP, amm: amm };
  }
  function illimitato2(A, versi, c) {
    // raggi estremi del cono di recessione {d >= 0, A_i d <= 0 (le) o >= 0 (ge)}
    var cand = [[1, 0], [0, 1]];
    A.forEach(function (r) { if (r[0] * r[1] < 0) cand.push([Math.abs(r[1]), Math.abs(r[0])]); });
    return cand.some(function (dd) {
      var ok = A.every(function (r, i) { var v = r[0] * dd[0] + r[1] * dd[1]; return versi[i] === "le" ? v <= 0 : v >= 0; });
      return ok && c[0] * dd[0] + c[1] * dd[1] > 0;
    });
  }

  // ----------------------------------------------------------------------
  // 29. Esito di un problema LP con due variabili (cap. 5)
  G.push({
    id: "lp-g-esito-due-variabili", livello: "media", capitolo: "05-outcomes-equivalences",
    link: link("05-outcomes-equivalences", "52-problemi-lp-inammissibili-e-illimitati", "52-infeasible-and-unbounded-lp-problems"),
    genera: function (rng, lingua) {
      var obiettivo = pick(rng, ["inf", "unb", "opt", "opt"]);
      return tenta(function () {
        var A = [], b = [], versi = [];
        for (var i = 0; i < 2; i++) { A.push([nz(rng, -3, 4), nz(rng, -3, 4)]); b.push(ri(rng, -6, 12)); versi.push(pick(rng, ["le", "ge"])); }
        if (!righeBuone(A)) return null;
        var c = [nz(rng, -4, 5), nz(rng, -4, 5)];
        var G2 = vertici2(A, b, versi);
        var stato, zopt = null;
        if (!G2.vert.length) stato = "inf";
        else if (illimitato2(A, versi, c)) stato = "unb";
        else {
          stato = "opt";
          zopt = qmax(G2.vert.map(function (x) { return x[0].mul(c[0]).add(x[1].mul(c[1])); }));
          if (zopt.d > 4) return null;
        }
        if (stato !== obiettivo) return null;
        var INF = opz("Il problema LP è inammissibile", "The LP problem is infeasible", "inf");
        var UNB = opz("Il problema LP è illimitato", "The LP problem is unbounded", "unb");
        var OPT = function (v) { return opz("Il problema LP ha soluzione ottima, con $z(LP) = " + v.tex() + "$", "The LP problem has an optimal solution, with $z(LP) = " + v.tex() + "$", "opt:" + v.key()); };
        // valori sbagliati tipici: punti di base non ammissibili, vertici non ottimi, vincolo con verso sbagliato
        var valori = [];
        G2.tutti.forEach(function (x) { if (x[0].sgn() >= 0 && x[1].sgn() >= 0 && x[0].d <= 4 && x[1].d <= 4 && Math.abs(x[0].mul(c[0]).add(x[1].mul(c[1])).n) <= 40) valori.push(x[0].mul(c[0]).add(x[1].mul(c[1]))); });
        valori.push(q(0));
        valori = shuffle(rng, valori);
        var giusta = stato === "inf" ? INF : stato === "unb" ? UNB : OPT(zopt);
        var cand = [INF, UNB].concat(valori.map(OPT));
        if (stato === "opt") cand = shuffle(rng, [INF, UNB]).slice(0, 1).concat(valori.map(OPT)).concat([INF, UNB]);
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var testo = {
          it: "Si consideri il problema LP " + lpTex("it", "max", c, A, versi, b) + ". Quale affermazione sul suo esito è corretta?",
          en: "Consider the LP problem " + lpTex("en", "max", c, A, versi, b) + ". Which statement about its outcome is correct?"
        };
        var spieg;
        if (stato === "inf") spieg = { it: "Nessuna intersezione di due rette fra quelle dei vincoli e degli assi soddisfa tutti i vincoli: la regione ammissibile è vuota (un poliedro non vuoto in $\\R^2_{\\ge 0}$ ha sempre un vertice).", en: "No intersection of two lines among those of the constraints and of the axes satisfies all the constraints: the feasible region is empty (a non-empty polyhedron in $\\R^2_{\\ge 0}$ always has a vertex)." };
        else if (stato === "unb") spieg = { it: "La regione ammissibile non è vuota e contiene una semiretta lungo una direzione ${\\boldsymbol d} \\ge {\\boldsymbol 0}$ che rispetta i vincoli e ha ${\\boldsymbol c}'{\\boldsymbol d} > 0$: la funzione obiettivo cresce senza limite.", en: "The feasible region is non-empty and contains a half-line along a direction ${\\boldsymbol d} \\ge {\\boldsymbol 0}$ which respects the constraints and has ${\\boldsymbol c}'{\\boldsymbol d} > 0$: the objective function grows without bound." };
        else spieg = { it: "La regione ammissibile non è vuota e nessuna direzione ammissibile fa crescere la funzione obiettivo senza limite; il massimo sui vertici ammissibili è $z(LP) = " + zopt.tex() + "$. Gli altri valori vengono da punti di base non ammissibili o da vertici non ottimi.", en: "The feasible region is non-empty and no feasible direction makes the objective function grow without bound; the maximum over the feasible vertices is $z(LP) = " + zopt.tex() + "$. The other values come from infeasible basic points or non-optimal vertices." };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: A, b: b, c: c, versi: versi });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 30. Soluzioni ottime multiple: pivot su una colonna con costo ridotto nullo (cap. 7)
  G.push({
    id: "lp-g-ottimi-multipli", livello: "media", capitolo: "07-optimality-pivot",
    link: link("07-optimality-pivot", "box-2-cor-pivot-1"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var D = dizCasuale(rng, 3, 2, -3, 3);
        var p = pick(rng, D.N), altro = D.N[0] === p ? D.N[1] : D.N[0];
        D.c[p] = q(0); D.c[altro] = q(-ri(rng, 1, 5));
        var tr = testRapporti(D, p); if (!tr) return null;
        var rpos = D.B.filter(function (i) { return D.a[i][p].sgn() > 0; });
        if (rpos.length < 2) return null;
        var E = pivot(D, p, tr.r);
        var mk = function (r, t, z) {
          return opz("esce $" + xv(r) + "$, la nuova soluzione ha $" + xv(p) + " = " + t.tex() + "$ e $z = " + z.tex() + "$",
                     "$" + xv(r) + "$ leaves, the new solution has $" + xv(p) + " = " + t.tex() + "$ and $z = " + z.tex() + "$", r + "|" + t.key() + "|" + z.key());
        };
        var giusta = mk(tr.r, tr.t, D.z);
        var rm = rpos[0]; rpos.forEach(function (i) { if (D.b[i].div(D.a[i][p]).cmp(D.b[rm].div(D.a[rm][p])) > 0) rm = i; });
        var tmax = D.b[rm].div(D.a[rm][p]);
        var cand = [mk(tr.r, tr.t, D.z.add(tr.t)), mk(rm, tmax, D.z), mk(tr.r, D.b[tr.r], D.z), mk(rm, tmax, D.z.add(tmax))];
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var testo = {
          it: DIZ_PRE.it + partTex(D) + ": " + dizTex(D) + DIZ_CONV.it + ". Il dizionario è ottimo e il costo ridotto di $" + xv(p) + "$ è nullo. Si esegue un'operazione di pivot con colonna $" + xv(p) + "$ (riga pivot dal test dei rapporti, a parità l'indice minimo). Che cosa si ottiene?",
          en: DIZ_PRE.en + partTex(D) + ": " + dizTex(D) + DIZ_CONV.en + ". The dictionary is optimal and the reduced cost of $" + xv(p) + "$ is zero. A pivoting operation is performed with column $" + xv(p) + "$ (pivot row from the ratio test, ties broken by the smallest index). What is obtained?"
        };
        var rapporti = rpos.map(function (i) { return "\\frac{" + D.b[i].tex() + "}{" + D.a[i][p].tex() + "}"; }).join(",~ ");
        var spieg = {
          it: "Test dei rapporti: $t_m = \\min\\{" + rapporti + "\\} = " + tr.t.tex() + "$, raggiunto da $" + xv(tr.r) + "$. Il valore diventa $\\bar z + t_m\\,\\bar c_{" + p + "} = \\bar z = " + D.z.tex() + "$ perché $\\bar c_{" + p + "} = 0$: si ottiene un'altra soluzione di base ammissibile ottima, quindi l'ottimo non è unico.",
          en: "Ratio test: $t_m = \\min\\{" + rapporti + "\\} = " + tr.t.tex() + "$, attained by $" + xv(tr.r) + "$. The value becomes $\\bar z + t_m\\,\\bar c_{" + p + "} = \\bar z = " + D.z.tex() + "$ since $\\bar c_{" + p + "} = 0$: another optimal basic feasible solution is obtained, hence the optimum is not unique."
        };
        if (tr.t.isZero() || maxDen(E) > 6) return null;
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { D: dizDati(D), p: p });
      });
    }
  });

  // ----------------------------------------------------------------------
  // forma standard 2 x 4 con termini noti (simplesso rivisto e duale rivisto)
  function standard2b(rng, bmin, bmax) {
    var S = standard2(rng);
    S.b = [ri(rng, bmin, bmax), ri(rng, bmin, bmax)];
    return S;
  }
  function stdTexB(lang, S) {
    return "${\\boldsymbol A} = " + matrice(S.A) + "$, ${\\boldsymbol b} = " + vett(S.b) + "'$, ${\\boldsymbol c}' = " + vett(S.c) + "$";
  }
  function datiBase(S, B) {
    var AB = [[S.A[0][B[0] - 1], S.A[0][B[1] - 1]], [S.A[1][B[0] - 1], S.A[1][B[1] - 1]]];
    var Ai = inv2(AB); if (!Ai) return null;
    var bb = [Ai[0][0].mul(S.b[0]).add(Ai[0][1].mul(S.b[1])), Ai[1][0].mul(S.b[0]).add(Ai[1][1].mul(S.b[1]))];
    var cB = [q(S.c[B[0] - 1]), q(S.c[B[1] - 1])];
    var pi = [cB[0].mul(Ai[0][0]).add(cB[1].mul(Ai[1][0])), cB[0].mul(Ai[0][1]).add(cB[1].mul(Ai[1][1]))];
    var N = [1, 2, 3, 4].filter(function (j) { return B.indexOf(j) < 0; });
    var cb = {}; N.forEach(function (j) { cb[j] = q(S.c[j - 1]).sub(pi[0].mul(S.A[0][j - 1])).sub(pi[1].mul(S.A[1][j - 1])); });
    return { AB: AB, Ai: Ai, bb: bb, pi: pi, N: N, cb: cb };
  }

  // ----------------------------------------------------------------------
  // 31. Simplesso rivisto: colonna d e test dei rapporti (cap. 11)
  G.push({
    id: "lp-g-rivisto-passo", livello: "media", capitolo: "11-revised-simplex",
    link: link("11-revised-simplex", "112-pseudocodice-dellalgoritmo-del-simplesso-rivisto", "112-pseudo-code-of-the-revised-simplex-algorithm"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var S = standard2b(rng, 2, 12);
        var B = ord(shuffle(rng, [1, 2, 3, 4]).slice(0, 2));
        if (B[0] === 3) return null;   // non la base banale delle variabili di scarto
        var X = datiBase(S, B); if (!X) return null;
        if (Math.abs(X.AB[0][0] * X.AB[1][1] - X.AB[0][1] * X.AB[1][0]) > 3) return null;
        if (X.bb.some(function (v) { return v.sgn() <= 0; })) return null;
        var pos = X.N.filter(function (j) { return X.cb[j].sgn() > 0; }); if (!pos.length) return null;
        var p = pos[0], Ap = colA(S.A, p);
        var d = [X.Ai[0][0].mul(Ap[0]).add(X.Ai[0][1].mul(Ap[1])), X.Ai[1][0].mul(Ap[0]).add(X.Ai[1][1].mul(Ap[1]))];
        var rr = [0, 1].filter(function (k) { return d[k].sgn() > 0; });
        if (rr.length !== 2) return null;
        var rat = rr.map(function (k) { return X.bb[k].div(d[k]); });
        if (rat[0].eq(rat[1])) return null;
        var kmin = rat[0].cmp(rat[1]) < 0 ? 0 : 1, kmax = 1 - kmin;
        var mk = function (k, t) { return opz("esce $" + xv(B[k]) + "$, $t_m = " + t.tex() + "$", "$" + xv(B[k]) + "$ leaves, $t_m = " + t.tex() + "$", B[k] + "|" + t.key()); };
        var giusta = mk(kmin, rat[kmin]);
        // errori: rapporto massimo; d dal sistema trasposto; rapporti b/A_p senza A_B^{-1}
        var dT = [X.Ai[0][0].mul(Ap[0]).add(X.Ai[1][0].mul(Ap[1])), X.Ai[0][1].mul(Ap[0]).add(X.Ai[1][1].mul(Ap[1]))];
        var cand = [mk(kmax, rat[kmax])];
        var rT = [0, 1].filter(function (k) { return dT[k].sgn() > 0; });
        if (rT.length) { var km = rT[0]; rT.forEach(function (k) { if (X.bb[k].div(dT[k]).cmp(X.bb[km].div(dT[km])) < 0) km = k; }); cand.push(mk(km, X.bb[km].div(dT[km]))); }
        cand.push(mk(kmin, X.bb[kmin].mul(d[kmin])));
        cand.push(mk(kmax, rat[kmin]));
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var testo = {
          it: "Nel simplesso rivisto per il problema LP in forma standard di massimo $\\max\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ con " + stdTexB(lingua, S) + ", la base corrente è $\\pazocal{B} = " + insieme(B) + "$ e la colonna pivot è $" + xv(p) + "$ ($\\bar c_" + p + " > 0$). Si calcolano $\\bar{\\boldsymbol b} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol b}$ e ${\\boldsymbol d} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol A}_" + p + "$ (componenti nell'ordine di $\\pazocal{B}$) e il passo $t_m$ del test dei rapporti. Quale variabile esce dalla base e quanto vale $t_m$?",
          en: "In the revised simplex algorithm for the LP problem in standard maximization form $\\max\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ with " + stdTexB(lingua, S) + ", the current basis is $\\pazocal{B} = " + insieme(B) + "$ and the pivot column is $" + xv(p) + "$ ($\\bar c_" + p + " > 0$). One computes $\\bar{\\boldsymbol b} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol b}$ and ${\\boldsymbol d} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol A}_" + p + "$ (entries in the order of $\\pazocal{B}$) and the step $t_m$ of the ratio test. Which variable leaves the basis and what is $t_m$?"
        };
        var spieg = {
          it: "Con ${\\boldsymbol A}_{\\pazocal{B}} = " + matrice(X.AB) + "$ si ha $\\bar{\\boldsymbol b} = " + vett(X.bb) + "'$ e ${\\boldsymbol d} = " + vett(d) + "'$ (sistema ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol d} = {\\boldsymbol A}_" + p + "$, non trasposto). Allora $t_m = \\min\\{" + rr.map(function (k) { return "\\frac{" + X.bb[k].tex() + "}{" + d[k].tex() + "}"; }).join(",~ ") + "\\} = " + rat[kmin].tex() + "$, raggiunto da $" + xv(B[kmin]) + "$.",
          en: "With ${\\boldsymbol A}_{\\pazocal{B}} = " + matrice(X.AB) + "$ we get $\\bar{\\boldsymbol b} = " + vett(X.bb) + "'$ and ${\\boldsymbol d} = " + vett(d) + "'$ (system ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol d} = {\\boldsymbol A}_" + p + "$, not transposed). Then $t_m = \\min\\{" + rr.map(function (k) { return "\\frac{" + X.bb[k].tex() + "}{" + d[k].tex() + "}"; }).join(",~ ") + "\\} = " + rat[kmin].tex() + "$, attained by $" + xv(B[kmin]) + "$."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { A: S.A, b: S.b, c: S.c, B: B, p: p });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 32. Simplesso duale rivisto: riga e colonna pivot (cap. 12)
  G.push({
    id: "lp-g-rivisto-duale-passo", livello: "media", capitolo: "12-revised-dual",
    link: link("12-revised-dual", "123-pseudocodice-dellalgoritmo-del-simplesso-duale-rivisto", "123-pseudo-code-of-the-revised-dual-simplex-algorithm"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var S = standard2b(rng, -10, 10);
        S.c = [-ri(rng, 1, 8), -ri(rng, 1, 8), 0, 0];
        var B = ord(shuffle(rng, [1, 2, 3, 4]).slice(0, 2));
        var X = datiBase(S, B); if (!X) return null;
        if (Math.abs(X.AB[0][0] * X.AB[1][1] - X.AB[0][1] * X.AB[1][0]) > 3) return null;
        if (X.N.some(function (j) { return X.cb[j].sgn() >= 0; })) return null;          // duale ammissibile, senza pareggi a zero
        var neg = [0, 1].filter(function (k) { return X.bb[k].sgn() < 0; });
        if (!neg.length) return null;
        var kr = neg[0]; if (neg.length === 2 && B[1] < B[0]) kr = 1;
        var r = B[kr], u = X.Ai[kr];
        var arj = {}; X.N.forEach(function (j) { arj[j] = u[0].mul(S.A[0][j - 1]).add(u[1].mul(S.A[1][j - 1])); });
        var cn = X.N.filter(function (j) { return arj[j].sgn() < 0; });
        if (cn.length !== 2) return null;
        var rat = cn.map(function (j) { return X.cb[j].div(arj[j]); });
        if (rat[0].eq(rat[1])) return null;
        var p = rat[0].cmp(rat[1]) < 0 ? cn[0] : cn[1], pmax = p === cn[0] ? cn[1] : cn[0];
        var mk = function (rr, pp) { return opz("riga pivot $" + xv(rr) + "$, colonna pivot $" + xv(pp) + "$", "pivot row $" + xv(rr) + "$, pivot column $" + xv(pp) + "$", rr + "," + pp); };
        var altraR = B[1 - kr];
        var cand = [mk(r, pmax), mk(altraR, p), mk(altraR, pmax)];
        var sb = scegli(cand, mk(r, p), 3); if (!sb) return null;
        var testo = {
          it: "Nel simplesso duale rivisto per il problema LP in forma standard di massimo $\\max\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ con " + stdTexB(lingua, S) + ", la base corrente $\\pazocal{B} = " + insieme(B) + "$ è duale ammissibile, con costi ridotti " + X.N.map(function (j) { return "$\\bar c_" + j + " = " + X.cb[j].tex() + "$"; }).join(", ") + ". Si usa la " + BLAND_D[lingua] + ", dove $\\bar{\\boldsymbol b} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol b}$ e $\\bar a_{rj} = {\\boldsymbol u}\\,{\\boldsymbol A}_j$ con ${\\boldsymbol u}\\,{\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol e}'_r$. Quali sono la riga pivot e la colonna pivot?",
          en: "In the revised dual simplex algorithm for the LP problem in standard maximization form $\\max\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ with " + stdTexB(lingua, S) + ", the current basis $\\pazocal{B} = " + insieme(B) + "$ is dual feasible, with reduced costs " + X.N.map(function (j) { return "$\\bar c_" + j + " = " + X.cb[j].tex() + "$"; }).join(", ") + ". One uses " + BLAND_D[lingua] + ", where $\\bar{\\boldsymbol b} = {\\boldsymbol A}_{\\pazocal{B}}^{-1}{\\boldsymbol b}$ and $\\bar a_{rj} = {\\boldsymbol u}\\,{\\boldsymbol A}_j$ with ${\\boldsymbol u}\\,{\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol e}'_r$. What are the pivot row and the pivot column?"
        };
        var fr = cn.map(function (j) { return "\\frac{" + X.cb[j].tex() + "}{" + arj[j].tex() + "}"; }).join(",~ ");
        var spieg = {
          it: "Si ha $\\bar{\\boldsymbol b} = " + vett(X.bb) + "'$: la riga pivot è $" + xv(r) + "$, di indice minimo fra le variabili in base negative. Poi ${\\boldsymbol u} = " + vett(u) + "$ e " + X.N.map(function (j) { return "$\\bar a_{" + r + j + "} = " + arj[j].tex() + "$"; }).join(", ") + ": $\\min\\{" + fr + "\\}$ è raggiunto da $" + xv(p) + "$.",
          en: "We have $\\bar{\\boldsymbol b} = " + vett(X.bb) + "'$: the pivot row is $" + xv(r) + "$, the smallest index among the negative basic variables. Then ${\\boldsymbol u} = " + vett(u) + "$ and " + X.N.map(function (j) { return "$\\bar a_{" + r + j + "} = " + arj[j].tex() + "$"; }).join(", ") + ": $\\min\\{" + fr + "\\}$ is attained by $" + xv(p) + "$."
        };
        return impacchetta(rng, lingua, mk(r, p), sb, testo, spieg, { A: S.A, b: S.b, c: S.c, B: B });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 33. Metodo primale-duale: scarti duali e insieme ammesso (cap. 13)
  G.push({
    id: "lp-g-primale-duale-ammesso", livello: "facile", capitolo: "13-primal-dual",
    link: link("13-primal-dual", "box-1-def-J"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [[], []], c = [], pi = [ri(rng, 0, 3), ri(rng, -2, 3)];
        var s = [];
        for (var j = 0; j < 4; j++) {
          A[0].push(ri(rng, -2, 3)); A[1].push(ri(rng, -2, 3));
          var Ap = A[0][j] * pi[0] + A[1][j] * pi[1];
          var sj = rng() < 0.45 ? 0 : ri(rng, 1, 4);
          c.push(Ap + sj); s.push(sj);
        }
        var J = [1, 2, 3, 4].filter(function (j) { return s[j - 1] === 0; });
        if (J.length < 1 || J.length > 2) return null;
        var mk = function (arr) { var t = "$\\pazocal{J} = " + (arr.length ? insieme(arr) : "\\emptyset") + "$"; return opz(t, t, arr.join(",") || "-"); };
        var compl = [1, 2, 3, 4].filter(function (j) { return J.indexOf(j) < 0; });
        var zeroAp = [1, 2, 3, 4].filter(function (j) { return A[0][j - 1] * pi[0] + A[1][j - 1] * pi[1] === 0; });
        var zeroC = [1, 2, 3, 4].filter(function (j) { return c[j - 1] === 0; });
        var minS = compl.length ? [compl.reduce(function (m, j) { return s[j - 1] < s[m - 1] ? j : m; }, compl[0])] : [];
        var cand = [mk(compl), mk(zeroAp), mk(zeroC), mk(ord(J.concat(minS))), mk(minS)];
        var sb = scegli(cand, mk(J), 3); if (!sb) return null;
        var testo = {
          it: "Nel metodo primale-duale per $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$, con ${\\boldsymbol A} = " + matrice(A) + "$ e ${\\boldsymbol c}' = " + vett(c) + "$, si considera la soluzione duale ${\\boldsymbol \\pi} = " + vett(pi) + "'$ del duale $\\max\\{{\\boldsymbol b}'{\\boldsymbol \\pi} : {\\boldsymbol A}'{\\boldsymbol \\pi} \\le {\\boldsymbol c}\\}$. L'insieme ammesso è $\\pazocal{J} = \\{j : {\\boldsymbol A}_j'{\\boldsymbol \\pi} = c_j\\}$ (${\\boldsymbol A}_j$: colonna $j$ di ${\\boldsymbol A}$). Quale insieme si ottiene?",
          en: "In the primal-dual method for $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$, with ${\\boldsymbol A} = " + matrice(A) + "$ and ${\\boldsymbol c}' = " + vett(c) + "$, consider the dual solution ${\\boldsymbol \\pi} = " + vett(pi) + "'$ of the dual $\\max\\{{\\boldsymbol b}'{\\boldsymbol \\pi} : {\\boldsymbol A}'{\\boldsymbol \\pi} \\le {\\boldsymbol c}\\}$. The admissible set is $\\pazocal{J} = \\{j : {\\boldsymbol A}_j'{\\boldsymbol \\pi} = c_j\\}$ (${\\boldsymbol A}_j$: column $j$ of ${\\boldsymbol A}$). Which set is obtained?"
        };
        var sl = s.map(function (v, k) { return "s_" + (k + 1) + " = " + v; }).join(",~ ");
        var spieg = {
          it: "Gli scarti duali $s_j = c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi}$ valgono $" + sl + "$: sono tutti $\\ge 0$, quindi ${\\boldsymbol \\pi}$ è duale ammissibile, e $\\pazocal{J}$ contiene gli indici con $s_j = 0$.",
          en: "The dual slacks $s_j = c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi}$ are $" + sl + "$: they are all $\\ge 0$, hence ${\\boldsymbol \\pi}$ is dual feasible, and $\\pazocal{J}$ contains the indices with $s_j = 0$."
        };
        return impacchetta(rng, lingua, mk(J), sb, testo, spieg, { A: A, c: c, pi: pi });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 34. Dimensione di un poliedro in forma standard (cap. 15)
  function rango(M) {
    var R = M.map(function (r) { return r.map(q); }), rk = 0, nc = R[0].length;
    for (var col = 0; col < nc && rk < R.length; col++) {
      var piv = -1; for (var i = rk; i < R.length; i++) if (!R[i][col].isZero()) { piv = i; break; }
      if (piv < 0) continue;
      var t = R[rk]; R[rk] = R[piv]; R[piv] = t;
      for (var i2 = 0; i2 < R.length; i2++) if (i2 !== rk && !R[i2][col].isZero()) {
        var f = R[i2][col].div(R[rk][col]);
        R[i2] = R[i2].map(function (v, k) { return v.sub(f.mul(R[rk][k])); });
      }
      rk++;
    }
    return rk;
  }
  G.push({
    id: "lp-g-dimensione-poliedro", livello: "facile", capitolo: "15-geometry",
    link: link("15-geometry", "box-1-def-dim"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var n = ri(rng, 3, 5), m = ri(rng, 2, 3);
        var x = []; for (var j = 0; j < n; j++) x.push(ri(rng, 1, 3));
        var A = [];
        for (var i = 0; i < m; i++) { var r = []; for (var j2 = 0; j2 < n; j2++) r.push(ri(rng, -2, 3)); A.push(r); }
        var dip = m === 3 && rng() < 0.6;
        if (dip) A[2] = A[0].map(function (v, k) { return v + A[1][k]; });
        if (A.some(function (r) { return r.every(function (v) { return v === 0; }); })) return null;
        var rk = rango(A);
        if (rk !== (dip ? 2 : m)) return null;
        var b = A.map(function (r) { return r.reduce(function (s, v, k) { return s + v * x[k]; }, 0); });
        var giusta = n - rk;
        var cand = [opzVal(n - m), opzVal(rk), opzVal(n), opzVal(n - rk - 1), opzVal(n - rk + 1)];
        var sb = scegli(cand, opzVal(giusta), 3); if (!sb) return null;
        var nomi = xs(n);
        var righe = A.map(function (r, i) { return lin(r, nomi) + " = " + b[i]; }).join(",~ ");
        var testo = {
          it: "Si consideri il poliedro $F = \\{{\\boldsymbol x} \\in \\R^{" + n + "} : " + righe + ",~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$, che contiene il punto $\\bar{\\boldsymbol x} = " + vett(x) + "$ con tutte le componenti positive. La dimensione $\\dim(F)$ è il massimo numero di punti affinemente indipendenti di $F$ meno uno. Quanto vale $\\dim(F)$?",
          en: "Consider the polyhedron $F = \\{{\\boldsymbol x} \\in \\R^{" + n + "} : " + righe + ",~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$, which contains the point $\\bar{\\boldsymbol x} = " + vett(x) + "$ with all entries positive. The dimension $\\dim(F)$ is the maximum number of affinely independent points of $F$ minus one. What is $\\dim(F)$?"
        };
        var spieg = {
          it: "Poiché $\\bar{\\boldsymbol x} > {\\boldsymbol 0}$, nessun vincolo $x_j \\ge 0$ vale all'uguaglianza su tutta $F$: le sole uguaglianze implicite sono quelle del sistema, di rango $" + rk + "$" + (dip ? " (la terza equazione è la somma delle prime due)" : "") + ". Quindi $\\dim(F) = n - \\rank({\\boldsymbol A}) = " + n + " - " + rk + " = " + giusta + "$.",
          en: "Since $\\bar{\\boldsymbol x} > {\\boldsymbol 0}$, no constraint $x_j \\ge 0$ holds with equality on the whole of $F$: the only implicit equalities are those of the system, of rank $" + rk + "$" + (dip ? " (the third equation is the sum of the first two)" : "") + ". Hence $\\dim(F) = n - \\rank({\\boldsymbol A}) = " + n + " - " + rk + " = " + giusta + "$."
        };
        return impacchetta(rng, lingua, opzVal(giusta), sb, testo, spieg, { A: A, b: b, x: x });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 35. Soluzione di base e vertice (cap. 15)
  G.push({
    id: "lp-g-base-vertice", livello: "media", capitolo: "15-geometry",
    link: link("15-geometry", "box-10-theo-bfs-vertex"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [], b = [];
        for (var i = 0; i < 3; i++) { A.push([ri(rng, -1, 4), ri(rng, -1, 4)]); b.push(ri(rng, 3, 14)); }
        if (!righeBuone(A)) return null;
        var Afull = A.map(function (r, i) { return r.concat([0, 0, 0].map(function (_, k) { return k === i ? 1 : 0; })); });
        var B = ord(shuffle(rng, [1, 2, 3, 4, 5]).slice(0, 3));
        var sol = function (BB) {
          // risolve A_B x_B = b (3 x 3) con eliminazione esatta
          var M = Afull.map(function (r, i) { return BB.map(function (j) { return q(r[j - 1]); }).concat([q(b[i])]); });
          for (var c0 = 0; c0 < 3; c0++) {
            var pv = -1; for (var r0 = c0; r0 < 3; r0++) if (!M[r0][c0].isZero()) { pv = r0; break; }
            if (pv < 0) return null;
            var t = M[c0]; M[c0] = M[pv]; M[pv] = t;
            for (var r1 = 0; r1 < 3; r1++) if (r1 !== c0 && !M[r1][c0].isZero()) {
              var f = M[r1][c0].div(M[c0][c0]);
              M[r1] = M[r1].map(function (v, k) { return v.sub(f.mul(M[c0][k])); });
            }
          }
          var x = [q(0), q(0), q(0), q(0), q(0)];
          BB.forEach(function (j, k) { x[j - 1] = M[k][3].div(M[k][k]); });
          return x;
        };
        var x = sol(B); if (!x) return null;
        if (x.some(function (v) { return v.d > 4 || Math.abs(v.n) > 30; })) return null;
        var amm = x.every(function (v) { return v.sgn() >= 0; });
        if (B.some(function (j) { return x[j - 1].isZero(); })) return null;   // non degenere
        var mk = function (pt, ok) {
          var s = "$(\\bar x_1, \\bar x_2) = " + vett(pt) + "$";
          return opz(s + (ok ? ": è un vertice di $F$" : ": non è ammissibile, quindi non è un vertice di $F$"),
                     s + (ok ? ": it is a vertex of $F$" : ": it is infeasible, hence not a vertex of $F$"), chiave(pt) + "|" + (ok ? 1 : 0));
        };
        var pt = [x[0], x[1]];
        var cand = [mk(pt, !amm), mk([x[1], x[0]], amm)];
        // soluzione di base di un'altra base vicina
        var altre = [];
        [1, 2, 3, 4, 5].forEach(function (j) { if (B.indexOf(j) < 0) B.forEach(function (k) { var B2 = ord(B.filter(function (h) { return h !== k; }).concat([j])); var y = sol(B2); if (y && y.every(function (v) { return v.d <= 4; })) altre.push(y); }); });
        altre = shuffle(rng, altre);
        altre.forEach(function (y) { cand.push(mk([y[0], y[1]], y.every(function (v) { return v.sgn() >= 0; }))); });
        var sb = scegli(cand, mk(pt, amm), 3); if (!sb) return null;
        var righeF = A.map(function (r, i) { return lin(r, ["x_1", "x_2"]) + " \\le " + b[i]; }).join(",~ ");
        var testo = {
          it: "Sia $F = \\{{\\boldsymbol x} \\in \\R^2 : " + righeF + ",~ x_1, x_2 \\ge 0\\}$ la regione ammissibile di un problema LP in forma canonica di massimo, portato in forma standard con le variabili di scarto $x_3, x_4, x_5$. Si consideri la base $\\pazocal{B} = " + insieme(B) + "$ (variabili in base) e la sua soluzione di base, con le variabili fuori base a $0$. Quale affermazione è corretta?",
          en: "Let $F = \\{{\\boldsymbol x} \\in \\R^2 : " + righeF + ",~ x_1, x_2 \\ge 0\\}$ be the feasible region of an LP problem in canonical maximization form, brought to standard form with the slack variables $x_3, x_4, x_5$. Consider the basis $\\pazocal{B} = " + insieme(B) + "$ (basic variables) and its basic solution, with the non-basic variables at $0$. Which statement is correct?"
        };
        var spieg = {
          it: "Le variabili fuori base valgono $0$ e quelle in base risolvono ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol x}_{\\pazocal{B}} = {\\boldsymbol b}$: si ottiene $" + vett(x) + "$. " + (amm ? "Tutte le componenti sono non negative: è una soluzione di base ammissibile, quindi un vertice di $F$." : "Qualche componente è negativa: la soluzione di base non è ammissibile e non corrisponde a un vertice di $F$."),
          en: "The non-basic variables are $0$ and the basic ones solve ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol x}_{\\pazocal{B}} = {\\boldsymbol b}$: we get $" + vett(x) + "$. " + (amm ? "All the entries are non-negative: it is a basic feasible solution, hence a vertex of $F$." : "Some entry is negative: the basic solution is infeasible and does not correspond to a vertex of $F$.")
        };
        return impacchetta(rng, lingua, mk(pt, amm), sb, testo, spieg, { A: A, b: b, B: B });
      });
    }
  });

  // ----------------------------------------------------------------------
  // 36. Modello di pianificazione della produzione da una tabella di dati (cap. 16)
  G.push({
    id: "lp-g-modello-produzione", livello: "media", capitolo: "16-modelling",
    link: link("16-modelling", "162-pianificazione-della-produzione", "162-production-planning"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var c = [ri(rng, 2, 9), ri(rng, 2, 9)], A = [[ri(rng, 1, 5), ri(rng, 1, 5)], [ri(rng, 1, 5), ri(rng, 1, 5)]], b = [ri(rng, 10, 40), ri(rng, 10, 40)];
        if (c[0] === c[1] || A[0][1] === A[1][0] || A[0][0] === A[1][1] && A[0][1] === A[1][0]) return null;
        if (!righeBuone(A)) return null;
        var At = [[A[0][0], A[1][0]], [A[0][1], A[1][1]]];
        var mod = function (lang, senso, cc, M, verso) { return lpTex(lang, senso, cc, M, [verso, verso], b); };
        var mk = function (senso, cc, M, verso) { return opz(mod("it", senso, cc, M, verso), mod("en", senso, cc, M, verso), JSON.stringify([senso, cc, M, verso])); };
        var giusta = mk("max", c, A, "le");
        var cand = [mk("max", c, At, "le"), mk("min", c, A, "ge"), mk("max", [c[1], c[0]], A, "le"), mk("max", c, A, "ge")];
        var sb = scegli(cand, giusta, 3); if (!sb) return null;
        var tab = function (lang) {
          var R = lang === "it" ? ["profitto unitario", "risorsa 1 per unità", "risorsa 2 per unità"] : ["unit profit", "resource 1 per unit", "resource 2 per unit"];
          return "$\\begin{array}{l|cc} & \\text{" + (lang === "it" ? "prodotto 1" : "product 1") + "} & \\text{" + (lang === "it" ? "prodotto 2" : "product 2") + "} \\\\ \\hline \\text{" + R[0] + "} & " + c[0] + " & " + c[1] + " \\\\ \\text{" + R[1] + "} & " + A[0][0] + " & " + A[0][1] + " \\\\ \\text{" + R[2] + "} & " + A[1][0] + " & " + A[1][1] + " \\end{array}$";
        };
        var testo = {
          it: "Un'azienda fabbrica due prodotti usando due risorse, disponibili in quantità $" + b[0] + "$ (risorsa 1) e $" + b[1] + "$ (risorsa 2). Profitti e consumi per unità di prodotto sono: " + tab("it") + ". Con $x_j \\ge 0$ unità del prodotto $j$, quale modello LP massimizza il profitto totale?",
          en: "A company makes two products using two resources, available in quantities $" + b[0] + "$ (resource 1) and $" + b[1] + "$ (resource 2). Profits and consumptions per unit of product are: " + tab("en") + ". With $x_j \\ge 0$ units of product $j$, which LP model maximizes the total profit?"
        };
        var spieg = {
          it: "Funzione obiettivo: profitto totale $" + lin(c, ["x_1", "x_2"]) + "$ da massimizzare. Un vincolo per risorsa: il consumo $\\sum_j a_{ij} x_j$ (riga $i$ della tabella, non colonna) non supera la disponibilità $b_i$.",
          en: "Objective function: total profit $" + lin(c, ["x_1", "x_2"]) + "$ to maximize. One constraint per resource: the consumption $\\sum_j a_{ij} x_j$ (row $i$ of the table, not column) does not exceed the availability $b_i$."
        };
        return impacchetta(rng, lingua, giusta, sb, testo, spieg, { c: c, A: A, b: b });
      });
    }
  });
  // ====================================================================== copertura dettagliata (7 novembre 2026)
  // 19 generatori nuovi; gemelli in verifica/verifica_generatori.py (sezione «copertura dettagliata»)
  function L2(it, en) { return { it: it, en: en }; }
  function oV(v) { v = q(v); var s = "$" + v.tex() + "$"; return opz(s, s, v.key()); }

  // ---------------------------------------------------------------- 7. colonna con la regola di Bland
  G.push({
    id: "lp-g-bland-colonna", livello: "facile", capitolo: "07-optimality-pivot", link: link("07-optimality-pivot", "73-regole-di-pivot", "73-pivot-rules"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var N = ord(shuffle(rng, range(1, 7)).slice(0, 4)), c = {};
        N.forEach(function (j) { c[j] = q(ri(rng, -5, 5)); });
        var pos = N.filter(function (j) { return c[j].sgn() > 0; });
        if (pos.length < 2) return null;
        var giusto = pos[0], best = N.reduce(function (u, j) { return c[j].cmp(c[u]) > 0 ? j : u; }, N[0]);
        if (best === giusto) return null;
        var mk = function (j) { return j === 0 ? opz("Nessuna: il dizionario è ottimo", "None: the dictionary is optimal", "0") : opz("$" + xv(j) + "$", "$" + xv(j) + "$", String(j)); };
        var neg = N.filter(function (j) { return c[j].sgn() <= 0; });
        var sb = scegli([mk(best), mk(neg.length ? neg[0] : 0), mk(pos[pos.length - 1]), mk(0)], mk(giusto), 3);
        if (!sb) return null;
        var lista = N.map(function (j) { return "$\\bar c_{" + j + "} = " + c[j].tex() + "$"; }).join(", ");
        var testo = L2("Nell'algoritmo del simplesso per un problema in forma standard di massimo, il dizionario corrente ha le variabili fuori base $" + N.map(xv).join(", ") + "$ con costi ridotti " + lista + ". Con la regola di Bland (colonna pivot: la variabile fuori base di indice minimo con $\\bar c_j > 0$), quale variabile entra in base?",
          "In the simplex algorithm for a problem in standard maximization form, the current dictionary has nonbasic variables $" + N.map(xv).join(", ") + "$ with reduced costs " + lista + ". With Bland's rule (pivot column: the nonbasic variable of smallest index with $\\bar c_j > 0$), which variable enters the basis?");
        var sp = L2("Candidate: le variabili con $\\bar c_j > 0$; si prende l'indice minimo, $" + xv(giusto) + "$, non quella con il costo ridotto più grande.",
          "Candidates: the variables with $\\bar c_j > 0$; take the smallest index, $" + xv(giusto) + "$, not the one with the largest reduced cost.");
        return impacchetta(rng, lingua, mk(giusto), sb, testo, sp, { N: N, c: N.map(function (j) { return c[j].key(); }) });
      });
    }
  });

  // ---------------------------------------------------------------- 8. pivot speciale della Fase 0
  G.push({
    id: "lp-g-fase0-x0", livello: "facile", capitolo: "08-phase-zero", link: link("08-phase-zero", "box-2-def-aux"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var m = ri(rng, 3, 4), n = 2, b = [];
        for (var i = 0; i < m; i++) b.push(ri(rng, -9, 9));
        var mn = Math.min.apply(null, b);
        if (mn >= 0 || b.filter(function (v) { return v === mn; }).length > 1 || b.filter(function (v) { return v < 0; }).length < 2) return null;
        var r = b.indexOf(mn), second = b.map(function (v, k) { return k; }).filter(function (k) { return b[k] < 0 && k !== r; })[0];
        var mk = function (val, k) { return opz("$x_0 = " + val + "$, " + "esce $" + xv(n + 1 + k) + "$", "$x_0 = " + val + "$, $" + xv(n + 1 + k) + "$ leaves", val + "|" + (n + 1 + k)); };
        var giusta = mk(-mn, r);
        var sb = scegli([mk(-b[second], second), mk(-mn, second), mk(Math.max.apply(null, b), b.indexOf(Math.max.apply(null, b))), mk(-mn + 1, r)], giusta, 3);
        if (!sb) return null;
        var bb = "$" + vett(b) + "$";
        var testo = L2("Nella Fase $0$ per un problema in forma canonica di massimo con $n = 2$ variabili e termini noti ${\\boldsymbol b} = $ " + bb + ", il problema ausiliario $\\max\\{-x_0 : {\\boldsymbol A}{\\boldsymbol x} - x_0 {\\boldsymbol 1} \\le {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0},~ x_0 \\ge 0\\}$ ha gli scarti $x_3, \\dots, x_{" + (n + m) + "}$ in base. Nel pivot speciale entra $x_0$: quale valore prende $x_0$ e quale scarto esce?",
          "In Phase $0$ for a problem in canonical maximization form with $n = 2$ variables and right-hand sides ${\\boldsymbol b} = $ " + bb + ", the auxiliary problem $\\max\\{-x_0 : {\\boldsymbol A}{\\boldsymbol x} - x_0 {\\boldsymbol 1} \\le {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0},~ x_0 \\ge 0\\}$ has the slacks $x_3, \\dots, x_{" + (n + m) + "}$ basic. In the special pivot $x_0$ enters: which value does $x_0$ take and which slack leaves?");
        var sp = L2("Esce lo scarto con il termine noto più negativo, $b_{" + (r + 1) + "} = " + mn + "$, e $x_0 = " + (-mn) + "$: così tutti gli scarti diventano non negativi.",
          "The slack with the most negative right-hand side leaves, $b_{" + (r + 1) + "} = " + mn + "$, and $x_0 = " + (-mn) + "$: so all slacks become nonnegative.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { b: b, n: n });
      });
    }
  });

  // ---------------------------------------------------------------- 9. bound dalla dualità debole
  G.push({
    id: "lp-g-duale-bound", livello: "facile", capitolo: "09-duality", link: link("09-duality", "box-6-theo-dual-1"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [[ri(rng, 1, 5), ri(rng, 1, 5)], [ri(rng, 1, 5), ri(rng, 1, 5)]], b = [ri(rng, 4, 20), ri(rng, 4, 20)], c = [ri(rng, 1, 6), ri(rng, 1, 6)];
        var p = [ri(rng, 0, 4), ri(rng, 0, 4)];
        var amm = A[0][0] * p[0] + A[1][0] * p[1] >= c[0] && A[0][1] * p[0] + A[1][1] * p[1] >= c[1];
        if (!amm || p[0] + p[1] === 0) return null;
        var ub = b[0] * p[0] + b[1] * p[1], wrong = c[0] * p[0] + c[1] * p[1];
        var giusta = opz("$z(LP) \\le " + ub + "$", "$z(LP) \\le " + ub + "$", "le|" + ub);
        var sb = scegli([opz("$z(LP) \\ge " + ub + "$", "$z(LP) \\ge " + ub + "$", "ge|" + ub), opz("$z(LP) \\le " + wrong + "$", "$z(LP) \\le " + wrong + "$", "le|" + wrong), opz("$z(LP) = " + ub + "$", "$z(LP) = " + ub + "$", "eq|" + ub)], giusta, 3);
        if (!sb || wrong === ub) return null;
        var testo = L2("Per il problema LP " + lpTex("it", "max", c, A, ["le", "le"], b) + " il cui duale è $\\min\\{{\\boldsymbol b}'{\\boldsymbol \\pi} : {\\boldsymbol A}'{\\boldsymbol \\pi} \\ge {\\boldsymbol c},~ {\\boldsymbol \\pi} \\ge {\\boldsymbol 0}\\}$, la soluzione $\\bar{\\boldsymbol \\pi} = " + vett(p) + "$ è duale ammissibile. Che cosa se ne ricava sul valore ottimo $z(LP)$?",
          "For the LP problem " + lpTex("en", "max", c, A, ["le", "le"], b) + " whose dual is $\\min\\{{\\boldsymbol b}'{\\boldsymbol \\pi} : {\\boldsymbol A}'{\\boldsymbol \\pi} \\ge {\\boldsymbol c},~ {\\boldsymbol \\pi} \\ge {\\boldsymbol 0}\\}$, the solution $\\bar{\\boldsymbol \\pi} = " + vett(p) + "$ is dual feasible. What follows for the optimal value $z(LP)$?");
        var sp = L2("Per la dualità debole ${\\boldsymbol c}'{\\boldsymbol x} \\le {\\boldsymbol b}'\\bar{\\boldsymbol \\pi} = " + ub + "$ per ogni ${\\boldsymbol x}$ ammissibile; l'uguaglianza non è garantita.",
          "By weak duality ${\\boldsymbol c}'{\\boldsymbol x} \\le {\\boldsymbol b}'\\bar{\\boldsymbol \\pi} = " + ub + "$ for every feasible ${\\boldsymbol x}$; equality is not guaranteed.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { A: A, b: b, c: c, p: p });
      });
    }
  });

  // ---------------------------------------------------------------- 10. riga e colonna del pivot duale
  var DS_PRE = L2("Nell'algoritmo del simplesso duale per un problema in forma standard di massimo, con dizionario $x_i = \\bar b_i - \\sum_j \\bar a_{ij} x_j$, base duale ammissibile ($\\bar c_j \\le 0$) e regola di Bland (riga: indice minimo con $\\bar b_i < 0$; colonna: rapporto minimo $\\bar c_j / \\bar a_{rj}$ fra i $j$ con $\\bar a_{rj} < 0$, a parità indice minimo), ",
    "In the dual simplex algorithm for a problem in standard maximization form, with dictionary $x_i = \\bar b_i - \\sum_j \\bar a_{ij} x_j$, a dual feasible basis ($\\bar c_j \\le 0$) and Bland's rule (row: smallest index with $\\bar b_i < 0$; column: minimum ratio $\\bar c_j / \\bar a_{rj}$ over $j$ with $\\bar a_{rj} < 0$, ties by smallest index), ");
  G.push({
    id: "lp-g-duale-riga", livello: "facile", capitolo: "10-dual-simplex", link: link("10-dual-simplex", "1041-determinare-la-riga-pivot", "1041-determining-the-pivot-row"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var B = ord(shuffle(rng, range(1, 7)).slice(0, 3)), b = {};
        B.forEach(function (i) { b[i] = q(ri(rng, -6, 6)); });
        var neg = B.filter(function (i) { return b[i].sgn() < 0; });
        if (neg.length < 2) return null;
        var giusto = neg[0], piuNeg = neg.reduce(function (u, i) { return b[i].cmp(b[u]) < 0 ? i : u; }, neg[0]);
        if (piuNeg === giusto) return null;
        var mk = function (i) { return i === 0 ? opz("Nessuna: la base è ottima", "None: the basis is optimal", "0") : opz("$" + xv(i) + "$", "$" + xv(i) + "$", String(i)); };
        var pos = B.filter(function (i) { return b[i].sgn() >= 0; });
        var sb = scegli([mk(piuNeg), mk(pos.length ? pos[0] : 0), mk(0), mk(neg[neg.length - 1])], mk(giusto), 3);
        if (!sb) return null;
        var lista = B.map(function (i) { return "$\\bar b_{" + i + "} = " + b[i].tex() + "$"; }).join(", ");
        var testo = L2(DS_PRE.it + "le variabili in base $" + B.map(xv).join(", ") + "$ hanno valori " + lista + ". Quale variabile esce dalla base?",
          DS_PRE.en + "the basic variables $" + B.map(xv).join(", ") + "$ have values " + lista + ". Which variable leaves the basis?");
        var sp = L2("Candidate le variabili con $\\bar b_i < 0$; esce quella di indice minimo, $" + xv(giusto) + "$, non la più negativa.",
          "Candidates are the variables with $\\bar b_i < 0$; the one with smallest index leaves, $" + xv(giusto) + "$, not the most negative.");
        return impacchetta(rng, lingua, mk(giusto), sb, testo, sp, { B: B, b: B.map(function (i) { return b[i].key(); }) });
      });
    }
  });
  G.push({
    id: "lp-g-duale-colonna", livello: "facile", capitolo: "10-dual-simplex", link: link("10-dual-simplex", "1042-determinare-la-colonna-pivot", "1042-determining-the-pivot-column"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var N = ord(shuffle(rng, range(1, 7)).slice(0, 4)), a = {}, c = {};
        N.forEach(function (j) { a[j] = q(ri(rng, -4, 3)); c[j] = q(-ri(rng, 0, 6)); });
        var cand = N.filter(function (j) { return a[j].sgn() < 0; });
        var giusto = 0, s = null;
        cand.forEach(function (j) { var v = c[j].div(a[j]); if (s === null || v.cmp(s) < 0) { s = v; giusto = j; } });
        if (cand.length < 2) return null;
        var mk = function (j) { return j === 0 ? opz("Nessuna: il problema è inammissibile", "None: the problem is infeasible", "0") : opz("$" + xv(j) + "$", "$" + xv(j) + "$", String(j)); };
        var maxNeg = cand.reduce(function (u, j) { return a[j].cmp(a[u]) < 0 ? j : u; }, cand[0]);
        var nonCand = N.filter(function (j) { return a[j].sgn() >= 0; });
        var sb = scegli([mk(maxNeg), mk(nonCand.length ? nonCand[0] : 0), mk(0), mk(cand[cand.length - 1]), mk(cand[0])], mk(giusto), 3);
        if (!sb) return null;
        var lista = N.map(function (j) { return "$\\bar a_{r" + j + "} = " + a[j].tex() + "$, $\\bar c_{" + j + "} = " + c[j].tex() + "$"; }).join("; ");
        var testo = L2(DS_PRE.it + "la riga pivot $x_r$ ha, per le variabili fuori base: " + lista + ". Quale variabile entra in base?",
          DS_PRE.en + "the pivot row $x_r$ has, for the nonbasic variables: " + lista + ". Which variable enters the basis?");
        var sp = L2("Contano solo le colonne con $\\bar a_{rj} < 0$; il rapporto minimo $\\bar c_j / \\bar a_{rj} = " + s.tex() + "$ si ha per $" + xv(giusto) + "$.",
          "Only columns with $\\bar a_{rj} < 0$ count; the minimum ratio $\\bar c_j / \\bar a_{rj} = " + s.tex() + "$ is attained by $" + xv(giusto) + "$.");
        return impacchetta(rng, lingua, mk(giusto), sb, testo, sp, { N: N, a: N.map(function (j) { return a[j].key(); }), c: N.map(function (j) { return c[j].key(); }) });
      });
    }
  });

  // ---------------------------------------------------------------- 16. modellazione: min-max, rapporti, scorte
  G.push({
    id: "lp-g-mod-minmax", livello: "facile", capitolo: "16-modelling", link: link("16-modelling", "1661-funzioni-obiettivo-min-max-e-max-min", "1661-min-max-and-max-min-objective-functions"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var f = [[ri(rng, 1, 5), ri(rng, -3, 4)], [ri(rng, -3, 4), ri(rng, 1, 5)]];
        if (!righeBuone(f)) return null;
        var mm = rng() < 0.5;   // true: min max; false: max min
        var e1 = lin(f[0], xs(2)), e2 = lin(f[1], xs(2));
        var mk = function (senso, verso, v) {
          var s = "$\\" + senso + "\\ w$, $w " + verso + " " + e1 + "$, $w " + verso + " " + e2 + "$";
          return opz(s, s, v);
        };
        var giusta = mm ? mk("min", "\\ge", "min-ge") : mk("max", "\\le", "max-le");
        var sb = mm ? [mk("min", "\\le", "min-le"), mk("max", "\\ge", "max-ge"), mk("max", "\\le", "max-le")] : [mk("max", "\\ge", "max-ge"), mk("min", "\\le", "min-le"), mk("min", "\\ge", "min-ge")];
        var obj = mm ? "\\min\\ \\max\\{" + e1 + ",~ " + e2 + "\\}" : "\\max\\ \\min\\{" + e1 + ",~ " + e2 + "\\}";
        var testo = L2("In un modello LP con ${\\boldsymbol x} \\ge {\\boldsymbol 0}$ e altri vincoli lineari, la funzione obiettivo è $" + obj + "$. Con una nuova variabile libera $w$, quale formulazione lineare è equivalente?",
          "In an LP model with ${\\boldsymbol x} \\ge {\\boldsymbol 0}$ and other linear constraints, the objective is $" + obj + "$. With a new free variable $w$, which linear formulation is equivalent?");
        var sp = L2(mm ? "$w$ non deve essere minore di nessuna delle due funzioni; minimizzandolo vale il loro massimo." : "$w$ non deve superare nessuna delle due funzioni; massimizzandolo vale il loro minimo.",
          mm ? "$w$ must not be less than either function; minimizing it gives their maximum." : "$w$ must not exceed either function; maximizing it gives their minimum.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { mm: mm ? 1 : 0, f: f });
      });
    }
  });
  G.push({
    id: "lp-g-mod-rapporto", livello: "facile", capitolo: "16-modelling", link: link("16-modelling", "1663-rapporti-e-percentuali", "1663-ratios-and-percentages"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var n = 3, k = ri(rng, 1, 3), g = new Q(ri(rng, 1, 4), 10);
        var corr = [], d1 = [], d2 = [];
        for (var j = 1; j <= n; j++) { var aj = q(j === k ? 1 : 0); corr.push(aj.sub(g)); d1.push(aj.add(g)); d2.push(aj.mul(g).sub(1)); }
        var d3 = []; for (var j2 = 1; j2 <= n; j2++) d3.push(q(j2 === k ? 1 : 0).sub(j2 === k ? g : q(0)));
        var mk = function (v, verso) { var s = "$" + lin(v, xs(n)) + " " + verso + " 0$"; return opz(s, s, chiave(v) + "|" + verso); };
        var giusta = mk(corr, "\\le");
        var sb = scegli([mk(d1, "\\le"), mk(d3, "\\le"), mk(corr, "\\ge"), mk(d2, "\\le")], giusta, 3);
        if (!sb) return null;
        var pct = g.mul(100).tex();
        var testo = L2("In un modello di miscelazione con quantità $x_1, x_2, x_3 \\ge 0$ e $x_1 + x_2 + x_3 > 0$, il materiale $" + k + "$ deve essere al più il $" + pct + "\\%$ del totale: $\\frac{x_{" + k + "}}{x_1 + x_2 + x_3} \\le " + g.tex() + "$. Quale vincolo lineare è equivalente?",
          "In a blending model with quantities $x_1, x_2, x_3 \\ge 0$ and $x_1 + x_2 + x_3 > 0$, material $" + k + "$ must be at most $" + pct + "\\%$ of the total: $\\frac{x_{" + k + "}}{x_1 + x_2 + x_3} \\le " + g.tex() + "$. Which linear constraint is equivalent?");
        var sp = L2("Si moltiplica per il denominatore positivo: $x_{" + k + "} - " + g.tex() + "(x_1 + x_2 + x_3) \\le 0$.",
          "Multiply by the positive denominator: $x_{" + k + "} - " + g.tex() + "(x_1 + x_2 + x_3) \\le 0$.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { k: k, g: g.key() });
      });
    }
  });
  G.push({
    id: "lp-g-mod-scorte", livello: "facile", capitolo: "16-modelling", link: link("16-modelling", "165-pianificazione-multi-periodo", "165-multi-period-planning"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var T = 3, d = [], x = [], y = [], y0 = ri(rng, 0, 10), cur = y0, sbagliato = [], cum = [], cc = 0;
        for (var t = 0; t < T; t++) {
          d.push(5 * ri(rng, 2, 8)); x.push(5 * ri(rng, 1, 9));
          cur = cur + x[t] - d[t]; y.push(cur);
          sbagliato.push(x[t] - d[t]); cc += x[t]; cum.push(cc);
        }
        if (y.some(function (v) { return v < 0; })) return null;
        var mk = function (v) { var s = "$" + vett(v) + "$"; return opz(s, s, v.join(",")); };
        var alt = y.map(function (v, t) { return v + d[t]; });
        var sb = scegli([mk(sbagliato), mk(cum), mk(alt), mk(y.map(function (v) { return v - y0; }))], mk(y), 3);
        if (!sb) return null;
        var testo = L2("In un modello multi-periodo con $3$ periodi, $x_t$ è la produzione e $y_t$ la scorta a fine periodo $t$, con scorta iniziale $y_0 = " + y0 + "$ e bilancio $y_{t-1} + x_t = d_t + y_t$. Con domande $d = " + vett(d) + "$ e produzioni $x = " + vett(x) + "$, quanto valgono $(y_1, y_2, y_3)$?",
          "In a multi-period model with $3$ periods, $x_t$ is the production and $y_t$ the inventory at the end of period $t$, with initial inventory $y_0 = " + y0 + "$ and balance $y_{t-1} + x_t = d_t + y_t$. With demands $d = " + vett(d) + "$ and productions $x = " + vett(x) + "$, what are $(y_1, y_2, y_3)$?");
        var sp = L2("$y_t = y_{t-1} + x_t - d_t$, partendo da $y_0 = " + y0 + "$: si ottiene $" + vett(y) + "$.",
          "$y_t = y_{t-1} + x_t - d_t$, starting from $y_0 = " + y0 + "$: we get $" + vett(y) + "$.");
        return impacchetta(rng, lingua, mk(y), sb, testo, sp, { d: d, x: x, y0: y0 });
      });
    }
  });

  // ---------------------------------------------------------------- 13. passo duale del metodo primale-duale
  G.push({
    id: "lp-g-pd-theta", livello: "facile", capitolo: "13-primal-dual", link: link("13-primal-dual", "133-il-passo-duale", "133-the-dual-step"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var J = [4, 5, 6], s = [], ay = [];
        J.forEach(function () { s.push(ri(rng, 1, 9)); ay.push(ri(rng, -3, 3)); });
        var cand = J.filter(function (j, k) { return ay[k] > 0; });
        if (cand.length < 2) return null;
        var th = null, arg = null;
        J.forEach(function (j, k) { if (ay[k] > 0) { var v = new Q(s[k], ay[k]); if (th === null || v.cmp(th) < 0) { th = v; arg = j; } } });
        var maxR = null; J.forEach(function (j, k) { if (ay[k] > 0) { var v = new Q(s[k], ay[k]); if (maxR === null || v.cmp(maxR) > 0) maxR = v; } });
        var all = null; J.forEach(function (j, k) { if (ay[k] !== 0) { var v = new Q(s[k], Math.abs(ay[k])); if (all === null || v.cmp(all) < 0) all = v; } });
        var sb = scegli([oV(maxR), oV(all), oV(q(Math.min.apply(null, s))), oV(th.mul(2))], oV(th), 3);
        if (!sb) return null;
        var lista = J.map(function (j, k) { return "$s_{" + j + "} = " + s[k] + "$, ${\\boldsymbol A}_{" + j + "}'{\\boldsymbol y} = " + ay[k] + "$"; }).join("; ");
        var testo = L2("Nel metodo primale-duale per $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$, la soluzione duale ammissibile ${\\boldsymbol \\pi}$ si aggiorna in ${\\boldsymbol \\pi} + \\theta{\\boldsymbol y}$ con il massimo $\\theta$ che conserva ${\\boldsymbol A}_j'{\\boldsymbol \\pi} \\le c_j$. Le variabili fuori dall'insieme ammesso hanno scarti duali $s_j = c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi}$ e valori: " + lista + ". Quanto vale $\\theta$?",
          "In the primal-dual method for $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$, the dual feasible solution ${\\boldsymbol \\pi}$ is updated to ${\\boldsymbol \\pi} + \\theta{\\boldsymbol y}$ with the largest $\\theta$ keeping ${\\boldsymbol A}_j'{\\boldsymbol \\pi} \\le c_j$. The variables outside the admitted set have dual slacks $s_j = c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi}$ and values: " + lista + ". What is $\\theta$?");
        var sp = L2("Limitano $\\theta$ solo le $j$ con ${\\boldsymbol A}_j'{\\boldsymbol y} > 0$: $\\theta = \\min s_j / {\\boldsymbol A}_j'{\\boldsymbol y} = " + th.tex() + "$, per $j = " + arg + "$.",
          "Only $j$ with ${\\boldsymbol A}_j'{\\boldsymbol y} > 0$ limit $\\theta$: $\\theta = \\min s_j / {\\boldsymbol A}_j'{\\boldsymbol y} = " + th.tex() + "$, for $j = " + arg + "$.");
        return impacchetta(rng, lingua, oV(th), sb, testo, sp, { s: s, ay: ay });
      });
    }
  });

  // ---------------------------------------------------------------- 14. nuova variabile
  G.push({
    id: "lp-g-sens-nuova-var", livello: "facile", capitolo: "14-sensitivity", link: link("14-sensitivity", "144-aggiunta-di-una-nuova-variabile", "144-adding-a-new-variable"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var p = [new Q(ri(rng, 0, 6), pick(rng, [1, 2])), new Q(ri(rng, 0, 6), pick(rng, [1, 2]))], Acol = [ri(rng, 1, 4), ri(rng, 1, 4)], cs = ri(rng, 1, 12);
        var rc = q(cs).sub(p[0].mul(Acol[0])).sub(p[1].mul(Acol[1]));
        if (rc.isZero()) return null;
        var esito = rc.sgn() < 0 ? "ott" : "pivot";
        var mk = function (v, e) {
          return opz("$\\bar c_\\star = " + v.tex() + "$: " + (e === "ott" ? "la base resta ottima" : "la base non è più ottima"),
                     "$\\bar c_\\star = " + v.tex() + "$: " + (e === "ott" ? "the basis stays optimal" : "the basis is no longer optimal"), v.key() + "|" + e);
        };
        var giusta = mk(rc, esito), alt = q(cs).add(p[0].mul(Acol[0])).add(p[1].mul(Acol[1])).neg();
        var sb = scegli([mk(rc, esito === "ott" ? "pivot" : "ott"), mk(rc.neg(), rc.neg().sgn() < 0 ? "ott" : "pivot"), mk(alt, alt.sgn() < 0 ? "ott" : "pivot"), mk(q(cs), "pivot")], giusta, 3);
        if (!sb) return null;
        var testo = L2("Un problema in forma standard di massimo ha base ottima con prezzi ombra ${\\boldsymbol \\pi} = " + vett(p) + "$. Si aggiunge una variabile $x_\\star \\ge 0$ con costo $c_\\star = " + cs + "$ e colonna ${\\boldsymbol A}_\\star = " + vett(Acol) + "$. Quanto vale il suo costo ridotto $\\bar c_\\star = c_\\star - {\\boldsymbol \\pi}{\\boldsymbol A}_\\star$ e che cosa si conclude?",
          "A problem in standard maximization form has an optimal basis with shadow prices ${\\boldsymbol \\pi} = " + vett(p) + "$. A variable $x_\\star \\ge 0$ with cost $c_\\star = " + cs + "$ and column ${\\boldsymbol A}_\\star = " + vett(Acol) + "$ is added. What is its reduced cost $\\bar c_\\star = c_\\star - {\\boldsymbol \\pi}{\\boldsymbol A}_\\star$ and what is concluded?");
        var sp = L2("$\\bar c_\\star = " + cs + " - (" + p[0].tex() + " \\cdot " + Acol[0] + " + " + p[1].tex() + " \\cdot " + Acol[1] + ") = " + rc.tex() + "$; la base resta ottima se e solo se $\\bar c_\\star \\le 0$.",
          "$\\bar c_\\star = " + cs + " - (" + p[0].tex() + " \\cdot " + Acol[0] + " + " + p[1].tex() + " \\cdot " + Acol[1] + ") = " + rc.tex() + "$; the basis stays optimal if and only if $\\bar c_\\star \\le 0$.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { p: p.map(function (v) { return v.key(); }), A: Acol, cs: cs });
      });
    }
  });

  // ---------------------------------------------------------------- media: pivot di Bland su un dizionario
  G.push({
    id: "lp-g-pivot-completo", livello: "media", capitolo: "07-optimality-pivot", link: link("07-optimality-pivot", "box-1-theo-pivot-1"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 2, { den: 6, minPivot: 2 }); if (!L) return null;
        var D = L.ris.storia[0].D, p = L.ris.storia[0].p, r = L.ris.storia[0].r, E = pivot(D, p, r);
        var mk = function (pp, rr, z) { var s = L2("entra $" + xv(pp) + "$, esce $" + xv(rr) + "$, nuovo $\\bar z = " + z.tex() + "$", "$" + xv(pp) + "$ enters, $" + xv(rr) + "$ leaves, new $\\bar z = " + z.tex() + "$"); return opz(s.it, s.en, pp + "|" + rr + "|" + z.key()); };
        var giusta = mk(p, r, E.z);
        var altri = D.B.filter(function (i) { return i !== r; });
        var cand = [mk(p, r, D.z.add(D.c[p])), altri.length ? mk(p, altri[0], E.z) : null, mk(p, r, D.z.sub(D.c[p].mul(E.b[p])))];
        D.N.forEach(function (j) { if (j !== p) cand.push(mk(j, r, E.z)); });
        var sb = scegli(cand, giusta, 3);
        if (!sb) return null;
        var testo = L2("Nell'algoritmo del simplesso per un problema in forma standard di massimo, il dizionario ammissibile corrente è " + dizTex(D) + " (nella riga di $x_i$ il coefficiente di $x_j$ è $-\\bar a_{ij}$). Con la regola di Bland (colonna: indice minimo con $\\bar c_j > 0$; riga: rapporto minimo $\\bar b_i / \\bar a_{ip}$ con $\\bar a_{ip} > 0$, a parità indice minimo), quale pivot si esegue e quale valore $\\bar z$ si ottiene?",
          "In the simplex algorithm for a problem in standard maximization form, the current feasible dictionary is " + dizTex(D) + " (in the row of $x_i$ the coefficient of $x_j$ is $-\\bar a_{ij}$). With Bland's rule (column: smallest index with $\\bar c_j > 0$; row: minimum ratio $\\bar b_i / \\bar a_{ip}$ with $\\bar a_{ip} > 0$, ties by smallest index), which pivot is performed and which value $\\bar z$ is obtained?");
        var sp = L2("Entra $" + xv(p) + "$; il test dei rapporti dà $t_m = " + L.ris.storia[0].t.tex() + "$ sulla riga di $" + xv(r) + "$; $\\bar z$ passa a $" + D.z.tex() + " + " + D.c[p].tex() + " \\cdot " + L.ris.storia[0].t.tex() + " = " + E.z.tex() + "$.",
          "$" + xv(p) + "$ enters; the ratio test gives $t_m = " + L.ris.storia[0].t.tex() + "$ on the row of $" + xv(r) + "$; $\\bar z$ becomes $" + D.z.tex() + " + " + D.c[p].tex() + " \\cdot " + L.ris.storia[0].t.tex() + " = " + E.z.tex() + "$.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { D: dizDati(D) });
      });
    }
  });

  // ---------------------------------------------------------------- media: valori assoluti (mediana)
  G.push({
    id: "lp-g-mod-assoluti", livello: "media", capitolo: "16-modelling", link: link("16-modelling", "1662-valori-assoluti", "1662-absolute-values"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var a = ord([ri(rng, 0, 20), ri(rng, 0, 20), ri(rng, 0, 20)]);
        if (a[0] === a[1] || a[1] === a[2]) return null;
        var opt = a[2] - a[0], media = (a[0] + a[1] + a[2]) / 3;
        if (media !== Math.floor(media)) return null;
        var fm = Math.abs(media - a[0]) + Math.abs(media - a[1]) + Math.abs(media - a[2]);
        var sb = scegli([oV(fm), oV(q(0)), oV(q(a[2] - a[1])), oV(q(opt + a[1] - a[0]))], oV(q(opt)), 3);
        if (!sb) return null;
        var testo = L2("Si vuole $\\min\\ |x - " + a[0] + "| + |x - " + a[1] + "| + |x - " + a[2] + "|$ con $x$ reale, linearizzando ogni termine con $w_i \\ge x - a_i$, $w_i \\ge a_i - x$ e $\\min\\ w_1 + w_2 + w_3$. Qual è il valore ottimo del modello LP?",
          "We want $\\min\\ |x - " + a[0] + "| + |x - " + a[1] + "| + |x - " + a[2] + "|$ with real $x$, linearizing each term with $w_i \\ge x - a_i$, $w_i \\ge a_i - x$ and $\\min\\ w_1 + w_2 + w_3$. What is the optimal value of the LP model?");
        var sp = L2("All'ottimo $w_i = |x - a_i|$; la somma delle distanze è minima nella mediana $x = " + a[1] + "$: valore $" + opt + "$ (nella media $x = " + media + "$ vale $" + fm + "$).",
          "At the optimum $w_i = |x - a_i|$; the sum of distances is minimal at the median $x = " + a[1] + "$: value $" + opt + "$ (at the mean $x = " + media + "$ it is $" + fm + "$).");
        return impacchetta(rng, lingua, oV(q(opt)), sb, testo, sp, { a: a });
      });
    }
  });

  // ---------------------------------------------------------------- media: un pivot duale completo
  G.push({
    id: "lp-g-duale-pivot-z", livello: "media", capitolo: "10-dual-simplex", link: link("10-dual-simplex", "1045-aggiornamento-del-dizionario", "1045-update-of-the-dictionary"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [[-ri(rng, 1, 4), -ri(rng, 1, 4)], [ri(rng, -3, 3), -ri(rng, 1, 4)]], b = [-ri(rng, 2, 12), ri(rng, -8, 8)], c = [-ri(rng, 1, 6), -ri(rng, 1, 6)];
        if (!righeBuone(A)) return null;
        var D = dizIniziale(A, b, c), ps = passoDuale(D);
        if (!ps || ps.p === null) return null;
        var E = pivot(D, ps.p, ps.r);
        if (maxDen(E) > 6) return null;
        var mk = function (pp, z) { var s = L2("entra $" + xv(pp) + "$, nuovo $\\bar z = " + z.tex() + "$", "$" + xv(pp) + "$ enters, new $\\bar z = " + z.tex() + "$"); return opz(s.it, s.en, pp + "|" + z.key()); };
        var giusta = mk(ps.p, E.z), other = D.N.filter(function (j) { return j !== ps.p; })[0];
        var cand = [mk(other, E.z), mk(ps.p, E.z.neg()), mk(ps.p, D.z.sub(ps.s.mul(D.b[ps.r]).neg()))];
        var Eo = D.a[ps.r][other].sgn() !== 0 ? pivot(D, other, ps.r) : null;
        if (Eo) cand.unshift(mk(other, Eo.z));
        var sb = scegli(cand, giusta, 3);
        if (!sb) return null;
        var testo = L2(DS_PRE.it + "si parte dal dizionario " + dizTex(D) + ". Quale variabile entra al primo pivot duale e quale valore $\\bar z$ si ottiene?",
          DS_EN_PRE() + "we start from the dictionary " + dizTex(D) + ". Which variable enters at the first dual pivot and which value $\\bar z$ is obtained?");
        var sp = L2("Esce $" + xv(ps.r) + "$ (indice minimo con $\\bar b_i < 0$); il rapporto minimo $\\bar c_j / \\bar a_{rj} = " + ps.s.tex() + "$ fa entrare $" + xv(ps.p) + "$; il nuovo valore è $\\bar z = " + E.z.tex() + "$.",
          "$" + xv(ps.r) + "$ leaves (smallest index with $\\bar b_i < 0$); the minimum ratio $\\bar c_j / \\bar a_{rj} = " + ps.s.tex() + "$ brings in $" + xv(ps.p) + "$; the new value is $\\bar z = " + E.z.tex() + "$.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { D: dizDati(D) });
      });
    }
  });
  function DS_EN_PRE() { return DS_PRE.en; }

  // ---------------------------------------------------------------- complessa: problema LP con un vincolo >= (metodo grafico)
  function vertici3(c, R) {    // R: [a1, a2, b] per a1 x1 + a2 x2 <= b (non negatività incluse)
    var V = [];
    for (var i = 0; i < R.length; i++) for (var k = i + 1; k < R.length; k++) {
      var p = R[i], s = R[k], det = p[0] * s[1] - p[1] * s[0];
      if (det === 0) continue;
      var x1 = new Q(p[2] * s[1] - p[1] * s[2], det), x2 = new Q(p[0] * s[2] - p[2] * s[0], det);
      if (R.every(function (r) { return q(r[0]).mul(x1).add(q(r[1]).mul(x2)).cmp(r[2]) <= 0; }) &&
          !V.some(function (v) { return v[0].eq(x1) && v[1].eq(x2); })) V.push([x1, x2]);
    }
    return V;
  }
  G.push({
    id: "lp-g-grafico-misto", livello: "complessa", capitolo: "04-lp-problems", link: link("04-lp-problems", "423-metodo-grafico", "423-graphical-solution-method"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var c = [ri(rng, 1, 6), ri(rng, 1, 6)];
        var A = [[ri(rng, 1, 4), ri(rng, 1, 4)], [ri(rng, 1, 4), ri(rng, 1, 4)], [ri(rng, 1, 3), ri(rng, 1, 3)]];
        var b = [ri(rng, 6, 18), ri(rng, 6, 18), ri(rng, 2, 6)];
        var R = [[A[0][0], A[0][1], b[0]], [A[1][0], A[1][1], b[1]], [-A[2][0], -A[2][1], -b[2]], [-1, 0, 0], [0, -1, 0]];
        var V = vertici3(c, R);
        if (V.length < 3) return null;
        var val = function (v) { return q(c[0]).mul(v[0]).add(q(c[1]).mul(v[1])); };
        V.sort(function (u, w) { return val(w).cmp(val(u)); });
        if (val(V[0]).eq(val(V[1]))) return null;
        if (V.some(function (v) { return v[0].d > 4 || v[1].d > 4; })) return null;
        // distrattore: ottimo senza il vincolo >=
        var V2 = vertici3(c, [R[0], R[1], R[3], R[4]]); V2.sort(function (u, w) { return val(w).cmp(val(u)); });
        var mk = function (v) { var s = "$" + vett(v) + "$, $z = " + val(v).tex() + "$"; return opz(s, s, v[0].key() + "," + v[1].key()); };
        var cand = [V2.length ? mk(V2[0]) : null, mk(V[1]), mk(V[V.length - 1]), V.length > 2 ? mk(V[2]) : null];
        var sb = scegli(cand, mk(V[0]), 3);
        if (!sb) return null;
        var testo = L2("Si risolva con il metodo grafico (o enumerando i vertici) il problema LP " + lpTex("it", "max", c, A, ["le", "le", "ge"], b) + ". Quali sono la soluzione ottima e il valore ottimo?",
          "Solve with the graphical method (or by enumerating the vertices) the LP problem " + lpTex("en", "max", c, A, ["le", "le", "ge"], b) + ". What are the optimal solution and the optimal value?");
        var sp = L2("I vertici della regione sono $" + V.map(function (v) { return vett(v); }).join("$, $") + "$; il valore massimo è $" + val(V[0]).tex() + "$. Il vincolo $\\ge$ esclude l'origine.",
          "The vertices of the region are $" + V.map(function (v) { return vett(v); }).join("$, $") + "$; the largest value is $" + val(V[0]).tex() + "$. The $\\ge$ constraint excludes the origin.");
        return impacchetta(rng, lingua, mk(V[0]), sb, testo, sp, { c: c, A: A, b: b });
      });
    }
  });

  // ---------------------------------------------------------------- complessa: un'iterazione del simplesso rivisto
  G.push({
    id: "lp-g-rivisto-iterazione", livello: "complessa", capitolo: "11-revised-simplex", link: link("11-revised-simplex", "112-pseudocodice-dellalgoritmo-del-simplesso-rivisto", "112-pseudo-code-of-the-revised-simplex-algorithm"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 2, { den: 6, minPivot: 2 }); if (!L) return null;
        var st = L.ris.storia[1]; if (!st) return null;
        var D = st.D, p = st.p, r = st.r, t = st.t, E = pivot(D, p, r);
        var Acompl = [[L.A[0][0], L.A[0][1], 1, 0], [L.A[1][0], L.A[1][1], 0, 1]], call = [L.c[0], L.c[1], 0, 0];
        var mk = function (pp, rr, tt) { var s = L2("entra $" + xv(pp) + "$, esce $" + xv(rr) + "$, passo $t_m = " + tt.tex() + "$", "$" + xv(pp) + "$ enters, $" + xv(rr) + "$ leaves, step $t_m = " + tt.tex() + "$"); return opz(s.it, s.en, pp + "|" + rr + "|" + tt.key()); };
        var altri = D.B.filter(function (i) { return i !== r; });
        var cand = [altri.length ? mk(p, altri[0], t) : null, mk(p, r, t.mul(2)), mk(p, r, D.b[r])];
        D.N.forEach(function (j) { if (j !== p) cand.push(mk(j, r, t)); });
        var sb = scegli(cand, mk(p, r, t), 3);
        if (!sb) return null;
        var testo = L2("Simplesso rivisto (regola di Bland) per il problema in forma standard di massimo con ${\\boldsymbol A} = " + matrice(Acompl) + "$, ${\\boldsymbol b} = " + colonna(L.b) + "$, ${\\boldsymbol c} = " + vett(call) + "$. La base corrente è $\\pazocal{B} = " + insieme(D.B) + "$. Si calcolano ${\\boldsymbol y}$ con ${\\boldsymbol y}'{\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol c}_{\\pazocal{B}}'$, i costi ridotti $\\bar c_j = c_j - {\\boldsymbol y}'{\\boldsymbol A}_j$, la colonna ${\\boldsymbol d}$ con ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol d} = {\\boldsymbol A}_p$ e il test dei rapporti. Quale pivot si esegue?",
          "Revised simplex (Bland's rule) for the problem in standard maximization form with ${\\boldsymbol A} = " + matrice(Acompl) + "$, ${\\boldsymbol b} = " + colonna(L.b) + "$, ${\\boldsymbol c} = " + vett(call) + "$. The current basis is $\\pazocal{B} = " + insieme(D.B) + "$. Compute ${\\boldsymbol y}$ with ${\\boldsymbol y}'{\\boldsymbol A}_{\\pazocal{B}} = {\\boldsymbol c}_{\\pazocal{B}}'$, the reduced costs $\\bar c_j = c_j - {\\boldsymbol y}'{\\boldsymbol A}_j$, the column ${\\boldsymbol d}$ with ${\\boldsymbol A}_{\\pazocal{B}}{\\boldsymbol d} = {\\boldsymbol A}_p$ and the ratio test. Which pivot is performed?");
        var sp = L2("Con questa base la prima variabile fuori base con $\\bar c_j > 0$ è $" + xv(p) + "$; il rapporto minimo $\\bar b_i / d_i$ è $" + t.tex() + "$ sulla riga di $" + xv(r) + "$; dopo il pivot $\\bar z = " + E.z.tex() + "$.",
          "With this basis the first nonbasic variable with $\\bar c_j > 0$ is $" + xv(p) + "$; the minimum ratio $\\bar b_i / d_i$ is $" + t.tex() + "$ on the row of $" + xv(r) + "$; after the pivot $\\bar z = " + E.z.tex() + "$.");
        return impacchetta(rng, lingua, mk(p, r, t), sb, testo, sp, { A: Acompl, b: L.b, c: call, B: D.B });
      });
    }
  });

  // ---------------------------------------------------------------- complessa: iterazione primale-duale (aggiornamento di pi)
  G.push({
    id: "lp-g-pd-aggiorna", livello: "complessa", capitolo: "13-primal-dual", link: link("13-primal-dual", "box-2-def-rp"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var A = [[ri(rng, 1, 3), ri(rng, 0, 3), ri(rng, 0, 3), 1], [ri(rng, 0, 3), ri(rng, 1, 3), ri(rng, 0, 3), 1]];
        var pi = [ri(rng, 0, 2), ri(rng, 0, 2)], y = [pick(rng, [1, -1]), pick(rng, [1, 0, -1])];
        var c = [], s = [];
        for (var j = 0; j < 4; j++) { var at = A[0][j] * pi[0] + A[1][j] * pi[1]; var sj = ri(rng, 0, 5); c.push(at + sj); s.push(sj); }
        var J = [0, 1, 2, 3].filter(function (j) { return s[j] === 0; });
        if (J.length < 1 || J.length > 2) return null;
        if (J.some(function (j) { return A[0][j] * y[0] + A[1][j] * y[1] > 0; })) return null;   // y ammissibile per il duale ristretto
        var th = null;
        for (j = 0; j < 4; j++) { var ay = A[0][j] * y[0] + A[1][j] * y[1]; if (s[j] > 0 && ay > 0) { var v = new Q(s[j], ay); if (th === null || v.cmp(th) < 0) th = v; } }
        if (th === null) return null;
        var np = [q(pi[0]).add(th.mul(y[0])), q(pi[1]).add(th.mul(y[1]))];
        var nJ = [0, 1, 2, 3].filter(function (k) { return q(c[k]).sub(np[0].mul(A[0][k])).sub(np[1].mul(A[1][k])).isZero(); });
        var mk = function (v, JJ) { var s2 = "${\\boldsymbol \\pi} = " + vett(v) + "$, $\\pazocal{J} = " + insieme(JJ.map(function (k) { return k + 1; })) + "$"; return opz(s2, s2, chiave(v) + "|" + JJ.join(",")); };
        var giusta = mk(np, nJ);
        var np2 = [q(pi[0]).sub(th.mul(y[0])), q(pi[1]).sub(th.mul(y[1]))];
        var sb = scegli([mk(np, J), mk(np2, nJ), mk([q(pi[0]).add(y[0]), q(pi[1]).add(y[1])], nJ), mk(np, nJ.concat(J.filter(function (k) { return nJ.indexOf(k) < 0; })).sort())], giusta, 3);
        if (!sb) return null;
        var testo = L2("Metodo primale-duale per $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ con ${\\boldsymbol A} = " + matrice(A) + "$ e ${\\boldsymbol c} = " + vett(c) + "$. La soluzione duale ammissibile è ${\\boldsymbol \\pi} = " + vett(pi) + "$, con insieme ammesso $\\pazocal{J} = \\{j : c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi} = 0\\}$, e il duale del primale ristretto dà la direzione ${\\boldsymbol y} = " + vett(y) + "$. Con il passo $\\theta$ massimo che conserva l'ammissibilità duale, quali sono la nuova ${\\boldsymbol \\pi}$ e il nuovo insieme ammesso?",
          "Primal-dual method for $\\min\\{{\\boldsymbol c}'{\\boldsymbol x} : {\\boldsymbol A}{\\boldsymbol x} = {\\boldsymbol b},~ {\\boldsymbol x} \\ge {\\boldsymbol 0}\\}$ with ${\\boldsymbol A} = " + matrice(A) + "$ and ${\\boldsymbol c} = " + vett(c) + "$. The dual feasible solution is ${\\boldsymbol \\pi} = " + vett(pi) + "$, with admitted set $\\pazocal{J} = \\{j : c_j - {\\boldsymbol A}_j'{\\boldsymbol \\pi} = 0\\}$, and the dual of the restricted primal gives the direction ${\\boldsymbol y} = " + vett(y) + "$. With the largest step $\\theta$ keeping dual feasibility, what are the new ${\\boldsymbol \\pi}$ and the new admitted set?");
        var sp = L2("Scarti $s = " + vett(s) + "$; $\\theta = \\min\\{s_j / {\\boldsymbol A}_j'{\\boldsymbol y} : {\\boldsymbol A}_j'{\\boldsymbol y} > 0\\} = " + th.tex() + "$; nuova ${\\boldsymbol \\pi} = " + vett(np) + "$ e si ricalcola $\\pazocal{J}$ con i nuovi scarti.",
          "Slacks $s = " + vett(s) + "$; $\\theta = \\min\\{s_j / {\\boldsymbol A}_j'{\\boldsymbol y} : {\\boldsymbol A}_j'{\\boldsymbol y} > 0\\} = " + th.tex() + "$; new ${\\boldsymbol \\pi} = " + vett(np) + "$ and $\\pazocal{J}$ is recomputed with the new slacks.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { A: A, c: c, pi: pi, y: y });
      });
    }
  });

  // ---------------------------------------------------------------- complessa: intervallo di b_k e nuovo valore ottimo
  G.push({
    id: "lp-g-sens-b-valore", livello: "complessa", capitolo: "14-sensitivity", link: link("14-sensitivity", "box-4-def-shadow"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var bb = [q(ri(rng, 1, 8)), q(ri(rng, 1, 8))], beta = [q(ri(rng, -3, 3)), q(ri(rng, -3, 3))], pk = q(ri(rng, 1, 5)), z = q(ri(rng, 10, 40));
        if (beta[0].isZero() || beta[1].isZero() || beta[0].sgn() === beta[1].sgn()) return null;
        var lo = null, hi = null;
        for (var i = 0; i < 2; i++) { var v = bb[i].neg().div(beta[i]); if (beta[i].sgn() > 0) lo = lo === null ? v : qmax([lo, v]); else hi = hi === null ? v : qmin([hi, v]); }
        var dlt = q(ri(rng, -3, 3)); if (dlt.cmp(lo) < 0 || dlt.cmp(hi) > 0 || dlt.isZero()) return null;
        var nz = z.add(pk.mul(dlt));
        var mk = function (l, h, zz) { var s = "$" + l.tex() + " \\le \\delta \\le " + h.tex() + "$; " + L2("nuovo valore ", "new value ").it + "$" + zz.tex() + "$"; var se = "$" + l.tex() + " \\le \\delta \\le " + h.tex() + "$; new value $" + zz.tex() + "$"; return opz(s, se, l.key() + ";" + h.key() + "|" + zz.key()); };
        var giusta = mk(lo, hi, nz);
        var sb = scegli([mk(hi.neg(), lo.neg(), nz), mk(lo, hi, z.sub(pk.mul(dlt))), mk(lo, hi, z.add(dlt)), mk(lo.sub(1), hi, nz)], giusta, 3);
        if (!sb || lo.cmp(hi) >= 0) return null;
        var testo = L2("Un problema in forma standard di massimo ha base ottima con valori $\\bar{\\boldsymbol b} = " + vett(bb) + "$ delle due variabili in base e valore ottimo $" + z.tex() + "$. La colonna $k$ di ${\\boldsymbol A}_{\\pazocal{B}}^{-1}$ è $" + vett(beta) + "$ e il prezzo ombra del vincolo $k$ è $\\pi_k = " + pk.tex() + "$. Per quali $\\delta$ (con $b_k \\to b_k + \\delta$) la base resta ottima, e qual è il valore ottimo per $\\delta = " + dlt.tex() + "$?",
          "A problem in standard maximization form has an optimal basis with values $\\bar{\\boldsymbol b} = " + vett(bb) + "$ of the two basic variables and optimal value $" + z.tex() + "$. Column $k$ of ${\\boldsymbol A}_{\\pazocal{B}}^{-1}$ is $" + vett(beta) + "$ and the shadow price of constraint $k$ is $\\pi_k = " + pk.tex() + "$. For which $\\delta$ (with $b_k \\to b_k + \\delta$) does the basis stay optimal, and what is the optimal value for $\\delta = " + dlt.tex() + "$?");
        var sp = L2("Serve $\\bar{\\boldsymbol b} + \\delta\\,(" + beta[0].tex() + ", " + beta[1].tex() + ") \\ge {\\boldsymbol 0}$: $" + lo.tex() + " \\le \\delta \\le " + hi.tex() + "$. In quell'intervallo il valore cambia di $\\pi_k \\delta$: $" + z.tex() + " + " + pk.tex() + " \\cdot " + par(dlt) + " = " + nz.tex() + "$.",
          "We need $\\bar{\\boldsymbol b} + \\delta\\,(" + beta[0].tex() + ", " + beta[1].tex() + ") \\ge {\\boldsymbol 0}$: $" + lo.tex() + " \\le \\delta \\le " + hi.tex() + "$. In that interval the value changes by $\\pi_k \\delta$: $" + z.tex() + " + " + pk.tex() + " \\cdot " + par(dlt) + " = " + nz.tex() + "$.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { bb: bb.map(function (v) { return v.key(); }), beta: beta.map(function (v) { return v.key(); }), pk: pk.key(), z: z.key(), d: dlt.key() });
      });
    }
  });

  // ---------------------------------------------------------------- complessa: trasporto bilanciato 2 x 2
  G.push({
    id: "lp-g-mod-trasporto", livello: "complessa", capitolo: "16-modelling", link: link("16-modelling", "164-trasporto", "164-transportation"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var o = [5 * ri(rng, 2, 8), 5 * ri(rng, 2, 8)], d1 = 5 * ri(rng, 1, 8), d = [d1, o[0] + o[1] - d1];
        if (d[1] <= 0) return null;
        var k = [[ri(rng, 1, 9), ri(rng, 1, 9)], [ri(rng, 1, 9), ri(rng, 1, 9)]];
        // x11 = t, x12 = o1 - t, x21 = d1 - t, x22 = o2 - d1 + t ; 0 <= tutte
        var lo = Math.max(0, d1 - o[1]), hi = Math.min(o[0], d1);
        if (lo >= hi) return null;
        var cost = function (t) { return k[0][0] * t + k[0][1] * (o[0] - t) + k[1][0] * (d1 - t) + k[1][1] * (o[1] - d1 + t); };
        var best = Math.min(cost(lo), cost(hi)), worst = Math.max(cost(lo), cost(hi));
        if (best === worst) return null;
        var greedyMin = cost(Math.floor((lo + hi) / 2));
        var sb = scegli([oV(q(worst)), oV(q(greedyMin)), oV(q(best + 5)), oV(q(k[0][0] * o[0] + k[1][1] * o[1]))], oV(q(best)), 3);
        if (!sb) return null;
        var testo = L2("Problema di trasporto bilanciato: due magazzini con disponibilità $o = " + vett(o) + "$, due clienti con domande $d = " + vett(d) + "$, costi unitari $k_{11} = " + k[0][0] + "$, $k_{12} = " + k[0][1] + "$, $k_{21} = " + k[1][0] + "$, $k_{22} = " + k[1][1] + "$, variabili $x_{ij} \\ge 0$ e vincoli $\\sum_j x_{ij} = o_i$, $\\sum_i x_{ij} = d_j$. Qual è il costo minimo di trasporto?",
          "Balanced transportation problem: two warehouses with availability $o = " + vett(o) + "$, two clients with demands $d = " + vett(d) + "$, unit costs $k_{11} = " + k[0][0] + "$, $k_{12} = " + k[0][1] + "$, $k_{21} = " + k[1][0] + "$, $k_{22} = " + k[1][1] + "$, variables $x_{ij} \\ge 0$ and constraints $\\sum_j x_{ij} = o_i$, $\\sum_i x_{ij} = d_j$. What is the minimum transportation cost?");
        var sp = L2("Con $x_{11} = t$ le altre variabili sono determinate e $t \\in [" + lo + ", " + hi + "]$; il costo è lineare in $t$, quindi il minimo è in un estremo: $" + best + "$.",
          "With $x_{11} = t$ the other variables are determined and $t \\in [" + lo + ", " + hi + "]$; the cost is linear in $t$, so the minimum is at an endpoint: $" + best + "$.");
        return impacchetta(rng, lingua, oV(q(best)), sb, testo, sp, { o: o, d: d, k: k });
      });
    }
  });

  // ---------------------------------------------------------------- complessa: duale ottimo con gli scarti complementari
  G.push({
    id: "lp-g-cs-duale", livello: "complessa", capitolo: "09-duality", link: link("09-duality", "93-scarti-complementari", "93-complementary-slackness"),
    genera: function (rng, lingua) {
      return tenta(function () {
        var L = lpGentile(rng, 2, 2, { den: 6 }); if (!L) return null;
        var D = L.D, x = puntoD(D, 2);
        if (x.some(function (v) { return v.isZero(); })) return null;
        var p = duali(D, 2, 2), z = D.z;
        var mk = function (v, zz) { var s = "$\\tilde{\\boldsymbol \\pi} = " + vett(v) + "$, $z = " + zz.tex() + "$"; return opz(s, s, chiave(v) + "|" + zz.key()); };
        var giusta = mk(p, z);
        var wrong = [p[1], p[0]], tr = [D.c[3] ? D.c[3] : q(0), D.c[4] ? D.c[4] : q(0)];
        var sb = scegli([mk(wrong, q(L.b[0]).mul(wrong[0]).add(q(L.b[1]).mul(wrong[1]))), mk(tr, z), mk(p, z.add(1)), mk([q(L.c[0]), q(L.c[1])], z)], giusta, 3);
        if (!sb) return null;
        var testo = L2("Il problema LP " + lpTex("it", "max", L.c, L.A, ["le", "le"], L.b) + " ha soluzione ottima $\\tilde{\\boldsymbol x} = " + vett(x) + "$, con entrambe le componenti positive. Usando gli scarti complementari ($\\tilde x_j > 0 \\Rightarrow$ vincolo duale $j$ attivo), quale soluzione ottima ha il duale $\\min\\{{\\boldsymbol b}'{\\boldsymbol \\pi} : {\\boldsymbol A}'{\\boldsymbol \\pi} \\ge {\\boldsymbol c},~ {\\boldsymbol \\pi} \\ge {\\boldsymbol 0}\\}$, e con quale valore?",
          "The LP problem " + lpTex("en", "max", L.c, L.A, ["le", "le"], L.b) + " has optimal solution $\\tilde{\\boldsymbol x} = " + vett(x) + "$, with both components positive. Using complementary slackness ($\\tilde x_j > 0 \\Rightarrow$ dual constraint $j$ active), which optimal solution does the dual $\\min\\{{\\boldsymbol b}'{\\boldsymbol \\pi} : {\\boldsymbol A}'{\\boldsymbol \\pi} \\ge {\\boldsymbol c},~ {\\boldsymbol \\pi} \\ge {\\boldsymbol 0}\\}$ have, and with which value?");
        var sp = L2("I due vincoli duali sono attivi: si risolve ${\\boldsymbol A}'{\\boldsymbol \\pi} = {\\boldsymbol c}$, da cui $\\tilde{\\boldsymbol \\pi} = " + vett(p) + "$; per la dualità forte ${\\boldsymbol b}'\\tilde{\\boldsymbol \\pi} = " + z.tex() + " = {\\boldsymbol c}'\\tilde{\\boldsymbol x}$.",
          "Both dual constraints are active: solve ${\\boldsymbol A}'{\\boldsymbol \\pi} = {\\boldsymbol c}$, giving $\\tilde{\\boldsymbol \\pi} = " + vett(p) + "$; by strong duality ${\\boldsymbol b}'\\tilde{\\boldsymbol \\pi} = " + z.tex() + " = {\\boldsymbol c}'\\tilde{\\boldsymbol x}$.");
        return impacchetta(rng, lingua, giusta, sb, testo, sp, { A: L.A, b: L.b, c: L.c });
      });
    }
  });
})();
