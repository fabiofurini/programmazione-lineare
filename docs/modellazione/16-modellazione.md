---
title: "Tecniche di modellazione per la programmazione lineare"
---

# Tecniche di modellazione per la programmazione lineare

<div class="info-capitolo" markdown>

**Parte 5 · Modellazione · Capitolo 16** · [:material-file-pdf-box: Dispensa, volume 5 (PDF)](../pdf/dispensa-5-modellazione.pdf) · [:material-pencil: Esercizi: Tecniche di modellazione per la programmazione lineare](../esercizi/es-16-modellazione.md)

</div>

## 16.1 Dalla descrizione di un problema a un modello LP

- Un <strong>modello</strong> di un problema di ottimizzazione è una descrizione matematica delle sue soluzioni ammissibili e della quantità da ottimizzare. Scrivere un modello richiede tre passi, sempre in questo ordine.

!!! chiave ""

    1. <strong>Variabili decisionali.</strong> Individuare le decisioni da prendere e associare una variabile a ciascuna di esse. Per ogni variabile, indicare la sua <u>unità di misura</u> e il suo dominio.

    2. <strong>Funzione obiettivo.</strong> Scrivere, come funzione lineare delle variabili decisionali, la quantità da massimizzare o minimizzare.

    3. <strong>Vincoli.</strong> Scrivere, come uguaglianze o disuguaglianze lineari, ogni requisito che una soluzione ammissibile deve soddisfare.

- Il modello si scrive con <strong>dati simbolici</strong>, in modo che descriva il problema per ogni istanza, e non soltanto per una di esse. Usiamo le seguenti convenzioni:

    1. le <u>dimensioni</u> dell'istanza sono numeri interi, per esempio $r \in \Z_{\ge 1}$ e $s \in \Z_{\ge 1}$;

    2. i <u>dati numerici</u> sono numeri razionali, per esempio $a_i \in \Q_{> 0}$ e $w_{ij} \in \Q_{\ge 0}$;

    3. gli <u>insiemi di indici</u> si scrivono esplicitamente, per esempio $\forall i \in \{1,2,\dots,r\}$.

- Un modello è un modello di <strong>programmazione lineare</strong> se la sua funzione obiettivo e tutti i suoi vincoli sono lineari, e se tutte le sue variabili sono continue. In questo caso il modello si può risolvere con l'algoritmo del simplesso.

!!! chiave ""

    I tre errori più frequenti nello scrivere un modello LP sono:

    1. dimenticare i <strong>vincoli di non negatività</strong> delle variabili;

    2. scrivere vincoli non <u>dimensionalmente coerenti</u>, cioè che sommano quantità con unità di misura diverse;

    3. usare una variabile nella funzione obiettivo senza averla definita tra le variabili decisionali.

## 16.2 Pianificazione della produzione

- Un'azienda produce $r \in \Z_{\ge 1}$ prodotti diversi usando $s \in \Z_{\ge 1}$ risorse limitate. Per ogni prodotto $j \in \{1,2,\dots,r\}$, il valore $c_j \in \Q_{> 0}$ è il profitto di un'unità di prodotto; per ogni risorsa $i \in \{1,2,\dots,s\}$, il valore $b_i \in \Q_{> 0}$ è la quantità disponibile, e $a_{ij} \in \Q_{\ge 0}$ è la quantità di risorsa $i$ consumata da un'unità di prodotto $j$. L'azienda vuole determinare un piano di produzione di profitto massimo.

- Introduciamo le seguenti $r$ variabili non negative:

    $$
    x_j = \textrm{ unità di prodotto } j \textrm{ prodotte}, \qquad \forall j \in \{1,2,\dots,r\} .
    $$

!!! chiave ""

    <a id="eq-PROD"></a>

    \begin{align*}
    \max ~~ \sum_{j=1}^{r} c_j \;  x_j & & \label{prod_obj}  \tag{16.1a}\\[1ex]
    \text{soggetto a} \quad     \sum_{j=1}^{r} a_{ij} \;  x_j  &\le b_i,       & \forall  i \in \{1,2,\dots,s\},               \label{prod_cons}  \tag{16.1b}\\[1ex]
    x_j  &\ge 0,       &  \forall  j \in \{1,2,\dots,r\} . \label{prod_nonneg} \tag{16.1c}
    \end{align*}

- La funzione obiettivo $\eqref{prod_obj}$ è il profitto totale. I vincoli $\eqref{prod_cons}$ impongono che il consumo di ogni risorsa non superi la sua disponibilità. Si tratta di un problema LP in <strong>forma canonica di massimo</strong>.

