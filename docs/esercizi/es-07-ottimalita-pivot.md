---
title: "Esercizi · Condizioni di ottimalità e regole di pivot"
---

# Esercizi · Condizioni di ottimalità e regole di pivot

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 7** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 7: Condizioni di ottimalità e regole di pivot](../simplesso/07-ottimalita-pivot.md) · [:material-file-pdf-box: Eserciziario, volume 2 (PDF)](../pdf/esercizi-2-simplesso.pdf)

</div>

<a id="esercizio-7-1"></a>

!!! esercizio "Esercizio 7.1: Algoritmo del simplesso (C1)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=4$ variabili e $m=3$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {53}\; {x_{1}} & {+} & 41\; {x_{2}} & {-} & 204\; {x_{3}} & {-} & 20\; {x_{4}} \\[2ex]
    \text{soggetto a} & {-11} {x_{1}} & {-} & {5} \, {x_{2}} & {+} & {18} \, {x_{3}} & {+} & {2} \, {x_{4}} & {\le} & {0} \\[2ex]
    & {4} {x_{1}} & {+} & {2} \, {x_{2}} & {-} & {8} \, {x_{3}} & {-} & \, {x_{4}} & {\le} & {0} \\[2ex]
    & {11} {x_{1}} & {+} & {5} \, {x_{2}} & {-} & {18} \, {x_{3}} & {-} & {2} \, {x_{4}} & {\le} & {1} \\[2ex]
    & {x_{1},} &  & {x_{2},} &  & {x_{3},} &  & {x_{4}} & { \ge} & { 0 }
    \end{array}
    $$

    Introducendo le variabili di scarto, otteniamo il seguente dizionario iniziale:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_{5}=0} & {+} & 11\, {x_{1}} & {+} & 5\, {x_{2}} & {-} & 18\, {x_{3}} & {-} & 2\, {x_{4}} \\[2ex]
    {x_{6}=0} & {-} & 4 \, {x_{1}} & {-} & 2\, {x_{2}} & {+} & 8 \, {x_{3}} & {+} & {x_{4}} \\[2ex]
    {x_{7}=1} & {-} & 11\, {x_{1}} & {-} & 5\, {x_{2}} & {+} & 18\, {x_{3}} & {+} & 2\, {x_{4}} \\[2ex]
    {z=0} & {+} & 53\, {x_{1}} & {+} & 41\, {x_{2}} & {-} & 204\, {x_{3}} & {-} & 20\, {x_{4}}
    \end{array}
    \end{cases}
    \end{equation*}

    La soluzione di base ammissibile associata è:

    $$
    \bar x_{1}=0,~~
    \bar x_{2}=0,~~
    \bar x_{3}=0,~~
    \bar x_{4}=0,~~
    \bar x_{5}=0,~~
    \bar x_{6}=0,~~
    \bar x_{7}=1
    ~~~\text{di valore   } 0
    $$

    **Domande**

    1. Eseguire l'algoritmo del simplesso per trovare una soluzione ottima di questo problema LP. Scegliere come colonna pivot quella con il costo ridotto maggiore. Quando esistono due o più righe pivot, usare la variabile in base associata al vincolo di indice minimo (in ogni operazione di pivot la colonna pivot prende il vincolo della riga pivot; inizialmente $x_{5}$, $x_{6}$ e $x_{7}$ sono associate rispettivamente ai vincoli 1, 2 e 3).

    2. Eseguire l'algoritmo del simplesso per trovare una soluzione ottima di questo problema LP. Scegliere la colonna pivot e la riga pivot utilizzando la regola di Bland.

