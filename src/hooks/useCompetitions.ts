/**
 * @module hooks/useCompetitions
 * Proporciona hooks para obtener competiciones con caché automático,
 * gestión del ciclo de vida y control de estado asíncrono mediante React Query.
 * Implementa separación de hilos (operaciones de red no bloquean la UI).
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import CompetitionsService, {
  type GetCompetitionsOptions,
  type CompetitionsResponse,
} from '../api/services/competitions.service';
import type { Competition } from '../types/football.types';

/**
 * Tiempo de caché en milisegundos (10 minutos)
 * Las competiciones no cambian frecuentemente
 */
const CACHE_TIME = 10 * 60 * 1000;

/**
 * Tiempo de revalidación en milisegundos (5 minutos)
 */
const STALE_TIME = 5 * 60 * 1000;

/**
 * Hook para obtener la lista de competiciones
 * 
 * @param options - Opciones de filtrado de competiciones
 * @param enabled - Si la query está habilitada (por defecto true)
 * @returns Query result con los datos, estado de carga y errores
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useCompetitions();
 * ```
 */
export function useCompetitions(
  options: GetCompetitionsOptions = {},
  enabled: boolean = true
): UseQueryResult<CompetitionsResponse, Error> {
  return useQuery({
    queryKey: ['competitions', options],
    queryFn: () => CompetitionsService.getCompetitions(options),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
}

/**
 * Hook para obtener información detallada de una competición por código
 * 
 * @param code - Código de la competición (ej: 'PL', 'CL', 'PD')
 * @param enabled - Si la query está habilitada (por defecto true si hay código)
 * @returns Query result con los datos de la competición
 * 
 * @example
 * ```typescript
 * const { data: competition, isLoading } = useCompetitionByCode('PL');
 * ```
 */
export function useCompetitionByCode(
  code: string | null,
  enabled: boolean = true
): UseQueryResult<Competition, Error> {
  return useQuery({
    queryKey: ['competition', 'code', code],
    queryFn: () => CompetitionsService.getCompetitionByCode(code!),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: enabled && code !== null,
  });
}

/**
 * Hook para obtener información detallada de una competición por ID
 * 
 * @param id - ID de la competición
 * @param enabled - Si la query está habilitada (por defecto true si hay ID)
 * @returns Query result con los datos de la competición
 * 
 * @example
 * ```typescript
 * const { data: competition, isLoading } = useCompetitionById(2021);
 * ```
 */
export function useCompetitionById(
  id: number | null,
  enabled: boolean = true
): UseQueryResult<Competition, Error> {
  return useQuery({
    queryKey: ['competition', 'id', id],
    queryFn: () => CompetitionsService.getCompetitionById(id!),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: enabled && id !== null,
  });
}
