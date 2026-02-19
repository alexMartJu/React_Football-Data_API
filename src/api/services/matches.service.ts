/**
 * @module api/services/matches
 * Proporciona métodos para obtener información de partidos desde la API.
 * Implementa diferentes endpoints con sus respectivos filtros y headers.
 */

import axiosInstance from '../axios.config';
import type { MatchesResponse, Match } from '../../types/football.types';

/**
 * Opciones para obtener lista de partidos
 */
export interface GetMatchesOptions {
  /** Filtrar por competiciones (códigos separados por coma: "PL,BL1") */
  competitions?: string;
  /** IDs de partidos separados por coma */
  ids?: string;
  /** Fecha específica (formato: yyyy-MM-dd o 'TODAY', 'YESTERDAY', 'TOMORROW') */
  date?: string;
  /** Fecha desde (formato: yyyy-MM-dd) */
  dateFrom?: string;
  /** Fecha hasta (formato: yyyy-MM-dd, excluye esta fecha) */
  dateTo?: string;
  /** Estado del partido */
  status?: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED';
  /** Temporada (año de inicio, ej: 2021) */
  season?: number;
  /** Jornada */
  matchday?: number;
  /** Fase de la competición */
  stage?: string;
  /** Grupo */
  group?: string;
  /** Límite de resultados */
  limit?: number;
}

/**
 * Opciones para desplegar información detallada en las respuestas
 */
export interface UnfoldOptions {
  /** Incluir alineaciones */
  lineups?: boolean;
  /** Incluir tarjetas */
  bookings?: boolean;
  /** Incluir sustituciones */
  substitutions?: boolean;
  /** Incluir goles */
  goals?: boolean;
}

/**
 * Servicio para gestión de partidos
 */
export class MatchesService {
  /**
   * Obtiene una lista de partidos según los filtros proporcionados
   * 
   * @param options - Opciones de filtrado
   * @param unfoldOptions - Opciones para incluir información detallada
   * @returns Promise con la respuesta de la API conteniendo la lista de partidos
   * 
   * @example
   * ```typescript
   * // Obtener partidos de hoy
   * const todayMatches = await MatchesService.getMatches({ date: 'TODAY' });
   * 
   * // Obtener partidos finalizados de la Premier League
   * const plMatches = await MatchesService.getMatches({
   *   competitions: 'PL',
   *   status: 'FINISHED'
   * });
   * ```
   */
  static async getMatches(
    options: GetMatchesOptions = {},
    unfoldOptions: UnfoldOptions = {}
  ): Promise<MatchesResponse> {
    // Construir headers personalizados para unfold
    const headers: Record<string, string> = {};
    
    if (unfoldOptions.lineups !== undefined) {
      headers['X-Unfold-Lineups'] = String(unfoldOptions.lineups);
    }
    if (unfoldOptions.bookings !== undefined) {
      headers['X-Unfold-Bookings'] = String(unfoldOptions.bookings);
    }
    if (unfoldOptions.substitutions !== undefined) {
      headers['X-Unfold-Subs'] = String(unfoldOptions.substitutions);
    }
    if (unfoldOptions.goals !== undefined) {
      headers['X-Unfold-Goals'] = String(unfoldOptions.goals);
    }

    const response = await axiosInstance.get<MatchesResponse>('/matches', {
      params: options,
      headers,
    });

    return response.data;
  }

  /**
   * Obtiene los partidos del día actual
   * 
   * @param unfoldOptions - Opciones para incluir información detallada
   * @returns Promise con los partidos de hoy
   * 
   * @example
   * ```typescript
   * const todayMatches = await MatchesService.getTodayMatches();
   * ```
   */
  static async getTodayMatches(unfoldOptions: UnfoldOptions = {}): Promise<MatchesResponse> {
    return this.getMatches({}, unfoldOptions);
  }

