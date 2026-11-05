# Erreur de Casting — Bureau des Destins

Un quiz narratif en français : des situations, des choix et un portrait personnel associé à **un personnage de manga**. Une ambiance de bureau administratif décalé, du papier ivoire et des illustrations au trait brut.

## État du projet

- 181 personnages, tous illustrés.
- Une banque de 126 questions et un parcours de 75 étapes avec sélection adaptative.
- Un résultat unique, accompagné de textes tenant compte des réponses.
- Une page d’audit.

Le quiz est une expérience ludique d’introspection, pas un test psychologique validé. La présence de 181 personnages ne signifie pas qu’ils ont tous la même probabilité de sortir.

## Démarrage local

Prérequis : **Node.js 22 ou plus récent**, avec npm.

```sh
npm ci
npm start
```

Ouvrir [le quiz](http://127.0.0.1:4173/) ou [l’audit](http://127.0.0.1:4173/audit.html). Arrêter le serveur avec Ctrl+C. Le port 4173 doit être disponible.

Aucune clé API, aucun compte et aucune dépendance npm d’exécution ne sont nécessaires.

## Commandes

| Commande | Fonction |
| --- | --- |
| `npm start` | Serveur local sur le port 4173 |
| `npm test` | Six suites de vérifications Node, sans navigateur |
| `npm run build` | Génère le site statique dans `dist/` |
| `npm run portraits:sync` | Synchronise les portraits avec les données et le HTML embarqué |

## Organisation

```text
Erreur_de_Casting_V1_Alpha_corrigee/  Application web actuelle
  index.html                       Interface et données embarquées
  engine.js                        Parcours et calcul des résultats
  profile.js                       Construction du portrait final
  refonte.css                      Direction artistique
  jeu_donnees_v10.json              Questions et personnages
  illustrations/                   Images utilisées par le projet
  audit.html                       Consultation de l’audit
  test_*.js                        Vérifications fonctionnelles
audit/                             Rapports et données d’audit
editorial/                         Direction artistique et prompts
scripts/                           Commandes de test et de construction
.github/workflows/                  Validation continue
```

Le nom historique du dossier web est conservé pour préserver les chemins des outils existants. Les scripts `.cjs` à la racine servent au serveur, à la synchronisation des portraits et aux audits. Les anciennes migrations et copies de travail ont été supprimées.

## Publication

Le dépôt est préparé pour GitHub, sans publication automatique. Les ZIP, journaux et anciennes copies de travail sont ignorés. Les illustrations représentent environ **595 Mo** ; prévoir un premier envoi conséquent. Aucune image individuelle ne dépasse 100 Mo.

Pour héberger le site, exécuter `npm run build` puis publier le contenu de `dist/` chez un hébergeur statique. Le serveur local est un outil de développement. Le workflow GitHub vérifie les tests et la construction ; il ne déploie pas le site.

## Contributions

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les conventions, la synchronisation des données et la validation.

## Illustrations et droits

Les portraits ont été générés avec un outil d’IA puis sélectionnés pour la direction artistique du projet. Les prompts sont conservés dans `editorial/portraits-lot-*.json`. Les personnages, noms et univers représentés appartiennent à leurs ayants droit respectifs ; ce projet ne revendique aucune affiliation officielle.

Aucune licence de réutilisation n’est accordée pour le moment. La publication du dépôt ne constitue pas une autorisation de réutiliser le code, les textes ou les illustrations. Une licence du code et une politique distincte pour les contenus pourront être choisies par le propriétaire du projet.

