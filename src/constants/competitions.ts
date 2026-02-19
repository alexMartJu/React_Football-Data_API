/**
 * @module constants/competitions
 */

/**
 * Información de competiciones disponibles en el plan Free
 */
export const AVAILABLE_COMPETITIONS = {
  WC: { code: 'WC', name: 'FIFA World Cup', id: 2000 },
  CL: { code: 'CL', name: 'UEFA Champions League', id: 2001 },
  BL1: { code: 'BL1', name: 'Bundesliga', id: 2002 },
  DED: { code: 'DED', name: 'Eredivisie', id: 2003 },
  BSA: { code: 'BSA', name: 'Campeonato Brasileiro Série A', id: 2013 },
  PD: { code: 'PD', name: 'Primera Division', id: 2014 },
  FL1: { code: 'FL1', name: 'Ligue 1', id: 2015 },
  ELC: { code: 'ELC', name: 'Championship', id: 2016 },
  PPL: { code: 'PPL', name: 'Primeira Liga', id: 2017 },
  EC: { code: 'EC', name: 'European Championship', id: 2018 },
  SA: { code: 'SA', name: 'Serie A', id: 2019 },
  PL: { code: 'PL', name: 'Premier League', id: 2021 },
} as const;

/**
 * Códigos de competiciones disponibles
 */
export const COMPETITION_CODES = Object.keys(AVAILABLE_COMPETITIONS);

/**
 * Estado de los partidos con sus colores asociados para la UI
 */
export const MATCH_STATUS_COLORS = {
  SCHEDULED: '#868e96',
  TIMED: '#4dabf7',
  IN_PLAY: '#51cf66',
  PAUSED: '#ffd43b',
  FINISHED: '#495057',
  SUSPENDED: '#ff6b6b',
  POSTPONED: '#ff8787',
  CANCELLED: '#fa5252',
  AWARDED: '#845ef7',
} as const;

/**
 * Etiquetas en español para los estados de partidos
 */
export const MATCH_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Programado',
  TIMED: 'Confirmado',
  IN_PLAY: 'En juego',
  PAUSED: 'Descanso',
  FINISHED: 'Finalizado',
  SUSPENDED: 'Suspendido',
  POSTPONED: 'Pospuesto',
  CANCELLED: 'Cancelado',
  AWARDED: 'Otorgado',
};