<a id="box-1-ex-mod-1"></a>

!!! esempio "Esempio 16.1: pianificazione della produzione"

    Consideriamo un'istanza con $r=2$ prodotti e $s=3$ risorse:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th></th>
    <th><span class="arithmatex">\(j=1\)</span></th>
    <th><span class="arithmatex">\(j=2\)</span></th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(c_j\)</span></td>
    <td>3</td>
    <td>5</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(a_{1j}\)</span></td>
    <td>1</td>
    <td>0</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(a_{2j}\)</span></td>
    <td>0</td>
    <td>2</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(a_{3j}\)</span></td>
    <td>3</td>
    <td>2</td>
    </tr>
    </table></div>

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(b_1\)</span></th>
    <th><span class="arithmatex">\(b_2\)</span></th>
    <th><span class="arithmatex">\(b_3\)</span></th>
    </tr>
    <tr>
    <td>4</td>
    <td>12</td>
    <td>18</td>
    </tr>
    </table></div>

    Il modello LP per questa istanza è il seguente:

    $$
    \begin{array}{rrcrcr}
    {\max} & {3\,x_{1}} & {+} & {5\,x_{2}} \\[1ex]
    \text{soggetto a} & {x_{1}} &  &  & {\le} & {4} \\[1ex]
    &  &  & {2\,x_{2}} & {\le} & {12} \\[1ex]
    & {3\,x_{1}} & {+} & {2\,x_{2}} & {\le} & {18} \\[1ex]
    & {x_{1},} &  & {x_{2}} & {\ge} & {0}
    \end{array}
    $$

    Una soluzione ottima è $\tilde x_1 = 2$ e $\tilde x_2 = 6$, con valore ottimo $z(\, LP \,) = 36$.

## 16.3 Miscelazione

- Una quantità $d \in \Q_{> 0}$ di un prodotto finale deve essere ottenuta miscelando $r \in \Z_{\ge 1}$ materie prime. Per ogni materia prima $j \in \{1,2,\dots,r\}$, il valore $c_j \in \Q_{> 0}$ è il costo di un'unità. Il prodotto finale deve contenere almeno una quantità $q_k \in \Q_{\ge 0}$ di ciascuno degli $s \in \Z_{\ge 1}$ componenti, e $p_{kj} \in \Q_{\ge 0}$ è la quantità di componente $k$ contenuta in un'unità di materia prima $j$. L'azienda vuole determinare una miscela di costo minimo.

- Introduciamo le seguenti $r$ variabili non negative:

    $$
    x_j = \textrm{ unità di materia prima } j \textrm{ usate nella miscela}, \qquad \forall j \in \{1,2,\dots,r\} .
    $$

!!! chiave ""

    <a id="eq-BLEND"></a>

    \begin{align*}
    \min ~~ \sum_{j=1}^{r} c_j \;  x_j & & \label{blend_obj}  \tag{16.2a}\\[1ex]
    \text{soggetto a} \quad     \sum_{j=1}^{r}  x_j  &= d,       &                \label{blend_quantity}  \tag{16.2b}\\[1ex]
    \sum_{j=1}^{r} p_{kj} \;  x_j  &\ge q_k,       &  \forall  k \in \{1,2,\dots,s\},  \label{blend_comp}  \tag{16.2c}\\[1ex]
    x_j  &\ge 0,       &  \forall  j \in \{1,2,\dots,r\} . \label{blend_nonneg} \tag{16.2d}
    \end{align*}

- Il vincolo $\eqref{blend_quantity}$ impone che la quantità totale prodotta sia $d$, e i vincoli $\eqref{blend_comp}$ impongono la quantità minima di ciascun componente.

- Un requisito della forma “<em>la materia prima $j$ deve essere almeno una frazione $\alpha$ della miscela</em>” <u>non</u> si scrive come $\frac{x_j}{\sum_{\ell} x_{\ell}} \ge \alpha$, che non è un vincolo lineare. Si scrive invece moltiplicando entrambi i membri per il denominatore, che è positivo:

    $$
    x_j \ge \alpha \; \sum_{\ell = 1}^{r} x_{\ell}
    \qquad \Longleftrightarrow \qquad
    (1 - \alpha) \; x_j - \alpha \sum_{\ell \ne j} x_{\ell} \ge 0 .
    $$

<a id="box-2-ex-mod-2"></a>

