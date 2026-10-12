---
title: "Esercizi · Analisi di sensitività"
---

# Esercizi · Analisi di sensitività

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 14** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 14: Analisi di sensitività](../metodi-avanzati/14-sensitivita.md) · [:material-file-pdf-box: Eserciziario, volume 4 (PDF)](../pdf/esercizi-4-metodi-avanzati.pdf)

</div>

<a id="esercizio-14-1"></a>

!!! esercizio "Esercizio 14.1: Analisi di sensitività (S1)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili e $m=2$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {4} \, {x_1} & {+} & {3} \, {x_2} \\[2ex]
    \text{soggetto a} & {2} \, {x_1} & {+} & \, {x_2} & {\le} & {10} \\[2ex]
    & \, {x_1} & {+} & \, {x_2} & {\le} & {8} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

    Aggiungendo $m=2$ variabili di scarto, l'algoritmo del simplesso determina la base ottima $\pazocal{B}= \{1,~~2\}$ e $\pazocal{N}= \{3,~~4\}$, con il dizionario associato:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1} & {=} & {2} & {-} & {x_3} & {+} & {x_4} \\[2ex]
    {x_2} & {=} & {6} & {+} & {x_3} & {-} & {2\,x_4} \\[2ex]
    {z} & {=} & {26} & {-} & {x_3} & {-} & {2\,x_4}
    \end{array}
    \end{cases}
    \end{equation*}

    e abbiamo

    $$
    {\boldsymbol  A}_{\pazocal{B}}^{-1} =
    \begin{pmatrix}
    1 & -1 \\[1ex]
    -1 & 2
    \end{pmatrix}
    \qquad {\rm e} \qquad
    {\boldsymbol \pi} = (1~~2) .
    $$

    **Domande**

    1. Determinare l'intervallo dei valori di $c_1$ per cui la base $\pazocal{B}= \{1,~~2\}$ resta ottima, e dire come cambiano la soluzione ottima e il valore ottimo all'interno di tale intervallo.

    2. Determinare lo stesso intervallo per $c_2$.

    3. Determinare il nuovo valore ottimo quando $c_1$ aumenta da $4$ a $5$.

??? soluzione "Soluzione"

    - La variabile $x_1$ è <strong>in base</strong>, quindi una variazione $c_1 \to 4 + \delta$ modifica tutti i costi ridotti. La riga di $x_1$ nella matrice $\bar{\boldsymbol A}$ è $(1~~-1)$, con un elemento positivo, che dà un lower bound su $\delta$, e un elemento negativo, che dà un upper bound:

        $$
        \underbrace{\frac{\bar c_3}{\bar a_{13}}}_{= \, \frac{-1}{1} \, = \, -1} \; \le \; \delta \; \le \;
        \underbrace{\frac{\bar c_4}{\bar a_{14}}}_{= \, \frac{-2}{-1} \, = \, 2} ,
        $$

        cioè $-1 \le \delta \le 2$ e quindi

        $$
        c_1 \in [\, 3, \; 6 \, ] .
        $$

        Per ogni valore di $c_1$ in questo intervallo la soluzione ottima resta $\tilde{\boldsymbol x}(\, LP \,) = \begin{pmatrix} 2 \\ 6 \end{pmatrix}$, mentre il valore ottimo diventa $26 + \delta \cdot \tilde{x}_1 = 26 + 2 \, \delta$.

    - Anche la variabile $x_2$ è in base. La riga di $x_2$ in $\bar{\boldsymbol A}$ è $(-1~~2)$, e quindi

        $$
        \underbrace{\frac{\bar c_4}{\bar a_{24}}}_{= \, \frac{-2}{2} \, = \, -1} \; \le \; \delta \; \le \;
        \underbrace{\frac{\bar c_3}{\bar a_{23}}}_{= \, \frac{-1}{-1} \, = \, 1} ,
        $$

        cioè $-1 \le \delta \le 1$ e quindi

        $$
        c_2 \in [\, 2, \; 4 \, ] .
        $$

        Per ogni valore di $c_2$ in questo intervallo la soluzione ottima non cambia, mentre il valore ottimo diventa $26 + \delta \cdot \tilde{x}_2 = 26 + 6 \, \delta$.

    - Con $c_1 = 5$ abbiamo $\delta = 1$, che appartiene all'intervallo $[-1, 2]$ determinato nella prima domanda. Di conseguenza, la soluzione ottima non cambia e il nuovo valore ottimo è

        $$
        z(\, LP \,) = 26 + 1 \cdot 2 = 28 ,
        $$

        come conferma $5 \cdot 2 + 3 \cdot 6 = 28$.

