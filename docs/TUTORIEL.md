# Tutoriel — Tester la Methode KUATE

**Auteur : Joel Parfait**  
**Duree estimee : 15 minutes**

Ce tutoriel vous guide pas a pas pour installer, initialiser et utiliser la Methode KUATE dans un projet test. Aucune connaissance prealable n'est requise.

---

## Prerequis

Verifiez que vous avez Node.js 20 ou superieur :

```bash
node --version
# Attendu : v20.x.x ou superieur
```

---

## Etape 1 — Installer la CLI

Depuis la racine du depot :

```bash
npm install
npm run build
```

Puis liez la CLI localement pour pouvoir utiliser la commande `kuate` :

```bash
npm link --workspace=packages/cli
```

Verifiez l'installation :

```bash
kuate --version
# Attendu : 1.0.0

kuate --help
# Attendu : liste de toutes les commandes
```

---

## Etape 2 — Creer un dossier de test

```bash
mkdir mon-projet-test
cd mon-projet-test
```

---

## Etape 3 — Verifier le diagnostic

Avant d'initialiser, verifiez que tout est en ordre :

```bash
kuate doctor
```

Resultat attendu :

```
  KUATE DOCTOR — Diagnostic du projet

  Node.js >= 20          v20.x.x
  npm >= 9               v10.x.x
  .kuate/ present        Lancez kuate init pour initialiser
  config.yaml valide     Projet non initialise
  Agents generes         kuate init requis
  Contexte .kuate/...    kuate init requis

  3 avertissement(s)
```

Les avertissements disparaitront apres l'etape suivante.

---

## Etape 4 — Initialiser la Methode KUATE

```bash
kuate init
```

Le wizard interactif vous posera les questions suivantes. Suivez les reponses suggerees pour ce tutoriel :

```
Nom du projet ?
> MonProjetTest

Langue de travail ?
> Francais

Methodologie ?
> Agile / Scrum

Domaines d'agents a installer ?
> [x] Dev Software
```

Apres validation, vous verrez :

```
6 agents generes (Agile/Scrum, fr)

Methode KUATE initialisee avec succes

Tapez kuate help pour commencer
```

---

## Etape 5 — Explorer la structure generee

```bash
ls .kuate/
# agents/  config.yaml  context/

ls .kuate/agents/
# architecte-solution.md  dev-senior.md  expert-devops.md
# expert-securite.md  qa-strategist.md  tech-lead.md

cat .kuate/config.yaml
```

Contenu attendu de `config.yaml` :

```yaml
project: MonProjetTest
lang: fr
method: agile
domains:
  - dev
version: 1.0.0
agents:
  - architecte-solution
  - dev-senior
  - expert-devops
  - expert-securite
  - qa-strategist
  - tech-lead
```

---

## Etape 6 — Lister les agents installes

```bash
kuate agent list
```

Resultat attendu (extrait) :

```
  AGENTS DISPONIBLES

  DOMAINE DEV SOFTWARE
  --------------------------------------------------
  architecte-solution     A   Concoit une architecture systeme scalable (TOGAF)
  dev-senior              T   Implemente avec TDD et clean code
  expert-devops           T   CI/CD, Docker, Kubernetes, automatisation
  ...
```

---

## Etape 7 — Obtenir la fiche d'un agent

```bash
kuate agent info architecte-solution
```

Resultat attendu :

```
  Architecte Solution / Solution Architect
  ID: architecte-solution
  Phase KUATE : A
  Domaine : dev
  FR : Concoit une architecture systeme scalable (TOGAF)
  EN : Designs scalable system architecture (TOGAF-aware)
```

---

## Etape 8 — Copier un prompt d'agent

```bash
kuate agent use dev-senior
```

Le prompt est maintenant dans votre presse-papier. Ouvrez Claude, ChatGPT ou Gemini et collez le contenu. L'agent se presentera et attendra votre question de developpement.

Pour voir le contenu du prompt directement :

```bash
cat .kuate/agents/dev-senior.md
```

---

## Etape 9 — Explorer les workflows

```bash
kuate workflow list
```

Resultat attendu (extrait) :

```
  WORKFLOWS — Methode KUATE

  Phase K — Connaitre
  o discovery-interview       Entretien de decouverte utilisateur
  o market-analysis           Analyse de marche et concurrents

  Phase U — Unifier
  v sprint-planning           Planification du sprint
  v backlog-grooming          Affinage du backlog

  Phase T — Transformer
  o feature-implementation    Implementation de fonctionnalite (TDD)
  o code-review               Revue de code structuree
```

Les workflows marques `v` sont actifs pour votre methodologie Agile.

Filtrer par phase :

```bash
kuate workflow list --phase T
```

Voir la fiche d'un workflow :

```bash
kuate workflow show sprint-planning
```

---

## Etape 10 — Tester la memoire persistante

Ajouter une decision d'architecture dans la memoire :

```bash
kuate memory add --section architecture
```

Saisissez par exemple :

```
Next.js 14 choisi comme framework frontend — dec. 2026-06-17
Raison : SSR natif, App Router stable, equipe familiere
```

