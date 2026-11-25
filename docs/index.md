---
title: Programmazione lineare
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

# Programmazione lineare

<!-- collana-riga -->
<p class="collana-riga" markdown>Un corso della collana <b>Ricerca Operativa e Matematica</b> · [tutti i corsi](#la-collana)</p>
<!-- /collana-riga -->

Materiale didattico ideato e sviluppato da **[Fabio Furini](https://fabiofurini.github.io/)**, professore
associato al [DIAG](https://www.diag.uniroma1.it/), Sapienza Università di Roma.

Il corso presenta la programmazione lineare: funzioni lineari, poliedri e problemi di programmazione
lineare con i loro esiti possibili; l'algoritmo del simplesso con la fase 0; la teoria della dualità
e il simplesso duale; il simplesso rivisto, il metodo primale-duale, l'analisi di sensitività e la
geometria della programmazione lineare.

Prerequisiti: [Algebra lineare](https://fabiofurini.github.io/algebra-lineare/).

[Comincia :material-arrow-right:](problemi-pl/index.md){ .md-button .md-button--primary }
[:material-pencil: Esercizi](esercizi/index.md){ .md-button }
[:material-gesture-tap: Laboratorio](laboratorio/index.md){ .md-button }
[:material-clipboard-check-outline: Quiz](autovalutazione.md){ .md-button }
[:material-download: Materiale](materiale.md){ .md-button }

</div>

<!-- collana-app -->
## Provalo subito

Il metodo grafico: la retta di livello è già sul vertice ottimo, l'ultimo punto della regione ammissibile che tocca andando verso il gradiente. Riporta z a zero e premi ▶ per farla scorrere, oppure cambia problema.

<div class="gi" data-grafico="metodo-grafico" data-vetrina="P2"></div>

[:material-gesture-tap: Altre app nel laboratorio](laboratorio/index.md){ .md-button }
<!-- /collana-app -->

## Le parti del corso

<div class="grid cards" markdown>

-   :material-vector-triangle: **1 · Funzioni lineari, poliedri e problemi di programmazione lineare**

    ---

    Funzioni lineari (gradiente, Hessiano e insiemi di livello), semispazi e poliedri, problemi di ottimizzazione lineare con le loro soluzioni ottime, esempi e proprietà, le forme canonica e standard con il metodo grafico, esiti possibili ed equivalenze fra le forme.

    1\. Funzioni lineari · 2\. Semispazi e poliedri · 3\. Problemi di ottimizzazione lineare · 4\. Problemi di programmazione lineare · 5\. Esiti possibili e formulazioni equivalenti

    [:octicons-arrow-right-24: I capitoli](problemi-pl/index.md)

-   :material-stairs-up: **2 · L'algoritmo del simplesso**

    ---

    L'algoritmo del simplesso sui dizionari, condizioni di ottimalità, regole di pivot e ciclaggio, la Fase 0 con il problema ausiliario. Esempi svolti passo per passo ed esercizi con la soluzione completa in fondo a ogni capitolo.

    6\. Algoritmo del simplesso · 7\. Condizioni di ottimalità e regole di pivot · 8\. Fase 0 dell'algoritmo del simplesso

    [:octicons-arrow-right-24: I capitoli](simplesso/index.md)

-   :material-swap-horizontal: **3 · Dualità e simplesso duale**

    ---

    Il problema duale, i teoremi della dualità debole e forte, gli esiti possibili della coppia primale-duale, gli scarti complementari; l'algoritmo del simplesso duale, i certificati di inammissibilità e la riottimizzazione. Esempi svolti passo per passo ed esercizi con la soluzione completa in fondo a ogni capitolo.

    9\. Teoria della dualità · 10\. Algoritmo del simplesso duale

    [:octicons-arrow-right-24: I capitoli](dualita/index.md)

-   :material-cube-outline: **4 · Metodi matriciali, sensitività e geometria**

    ---

    Il simplesso rivisto primale e duale, il metodo primale-duale, l'analisi di sensitività, la geometria della programmazione lineare (facce, vertici e soluzioni di base). Esempi svolti passo per passo ed esercizi con la soluzione completa in fondo a ogni capitolo.

    11\. Algoritmo del simplesso rivisto · 12\. Algoritmo del simplesso duale rivisto · 13\. Il metodo primale-duale · 14\. Analisi di sensitività · 15\. La geometria della programmazione lineare

    [:octicons-arrow-right-24: I capitoli](metodi-avanzati/index.md)

-   :material-chart-line: **Modellazione PL**

    ---

    Dalla descrizione di un problema al modello di programmazione lineare, risolto con Python e Gurobi: tecniche di modellazione e casi di studio. È un modulo a parte della collana.

    [:octicons-arrow-right-24: Il modulo Modellazione PL](https://fabiofurini.github.io/modellazione-pl/)

</div>

<!-- collana-da-non-perdere -->
## Da non perdere

<div class="grid cards" markdown>

-   :material-pencil-box-multiple: **Esercizi con le soluzioni**

    ---

    Esercizi per ogni capitolo, ciascuno con la soluzione svolta che si apre con un clic.

    [:octicons-arrow-right-24: Gli esercizi](esercizi/index.md)

-   :material-clipboard-check-outline: **Quiz di autovalutazione**

    ---

    Un facsimile d'esame nuovo a ogni avvio: 13 domande, 33 punti, con la soluzione e il link alle dispense. In Materiale c'è anche la banca completa delle domande.

    [:octicons-arrow-right-24: Mettiti alla prova](autovalutazione.md)

-   :material-gesture-tap: **Laboratorio interattivo**

    ---

    App che girano nel browser: muovi i parametri e guarda le idee del corso lavorare, un passo alla volta.

    [:octicons-arrow-right-24: Il laboratorio](laboratorio/index.md)

-   :material-download: **Dispense in PDF**

    ---

    Dispense, eserciziari e slide in PDF, con la stessa numerazione del sito.

    [:octicons-arrow-right-24: Il materiale](materiale.md)

-   :material-view-list: **Catalogo dei problemi**

    ---

    I problemi usati negli esempi e negli esercizi, ciascuno con la sua figura.

    [:octicons-arrow-right-24: Il catalogo](catalogo/index.md)

-   :material-format-list-numbered: **Indice completo**

    ---

    Tutti i capitoli con le loro sezioni in una pagina, e come è fatto ogni capitolo.

    [:octicons-arrow-right-24: L'indice](indice.md)

</div>
<!-- /collana-da-non-perdere -->

---

<!-- collana -->
## La collana

Tutti i corsi della collana hanno la stessa impostazione: dispense online e in PDF, esercizi con le soluzioni, laboratorio interattivo e quiz di autovalutazione.

<div class="grid cards" markdown>

-   :material-function-variant: **[Analisi Matematica 1](https://fabiofurini.github.io/analisi-matematica-1/)**

    numeri reali, funzioni, limiti, derivate e serie, con i grafici interattivi

-   :material-matrix: **[Algebra lineare](https://fabiofurini.github.io/algebra-lineare/)**

    vettori, matrici, determinanti, sistemi lineari e autovalori, con il laboratorio di calcolo

-   :material-code-braces: **[Algoritmi](https://fabiofurini.github.io/algoritmi/)**

    rappresentazione dei numeri, pseudocodice, ordinamento e ricerca, analisi e algoritmi ricorsivi

-   :material-vector-triangle: **Programmazione lineare** · *questo corso*

    poliedri, algoritmo del simplesso, dualità e simplesso duale, con il laboratorio interattivo

-   :material-dots-grid: **[Programmazione lineare intera](https://fabiofurini.github.io/programmazione-lineare-intera/)**

    rilassamento continuo, disuguaglianze valide, piani di taglio, branch-and-bound e branch-and-cut

-   :material-vector-curve: **[Ottimizzazione convessa](https://fabiofurini.github.io/ottimizzazione-convessa/)**

    insiemi e funzioni convesse, problemi di ottimizzazione convessa, con grafici interattivi

-   :material-graph-outline: **[Ottimizzazione su reti](https://fabiofurini.github.io/ottimizzazione-su-reti/)**

    grafi, alberi ricoprenti, cammini minimi, flussi su reti, simplesso su reti e gestione dei progetti

-   :material-hexagon-multiple-outline: **[Problemi di ottimizzazione combinatoria](https://fabiofurini.github.io/ottimizzazione-combinatoria/)**

    zaino, bin packing, colorazione, TSP, scheduling e lot sizing: i problemi, le formulazioni e gli algoritmi ad hoc

-   :material-table-large: **[Programmazione dinamica](https://fabiofurini.github.io/programmazione-dinamica/)**

    principi e algoritmi di PD per zaino, lot sizing, cambio monete e taglio delle aste

-   :material-map-marker-path: **[Algoritmi euristici](https://fabiofurini.github.io/algoritmi-euristici/)**

    euristiche costruttive, ricerca locale, metaeuristiche ed euristiche MIP per i problemi di ottimizzazione combinatoria

-   :material-approximately-equal: **[Algoritmi di approssimazione](https://fabiofurini.github.io/algoritmi-di-approssimazione/)**

    garanzie di prestazione, schemi di approssimazione e limiti dell'approssimazione per i problemi combinatori

-   :material-chart-line: **[Modellazione PL](https://fabiofurini.github.io/modellazione-pl/)**

    modelli di programmazione lineare per problemi gestionali, risolti con Python e Gurobi

-   :material-chart-bell-curve-cumulative: **[Modellazione PNL](https://fabiofurini.github.io/modellazione-pnl/)**

    modelli di programmazione non lineare, dal portafoglio al machine learning, con Python e Gurobi

-   :material-vector-polygon: **[Modellazione MIP](https://fabiofurini.github.io/modellazione-mip/)**

    modelli di programmazione lineare a variabili intere, dalla formulazione alla soluzione con i solver

</div>
<!-- /collana -->

---

Materiale didattico di **[Fabio Furini](https://fabiofurini.github.io/)** —
[DIAG](https://www.diag.uniroma1.it/), Sapienza Università di Roma.

*This website is also available in [English](https://fabiofurini.github.io/linear-programming/).*

*Le slide delle lezioni, un PDF per capitolo, sono nella pagina [Materiale](materiale.md).*
