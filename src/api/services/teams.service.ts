/**
 * @module api/services/teams
 * Proporciona métodos para obtener información de equipos desde la API.
 * Implementa diferentes endpoints con sus respectivos filtros.
 */

import axiosInstance from '../axios.config';
import type { TeamDetail, MatchesResponse } from '../../types/football.types';

/**
 * Opciones para obtener lista de partidos de un equipo
 */
export interface GetTeamMatchesOptions {
  /** Fecha desde (formato: yyyy-MM-dd) */
  dateFrom?: string;
  /** Fecha hasta (formato: yyyy-MM-dd, excluye esta fecha) */
  dateTo?: string;
  /** Temporada (año de inicio, ej: 2021) */
  season?: string;
  /** Competiciones (códigos separados por coma: "PL,CL") */
  competitions?: string;
  /** Estado del partido */
  status?: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'SUSPENDED' | 'POSTPONED' | 'CANCELLED';
  /** Tipo de sede */
  venue?: 'HOME' | 'AWAY';
  /** Límite de resultados */
  limit?: number;
}

/**
 * Servicio para gestión de equipos
 */
export class TeamsService {
  /**
   * Obtiene información completa de un equipo por su ID
   * 
   * Incluye:
   * - Información básica del equipo
   * - Área/país
   * - Competiciones en las que participa
   * - Entrenador con contrato
   * - Plantilla completa con jugadores y contratos
   * - Cuerpo técnico (staff)
   * - Valor de mercado
   * 
   * @param id - ID del equipo
   * @returns Promise con la información completa del equipo
   * 
   * @example
   * ```typescript
   * // Obtener información del Real Madrid
   * const team = await TeamsService.getTeamById(86);
   * console.log(team.name); // "Real Madrid CF"
   * console.log(team.squad.length); // Número de jugadores en la plantilla
   * console.log(team.coach?.name); // "Carlo Ancelotti"
   * ```
   */
  static async getTeamById(id: number): Promise<TeamDetail> {
    const response = await axiosInstance.get<TeamDetail>(`/teams/${id}`);
    return response.data;
  }

  /**
   * Obtiene los partidos de un equipo con filtros opcionales
   * 
   * Permite filtrar por:
   * - Rango de fechas
   * - Temporada
   * - Competiciones específicas
   * - Estado del partido (finalizados, próximos, en vivo)
   * - Tipo de sede (local, visitante)
   * 
   * @param id - ID del equipo
   * @param options - Opciones de filtrado
   * @returns Promise con la respuesta de la API conteniendo la lista de partidos
   * 
   * @example
   * ```typescript
   * // Obtener últimos 5 partidos finalizados del Real Madrid
   * const lastMatches = await TeamsService.getTeamMatches(86, {
   *   status: 'FINISHED',
   *   limit: 5
   * });
   * 
   * // Obtener próximos 5 partidos del Barcelona
   * const nextMatches = await TeamsService.getTeamMatches(81, {
   *   status: 'SCHEDULED',
   *   limit: 5
   * });
   * 
   * // Obtener partidos de Champions League de esta temporada
   * const clMatches = await TeamsService.getTeamMatches(86, {
   *   competitions: 'CL',
   *   season: '2023'
   * });
   * 
   * // Obtener partidos en casa finalizados
   * const homeMatches = await TeamsService.getTeamMatches(86, {
   *   venue: 'HOME',
   *   status: 'FINISHED'
   * });
   * ```
   */
  static async getTeamMatches(
    id: number,
    options: GetTeamMatchesOptions = {}
  ): Promise<MatchesResponse> {
    const params: Record<string, string | number> = {};

    // Agregar parámetros opcionales si están presentes
    if (options.dateFrom) params.dateFrom = options.dateFrom;
    if (options.dateTo) params.dateTo = options.dateTo;
    if (options.season) params.season = options.season;
    if (options.competitions) params.competitions = options.competitions;
    if (options.status) params.status = options.status;
    if (options.venue) params.venue = options.venue;
    if (options.limit !== undefined) params.limit = options.limit;

    const response = await axiosInstance.get<MatchesResponse>(`/teams/${id}/matches`, {
      params,
    });

    return response.data;
  }
}

export default TeamsService;
