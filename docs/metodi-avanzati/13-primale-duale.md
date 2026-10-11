---
title: "Il metodo primale-duale"
---

# Il metodo primale-duale

<div class="info-capitolo" markdown>

**Parte 4 · Metodi matriciali, sensitività e geometria · Capitolo 13** · [:material-file-pdf-box: Dispensa, volume 4 (PDF)](../pdf/dispensa-4-metodi-avanzati.pdf) · [:material-pencil: Esercizi](../esercizi/es-13-primale-duale.md)

</div>

## 13.1 La coppia di riferimento: problema primale e duale

- L'algoritmo del simplesso mantiene una base <strong>primale ammissibile</strong> e procede verso una base anche duale ammissibile; l'algoritmo del simplesso duale mantiene una base <strong>duale ammissibile</strong> e procede verso una base anche primale ammissibile. Il <strong>metodo primale-duale</strong> procede in modo diverso: mantiene una soluzione duale ammissibile, che <u>non</u> deve essere necessariamente una soluzione di base, e la usa per decidere quali variabili primali possono assumere un valore positivo.

- Il metodo è formulato in modo naturale per un problema LP in <strong>forma standard di minimo</strong> con vettore dei termini noti non negativo, e per il suo duale:

!!! chiave ""

    <div class="minipage" style="width:32%" markdown>

    <a id="eq-PD_PRIMAL"></a>

    \begin{align*}
    &&  \min \;\;{\boldsymbol c}' \; {\boldsymbol x}  \label{PD_P_OBJ}  \tag{13.1a}\\[1.5ex]
    && \text{soggetto a} \quad  {\boldsymbol A} \; {\boldsymbol x}  &= {\boldsymbol b}, \label{PD_P_CONS}  \tag{13.1b}\\[1.5ex]
    && {\boldsymbol x}                        &\ge  {\boldsymbol 0} \label{PD_P_NN} \tag{13.1c}
    \end{align*}

    </div>

    <div class="minipage" style="width:35%" markdown>

    <a id="eq-PD_DUAL"></a>

    \begin{align*}
    &&  \max \;\;{\boldsymbol b}' \; {\boldsymbol \pi}  \label{PD_D_OBJ}  \tag{13.2a}\\[1.5ex]
    && \text{soggetto a} \quad  {\boldsymbol A}' \; {\boldsymbol \pi}  &\le {\boldsymbol c}, \label{PD_D_CONS}  \tag{13.2b}\\[1.5ex]
    && {\boldsymbol \pi}  &\gtreqless  {\boldsymbol 0} \label{PD_D_FREE} \tag{13.2c}
    \end{align*}

    </div>

    con ${\boldsymbol b} \ge {\boldsymbol 0}$. Gli $n$ vincoli duali $\eqref{PD_D_CONS}$ si scrivono ${\boldsymbol A}_j' \, {\boldsymbol \pi} \le c_j$ per ogni $j \in \{1,2,\dots,n\}$, dove ${\boldsymbol A}_j$ è la $j$-esima colonna della matrice dei vincoli, e le $m$ variabili duali sono <u>libere</u>, perché i vincoli primali $\eqref{PD_P_CONS}$ sono uguaglianze.

