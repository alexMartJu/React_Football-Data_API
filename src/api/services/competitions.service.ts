/**
 * @module api/services/competitions
 * Proporciona métodos para obtener información de competiciones desde la API.
 * Implementa diferentes endpoints con sus respectivos filtros.
 */

import axiosInstance from '../axios.config';
import type {
  Competition,
  FullCompetition,
  StandingsResponse,
  ScorersResponse,
  TeamsResponse,
  MatchesResponse,
} from '../../types/football.types';

/**
 * Opciones para obtener lista de competiciones
 */
export interface GetCompetitionsOptions {
  /** Filtrar por áreas (IDs separados por coma) */
  areas?: string;
}

/**
 * Respuesta de la API para lista de competiciones
 */
export interface CompetitionsResponse {
  /** Número de competiciones en la respuesta */
  count: number;
  /** Filtros aplicados */
  filters: {
    areas?: string;
  };
  /** Array de competiciones */
  competitions: Competition[];
}

/**
 * Servicio para gestión de competiciones
 */
export class CompetitionsService {
  /**
   * Obtiene una lista de competiciones según los filtros proporcionados
   * 
   * @param options - Opciones de filtrado
   * @returns Promise con la respuesta de la API conteniendo la lista de competiciones
   * 
   * @example
   * ```typescript
   * // Obtener todas las competiciones disponibles
   * const allCompetitions = await CompetitionsService.getCompetitions();
   * 
   * // Obtener competiciones de España (id: 2224)
   * const spanishCompetitions = await CompetitionsService.getCompetitions({
   *   areas: '2224'
   * });
   * ```
   */
  static async getCompetitions(
    options: GetCompetitionsOptions = {}
  ): Promise<CompetitionsResponse> {
    // Construir query params
    const params = new URLSearchParams();

    if (options.areas) {
      params.append('areas', options.areas);
    }

    // Realizar petición
    const queryString = params.toString();
    const url = queryString ? `/competitions?${queryString}` : '/competitions';

    const response = await axiosInstance.get<CompetitionsResponse>(url);
    return response.data;
  }

  /**
   * Obtiene información detallada de una competición específica
   * 
   * @param code - Código de la competición (ej: 'PL', 'CL', 'PD')
   * @returns Promise con los datos de la competición
   * 
   * @example
   * ```typescript
   * // Obtener información de la Premier League
   * const premierLeague = await CompetitionsService.getCompetitionByCode('PL');
   * ```
   */
  static async getCompetitionByCode(code: string): Promise<Competition> {
    const response = await axiosInstance.get<Competition>(`/competitions/${code}`);
    return response.data;
  }

  /**
   * Obtiene información detallada de una competición por ID
   * 
   * @param id - ID de la competición
   * @returns Promise con los datos de la competición
   * 
   * @example
   * ```typescript
   * // Obtener información de la Premier League por ID
   * const premierLeague = await CompetitionsService.getCompetitionById(2021);
   * ```
   */
  static async getCompetitionById(id: number): Promise<Competition> {
    const response = await axiosInstance.get<Competition>(`/competitions/${id}`);
    return response.data;
  }

  /**
   * Obtiene información completa de una competición incluyendo temporadas históricas
   * 
   * @param code - Código de la competición
   * @returns Promise con los datos completos de la competición
   * 
   * @example
   * ```typescript
   * const competition = await CompetitionsService.getFullCompetition('PL');
   * ```
   */
  static async getFullCompetition(code: string): Promise<FullCompetition> {
    const response = await axiosInstance.get<FullCompetition>(`/competitions/${code}`);
    return response.data;
  }

