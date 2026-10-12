---
title: "Condizioni di ottimalità e regole di pivot"
---

# Condizioni di ottimalità e regole di pivot

<div class="info-capitolo" markdown>

**Parte 2 · L'algoritmo del simplesso · Capitolo 7** · [:material-file-pdf-box: Dispensa, volume 2 (PDF)](../pdf/dispensa-2-simplesso.pdf) · [:material-pencil: Esercizi: Condizioni di ottimalità e regole di pivot](../esercizi/es-07-ottimalita-pivot.md)

</div>

## 7.1 Condizioni sufficienti di ottimalità

- Consideriamo un problema LP in forma standard di massimo con $n+m$ variabili non negative e $m$ vincoli lineari di uguaglianza, ottenuto da un problema LP in forma canonica di massimo con $n$ variabili non negative e $m$ vincoli lineari di minore o uguale aggiungendo $m$ variabili di scarto non negative:

    <a id="eq-FORM_STANDARD"></a>

    \begin{align*}
    &&   \max \;\;{\boldsymbol c}' \, {\boldsymbol x}  \label{FORM_STANDARD_OBJ} \tag{7.1a}\\[2ex]
    && \text{soggetto a} \quad  {\boldsymbol A} \; {\boldsymbol x}  &= {\boldsymbol b},  & \phantom{j=1111}  \label{FORM_STANDARD_CONS1} \tag{7.1b}\\[2ex]
    && {\boldsymbol x}                        &\ge  {\boldsymbol 0}. \label{FORM_STANDARD_CONS2} \tag{7.1c}
    \end{align*}

<a id="box-1-theo-pivot-1"></a>

!!! teorema "Teorema 7.1: condizioni sufficienti di ottimalità"

    Data una base ${\boldsymbol  A}_{\pazocal{B}}$ del problema LP [(7.1)](#eq-FORM_STANDARD), se $~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0}~$ e $~{ \bar{\boldsymbol c}} \le {\boldsymbol 0}~$ allora ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è una soluzione ottima e ${\boldsymbol c}'_{\pazocal{B}} \;  \bar{\boldsymbol b}$ è il valore ottimo.

??? dimostrazione "Dimostrazione"

    Data una base ${\boldsymbol  A}_{\pazocal{B}}$ del problema LP [(7.1)](#eq-FORM_STANDARD), se $~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0}~$ allora ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è una soluzione ammissibile. Se ${ ~\bar{\boldsymbol c}} \le {\boldsymbol 0}~$, per ogni soluzione ammissibile ${\boldsymbol x}$ abbiamo:

    \begin{align*}
    {\boldsymbol c}' \; {\boldsymbol x}
    &~~=~~
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  x}_{\pazocal{B}} + {\boldsymbol c}'_{\pazocal{N}} \;{{\boldsymbol  x}_{\pazocal{N}}}
    ~~=~~
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b} + \underbrace{ \bar{\boldsymbol c}'}_{\le {\boldsymbol 0}} \; \underbrace{{{\boldsymbol  x}_{\pazocal{N}}}}_{\ge {\boldsymbol 0}} \\
    &~~ \le ~~
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b}
    ~~ = ~~
    {\boldsymbol c}'_{\pazocal{B}} \; { \bar{\boldsymbol b}}  + {\boldsymbol c}'_{\pazocal{N}} \;{\boldsymbol  0}
    \end{align*}

    Quindi il valore della funzione obiettivo di tutte le soluzioni ammissibili è minore o uguale al valore della funzione obiettivo della soluzione di base ammissibile ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$, e di conseguenza quest'ultima è una soluzione ottima di valore ${\boldsymbol c}'_{\pazocal{B}} \;  \bar{\boldsymbol b}$ . <span class="qed">□</span>

- Abbiamo dimostrato che:

    \begin{equation*}
    ~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0} {\rm ~~e~~} { \bar{\boldsymbol c}} \le {\boldsymbol 0} ~~~\Longrightarrow~~~ {\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}} {\rm ~~e~~}  {\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}},
    \text{  soluzione ottima}
    \end{equation*}

    quindi “${ \bar{\boldsymbol b}} \ge {\boldsymbol 0}$ e ${ \bar{\boldsymbol c}} \le {\boldsymbol 0}$” è una condizione sufficiente affinché “${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$, soluzione ottima” e “${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$, soluzione ottima” è una condizione necessaria affinché “${ \bar{\boldsymbol b}} \ge {\boldsymbol 0}$ e ${ \bar{\boldsymbol c}} \le {\boldsymbol 0}$”. L'implicazione non vale nell'altro verso (vedremo un controesempio). Di conseguenza:

    \begin{equation*}
    {\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}} {\rm ~~e~~}  {\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}},
    \text{  soluzione ottima}
    ~~~\nRightarrow~~~
    { \bar{\boldsymbol c}} \le {\boldsymbol 0}
    \end{equation*}

