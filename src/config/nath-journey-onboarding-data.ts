/**
 * Dados mockados para o onboarding "Jornada da Nath"
 * Placeholders de imagens até assets reais estarem disponíveis
 */

import {
  ConcernCardData,
  EmotionalStateOptionData,
  StageCardData,
} from "../types/nath-journey-onboarding.types";

// Imagens reais da Nath - assets/onboarding/images/
export const NATH_IMAGES = {
  // Stages (6)
  stageTentante: require("../../assets/onboarding/images/stage-tentante.jpg"),
  stageGravidaT1: require("../../assets/onboarding/images/stage-gravida-t1.jpg"),
  stageGravidaT2: require("../../assets/onboarding/images/stage-gravida-t2.jpg"),
  stageGravidaT3: require("../../assets/onboarding/images/stage-gravida-t3.jpg"),
  stagePuerperio: require("../../assets/onboarding/images/stage-puerperio.jpg"),
  stageMaeRecente: require("../../assets/onboarding/images/stage-mae-recente.jpg"),
  // Concerns (8)
  concernAnsiedade: require("../../assets/onboarding/images/concern-ansiedade.jpg"),
  concernInformacao: require("../../assets/onboarding/images/concern-informacao.jpg"),
  concernSintomas: require("../../assets/onboarding/images/concern-sintomas.jpg"),
  concernCorpo: require("../../assets/onboarding/images/concern-corpo.jpg"),
  concernRelacionamento: require("../../assets/onboarding/images/concern-relacionamento.jpg"),
  concernTrabalho: require("../../assets/onboarding/images/concern-trabalho.jpg"),
  concernSolidao: require("../../assets/onboarding/images/concern-solidao.jpg"),
  concernFinancas: require("../../assets/onboarding/images/concern-financas.jpg"),
  // Emotional (4)
  emotionalBem: require("../../assets/onboarding/images/emotional-bem.jpg"),
  emotionalAnsiosaLeve: require("../../assets/onboarding/images/emotional-ansiosa-leve.jpg"),
  emotionalAnsiosaGrave: require("../../assets/onboarding/images/emotional-ansiosa-grave.jpg"),
  emotionalTriste: require("../../assets/onboarding/images/emotional-triste.jpg"),
  // Check-in & Profile (2)
  checkinNathThales: require("../../assets/onboarding/images/checkin-nath-thales.jpg"),
  nathProfile: require("../../assets/onboarding/images/nath-profile-small.jpg"),
};

export const STAGE_CARDS: StageCardData[] = [
  {
    stage: "TENTANTE",
    image: NATH_IMAGES.stageTentante,
    title: "Tentando engravidar",
    quote: "Lembro da ansiedade de cada ciclo",
    icon: "🤞",
  },
  {
    stage: "GRAVIDA_T1",
    image: NATH_IMAGES.stageGravidaT1,
    title: "Grávida - Primeiros meses",
    quote: "Os enjoos eram reais demais",
    icon: "🌱",
  },
  {
    stage: "GRAVIDA_T2",
    image: NATH_IMAGES.stageGravidaT2,
    title: "Grávida - Barriga crescendo",
    quote: "Melhor fase! Senti ele mexer pela 1ª vez",
    icon: "🌸",
  },
  {
    stage: "GRAVIDA_T3",
    image: NATH_IMAGES.stageGravidaT3,
    title: "Grávida - Reta final",
    quote: "Ansiosa, com medo, mas empolgada",
    icon: "🎈",
  },
  {
    stage: "PUERPERIO_0_40D",
    image: NATH_IMAGES.stagePuerperio,
    title: "Acabei de ter meu bebê",
    quote: "Primeiros 40 dias: caos lindo",
    icon: "👶",
  },
  {
    stage: "MAE_RECENTE_ATE_1ANO",
    image: NATH_IMAGES.stageMaeRecente,
    title: "Mãe recente (até 1 ano)",
    quote: "Aprendendo a cada dia",
    icon: "💕",
  },
];

export const CONCERN_CARDS: ConcernCardData[] = [
  {
    concern: "ANSIEDADE_MEDO",
    image: NATH_IMAGES.concernAnsiedade,
    emoji: "😰",
    title: "Ansiedade e medo",
    quote: "Eu tinha pavor do parto. Chorei MUITO.",
  },
  {
    concern: "FALTA_INFORMACAO",
    image: NATH_IMAGES.concernInformacao,
    emoji: "❓",
    title: "Falta de informação",
    quote: "Toda hora no Google: 'é normal?'",
  },
  {
    concern: "SINTOMAS_FISICOS",
    image: NATH_IMAGES.concernSintomas,
    emoji: "🤢",
    title: "Sintomas físicos",
    quote: "Enjoo 24/7. Perdi 5kg no 1º trimestre.",
  },
  {
    concern: "MUDANCAS_CORPO",
    image: NATH_IMAGES.concernCorpo,
    emoji: "🤰",
    title: "Mudanças no corpo",
    quote: "Estranhei MUITO meu novo corpo.",
  },
  {
    concern: "RELACIONAMENTO",
    image: NATH_IMAGES.concernRelacionamento,
    emoji: "💔",
    title: "Relacionamento",
    quote: "A gente brigou MUITO na gestação.",
  },
  {
    concern: "TRABALHO_MATERNIDADE",
    image: NATH_IMAGES.concernTrabalho,
    emoji: "💼",
    title: "Trabalho e maternidade",
    quote: "Como vou fazer tudo?",
  },
  {
    concern: "SOLIDAO",
    image: NATH_IMAGES.concernSolidao,
    emoji: "😔",
    title: "Solidão",
    quote: "Às vezes me sentia muito só.",
  },
  {
    concern: "FINANCAS",
    image: NATH_IMAGES.concernFinancas,
    emoji: "💰",
    title: "Grana",
    quote: "Enxoval é CARO. Fiquei assustada.",
  },
];

export const EMOTIONAL_STATE_OPTIONS: EmotionalStateOptionData[] = [
  {
    state: "BEM_EQUILIBRADA",
    image: NATH_IMAGES.emotionalBem,
    emoji: "☀️",
    title: "Bem, equilibrada",
    response: "Que sorte! Aproveita esse momento",
  },
  {
    state: "UM_POUCO_ANSIOSA",
    image: NATH_IMAGES.emotionalAnsiosaLeve,
    emoji: "🌤️",
    title: "Um pouco ansiosa",
    response: "Eu tbm. Vou te passar umas dicas",
  },
  {
    state: "MUITO_ANSIOSA",
    image: NATH_IMAGES.emotionalAnsiosaGrave,
    emoji: "⛈️",
    title: "Muito ansiosa",
    response: "Te entendo DEMAIS. Vamos com calma",
  },
  {
    state: "TRISTE_ESGOTADA",
    image: NATH_IMAGES.emotionalTriste,
    emoji: "🌧️",
    title: "Triste/esgotada",
    response: "Não está sozinha. Tem ajuda, viu?",
  },
  {
    state: "PREFIRO_NAO_RESPONDER",
    image: null, // Sem foto - opção para quem prefere não responder
    emoji: "🤐",
    title: "Prefiro não falar agora",
    response: "Tudo bem. Quando quiser, eu tô aqui",
  },
];

export const SEASON_PRESETS = [
  "Temporada: Eu por mim mesma",
  "Temporada: Saindo do automático",
  "Temporada: Fim da promessa vazia",
  "Temporada: Minha jornada real",
];
