/**
 * @module types/football
 * Tipos y interfaces que mapean las entidades de la API de Football-Data.
 * Proporciona tipado fuerte para todas las respuestas de la API.
 */

/**
 * Estado actual de un partido
 */
export type MatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'AWARDED';

/**
 * Fase de la competición
 */
export type MatchStage =
  | 'FINAL'
  | 'THIRD_PLACE'
  | 'SEMI_FINALS'
  | 'QUARTER_FINALS'
  | 'LAST_16'
  | 'LAST_32'
  | 'LAST_64'
  | 'ROUND_4'
  | 'ROUND_3'
  | 'ROUND_2'
  | 'ROUND_1'
  | 'GROUP_STAGE'
  | 'PRELIMINARY_ROUND'
  | 'QUALIFICATION'
  | 'QUALIFICATION_ROUND_1'
  | 'QUALIFICATION_ROUND_2'
  | 'QUALIFICATION_ROUND_3'
  | 'PLAYOFF_ROUND_1'
  | 'PLAYOFF_ROUND_2'
  | 'PLAYOFFS'
  | 'REGULAR_SEASON'
  | 'CLAUSURA'
  | 'APERTURA'
  | 'CHAMPIONSHIP_ROUND'
  | 'RELEGATION_ROUND';

/**
 * Duración del partido
 */
export type ScoreDuration = 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';

/**
 * Tipo de competición
 */
export type CompetitionType = 'LEAGUE' | 'LEAGUE_CUP' | 'CUP' | 'PLAYOFFS';

/**
 * Resultado del partido
 */
export type Winner = 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;

/**
 * Información de área/país
 */
export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

/**
 * Información básica de competición
 */
export interface Competition {
  id: number;
  name: string;
  code: string;
  type: CompetitionType;
  emblem: string | null;
  area?: Area;
}

/**
 * Información básica de equipo
 */
export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string | null;
}

/**
 * Información de temporada
 */
export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number | null;
  winner: Team | null;
  stages: MatchStage[];
}

/**
 * Marcador parcial (mitad/tiempo completo/prórroga/penales)
 */
export interface PartialScore {
  home: number | null;
  away: number | null;
}

/**
 * Marcador completo del partido
 */
export interface Score {
  winner: Winner;
  duration: ScoreDuration;
  fullTime: PartialScore;
  halfTime?: PartialScore;
  regularTime?: PartialScore;
  extraTime?: PartialScore;
  penalties?: PartialScore;
}

/**
 * Estadísticas del equipo en el partido
 */
export interface TeamStatistics {
  corner_kicks?: number;
  free_kicks?: number;
  goal_kicks?: number;
  offsides?: number;
  fouls?: number;
  ball_possession?: number;
  saves?: number;
  throw_ins?: number;
  shots?: number;
  shots_on_goal?: number;
  shots_off_goal?: number;
  yellow_cards?: number;
  yellow_red_cards?: number;
  red_cards?: number;
}

/**
 * Tipo de gol
 */
export type GoalType = 'REGULAR' | 'OWN' | 'PENALTY';

/**
 * Información del jugador en un gol
 */
export interface GoalPlayer {
  id: number;
  name: string;
}

/**
 * Información de un gol
 */
export interface Goal {
  minute: number;
  injuryTime: number | null;
  type: GoalType;
  team: {
    id: number;
    name: string;
  };
  scorer: GoalPlayer;
  assist: GoalPlayer | null;
  score: PartialScore;
}

/**
 * Tipo de tarjeta
 */
export type CardType = 'YELLOW' | 'YELLOW_RED' | 'RED';

/**
 * Información de una tarjeta
 */
export interface Booking {
  minute: number;
  team: {
    id: number;
    name: string;
  };
  player: GoalPlayer;
  card: CardType;
}

/**
 * Información de una sustitución
 */
export interface Substitution {
  minute: number;
  team: {
    id: number;
    name: string;
  };
  playerOut: GoalPlayer;
  playerIn: GoalPlayer;
}

/**
 * Jugador en alineación
 */
export interface LineupPlayer {
  id: number;
  name: string;
  position: string | null;
  shirtNumber: number;
}

/**
 * Entrenador
 */
export interface Coach {
  id: number;
  name: string;
  nationality: string | null;
}

