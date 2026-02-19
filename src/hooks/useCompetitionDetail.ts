/**
 * @module hooks/useCompetitionDetail
 * Hooks para obtener información detallada de competiciones:
 * clasificación, goleadores, equipos y partidos.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { CompetitionsService } from '../api/services/competitions.service';
import type {
  FullCompetition,
  StandingsResponse,
  ScorersResponse,
  TeamsResponse,
  MatchesResponse,
} from '../types/football.types';

/**
 * Tiempo de caché en milisegundos (10 minutos)
 * Los datos de competición no cambian frecuentemente
 */
const CACHE_TIME = 10 * 60 * 1000;

/**
 * Tiempo de revalidación en milisegundos (5 minutos)
 */
const STALE_TIME = 5 * 60 * 1000;

/**
 * Hook para obtener información completa de una competición
 * 
 * @param code - Código de la competición
 * @param enabled - Si la query está habilitada
 * @returns Query result con los datos completos de la competición
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useFullCompetition('PL');
 * ```
 */
export function useFullCompetition(
  code: string | null,
  enabled: boolean = true
): UseQueryResult<FullCompetition, Error> {
  return useQuery({
    queryKey: ['competition', 'full', code],
    queryFn: () => CompetitionsService.getFullCompetition(code!),
    enabled: enabled && !!code,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para obtener la clasificación de una competición
 * 
 * @param code - Código de la competición
 * @param options - Opciones de filtrado
 * @param enabled - Si la query está habilitada
 * @returns Query result con la clasificación
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useStandings('PL');
 * ```
 */
export function useStandings(
  code: string | null,
  options?: { season?: string; matchday?: number; date?: string },
  enabled: boolean = true
): UseQueryResult<StandingsResponse, Error> {
  return useQuery({
    queryKey: ['competition', code, 'standings', options],
    queryFn: () => CompetitionsService.getStandings(code!, options),
    enabled: enabled && !!code,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para obtener los máximos goleadores de una competición
 * 
 * @param code - Código de la competición
 * @param options - Opciones de filtrado
 * @param enabled - Si la query está habilitada
 * @returns Query result con los goleadores
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useScorers('PL', { limit: 10 });
 * ```
 */
export function useScorers(
  code: string | null,
  options?: { limit?: number; season?: string },
  enabled: boolean = true
): UseQueryResult<ScorersResponse, Error> {
  return useQuery({
    queryKey: ['competition', code, 'scorers', options],
    queryFn: () => CompetitionsService.getScorers(code!, options),
    enabled: enabled && !!code,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para obtener los equipos de una competición
 * 
 * @param code - Código de la competición
 * @param options - Opciones de filtrado
 * @param enabled - Si la query está habilitada
 * @returns Query result con los equipos
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useTeams('PL');
 * ```
 */
export function useTeams(
  code: string | null,
  options?: { season?: string },
  enabled: boolean = true
): UseQueryResult<TeamsResponse, Error> {
  return useQuery({
    queryKey: ['competition', code, 'teams', options],
    queryFn: () => CompetitionsService.getTeams(code!, options),
    enabled: enabled && !!code,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}

/**
 * Hook para obtener los partidos de una competición
 * 
 * @param code - Código de la competición
 * @param options - Opciones de filtrado
 * @param enabled - Si la query está habilitada
 * @returns Query result con los partidos
 * 
 * @example
 * ```typescript
 * // Próximos partidos
 * const { data, isLoading } = useCompetitionMatches('PL', { status: 'SCHEDULED' });
 * ```
 */
export function useCompetitionMatches(
  code: string | null,
  options?: {
    dateFrom?: string;
    dateTo?: string;
    stage?: string;
    status?: string;
    matchday?: number;
    group?: string;
    season?: string;
  },
  enabled: boolean = true
): UseQueryResult<MatchesResponse, Error> {
  return useQuery({
    queryKey: ['competition', code, 'matches', options],
    queryFn: () => CompetitionsService.getMatches(code!, options),
    enabled: enabled && !!code,
    gcTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });
}