<a id="esercizio-14-2"></a>

!!! esercizio "Esercizio 14.2: Analisi di sensitività (S2)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili e $m=2$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {4} \, {x_1} & {+} & {3} \, {x_2} \\[2ex]
    \text{soggetto a} & {2} \, {x_1} & {+} & \, {x_2} & {\le} & {10} \\[2ex]
    & \, {x_1} & {+} & \, {x_2} & {\le} & {8} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

    Aggiungendo $m=2$ variabili di scarto, l'algoritmo del simplesso determina la base ottima $\pazocal{B}= \{1,~~2\}$ e $\pazocal{N}= \{3,~~4\}$, con il dizionario associato:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1} & {=} & {2} & {-} & {x_3} & {+} & {x_4} \\[2ex]
    {x_2} & {=} & {6} & {+} & {x_3} & {-} & {2\,x_4} \\[2ex]
    {z} & {=} & {26} & {-} & {x_3} & {-} & {2\,x_4}
    \end{array}
    \end{cases}
    \end{equation*}

    e abbiamo

    $$
    {\boldsymbol  A}_{\pazocal{B}}^{-1} =
    \begin{pmatrix}
    1 & -1 \\[1ex]
    -1 & 2
    \end{pmatrix}
    \qquad {\rm e} \qquad
    {\boldsymbol \pi} = (1~~2) .
    $$

    **Domande**

    1. Scrivere i prezzi ombra dei due vincoli lineari e spiegarne il significato.

    2. Determinare l'intervallo dei valori di $b_1$ per cui la base $\pazocal{B}= \{1,~~2\}$ resta ottima.

    3. Determinare lo stesso intervallo per $b_2$, e calcolare il nuovo valore ottimo quando $b_2$ aumenta da $8$ a $9$.

??? soluzione "Soluzione"

    - I prezzi ombra sono le componenti del vettore riga ${\boldsymbol \pi} = {\boldsymbol c}'_{\pazocal{B}} \; {\boldsymbol  A}_{\pazocal{B}}^{-1} = (1~~2)$, cioè

        $$
        \pi_1 = 1 \qquad {\rm e} \qquad \pi_2 = 2 .
        $$

        Il prezzo ombra $\pi_i$ è l'aumento del valore ottimo per ogni aumento unitario di $b_i$, finché la base ottima resta ottima. Entrambi i vincoli sono attivi nella soluzione ottima, perché entrambe le variabili di scarto sono fuori base con valore $0$. Entrambi i prezzi ombra sono strettamente positivi, quindi aumentare uno qualsiasi dei due termini noti aumenta il valore ottimo. Un vincolo attivo può anche avere prezzo ombra nullo, in presenza di degenerazione duale: qui ciò non accade, perché $\pi_1 = 1$ e $\pi_2 = 2$.

    - Una variazione $b_1 \to 10 + \delta$ modifica i valori delle variabili in base di $\delta$ volte la <u>prima colonna</u> di ${\boldsymbol  A}_{\pazocal{B}}^{-1}$, che è $(1~~-1)'$:

        $$
        \begin{cases}
        2 + \delta \ge 0\\[1.5ex]
        6 - \delta \ge 0
        \end{cases}
        \qquad \Longrightarrow \qquad
        -2 \le \delta \le 6
        \qquad \Longrightarrow \qquad
        b_1 \in [\, 8, \; 16 \, ] .
        $$

    - La seconda colonna di ${\boldsymbol  A}_{\pazocal{B}}^{-1}$ è $(-1~~2)'$, quindi

        $$
        \begin{cases}
        2 - \delta \ge 0\\[1.5ex]
        6 + 2 \, \delta \ge 0
        \end{cases}
        \qquad \Longrightarrow \qquad
        -3 \le \delta \le 2
        \qquad \Longrightarrow \qquad
        b_2 \in [\, 5, \; 10 \, ] .
        $$

        Con $b_2 = 9$ abbiamo $\delta = 1$, che appartiene all'intervallo $[-3, 2]$, quindi il nuovo valore ottimo è

        $$
        z(\, LP \,) = 26 + \delta \; \pi_2 = 26 + 1 \cdot 2 = 28 .
        $$

        La nuova soluzione ottima è $\tilde x_1 = 2 - 1 = 1$ e $\tilde x_2 = 6 + 2 = 8$, e infatti $4 \cdot 1 + 3 \cdot 8 = 28$.