/**
 * Información detallada del equipo en el partido
 */
export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string | null;
  coach?: Coach;
  leagueRank?: number | null;
  formation?: string | null;
  lineup?: LineupPlayer[];
  bench?: LineupPlayer[];
  statistics?: TeamStatistics;
}

/**
 * Árbitro
 */
export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string | null;
}

/**
 * Partido completo
 */
export interface Match {
  area: Area;
  competition: Competition;
  season: Season;
  id: number;
  utcDate: string;
  status: MatchStatus;
  minute: number | null;
  injuryTime: number | null;
  attendance: number | null;
  venue: string | null;
  matchday: number | null;
  stage: MatchStage;
  group: string | null;
  lastUpdated: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: Score;
  goals?: Goal[];
  bookings?: Booking[];
  substitutions?: Substitution[];
  referees?: Referee[];
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

/**
 * Filtros aplicados en una respuesta de lista de partidos
 */
export interface MatchFilters {
  competitions?: string;
  permission?: string;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  date?: string;
}

/**
 * Conjunto de resultados en una respuesta de lista de partidos
 */
export interface ResultSet {
  count: number;
  competitions?: string;
  first: string;
  last: string;
  played: number;
  wins?: number;
  draws?: number;
  losses?: number;
}

/**
 * Respuesta de lista de partidos
 */
export interface MatchesResponse {
  filters: MatchFilters;
  resultSet: ResultSet;
  matches: Match[];
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Tipo de standing (clasificación)
 */
export type StandingType = 'TOTAL' | 'HOME' | 'AWAY';

/**
 * Posición en la tabla de clasificación
 */
export interface TablePosition {
  position: number;
  team: Team;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

/**
 * Tabla de clasificación
 */
export interface Standing {
  stage: MatchStage;
  type: StandingType;
  group: string | null;
  table: TablePosition[];
}

/**
 * Respuesta del endpoint de standings
 */
export interface StandingsResponse {
  filters: {
    season?: string;
  };
  area: Area;
  competition: Competition;
  season: Season;
  standings: Standing[];
}

/**
 * Información de jugador/persona
 */
export interface Person {
  id: number;
  name: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  countryOfBirth: string | null;
  nationality: string | null;
  position: string | null;
  shirtNumber: number | null;
  lastUpdated?: string;
}

/**
 * Máximo goleador
 */
export interface Scorer {
  player: Person;
  team: Team;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

/**
 * Respuesta del endpoint de scorers
 */
export interface ScorersResponse {
  count: number;
  filters: {
    limit: number;
  };
  competition: Competition;
  season: Season;
  scorers: Scorer[];
}

/**
 * Equipo completo con detalles adicionales
 */
export interface FullTeam extends Team {
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  lastUpdated?: string;
}

/**
 * Respuesta del endpoint de teams
 */
export interface TeamsResponse {
  count: number;
  filters: {
    season?: string;
  };
  competition: Competition;
  season: Season;
  teams: FullTeam[];
}

/**
 * Competición completa con información detallada
 */
export interface FullCompetition extends Competition {
  currentSeason: Season;
  seasons?: Season[];
  lastUpdated?: string;
}

// ============================================================
// TIPOS PARA TEAM DETAIL (Página 4)
// ============================================================

/**
 * Información de contrato
 */
export interface Contract {
  start: string;
  until: string;
}

/**
 * Entrenador con información de contrato
 */
export interface CoachWithContract {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string;
  dateOfBirth: string | null;
  nationality: string | null;
  contract?: Contract;
}

/**
 * Jugador de la plantilla con información completa
 */
export interface SquadPlayer {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string;
  position: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  shirtNumber: number | null;
  marketValue: number | null;
  contract?: Contract;
}

/**
 * Miembro del cuerpo técnico
 */
export interface StaffMember {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string;
  dateOfBirth: string | null;
  nationality: string | null;
  contract?: Contract;
}

/**
 * Equipo con información completa (detalle)
 */
export interface TeamDetail {
  area: Area;
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string | null;
  address?: string;
  website?: string;
  founded?: number;
  clubColors?: string;
  venue?: string;
  runningCompetitions: Competition[];
  coach?: CoachWithContract;
  marketValue?: number;
  squad: SquadPlayer[];
  staff?: StaffMember[];
  lastUpdated?: string;
}