??? soluzione "Soluzione"

    1. - <span style="color:#e03131"><strong>Inizializzazione</strong></span>

            Consideriamo il dizionario iniziale:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{5}=0} & {+} & 11\, {x_{1}} & {+} & 5\, {x_{2}} & {-} & 18\, {x_{3}} & {-} & 2\, {x_{4}} \\[2ex]
            {x_{6}=0} & {-} & 4 \, {x_{1}} & {-} & 2\, {x_{2}} & {+} & 8 \, {x_{3}} & {+} & {x_{4}} \\[2ex]
            {x_{7}=1} & {-} & 11\, {x_{1}} & {-} & 5\, {x_{2}} & {+} & 18\, {x_{3}} & {+} & 2\, {x_{4}} \\[2ex]
            {z=0} & {+} & 53\, {x_{1}} & {+} & 41\, {x_{2}} & {-} & 204\, {x_{3}} & {-} & 20\, {x_{4}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{5,6,7\}$ e $\pazocal{N}=\{1,2,3,4\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{5}=0,~~
            \bar x_{6}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{1}=0,~~
            \bar x_{2}=0,~~
            \bar x_{3}=0,~~
            \bar x_{4}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

            Il costo ridotto maggiore è quello associato alla variabile fuori base $x_{1}$. Quindi, se aumentiamo il valore della variabile $x_{1}$, possiamo ottenere una soluzione migliore. Abbiamo:

            $$
            \begin{cases}
            x_{5} &= 0 + 11\: x_{1} \\[2ex]
            x_{6} &= 0 - 4\: x_{1} \\[2ex]
            x_{7} &= 1 - 11\: x_{1}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{ 0 + 11\: x_{1} \ge 0}_{x_{5} \ge 0} \\[2ex]
            \underbrace{ 0 - 4\: x_{1} \ge 0}_{x_{6} \ge 0} \\[2ex]
            \underbrace{ 1 - 11\: x_{1} \ge 0}_{x_{7} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{1} &\ge 0 \\[2ex]
            x_{1} &\le 0 \\[2ex]
            x_{1} &\le \dfrac{1}{11}
            \end{cases}
            $$

            Aumentando il valore di $x_{1}$ fino a $\min\left\{0,\dfrac{1}{11}\right\}=0$, il valore di $x_{6}$ scende a 0. Questa è un'operazione di pivot degenere, poiché il valore della funzione obiettivo non aumenta.

            Abbiamo quindi che:

            - $x_{1}$ entra in base e di conseguenza $x_{6}$ esce dalla base

            Abbiamo:

            $$
            x_{6}=0 -4\: x_{1} -2\: x_{2}+8\: x_{3}+x_{4} \text{    allora     } x_{1}= -\dfrac{1}{2}\: x_{2}+2\: x_{3}+\dfrac{1}{4}\: x_{4}-\dfrac{1}{4}\: x_{6}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{5}&=11\left(-\dfrac{1}{2}x_{2}+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\right)+5x_{2}-18x_{3}-2x_{4}\\
            &=-\dfrac{1}{2}x_{2}+4x_{3}+\dfrac{3}{4}x_{4}-\dfrac{11}{4}x_{6}\\[1ex]
            x_{7}&=1-11\left(-\dfrac{1}{2}x_{2}+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\right)-5x_{2}+18x_{3}+2x_{4}\\
            &=1+\dfrac{1}{2}x_{2}-4x_{3}-\dfrac{3}{4}x_{4}+\dfrac{11}{4}x_{6}\\[1ex]
            z&=53\left(-\dfrac{1}{2}x_{2}+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\right)+41x_{2}-204x_{3}-20x_{4}\\
            &=\dfrac{29}{2}x_{2}-98x_{3}-\dfrac{27}{4}x_{4}-\dfrac{53}{4}x_{6}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{1}=0} & {-} & {\frac{1}{2}} {x_{2}} & {+} & 2 \, {x_{3}} & {+} & {\frac{1}{4}} \, {x_{4}} & {-} & {\frac{1}{4}} \, {x_{6}} \\[2ex]
            {x_{5}=0} & {-} & {\frac{1}{2}} {x_{2}} & {+} & 4\, {x_{3}} & {+} & {\frac{3}{4}} \, {x_{4}} & {-} & {\frac{11}{4}}\, {x_{6}} \\[2ex]
            {x_{7}=1} & {+} & {\frac{1}{2}} {x_{2}} & {-} & 4\, {x_{3}} & {-} & {\frac{3}{4}} \, {x_{4}} & {+} & {\frac{11}{4}} \, {x_{6}} \\[2ex]
            {z=0} & {+} & {\frac{29}{2}} {x_{2}} & {-} & 98\, {x_{3}} & {-} & {\frac{27}{4}} \, {x_{4}} & {-} & {\frac{53}{4}} \, {x_{6}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,5,7\}$ e $\pazocal{N}=\{2,3,4,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{1}=0,~~
            \bar x_{5}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{2}=0,~~
            \bar x_{3}=0,~~
            \bar x_{4}=0,~~
            \bar x_{6}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_{2}$. Abbiamo:

            $$
            \begin{cases}
            x_{1} &= 0 - \dfrac{1}{2}\: x_{2} \\[2ex]
            x_{5} &= 0 - \dfrac{1}{2}\: x_{2} \\[2ex]
            x_{7} &= 1 + \dfrac{1}{2}\: x_{2}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\: x_{2} \ge 0}_{x_{1} \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{2}\: x_{2} \ge 0}_{x_{5} \ge 0} \\[2ex]
            \underbrace{1 + \dfrac{1}{2}\: x_{2} \ge 0}_{x_{7} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{2} &\le 0 \\[2ex]
            x_{2} &\le 0 \\[2ex]
            x_{2} &\ge -2
            \end{cases}
            $$

            Aumentando il valore di $x_{2}$ fino a $0$, sia $x_{1}$ sia $x_{5}$ restano uguali a 0. Poiché esistono due righe pivot, usiamo la variabile in base associata al vincolo di indice minimo: $x_{5}$ è associata al vincolo 1, mentre $x_{1}$ è associata al vincolo 2 (ha sostituito $x_{6}$). Quindi $x_{5}$ è la riga pivot.

            Abbiamo quindi che:

            - $x_{2}$ entra in base e di conseguenza $x_{5}$ esce dalla base

            Abbiamo:

            $$
            x_{5}=0-\dfrac{1}{2}\:x_{2}+4\:x_{3}+\dfrac{3}{4}\:x_{4}-\dfrac{11}{4}\:x_{6} \text{    allora     } x_{2}= -2\:x_{5}+8\:x_{3}+\dfrac{3}{2}\:x_{4}-\dfrac{11}{2}\:x_{6}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{1}&= -\dfrac{1}{2}\left(-2x_{5}+8x_{3}+\dfrac{3}{2}x_{4}-\dfrac{11}{2}x_{6}\right)+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\\
            &=x_{5}-2x_{3}-\dfrac{1}{2}x_{4}+\dfrac{5}{2}x_{6}\\[1ex]
            x_{7}&=1+\dfrac{1}{2}\left(-2x_{5}+8x_{3}+\dfrac{3}{2}x_{4}-\dfrac{11}{2}x_{6}\right)-4x_{3}-\dfrac{3}{4}x_{4}+\dfrac{11}{4}x_{6}\\
            &=1-x_{5}\\[1ex]
            z&=\dfrac{29}{2}\left(-2x_{5}+8x_{3}+\dfrac{3}{2}x_{4}-\dfrac{11}{2}x_{6}\right)-98x_{3}-\dfrac{27}{4}x_{4}-\dfrac{53}{4}x_{6}\\
            &=-29x_{5}+18x_{3}+15x_{4}-93x_{6}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{1}=0} & {+} & {x_{5}} & {-} & 2\, {x_{3}} & {-} & {\frac{1}{2}} \, {x_{4}} & {+} & {\frac{5}{2}} \, {x_{6}} \\[2ex]
            {x_{2}=0} & {-} & 2 \, {x_{5}} & {+} & 8 \, {x_{3}} & {+} & {\frac{3}{2}} \, {x_{4}} & {-} & {\frac{11}{2}} \, {x_{6}} \\[2ex]
            {x_{7}=1} & {-} & {x_{5}} \\[2ex]
            {z=0} & {-} & 29 \, {x_{5}} & {+} & 18\, {x_{3}} & {+} & {15} \, {x_{4}} & {-} & {93} \, {x_{6}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,2,7\}$ e $\pazocal{N}=\{3,4,5,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{1}=0,~~
            \bar x_{2}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{3}=0,~~
            \bar x_{4}=0,~~
            \bar x_{5}=0,~~
            \bar x_{6}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_{3}$. Abbiamo:

            $$
            \begin{cases}
            x_{1} &= 0 -2\:x_{3} \\[2ex]
            x_{2} &= 0 +8\:x_{3}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 -2\:x_{3} \ge 0}_{x_{1} \ge 0} \\[2ex]
            \underbrace{0 +8\:x_{3} \ge 0}_{x_{2} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{3} &\le 0 \\[2ex]
            x_{3} &\ge 0
            \end{cases}
            $$

            Aumentando il valore di $x_{3}$ fino a $0$, il valore di $x_{1}$ scende a 0. Anche questa è un'operazione di pivot degenere.

            Abbiamo quindi che:

            - $x_{3}$ entra in base e di conseguenza $x_{1}$ esce dalla base

            Abbiamo:

            $$
            x_{1}=0+x_{5}-2\:x_{3}-\dfrac{1}{2}\:x_{4}+\dfrac{5}{2}\:x_{6} \text{    allora     } x_{3}= \dfrac{1}{2}\:x_{5}-\dfrac{1}{2}\:x_{1}-\dfrac{1}{4}\:x_{4}+\dfrac{5}{4}\:x_{6}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{2}&=-2x_{5}+8\left(\dfrac{1}{2}x_{5}-\dfrac{1}{2}x_{1}-\dfrac{1}{4}x_{4}+\dfrac{5}{4}x_{6}\right)+\dfrac{3}{2}x_{4}-\dfrac{11}{2}x_{6}\\
            &=2x_{5}-4x_{1}-\dfrac{1}{2}x_{4}+\dfrac{9}{2}x_{6}\\[1ex]
            z&=-29x_{5}+18\left(\dfrac{1}{2}x_{5}-\dfrac{1}{2}x_{1}-\dfrac{1}{4}x_{4}+\dfrac{5}{4}x_{6}\right)+15x_{4}-93x_{6}\\
            &=-20x_{5}-9x_{1}+\dfrac{21}{2}x_{4}-\dfrac{141}{2}x_{6}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{2}=0} & {+} & 2\, {x_{5}} & {-} & 4\, {x_{1}} & {-} & {\frac{1}{2}} \, {x_{4}} & {+} & {\frac{9}{2}} \, {x_{6}} \\[2ex]
            {x_{3}=0} & {+} & {\frac{1}{2}} {x_{5}} & {-} & {\frac{1}{2}} \, {x_{1}} & {-} & {\frac{1}{4}} \, {x_{4}} & {+} & {\frac{5}{4}} \, {x_{6}} \\[2ex]
            {x_{7}=1} & {-} & {x_{5}} \\[2ex]
            {z=0} & {-} & 20 \, {x_{5}} & {-} & 9 \, {x_{1}} & {+} & {\frac{21}{2}} \, {x_{4}} & {-} & {\frac{141}{2}}\, {x_{6}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{2,3,7\}$ e $\pazocal{N}=\{1,4,5,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{2}=0,~~
            \bar x_{3}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{1}=0,~~
            \bar x_{4}=0,~~
            \bar x_{5}=0,~~
            \bar x_{6}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 4</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_{4}$. Abbiamo:

            $$
            \begin{cases}
            x_{2} &= 0 - \dfrac{1}{2}\:x_{4} \\[2ex]
            x_{3} &= 0 - \dfrac{1}{4}\:x_{4}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\:x_{4} \ge 0}_{x_{2} \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{4}\:x_{4} \ge 0}_{x_{3} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{4} &\le 0 \\[2ex]
            x_{4} &\le 0
            \end{cases}
            $$

            Aumentando il valore di $x_{4}$ fino a $0$, sia $x_{2}$ sia $x_{3}$ restano uguali a 0. La variabile in base $x_{2}$ è associata al vincolo 1 (ha sostituito $x_{5}$), mentre $x_{3}$ è associata al vincolo 2 (ha sostituito $x_{1}$). Quindi $x_{2}$ è la riga pivot.

            Abbiamo quindi che:

            - $x_{4}$ entra in base e di conseguenza $x_{2}$ esce dalla base

            Abbiamo:

            $$
            x_{2}=0+2\:x_{5}-4\:x_{1}-\dfrac{1}{2}\:x_{4}+\dfrac{9}{2}\:x_{6} \text{    allora     } x_{4}=4\:x_{5}-8\:x_{1}-2\:x_{2}+9\:x_{6}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{3}&=\dfrac{1}{2}x_{5}-\dfrac{1}{2}x_{1}-\dfrac{1}{4}\left(4x_{5}-8x_{1}-2x_{2}+9x_{6}\right)+\dfrac{5}{4}x_{6}\\
            &=-\dfrac{1}{2}x_{5}+\dfrac{3}{2}x_{1}+\dfrac{1}{2}x_{2}-x_{6}\\[1ex]
            z&=-20x_{5}-9x_{1}+\dfrac{21}{2}\left(4x_{5}-8x_{1}-2x_{2}+9x_{6}\right)-\dfrac{141}{2}x_{6}\\
            &=22x_{5}-93x_{1}-21x_{2}+24x_{6}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{3}=0} & {-} & {\frac{1}{2}} {x_{5}} & {+} & {\frac{3}{2}} \, {x_{1}} & {+} & {\frac{1}{2}} \, {x_{2}} & {-} & {x_{6}} \\[2ex]
            {x_{4}=0} & {+} & 4 \, {x_{5}} & {-} & 8\, {x_{1}} & {-} & 2\, {x_{2}} & {+} & 9 {x_{6}} \\[2ex]
            {x_{7}=1} & {-} & {x_{5}} \\[2ex]
            {z=0} & {+} & 22\, {x_{5}} & {-} & 93\, {x_{1}} & {-} & 21\, {x_{2}} & {+} & 24\, {x_{6}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{3,4,7\}$ e $\pazocal{N}=\{1,2,5,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{3}=0,~~
            \bar x_{4}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{1}=0,~~
            \bar x_{2}=0,~~
            \bar x_{5}=0,~~
            \bar x_{6}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 5</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_{6}$. Abbiamo:

            $$
            \begin{cases}
            x_{3} &= 0 - x_{6} \\[2ex]
            x_{4} &= 0 +9\:x_{6}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - x_{6} \ge 0}_{x_{3} \ge 0} \\[2ex]
            \underbrace{0 +9\:x_{6} \ge 0}_{x_{4} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{6} &\le 0 \\[2ex]
            x_{6} &\ge 0
            \end{cases}
            $$

            Aumentando il valore di $x_{6}$ fino a $0$, il valore di $x_{3}$ scende a 0. Questa è un'operazione di pivot degenere.

            Abbiamo quindi che:

            - $x_{6}$ entra in base e di conseguenza $x_{3}$ esce dalla base

            Abbiamo:

            $$
            x_{3}=0-\dfrac{1}{2}\:x_{5}+\dfrac{3}{2}\:x_{1}+\dfrac{1}{2}\:x_{2}-x_{6} \text{    allora     } x_{6}= -\dfrac{1}{2}\:x_{5}+\dfrac{3}{2}\:x_{1}+\dfrac{1}{2}\:x_{2}-x_{3}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{4}&=4x_{5}-8x_{1}-2x_{2}+9\left(-\dfrac{1}{2}x_{5}+\dfrac{3}{2}x_{1}+\dfrac{1}{2}x_{2}-x_{3}\right)\\
            &=-\dfrac{1}{2}x_{5}+\dfrac{11}{2}x_{1}+\dfrac{5}{2}x_{2}-9x_{3}\\[1ex]
            z&=22x_{5}-93x_{1}-21x_{2}+24\left(-\dfrac{1}{2}x_{5}+\dfrac{3}{2}x_{1}+\dfrac{1}{2}x_{2}-x_{3}\right)\\
            &=10x_{5}-57x_{1}-9x_{2}-24x_{3}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{4}=0} & {-} & {\frac{1}{2}} \, {x_{5}} & {+} & {\frac{11}{2}} \, {x_{1}} & {+} & {\frac{5}{2}} \, {x_{2}} & {-} & 9\, {x_{3}} \\[2ex]
            {x_{6}=0} & {-} & {\frac{1}{2}} \; {x_{5}} & {+} & {\frac{3}{2}} \; {x_{1}} & {+} & {\frac{1}{2}} \, {x_{2}} & {-} & {x_{3}} \\[2ex]
            {x_{7}=1} & {-} & {x_{5}} \\[2ex]
            {z=0} & {+} & 10\, {x_{5}} & {-} & 57\; {x_{1}} & {-} & 9\, {x_{2}} & {-} & 24\, {x_{3}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{4,6,7\}$ e $\pazocal{N}=\{1,2,3,5\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{4}=0,~~
            \bar x_{6}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{1}=0,~~
            \bar x_{2}=0,~~
            \bar x_{3}=0,~~
            \bar x_{5}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 6</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_{5}$. Abbiamo:

            $$
            \begin{cases}
            x_{4} &= 0 - \dfrac{1}{2}\:x_{5} \\[2ex]
            x_{6} &= 0 - \dfrac{1}{2}\:x_{5} \\[2ex]
            x_{7} &= 1 - x_{5}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\:x_{5} \ge 0}_{x_{4} \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{2}\:x_{5} \ge 0}_{x_{6} \ge 0} \\[2ex]
            \underbrace{1 - x_{5} \ge 0}_{x_{7} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{5} &\le 0 \\[2ex]
            x_{5} &\le 0 \\[2ex]
            x_{5} &\le 1
            \end{cases}
            $$

            Aumentando il valore di $x_{5}$ fino a $0$, sia $x_{4}$ sia $x_{6}$ restano uguali a 0. La variabile in base $x_{4}$ è associata al vincolo 1 (ha sostituito $x_{2}$), mentre $x_{6}$ è associata al vincolo 2 (ha sostituito $x_{3}$). Quindi $x_{4}$ è la riga pivot.

            Abbiamo quindi che:

            - $x_{5}$ entra in base e di conseguenza $x_{4}$ esce dalla base

            Abbiamo:

            $$
            x_{4}=0-\dfrac{1}{2}\:x_{5}+\dfrac{11}{2}\:x_{1}+\dfrac{5}{2}\:x_{2}-9\:x_{3} \text{    allora     } x_{5}=11\:x_{1}+5\:x_{2}-18\:x_{3}-2\:x_{4}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{6}&=-\dfrac{1}{2}\left(11x_{1}+5x_{2}-18x_{3}-2x_{4}\right)+\dfrac{3}{2}x_{1}+\dfrac{1}{2}x_{2}-x_{3}\\
            &=-4x_{1}-2x_{2}+8x_{3}+x_{4}\\[1ex]
            x_{7}&=1-\left(11x_{1}+5x_{2}-18x_{3}-2x_{4}\right)\\
            &=1-11x_{1}-5x_{2}+18x_{3}+2x_{4}\\[1ex]
            z&=10\left(11x_{1}+5x_{2}-18x_{3}-2x_{4}\right)-57x_{1}-9x_{2}-24x_{3}\\
            &=53x_{1}+41x_{2}-204x_{3}-20x_{4}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{5}=0} & {+} & 11\, {x_{1}} & {+} & 5\, {x_{2}} & {-} & 18\, {x_{3}} & {-} & 2\, {x_{4}} \\[2ex]
            {x_{6}=0} & {-} & 4 \, {x_{1}} & {-} & 2\, {x_{2}} & {+} & 8 \, {x_{3}} & {+} & {x_{4}} \\[2ex]
            {x_{7}=1} & {-} & 11\, {x_{1}} & {-} & 5\, {x_{2}} & {+} & 18\, {x_{3}} & {+} & 2\, {x_{4}} \\[2ex]
            {z=0} & {+} & 53\, {x_{1}} & {+} & 41\, {x_{2}} & {-} & 204\, {x_{3}} & {-} & 20\, {x_{4}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{5,6,7\}$ e $\pazocal{N}=\{1,2,3,4\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{5}=0,~~
            \bar x_{6}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{1}=0,~~
            \bar x_{2}=0,~~
            \bar x_{3}=0,~~
            \bar x_{4}=0
            ~~~\text{di valore   } 0
            $$

            <strong>Questo dizionario coincide con quello iniziale e l'algoritmo del simplesso cicla.</strong>

    2. Eseguiamo ora l'algoritmo del simplesso utilizzando la regola di pivot di Bland. Quindi, tra le variabili fuori base con costo ridotto positivo, scegliamo quella di indice minimo. Se è possibile più di una variabile uscente, scegliamo la variabile in base di indice minimo.

        - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

            Nel dizionario iniziale, i costi ridotti positivi sono associati a $x_{1}$ e $x_{2}$. La regola di Bland seleziona $x_{1}$. Come nella precedente esecuzione, il test dei rapporti dà $x_{6}$ come variabile uscente.

            Abbiamo quindi che:

            - $x_{1}$ entra in base e di conseguenza $x_{6}$ esce dalla base

            Abbiamo:

            $$
            x_{6}=0 -4\: x_{1} -2\: x_{2}+8\: x_{3}+x_{4} \text{    allora     } x_{1}= -\dfrac{1}{2}\: x_{2}+2\: x_{3}+\dfrac{1}{4}\: x_{4}-\dfrac{1}{4}\: x_{6}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{5}&=11\left(-\dfrac{1}{2}x_{2}+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\right)+5x_{2}-18x_{3}-2x_{4}\\
            &=-\dfrac{1}{2}x_{2}+4x_{3}+\dfrac{3}{4}x_{4}-\dfrac{11}{4}x_{6}\\[1ex]
            x_{7}&=1-11\left(-\dfrac{1}{2}x_{2}+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\right)-5x_{2}+18x_{3}+2x_{4}\\
            &=1+\dfrac{1}{2}x_{2}-4x_{3}-\dfrac{3}{4}x_{4}+\dfrac{11}{4}x_{6}\\[1ex]
            z&=53\left(-\dfrac{1}{2}x_{2}+2x_{3}+\dfrac{1}{4}x_{4}-\dfrac{1}{4}x_{6}\right)+41x_{2}-204x_{3}-20x_{4}\\
            &=\dfrac{29}{2}x_{2}-98x_{3}-\dfrac{27}{4}x_{4}-\dfrac{53}{4}x_{6}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{1}=0} & {-} & {\frac{1}{2}} {x_{2}} & {+} & 2 \, {x_{3}} & {+} & {\frac{1}{4}} \, {x_{4}} & {-} & {\frac{1}{4}} \, {x_{6}} \\[2ex]
            {x_{5}=0} & {-} & {\frac{1}{2}} {x_{2}} & {+} & 4\, {x_{3}} & {+} & {\frac{3}{4}} \, {x_{4}} & {-} & {\frac{11}{4}}\, {x_{6}} \\[2ex]
            {x_{7}=1} & {+} & {\frac{1}{2}} {x_{2}} & {-} & 4\, {x_{3}} & {-} & {\frac{3}{4}} \, {x_{4}} & {+} & {\frac{11}{4}} \, {x_{6}} \\[2ex]
            {z=0} & {+} & {\frac{29}{2}} {x_{2}} & {-} & 98\, {x_{3}} & {-} & {\frac{27}{4}} \, {x_{4}} & {-} & {\frac{53}{4}} \, {x_{6}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,5,7\}$ e $\pazocal{N}=\{2,3,4,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{1}=0,~~
            \bar x_{5}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{2}=0,~~
            \bar x_{3}=0,~~
            \bar x_{4}=0,~~
            \bar x_{6}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

            L'unico costo ridotto positivo è quello associato a $x_{2}$. Abbiamo:

            $$
            \begin{cases}
            x_{1} &= 0 - \dfrac{1}{2}\:x_{2} \\[2ex]
            x_{5} &= 0 - \dfrac{1}{2}\:x_{2} \\[2ex]
            x_{7} &= 1 + \dfrac{1}{2}\:x_{2}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\:x_{2} \ge 0}_{x_{1} \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{2}\:x_{2} \ge 0}_{x_{5} \ge 0} \\[2ex]
            \underbrace{1 + \dfrac{1}{2}\:x_{2} \ge 0}_{x_{7} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{2} &\le 0 \\[2ex]
            x_{2} &\le 0 \\[2ex]
            x_{2} &\ge -2
            \end{cases}
            $$

            Aumentando il valore di $x_{2}$ fino a $0$, sia $x_{1}$ sia $x_{5}$ restano uguali a 0. La regola di Bland seleziona $x_{1}$ come variabile uscente, poiché ha l'indice minimo tra le possibili variabili uscenti.

            Abbiamo quindi che:

            - $x_{2}$ entra in base e di conseguenza $x_{1}$ esce dalla base

            Abbiamo:

            $$
            x_{1}=0-\dfrac{1}{2}\:x_{2}+2\:x_{3}+\dfrac{1}{4}\:x_{4}-\dfrac{1}{4}\:x_{6} \text{    allora     } x_{2}= -2\:x_{1}+4\:x_{3}+\dfrac{1}{2}\:x_{4}-\dfrac{1}{2}\:x_{6}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo il seguente dizionario:

            \begin{align*}
            x_{5}&=-\dfrac{1}{2}\left(-2x_{1}+4x_{3}+\dfrac{1}{2}x_{4}-\dfrac{1}{2}x_{6}\right)+4x_{3}+\dfrac{3}{4}x_{4}-\dfrac{11}{4}x_{6}\\
            &=x_{1}+2x_{3}+\dfrac{1}{2}x_{4}-\dfrac{5}{2}x_{6}\\[1ex]
            x_{7}&=1+\dfrac{1}{2}\left(-2x_{1}+4x_{3}+\dfrac{1}{2}x_{4}-\dfrac{1}{2}x_{6}\right)-4x_{3}-\dfrac{3}{4}x_{4}+\dfrac{11}{4}x_{6}\\
            &=1-x_{1}-2x_{3}-\dfrac{1}{2}x_{4}+\dfrac{5}{2}x_{6}\\[1ex]
            z&=\dfrac{29}{2}\left(-2x_{1}+4x_{3}+\dfrac{1}{2}x_{4}-\dfrac{1}{2}x_{6}\right)-98x_{3}-\dfrac{27}{4}x_{4}-\dfrac{53}{4}x_{6}\\
            &=-29x_{1}-40x_{3}+\dfrac{1}{2}x_{4}-\dfrac{41}{2}x_{6}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{2}=0} & {-} & 2 \, {x_{1}} & {+} & 4 \, {x_{3}} & {+} & {\frac{1}{2}} \, {x_{4}} & {-} & {\frac{1}{2}} \, {x_{6}} \\[2ex]
            {x_{5}=0} & {+} & {x_{1}} & {+} & 2\, {x_{3}} & {+} & {\frac{1}{2}} \, {x_{4}} & {-} & {\frac{5}{2}} \, {x_{6}} \\[2ex]
            {x_{7}=1} & {-} & {x_{1}} & {-} & 2\, {x_{3}} & {-} & {\frac{1}{2}} \, {x_{4}} & {+} & {\frac{5}{2}} \, {x_{6}} \\[2ex]
            {z=0} & {-} & 29 \, {x_{1}} & {-} & 40\, {x_{3}} & {+} & {\frac{1}{2}} \, {x_{4}} & {-} & {\frac{41}{2}} \, {x_{6}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{2,5,7\}$ e $\pazocal{N}=\{1,3,4,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_{2}=0,~~
            \bar x_{5}=0,~~
            \bar x_{7}=1,~~~~~
            \bar x_{1}=0,~~
            \bar x_{3}=0,~~
            \bar x_{4}=0,~~
            \bar x_{6}=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

            L'unico costo ridotto positivo è quello associato a $x_{4}$. Abbiamo:

            $$
            \begin{cases}
            x_{2} &= 0 + \dfrac{1}{2}\:x_{4} \\[2ex]
            x_{5} &= 0 + \dfrac{1}{2}\:x_{4} \\[2ex]
            x_{7} &= 1 - \dfrac{1}{2}\:x_{4}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 + \dfrac{1}{2}\:x_{4} \ge 0}_{x_{2} \ge 0} \\[2ex]
            \underbrace{0 + \dfrac{1}{2}\:x_{4} \ge 0}_{x_{5} \ge 0} \\[2ex]
            \underbrace{1 - \dfrac{1}{2}\:x_{4} \ge 0}_{x_{7} \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_{4} &\ge 0 \\[2ex]
            x_{4} &\ge 0 \\[2ex]
            x_{4} &\le 2
            \end{cases}
            $$

            Aumentando il valore di $x_{4}$ fino a $2$, il valore di $x_{7}$ scende a 0.

            Abbiamo quindi che:

            - $x_{4}$ entra in base e di conseguenza $x_{7}$ esce dalla base

            Abbiamo:

            $$
            x_{7}=1-x_{1}-2\:x_{3}-\dfrac{1}{2}\:x_{4}+\dfrac{5}{2}\:x_{6} \text{    allora     } x_{4}=2-2\:x_{1}-4\:x_{3}+5\:x_{6}-2\:x_{7}.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo un dizionario ottimo:

            \begin{align*}
            x_{2}&=-2x_{1}+4x_{3}+\dfrac{1}{2}\left(2-2x_{1}-4x_{3}+5x_{6}-2x_{7}\right)-\dfrac{1}{2}x_{6}\\
            &=1-3x_{1}+2x_{3}+2x_{6}-x_{7}\\[1ex]
            x_{5}&=x_{1}+2x_{3}+\dfrac{1}{2}\left(2-2x_{1}-4x_{3}+5x_{6}-2x_{7}\right)-\dfrac{5}{2}x_{6}\\
            &=1-x_{7}\\[1ex]
            z&=-29x_{1}-40x_{3}+\dfrac{1}{2}\left(2-2x_{1}-4x_{3}+5x_{6}-2x_{7}\right)-\dfrac{41}{2}x_{6}\\
            &=1-30x_{1}-42x_{3}-18x_{6}-x_{7}
            \end{align*}

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_{2}=1} & {-} & 3 \; {x_{1}} & {+} & 2 \; {x_{3}} & {+} & 2 \, {x_{6}} & {-} & {x_{7}} \\[2ex]
            {x_{4}=2} & {-} & 2 \; {x_{1}} & {-} & 4 \; {x_{3}} & {+} & 5 \, {x_{6}} & {-} & 2 {x_{7}} \\[2ex]
            {x_{5}=1} &  &  &  &  &  &  & {-} & {x_{7}} \\[2ex]
            {z=1} & {-} & 30\, {x_{1}} & {-} & 42\, {x_{3}} & {-} & 18\, {x_{6}} & {-} & \, {x_{7}}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{2,4,5\}$ e $\pazocal{N}=\{1,3,6,7\}$. Poiché tutti i costi ridotti sono non positivi, non è possibile alcun ulteriore miglioramento. La soluzione di base ottima è:

            $$
            \tilde x_{2}=1,~~
            \tilde x_{4}=2,~~
            \tilde x_{5}=1,~~
            \tilde x_{1}=0,~~
            \tilde x_{3}=0,~~
            \tilde x_{6}=0,~~
            \tilde x_{7}=0
            ~~~\text{di valore   } 1
            $$

<a id="esercizio-7-2"></a>

!!! esercizio "Esercizio 7.2: Algoritmo del simplesso (C2)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=4$ variabili e $m=3$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & 10\; {x_1} & {-} & 57\; {x_2} & {-} & 9\; {x_3} & {-} & 24\; {x_4} \\[2ex]
    \text{soggetto a} & {\frac{1}{2}} {x_1} & {-} & {\frac{11}{2}} \, {x_2} & {-} & {\frac{5}{2}} \, {x_3} & {+} & {9} \, {x_4} & {\le} & {0} \\[2ex]
    & {\frac{1}{2}} {x_1} & {-} & {\frac{3}{2}} \, {x_2} & {-} & {\frac{1}{2}} \, {x_3} & {+} & \, {x_4} & {\le} & {0} \\[2ex]
    & {x_1} &  &  &  &  &  &  & {\le} & {1} \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & { \ge} & { 0 }
    \end{array}
    $$

    Introducendo le variabili di scarto, otteniamo il seguente dizionario iniziale:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_5=0} & {-} & {\frac{1}{2}} \, {x_1} & {+} & {\frac{11}{2}} \, {x_2} & {+} & {\frac{5}{2}} \, {x_3} & {-} & 9\, {x_4} \\[2ex]
    {x_6=0} & {-} & {\frac{1}{2}} \; {x_1} & {+} & {\frac{3}{2}} \; {x_2} & {+} & {\frac{1}{2}} \, {x_3} & {-} & {x_4} \\[2ex]
    {x_7=1} & {-} & {x_1} \\[2ex]
    {z=0} & {+} & 10\, {x_1} & {-} & 57\; {x_2} & {-} & 9\, {x_3} & {-} & 24\, {x_4}
    \end{array}
    \end{cases}
    \end{equation*}

    La soluzione di base ammissibile associata è:

    $$
    \bar x_5=0,~~
    \bar x_6=0,~~
    \bar x_7=1,~~~~~
    \bar x_1=0,~~
    \bar x_2=0,~~
    \bar x_3=0,~~
    \bar x_4=0
    ~~~\text{di valore   } 0
    $$

    **Domande**

    1. Eseguire l'algoritmo del simplesso per trovare una soluzione ottima di questo problema LP. Scegliere come colonna pivot quella con il costo ridotto maggiore. Quando esistono due o più righe pivot, usare quella di indice minimo.

    2. Eseguire l'algoritmo del simplesso per trovare una soluzione ottima di questo problema LP. Scegliere la colonna pivot e la riga pivot utilizzando la regola di Bland.

??? soluzione "Soluzione"

    1. - <span style="color:#e03131"><strong>Inizializzazione</strong></span>

            Consideriamo il dizionario iniziale:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_5=0} & {-} & {\frac{1}{2}} \, {x_1} & {+} & {\frac{11}{2}} \, {x_2} & {+} & {\frac{5}{2}} \, {x_3} & {-} & 9\, {x_4} \\[2ex]
            {x_6=0} & {-} & {\frac{1}{2}} \; {x_1} & {+} & {\frac{3}{2}} \; {x_2} & {+} & {\frac{1}{2}} \, {x_3} & {-} & {x_4} \\[2ex]
            {x_7=1} & {-} & {x_1} \\[2ex]
            {z=0} & {+} & 10\, {x_1} & {-} & 57\; {x_2} & {-} & 9\, {x_3} & {-} & 24\, {x_4}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{5,6,7\}$ e $\pazocal{N}=\{1,2,3,4\}$. La soluzione di base ammissibile è:

            $$
            \bar x_5=0,~~
            \bar x_6=0,~~
            \bar x_7=1,~~~~~
            \bar x_1=0,~~
            \bar x_2=0,~~
            \bar x_3=0,~~
            \bar x_4=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

            Il costo ridotto maggiore è quello associato alla variabile fuori base $x_1$. Quindi, se aumentiamo il valore della variabile $x_1$, possiamo ottenere una soluzione migliore. Abbiamo:

            $$
            \begin{cases}
            x_5 &= 0 - \dfrac{1}{2}\: x_1 \\[2ex]
            x_6 &= 0 - \dfrac{1}{2}\: x_1 \\[2ex]
            x_7 &= 1 - x_1
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\: x_1 \ge 0}_{x_5 \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{2}\: x_1 \ge 0}_{x_6 \ge 0} \\[2ex]
            \underbrace{1 - x_1 \ge 0}_{x_7 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_1 &\le 0 \\[2ex]
            x_1 &\le 0 \\[2ex]
            x_1 &\le 1
            \end{cases}
            $$

            Aumentando il valore di $x_1$ fino a $0$, sia $x_5$ sia $x_6$ restano uguali a 0. Poiché esistono due righe pivot, usiamo quella di indice minimo, e quindi $x_5$ è la riga pivot. Questa è un'operazione di pivot degenere, poiché il valore della funzione obiettivo non aumenta.

            Abbiamo quindi che:

            - $x_1$ entra in base e di conseguenza $x_5$ esce dalla base

            Abbiamo:

            $$
            x_5= -\dfrac{1}{2}x_1+\dfrac{11}{2}x_2+\dfrac{5}{2}x_3-9x_4
            \text{    allora     }
            x_1=11x_2+5x_3-18x_4-2x_5.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_6&=-\dfrac{1}{2}(11x_2+5x_3-18x_4-2x_5)+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_4\\
            &=-4x_2-2x_3+8x_4+x_5\\[1ex]
            x_7&=1-(11x_2+5x_3-18x_4-2x_5)=1-11x_2-5x_3+18x_4+2x_5\\[1ex]
            z&=10(11x_2+5x_3-18x_4-2x_5)-57x_2-9x_3-24x_4\\
            &=53x_2+41x_3-204x_4-20x_5
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_1=0} & {+} & 11\, {x_2} & {+} & 5\, {x_3} & {-} & 18\, {x_4} & {-} & 2\, {x_5} \\[2ex]
            {x_6=0} & {-} & 4 \, {x_2} & {-} & 2\, {x_3} & {+} & 8 \, {x_4} & {+} & {x_5} \\[2ex]
            {x_7=1} & {-} & 11\, {x_2} & {-} & 5\, {x_3} & {+} & 18\, {x_4} & {+} & 2\, {x_5} \\[2ex]
            {z=0} & {+} & 53\, {x_2} & {+} & 41\, {x_3} & {-} & 204\, {x_4} & {-} & 20\, {x_5}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,6,7\}$ e $\pazocal{N}=\{2,3,4,5\}$. La soluzione di base ammissibile è:

            $$
            \bar x_1=0,~~
            \bar x_6=0,~~
            \bar x_7=1,~~~~~
            \bar x_2=0,~~
            \bar x_3=0,~~
            \bar x_4=0,~~
            \bar x_5=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_2$. Abbiamo:

            $$
            \begin{cases}
            x_1 &= 0 + 11\: x_2 \\[2ex]
            x_6 &= 0 - 4\: x_2 \\[2ex]
            x_7 &= 1 - 11\: x_2
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 + 11\: x_2 \ge 0}_{x_1 \ge 0} \\[2ex]
            \underbrace{0 - 4\: x_2 \ge 0}_{x_6 \ge 0} \\[2ex]
            \underbrace{1 - 11\: x_2 \ge 0}_{x_7 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_2 &\ge 0 \\[2ex]
            x_2 &\le 0 \\[2ex]
            x_2 &\le \dfrac{1}{11}
            \end{cases}
            $$

            Aumentando il valore di $x_2$ fino a $\min\left\{0,\dfrac{1}{11}\right\}=0$, il valore di $x_6$ resta uguale a 0, e $x_6$ è l'unica riga pivot. Anche questa è un'operazione di pivot degenere.

            Abbiamo quindi che:

            - $x_2$ entra in base e di conseguenza $x_6$ esce dalla base

            Abbiamo:

            $$
            x_6=-4x_2-2x_3+8x_4+x_5
            \text{    allora     }
            x_2=-\dfrac{1}{2}x_3+2x_4+\dfrac{1}{4}x_5-\dfrac{1}{4}x_6.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_1&=11\left(-\dfrac{1}{2}x_3+2x_4+\dfrac{1}{4}x_5-\dfrac{1}{4}x_6\right)+5x_3-18x_4-2x_5\\
            &=-\dfrac{1}{2}x_3+4x_4+\dfrac{3}{4}x_5-\dfrac{11}{4}x_6\\[1ex]
            x_7&=1-11\left(-\dfrac{1}{2}x_3+2x_4+\dfrac{1}{4}x_5-\dfrac{1}{4}x_6\right)-5x_3+18x_4+2x_5\\
            &=1+\dfrac{1}{2}x_3-4x_4-\dfrac{3}{4}x_5+\dfrac{11}{4}x_6\\[1ex]
            z&=53\left(-\dfrac{1}{2}x_3+2x_4+\dfrac{1}{4}x_5-\dfrac{1}{4}x_6\right)+41x_3-204x_4-20x_5\\
            &=\dfrac{29}{2}x_3-98x_4-\dfrac{27}{4}x_5-\dfrac{53}{4}x_6
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_1=0} & {-} & {\frac{1}{2}} {x_3} & {+} & 4\, {x_4} & {+} & {\frac{3}{4}} \, {x_5} & {-} & {\frac{11}{4}}\, {x_6} \\[2ex]
            {x_2=0} & {-} & {\frac{1}{2}} {x_3} & {+} & 2 \, {x_4} & {+} & {\frac{1}{4}} \, {x_5} & {-} & {\frac{1}{4}} \, {x_6} \\[2ex]
            {x_7=1} & {+} & {\frac{1}{2}} {x_3} & {-} & 4\, {x_4} & {-} & {\frac{3}{4}} \, {x_5} & {+} & {\frac{11}{4}} \, {x_6} \\[2ex]
            {z=0} & {+} & {\frac{29}{2}} {x_3} & {-} & 98\, {x_4} & {-} & {\frac{27}{4}} \, {x_5} & {-} & {\frac{53}{4}} \, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,2,7\}$ e $\pazocal{N}=\{3,4,5,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_1=0,~~
            \bar x_2=0,~~
            \bar x_7=1,~~~~~
            \bar x_3=0,~~
            \bar x_4=0,~~
            \bar x_5=0,~~
            \bar x_6=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

            L'unico costo ridotto positivo è quello associato a $x_3$. Abbiamo:

            $$
            \begin{cases}
            x_1 &= 0 - \dfrac{1}{2}\: x_3 \\[2ex]
            x_2 &= 0 - \dfrac{1}{2}\: x_3 \\[2ex]
            x_7 &= 1 + \dfrac{1}{2}\: x_3
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\: x_3 \ge 0}_{x_1 \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{2}\: x_3 \ge 0}_{x_2 \ge 0} \\[2ex]
            \underbrace{1 + \dfrac{1}{2}\: x_3 \ge 0}_{x_7 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_3 &\le 0 \\[2ex]
            x_3 &\le 0 \\[2ex]
            x_3 &\ge -2
            \end{cases}
            $$

            Aumentando il valore di $x_3$ fino a $0$, sia $x_1$ sia $x_2$ restano uguali a 0. Poiché esistono due righe pivot, usiamo quella di indice minimo, e quindi $x_1$ è la riga pivot.

            Abbiamo quindi che:

            - $x_3$ entra in base e di conseguenza $x_1$ esce dalla base

            Abbiamo:

            $$
            x_1=-\dfrac{1}{2}x_3+4x_4+\dfrac{3}{4}x_5-\dfrac{11}{4}x_6
            \text{    allora     }
            x_3=-2x_1+8x_4+\dfrac{3}{2}x_5-\dfrac{11}{2}x_6.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_2&=-\dfrac{1}{2}\left(-2x_1+8x_4+\dfrac{3}{2}x_5-\dfrac{11}{2}x_6\right)+2x_4+\dfrac{1}{4}x_5-\dfrac{1}{4}x_6\\
            &=x_1-2x_4-\dfrac{1}{2}x_5+\dfrac{5}{2}x_6\\[1ex]
            z&=\dfrac{29}{2}\left(-2x_1+8x_4+\dfrac{3}{2}x_5-\dfrac{11}{2}x_6\right)-98x_4-\dfrac{27}{4}x_5-\dfrac{53}{4}x_6\\
            &=-29x_1+18x_4+15x_5-93x_6
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_2=0} & {+} & {x_1} & {-} & 2\, {x_4} & {-} & {\frac{1}{2}} \, {x_5} & {+} & {\frac{5}{2}} \, {x_6} \\[2ex]
            {x_3=0} & {-} & 2 \, {x_1} & {+} & 8 \, {x_4} & {+} & {\frac{3}{2}} \, {x_5} & {-} & {\frac{11}{2}} \, {x_6} \\[2ex]
            {x_7=1} & {-} & {x_1} \\[2ex]
            {z=0} & {-} & 29 \, {x_1} & {+} & 18\, {x_4} & {+} & {15} \, {x_5} & {-} & {93} \, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{2,3,7\}$ e $\pazocal{N}=\{1,4,5,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_2=0,~~
            \bar x_3=0,~~
            \bar x_7=1,~~~~~
            \bar x_1=0,~~
            \bar x_4=0,~~
            \bar x_5=0,~~
            \bar x_6=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 4</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_4$. Abbiamo:

            $$
            \begin{cases}
            x_2 &= 0 - 2\: x_4 \\[2ex]
            x_3 &= 0 + 8\: x_4
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - 2\: x_4 \ge 0}_{x_2 \ge 0} \\[2ex]
            \underbrace{0 + 8\: x_4 \ge 0}_{x_3 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_4 &\le 0 \\[2ex]
            x_4 &\ge 0
            \end{cases}
            $$

            Aumentando il valore di $x_4$ fino a $0$, il valore di $x_2$ resta uguale a 0, e $x_2$ è l'unica riga pivot ($x_7$ non dipende da $x_4$).

            Abbiamo quindi che:

            - $x_4$ entra in base e di conseguenza $x_2$ esce dalla base

            Abbiamo:

            $$
            x_2=x_1-2x_4-\dfrac{1}{2}x_5+\dfrac{5}{2}x_6
            \text{    allora     }
            x_4=\dfrac{1}{2}x_1-\dfrac{1}{2}x_2-\dfrac{1}{4}x_5+\dfrac{5}{4}x_6.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_3&=-2x_1+8\left(\dfrac{1}{2}x_1-\dfrac{1}{2}x_2-\dfrac{1}{4}x_5+\dfrac{5}{4}x_6\right)+\dfrac{3}{2}x_5-\dfrac{11}{2}x_6\\
            &=2x_1-4x_2-\dfrac{1}{2}x_5+\dfrac{9}{2}x_6\\[1ex]
            z&=-29x_1+18\left(\dfrac{1}{2}x_1-\dfrac{1}{2}x_2-\dfrac{1}{4}x_5+\dfrac{5}{4}x_6\right)+15x_5-93x_6\\
            &=-20x_1-9x_2+\dfrac{21}{2}x_5-\dfrac{141}{2}x_6
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_3=0} & {+} & 2\, {x_1} & {-} & 4\, {x_2} & {-} & {\frac{1}{2}} \, {x_5} & {+} & {\frac{9}{2}} \, {x_6} \\[2ex]
            {x_4=0} & {+} & {\frac{1}{2}} {x_1} & {-} & {\frac{1}{2}} \, {x_2} & {-} & {\frac{1}{4}} \, {x_5} & {+} & {\frac{5}{4}} \, {x_6} \\[2ex]
            {x_7=1} & {-} & {x_1} \\[2ex]
            {z=0} & {-} & 20 \, {x_1} & {-} & 9 \, {x_2} & {+} & {\frac{21}{2}} \, {x_5} & {-} & {\frac{141}{2}}\, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{3,4,7\}$ e $\pazocal{N}=\{1,2,5,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_3=0,~~
            \bar x_4=0,~~
            \bar x_7=1,~~~~~
            \bar x_1=0,~~
            \bar x_2=0,~~
            \bar x_5=0,~~
            \bar x_6=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 5</strong></span>

            L'unico costo ridotto positivo è quello associato a $x_5$. Abbiamo:

            $$
            \begin{cases}
            x_3 &= 0 - \dfrac{1}{2}\: x_5 \\[2ex]
            x_4 &= 0 - \dfrac{1}{4}\: x_5
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\: x_5 \ge 0}_{x_3 \ge 0} \\[2ex]
            \underbrace{0 - \dfrac{1}{4}\: x_5 \ge 0}_{x_4 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_5 &\le 0 \\[2ex]
            x_5 &\le 0
            \end{cases}
            $$

            Aumentando il valore di $x_5$ fino a $0$, sia $x_3$ sia $x_4$ restano uguali a 0 ($x_7$ non dipende da $x_5$). Poiché esistono due righe pivot, usiamo quella di indice minimo, e quindi $x_3$ è la riga pivot.

            Abbiamo quindi che:

            - $x_5$ entra in base e di conseguenza $x_3$ esce dalla base

            Abbiamo:

            $$
            x_3=2x_1-4x_2-\dfrac{1}{2}x_5+\dfrac{9}{2}x_6
            \text{    allora     }
            x_5=4x_1-8x_2-2x_3+9x_6.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_4&=\dfrac{1}{2}x_1-\dfrac{1}{2}x_2-\dfrac{1}{4}(4x_1-8x_2-2x_3+9x_6)+\dfrac{5}{4}x_6\\
            &=-\dfrac{1}{2}x_1+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_6\\[1ex]
            z&=-20x_1-9x_2+\dfrac{21}{2}(4x_1-8x_2-2x_3+9x_6)-\dfrac{141}{2}x_6\\
            &=22x_1-93x_2-21x_3+24x_6
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_4=0} & {-} & {\frac{1}{2}} {x_1} & {+} & {\frac{3}{2}} \, {x_2} & {+} & {\frac{1}{2}} \, {x_3} & {-} & {x_6} \\[2ex]
            {x_5=0} & {+} & 4 \, {x_1} & {-} & 8\, {x_2} & {-} & 2\, {x_3} & {+} & 9 {x_6} \\[2ex]
            {x_7=1} & {-} & {x_1} \\[2ex]
            {z=0} & {+} & 22\, {x_1} & {-} & 93\, {x_2} & {-} & 21\, {x_3} & {+} & 24\, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{4,5,7\}$ e $\pazocal{N}=\{1,2,3,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_4=0,~~
            \bar x_5=0,~~
            \bar x_7=1,~~~~~
            \bar x_1=0,~~
            \bar x_2=0,~~
            \bar x_3=0,~~
            \bar x_6=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 6</strong></span>

            Il costo ridotto maggiore è ora quello associato a $x_6$. Abbiamo:

            $$
            \begin{cases}
            x_4 &= 0 - x_6 \\[2ex]
            x_5 &= 0 + 9\: x_6
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - x_6 \ge 0}_{x_4 \ge 0} \\[2ex]
            \underbrace{0 + 9\: x_6 \ge 0}_{x_5 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_6 &\le 0 \\[2ex]
            x_6 &\ge 0
            \end{cases}
            $$

            Aumentando il valore di $x_6$ fino a $0$, il valore di $x_4$ resta uguale a 0, e $x_4$ è l'unica riga pivot ($x_7$ non dipende da $x_6$).

            Abbiamo quindi che:

            - $x_6$ entra in base e di conseguenza $x_4$ esce dalla base

            Abbiamo:

            $$
            x_4=-\dfrac{1}{2}x_1+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_6
            \text{    allora     }
            x_6=-\dfrac{1}{2}x_1+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_4.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_5&=4x_1-8x_2-2x_3+9\left(-\dfrac{1}{2}x_1+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_4\right)\\
            &=-\dfrac{1}{2}x_1+\dfrac{11}{2}x_2+\dfrac{5}{2}x_3-9x_4\\[1ex]
            z&=22x_1-93x_2-21x_3+24\left(-\dfrac{1}{2}x_1+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_4\right)\\
            &=10x_1-57x_2-9x_3-24x_4
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_5=0} & {-} & {\frac{1}{2}} \, {x_1} & {+} & {\frac{11}{2}} \, {x_2} & {+} & {\frac{5}{2}} \, {x_3} & {-} & 9\, {x_4} \\[2ex]
            {x_6=0} & {-} & {\frac{1}{2}} \; {x_1} & {+} & {\frac{3}{2}} \; {x_2} & {+} & {\frac{1}{2}} \, {x_3} & {-} & {x_4} \\[2ex]
            {x_7=1} & {-} & {x_1} \\[2ex]
            {z=0} & {+} & 10\, {x_1} & {-} & 57\; {x_2} & {-} & 9\, {x_3} & {-} & 24\, {x_4}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{5,6,7\}$ e $\pazocal{N}=\{1,2,3,4\}$. La soluzione di base ammissibile è:

            $$
            \bar x_5=0,~~
            \bar x_6=0,~~
            \bar x_7=1,~~~~~
            \bar x_1=0,~~
            \bar x_2=0,~~
            \bar x_3=0,~~
            \bar x_4=0
            ~~~\text{di valore   } 0
            $$

            <strong>Questo dizionario coincide con quello iniziale e l'algoritmo del simplesso cicla.</strong>

    2. Eseguiamo ora l'algoritmo del simplesso utilizzando la regola di pivot di Bland. Quindi, tra le variabili fuori base con costo ridotto positivo, scegliamo quella di indice minimo. Se è possibile più di una variabile uscente, scegliamo la variabile in base di indice minimo.

        Le iterazioni 1–5 sono le stesse della precedente esecuzione: in ciascuna di esse, la variabile fuori base con il costo ridotto maggiore è anche quella di indice minimo tra quelle con costo ridotto positivo. Partiamo dal dizionario ottenuto all'Iterazione 5, con $\pazocal{B}=\{4,5,7\}$ e $\pazocal{N}=\{1,2,3,6\}$.

        - <span style="color:#e03131"><strong>Iterazione 6</strong></span>

            In questo dizionario, i costi ridotti positivi sono associati a $x_1$ e $x_6$. La regola di Bland seleziona $x_1$. Abbiamo:

            $$
            \begin{cases}
            x_4 &= 0 - \dfrac{1}{2}\: x_1 \\[2ex]
            x_5 &= 0 + 4\: x_1 \\[2ex]
            x_7 &= 1 - x_1
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 - \dfrac{1}{2}\: x_1 \ge 0}_{x_4 \ge 0} \\[2ex]
            \underbrace{0 + 4\: x_1 \ge 0}_{x_5 \ge 0} \\[2ex]
            \underbrace{1 - x_1 \ge 0}_{x_7 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_1 &\le 0 \\[2ex]
            x_1 &\ge 0 \\[2ex]
            x_1 &\le 1
            \end{cases}
            $$

            Aumentando il valore di $x_1$ fino a $\min\left\{0,1\right\}=0$, il valore di $x_4$ resta uguale a 0, e $x_4$ è l'unica riga pivot. Anche questa è un'operazione di pivot degenere.

            Abbiamo quindi che:

            - $x_1$ entra in base e di conseguenza $x_4$ esce dalla base

            Abbiamo:

            $$
            x_4=-\dfrac{1}{2}x_1+\dfrac{3}{2}x_2+\dfrac{1}{2}x_3-x_6
            \text{    allora     }
            x_1=3x_2+x_3-2x_4-2x_6.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo:

            \begin{align*}
            x_5&=4(3x_2+x_3-2x_4-2x_6)-8x_2-2x_3+9x_6\\
            &=4x_2+2x_3-8x_4+x_6\\[1ex]
            x_7&=1-(3x_2+x_3-2x_4-2x_6)=1-3x_2-x_3+2x_4+2x_6\\[1ex]
            z&=22(3x_2+x_3-2x_4-2x_6)-93x_2-21x_3+24x_6\\
            &=-27x_2+x_3-44x_4-20x_6
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_1=0} & {+} & 3 \, {x_2} & {+} & \, {x_3} & {-} & 2 \, {x_4} & {-} & 2 {x_6} \\[2ex]
            {x_5=0} & {+} & 4 \; {x_2} & {+} & 2 \; {x_3} & {-} & 8 \, {x_4} & {+} & {x_6} \\[2ex]
            {x_7=1} & {-} & 3 \; {x_2} & {-} & \; {x_3} & {+} & 2 \, {x_4} & {+} & 2 {x_6} \\[2ex]
            {z=0} & {-} & 27\, {x_2} & {+} & {x_3} & {-} & 44\, {x_4} & {-} & 20\, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,5,7\}$ e $\pazocal{N}=\{2,3,4,6\}$. La soluzione di base ammissibile è:

            $$
            \bar x_1=0,~~
            \bar x_5=0,~~
            \bar x_7=1,~~~~~
            \bar x_2=0,~~
            \bar x_3=0,~~
            \bar x_4=0,~~
            \bar x_6=0
            ~~~\text{di valore   } 0
            $$

        - <span style="color:#e03131"><strong>Iterazione 7</strong></span>

            L'unico costo ridotto positivo è quello associato a $x_3$. Abbiamo:

            $$
            \begin{cases}
            x_1 &= 0 + x_3 \\[2ex]
            x_5 &= 0 + 2\: x_3 \\[2ex]
            x_7 &= 1 - x_3
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            \underbrace{0 + x_3 \ge 0}_{x_1 \ge 0} \\[2ex]
            \underbrace{0 + 2\: x_3 \ge 0}_{x_5 \ge 0} \\[2ex]
            \underbrace{1 - x_3 \ge 0}_{x_7 \ge 0}
            \end{cases}
            \qquad
            \qquad
            \begin{cases}
            x_3 &\ge 0 \\[2ex]
            x_3 &\ge 0 \\[2ex]
            x_3 &\le 1
            \end{cases}
            $$

            Aumentando il valore di $x_3$ fino a $1$, il valore di $x_7$ scende a 0.

            Abbiamo quindi che:

            - $x_3$ entra in base e di conseguenza $x_7$ esce dalla base

            Abbiamo:

            $$
            x_7=1-3x_2-x_3+2x_4+2x_6
            \text{    allora     }
            x_3=1-3x_2+2x_4+2x_6-x_7.
            $$

            Sostituendo nelle altre equazioni del dizionario, otteniamo un dizionario ottimo:

            \begin{align*}
            x_1&=3x_2+\left(1-3x_2+2x_4+2x_6-x_7\right)-2x_4-2x_6=1-x_7\\[1ex]
            x_5&=4x_2+2\left(1-3x_2+2x_4+2x_6-x_7\right)-8x_4+x_6\\
            &=2-2x_2-4x_4+5x_6-2x_7\\[1ex]
            z&=-27x_2+\left(1-3x_2+2x_4+2x_6-x_7\right)-44x_4-20x_6\\
            &=1-30x_2-42x_4-18x_6-x_7
            \end{align*}

            Il dizionario risultante è:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrrrrrrrr}
            {x_1=1} &  &  &  &  &  &  & {-} & {x_7} \\[2ex]
            {x_3=1} & {-} & 3 \; {x_2} & {+} & 2 \; {x_4} & {+} & 2 \, {x_6} & {-} & {x_7} \\[2ex]
            {x_5=2} & {-} & 2 \; {x_2} & {-} & 4 \; {x_4} & {+} & 5 \, {x_6} & {-} & 2 {x_7} \\[2ex]
            {z=1} & {-} & 30\, {x_2} & {-} & 42{x_4} & {-} & 18\, {x_6} & {-} & \, {x_7}
            \end{array}
            \end{cases}
            \end{equation*}

            dove $\pazocal{B}=\{1,3,5\}$ e $\pazocal{N}=\{2,4,6,7\}$. La soluzione di base ottima è:

            $$
            \tilde x_1=1,~~
            \tilde x_3=1,~~
            \tilde x_5=2,~~
            \tilde x_2=0,~~
            \tilde x_4=0,~~
            \tilde x_6=0,~~
            \tilde x_7=0
            ~~~\text{di valore   } 1
            $$
