import type { AgentDefinition } from '@methode-kuate/core'

export const AGENTS_EDUCATION: AgentDefinition[] = [
  {
    id: 'concepteur-pedagogique',
    name: 'Instructional Designer',
    nameFr: 'Concepteur Pédagogique',
    domain: 'education',
    phase: 'A',
    templateFile: 'concepteur-pedagogique.hbs',
    description: 'ADDIE, Bloom taxonomy, learning design',
    descriptionFr: 'ADDIE, taxonomie de Bloom, design pédagogique',
  },
  {
    id: 'tuteur-ia',
    name: 'AI Tutor',
    nameFr: 'Tuteur IA',
    domain: 'education',
    phase: 'T',
    templateFile: 'tuteur-ia.hbs',
    description: 'Personalized AI-driven learning and adaptive guidance',
    descriptionFr: 'Apprentissage personnalisé piloté par IA et guidage adaptatif',
  },
  {
    id: 'evaluateur-competences',
    name: 'Skills Assessor',
    nameFr: 'Évaluateur de Compétences',
    domain: 'education',
    phase: 'E',
    templateFile: 'evaluateur-competences.hbs',
    description: 'Skills assessment, certification design, competency frameworks',
    descriptionFr: 'Évaluation des compétences, certification, référentiels métier',
  },
  {
    id: 'createur-contenu-educatif',
    name: 'Educational Content Creator',
    nameFr: 'Créateur Contenu Éducatif',
    domain: 'education',
    phase: 'T',
    templateFile: 'createur-contenu-educatif.hbs',
    description: 'Videos, courses, exercises, interactive educational content',
    descriptionFr: 'Vidéos, cours, exercices, contenu éducatif interactif',
  },
]