!!! esempio "Esempio 16.2: miscelazione"

    Un'azienda deve produrre $d=100$ chilogrammi di mangime miscelando $r=3$ materie prime, i cui costi al chilogrammo sono $c_1 = 0.80$, $c_2 = 0.50$ e $c_3 = 0.30$ euro. Il mangime deve contenere almeno $q_1 = 8$ chilogrammi di proteine, e un chilogrammo di ciascuna materia prima contiene, rispettivamente, $p_{11} = 0.12$, $p_{12} = 0.08$ e $p_{13} = 0.03$ chilogrammi di proteine. Inoltre, la prima materia prima deve essere almeno il $20\%$ della miscela.

    Il modello LP per questa istanza è il seguente:

    $$
    \begin{array}{rrcrcrcr}
    {\min} & {0.80\,x_{1}} & {+} & {0.50\,x_{2}} & {+} & {0.30\,x_{3}} \\[1ex]
    \text{soggetto a} & {x_{1}} & {+} & {x_{2}} & {+} & {x_{3}} & {=} & {100} \\[1ex]
    & {0.12\,x_{1}} & {+} & {0.08\,x_{2}} & {+} & {0.03\,x_{3}} & {\ge} & {8} \\[1ex]
    & {0.80\,x_{1}} & {-} & {0.20\,x_{2}} & {-} & {0.20\,x_{3}} & {\ge} & {0} \\[1ex]
    & {x_{1},} &  & {x_{2},} &  & {x_{3}} & {\ge} & {0}
    \end{array}
    $$

    dove il terzo vincolo è il requisito di proporzione $x_1 \ge 0.20 \, (x_1 + x_2 + x_3)$, riscritto come vincolo lineare.

    Una soluzione ottima è $\tilde x_1 = 20$, $\tilde x_2 = 64$ e $\tilde x_3 = 16$, con valore ottimo

    $$
    z(\, LP \,) = 0.80 \cdot 20 + 0.50 \cdot 64 + 0.30 \cdot 16 = 52.80 \text{  euro} .
    $$

## 16.4 Trasporto

- Un'azienda ha $s \in \Z_{\ge 1}$ magazzini e deve servire $r \in \Z_{\ge 1}$ clienti. Per ogni magazzino $i \in \{1,2,\dots,s\}$, il valore $a_i \in \Q_{> 0}$ è la quantità di prodotto disponibile; per ogni cliente $j \in \{1,2,\dots,r\}$, il valore $d_j \in \Q_{> 0}$ è la domanda, e $c_{ij} \in \Q_{\ge 0}$ è il costo per trasportare un'unità di prodotto dal magazzino $i$ al cliente $j$. L'azienda vuole determinare un piano di trasporto di costo minimo.

- Introduciamo le seguenti $s \cdot r$ variabili non negative:

    $$
    \begin{gathered}
    x_{ij} = \textrm{ unità trasportate dal magazzino } i \text{ al cliente } j, \\[0.5ex]
    \forall i \in \{1,2,\dots,s\}, ~ \forall j \in \{1,2,\dots,r\}.
    \end{gathered}
    $$

!!! chiave ""

    <a id="eq-TRANSP"></a>

    \begin{align*}
    \min ~~ \sum_{i=1}^{s} \sum_{j=1}^{r} c_{ij} \;  x_{ij} & & \label{transp_obj}  \tag{16.3a}\\[1ex]
    \text{soggetto a} \quad     \sum_{j=1}^{r}  x_{ij}  &\le a_i,       &  \forall  i \in \{1,2,\dots,s\},              \label{transp_avail}  \tag{16.3b}\\[1ex]
    \sum_{i=1}^{s}  x_{ij}  &\ge d_j,       &  \forall  j \in \{1,2,\dots,r\},  \label{transp_demand}  \tag{16.3c}\\[1ex]
    x_{ij}  &\ge 0,       &  \forall  i \in \{1,2,\dots,s\}, ~ \forall j \in \{1,2,\dots,r\}. \label{transp_nonneg} \tag{16.3d}
    \end{align*}

- I vincoli $\eqref{transp_avail}$ impongono che nessun magazzino spedisca più della sua disponibilità, e i vincoli $\eqref{transp_demand}$ impongono che ogni cliente riceva almeno la sua domanda. Il modello è ammissibile se e solo se $\sum_{i} a_i \ge \sum_{j} d_j$.

<a id="box-3-ex-mod-3"></a>

