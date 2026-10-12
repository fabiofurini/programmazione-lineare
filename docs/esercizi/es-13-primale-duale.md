---
title: "Esercizi · Il metodo primale-duale"
---

# Esercizi · Il metodo primale-duale

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 13** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 13: Il metodo primale-duale](../metodi-avanzati/13-primale-duale.md) · [:material-file-pdf-box: Eserciziario, volume 4 (PDF)](../pdf/esercizi-4-metodi-avanzati.pdf)

</div>

<a id="esercizio-13-1"></a>

!!! esercizio "Esercizio 13.1: Il metodo primale-duale (PD1)"

    Consideriamo il seguente problema LP in forma standard di minimo con $n=3$ variabili non negative e $m=2$ vincoli lineari di uguaglianza:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\min} & {2} \, {x_1} & {+} & {2} \, {x_2} & {+} & {2} \, {x_3} \\[2ex]
    \text{soggetto a} & \, {x_1} & {+} & \, {x_2} & {+} & {2} \, {x_3} & {=} & {5} \\[2ex]
    & \, {x_1} & {+} & {2} \, {x_2} & {+} & \, {x_3} & {=} & {4} \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3} & {\ge} & {0}
    \end{array}
    $$

    Il suo vettore dei termini noti è non negativo e il suo vettore dei costi è non negativo, quindi ${\boldsymbol \pi} = (0~~0)'$ è una soluzione ammissibile del suo problema duale.

    **Domande**

    - Eseguire il metodo primale-duale a partire da ${\boldsymbol \pi} = (0~~0)'$, mostrando a ogni iterazione l'insieme ammesso, il valore ottimo del primale ristretto e il passo duale.

??? soluzione "Soluzione"

    - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

        Con ${\boldsymbol \pi} = (0~~0)'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = 2,\qquad s_{2} = 2,\qquad s_{3} = 2 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \emptyset$.

        Il primale ristretto $RP(\pazocal{J})$ ha solo le $m$ variabili artificiali, perché nessuna variabile originale è ammessa. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 9 > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~1)'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{1}' {\boldsymbol y} = 2,\qquad {\boldsymbol A}_{2}' {\boldsymbol y} = 3,\qquad {\boldsymbol A}_{3}' {\boldsymbol y} = 3 .
        $$

        <strong>Passo duale.</strong> I candidati sono le colonne non ammesse con ${\boldsymbol A}_j' {\boldsymbol y} > 0$:

        $$
        \theta = \min \left\{~\underbrace{\frac{2}{2}}_{= \, 1},~\underbrace{\frac{2}{3}}_{= \, 2/3},~\underbrace{\frac{2}{3}}_{= \, 2/3}~\right\} = \frac{2}{3} ,
        $$

        realizzato da $j^{\star} = 2,3$. La nuova soluzione duale è

        $$
        {\boldsymbol \pi} \leftarrow (0~~0)' + \frac{2}{3} \cdot (1~~1)' = (\frac{2}{3}~~\frac{2}{3})' ,
        $$

        con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 6$.

    - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

        Con ${\boldsymbol \pi} = (\frac{2}{3}~~\frac{2}{3})'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = \frac{2}{3},\qquad s_{2} = 0,\qquad s_{3} = 0 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \{2,~3\}$.

        Il primale ristretto $RP(\pazocal{J})$ ha le variabili $x_{2}$, $x_{3}$ e le $m$ variabili artificiali. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 0 ,
        $$

        quindi il metodo <strong>si arresta</strong>. Una soluzione ottima di questo problema LP è

        $$
        \tilde x_{1} = 0,~~\tilde x_{2} = 1,~~\tilde x_{3} = 2
        $$

        con valore ottimo ${\boldsymbol c}' \tilde{\boldsymbol x} = 6$. Una soluzione ottima del problema duale è $\tilde{\boldsymbol \pi} = (\frac{2}{3}~~\frac{2}{3})'$, con valore obiettivo ${\boldsymbol b}' \tilde{\boldsymbol \pi} = 6$: i due valori coincidono, in accordo con il teorema della dualità forte.

<a id="esercizio-13-2"></a>

!!! esercizio "Esercizio 13.2: Il metodo primale-duale (PD2)"

    Consideriamo il seguente problema LP in forma standard di minimo con $n=3$ variabili non negative e $m=2$ vincoli lineari di uguaglianza:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\min} & {2} \, {x_1} & {+} & {2} \, {x_2} & {+} & {2} \, {x_3} \\[2ex]
    \text{soggetto a} & \, {x_1} & {+} & \, {x_2} & {+} & \, {x_3} & {=} & {4} \\[2ex]
    & \, {x_1} & {+} & {2} \, {x_2} & {+} & \, {x_3} & {=} & {5} \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3} & {\ge} & {0}
    \end{array}
    $$

    Il suo vettore dei termini noti è non negativo e il suo vettore dei costi è non negativo, quindi ${\boldsymbol \pi} = (0~~0)'$ è una soluzione ammissibile del suo problema duale.

    **Domande**

    - Eseguire il metodo primale-duale a partire da ${\boldsymbol \pi} = (0~~0)'$, mostrando a ogni iterazione l'insieme ammesso, il valore ottimo del primale ristretto e il passo duale.

