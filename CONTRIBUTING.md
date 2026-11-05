# Contribuer

Utiliser Node.js 22 ou plus récent. Installer avec `npm ci`, puis lancer `npm start`.

## Modifications

- Conserver les textes en français et des situations compréhensibles et cohérentes.
- Préserver la direction artistique : papier ivoire, traits imparfaits, expressions et poses propres aux personnages.
- Le résultat doit présenter un seul personnage. Les descriptions doivent être reliées aux réponses sans prétendre établir un diagnostic.
- Vérifier les fichiers générés après toute régénération des audits.
- Ne pas ajouter de ZIP, secrets, journaux ou copies complètes du projet.

## Données et portraits

Les données principales sont dans `Erreur_de_Casting_V1_Alpha_corrigee/jeu_donnees_v10.json`. Après modification, exécuter `npm run portraits:sync` pour mettre à jour le JSON embarqué dans `index.html` et `casting-profils.json`. Vérifier le diff : ces fichiers doivent rester synchronisés.

Les images sont dans `illustrations/brut/` sous leur identifiant de personnage. Le synchroniseur préfère une variante `-v2.png` lorsqu’elle existe. Conserver les prompts et les choix éditoriaux dans `editorial/`.

## Vérification

```sh
npm test
npm run build
```

Les suites vérifient notamment les parcours, les résultats, les profils, les données embarquées et les fichiers d’illustration. Elles ne remplacent pas une relecture éditoriale ni une vérification visuelle manuelle. Aucun test Playwright n’est requis.

Dans une proposition de modification, expliquer le problème, le comportement obtenu et les vérifications effectuées. Pour les changements visuels, joindre si possible un aperçu.
