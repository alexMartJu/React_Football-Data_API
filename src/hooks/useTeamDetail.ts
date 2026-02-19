/**
 * @module hooks/useTeamDetail
 * Hooks para obtener información detallada de equipos:
 * información completa, plantilla, entrenador y partidos.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { TeamsService, type GetTeamMatchesOptions } from '../api/services/teams.service';
import type { TeamDetail, MatchesResponse } from '../types/football.types';

/**
 * Tiempo de caché en milisegundos (10 minutos)
 * Los equipos no cambian frecuentemente
 */
const CACHE_TIME = 10 * 60 * 1000;

/**
 * Tiempo de revalidación en milisegundos (5 minutos)
 */
const STALE_TIME = 5 * 60 * 1000;

/**
 * Hook para obtener información completa de un equipo
 * 
 * Incluye:
 * - Datos básicos del equipo
 * - Área/país
 * - Competiciones actuales
 * - Entrenador y contrato
 * - Plantilla completa con jugadores
 * - Cuerpo técnico (staff)
 * - Valor de mercado
 * 
 * @param id - ID del equipo (null para deshabilitar)
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los datos, estado de carga y errores
 * 
 * @example
 * ```typescript
 * const { data: team, isLoading, error } = useTeam(86);
 * 
 * if (isLoading) return <LoadingState />;
 * if (error) return <ErrorState message={error.message} />;
 * 
 * return (
 *   <div>
 *     <h1>{team.name}</h1>
 *     <p>Entrenador: {team.coach?.name}</p>
 *     <p>Jugadores: {team.squad.length}</p>
 *   </div>
 * );
 * ```
 */
export function useTeam(
  id: number | null,
  enabled: boolean = true
): UseQueryResult<TeamDetail, Error> {
  return useQuery({
    queryKey: ['team', id],
    queryFn: () => TeamsService.getTeamById(id!),
    enabled: !!id && enabled,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para obtener partidos de un equipo con filtros
 * 
 * Permite obtener:
 * - Últimos partidos finalizados
 * - Próximos partidos programados
 * - Partidos de una competición específica
 * - Partidos de una temporada
 * - Partidos en casa o fuera
 * 
 * @param id - ID del equipo (null para deshabilitar)
 * @param options - Opciones de filtrado
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los datos, estado de carga y errores
 * 
 * @example
 * ```typescript
 * // Últimos 5 partidos finalizados
 * const { data: lastMatches } = useTeamMatches(86, {
 *   status: 'FINISHED',
 *   limit: 5
 * });
 * 
 * // Próximos 5 partidos
 * const { data: nextMatches } = useTeamMatches(86, {
 *   status: 'SCHEDULED',
 *   limit: 5
 * });
 * 
 * // Partidos de Champions League
 * const { data: clMatches } = useTeamMatches(86, {
 *   competitions: 'CL'
 * });
 * ```
 */
export function useTeamMatches(
  id: number | null,
  options?: GetTeamMatchesOptions,
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  // Crear una clave de query única basada en id y opciones
  const queryKey = ['team', id, 'matches', options];

  return useQuery({
    queryKey,
    queryFn: () => TeamsService.getTeamMatches(id!, options),
    enabled: !!id && enabled,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}