<a id="box-2-cor-pivot-1"></a>

!!! teorema "Corollario 7.2"

    Data una base ${\boldsymbol  A}_{\pazocal{B}}$ del problema LP [(7.1)](#eq-FORM_STANDARD), se $~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0}~$ e $~{ \bar{\boldsymbol c}} < {\boldsymbol 0}~$ allora ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è l'unica soluzione ottima.

??? dimostrazione "Dimostrazione"

    Dal Teorema precedente segue che ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è una soluzione ottima. Se ${ ~\bar{\boldsymbol c}} < {\boldsymbol 0}~$ e poiché ogni soluzione ammissibile ${\boldsymbol x}$ diversa da ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ deve avere ${\boldsymbol  x}_{\pazocal{N}} \neq {\boldsymbol  0}$, abbiamo:

    \begin{align*}
    {\boldsymbol c}' \; {\boldsymbol x}
    &~~=~~
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  x}_{\pazocal{B}} + {\boldsymbol c}'_{\pazocal{N}} \;{{\boldsymbol  x}_{\pazocal{N}}}
    ~~=~~
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b} + \underbrace{ \bar{\boldsymbol c}'}_{< {\boldsymbol 0}} \; \underbrace{{{\boldsymbol  x}_{\pazocal{N}}}}_{\ge {\boldsymbol 0} {\rm ~~e~~} \neq {\boldsymbol 0}} \\
    &~~ < ~~
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b}
    ~~ = ~~
    {\boldsymbol c}'_{\pazocal{B}} \; { \bar{\boldsymbol b}}  + {\boldsymbol c}'_{\pazocal{N}} \;{\boldsymbol  0}
    \end{align*}

    Di conseguenza, ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è l'unica soluzione ottima. <span class="qed">□</span>

- Di conseguenza, abbiamo dimostrato che:

    \begin{equation*}
    ~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0} {\rm ~~e~~} { \bar{\boldsymbol c}} < {\boldsymbol 0} ~~~\Longrightarrow~~~ {\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}} {\rm ~~e~~}  {\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}},
    \text{  soluzione ottima unica}
    \end{equation*}

    quindi “${ \bar{\boldsymbol b}} \ge {\boldsymbol 0}$ e ${ \bar{\boldsymbol c}} < {\boldsymbol 0}$” è una condizione sufficiente affinché “${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$, unica soluzione ottima”. L'implicazione non vale nell'altro verso (daremo un controesempio). Di conseguenza

    \begin{equation*}
    {\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}} {\rm ~~e~~}  {\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}},
    \text{  soluzione ottima unica}
    ~~~\nRightarrow~~~
    { \bar{\boldsymbol c}} < {\boldsymbol 0}
    \end{equation*}

<a id="box-3-ex-pivot-1"></a>

!!! esempio "Esempio 7.1: forma standard di massimo di problemi LP in forma canonica di massimo"

    Introduciamo il seguente problema LP in forma canonica di massimo con $n=3$ variabili e $m=2$ vincoli e la sua forma standard con $n+m=5$ variabili e $m=2$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {x_1} & {+} & 2 \, {x_2} & {+} & 7 \, {x_3} \\[2ex]
    \text{soggetto a} & {x_1} &  &  & {+} & 2 \, {x_3} & {\le} & 2 \\[2ex]
    &  &  & {x_2} & {+} & 2 \, {x_3} & {\le} & 2 \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3} & { \ge} & {0}
    \end{array}
    $$

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {x_1} & {+} & 2 \, {x_2} & {+} & 7 \, {x_3} \\[2ex]
    \text{soggetto a} & {x_1} &  &  & {+} & 2 \, {x_3} & {+} \, {x_4} &  & {=} & 2 \\[2ex]
    &  &  & {x_2} & {+} & 2 \, {x_3} &  & {+} \, {x_5} & {=} & 2 \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} & {x_4,} & {x_5} & { \ge} & {0}
    \end{array}
    $$

    Nel problema LP in forma standard, abbiamo:

    $$
    {\boldsymbol  c}=
    \begin{pmatrix}
    1 \\[1ex]
    2 \\[1ex]
    7  \\[1ex]
    0  \\[1ex]
    0
    \end{pmatrix}
    \quad
    {\boldsymbol  A}=
    \begin{pmatrix}
    1 & 0 & 2 & 1 & 0\\[1ex]
    0 & 1 & 2 & 0 & 1
    \end{pmatrix}
    \quad
    {\boldsymbol b}=
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix}
    {\rm ~~~~~e~~~~~}
    \quad
    {\boldsymbol  x}=
    \begin{pmatrix}
    x_{1} \\[1ex]
    x_{2} \\[1ex]
    x_{3}  \\[1ex]
    x_{4}  \\[1ex]
    x_{5}
    \end{pmatrix}
    $$

    <div class="minipage" style="width:44%" markdown>

    ![Figura 1](../img/07-ottimalita-pivot/fig01.svg){ .fig .ovale loading=lazy style="width:97%" }

    </div>

    <div class="minipage" style="width:44%" markdown>

    Una soluzione ottima ${\tilde{\boldsymbol x}}(\,\text{LP}\,)$  della forma canonica è:

    $$
    \tilde{x}_1=0,~~\tilde{x}_2=0,~~\tilde{x}_3=1
    $$

    e il valore ottimo è:

    $$
    z(~\text{LP}~)  = 7
    $$

    Una soluzione ottima ${\tilde{\boldsymbol x}}(\,\text{LP}\,)$ della forma standard è:

    $$
    \tilde{x}_1=0,~~\tilde{x}_2=0,~~\tilde{x}_3=1,~~\tilde{x}_4=0,~~\tilde{x}_5=0
    $$

    con lo stesso valore ottimo.

    </div>