- Ogni problema LP si può portare nella forma [(13.1)](#eq-PD_PRIMAL): una funzione obiettivo di massimo si sostituisce con la sua opposta, ai vincoli di disuguaglianza si aggiungono variabili di scarto o di surplus, le variabili non positive e libere si sostituiscono come di consueto, e ogni vincolo con termine noto negativo si moltiplica per $-1$.

<a id="box-1-def-J"></a>

!!! definizione "Definizione 13.1: insieme ammesso"

    Data una soluzione ammissibile ${\boldsymbol \pi}$ del problema duale [(13.2)](#eq-PD_DUAL), l'<strong>insieme ammesso</strong> è l'insieme degli indici dei vincoli duali soddisfatti con uguaglianza:

    $$
    \pazocal{J}({\boldsymbol \pi}) = \left\{\, j \in \{1,2,\dots,n\} ~:~ {\boldsymbol A}_j' \, {\boldsymbol \pi} = c_j \,\right\} .
    $$

!!! chiave ""

    Per il teorema degli scarti complementari, una soluzione ammissibile ${\boldsymbol x}$ del problema primale [(13.1)](#eq-PD_PRIMAL) e una soluzione ammissibile ${\boldsymbol \pi}$ del problema duale [(13.2)](#eq-PD_DUAL) sono entrambe ottime se e solo se

    $$
    x_j = 0, \qquad \forall j \notin \pazocal{J}({\boldsymbol \pi}) ,
    $$

    cioè se e solo se <u>solo le variabili ammesse</u> assumono un valore positivo.

- Questa è l'idea del metodo: data una ${\boldsymbol \pi}$ duale ammissibile, cerchiamo una soluzione primale ammissibile che usi solo le variabili di $\pazocal{J}({\boldsymbol \pi})$. Se tale soluzione esiste, la coppia è ottima; se non esiste, il tentativo stesso ci dice come <u>migliorare</u> ${\boldsymbol \pi}$.

## 13.2 Il primale ristretto

- Data una soluzione duale ammissibile ${\boldsymbol \pi}$ con insieme ammesso $\pazocal{J}$, cerchiamo una soluzione primale ammissibile che usi solo le variabili con indice in $\pazocal{J}$. Per farlo risolviamo un problema ausiliario con $m$ variabili artificiali, esattamente come nella Fase $0$ dell'algoritmo del simplesso.

<a id="box-2-def-rp"></a>

!!! definizione "Definizione 13.2: primale ristretto"

    Data una soluzione ammissibile ${\boldsymbol \pi}$ del problema duale [(13.2)](#eq-PD_DUAL) con insieme ammesso $\pazocal{J}$, il <strong>primale ristretto</strong> $RP(\pazocal{J})$ è:

    <a id="eq-PD_RP"></a>

    \begin{align*}
    &&  \xi(\pazocal{J}) = \min \;\; \sum_{i=1}^m a_i  \label{PD_RP_OBJ}  \tag{13.3a}\\[1.5ex]
    && \text{soggetto a} \quad  \sum_{j \in \pazocal{J}} {\boldsymbol A}_j \; x_j + {\boldsymbol a} &= {\boldsymbol b}, \label{PD_RP_CONS}  \tag{13.3b}\\[1.5ex]
    && x_j &\ge 0, \qquad \forall j \in \pazocal{J}, \label{PD_RP_NN1}  \tag{13.3c}\\[1.5ex]
    && {\boldsymbol a} &\ge {\boldsymbol 0} . \label{PD_RP_NN2} \tag{13.3d}
    \end{align*}

- Il primale ristretto non è mai inammissibile, poiché ${\boldsymbol b} \ge {\boldsymbol 0}$ ammette la soluzione di base ammissibile ${\boldsymbol a} = {\boldsymbol b}$ e $x_j = 0$ per ogni $j \in \pazocal{J}$, e non è mai illimitato, poiché il suo valore obiettivo è non negativo.

!!! chiave ""

    1. Se $\xi(\pazocal{J}) = 0$, allora la soluzione ottima di $RP(\pazocal{J})$, completata con $x_j = 0$ per ogni $j \notin \pazocal{J}$, è una <strong>soluzione ammissibile del problema primale</strong> [(13.1)](#eq-PD_PRIMAL) che soddisfa le condizioni degli scarti complementari insieme a ${\boldsymbol \pi}$: la coppia è <strong>ottima</strong> e il metodo si arresta.

    2. Se $\xi(\pazocal{J}) > 0$, allora nessuna soluzione primale ammissibile usa solo le variabili ammesse, e la soluzione duale ${\boldsymbol \pi}$ deve essere migliorata.

<a id="box-3-def-drp"></a>

!!! definizione "Definizione 13.3: duale del primale ristretto"

    Il problema duale del primale ristretto $RP(\pazocal{J})$, detto <strong>duale del primale ristretto</strong> $DRP(\pazocal{J})$, è:

    \begin{align*}
    &&  \max \;\;{\boldsymbol b}' \; {\boldsymbol y}  \\[1.5ex]
    && \text{soggetto a} \quad  {\boldsymbol A}_j' \, {\boldsymbol y}  &\le 0, \qquad \forall j \in \pazocal{J}, \\[1.5ex]
    && y_i &\le 1, \qquad \forall i \in \{1,2,\dots,m\} .
    \end{align*}

- La sua soluzione ottima ${\boldsymbol y}$ è prodotta dall'algoritmo del simplesso insieme alla soluzione ottima di $RP(\pazocal{J})$, e per la dualità forte abbiamo ${\boldsymbol b}' {\boldsymbol y} = \xi(\pazocal{J}) > 0$.

!!! chiave ""

    Il vettore ${\boldsymbol y}$ è la <strong>direzione</strong> lungo la quale si migliora la soluzione duale:

    $$
    {\boldsymbol \pi} \; \longleftarrow \; {\boldsymbol \pi} + \theta \; {\boldsymbol y} ,
    $$

    poiché il valore obiettivo duale aumenta, per ogni $\theta > 0$, di

    $$
    {\boldsymbol b}' ({\boldsymbol \pi} + \theta \, {\boldsymbol y}) - {\boldsymbol b}' {\boldsymbol \pi}
    = \theta \; \underbrace{{\boldsymbol b}' {\boldsymbol y}}_{= \, \xi(\pazocal{J}) \, > \, 0} \; > \; 0 .
    $$

## 13.3 Il passo duale

- La lunghezza del passo $\theta$ è il massimo valore per cui la nuova soluzione duale resta ammissibile. Per ogni $j \in \{1,2,\dots,n\}$ deve valere

    $$
    {\boldsymbol A}_j' ({\boldsymbol \pi} + \theta \, {\boldsymbol y}) \le c_j
    \qquad \Longleftrightarrow \qquad
    \theta \; {\boldsymbol A}_j' {\boldsymbol y} \; \le \; \underbrace{c_j - {\boldsymbol A}_j' {\boldsymbol \pi}}_{\text{scarto duale } s_j \, \ge \, 0} .
    $$

- Per $j \in \pazocal{J}$ il vincolo è soddisfatto per ogni $\theta \ge 0$, perché $s_j = 0$ e ${\boldsymbol A}_j' {\boldsymbol y} \le 0$ per definizione di $DRP(\pazocal{J})$. Per $j \notin \pazocal{J}$ abbiamo $s_j > 0$, e il vincolo limita $\theta$ solo quando ${\boldsymbol A}_j' {\boldsymbol y} > 0$.

!!! chiave ""

    La <strong>lunghezza del passo</strong> è

    $$
    \theta = \min \left\{~\frac{s_j}{{\boldsymbol A}_j' {\boldsymbol y}} ~:~ j \notin \pazocal{J}, ~ {\boldsymbol A}_j' {\boldsymbol y} > 0 ~\right\} ,
    \qquad \text{con} \qquad
    s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi} .
    $$

    Se ${\boldsymbol A}_j' {\boldsymbol y} \le 0$ per ogni $j \notin \pazocal{J}$, allora $\theta$ può crescere senza limite: il problema duale [(13.2)](#eq-PD_DUAL) è <strong>illimitato</strong> e, per il teorema sui possibili esiti di una coppia di problemi primale e duale, il problema primale [(13.1)](#eq-PD_PRIMAL) è <strong>inammissibile</strong>.

- L'indice $j^{\star}$ che realizza il minimo entra nell'insieme ammesso: dopo il passo, il suo scarto duale si annulla. Inoltre, ogni indice $j$ di una variabile <u>in base</u> della soluzione ottima di $RP(\pazocal{J})$ resta nell'insieme ammesso, perché ${\boldsymbol A}_j' {\boldsymbol y} = 0$ per le condizioni degli scarti complementari tra $RP(\pazocal{J})$ e $DRP(\pazocal{J})$. Solo gli indici $j \in \pazocal{J}$ con ${\boldsymbol A}_j' {\boldsymbol y} < 0$ possono uscire dall'insieme ammesso, perché il loro scarto duale diventa $-\theta \, {\boldsymbol A}_j' {\boldsymbol y} > 0$.

!!! chiave ""

    La soluzione duale ammissibile iniziale è spesso immediata. Se ${\boldsymbol c} \ge {\boldsymbol 0}$, allora ${\boldsymbol \pi} = {\boldsymbol 0}$ è ammissibile, con $\pazocal{J} = \{\, j : c_j = 0 \,\}$. Altrimenti, una soluzione duale ammissibile deve essere determinata in precedenza.

## 13.4 Pseudocodice del metodo primale-duale

!!! algoritmo "Algoritmo"

    - <strong>Input</strong>

        Un problema LP [(13.1)](#eq-PD_PRIMAL) con ${\boldsymbol b} \ge {\boldsymbol 0}$ e una soluzione ammissibile ${\boldsymbol \pi}$ del suo problema duale [(13.2)](#eq-PD_DUAL).

    - <strong>Output</strong>

        Una soluzione ottima del problema LP [(13.1)](#eq-PD_PRIMAL) e una soluzione ottima del suo problema duale, se esistono; altrimenti, un certificato di inammissibilità del problema LP [(13.1)](#eq-PD_PRIMAL).

    - **Passo 0:** <strong>Inizializzazione</strong>

        Considerare la soluzione duale ammissibile data ${\boldsymbol \pi}$. Andare al <u>Passo $1$</u>.

    - **Passo 1:** <strong>Insieme ammesso</strong>

        Calcolare gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ per ogni $j \in \{1,2,\dots,n\}$ e l'insieme ammesso $\pazocal{J} = \{\, j : s_j = 0 \,\}$.

    - **Passo 2:** <strong>Primale ristretto</strong>

        Risolvere $RP(\pazocal{J})$ con l'algoritmo del simplesso, ottenendo il suo valore ottimo $\xi(\pazocal{J})$, una soluzione ottima $x_j$ con $j \in \pazocal{J}$ e una soluzione ottima ${\boldsymbol y}$ di $DRP(\pazocal{J})$.

        <strong>Se</strong> $\xi(\pazocal{J}) = 0$, allora il punto

        $$
        \tilde x_j = x_j, ~ \forall j \in \pazocal{J},
        \qquad
        \tilde x_j = 0, ~ \forall j \notin \pazocal{J},
        $$

        è una soluzione ottima del problema LP [(13.1)](#eq-PD_PRIMAL), ${\boldsymbol \pi}$ è una soluzione ottima del suo problema duale, e ${\boldsymbol c}' \tilde{\boldsymbol x} = {\boldsymbol b}' {\boldsymbol \pi}$. <code>STOP</code>.

    - **Passo 3:** <strong>Passo duale</strong>

        - **a.** Se ${\boldsymbol A}_j' {\boldsymbol y} \le 0$ per ogni $j \notin \pazocal{J}$, allora il problema LP [(13.1)](#eq-PD_PRIMAL) è <strong>inammissibile</strong>. <code>STOP</code>.

        - **b.** Calcolare

            $$
            \theta \leftarrow \min \left\{~\frac{s_j}{{\boldsymbol A}_j' {\boldsymbol y}} ~:~ j \notin \pazocal{J}, ~ {\boldsymbol A}_j' {\boldsymbol y} > 0 ~\right\} .
            $$

        - **c.** Aggiornare la soluzione duale: $~{\boldsymbol \pi} \leftarrow {\boldsymbol \pi} + \theta \; {\boldsymbol y}$.

        Andare al <u>Passo $1$</u>.

!!! chiave ""

    A ogni iterazione il valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi}$ <u>aumenta strettamente</u>. La finitezza del metodo segue invece dai primali ristretti: la base ottima di $RP(\pazocal{J})$ è ancora una base ammissibile del primale ristretto successivo, perché i suoi indici restano ammessi, e la nuova variabile ammessa $x_{j^{\star}}$ ha costo ridotto negativo rispetto a essa. Di conseguenza, il primale ristretto successivo si può risolvere partendo da quella base, e i valori ottimi $\xi(\pazocal{J})$ <u>non aumentano mai</u> da un'iterazione alla successiva. Essi <u>diminuiscono strettamente</u> se l'operazione di pivot su $x_{j^{\star}}$ è non degenere, e in generale il metodo termina dopo un numero finito di iterazioni quando si usa una <strong>regola anti-ciclaggio</strong> (per esempio, la regola di Bland) nell'algoritmo del simplesso applicato ai primali ristretti.

## 13.5 Esecuzione del metodo primale-duale

- Consideriamo il seguente problema LP in forma standard di minimo con $n=4$ variabili non negative variabili e $m=2$ vincoli lineari di uguaglianza, che viene risolto negli esempi di questa sezione:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\min} & {2} \, {x_1} & {+} & {2} \, {x_2} & {+} & {5} \, {x_3} & {+} & {3} \, {x_4} \\[1ex]
    \text{soggetto a} & \, {x_1} & {+} & \, {x_2} & {+} & {2} \, {x_3} & {+} & \, {x_4} & {=} & {6} \\[1ex]
    & \, {x_1} & {+} & {2} \, {x_2} & {+} & \, {x_3} & {+} & {3} \, {x_4} & {=} & {4} \\[1ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & { \ge} & {0}
    \end{array}
    $$

    Il suo vettore dei termini noti è non negativo e il suo vettore dei costi è non negativo, quindi ${\boldsymbol \pi} = (0~~0)'$ è una soluzione ammissibile del problema duale.

<a id="box-4-ex-pd-1"></a>

!!! esempio "Esempio 13.1: metodo primale-duale – prima iterazione"

    Con ${\boldsymbol \pi} = (0~~0)'$ gli scarti duali sono

    $$
    s_1 = 2, \qquad s_2 = 2, \qquad s_3 = 5, \qquad s_4 = 3 ,
    $$

    quindi l'insieme ammesso è $\pazocal{J} = \emptyset$: nessuna variabile primale può essere positiva.

    Il primale ristretto ha solo le due variabili artificiali, il suo valore ottimo è

    $$
    \xi(\emptyset) = a_1 + a_2 = 6 + 4 = 10 > 0 ,
    $$

    e la soluzione ottima di $DRP(\emptyset)$ è ${\boldsymbol y} = (1~~1)'$.

    La lunghezza del passo è determinata dalle quattro colonne non ammesse:

    $$
    {\boldsymbol A}_1' {\boldsymbol y} = 2, \qquad
    {\boldsymbol A}_2' {\boldsymbol y} = 3, \qquad
    {\boldsymbol A}_3' {\boldsymbol y} = 3, \qquad
    {\boldsymbol A}_4' {\boldsymbol y} = 4 ,
    $$

    $$
    \theta = \min \left\{~\underbrace{\frac{2}{2}}_{= \, 1},~\underbrace{\frac{2}{3}}_{= \, \frac{2}{3}},~\underbrace{\frac{5}{3}}_{= \, \frac{5}{3}},~\underbrace{\frac{3}{4}}_{= \, \frac{3}{4}}~\right\} = \frac{2}{3} ,
    $$

    realizzato da $j^{\star} = 2$. La nuova soluzione duale è

    $$
    {\boldsymbol \pi} \leftarrow (0~~0)' + \frac{2}{3} \, (1~~1)' = \left(\frac{2}{3}~~\frac{2}{3}\right)' ,
    $$

    con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = \frac{20}{3}$.

<a id="box-5-ex-pd-2"></a>

!!! esempio "Esempio 13.2: metodo primale-duale – seconda iterazione"

    Con ${\boldsymbol \pi} = \left(\frac{2}{3}~~\frac{2}{3}\right)'$ gli scarti duali sono

    $$
    s_1 = \frac{2}{3}, \qquad s_2 = 0, \qquad s_3 = 3, \qquad s_4 = \frac{1}{3} ,
    $$

    quindi $\pazocal{J} = \{2\}$.

    Il primale ristretto $RP(\{2\})$ ha la variabile $x_2$ e le due variabili artificiali. La sua soluzione ottima è $x_2 = 2$, con

    $$
    \xi(\{2\}) = 4 > 0 ,
    $$

    e la soluzione ottima di $DRP(\{2\})$ è ${\boldsymbol y} = \left(1~~-\frac{1}{2}\right)'$.

    Per le colonne non ammesse abbiamo

    $$
    {\boldsymbol A}_1' {\boldsymbol y} = \frac{1}{2}, \qquad
    {\boldsymbol A}_3' {\boldsymbol y} = \frac{3}{2}, \qquad
    {\boldsymbol A}_4' {\boldsymbol y} = -\frac{1}{2} ,
    $$

    e solo le prime due sono positive:

    $$
    \theta = \min \left\{~\underbrace{\frac{2/3}{1/2}}_{= \, \frac{4}{3}},~\underbrace{\frac{3}{3/2}}_{= \, 2}~\right\} = \frac{4}{3} ,
    $$

    realizzato da $j^{\star} = 1$. La nuova soluzione duale è

    $$
    {\boldsymbol \pi} \leftarrow \left(\frac{2}{3}~~\frac{2}{3}\right)' + \frac{4}{3} \left(1~~-\frac{1}{2}\right)' = (2~~0)' ,
    $$

    con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 12$.

<a id="box-6-ex-pd-3"></a>

!!! esempio "Esempio 13.3: metodo primale-duale – terza iterazione"

    Con ${\boldsymbol \pi} = (2~~0)'$ gli scarti duali sono

    $$
    s_1 = 0, \qquad s_2 = 0, \qquad s_3 = 1, \qquad s_4 = 1 ,
    $$

    quindi $\pazocal{J} = \{1,~2\}$.

    Il primale ristretto $RP(\{1,2\})$ ha le variabili $x_1$ e $x_2$ e le due variabili artificiali. La sua soluzione ottima è $x_1 = 4$ e $x_2 = 0$, con

    $$
    \xi(\{1,2\}) = 2 > 0 ,
    $$

    e la soluzione ottima di $DRP(\{1,2\})$ è ${\boldsymbol y} = (1~~-1)'$.

    Per le colonne non ammesse abbiamo

    $$
    {\boldsymbol A}_3' {\boldsymbol y} = 1
    \qquad {\rm e} \qquad
    {\boldsymbol A}_4' {\boldsymbol y} = -2 ,
    $$

    quindi

    $$
    \theta = \frac{s_3}{{\boldsymbol A}_3' {\boldsymbol y}} = \frac{1}{1} = 1 ,
    $$

    realizzato da $j^{\star} = 3$. La nuova soluzione duale è

    $$
    {\boldsymbol \pi} \leftarrow (2~~0)' + 1 \cdot (1~~-1)' = (3~~-1)' ,
    $$

    con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 14$. La seconda variabile variabile è diventata <u>negativa</u>: ciò è consentito, perché le variabili duali di [(13.2)](#eq-PD_DUAL) sono libere.

<a id="box-7-ex-pd-4"></a>

!!! esempio "Esempio 13.4: metodo primale-duale – quarta iterazione"

    Con ${\boldsymbol \pi} = (3~~-1)'$ gli scarti duali sono

    $$
    s_1 = 0, \qquad s_2 = 1, \qquad s_3 = 0, \qquad s_4 = 3 ,
    $$

    quindi $\pazocal{J} = \{1,~3\}$.

    Il primale ristretto $RP(\{1,3\})$ ha le variabili $x_1$ e $x_3$ e le due variabili artificiali. La sua soluzione ottima è $x_1 = 2$ e $x_3 = 2$, con

    $$
    \xi(\{1,3\}) = 0 .
    $$

    Il valore ottimo del primale ristretto è $0$, quindi il metodo si arresta. Una soluzione ottima di questo problema LP è

    $$
    \tilde{\boldsymbol x}(\, LP \,) =
    \begin{pmatrix}
    2 \\ 0 \\ 2 \\ 0
    \end{pmatrix} ,
    $$

    una soluzione ottima del suo problema duale è $\tilde{\boldsymbol \pi}(\, D(LP) \,) = (3~~-1)'$, e i due valori ottimi coincidono:

    $$
    {\boldsymbol c}' \tilde{\boldsymbol x} = 2 \cdot 2 + 5 \cdot 2 = 14
    \qquad {\rm e} \qquad
    {\boldsymbol b}' \tilde{\boldsymbol \pi} = 6 \cdot 3 + 4 \cdot (-1) = 14 ,
    $$

    in accordo con il teorema della dualità forte.

!!! chiave ""

    Il valore obiettivo duale è aumentato a ogni iterazione,

    $$
    0 ~ \longrightarrow ~ \frac{20}{3} ~ \longrightarrow ~ 12 ~ \longrightarrow ~ 14 ,
    $$

    e l'insieme ammesso è cambiato di conseguenza,

    $$
    \emptyset ~ \longrightarrow ~ \{2\} ~ \longrightarrow ~ \{1,2\} ~ \longrightarrow ~ \{1,3\} ,
    $$

    finché non ha contenuto abbastanza variabili per costruire una soluzione primale ammissibile. L'insieme ammesso <u>non</u> cresce necessariamente: alla quarta iterazione l'indice $2$ ne è uscito, perché ${\boldsymbol A}_2' {\boldsymbol y} = -1 < 0$ alla terza iterazione.

## 13.6 Confronto con gli algoritmi del simplesso

!!! chiave ""

    <div class="tabella" markdown="0"><table>
    <tr>
    <th></th>
    <th><strong>mantiene</strong></th>
    <th><strong>procede verso</strong></th>
    </tr>
    <tr>
    <td>simplesso</td>
    <td>base primale ammissibile</td>
    <td>ammissibilità duale</td>
    </tr>
    <tr>
    <td>simplesso duale</td>
    <td>base duale ammissibile</td>
    <td>ammissibilità primale</td>
    </tr>
    <tr>
    <td>metodo primale-duale</td>
    <td><u>soluzione</u> duale ammissibile</td>
    <td>ammissibilità primale</td>
    </tr>
    </table></div>

    La differenza tra l'algoritmo del simplesso duale e il metodo primale-duale è che il primo mantiene una <strong>base</strong> duale ammissibile, mentre il secondo mantiene una <strong>soluzione</strong> duale ammissibile, che non deve essere di base. Per questo motivo il metodo primale-duale può partire da qualunque soluzione duale ammissibile, anche una suggerita dalla struttura del problema.

- L'interesse pratico del metodo primale-duale è che il primale ristretto [(13.3)](#eq-PD_RP) è spesso molto più facile del problema LP originale: ha meno variabili e, per diversi problemi di <strong>ottimizzazione combinatoria</strong> risulta essere un problema con un algoritmo combinatorio noto, come un problema di cammino minimo o di flusso massimo. In questi casi il metodo primale-duale diventa un algoritmo puramente combinatorio, ed è all'origine di molti algoritmi classici e di diversi algoritmi di approssimazione.