<a id="esercizio-14-3"></a>

!!! esercizio "Esercizio 14.3: Analisi di sensitività (S3)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili e $m=2$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {4} \, {x_1} & {+} & {3} \, {x_2} \\[2ex]
    \text{soggetto a} & {2} \, {x_1} & {+} & \, {x_2} & {\le} & {10} \\[2ex]
    & \, {x_1} & {+} & \, {x_2} & {\le} & {8} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

    Aggiungendo $m=2$ variabili di scarto, l'algoritmo del simplesso determina la base ottima $\pazocal{B}= \{1,~~2\}$ e $\pazocal{N}= \{3,~~4\}$, con il dizionario associato:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1} & {=} & {2} & {-} & {x_3} & {+} & {x_4} \\[2ex]
    {x_2} & {=} & {6} & {+} & {x_3} & {-} & {2\,x_4} \\[2ex]
    {z} & {=} & {26} & {-} & {x_3} & {-} & {2\,x_4}
    \end{array}
    \end{cases}
    \end{equation*}

    e abbiamo

    $$
    {\boldsymbol  A}_{\pazocal{B}}^{-1} =
    \begin{pmatrix}
    1 & -1 \\[1ex]
    -1 & 2
    \end{pmatrix}
    \qquad {\rm e} \qquad
    {\boldsymbol \pi} = (1~~2) .
    $$

    **Domande**

    1. Al problema LP si aggiunge una nuova variabile non negativa $x_{\star}$, con coefficiente di costo $c_{\star} = 7$ e colonna ${\boldsymbol  A}_{\star} = \begin{pmatrix} 1 \\ 2 \end{pmatrix}$. Calcolarne il costo ridotto rispetto alla base ottima $\pazocal{B}= \{1,~~2\}$ e dire se la base è ancora ottima.

    2. In caso contrario, far ripartire l'algoritmo del simplesso da quella base e determinare la nuova soluzione ottima e il nuovo valore ottimo.

??? soluzione "Soluzione"

    - Il costo ridotto della nuova variabile è

        $$
        \bar{c}_{\star} = c_{\star} - {\boldsymbol \pi} \; {\boldsymbol  A}_{\star}
        = 7 - (1~~2)
        \begin{pmatrix} 1 \\ 2 \end{pmatrix}
        = 7 - 5 = 2 > 0 .
        $$

        Di conseguenza, la base $\pazocal{B}= \{1,~~2\}$ <u>non è più duale ammissibile</u> e non è ottima per il nuovo problema LP: conviene produrre la nuova variabile.

    - Facciamo ripartire l'algoritmo del simplesso dalla base $\pazocal{B}= \{1,~~2\}$, che è ancora primale ammissibile, con $x_{\star}$ come colonna pivot. La sua colonna nel dizionario è

        $$
        \bar{\boldsymbol A}_{\star} = {\boldsymbol A}_{\pazocal{B}}^{-1} \; {\boldsymbol  A}_{\star}
        =
        \begin{pmatrix}
        1 & -1 \\[1ex]
        -1 & 2
        \end{pmatrix}
        \begin{pmatrix} 1 \\ 2 \end{pmatrix}
        =
        \begin{pmatrix} -1 \\ 3 \end{pmatrix} .
        $$

        L'unico elemento positivo è quello della variabile in base $x_2$, quindi

        $$
        t_m = \frac{6}{3} = 2
        $$

        e la riga pivot è $x_2$, che esce dalla base. Dopo questa sola operazione di pivot tutti i costi ridotti diventano non positivi, e la nuova soluzione ottima è

        $$
        \tilde x_1 = 4, \qquad \tilde x_2 = 0, \qquad \tilde x_{\star} = 2 ,
        $$

        con valore ottimo

        $$
        z(\, LP \,) = 4 \cdot 4 + 3 \cdot 0 + 7 \cdot 2 = 30 .
        $$

<a id="esercizio-14-4"></a>