<a id="box-4-ex-pivot-2"></a>

!!! esempio "Esempio 7.2: condizioni di ottimalità"

    Per il problema LP dell'<span style="color:#1971c2">[Esempio 7.1](#box-3-ex-pivot-1)</span>, con $\pazocal{B}= \{2,~~3\}$ e $\pazocal{N}= \{1,~~4,~~5\},$ abbiamo:

    $$
    {\boldsymbol x}_{\pazocal{B}}=
    \begin{pmatrix}
    x_2 \\[1ex]
    x_3
    \end{pmatrix} ~~
    {\boldsymbol A}_{\pazocal{B}}=
    \begin{pmatrix}
    0 & 2 \\[1ex]
    1 & 2
    \end{pmatrix} ~~
    {\boldsymbol  A}^{-1}_{\pazocal{B}}
    =
    \begin{pmatrix}
    -1 & 1 \\[1ex]
    \frac{1}{2} & 0
    \end{pmatrix} ~~
    {\boldsymbol c}_{\pazocal{B}}=
    \begin{pmatrix}
    2 \\[1ex]
    7
    \end{pmatrix}
    $$

    $$
    {\boldsymbol x}_{\pazocal{N}}=
    \begin{pmatrix}
    x_1 \\[1ex]
    x_4 \\[1ex]
    x_5
    \end{pmatrix} ~~
    {\boldsymbol A}_{\pazocal{N}}=
    \begin{pmatrix}
    1 & 1 & 0 \\[1ex]
    0 & 0 & 1
    \end{pmatrix} ~~
    {\boldsymbol c}_{\pazocal{N}}=
    \begin{pmatrix}
    1 \\[1ex]
    0 \\[1ex]
    0
    \end{pmatrix}
    $$

    Di conseguenza, abbiamo:

    \begin{align*}
    {{\bar{\boldsymbol b}}} &= {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b} = \begin{pmatrix}
    -1 & 1 \\[1ex]
    \frac{1}{2} & 0
    \end{pmatrix}
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix} = \begin{pmatrix}
    0 \\[1ex]
    1
    \end{pmatrix}\\[3ex]
    {{\bar{\boldsymbol A}}} &=  {{\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{\pazocal{N}}} = {{\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{\pazocal{N}}} = \begin{pmatrix}
    -1 & 1 \\[1ex]
    \frac{1}{2} & 0
    \end{pmatrix} \begin{pmatrix}
    1 & 1 & 0 \\[1ex]
    0 & 0 & 1
    \end{pmatrix}
    =
    \begin{pmatrix}
    -1 & -1 & 1\\[1ex]
    \frac{1}{2} & \frac{1}{2} & 0
    \end{pmatrix}
    \\[3ex]
    {\bar{z}} &=
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b}    =
    \begin{pmatrix}
    2 & 7 \\
    \end{pmatrix}
    \begin{pmatrix}
    -1 & 1 \\[1ex]
    \frac{1}{2} & 0
    \end{pmatrix}
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix}
    =
    \begin{pmatrix}
    \frac{3}{2} & 2 \\
    \end{pmatrix}
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix}
    =7
    \end{align*}

    \begin{align*}
    {{ \bar{\boldsymbol c}}'}  &= {\boldsymbol c}'_{\pazocal{N}} -  {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{\pazocal{N}} = \begin{pmatrix}
    1 & 0 & 0\\
    \end{pmatrix}
    -
    \begin{pmatrix}
    2 & 7 \\
    \end{pmatrix}
    \begin{pmatrix}
    -1 & 1 \\[1ex]
    \frac{1}{2} & 0
    \end{pmatrix}
    \begin{pmatrix}
    1 & 1 & 0 \\[1ex]
    0 & 0 & 1
    \end{pmatrix}\\[1ex]
    &= \begin{pmatrix}
    1 & 0 & 0
    \end{pmatrix}
    -
    \begin{pmatrix}
    \frac{3}{2} & 2 \\
    \end{pmatrix}
    \begin{pmatrix}
    1 & 1 & 0 \\[1ex]
    0 & 0 & 1
    \end{pmatrix}
    =
    \begin{pmatrix}
    1 & 0 & 0
    \end{pmatrix}
    -
    \begin{pmatrix}
    \frac{3}{2} & \frac{3}{2} & 2
    \end{pmatrix}
    =
    \begin{pmatrix}
    -\frac{1}{2} & -\frac{3}{2} & -2
    \end{pmatrix}
    \end{align*}

    Poiché $~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0}~$ e $~{ \bar{\boldsymbol c}} \le {\boldsymbol 0}~$, la soluzione di base ammissibile

    $$
    \begin{pmatrix}
    x_2 \\[1ex]
    x_3
    \end{pmatrix}=
    \begin{pmatrix}
    0 \\[1ex]
    1
    \end{pmatrix}
    {\rm ~~e~~}
    \begin{pmatrix}
    x_1 \\[1ex]
    x_4 \\[1ex]
    x_5
    \end{pmatrix}=
    \begin{pmatrix}
    0 \\[1ex]
    0 \\[1ex]
    0
    \end{pmatrix}
    $$

    è l'unica soluzione ottima e ${\bar{z}} = 7$ è il valore ottimo.

    Il dizionario associato è:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_2} & {=} & {0} & {+} & {x_1} & {+} & {x_4} & {-} & {x_5} \\[2ex]
    {x_3} & {=} & {1} & {-} & {\frac{1}{2}}\, {x_1} & {-} & {\frac{1}{2}}\, {x_4} \\[2ex]
    {z} & {=} & {7} & {-} & {\frac{1}{2}}\, {x_1} & {-} & {\frac{3}{2}}\, {x_4} & {-} & {2}\, {x_5}
    \end{array}
    \end{cases}
    \end{equation*}

