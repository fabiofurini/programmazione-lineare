---
title: "Esercizi · La geometria della programmazione lineare"
---

# Esercizi · La geometria della programmazione lineare

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 15** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 15: La geometria della programmazione lineare](../metodi-avanzati/15-geometria.md) · [:material-file-pdf-box: Eserciziario, volume 4 (PDF)](../pdf/esercizi-4-metodi-avanzati.pdf)

</div>

<a id="esercizio-15-1"></a>

!!! esercizio "Esercizio 15.1: La geometria della programmazione lineare (P2)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili e $m=2$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & \, {x_1} & {+} & {3} \, {x_2} \\[2ex]
    \text{soggetto a} & {-4} \, {x_1} & {+} & {10} \, {x_2} & {\le} & {35} \\[2ex]
    & {3} \, {x_1} & {+} & \, {x_2} & {\le} & {12} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

    **Domande**

    1. Determinare la dimensione della regione ammissibile $F$ e dire se è a dimensione piena.

    2. Determinare le faccette e i vertici di $F$.

    3. Scrivere la sua forma standard di massimo, elencare tutte le basi e dire quali di esse sono associate a una soluzione di base ammissibile. Verificare la corrispondenza con i vertici trovati nella domanda precedente.

??? soluzione "Soluzione"

    - La regione ammissibile è

        $$
        F = \left\{~ \begin{pmatrix} x_1 \\[0.5ex] x_2 \end{pmatrix} \in \R^2 :
        -4x_1 + 10x_2 \le 35,~~ 3x_1 + x_2 \le 12,~~ x_1 \ge 0,~~ x_2 \ge 0 ~\right\} .
        $$

        Il punto $\begin{pmatrix} 1 \\ 1 \end{pmatrix}$ soddisfa tutti e quattro i vincoli in senso stretto, quindi un piccolo disco centrato in esso è contenuto in $F$: abbiamo $\dim(F) = 2$ e $F$ è <strong>a dimensione piena</strong>.

    - Poiché $\dim(F) = 2$, le sue faccette sono le facce di dimensione $1$, cioè i suoi spigoli, e i suoi vertici sono le facce di dimensione $0$. Ciascuno dei quattro vincoli definisce una faccetta, e i vertici sono

        $$
        \begin{pmatrix} 0 \\ 0 \end{pmatrix}, \qquad
        \begin{pmatrix} 4 \\ 0 \end{pmatrix}, \qquad
        \begin{pmatrix} \frac{5}{2} \\[0.5ex] \frac{9}{2} \end{pmatrix}, \qquad
        \begin{pmatrix} 0 \\[0.5ex] \frac{7}{2} \end{pmatrix} .
        $$

        ![Figura 1](../img/es-15-geometria/fig01.svg){ .fig .cornice loading=lazy  }

    - Aggiungendo $m=2$ variabili di scarto otteniamo la forma standard di massimo con $n+m=4$ variabili non negative e $m=2$ vincoli lineari di uguaglianza. Una base è un sottoinsieme di $2$ indici su $4$, e ci sono $\binom{4}{2} = 6$ sottoinsiemi di questo tipo, che danno tutti una matrice invertibile:

        <div class="tabella" markdown="0"><table>
        <tr>
        <th><span class="arithmatex">\(\pazocal{B}\)</span></th>
        <th><span class="arithmatex">\({\boldsymbol x}_{\pazocal{B}}\)</span></th>
        <th>ammissibile</th>
        <th>vertice <span class="arithmatex">\((x_1,x_2)\)</span></th>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{1,2\}\)</span></td>
        <td><span class="arithmatex">\(\left(\frac{5}{2},~\frac{9}{2}\right)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\(\left(\frac{5}{2},\frac{9}{2}\right)\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{1,3\}\)</span></td>
        <td><span class="arithmatex">\((4,~51)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\((4,0)\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{1,4\}\)</span></td>
        <td><span class="arithmatex">\(\left(-\frac{35}{4},~\frac{153}{4}\right)\)</span></td>
        <td></td>
        <td></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{2,3\}\)</span></td>
        <td><span class="arithmatex">\((12,~-85)\)</span></td>
        <td></td>
        <td></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{2,4\}\)</span></td>
        <td><span class="arithmatex">\(\left(\frac{7}{2},~\frac{17}{2}\right)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\(\left(0,\frac{7}{2}\right)\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{3,4\}\)</span></td>
        <td><span class="arithmatex">\((35,~12)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\((0,0)\)</span></td>
        </tr>
        </table></div>

        Esattamente $4$ delle $6$ basi sono ammissibili, e corrispondono ai $4$ vertici trovati nella domanda precedente. La corrispondenza è <strong>biunivoca</strong>, perché nessuna soluzione di base ammissibile è degenere.

<a id="esercizio-15-2"></a>

!!! esercizio "Esercizio 15.2: La geometria della programmazione lineare (G2)"

    Consideriamo il seguente problema LP in forma standard di massimo con $n=3$ variabili non negative e $m=1$ vincolo lineare di uguaglianza:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & {2} \, {x_1} & {+} & {2} \, {x_2} & {+} & \, {x_3} \\[2ex]
    \text{soggetto a} & {2} \, {x_1} & {+} & {3} \, {x_2} & {+} & \, {x_3} & {=} & {4} \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3} & { \ge} & { 0 }
    \end{array}
    $$

    **Domande**

    1. Determinare la dimensione della regione ammissibile $F$ e dire se è a dimensione piena.

    2. Determinare i vertici di $F$ enumerando tutte le basi.

    3. Determinare l'insieme delle soluzioni ottime e dire se è una faccia di $F$.

??? soluzione "Soluzione"

    - Tutti i punti di $F$ soddisfano il vincolo di uguaglianza $2x_1 + 3x_2 + x_3 = 4$, quindi $\mathrm{aff}(F)$ è contenuto in tale piano:

        $$
        \dim(F) \; \le \; n - \rank({\boldsymbol A}) = 3 - 1 = 2 .
        $$

        I tre punti $\begin{pmatrix} 2 \\ 0 \\ 0\end{pmatrix}$, $\begin{pmatrix} 0 \\ \frac{4}{3} \\ 0\end{pmatrix}$ e $\begin{pmatrix} 0 \\ 0 \\ 4\end{pmatrix}$ appartengono a $F$ e non sono allineati, quindi $\dim(F) = 2$. La regione ammissibile <u>non</u> è quindi a dimensione piena, come accade sempre per la forma standard di massimo.

    - Una base è un sottoinsieme di $m=1$ indice su $n=3$, e ci sono $3$ sottoinsiemi di questo tipo, che danno tutti una matrice invertibile:

        <div class="tabella" markdown="0"><table>
        <tr>
        <th><span class="arithmatex">\(\pazocal{B}\)</span></th>
        <th><span class="arithmatex">\({\boldsymbol x}_{\pazocal{B}}\)</span></th>
        <th>ammissibile</th>
        <th>vertice</th>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{1\}\)</span></td>
        <td><span class="arithmatex">\((2)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\((2,0,0)\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{2\}\)</span></td>
        <td><span class="arithmatex">\(\left(\frac{4}{3}\right)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\(\left(0,\frac{4}{3},0\right)\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(\{3\}\)</span></td>
        <td><span class="arithmatex">\((4)\)</span></td>
        <td>✓</td>
        <td><span class="arithmatex">\((0,0,4)\)</span></td>
        </tr>
        </table></div>

        Tutte e tre le basi sono ammissibili, quindi $F$ ha esattamente tre vertici: è un triangolo.

    - I valori obiettivo nei tre vertici sono

        $$
        2 \cdot 2 = 4, \qquad 2 \cdot \frac{4}{3} = \frac{8}{3}, \qquad 1 \cdot 4 = 4 ,
        $$

        quindi il valore ottimo è $z(\, LP \,) = 4$, raggiunto in due vertici. Per l'osservazione sulle soluzioni ottime multiple, ogni punto del segmento che li unisce è ottimo:

        $$
        \left\{~ \lambda \begin{pmatrix} 2 \\ 0 \\ 0\end{pmatrix} + (1-\lambda) \begin{pmatrix} 0 \\ 0 \\ 4\end{pmatrix} ~:~ \lambda \in [0,1] ~\right\} .
        $$

        Questo insieme è la <strong>faccia</strong> di $F$ definita dalla disuguaglianza valida $2x_1 + 2x_2 + x_3 \le 4$, e ha dimensione $1$: è uno spigolo del triangolo.

<a id="esercizio-15-3"></a>

!!! esercizio "Esercizio 15.3: La geometria della programmazione lineare (G3)"

    Consideriamo il seguente problema LP in forma canonica di massimo con $n=2$ variabili e $m=4$ vincoli:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & \, {x_1} & {+} & {2} \, {x_2} \\[2ex]
    \text{soggetto a} & \, {x_1} & {+} & \, {x_2} & {\le} & {2} \\[2ex]
    & {-} \, {x_1} & {-} & \, {x_2} & {\le} & {-2} \\[2ex]
    & \, {x_1} & {-} & \, {x_2} & {\le} & {0} \\[2ex]
    & {-} \, {x_1} & {+} & \, {x_2} & {\le} & {0} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & { 0 }
    \end{array}
    $$

    **Domande**

    1. Determinare la regione ammissibile $F$ e la sua dimensione.

    2. Dire quante basi della forma standard di massimo sono associate all'unico punto di $F$, e spiegare perché la corrispondenza tra basi e vertici non è biunivoca.

??? soluzione "Soluzione"

    - I primi due vincoli impongono $x_1 + x_2 \le 2$ e $x_1 + x_2 \ge 2$, cioè $x_1 + x_2 = 2$. Gli ultimi due impongono $x_1 \le x_2$ e $x_1 \ge x_2$, cioè $x_1 = x_2$. Le due uguaglianze danno $x_1 = x_2 = 1$, e quindi

        $$
        F = \left\{ \begin{pmatrix} 1 \\ 1 \end{pmatrix} \right\}
        \qquad {\rm e} \qquad
        \dim(F) = 0 .
        $$

        L'unico punto di $F$ è quindi un vertice (qui il vertice è la faccia $G = F$ stessa, di dimensione $0$), ed è la soluzione ottima, con valore ottimo $z(\, LP \,) = 1 + 2 = 3$.

    - In forma standard di massimo il problema ha $n+m=6$ variabili non negative e $m=4$ vincoli lineari di uguaglianza, e una base è un sottoinsieme di $4$ indici su $6$. Nel punto $\begin{pmatrix} 1 \\ 1 \end{pmatrix}$ tutti e quattro i vincoli sono <u>attivi</u>, quindi tutte e quattro le variabili di scarto assumono il valore $0$. Poiché $x_1 = x_2 = 1 > 0$, ogni base associata a quel punto contiene gli indici $1$ e $2$ delle due variabili strutturali, insieme a due delle quattro variabili di scarto. Delle $\binom{4}{2} = 6$ scelte, $\{1,2,3,4\}$ e $\{1,2,5,6\}$ danno una matrice singolare ${\boldsymbol A}_{\pazocal{B}}$ (le colonne di $x_1$ e $x_2$ ristrette alle righe delle altre due variabili di scarto sono linearmente dipendenti), mentre le restanti quattro sono basi:

        $$
        \{1,2,3,5\}, \qquad \{1,2,3,6\}, \qquad \{1,2,4,5\}, \qquad \{1,2,4,6\} ,
        $$

        cioè <strong>quattro</strong> basi diverse danno lo stesso vertice. In ciascuna di esse due variabili in base assumono il valore $0$: la soluzione di base ammissibile è <strong>degenere</strong>.

        !!! chiave ""

            Ogni soluzione di base ammissibile è un vertice, ma un vertice <u>degenere</u> può essere associato a più basi, come in questo caso: la corrispondenza tra basi e vertici è suriettiva, non biunivoca.
