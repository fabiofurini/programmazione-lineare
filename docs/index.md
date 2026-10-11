---
title: Programmazione lineare
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

![Lavori in corso: sito e materiale didattico sono ancora in costruzione](img/cantiere.svg){ width="560" }

**Sito in costruzione.** Il materiale è ancora in lavorazione: slide e notebook arriveranno più
avanti; il laboratorio interattivo è già aperto e crescerà.

# Programmazione lineare

Materiale didattico ideato e sviluppato da **[Fabio Furini](https://fabiofurini.github.io/)**, professore
associato al [DIAG](https://www.diag.uniroma1.it/), Sapienza Università di Roma.

**Le dispense del corso, online**: problemi di programmazione lineare, poliedri, algoritmo del simplesso,
dualità, metodi avanzati e tecniche di modellazione, con definizioni, teoremi con le loro dimostrazioni,
esempi svolti passo per passo ed esercizi con le soluzioni.

[Comincia dai problemi di PL :material-arrow-right:](problemi-pl/index.md){ .md-button .md-button--primary }
[Gli esercizi](esercizi/index.md){ .md-button }
[Prova un grafico interattivo](laboratorio/index.md){ .md-button }
[:material-download: Scarica le dispense (PDF)](materiale.md){ .md-button }

</div>

## Come è organizzato ogni capitolo

Ogni capitolo è una delle note del corso, con gli stessi numeri e gli stessi colori della
dispensa: sul sito e nel PDF trovi tutto allo stesso posto.

<div class="grid" markdown>

!!! definizione "Definizione"
    Il significato preciso di un concetto nuovo.

!!! teorema "Teorema, proposizione, osservazione"
    Un risultato da ricordare, con le sue ipotesi.

!!! esempio "Esempio"
    Un calcolo svolto per intero, un passo alla volta.

!!! chiave ""
    **In verde** il punto chiave da portare a casa.

</div>

??? dimostrazione "Dimostrazione — si apre con un clic"
    Le dimostrazioni ci sono tutte, ma chiuse: prima leggi l'enunciato, poi apri la
    dimostrazione quando vuoi studiarla. Lo stesso vale per le soluzioni degli esercizi.

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

-   :material-lightbulb-on-outline: **5 · Modellazione**

    ---

    Le tecniche per scrivere un modello di programmazione lineare a partire dalla descrizione di un problema (produzione, miscelazione, trasporto, pianificazione multi-periodo, linearizzazioni), con esempi svolti. I modelli completi sono nell'eserciziario 5.

    16\. Tecniche di modellazione per la programmazione lineare

    [:octicons-arrow-right-24: I capitoli](modellazione/index.md)

</div>

## Da non perdere

<div class="grid cards" markdown>

-   :material-pencil-box-multiple: **Esercizi con le soluzioni**

    ---

    Esercizi per ogni capitolo, ciascuno con la soluzione svolta che si apre con un clic.

    [:octicons-arrow-right-24: Gli esercizi](esercizi/index.md)

-   :material-gesture-tap: **Laboratorio interattivo**

    ---

    Muovi i parametri con i cursori, trascina i punti e guarda poliedri, rette di livello,
    vertici ottimi e problemi duali cambiare sotto i tuoi occhi.

    [:octicons-arrow-right-24: I grafici](laboratorio/index.md)

-   :material-download: **Dispense ed eserciziari in PDF**

    ---

    Cinque volumi di dispense, cinque di esercizi e il catalogo dei problemi, con la stessa numerazione del sito.

    [:octicons-arrow-right-24: Il materiale](materiale.md)

-   :material-view-list: **Catalogo dei problemi**

    ---

    I problemi P0–P86 usati negli esempi e negli esercizi, con la figura della regione ammissibile.

    [:octicons-arrow-right-24: Il catalogo](catalogo/index.md)

-   :material-format-list-numbered: **Indice completo**

    ---

    Tutti i capitoli con le loro sezioni, in una pagina.

    [:octicons-arrow-right-24: L’indice](indice.md)

</div>

---

Dello stesso autore:

- **[Laboratorio di Ricerca Operativa](https://fabiofurini.github.io/laboratorio-ricerca-operativa/)** — il laboratorio di modellazione e risoluzione di problemi di ottimizzazione, con Python e i solver;
- **[Modellazione MIP](https://fabiofurini.github.io/modellazione-mip/)** — il modulo sui modelli a variabili intere, con gli stessi strumenti e lo stesso stile;
- **[Analisi Matematica 1](https://fabiofurini.github.io/analisi-matematica-1/)** — le dispense di analisi, con i grafici interattivi;
- **[Algebra lineare](https://fabiofurini.github.io/algebra-lineare/)** — il corso propedeutico, con il laboratorio di calcolo passo per passo;
- **[Ottimizzazione convessa](https://fabiofurini.github.io/ottimizzazione-convessa/)** — insiemi e funzioni convesse, problemi di ottimizzazione, con grafici interattivi;
- **[Algoritmi](https://fabiofurini.github.io/algoritmi/)** — rappresentazione dei numeri, pseudocodice, linguaggi C++, Python e Java, ordinamento e ricerca, notazione asintotica, analisi e algoritmi ricorsivi, con grafici interattivi.

Materiale didattico di **[Fabio Furini](https://fabiofurini.github.io/)** —
[DIAG](https://www.diag.uniroma1.it/), Sapienza Università di Roma.

*This website is also available in [English](https://fabiofurini.github.io/linear-programming/).*
