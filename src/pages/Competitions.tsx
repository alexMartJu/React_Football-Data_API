/**
 * @module pages/Competitions
 */

import { Container, Stack, Title, Text, Group, Badge, Button } from '@mantine/core';
import { IconTrophy, IconRefresh } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useCompetitions } from '../hooks/useCompetitions';
import { CompetitionList } from '../components/competitions/CompetitionList';
import { LoadingState, ErrorState } from '../components/common/States';
import { AVAILABLE_COMPETITIONS } from '../constants/competitions';
import type { Competition } from '../types/football.types';

/**
 * Componente Competitions
 * 
 * Página que muestra todas las competiciones disponibles en el plan Free.
 * 
 * Características:
 * - Obtiene las 12 competiciones disponibles mediante hook personalizado con React Query
 * - Implementa caché automático para evitar peticiones repetidas
 * - Manejo de estados de carga y error
 * - Operaciones de red no bloquean la UI (asíncronas)
 * - Diseño responsive y profesional
 * - Navegación a página de detalle de cada competición
 * 
 * @returns Elemento JSX de la página Competitions
 */
export function Competitions() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useCompetitions();

  /**
   * Handler para navegación a detalle de competición
   */
  const handleCompetitionClick = (competition: Competition) => {
    navigate(`/competitions/${competition.code}`);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header de la página */}
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="md">
              <IconTrophy size={40} color="#51cf66" />
              <Title order={1} c="white">
                Competiciones
              </Title>
            </Group>
            <Badge color="green" variant="filled" size="lg">
              Plan Free
            </Badge>
          </Group>

          <Text size="md" c="dimmed">
            Explora las {Object.keys(AVAILABLE_COMPETITIONS).length} competiciones
            disponibles en tu plan gratuito. Haz clic en cualquier competición para ver
            más detalles, clasificaciones, partidos y máximos goleadores.
          </Text>
        </Stack>

        {/* Estado de carga */}
        {isLoading && <LoadingState message="Cargando competiciones..." />}

        {/* Estado de error */}
        {error && (
          <ErrorState
            message={
              error.message ||
              'No se pudieron cargar las competiciones. Por favor, inténtalo de nuevo.'
            }
            onRetry={() => refetch()}
            retryText="Reintentar"
          />
        )}

        {/* Lista de competiciones */}
        {data && data.competitions && (
          <Stack gap="lg">
            {/* Información de resultados */}
            <Group justify="space-between" align="center">
              <Text size="sm" c="dimmed">
                Mostrando {data.competitions.length} de {data.count} competiciones disponibles
              </Text>
              <Button
                variant="subtle"
                color="gray"
                leftSection={<IconRefresh size={16} />}
                onClick={() => refetch()}
                size="sm"
              >
                Actualizar
              </Button>
            </Group>

            {/* Grid de competiciones */}
            <CompetitionList
              competitions={data.competitions}
              onCompetitionClick={handleCompetitionClick}
              emptyMessage="No hay competiciones disponibles en este momento"
            />

            {/* Nota informativa */}
            <Text size="xs" c="dimmed" ta="center" mt="md">
              Las competiciones mostradas están disponibles en el plan Free de Football-Data.
              El plan Free incluye acceso a datos históricos y en tiempo real de las principales
              ligas y competiciones europeas, así como competiciones internacionales.
            </Text>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