Verifiez que la decision est enregistree :

```bash
kuate memory show --section architecture
```

Generer un bloc de contexte pour vos sessions IA :

```bash
kuate memory inject
```

Resultat attendu :

```
[CONTEXTE KUATE — MonProjetTest]
Methode: agile | Langue: FR | Agents: 6

ARCHITECTURE: Next.js 14 choisi comme framework frontend...

[FIN CONTEXTE]
```

Copiez ce bloc et collez-le au debut de votre prochaine session Claude ou ChatGPT pour que l'agent connaisse votre contexte.

---

## Etape 11 — Exporter pour Claude

```bash
kuate build --target claude
```

Un fichier `CLAUDE.md` est genere a la racine du projet. Il contient tous vos prompts d'agents consolides, prets pour un Claude Project.

Testez les autres cibles :

```bash
kuate build --target cursor    # Genere .cursorrules
kuate build --target chatgpt   # Genere chatgpt-instructions.json
```

---

## Etape 12 — Mode multi-experts (conseil)

Posez une question a plusieurs agents en meme temps :

```bash
kuate conseil \
  --agents "architecte-solution,expert-securite,tech-lead" \
  --topic "Comment securiser une API REST exposee publiquement ?"
```

Un prompt structurant les trois experts est affiche. Copiez-le dans Claude ou ChatGPT pour obtenir trois perspectives d'experts synthetisees.

Avec sauvegarde dans la memoire :

```bash
kuate conseil \
  --agents "architecte-solution,expert-securite" \
  --topic "Architecture microservices vs monolithe pour V1 ?" \
  --save
```

La session est enregistree dans `.kuate/context/architecture.md`.

---

## Etape 13 — Verifier la configuration

```bash
kuate config show
```

Resultat attendu :

```
  CONFIGURATION KUATE
  ----------------------------------------
  project   MonProjetTest
  lang      fr
  method    agile
  domains   dev
  version   1.0.0
  agents    6 installes
```

---

## Etape 14 — Relancer le diagnostic

```bash
kuate doctor
```

Resultat attendu apres initialisation complete :

```
  KUATE DOCTOR — Diagnostic du projet

  Node.js >= 20          v20.x.x
  npm >= 9               v10.x.x
  .kuate/ present
  config.yaml valide     projet: MonProjetTest, methode: agile
  Agents generes         6 agent(s)
  Contexte .kuate/...

  Tout est en ordre.
```

---

## Flux de travail typique

Voici comment utiliser KUATE au quotidien sur un projet reel :

**Au debut d'une session de travail :**

```bash
kuate memory inject
# Copiez le bloc dans votre session IA
```

**Pour une decision d'architecture :**

```bash
kuate conseil \
  --agents "architecte-solution,expert-securite" \
  --topic "Votre question ici" \
  --save
```

**Pour implémenter une fonctionnalite :**

```bash
kuate agent use dev-senior
# Collez dans Claude/ChatGPT et decrivez votre tache
```

**Pour preparer un sprint :**

```bash
kuate agent use coach-agile
kuate workflow show sprint-planning
```

**Pour deployer :**

```bash
kuate workflow show deployment-checklist
kuate agent use expert-devops
```

---

## Agents recommandes par cas d'usage

| Situation | Agent recommande |
|---|---|
| Concevoir une architecture | `architecte-solution` |
| Ecrire du code propre | `dev-senior` |
| Mettre en place CI/CD | `expert-devops` |
| Auditer la securite | `expert-securite` |
| Definir une strategie de tests | `qa-strategist` |
| Faire une revue de code | `tech-lead` |
| Optimiser les performances | `expert-performance` |
| Integrer un LLM | `expert-ia-ml` |
| Planifier un projet | `chef-projet` |
| Animer un sprint | `coach-agile` |
| Rediger des exigences | `business-analyst` |
| Rediger de la documentation | `copywriter-technique` |
| Optimiser le SEO | `expert-seo` |
| Concevoir une formation | `concepteur-pedagogique` |

---

## Problemes courants

**"Aucun projet KUATE trouve"**

Vous n'etes pas dans un dossier initialise. Lancez `kuate init` ou deplacez-vous dans le bon repertoire.

**"Agent X non genere"**

L'agent n'est pas inclus dans votre methodologie. Verifiez avec `kuate agent list` quels agents sont installes.

**"Missing helper: eq"**

Vous utilisez une ancienne version du build. Relancez `npm run build` depuis la racine.

---

## Prochaines etapes

- Parcourez les prompts generes dans `.kuate/agents/` pour comprendre comment chaque agent est construit
- Modifiez les fichiers dans `.kuate/context/` directement avec votre editeur pour enrichir la memoire
- Testez une autre methodologie en creant un second dossier et en relancant `kuate init` avec `pmbok` ou `okr`
- Combinez plusieurs agents avec `kuate conseil` pour obtenir des analyses multi-perspectives

---

**Joel Parfait — Methode KUATE v1.0.0 — 2026**