  /**
   * Obtiene la clasificación de una competición
   * 
   * @param code - Código de la competición
   * @param options - Opciones de filtrado (season, matchday, date)
   * @returns Promise con la clasificación
   * 
   * @example
   * ```typescript
   * // Clasificación actual
   * const standings = await CompetitionsService.getStandings('PL');
   * 
   * // Clasificación de una jornada específica
   * const standings = await CompetitionsService.getStandings('PL', { matchday: 15 });
   * ```
   */
  static async getStandings(
    code: string,
    options?: { season?: string; matchday?: number; date?: string }
  ): Promise<StandingsResponse> {
    const params = new URLSearchParams();

    if (options?.season) params.append('season', options.season);
    if (options?.matchday) params.append('matchday', options.matchday.toString());
    if (options?.date) params.append('date', options.date);

    const queryString = params.toString();
    const url = queryString
      ? `/competitions/${code}/standings?${queryString}`
      : `/competitions/${code}/standings`;

    const response = await axiosInstance.get<StandingsResponse>(url);
    return response.data;
  }

  /**
   * Obtiene los partidos de una competición
   * 
   * @param code - Código de la competición
   * @param options - Opciones de filtrado
   * @returns Promise con la lista de partidos
   * 
   * @example
   * ```typescript
   * // Próximos partidos
   * const matches = await CompetitionsService.getMatches('PL', { status: 'SCHEDULED' });
   * 
   * // Partidos de una jornada
   * const matches = await CompetitionsService.getMatches('PL', { matchday: 23 });
   * ```
   */
  static async getMatches(
    code: string,
    options?: {
      dateFrom?: string;
      dateTo?: string;
      stage?: string;
      status?: string;
      matchday?: number;
      group?: string;
      season?: string;
    }
  ): Promise<MatchesResponse> {
    const params = new URLSearchParams();

    if (options?.dateFrom) params.append('dateFrom', options.dateFrom);
    if (options?.dateTo) params.append('dateTo', options.dateTo);
    if (options?.stage) params.append('stage', options.stage);
    if (options?.status) params.append('status', options.status);
    if (options?.matchday) params.append('matchday', options.matchday.toString());
    if (options?.group) params.append('group', options.group);
    if (options?.season) params.append('season', options.season);

    const queryString = params.toString();
    const url = queryString
      ? `/competitions/${code}/matches?${queryString}`
      : `/competitions/${code}/matches`;

    const response = await axiosInstance.get<MatchesResponse>(url);
    return response.data;
  }

  /**
   * Obtiene los máximos goleadores de una competición
   * 
   * @param code - Código de la competición
   * @param options - Opciones de filtrado
   * @returns Promise con la lista de goleadores
   * 
   * @example
   * ```typescript
   * // Top 10 goleadores
   * const scorers = await CompetitionsService.getScorers('PL', { limit: 10 });
   * ```
   */
  static async getScorers(
    code: string,
    options?: { limit?: number; season?: string }
  ): Promise<ScorersResponse> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.season) params.append('season', options.season);

    const queryString = params.toString();
    const url = queryString
      ? `/competitions/${code}/scorers?${queryString}`
      : `/competitions/${code}/scorers`;

    const response = await axiosInstance.get<ScorersResponse>(url);
    return response.data;
  }

  /**
   * Obtiene los equipos participantes en una competición
   * 
   * @param code - Código de la competición
   * @param options - Opciones de filtrado
   * @returns Promise con la lista de equipos
   * 
   * @example
   * ```typescript
   * // Equipos de la temporada actual
   * const teams = await CompetitionsService.getTeams('PL');
   * 
   * // Equipos de una temporada específica
   * const teams = await CompetitionsService.getTeams('PL', { season: '2021' });
   * ```
   */
  static async getTeams(
    code: string,
    options?: { season?: string }
  ): Promise<TeamsResponse> {
    const params = new URLSearchParams();

    if (options?.season) params.append('season', options.season);

    const queryString = params.toString();
    const url = queryString
      ? `/competitions/${code}/teams?${queryString}`
      : `/competitions/${code}/teams`;

    const response = await axiosInstance.get<TeamsResponse>(url);
    return response.data;
  }
}

export default CompetitionsService;
