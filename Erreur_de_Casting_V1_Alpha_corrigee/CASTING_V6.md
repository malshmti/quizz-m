# Casting V6 — 181 profils actifs

## Portée
Les 181 personnages des 51 mangas peuvent désormais produire un résultat. Ils ne sont plus simplement présents dans un registre. La banque reste à 126 questions et le parcours à 75 étapes.

Chaque fiche comporte une période, une motivation, un contrepoint, des motifs et huit valeurs éditoriales. Les noms historiques et les 20 illustrations sont conservés. Les 161 autres résultats présentent une carte typographique, sans URL d’image inexistante ni portrait emprunté à un autre personnage.

## Calcul
Pour chaque facette couverte dans au moins deux contextes, le moteur compare la moyenne des réponses réelles à la valeur éditoriale du personnage. Le score principal est l’opposé de la moyenne des écarts au carré. Les motifs ajoutent 0,06 × tanh(score_motifs / 2). Ce complément départage notamment les profils ayant les mêmes huit valeurs. Ce poids n’a pas été estimé sur une population.

Les motifs restent centrés sur les options proposées. Les épisodes d’une même aventure restent un seul contexte. Les réponses idéales ne modifient ni le classement ni la sélection adaptative. Aucun quota, coefficient par personnage, nom ou identifiant caché ne force un résultat.

## Contrôles effectués
- 181 profils uniques, tous associés à un candidat du registre.
- 12 parcours ciblés par profil, soit 2 172 parcours : chaque personnage sort 12 fois sur 12.
- Ces parcours suivent les facettes et motifs écrits dans sa propre fiche. Ils prouvent l’accessibilité technique, pas la validité de la fiche.
- Rendu réel du JavaScript et export JSON vérifiés pour les 181 résultats, sans navigateur ni Playwright.
- 768 combinaisons narratives, 200 parcours de portraits, 100 parcours de couverture et d’invariance des scores.
- Simulation uniforme indépendante de 1 000 parcours : 88 personnages observés, maximum 88 occurrences. Les réponses aléatoires se compensent et favorisent les profils intermédiaires ; ce n’est pas une population de joueurs.
- 114 changements de résultat sur 500 modifications isolées de réponse. Avec 181 voisins, la stabilité reste un point de vigilance. Ce protocole n’est pas un test-retest humain.

## Provenance et limites
Les fiches sont des interprétations éditoriales rédigées pour le jeu, et non des mesures psychologiques des personnages. Les périodes évitent de mélanger, par exemple, Thorfinn du prologue avec celui de la ferme, ou Trunks enfant avec celui du futur.

Les sources des 20 anciens profils sont conservées. Des repères secondaires d’œuvres et des notes documentaires ciblées ont été ajoutés. Ils ne constituent pas une lecture exhaustive scène par scène des 181 personnages. Le champ evidence_status l’indique, y compris lorsqu’une fiche reste insuffisamment documentée. Aucun numéro de chapitre inventé n’est ajouté.

Habu : le résumé du tome 5 chez le distributeur de Kana atteste le secours à Fukamachi avant la poursuite de l’ascension ; la critique du tome 2 décrit la rivalité avec Hase. Bulma, Krilin et Trunks disposent de repères supplémentaires sur le site officiel Dragon Ball. Ces faits n’attestent pas les valeurs numériques choisies.

L’audit web expose les motivations, contrepoints, périodes, valeurs et limites de chaque fiche. Le rapprochement avec un personnage ne signifie pas que le joueur partage ses actes ou convictions.

## Fichiers
- editorial/casting-v6.txt : fiches éditoriales lisibles, indexées sur le registre stable.
- casting-profils.json : fiches intégrées.
- audit-casting-v6.cjs : générateur de parcours ciblés.
- audit/reachability-v6.json : résultats et parcours reproductibles.
- audit/distribution-v6.json : simulation uniforme.
- audit.html : audit interactif, avec liens vers les données.
- Anciennes données conservées dans audit/dataset-v5.json et ancien moteur dans audit/engine-v5.js.

Les réponses V5 restent compatibles : aucun libellé de question n’a changé pendant l’intégration V6. Le résultat est recalculé avec le casting complet.

## Précision adaptative V6.1
Huit nouvelles situations de précision proposent cinq réactions, dont une option intermédiaire explicite. Les huit premières sélections complètent la couverture des facettes. Les deux dernières privilégient les différences entre les six candidats en tête, avec un coût de répétition. Seules les réponses réelles aux étapes 1–61 sont consultées. Les questions fixes encore à venir sont comptées pour planifier la couverture, jamais comme des réponses observées.

Le score de proximité et les signatures restent identiques à V6. Les parcours ciblés ont été régénérés et les 181 résultats/exportations revérifiés. Les anciennes progressions avec une sélection adaptative V5/V6 restent lisibles.