!!! esempio "Esempio 16.3: trasporto"

    Consideriamo un'istanza con $s=2$ magazzini, di disponibilità $a_1 = 50$ e $a_2 = 60$, e $r=2$ clienti, di domande $d_1 = 30$ e $d_2 = 80$. I costi di trasporto sono:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(c_{ij}\)</span></th>
    <th><span class="arithmatex">\(j=1\)</span></th>
    <th><span class="arithmatex">\(j=2\)</span></th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(i=1\)</span></td>
    <td>4</td>
    <td>6</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(i=2\)</span></td>
    <td>5</td>
    <td>3</td>
    </tr>
    </table></div>

    Una soluzione ottima è

    $$
    \tilde x_{11} = 30, \qquad \tilde x_{12} = 20, \qquad \tilde x_{21} = 0, \qquad \tilde x_{22} = 60 ,
    $$

    con valore ottimo

    $$
    z(\, LP \,) = 4 \cdot 30 + 6 \cdot 20 + 5 \cdot 0 + 3 \cdot 60 = 420 .
    $$

## 16.5 Pianificazione multi-periodo

- Un'azienda deve soddisfare la domanda di un prodotto su un orizzonte temporale di $n \in \Z_{\ge 1}$ periodi. Per ogni periodo $t \in \{1,2,\dots,n\}$, il valore $d_t \in \Q_{\ge 0}$ è la domanda, $p_t \in \Q_{> 0}$ è la produzione massima, $c_t \in \Q_{> 0}$ è il costo unitario di produzione e $h_t \in \Q_{> 0}$ è il costo unitario per immagazzinare un'unità dal periodo $t$ al periodo $t+1$.

- Introduciamo le seguenti $2 \, n$ variabili non negative:

    $$
    \begin{cases}
    x_t = \textrm{ unità prodotte nel periodo } t\\[1ex]
    y_t = \textrm{ unità in magazzino alla fine del periodo } t
    \end{cases}
    \qquad \forall t \in \{1,2,\dots,n\} .
    $$

!!! chiave ""

    <a id="eq-MULTI"></a>

    \begin{align*}
    \min ~~ \sum_{t=1}^{n} c_t \;  x_t + \sum_{t=1}^{n} h_t \;  y_t & & \label{multi_obj}  \tag{16.4a}\\[1ex]
    \text{soggetto a} \quad     y_{t-1} + x_t - y_t  &= d_t,       &  \forall  t \in \{1,2,\dots,n\},              \label{multi_balance}  \tag{16.4b}\\[1ex]
    x_t  &\le p_t,       &  \forall  t \in \{1,2,\dots,n\},  \label{multi_capacity}  \tag{16.4c}\\[1ex]
    x_t  &\ge 0,       &  \forall  t \in \{1,2,\dots,n\}, \label{multi_nonneg}  \tag{16.4d}\\[1ex]
    y_t  &\ge 0,       &  \forall  t \in \{1,2,\dots,n\}, \label{multi_nonneg_y} \tag{16.4e}
    \end{align*}

    con $y_0 = 0$.

- I vincoli $\eqref{multi_balance}$ sono i <strong>vincoli di bilanciamento delle scorte</strong>: in ogni periodo, ciò che era in magazzino alla fine del periodo precedente più ciò che si produce è uguale alla domanda più ciò che resta in magazzino. Sono la chiave di ogni modello multi-periodo, e collegano periodi consecutivi.

## 16.6 Tecniche di linearizzazione

- Alcuni requisiti non sono lineari così come sono scritti, ma si possono riscrivere come vincoli lineari, eventualmente con l'aiuto di variabili aggiuntive. Presentiamo i tre casi più frequenti.

### 16.6.1 Funzioni obiettivo min-max e max-min

!!! chiave ""

    Una funzione obiettivo della forma

    $$
    \min ~ \max_{i \in \{1,2,\dots,m\}} \left\{ \sum_{j=1}^n a_{ij} \, x_j \right\}
    $$

    si linearizza introducendo una variabile libera aggiuntiva $w$ e scrivendo

    $$
    \min ~ w
    \qquad \text{soggetto a} \qquad
    w \ge \sum_{j=1}^n a_{ij} \, x_j , \qquad \forall i \in \{1,2,\dots,m\} .
    $$

- Gli $m$ vincoli impongono che $w$ non sia minore di ciascuna delle $m$ funzioni lineari, cioè che $w$ non sia minore del loro massimo. Poiché $w$ viene minimizzata, in una soluzione ottima è esattamente uguale a tale massimo.