  /**
   * Obtiene un partido específico por su ID
   * 
   * @param matchId - ID del partido
   * @param unfoldOptions - Opciones para incluir información detallada (lineups, bookings, subs, goals)
   * @returns Promise con la información detallada del partido
   * 
   * @example
   * ```typescript
   * const match = await MatchesService.getMatchById(327611, {
   *   lineups: true,
   *   bookings: true,
   *   substitutions: true,
   *   goals: true
   * });
   * ```
   */
  static async getMatchById(matchId: number, unfoldOptions: UnfoldOptions = {}): Promise<Match> {
    // Construir headers personalizados para unfold
    const headers: Record<string, string> = {};
    
    if (unfoldOptions.lineups !== undefined) {
      headers['X-Unfold-Lineups'] = String(unfoldOptions.lineups);
    }
    if (unfoldOptions.bookings !== undefined) {
      headers['X-Unfold-Bookings'] = String(unfoldOptions.bookings);
    }
    if (unfoldOptions.substitutions !== undefined) {
      headers['X-Unfold-Subs'] = String(unfoldOptions.substitutions);
    }
    if (unfoldOptions.goals !== undefined) {
      headers['X-Unfold-Goals'] = String(unfoldOptions.goals);
    }

    const response = await axiosInstance.get<Match>(`/matches/${matchId}`, { headers });
    return response.data;
  }

  /**
   * Obtiene el historial de enfrentamientos entre dos equipos (Head to Head)
   * 
   * @param matchId - ID del partido para obtener el H2H de sus equipos
   * @param limit - Número máximo de partidos históricos a devolver
   * @param unfoldOptions - Opciones para incluir información detallada
   * @returns Promise con la información de enfrentamientos previos
   * 
   * @example
   * ```typescript
   * const h2h = await MatchesService.getHead2Head(327611, 10);
   * ```
   */
  static async getHead2Head(
    matchId: number,
    limit: number = 10,
    unfoldOptions: UnfoldOptions = {}
  ): Promise<MatchesResponse> {
    // Construir headers personalizados para unfold
    const headers: Record<string, string> = {};
    
    if (unfoldOptions.lineups !== undefined) {
      headers['X-Unfold-Lineups'] = String(unfoldOptions.lineups);
    }
    if (unfoldOptions.bookings !== undefined) {
      headers['X-Unfold-Bookings'] = String(unfoldOptions.bookings);
    }
    if (unfoldOptions.substitutions !== undefined) {
      headers['X-Unfold-Subs'] = String(unfoldOptions.substitutions);
    }
    if (unfoldOptions.goals !== undefined) {
      headers['X-Unfold-Goals'] = String(unfoldOptions.goals);
    }

    const response = await axiosInstance.get<MatchesResponse>(`/matches/${matchId}/head2head`, {
      params: { limit },
      headers,
    });
    return response.data;
  }

  /**
   * Obtiene partidos en vivo (IN_PLAY o PAUSED)
   * 
   * @param unfoldOptions - Opciones para incluir información detallada
   * @returns Promise con los partidos en vivo
   * 
   * @example
   * ```typescript
   * const liveMatches = await MatchesService.getLiveMatches({ goals: true });
   * ```
   */
  static async getLiveMatches(unfoldOptions: UnfoldOptions = {}): Promise<MatchesResponse> {
    return this.getMatches({ status: 'IN_PLAY' }, unfoldOptions);
  }

  /**
   * Obtiene partidos programados en un rango de fechas
   * 
   * @param dateFrom - Fecha de inicio (yyyy-MM-dd)
   * @param dateTo - Fecha de fin (yyyy-MM-dd)
   * @param competitions - Códigos de competiciones separados por coma (opcional)
   * @returns Promise con los partidos programados
   * 
   * @example
   * ```typescript
   * const upcomingMatches = await MatchesService.getScheduledMatches(
   *   '2024-03-01',
   *   '2024-03-07',
   *   'PL,CL'
   * );
   * ```
   */
  static async getScheduledMatches(
    dateFrom: string,
    dateTo: string,
    competitions?: string
  ): Promise<MatchesResponse> {
    return this.getMatches({
      dateFrom,
      dateTo,
      status: 'SCHEDULED',
      competitions,
    });
  }
}

export default MatchesService;