<a id="box-5-ex-pivot-3"></a>

!!! esempio "Esempio 7.3: condizioni di ottimalità"

    Per il problema LP dell'<span style="color:#1971c2">[Esempio 7.1](#box-3-ex-pivot-1)</span>, con $\pazocal{B}= \{3,~~5\}$ e $\pazocal{N}= \{1,~~2,~~4\},$ abbiamo:

    $$
    {\boldsymbol x}_{\pazocal{B}}=
    \begin{pmatrix}
    x_3 \\[1ex]
    x_5
    \end{pmatrix} ~~
    {\boldsymbol A}_{\pazocal{B}}=
    \begin{pmatrix}
    2 & 0 \\[1ex]
    2 & 1
    \end{pmatrix} ~~
    {\boldsymbol A}^{-1}_{\pazocal{B}}=
    \begin{pmatrix}
    \frac{1}{2} & 0 \\[1ex]
    -1 & 1
    \end{pmatrix} ~~
    {\boldsymbol c}_{\pazocal{B}}=
    \begin{pmatrix}
    7 \\[1ex]
    0
    \end{pmatrix}
    $$

    $$
    {\boldsymbol x}_{\pazocal{N}}=
    \begin{pmatrix}
    x_1 \\[1ex]
    x_2 \\[1ex]
    x_4
    \end{pmatrix} ~~
    {\boldsymbol A}_{\pazocal{N}}=
    \begin{pmatrix}
    1 & 0 & 1 \\[1ex]
    0 & 1 & 0
    \end{pmatrix} ~~
    {\boldsymbol c}_{\pazocal{N}}=
    \begin{pmatrix}
    1 \\[1ex]
    2 \\[1ex]
    0
    \end{pmatrix}
    $$

    Di conseguenza, abbiamo:

    \begin{align*}
    {{\bar{\boldsymbol b}}} &= {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b} = \begin{pmatrix}
    \frac{1}{2} & 0 \\[1ex]
    -1 & 1
    \end{pmatrix}
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix} = \begin{pmatrix}
    1 \\[1ex]
    0
    \end{pmatrix}\\[3ex]
    {{\bar{\boldsymbol A}}} &=  {{\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{\pazocal{N}}} = {{\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{\pazocal{N}}}=  \begin{pmatrix}
    \frac{1}{2} & 0 \\[1ex]
    -1 & 1
    \end{pmatrix} \begin{pmatrix}
    1 & 0 & 1 \\[1ex]
    0 & 1 & 0
    \end{pmatrix}
    =
    \begin{pmatrix}
    \frac{1}{2} & 0 & \frac{1}{2}\\[1ex]
    -1 & 1 & -1
    \end{pmatrix}
    \\[3ex]
    {\bar{z}} &=
    {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \; {\boldsymbol b}    =
    \begin{pmatrix}
    7 & 0 \\
    \end{pmatrix}
    \begin{pmatrix}
    \frac{1}{2} & 0 \\[1ex]
    -1 & 1
    \end{pmatrix}
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix}
    =
    \begin{pmatrix}
    \frac{7}{2} & 0 \\
    \end{pmatrix}
    \begin{pmatrix}
    2 \\[1ex]
    2
    \end{pmatrix}
    =7
    \end{align*}

    \begin{align*}
    {{ \bar{\boldsymbol c}}'}  &= {\boldsymbol c}'_{\pazocal{N}} -  {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{\pazocal{N}} = \begin{pmatrix}
    1 & 2 & 0\\
    \end{pmatrix}
    -
    \begin{pmatrix}
    7 & 0 \\
    \end{pmatrix}
    \begin{pmatrix}
    \frac{1}{2} & 0 \\[1ex]
    -1 & 1
    \end{pmatrix}
    \begin{pmatrix}
    1 & 0 & 1 \\[1ex]
    0 & 1 & 0
    \end{pmatrix}\\[1ex]
    &= \begin{pmatrix}
    1 & 2 & 0
    \end{pmatrix}
    -
    \begin{pmatrix}
    \frac{7}{2} & 0 \\
    \end{pmatrix}
    \begin{pmatrix}
    1 & 0 & 1 \\[1ex]
    0 & 1 & 0
    \end{pmatrix}
    =
    \begin{pmatrix}
    1 & 2 & 0
    \end{pmatrix}
    -
    \begin{pmatrix}
    \frac{7}{2} & 0 & \frac{7}{2}
    \end{pmatrix}
    =
    \begin{pmatrix}
    -\frac{5}{2} & 2 & -\frac{7}{2}
    \end{pmatrix}
    \end{align*}

    Poiché $~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0}~$ e $\bar{z}=7~$ (il valore ottimo), la soluzione di base ammissibile

    $$
    \begin{pmatrix}
    x_3 \\[1ex]
    x_5
    \end{pmatrix}=
    \begin{pmatrix}
    1 \\[1ex]
    0
    \end{pmatrix}
    {\rm ~~e~~}
    \begin{pmatrix}
    x_1 \\[1ex]
    x_2 \\[1ex]
    x_4
    \end{pmatrix}=
    \begin{pmatrix}
    0 \\[1ex]
    0 \\[1ex]
    0
    \end{pmatrix}
    $$

    è una soluzione ottima ma $\bar{\boldsymbol c} \nleq {\boldsymbol 0}$. È un <strong>controesempio</strong> al fatto che una soluzione ottima di base implica costi ridotti non positivi. Poiché questa soluzione ottima è unica (si veda l'<span style="color:#1971c2">[Esempio 7.2](#box-4-ex-pivot-2)</span>), è anche un <strong>controesempio</strong> al fatto che una soluzione ottima di base unica implica costi ridotti negativi. 

    Il dizionario associato è:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_3} & {=} & {1} & {-} & {\frac{1}{2}} {x_1} &  &  & {-} & {\frac{1}{2}} {x_4} \\[2ex]
    {x_5} & {=} & {0} & {+} & \, {x_1} & {-} & \, {x_2} & {+} & \, {x_4} \\[2ex]
    {z} & {=} & {7} & {-} & {\frac{5}{2}}\, {x_1} & {+} & {2}\, {x_2} & {-} & {\frac{7}{2}}\, {x_4}
    \end{array}
    \end{cases}
    \end{equation*}

## 7.2 Condizioni necessarie di ottimalità

### 7.2.1 Soluzioni di base ammissibili degeneri

<a id="box-6-def-pivot-1"></a>

!!! definizione "Definizione 7.3: soluzioni di base ammissibili degeneri"

    Data una base ${\boldsymbol  A}_{\pazocal{B}}$ del problema LP [(7.1)](#eq-FORM_STANDARD),  se $~{ \bar{\boldsymbol b}} \ge {\boldsymbol 0}~$ e per qualche $i \in \pazocal{B}$ abbiamo $\bar{b}_i=0$ allora ${\boldsymbol  x}_{\pazocal{B}} = {{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}} = {\boldsymbol 0}$ si chiama <strong>soluzione di base ammissibile degenere</strong>.

- In una soluzione di base ammissibile degenere ci sono più di $n$ variabili a zero (anche alcune variabili in base sono a zero e non solo tutte le variabili fuori base).

<a id="box-7-theo-pivot-3"></a>

!!! teorema "Teorema 7.4: condizioni necessarie di ottimalità"

    Data una base ${\boldsymbol  A}_{\pazocal{B}}$ del problema LP [(7.1)](#eq-FORM_STANDARD), se ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ è una soluzione ottima non degenere allora $~{ \bar{\boldsymbol c}} \le {\boldsymbol 0}~$.

??? dimostrazione "Dimostrazione"

    Supponiamo per assurdo che ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ sia una soluzione ottima non degenere e che $\bar{c}_p > 0$ per qualche $p \in \pazocal{N}$.  Poiché la soluzione è non degenere e ammissibile abbiamo ${\bar{\boldsymbol b}} >0$ ma allora esiste un valore positivo $\vartheta >0$ tale che:

    $$
    {\boldsymbol  x}_{\pazocal{B}}
    =
    {{\bar{\boldsymbol b}}}
    - \underbrace{{{\boldsymbol  A}_{\pazocal{B}}^{-1} \;{\boldsymbol  A}_{p}} }_{=\bar{\boldsymbol A}_{p}} \; {\vartheta} \ge 0
    $$

    Allora, ponendo $x_p = \vartheta$ e ${\boldsymbol  x}_{\pazocal{B}} = {{\bar{\boldsymbol b}}} - \bar{\boldsymbol A}_{p} \; {\vartheta}$ (tutte le altre variabili a zero), otteniamo un'altra soluzione ammissibile con un valore della funzione obiettivo strettamente migliore. Questo contraddice il fatto che ${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$ siano ottime, quindi deve valere $~{ \bar{\boldsymbol c}} \le {\boldsymbol 0}~$. <span class="qed">□</span>

- Combinando con le condizioni sufficienti di ottimalità, abbiamo dimostrato che:

    \begin{equation*}
    {\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}} {\rm ~~e~~}  {\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}},
    \text{  soluzione ottima non degenere}  ~~~\Longleftrightarrow~~~  { \bar{\boldsymbol b}} > {\boldsymbol 0} {\rm ~~e~~}  { \bar{\boldsymbol c}} \le {\boldsymbol 0}
    \end{equation*}

    quindi “${ \bar{\boldsymbol b}} > {\boldsymbol 0}$ e ${ \bar{\boldsymbol c}} \le {\boldsymbol 0}$” è una condizione necessaria e sufficiente affinché “${\boldsymbol  x}_{\pazocal{B}}={{\bar{\boldsymbol b}}}$ e ${\boldsymbol  x}_{\pazocal{N}}={{{\boldsymbol 0}}}$, soluzione ottima non degenere” e viceversa.

<a id="box-8-ex-pivot-5"></a>

!!! esempio "Esempio 7.4: soluzioni di base ammissibili degeneri"

    Per il problema LP dell'<span style="color:#1971c2">[Esempio 7.1](#box-3-ex-pivot-1)</span>, con $\pazocal{B}= \{3,~~5\}$ e $\pazocal{N}= \{1,~~2,~~4\},$ abbiamo la soluzione di base ammissibile degenere:

    $$
    \begin{pmatrix}
    x_3 \\[1ex]
    x_5
    \end{pmatrix}=
    \begin{pmatrix}
    1 \\[1ex]
    0
    \end{pmatrix}
    {\rm ~~~~e~~~~}
    \begin{pmatrix}
    x_1 \\[1ex]
    x_2 \\[1ex]
    x_4
    \end{pmatrix}=
    \begin{pmatrix}
    0 \\[1ex]
    0 \\[1ex]
    0
    \end{pmatrix}
    $$

<a id="box-9-def-pivot-degpivot"></a>

!!! definizione "Definizione 7.5: operazione di pivot degenere"

    Un'<strong>operazione di pivot degenere</strong> si verifica quando $t_m = 0$, cioè quando la riga pivot $x_r$ ha $\bar{b}_r = 0$; questo può accadere solo se la soluzione di base ammissibile è degenere.

!!! chiave ""

    Il <strong>valore della funzione obiettivo aumenta in ogni operazione di pivot non degenere e può rimanere invariato solo in una degenere</strong>.

## 7.3 Regole di pivot

- Nelle operazioni di pivot, una <strong>regola di pivot</strong> è un modo di rispondere alle due domande:

    1. Come determinare la colonna pivot nei casi in cui ci siano più variabili fuori base con costo ridotto positivo?

    2. Come determinare la riga pivot nei casi in cui ci siano più variabili in base che assumono il valore zero quando si pone il valore della colonna pivot al suo massimo valore possibile $t_m$?

### 7.3.1 Regole di pivot anti-ciclaggio

<a id="box-10-theo-pivot-4"></a>

!!! teorema "Teorema 7.6"

    Se l'algoritmo del simplesso non termina, allora deve ciclare.

??? dimostrazione "Dimostrazione"

    Esistono al più ${n+m \choose m}$ basi ${\boldsymbol  A}_{\pazocal{B}}$ del problema LP [(7.1)](#eq-FORM_STANDARD) e, di conseguenza, dizionari. Quindi, se l'algoritmo del simplesso non termina, deve visitare alcuni di questi dizionari più di una volta. Di conseguenza, l'algoritmo cicla. <span class="qed">□</span>

- <strong>È molto raro che l'algoritmo del simplesso cicli, ma esistono istanze in cui cicla</strong>.

- Il ciclaggio può verificarsi solo all'interno di una sequenza di soluzioni di base ammissibili degeneri in cui la funzione obiettivo rimane invariata.

#### Regola di pivot di Bland

- La <strong>regola di pivot di Bland</strong> (regola di pivot dell'indice minimo) seleziona la colonna pivot e la riga pivot come segue:

    1. la <strong>colonna pivot</strong> è la variabile fuori base $x_p$ con l'<strong>indice minimo</strong> $p \in \pazocal{N}$ tale che:

        $$
        \bar{c}_{p} > 0   \text{    o, equivalentemente   } {c}_{p} > {{{\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1}}}  \;{\boldsymbol  A}_{p}
        $$

    2. la <strong>riga pivot</strong>  è la variabile in base $x_r$  con  l'<strong>indice minimo</strong> $r \in \pazocal{B}$ tale che:

        $$
        \bar{a}_{rp} > 0 {\rm ~~~e~~~} \frac{\bar{b}_r}{\bar{a}_{rp}} = t_m
        $$

<a id="box-11-theo-pivot-5"></a>

!!! teorema "Teorema 7.7"

    L'algoritmo del simplesso termina purché la colonna pivot e la riga pivot siano selezionate dalla regola di pivot di Bland in ogni operazione di pivot.

- Per il Teorema precedente, la dimostrazione deve solo mostrare che il ciclaggio è impossibile quando si usa la regola di pivot di Bland.

??? dimostrazione "Dimostrazione"

    Procediamo per assurdo e supponiamo che si verifichi il ciclaggio.  Di conseguenza, sia

    $$
    D_0,~~D_1,~~ D_2,~~ \dots~~, D_{k-1},~~D_0,~~D_1,~~ D_2,~~ \dots
    $$

    una sequenza di dizionari tale che il dizionario $D_0$ si ripete dopo $k$ operazioni di pivot degeneri con valore della funzione obiettivo costante.

    Diciamo che una variabile è <em>volubile</em> se è una variabile in base in alcuni dizionari e una variabile fuori base in altri.

    Sia $x_t$ la variabile volubile con indice massimo $t$ e sia $D$  un dizionario

    \begin{equation*}
    \begin{cases} \displaystyle x_{i} = {{ \bar{b}_i}} - \sum_{j \in \pazocal{N}} \bar{a}_{ij} \; x_{j},~~ \forall i \in \pazocal{B}\\[4ex]
    \displaystyle z = \bar{z}  + \sum_{j \in \pazocal{N}} \bar{c}_{j} \; x_{j} \end{cases}
    \end{equation*}

    della sequenza ciclica $D_0,~~D_1,~~ D_2,~~ \dots~~, D_{k-1}$ in cui $x_t$ è la riga pivot. Sia $x_s$ la colonna pivot  del dizionario $D$.  Senza perdita di generalità, assumiamo che $D = D_0$.

    Sia $D^{*}$  un dizionario

    \begin{equation*}
    \begin{cases} \displaystyle x_{i} = {{ \bar{b}^*_i}} - \sum_{j \in \pazocal{N}^*} \bar{a}^*_{ij} \; x_{j},~~ \forall i \in \pazocal{B}^*\\[4ex]
    \displaystyle z = \bar{z}^*  + \sum_{j \in \pazocal{N}^*} \bar{c}^*_{j} \; x_{j} \end{cases}
    \end{equation*}

    della sequenza  $D_1,~~ D_2,~~ \dots~~, D_{k-1}$ in cui $x_t$ è la colonna pivot.

    Poiché tutte le operazioni di pivot nel ciclo sono degeneri (il valore della funzione obiettivo rimane costante), abbiamo ${\bar{z}}={\bar{z}}^*=v$, e quindi possiamo scrivere la funzione obiettivo del dizionario $D^{*}$ come

    \begin{equation*}
    \label{BB}
    {z}= v  + \sum_{j=1}^{n+m} \hat{c}^*_j \; x_j
    \quad \text{  dove  } \quad \hat{c}^*_j =
    \begin{cases}
    \bar{c}^*_j & \text{se  } j \in  \pazocal{N}^* \\
    0 & \text{altrimenti}
    \end{cases} \tag{7.2}
    \end{equation*}

    Consideriamo la soluzione ottenuta aumentando il valore di $x_s$  fino a $\vartheta$:

    $$
    x_s=\vartheta, ~~~~ x_i=0, ~ \forall i \in \pazocal{N} \setminus \{s\},~~~~ x_i=\bar{b}_i - \bar{a}_{is}  \: \vartheta, ~ \forall i \in  \pazocal{B}
    $$

    Di conseguenza,  per la funzione obiettivo $z$ dei dizionari $D$ e $D^{*}$, abbiamo:

    $$
    z =v + \bar{c}_s \; \vartheta {\rm ~~~~~~e~~~~~} z =v + \hat{c}_s^* \; \vartheta + \sum_{i \in \pazocal{B}} \hat{c}_i^* \; \big(\bar{b}_i - \bar{a}_{is} \vartheta \big)
    $$

    Uguagliando queste due espressioni di $z$,  abbiamo:

    $$
    \left( \bar{c}_s - \hat{c}_s^* + \sum_{i \in \pazocal{B} } \hat{c}_i^* \: \bar{a}_{is} \right) \: \vartheta= \sum_{i \in \pazocal{B} } \hat{c}_i^* \: \bar{b}_{i} ~~\Rightarrow~~ \bar{c}_s - \hat{c}_s^* + \sum_{i \in \pazocal{B} } \hat{c}_i^* \: \bar{a}_{is}  = 0
    $$

    L'implicazione è dovuta al fatto che l'equazione deve valere per ogni $\vartheta$ (di conseguenza, abbiamo anche  $\sum_{i \in \pazocal{B} } \hat{c}_i^* \: \bar{b}_{i}  =0$).

    Il fatto che $x_s$ sia la colonna pivot in $D$ implica che $\bar{c}_s > 0$. Poiché $x_s$ è volubile e $s \neq t$ ($x_s$ è fuori base e $x_t$ è in base in $D$),  abbiamo $s < t$. Inoltre, abbiamo $\hat{c}_s^*  \le 0$: se $s \in \pazocal{B}^*$, allora $\hat{c}_s^* = 0$; se $s \in \pazocal{N}^*$ e $\hat{c}_s^* = \bar{c}_s^* > 0$, allora, per la regola di Bland e poiché $s < t$, $x_s$ e non $x_t$ sarebbe la colonna pivot in $D^{*}$. Di conseguenza, abbiamo:

    $$
    \sum_{i \in \pazocal{B} } \hat{c}_i^* \: \bar{a}_{is} = \hat{c}_s^* - \bar{c}_s < 0 ~~\Rightarrow
    \text{ esiste } r \in \pazocal{B}:~ \hat{c}_r^* \bar{a}_{rs} < 0 \text{ e quindi  } \hat{c}_r^* \neq 0 {\rm ~e~}  r \in  \pazocal{N}^*
    $$

    Quindi  $x_r$ è volubile e perciò $r \le t$.  Infatti, $r < t$, poiché $\hat{c}_t^* \bar{a}_{ts} > 0$: entrambi i fattori sono positivi, poiché $\hat{c}_t^*=\bar{c}_t^* > 0$ ($x_t$ è la colonna pivot  in $D^*$) e $\bar{a}_{ts} > 0$ ($x_t$ è la riga pivot in $D$).

    Il fatto che $r < t$ implica che $\hat{c}_r^* \le 0$ (altrimenti, per la regola di Bland,  $x_r$ sarebbe la colonna pivot  in $D^*$).  Allora abbiamo:

    $$
    \hat{c}_r^* \bar{a}_{rs} < 0 {\rm ~~e~~} \hat{c}_r^* \le 0 ~~\Rightarrow~~~ \bar{a}_{rs} > 0
    $$

    Poiché ciascuno dei dizionari del ciclo descrive la stessa soluzione ammissibile (tutte le operazioni di pivot sono degeneri), ogni variabile volubile è nulla in tutti questi dizionari (è nulla in un dizionario in cui è fuori base).

    In particolare,  $x_r = 0$. Ma in $D$,  $x_r$ è in base. Quindi $\bar{b}_r=0$ e, poiché $\bar{a}_{rs} > 0$, abbiamo $\frac{\bar{b}_r}{\bar{a}_{rs}} = 0 = t_m$. Quindi $x_r$ era una candidata a essere la riga pivot in $D$, e poiché $r < t$, per la regola di Bland avrebbe dovuto essere scelta al posto di $x_t$.

    Questa è la contraddizione che dimostra che una sequenza ciclica di dizionari non può esistere usando la regola di Bland. <span class="qed">□</span>

---

**Esercizi su questo capitolo:** [:material-pencil: Condizioni di ottimalità e regole di pivot](../esercizi/es-07-ottimalita-pivot.md)
