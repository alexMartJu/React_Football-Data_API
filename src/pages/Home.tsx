/**
 * @module pages/Home
 */

import { Container, Title, Text, Stack, Group, Badge, rem } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTodayMatches } from '../hooks/useMatches';
import { MatchList } from '../components/matches/MatchList';
import { LoadingState, ErrorState } from '../components/common/States';

/**
 * Componente Home
 * 
 * Página principal de la aplicación que muestra los partidos del día actual.
 * 
 * Características:
 * - Obtiene partidos del día mediante hook personalizado con React Query
 * - Implementa caché automático para evitar peticiones repetidas
 * - Actualización automática cada 60 segundos
 * - Manejo de estados de carga y error
 * - Operaciones de red no bloquean la UI (asíncronas)
 * - Diseño responsive y profesional
 * 
 * @returns Elemento JSX de la página Home
 */
export function Home() {
  // Hook que obtiene partidos de hoy con caché y gestión de estado
  const { data, isLoading, error, refetch } = useTodayMatches({
    goals: true,
    bookings: false,
    substitutions: false,
    lineups: false,
  });

  // Fecha actual formateada
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header de la página */}
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={1} c="white" size={rem(32)}>
              Partidos de Hoy
            </Title>
            {data && (
              <Badge size="lg" variant="light" color="green">
                {data.resultSet.count} {data.resultSet.count === 1 ? 'partido' : 'partidos'}
              </Badge>
            )}
          </Group>

          <Group gap="xs" c="dimmed">
            <IconCalendar size={20} />
            <Text size="sm" tt="capitalize">
              {formattedDate}
            </Text>
          </Group>
        </Stack>

        {/* Estado de carga */}
        {isLoading && <LoadingState message="Cargando partidos de hoy..." />}

        {/* Estado de error */}
        {error && (
          <ErrorState
            message={
              error.message || 'No se pudieron cargar los partidos. Verifica tu conexión a internet.'
            }
            onRetry={() => refetch()}
          />
        )}

        {/* Lista de partidos */}
        {data && !isLoading && (
          <>
            {data.matches.length > 0 ? (
              <>
                {/* Información de filtros aplicados */}
                {data.resultSet.played !== undefined && (
                  <Group gap="md">
                    <Badge variant="light" color="gray">
                      Jugados: {data.resultSet.played}
                    </Badge>
                    <Badge variant="light" color="blue">
                      Programados: {data.resultSet.count - data.resultSet.played}
                    </Badge>
                  </Group>
                )}

                {/* Grid de partidos */}
                <MatchList
                  matches={data.matches}
                  emptyMessage="No hay partidos programados para hoy"
                />
              </>
            ) : (
              <MatchList
                matches={[]}
                emptyMessage="No hay partidos programados para hoy. ¡Vuelve mañana!"
              />
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
