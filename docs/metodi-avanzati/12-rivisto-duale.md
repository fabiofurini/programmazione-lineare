---
title: "Algoritmo del simplesso duale rivisto"
---

# Algoritmo del simplesso duale rivisto

<div class="info-capitolo" markdown>

**Parte 4 · Metodi matriciali, sensitività e geometria · Capitolo 12** · [:material-file-pdf-box: Dispensa, volume 4 (PDF)](../pdf/dispensa-4-metodi-avanzati.pdf) · [:material-pencil: Esercizi](../esercizi/es-12-rivisto-duale.md)

</div>

## 12.1 Operazioni di pivot con due sistemi di equazioni lineari

- Consideriamo un problema LP in forma standard di massimo con $n+m$ variabili non negative e $m$ vincoli lineari di uguaglianza:

    <a id="eq-RDS_FORM_STANDARD"></a>

    \begin{align*}
    &&   \max \;\;{\boldsymbol c}' \, {\boldsymbol x}  \label{RDS_FORM_STANDARD_OBJ} \tag{12.1a}\\[2ex]
    && \text{soggetto a} \quad  {\boldsymbol A} \; {\boldsymbol x}  &= {\boldsymbol b},  & \phantom{j=1111}  \label{RDS_FORM_STANDARD_CONS1} \tag{12.1b}\\[2ex]
    && {\boldsymbol x}                        &\ge  {\boldsymbol 0}. \label{RDS_FORM_STANDARD_CONS2} \tag{12.1c}
    \end{align*}

- L'algoritmo del simplesso duale parte da una base <strong>duale ammissibile</strong>, cioè una base il cui dizionario soddisfa $\bar{\boldsymbol c} \le {\boldsymbol 0}$, ed esegue operazioni di pivot duali finché la soluzione di base non diventa ammissibile.

- Come l'algoritmo del simplesso rivisto rispetto all'algoritmo del simplesso, anche l'<strong>algoritmo del simplesso duale rivisto</strong> non calcola mai la matrice inversa ${\boldsymbol A}_{\pazocal{B}}^{-1}$ e non aggiorna mai l'intero dizionario: a ogni iterazione determina tutte le informazioni necessarie a un'operazione di pivot duale risolvendo <strong>due sistemi di equazioni lineari</strong>, entrambi con la stessa matrice ${\boldsymbol A}_{\pazocal{B}}$.

- **1.** <strong>Primo sistema di equazioni lineari</strong>

    - L'algoritmo del simplesso duale ha bisogno dei valori delle variabili in base, per determinare la riga pivot. Sono le componenti del vettore colonna $\bar{\boldsymbol b} = {\boldsymbol A}_{\pazocal{B}}^{-1} \, {\boldsymbol b}$, che si trova risolvendo il seguente sistema di equazioni lineari:

        $$
        {\boldsymbol  A}_{\pazocal{B}} \; \bar{\boldsymbol b} = {\boldsymbol b}
        ~~~\Longrightarrow~~~
        \bar{\boldsymbol b} = \red{{\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b}}
        \text{       dove       }
        \bar{\boldsymbol b} = (\bar b_{i})_{i \in \pazocal{B}} .
        $$

