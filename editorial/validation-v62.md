# Contrôle documentaire et stabilité — 22 octobre 2026

Le score et les illustrations restent inchangés. Aucun test visuel ni Playwright.

L’audit compare maintenant les voisins par distance quadratique sur les huit facettes, qui constituent la composante principale du moteur. Il affiche les axes divergents et signale les signatures identiques. L’ancienne similarité des motifs ne suffisait pas à diagnostiquer les confusions du score.

Le contrôle reproductible `node audit-stability.cjs` modifie séparément chaque réponse de facette sur 100 parcours aléatoires : +1 devient +2 ou inversement, −1 devient −2 ou inversement. Les réponses neutres sont exclues ; la sélection adaptative est figée. Résultat : 451 changements sur 2562 variantes (17,6 %). Ce taux ne décrit ni des réponses humaines ni une fidélité test-retest. Les effectifs par question diffèrent, notamment pour les précisions adaptatives. Aucun seuil arbitraire de réussite n’est imposé.

Deux fiches gagnent une référence éditeur précise : Mori au début du récit (édition VIZ volume 1) et Habu dans le tome 5 chez Kana. Les notes distinguent le comportement décrit, la période et ce que la source ne permet pas de conclure. Elles sont conservées par la régénération de l’audit et visibles dans les fiches.

Travail restant : documenter les autres signatures avec la même précision, examiner les paires indiscernables sur les facettes, puis confronter les rapprochements à des parcours humains cohérents. Les 181 résultats sont accessibles techniquement ; leur pertinence éditoriale n’est pas entièrement validée.
