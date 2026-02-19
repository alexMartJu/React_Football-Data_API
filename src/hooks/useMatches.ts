/**
 * @module hooks/useMatches
 * Proporciona hooks para obtener partidos con caché automático,
 * gestión del ciclo de vida y control de estado asíncrono mediante React Query.
 * Implementa separación de hilos (operaciones de red no bloquean la UI).
 */

import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import MatchesService from '../api/services/matches.service';
import type { GetMatchesOptions, UnfoldOptions } from '../api/services/matches.service';
import type { MatchesResponse, Match } from '../types/football.types';

/**
 * Tiempo de caché en milisegundos (5 minutos)
 */
const CACHE_TIME = 5 * 60 * 1000;

/**
 * Tiempo de revalidación en milisegundos (2 minutos)
 */
const STALE_TIME = 2 * 60 * 1000;

/**
 * Hook para obtener una lista de partidos con opciones de filtrado
 * 
 * @param options - Opciones de filtrado de partidos
 * @param unfoldOptions - Opciones para incluir información detallada
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los datos, estado de carga y errores
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useMatches({
 *   competitions: 'PL,CL',
 *   status: 'FINISHED'
 * });
 * ```
 */
export function useMatches(
  options: GetMatchesOptions = {},
  unfoldOptions: UnfoldOptions = {},
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  return useQuery({
    queryKey: ['matches', options, unfoldOptions],
    queryFn: () => MatchesService.getMatches(options, unfoldOptions),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
    retry: 2, // Reintentar 2 veces en caso de error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para obtener los partidos del día actual
 * 
 * Implementa caché para evitar peticiones repetidas.
 * La operación de red se ejecuta en segundo plano sin bloquear la UI.
 * 
 * @param unfoldOptions - Opciones para incluir información detallada
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los partidos de hoy
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error, refetch } = useTodayMatches();
 * 
 * if (isLoading) return <Loader />;
 * if (error) return <Error message={error.message} />;
 * 
 * return <MatchList matches={data?.matches} />;
 * ```
 */
export function useTodayMatches(
  unfoldOptions: UnfoldOptions = {},
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  return useQuery({
    queryKey: ['matches', 'today', unfoldOptions],
    queryFn: () => MatchesService.getTodayMatches(unfoldOptions),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch automático cuando la ventana recupera el foco
    refetchOnWindowFocus: true,
    // Refetch cada 60 segundos para mantener los datos actualizados
    refetchInterval: 60000,
  });
}

/**
 * Hook para obtener un partido específico por su ID
 * 
 * @param matchId - ID del partido
 * @param unfoldOptions - Opciones para incluir información detallada
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con la información del partido
 * 
 * @example
 * ```typescript
 * const { data: match, isLoading } = useMatchById(327611, {
 *   lineups: true,
 *   bookings: true,
 *   substitutions: true,
 *   goals: true
 * });
 * ```
 */
export function useMatchById(
  matchId: number | null,
  unfoldOptions: UnfoldOptions = {},
  enabled: boolean = true
): UseQueryResult<Match, Error> {
  return useQuery({
    queryKey: ['match', matchId, unfoldOptions],
    queryFn: () => {
      if (!matchId) throw new Error('Match ID is required');
      return MatchesService.getMatchById(matchId, unfoldOptions);
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: enabled && !!matchId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para obtener partidos en vivo
 * 
 * Implementa refetch automático cada 30 segundos para mantener
 * los datos actualizados en tiempo real.
 * 
 * @param unfoldOptions - Opciones para incluir información detallada
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los partidos en vivo
 * 
 * @example
 * ```typescript
 * const { data: liveMatches, isLoading } = useLiveMatches({ goals: true });
 * ```
 */
export function useLiveMatches(
  unfoldOptions: UnfoldOptions = { goals: true },
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  return useQuery({
    queryKey: ['matches', 'live', unfoldOptions],
    queryFn: () => MatchesService.getLiveMatches(unfoldOptions),
    staleTime: 30000, // 30 segundos
    gcTime: CACHE_TIME,
    enabled,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    // Refetch cada 30 segundos para partidos en vivo
    refetchInterval: 30000,
  });
}

/**
 * Hook para obtener el historial de enfrentamientos (Head to Head)
 * 
 * @param matchId - ID del partido
 * @param limit - Número máximo de partidos históricos
 * @param unfoldOptions - Opciones para incluir información detallada
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los enfrentamientos previos
 * 
 * @example
 * ```typescript
 * const { data: h2h, isLoading } = useHead2Head(327611, 10);
 * ```
 */
export function useHead2Head(
  matchId: number | null,
  limit: number = 10,
  unfoldOptions: UnfoldOptions = {},
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  return useQuery({
    queryKey: ['match', matchId, 'head2head', limit, unfoldOptions],
    queryFn: () => {
      if (!matchId) throw new Error('Match ID is required');
      return MatchesService.getHead2Head(matchId, limit, unfoldOptions);
    },
    staleTime: CACHE_TIME, // Los datos históricos cambian poco
    gcTime: CACHE_TIME * 2,
    enabled: enabled && !!matchId,
    retry: 1,
  });
}

/**
 * Hook para obtener partidos programados en un rango de fechas
 * 
 * @param dateFrom - Fecha de inicio
 * @param dateTo - Fecha de fin
 * @param competitions - Códigos de competiciones (opcional)
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los partidos programados
 * 
 * @example
 * ```typescript
 * const { data: scheduledMatches } = useScheduledMatches(
 *   '2024-03-01',
 *   '2024-03-07',
 *   'PL,CL'
 * );
 * ```
 */
export function useScheduledMatches(
  dateFrom: string,
  dateTo: string,
  competitions?: string,
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  return useQuery({
    queryKey: ['matches', 'scheduled', dateFrom, dateTo, competitions],
    queryFn: () => MatchesService.getScheduledMatches(dateFrom, dateTo, competitions),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
