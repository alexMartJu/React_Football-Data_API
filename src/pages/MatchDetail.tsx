/**
 * @module pages/MatchDetail
 */

import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Loader,
  Center,
  Alert,
  Tabs,
  Paper,
  Button,
  Group,
} from '@mantine/core';
import {
  IconInfoCircle,
  IconUsers,
  IconChartBar,
  IconClock,
  IconTrophy,
  IconArrowLeft,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useMatchById, useHead2Head } from '../hooks/useMatches';
import { MatchHeader } from '../components/matches/MatchHeader';
import { MatchLineups } from '../components/matches/MatchLineups';
import { MatchStats } from '../components/matches/MatchStats';
import { MatchTimeline } from '../components/matches/MatchTimeline';
import { MatchH2H } from '../components/matches/MatchH2H';

/**
 * Página MatchDetail
 * 
 * Muestra el detalle completo de un partido incluyendo:
 * - Información general (equipos, resultado, fecha, estadio, etc.)
 * - Alineaciones (formación, titulares, suplentes)
 * - Estadísticas (posesión, tiros, faltas, tarjetas)
 * - Cronología (goles, tarjetas, sustituciones)
 * - Historial (enfrentamientos previos entre ambos equipos)
 * 
 * Utiliza X-Unfold headers para obtener toda la información detallada.
 * 
 * @returns Elemento JSX de la página de detalle del partido
 * 
 * @example
 * Ruta: /matches/:id
 * URL: /matches/123456
 */
export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Queries con X-Unfold headers para obtener toda la información
  const {
    data: match,
    isLoading,
    error,
  } = useMatchById(Number(id), {
    lineups: true,
    bookings: true,
    substitutions: true,
    goals: true,
  });

  const {
    data: h2h,
    isLoading: isLoadingH2H,
    error: errorH2H,
  } = useHead2Head(Number(id));

  /**
   * Maneja el error si no se encuentra el partido
   */
  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={20} />}
          title="Error al cargar el partido"
          color="red"
          variant="filled"
          radius="md"
        >
          {error instanceof Error
            ? error.message
            : 'No se pudo cargar la información del partido'}
        </Alert>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          mt="xl"
          variant="light"
        >
          Volver
        </Button>
      </Container>
    );
  }

  /**
   * Muestra loader mientras carga
   */
  if (isLoading || !match) {
    return (
      <Container size="lg" py="xl">
        <Center style={{ minHeight: '60vh' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" color="green" />
            <p>Cargando información del partido...</p>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Botón Volver */}
        <Group>
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            variant="light"
            color="gray"
          >
            Volver
          </Button>
        </Group>

        {/* Header del partido */}
        <MatchHeader match={match} />

        {/* Tabs con el contenido */}
        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '1px solid #373A40',
          }}
        >
          <Tabs defaultValue="info" color="green" variant="pills">
            <Tabs.List>
              <Tabs.Tab
                value="info"
                leftSection={<IconInfoCircle size={16} />}
              >
                Información
              </Tabs.Tab>

              {match.homeTeam.lineup && match.awayTeam.lineup && (
                <Tabs.Tab
                  value="lineups"
                  leftSection={<IconUsers size={16} />}
                >
                  Alineaciones
                </Tabs.Tab>
              )}

              {match.homeTeam.statistics && match.awayTeam.statistics && (
                <Tabs.Tab
                  value="stats"
                  leftSection={<IconChartBar size={16} />}
                >
                  Estadísticas
                </Tabs.Tab>
              )}

              {(match.goals || match.bookings || match.substitutions) && (
                <Tabs.Tab
                  value="events"
                  leftSection={<IconClock size={16} />}
                >
                  Cronología
                </Tabs.Tab>
              )}

              <Tabs.Tab
                value="h2h"
                leftSection={<IconTrophy size={16} />}
              >
                Historial
              </Tabs.Tab>
            </Tabs.List>

            {/* Panel Información */}
            <Tabs.Panel value="info" pt="lg">
              <Paper
                p="lg"
                radius="sm"
                style={{
                  backgroundColor: '#1a1b1e',
                  border: '1px solid #373A40',
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <div>
                      <p style={{ margin: 0, color: '#868e96', fontSize: 14 }}>
                        Competición
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 600 }}>
                        {match.competition.name}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#868e96', fontSize: 14 }}>
                        Jornada
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 600 }}>
                        {match.matchday ? `Jornada ${match.matchday}` : '-'}
                      </p>
                    </div>
                  </Group>

                  {match.group && (
                    <div>
                      <p style={{ margin: 0, color: '#868e96', fontSize: 14 }}>
                        Grupo
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 600 }}>
                        {match.group}
                      </p>
                    </div>
                  )}

                  {match.stage && (
                    <div>
                      <p style={{ margin: 0, color: '#868e96', fontSize: 14 }}>
                        Fase
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 16, fontWeight: 600 }}>
                        {match.stage}
                      </p>
                    </div>
                  )}
                </Stack>
              </Paper>
            </Tabs.Panel>

            {/* Panel Alineaciones */}
            {match.homeTeam.lineup && match.awayTeam.lineup && (
              <Tabs.Panel value="lineups" pt="lg">
                <MatchLineups match={match} />
              </Tabs.Panel>
            )}

            {/* Panel Estadísticas */}
            {match.homeTeam.statistics && match.awayTeam.statistics && (
              <Tabs.Panel value="stats" pt="lg">
                <MatchStats match={match} />
              </Tabs.Panel>
            )}

            {/* Panel Cronología */}
            {(match.goals || match.bookings || match.substitutions) && (
              <Tabs.Panel value="events" pt="lg">
                <MatchTimeline match={match} />
              </Tabs.Panel>
            )}

            {/* Panel Historial */}
            <Tabs.Panel value="h2h" pt="lg">
              {isLoadingH2H ? (
                <Center py="xl">
                  <Stack align="center" gap="md">
                    <Loader size="md" color="green" />
                    <p>Cargando historial...</p>
                  </Stack>
                </Center>
              ) : errorH2H ? (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Error al cargar el historial"
                  color="red"
                  variant="light"
                  radius="sm"
                >
                  No se pudo cargar el historial de enfrentamientos
                </Alert>
              ) : h2h ? (
                <MatchH2H
                  h2h={h2h}
                  homeTeamId={match.homeTeam.id}
                  awayTeamId={match.awayTeam.id}
                />
              ) : null}
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
}