??? soluzione "Soluzione"

    - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

        Con ${\boldsymbol \pi} = (0~~0)'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = 2,\qquad s_{2} = 2,\qquad s_{3} = 2 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \emptyset$.

        Il primale ristretto $RP(\pazocal{J})$ ha solo le $m$ variabili artificiali, perché nessuna variabile originale è ammessa. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 9 > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~1)'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{1}' {\boldsymbol y} = 2,\qquad {\boldsymbol A}_{2}' {\boldsymbol y} = 3,\qquad {\boldsymbol A}_{3}' {\boldsymbol y} = 2 .
        $$

        <strong>Passo duale.</strong> I candidati sono le colonne non ammesse con ${\boldsymbol A}_j' {\boldsymbol y} > 0$:

        $$
        \theta = \min \left\{~\underbrace{\frac{2}{2}}_{= \, 1},~\underbrace{\frac{2}{3}}_{= \, 2/3},~\underbrace{\frac{2}{2}}_{= \, 1}~\right\} = \frac{2}{3} ,
        $$

        realizzato da $j^{\star} = 2$. La nuova soluzione duale è

        $$
        {\boldsymbol \pi} \leftarrow (0~~0)' + \frac{2}{3} \cdot (1~~1)' = (\frac{2}{3}~~\frac{2}{3})' ,
        $$

        con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 6$.

    - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

        Con ${\boldsymbol \pi} = (\frac{2}{3}~~\frac{2}{3})'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = \frac{2}{3},\qquad s_{2} = 0,\qquad s_{3} = \frac{2}{3} ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \{2\}$.

        Il primale ristretto $RP(\pazocal{J})$ ha le variabili $x_{2}$ e le $m$ variabili artificiali. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = \frac{3}{2} > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~-\frac{1}{2})'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{1}' {\boldsymbol y} = \frac{1}{2},\qquad {\boldsymbol A}_{3}' {\boldsymbol y} = \frac{1}{2} .
        $$

        <strong>Passo duale.</strong> I candidati sono le colonne non ammesse con ${\boldsymbol A}_j' {\boldsymbol y} > 0$:

        $$
        \theta = \min \left\{~\underbrace{\frac{2/3}{1/2}}_{= \, 4/3},~\underbrace{\frac{2/3}{1/2}}_{= \, 4/3}~\right\} = \frac{4}{3} ,
        $$

        realizzato da $j^{\star} = 1,3$. La nuova soluzione duale è

        $$
        {\boldsymbol \pi} \leftarrow (\frac{2}{3}~~\frac{2}{3})' + \frac{4}{3} \cdot (1~~-\frac{1}{2})' = (2~~0)' ,
        $$

        con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 8$.

    - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

        Con ${\boldsymbol \pi} = (2~~0)'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = 0,\qquad s_{2} = 0,\qquad s_{3} = 0 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \{1,~2,~3\}$.

        Il primale ristretto $RP(\pazocal{J})$ ha le variabili $x_{1}$, $x_{2}$, $x_{3}$ e le $m$ variabili artificiali. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 0 ,
        $$

        quindi il metodo <strong>si arresta</strong>. Una soluzione ottima di questo problema LP è

        $$
        \tilde x_{1} = 3,~~\tilde x_{2} = 1,~~\tilde x_{3} = 0
        $$

        con valore ottimo ${\boldsymbol c}' \tilde{\boldsymbol x} = 8$. Una soluzione ottima del problema duale è $\tilde{\boldsymbol \pi} = (2~~0)'$, con valore obiettivo ${\boldsymbol b}' \tilde{\boldsymbol \pi} = 8$: i due valori coincidono, in accordo con il teorema della dualità forte.

<a id="esercizio-13-3"></a>

!!! esercizio "Esercizio 13.3: Il metodo primale-duale (PD3)"

    Consideriamo il seguente problema LP in forma standard di minimo con $n=3$ variabili non negative e $m=2$ vincoli lineari di uguaglianza:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\min} & {2} \, {x_1} & {+} & {3} \, {x_2} & {+} & {4} \, {x_3} \\[2ex]
    \text{soggetto a} & \, {x_1} & {+} & {2} \, {x_2} & {+} & {2} \, {x_3} & {=} & {6} \\[2ex]
    & {2} \, {x_1} & {+} & {2} \, {x_2} & {+} & \, {x_3} & {=} & {2} \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3} & {\ge} & {0}
    \end{array}
    $$

    Il suo vettore dei termini noti è non negativo e il suo vettore dei costi è non negativo, quindi ${\boldsymbol \pi} = (0~~0)'$ è una soluzione ammissibile del suo problema duale.

    **Domande**

    - Eseguire il metodo primale-duale a partire da ${\boldsymbol \pi} = (0~~0)'$, mostrando a ogni iterazione l'insieme ammesso, il valore ottimo del primale ristretto e il passo duale.