- **2.** <strong>Secondo sistema di equazioni lineari</strong>

    - Una volta determinata la riga pivot $x_r$ con $r \in \pazocal{B}$, il test dei rapporti ha bisogno della <u>riga</u> della matrice $\bar{\boldsymbol A}$ associata a $x_r$, cioè dei valori $\bar{a}_{rj}$ per $j \in \pazocal{N}$. Questa riga si ottiene dal vettore riga ${\boldsymbol  u} \in \R^{1 \times m}$, che si trova risolvendo il seguente sistema di equazioni lineari:

        $$
        {\boldsymbol  u} \; {\boldsymbol  A}_{\pazocal{B}} = {\boldsymbol  e}'_{r}
        ~~~\Longrightarrow~~~
        {\boldsymbol  u} = \violet{{\boldsymbol  e}'_{r} \; {\boldsymbol  A}_{\pazocal{B}}^{-1}} ,
        $$

        dove ${\boldsymbol  e}_{r}$ è il vettore colonna di $m$ componenti, tutte uguali a $0$ tranne quella associata alla variabile in base $x_r$, che è uguale a $1$. La riga cercata è quindi

        $$
        \bar{a}_{rj} = {\boldsymbol  u} \; {\boldsymbol  A}_{j} , \qquad \forall j \in \pazocal{N} .
        $$

!!! chiave ""

    I due sistemi di equazioni lineari hanno la <u>stessa</u> matrice ${\boldsymbol A}_{\pazocal{B}}$: il primo la ha a sinistra del vettore incognito, il secondo alla sua destra. Il vettore ${\boldsymbol u}$ seleziona la riga di $\bar{\boldsymbol A}$ associata alla riga pivot, senza calcolare l'intera matrice $\bar{\boldsymbol A}$.

## 12.2 Aggiornamento dei costi ridotti

- Il test dei rapporti ha bisogno dei costi ridotti $\bar{c}_j$ con $j \in \pazocal{N}$. Questi <u>non</u> vengono ricalcolati a ogni iterazione: vengono <strong>aggiornati</strong>, esattamente come l'algoritmo del simplesso rivisto aggiorna i valori delle variabili in base, e l'aggiornamento usa solo la riga $\bar{a}_{rj}$ già determinata dal secondo sistema.

- Alla prima iterazione la base è quella delle $m$ variabili di scarto, e quindi ${\boldsymbol A}_{\pazocal{B}} = {\boldsymbol I}$ e ${\boldsymbol c}_{\pazocal{B}} = {\boldsymbol 0}$, da cui

    $$
    \bar{c}_j = c_j , \qquad \forall j \in \pazocal{N} .
    $$

!!! chiave ""

    Dopo un'operazione di pivot duale con riga pivot $x_r$ e colonna pivot $x_p$, i costi ridotti vengono aggiornati come segue:

    $$
    \bar{c}_j \; \longleftarrow \; \bar{c}_j - \frac{\bar{c}_p}{\bar{a}_{rp}} \; \bar{a}_{rj} ,
    \qquad \forall j \in \pazocal{N} \setminus \{p\} ,
    \qquad {\rm e} \qquad
    \bar{c}_r \; \longleftarrow \; - \, \frac{\bar{c}_p}{\bar{a}_{rp}} ,
    $$

    dove $\bar{c}_r$ è il costo ridotto della variabile $x_r$, che esce dalla base e diventa fuori base.

- La quantità $\frac{\bar{c}_p}{\bar{a}_{rp}}$ è esattamente il minimo del test dei rapporti, che è già stato calcolato per determinare la colonna pivot. L'aggiornamento è quindi una sola moltiplicazione per uno scalare della riga $\bar{a}_{rj}$, e costa $n$ operazioni.

- Poiché $\frac{\bar{c}_p}{\bar{a}_{rp}} \le \frac{\bar{c}_j}{\bar{a}_{rj}}$ per ogni $j \in \pazocal{N}$ con $\bar{a}_{rj} < 0$, i costi ridotti aggiornati restano non positivi: la base resta <strong>duale ammissibile</strong>, come richiesto.

!!! chiave ""

    I due algoritmi rivisti sono perfettamente simmetrici: ciascuno risolve <strong>due</strong> sistemi di equazioni lineari per iterazione, uno con ${\boldsymbol A}_{\pazocal{B}}$ a destra del vettore incognito e uno con ${\boldsymbol A}_{\pazocal{B}}$ alla sua sinistra, e <strong>aggiorna</strong> l'altro vettore invece di ricalcolarlo.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th></th>
    <th><strong>simplesso rivisto</strong></th>
    <th><strong>simplesso duale rivisto</strong></th>
    </tr>
    <tr>
    <td>primo sistema</td>
    <td><span class="arithmatex">\({\boldsymbol \pi} \, {\boldsymbol A}_{\pazocal{B}} = {\boldsymbol c}'_{\pazocal{B}}\)</span></td>
    <td><span class="arithmatex">\({\boldsymbol A}_{\pazocal{B}} \, \bar{\boldsymbol b} = {\boldsymbol b}\)</span></td>
    </tr>
    <tr>
    <td>fornisce</td>
    <td>i costi ridotti <span class="arithmatex">\(\bar{\boldsymbol c}\)</span></td>
    <td>i valori in base <span class="arithmatex">\(\bar{\boldsymbol b}\)</span></td>
    </tr>
    <tr>
    <td>serve a scegliere</td>
    <td>la <u>colonna</u> pivot</td>
    <td>la <u>riga</u> pivot</td>
    </tr>
    <tr>
    <td>secondo sistema</td>
    <td><span class="arithmatex">\({\boldsymbol A}_{\pazocal{B}} \, {\boldsymbol d} = {\boldsymbol A}_{p}\)</span></td>
    <td><span class="arithmatex">\({\boldsymbol u} \, {\boldsymbol A}_{\pazocal{B}} = {\boldsymbol e}'_{r}\)</span></td>
    </tr>
    <tr>
    <td>fornisce</td>
    <td>la <u>colonna</u> <span class="arithmatex">\(\bar{\boldsymbol A}_p\)</span></td>
    <td>la <u>riga</u> <span class="arithmatex">\(\bar{a}_{r\cdot}\)</span></td>
    </tr>
    <tr>
    <td>serve per</td>
    <td>il test dei rapporti</td>
    <td>il test dei rapporti</td>
    </tr>
    <tr>
    <td>aggiornato, non ricalcolato</td>
    <td><span class="arithmatex">\(\bar{\boldsymbol b}\)</span></td>
    <td><span class="arithmatex">\(\bar{\boldsymbol c}\)</span></td>
    </tr>
    </table></div>

## 12.3 Pseudocodice dell'algoritmo del simplesso duale rivisto

!!! algoritmo "Algoritmo"

    - <strong>Input</strong>

        Un problema LP [(12.1)](#eq-RDS_FORM_STANDARD) ottenuto da un problema LP in forma canonica di massimo con ${\boldsymbol c} \le {\boldsymbol 0}$ aggiungendo le $m$ variabili di scarto, in modo che la base delle variabili di scarto sia <strong>duale ammissibile</strong>.

    - <strong>Output</strong>

        Una soluzione ottima del problema LP [(12.1)](#eq-RDS_FORM_STANDARD), se esiste; altrimenti, un certificato che il problema LP è inammissibile.

    - **Passo 0:** <strong>Inizializzazione</strong>

        Considerare la base delle $m$ variabili di scarto, per la quale ${\boldsymbol A}_{\pazocal{B}} = {\boldsymbol I}$ e $\bar{c}_j = c_j \le 0$ per ogni $j \in \pazocal{N}$, cioè la base è duale ammissibile. Andare al <u>Passo $1$</u>.

    - **Passo 1:** <strong>Test di ammissibilità</strong>

        - **a.** Risolvere ${\boldsymbol  A}_{\pazocal{B}} \; \bar{\boldsymbol b} = {\boldsymbol b}$ per calcolare $\bar{\boldsymbol b} = {\boldsymbol  A}_{\pazocal{B}}^{-1} \, {\boldsymbol b}$.

        <strong>Se</strong> $\bar{\boldsymbol b} \ge {\boldsymbol 0}$, allora la soluzione di base ammissibile ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è una soluzione ottima, di valore ottimo ${\bar{z}} = {\boldsymbol c}'_{\pazocal{B}} \; \bar{\boldsymbol b}$. <code>STOP</code>. <strong>Altrimenti</strong> andare al <u>Passo $2$</u>.

    - **Passo 2:** <strong>Operazioni di pivot duali</strong>

        La <strong>riga pivot</strong> è la variabile in base $x_r$ con l'<u>indice minimo</u> $r \in \pazocal{B}$ tra quelle con $\bar{b}_{r} < 0$.

        - **a.** Risolvere ${\boldsymbol  u} \; {\boldsymbol  A}_{\pazocal{B}} = {\boldsymbol  e}'_{r}$ e calcolare $\bar{a}_{rj} = {\boldsymbol  u} \; {\boldsymbol  A}_{j}$ per ogni $j \in \pazocal{N}$.

        - **b.** Se $\bar{a}_{rj} \ge 0$ per ogni $j \in \pazocal{N}$, allora il problema LP [(12.1)](#eq-RDS_FORM_STANDARD) è <strong>inammissibile</strong>. <code>STOP</code>.

        - **c.** Determinare la <strong>colonna pivot</strong>, cioè una variabile fuori base $x_p$ con $p \in \pazocal{N}$ tale che

            $$
            \frac{\bar{c}_p}{\bar{a}_{rp}}
            = \min \left\{~\frac{\bar c_j}{\bar a_{rj}}: j\in\pazocal{N},~\bar a_{rj}<0 ~\right\} ;
            $$

            in caso di pareggio, si sceglie la variabile fuori base con l'indice minimo.

        - **d.** Aggiornare i costi ridotti:

            $$
            \bar{c}_j \leftarrow \bar{c}_j - \frac{\bar{c}_p}{\bar{a}_{rp}} \; \bar{a}_{rj},
            ~~ \forall j \in \pazocal{N} \setminus \{p\} ,
            \qquad {\rm e} \qquad
            \bar{c}_r \leftarrow - \, \frac{\bar{c}_p}{\bar{a}_{rp}} .
            $$

        - **e.** Aggiornare la base con la nuova partizione degli indici delle variabili:

            $$
            \pazocal{B} \leftarrow \big(\pazocal{B} \setminus \{ r \} \big) \cup \{ p \}
            {\rm ~~~e~~~}
            \pazocal{N} \leftarrow \big(\pazocal{N} \setminus \{ p \} \big) \cup \{ r \} .
            $$

        Andare al <u>Passo $1$</u>.

!!! chiave ""

    L'algoritmo del simplesso duale rivisto <u>non</u> aggiorna il dizionario: a ogni iterazione aggiorna solo la partizione $\pazocal{B}$ e $\pazocal{N}$ e i costi ridotti $\bar{\boldsymbol c}$, e ricalcola $\bar{\boldsymbol b}$ e la riga $\bar{a}_{r\cdot}$ risolvendo i due sistemi di equazioni lineari.

## 12.4 Esecuzione dell'algoritmo del simplesso duale rivisto

- Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili non negative e $m=3$ vincoli lineari di minore o uguale, che viene risolto negli esempi di questa sezione:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {-} \, {x_1} & {-} & {3} \, {x_2} \\[1.5ex]
    \text{soggetto a} & {-} \, {x_1} & {-} & {2}\, {x_2} & {\le} & {-6} \\[1.5ex]
    & \, {x_1} & {-} & {4} \, {x_2} & {\le} & {-6} \\[1.5ex]
    & {2} \, {x_1} & {-} & {2} \, {x_2} & {\le} & {3} \\[1.5ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

- Aggiungendo $m=3$ variabili di scarto otteniamo la sua forma standard di massimo, con

    $$
    {\boldsymbol  c}=
    \begin{pmatrix}
    -1 \\[0.5ex]
    -3 \\[0.5ex]
    0  \\[0.5ex]
    0  \\[0.5ex]
    0
    \end{pmatrix}
    \quad
    {\boldsymbol  A}=
    \begin{pmatrix}
    -1 & -2 & 1 & 0 & 0\\[1ex]
    1 & -4 & 0 & 1 & 0\\[1ex]
    2 & -2 & 0 & 0 & 1\\
    \end{pmatrix}
    \quad
    {\boldsymbol b}=
    \begin{pmatrix}
    -6 \\[1ex]
    -6 \\[1ex]
    3 \\
    \end{pmatrix}
    $$

    Poiché ${\boldsymbol c} \le {\boldsymbol 0}$, la partizione $\pazocal{B}= \{3,~~4,~~5\}$ e $\pazocal{N}= \{1,~~2\}$ è <strong>duale ammissibile</strong>, con costi ridotti $\bar{c}_1 = c_1 = -1$ e $\bar{c}_2 = c_2 = -3$.

<a id="box-1-ex-rds-1"></a>

!!! esempio "Esempio 12.1: algoritmo del simplesso duale rivisto – prima iterazione"

    Con $\pazocal{B}= \{3,~~4,~~5\}$ e $\pazocal{N}= \{1,~~2\}$ abbiamo ${\boldsymbol  A}_{\pazocal{B}} = {\boldsymbol I}$, e i costi ridotti sono $\bar{c}_1 = -1$ e $\bar{c}_2 = -3$.

    <strong>Primo sistema.</strong> Risolviamo ${\boldsymbol  A}_{\pazocal{B}} \; \bar{\boldsymbol b} = {\boldsymbol b}$:

    $$
    \begin{pmatrix}
    1 & 0 & 0\\
    0 & 1 & 0\\
    0 & 0 & 1\\
    \end{pmatrix}
    \bar{\boldsymbol b}
    =
    \begin{pmatrix}
    -6 \\ -6 \\ 3
    \end{pmatrix}
    \qquad \Longrightarrow \qquad
    \bar{\boldsymbol b}
    =
    \begin{pmatrix}
    -6 \\ -6 \\ 3
    \end{pmatrix}
    $$

    Poiché $\bar b_3 = -6 < 0$, la base non è primale ammissibile. Tra $x_3$ e $x_4$, entrambe con valore $-6$, scegliamo quella con l'indice minimo, $x_3$, come <strong>riga pivot</strong>.

    <strong>Secondo sistema.</strong> La variabile in base $x_3$ è la prima di $\pazocal{B}$, e quindi ${\boldsymbol  e}_{3} = (1~~0~~0)'$. Risolviamo ${\boldsymbol  u} \; {\boldsymbol  A}_{\pazocal{B}} = {\boldsymbol  e}'_{3}$ e otteniamo ${\boldsymbol  u} = (1~~0~~0)$. La riga di $\bar{\boldsymbol A}$ associata a $x_3$ è quindi

    $$
    \bar{a}_{31} = {\boldsymbol  u} \; {\boldsymbol  A}_{1} = -1
    \qquad {\rm e} \qquad
    \bar{a}_{32} = {\boldsymbol  u} \; {\boldsymbol  A}_{2} = -2 ,
    $$

    entrambi negativi, e quindi il problema LP non risulta inammissibile.

    <strong>Test dei rapporti.</strong> Entrambe le variabili fuori base sono candidate:

    $$
    \min \left\{~\underbrace{\frac{-1}{-1}}_{= \, 1},~\underbrace{\frac{-3}{-2}}_{= \, \frac{3}{2}}~\right\} = 1 ,
    $$

    e quindi la <strong>colonna pivot</strong> è $x_1$.

    <strong>Aggiornamento dei costi ridotti.</strong> Con $\frac{\bar{c}_1}{\bar{a}_{31}} = 1$ otteniamo

    $$
    \bar{c}_2 \leftarrow \bar{c}_2 - 1 \cdot \bar{a}_{32} = -3 - 1 \cdot (-2) = -1
    \qquad {\rm e} \qquad
    \bar{c}_3 \leftarrow - \, 1 = -1 .
    $$

    La nuova partizione è $\pazocal{B}= \{1,~~4,~~5\}$ e $\pazocal{N}= \{2,~~3\}$.

<a id="box-2-ex-rds-2"></a>

!!! esempio "Esempio 12.2: algoritmo del simplesso duale rivisto – seconda iterazione"

    Con $\pazocal{B}= \{1,~~4,~~5\}$ e $\pazocal{N}= \{2,~~3\}$ abbiamo

    $$
    {\boldsymbol  A}_{\pazocal{B}}=
    \begin{pmatrix}
    -1 & 0 & 0\\
    1 & 1 & 0\\
    2 & 0 & 1\\
    \end{pmatrix} ,
    $$

    e i costi ridotti, aggiornati all'iterazione precedente, sono $\bar{c}_2 = -1$ e $\bar{c}_3 = -1$.

    <strong>Primo sistema.</strong> Risolviamo ${\boldsymbol  A}_{\pazocal{B}} \; \bar{\boldsymbol b} = {\boldsymbol b}$, cioè

    $$
    \begin{cases}
    - \bar b_1 = -6\\[1ex]
    \bar b_1 + \bar b_4 = -6\\[1ex]
    2 \, \bar b_1 + \bar b_5 = 3
    \end{cases}
    \qquad \Longrightarrow \qquad
    \bar{\boldsymbol b}
    =
    \begin{pmatrix}
    6 \\ -12 \\ -9
    \end{pmatrix} .
    $$

    Due variabili in base hanno valore negativo. Scegliamo quella con l'indice minimo, $x_4$, come <strong>riga pivot</strong>.

    <strong>Secondo sistema.</strong> La variabile in base $x_4$ è la seconda di $\pazocal{B}$, e quindi ${\boldsymbol  e}_{4} = (0~~1~~0)'$. Risolviamo ${\boldsymbol  u} \; {\boldsymbol  A}_{\pazocal{B}} = {\boldsymbol  e}'_{4}$, cioè

    $$
    \begin{cases}
    - u_1 + u_2 + 2 \, u_3 = 0\\[1ex]
    u_2 = 1\\[1ex]
    u_3 = 0
    \end{cases}
    \qquad \Longrightarrow \qquad
    {\boldsymbol  u} = (1~~1~~0) ,
    $$

    e la riga di $\bar{\boldsymbol A}$ associata a $x_4$ è

    $$
    \bar{a}_{42} = {\boldsymbol  u} \; {\boldsymbol  A}_{2} = -2 - 4 = -6
    \qquad {\rm e} \qquad
    \bar{a}_{43} = {\boldsymbol  u} \; {\boldsymbol  A}_{3} = 1 .
    $$

    <strong>Test dei rapporti.</strong> L'unica candidata è $x_2$, poiché $\bar{a}_{42} = -6 < 0$ mentre $\bar{a}_{43} = 1 \ge 0$:

    $$
    \frac{\bar{c}_2}{\bar{a}_{42}} = \frac{-1}{-6} = \frac{1}{6} ,
    $$

    e quindi la <strong>colonna pivot</strong> è $x_2$.

    <strong>Aggiornamento dei costi ridotti.</strong> Con $\frac{\bar{c}_2}{\bar{a}_{42}} = \frac{1}{6}$ otteniamo

    $$
    \bar{c}_3 \leftarrow \bar{c}_3 - \frac{1}{6} \cdot \bar{a}_{43} = -1 - \frac{1}{6} = - \, \frac{7}{6}
    \qquad {\rm e} \qquad
    \bar{c}_4 \leftarrow - \, \frac{1}{6} .
    $$

    La nuova partizione è $\pazocal{B}= \{1,~~2,~~5\}$ e $\pazocal{N}= \{3,~~4\}$.

<a id="box-3-ex-rds-3"></a>

!!! esempio "Esempio 12.3: algoritmo del simplesso duale rivisto – terza iterazione"

    Con $\pazocal{B}= \{1,~~2,~~5\}$ e $\pazocal{N}= \{3,~~4\}$ abbiamo

    $$
    {\boldsymbol  A}_{\pazocal{B}}=
    \begin{pmatrix}
    -1 & -2 & 0\\
    1 & -4 & 0\\
    2 & -2 & 1\\
    \end{pmatrix} ,
    $$

    e i costi ridotti sono $\bar{c}_3 = - \frac{7}{6}$ e $\bar{c}_4 = - \frac{1}{6}$.

    <strong>Primo sistema.</strong> Risolviamo ${\boldsymbol  A}_{\pazocal{B}} \; \bar{\boldsymbol b} = {\boldsymbol b}$, cioè

    $$
    \begin{cases}
    - \bar b_1 - 2 \, \bar b_2 = -6\\[1ex]
    \bar b_1 - 4 \, \bar b_2 = -6\\[1ex]
    2 \, \bar b_1 - 2 \, \bar b_2 + \bar b_5 = 3
    \end{cases}
    \qquad \Longrightarrow \qquad
    \bar{\boldsymbol b}
    =
    \begin{pmatrix}
    2 \\ 2 \\ 3
    \end{pmatrix} .
    $$

    Ora $\bar{\boldsymbol b} \ge {\boldsymbol 0}$: la base è primale ammissibile e duale ammissibile, e quindi è <strong>ottima</strong>. Non serve risolvere altri sistemi: il valore ottimo è il prodotto scalare

    $$
    \bar{z} = {\boldsymbol c}'_{\pazocal{B}} \; \bar{\boldsymbol b}
    = (-1) \cdot 2 + (-3) \cdot 2 + 0 \cdot 3 = -8 .
    $$

    Una soluzione ottima di questo problema LP è

    $$
    \tilde{\boldsymbol x}(\, LP \,) =
    \begin{pmatrix}
    2 \\[0.5ex]
    2
    \end{pmatrix}
    $$

    e il valore ottimo è $z(\, LP \,) = -8$.

    !!! chiave ""

        Se è richiesta anche la soluzione ottima del <strong>problema duale</strong>, la si ottiene con un ulteriore sistema di equazioni lineari, risolto <u>una sola volta</u> alla fine e non a ogni iterazione:

        $$
        {\boldsymbol  \pi} \; {\boldsymbol  A}_{\pazocal{B}} = {\boldsymbol c}'_{\pazocal{B}}
        \qquad \Longrightarrow \qquad
        {\boldsymbol  \pi} = \left(\frac{7}{6}~~\frac{1}{6}~~0\right) ,
        $$

        cioè $\tilde{\boldsymbol \pi}(\, D(LP) \,) = \left(\frac{7}{6}~~\frac{1}{6}~~0\right)'$, il cui valore obiettivo è ${\boldsymbol b}' \tilde{\boldsymbol \pi} = -8 = z(\, LP \,)$, in accordo con il teorema della dualità forte.