- Simmetricamente, una funzione obiettivo <strong>max-min</strong> si linearizza introducendo una variabile libera aggiuntiva $w$, massimizzandola e imponendo $w \le \sum_{j} a_{ij} \, x_j$ per ogni $i$.

- La linearizzazione funziona solo in queste due direzioni: la <u>massimizzazione</u> di un massimo, o la <u>minimizzazione</u> di un minimo, non si può linearizzare in questo modo.

### 16.6.2 Valori assoluti

!!! chiave ""

    Un termine $\left| \sum_{j=1}^n a_{ij} \, x_j \right|$ che compare con coefficiente <u>positivo</u> in una funzione obiettivo <u>da minimizzare</u> si linearizza introducendo una variabile non negativa aggiuntiva $w_i$ e scrivendo

    $$
    w_i \ge \sum_{j=1}^n a_{ij} \, x_j
    \qquad {\rm e} \qquad
    w_i \ge - \sum_{j=1}^n a_{ij} \, x_j .
    $$

- I due vincoli impongono $w_i \ge \left| \sum_{j} a_{ij} \, x_j \right|$, e la minimizzazione rende la disuguaglianza soddisfatta all'uguaglianza in una soluzione ottima.

- In alternativa, sotto la <u>stessa condizione</u> (coefficiente positivo in una funzione obiettivo da minimizzare, o coefficiente negativo in una da massimizzare), lo stesso termine si linearizza scrivendo $\sum_{j} a_{ij} \, x_j = w_i^{+} - w_i^{-}$ con $w_i^{+}, w_i^{-} \ge 0$, e sostituendo il valore assoluto con $w_i^{+} + w_i^{-}$. L'ottimizzazione rende almeno una tra $w_i^{+}$ e $w_i^{-}$ uguale a $0$ in una soluzione ottima, e allora $w_i^{+} + w_i^{-} = \left| \sum_{j} a_{ij} \, x_j \right|$; senza quella condizione, entrambe le variabili potrebbero essere positive e il modello sarebbe sbagliato.

### 16.6.3 Rapporti e percentuali

!!! chiave ""

    Un vincolo della forma

    $$
    \frac{\sum_{j=1}^n a_{j} \, x_j}{\sum_{j=1}^n e_{j} \, x_j} \le \gamma ,
    \qquad \text{con} \qquad
    \sum_{j=1}^n e_{j} \, x_j > 0 ,
    $$

    si linearizza moltiplicando entrambi i membri per il denominatore, che è positivo:

    $$
    \sum_{j=1}^n \big( a_{j} - \gamma \; e_{j} \big) \, x_j \le 0 .
    $$

- La stessa tecnica si applica ai requisiti percentuali dei modelli di miscelazione. È corretta solo quando il denominatore è <u>sicuramente positivo</u> per ogni soluzione ammissibile: altrimenti moltiplicare per esso cambierebbe il verso della disuguaglianza.

## 16.7 Che cosa non si può modellare con la programmazione lineare

!!! chiave ""

    I seguenti requisiti <u>non</u> si possono scrivere come vincoli lineari su variabili continue, e richiedono variabili <strong>intere</strong>:

    1. <strong>quantità indivisibili</strong>, per esempio il numero di macchine da acquistare o di veicoli da usare;

    2. <strong>decisioni sì/no</strong>, per esempio se aprire o no un magazzino;

    3. <strong>costi fissi</strong>, cioè un costo che si paga solo se l'attività associata viene svolta;

    4. <strong>vincoli disgiuntivi</strong>, cioè requisiti di cui almeno uno su due deve valere;

    5. <strong>quantità minime positive</strong>, per esempio “<em>o non produrre nulla, o produrre almeno $q$ unità</em>”.

    Questi requisiti sono l'oggetto della <strong>programmazione lineare intera</strong>.

- Un errore frequente è scrivere un costo fisso come termine non lineare della funzione obiettivo, oppure imporre una quantità minima positiva con il vincolo $x_j \ge q$: quest'ultimo esclude la soluzione $x_j = 0$, che invece deve restare ammissibile.

- Ogni volta che i requisiti di un problema sono del tipo elencato sopra, il modello LP ottenuto ignorandoli resta utile: è un <strong>rilassamento</strong> del modello corretto, e quindi il suo valore ottimo è un upper bound sul valore ottimo del modello corretto, per un problema di massimo, e un lower bound per un problema di minimo.

---

**Esercizi su questo capitolo:** [:material-pencil: Tecniche di modellazione per la programmazione lineare](../esercizi/es-16-modellazione.md)