??? soluzione "Soluzione"

    - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

        Con ${\boldsymbol \pi} = (0~~0)'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = 2,\qquad s_{2} = 3,\qquad s_{3} = 4 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \emptyset$.

        Il primale ristretto $RP(\pazocal{J})$ ha solo le $m$ variabili artificiali, perché nessuna variabile originale è ammessa. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 8 > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~1)'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{1}' {\boldsymbol y} = 3,\qquad {\boldsymbol A}_{2}' {\boldsymbol y} = 4,\qquad {\boldsymbol A}_{3}' {\boldsymbol y} = 3 .
        $$

        <strong>Passo duale.</strong> I candidati sono le colonne non ammesse con ${\boldsymbol A}_j' {\boldsymbol y} > 0$:

        $$
        \theta = \min \left\{~\underbrace{\frac{2}{3}}_{= \, 2/3},~\underbrace{\frac{3}{4}}_{= \, 3/4},~\underbrace{\frac{4}{3}}_{= \, 4/3}~\right\} = \frac{2}{3} ,
        $$

        realizzato da $j^{\star} = 1$. La nuova soluzione duale è

        $$
        {\boldsymbol \pi} \leftarrow (0~~0)' + \frac{2}{3} \cdot (1~~1)' = (\frac{2}{3}~~\frac{2}{3})' ,
        $$

        con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = \frac{16}{3}$.

    - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

        Con ${\boldsymbol \pi} = (\frac{2}{3}~~\frac{2}{3})'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = 0,\qquad s_{2} = \frac{1}{3},\qquad s_{3} = 2 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \{1\}$.

        Il primale ristretto $RP(\pazocal{J})$ ha le variabili $x_{1}$ e le $m$ variabili artificiali. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 5 > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~-\frac{1}{2})'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{2}' {\boldsymbol y} = 1,\qquad {\boldsymbol A}_{3}' {\boldsymbol y} = \frac{3}{2} .
        $$

        <strong>Passo duale.</strong> I candidati sono le colonne non ammesse con ${\boldsymbol A}_j' {\boldsymbol y} > 0$:

        $$
        \theta = \min \left\{~\underbrace{\frac{1/3}{1}}_{= \, 1/3},~\underbrace{\frac{2}{3/2}}_{= \, 4/3}~\right\} = \frac{1}{3} ,
        $$

        realizzato da $j^{\star} = 2$. La nuova soluzione duale è

        $$
        {\boldsymbol \pi} \leftarrow (\frac{2}{3}~~\frac{2}{3})' + \frac{1}{3} \cdot (1~~-\frac{1}{2})' = (1~~\frac{1}{2})' ,
        $$

        con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 7$.

    - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

        Con ${\boldsymbol \pi} = (1~~\frac{1}{2})'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = 0,\qquad s_{2} = 0,\qquad s_{3} = \frac{3}{2} ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \{1,~2\}$.

        Il primale ristretto $RP(\pazocal{J})$ ha le variabili $x_{1}$, $x_{2}$ e le $m$ variabili artificiali. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 4 > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~-1)'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{3}' {\boldsymbol y} = 1 .
        $$

        <strong>Passo duale.</strong> I candidati sono le colonne non ammesse con ${\boldsymbol A}_j' {\boldsymbol y} > 0$:

        $$
        \theta = \min \left\{~\underbrace{\frac{3/2}{1}}_{= \, 3/2}~\right\} = \frac{3}{2} ,
        $$

        realizzato da $j^{\star} = 3$. La nuova soluzione duale è

        $$
        {\boldsymbol \pi} \leftarrow (1~~\frac{1}{2})' + \frac{3}{2} \cdot (1~~-1)' = (\frac{5}{2}~~-1)' ,
        $$

        con valore obiettivo duale ${\boldsymbol b}' {\boldsymbol \pi} = 13$.

    - <span style="color:#e03131"><strong>Iterazione 4</strong></span>

        Con ${\boldsymbol \pi} = (\frac{5}{2}~~-1)'$ gli scarti duali $s_j = c_j - {\boldsymbol A}_j' {\boldsymbol \pi}$ sono

        $$
        s_{1} = \frac{3}{2},\qquad s_{2} = 0,\qquad s_{3} = 0 ,
        $$

        quindi l'insieme ammesso è $\pazocal{J} = \{2,~3\}$.

        Il primale ristretto $RP(\pazocal{J})$ ha le variabili $x_{2}$, $x_{3}$ e le $m$ variabili artificiali. Il suo valore ottimo è

        $$
        \xi(\pazocal{J}) = 2 > 0 .
        $$

        La soluzione ottima di $DRP(\pazocal{J})$ è ${\boldsymbol y} = (1~~-2)'$, e per le colonne non ammesse abbiamo

        $$
        {\boldsymbol A}_{1}' {\boldsymbol y} = -3 ,
        $$

        che è non positivo, e non ci sono altre colonne non ammesse. Di conseguenza $\theta$ può crescere senza limite: il problema duale è <strong>illimitato</strong> e questo problema LP è <strong>inammissibile</strong>.