!!! esercizio "Esercizio 14.4: Analisi di sensitività (S4)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili e $m=2$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {4} \, {x_1} & {+} & {3} \, {x_2} \\[2ex]
    \text{soggetto a} & {2} \, {x_1} & {+} & \, {x_2} & {\le} & {10} \\[2ex]
    & \, {x_1} & {+} & \, {x_2} & {\le} & {8} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

    Aggiungendo $m=2$ variabili di scarto, l'algoritmo del simplesso determina la base ottima $\pazocal{B}= \{1,~~2\}$ e $\pazocal{N}= \{3,~~4\}$, con il dizionario associato:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1} & {=} & {2} & {-} & {x_3} & {+} & {x_4} \\[2ex]
    {x_2} & {=} & {6} & {+} & {x_3} & {-} & {2\,x_4} \\[2ex]
    {z} & {=} & {26} & {-} & {x_3} & {-} & {2\,x_4}
    \end{array}
    \end{cases}
    \end{equation*}

    e abbiamo

    $$
    {\boldsymbol  A}_{\pazocal{B}}^{-1} =
    \begin{pmatrix}
    1 & -1 \\[1ex]
    -1 & 2
    \end{pmatrix}
    \qquad {\rm e} \qquad
    {\boldsymbol \pi} = (1~~2) .
    $$

    **Domande**

    1. Al problema LP si aggiunge un nuovo vincolo lineare $x_1 + 2 \, x_2 \le 10$. Verificare se la soluzione ottima $\tilde{\boldsymbol x}(\, LP \,) = \begin{pmatrix} 2 \\ 6 \end{pmatrix}$ lo soddisfa.

    2. Scrivere l'equazione della variabile di scarto $x_5$ del nuovo vincolo nel dizionario della base $\pazocal{B}= \{1,~~2,~~5\}$, e dire quale algoritmo occorre usare per ripristinare l'ottimalità.

    3. Eseguire un'operazione di pivot di tale algoritmo e determinare la nuova soluzione ottima e il nuovo valore ottimo.

??? soluzione "Soluzione"

    - La soluzione ottima del problema LP originale <u>viola</u> il nuovo vincolo, perché

        $$
        \tilde x_1 + 2 \, \tilde x_2 = 2 + 12 = 14 > 10 .
        $$

    - La variabile di scarto del nuovo vincolo è $x_5 = 10 - x_1 - 2 \, x_2$. Sostituendo le equazioni di $x_1$ e $x_2$ del dizionario, otteniamo:

        $$
        x_5 = 10 - \underbrace{(2 - x_3 + x_4)}_{= \, x_1} - 2 \, \underbrace{(6 + x_3 - 2 \, x_4)}_{= \, x_2}
        = - \, 4 - x_3 + 3 \, x_4 ,
        $$

        cioè $\bar b_5 = -4$, $\bar a_{53} = 1$ e $\bar a_{54} = -3$.

        La base estesa $\pazocal{B}= \{1,~~2,~~5\}$ è ancora <strong>duale ammissibile</strong>, perché i costi ridotti $\bar c_3 = -1$ e $\bar c_4 = -2$ non cambiano, ma <u>non</u> è primale ammissibile, perché $\bar b_5 = -4 < 0$. Di conseguenza, usiamo l'<strong>algoritmo del simplesso duale</strong>.

    - La riga pivot è $x_5$. L'unico elemento negativo della sua riga è $\bar a_{54} = -3$, quindi il ratio test gives

        $$
        \frac{\bar c_4}{\bar a_{54}} = \frac{-2}{-3} = \frac{2}{3}
        $$

        e la colonna pivot è $x_4$. Dopo questa sola operazione di pivot duale la base diventa primale ammissibile, e la nuova soluzione ottima è

        $$
        \tilde{\boldsymbol x}(\, LP \,) =
        \begin{pmatrix}
        \frac{10}{3} \\[1ex]
        \frac{10}{3}
        \end{pmatrix}
        \qquad \text{con} \qquad
        z(\, LP \,) = 4 \cdot \frac{10}{3} + 3 \cdot \frac{10}{3} = \frac{70}{3} .
        $$

        !!! chiave ""

            Aggiungere un vincolo non può allargare la regione ammissibile, quindi il valore ottimo di un problema in forma di massimo non può aumentare: infatti $\frac{70}{3} < 26$.
