/**
 * @module pages/CompetitionDetail
 */

import { useParams, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Stack, Group, Badge, Tabs, Paper, Avatar, Button } from '@mantine/core';
import {
  IconTrophy,
  IconTable,
  IconBallFootball,
  IconCalendar,
  IconShield,
  IconRefresh,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  useFullCompetition,
  useStandings,
  useScorers,
  useTeams,
  useCompetitionMatches,
} from '../hooks/useCompetitionDetail';
import { LoadingState, ErrorState } from '../components/common/States';
import { StandingsTable } from '../components/competitions/StandingsTable';
import { TopScorersList } from '../components/competitions/TopScorersList';
import { TeamsList } from '../components/competitions/TeamsList';
import { MatchList } from '../components/matches/MatchList';

/**
 * Componente CompetitionDetail
 * 
 * Página que muestra información detallada de una competición consumiendo múltiples endpoints:
 * - GET /v4/competitions/{code} - Información general
 * - GET /v4/competitions/{code}/standings - Clasificación
 * - GET /v4/competitions/{code}/matches?status=SCHEDULED - Próximos partidos
 * - GET /v4/competitions/{code}/scorers?limit=10 - Máximos goleadores
 * - GET /v4/competitions/{code}/teams - Equipos participantes
 * 
 * Características:
 * - Consume 5 endpoints diferentes de la API
 * - Caché automático mediante React Query
 * - Operaciones asíncronas no bloqueantes
 * - Control de errores HTTP
 * - Diseño professional con tabs organizados
 * 
 * @returns Elemento JSX de la página de detalle de competición
 */
export function CompetitionDetail() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  // Hooks para obtener datos de múltiples endpoints
  const {
    data: competition,
    isLoading: isLoadingCompetition,
    error: errorCompetition,
    refetch: refetchCompetition,
  } = useFullCompetition(code || null);

  const {
    data: standings,
    isLoading: isLoadingStandings,
    error: errorStandings,
    refetch: refetchStandings,
  } = useStandings(code || null, undefined, !!code && !!competition);

  const {
    data: scorers,
    isLoading: isLoadingScorers,
    error: errorScorers,
    refetch: refetchScorers,
  } = useScorers(code || null, { limit: 10 }, !!code && !!competition);

  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: errorTeams,
    refetch: refetchTeams,
  } = useTeams(code || null, undefined, !!code && !!competition);

  const {
    data: upcomingMatches,
    isLoading: isLoadingMatches,
    error: errorMatches,
    refetch: refetchMatches,
  } = useCompetitionMatches(code || null, { status: 'SCHEDULED' }, !!code && !!competition);

  /**
   * Navegar a detalle de equipo
   */
  const handleTeamClick = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  // Estado de carga inicial
  if (isLoadingCompetition) {
    return <LoadingState message="Cargando información de la competición..." />;
  }

  // Error al cargar competición
  if (errorCompetition || !competition) {
    return (
      <Container size="xl" py="xl">
        <ErrorState
          message={errorCompetition?.message || 'No se pudo cargar la información de la competición'}
          onRetry={() => refetchCompetition()}
        />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header con información de la competición */}
        <Paper
          p="xl"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            borderColor: '#373A40',
          }}
          withBorder
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="xl">
              {/* Logo de la competición */}
              <Avatar
                src={competition.emblem}
                alt={competition.name}
                size={80}
                radius="md"
                style={{
                  border: '3px solid #51cf66',
                }}
              >
                <IconTrophy size={40} color="#51cf66" />
              </Avatar>

              {/* Información básica */}
              <Stack gap="xs">
                <Group gap="sm">
                  <Title order={1} c="white">
                    {competition.name}
                  </Title>
                  <Badge color="gray" size="lg" variant="light">
                    {competition.code}
                  </Badge>
                </Group>

                <Group gap="md">
                  {competition.area && (
                    <Group gap="xs">
                      <Avatar src={competition.area.flag} size={20} radius="sm" />
                      <Text size="sm" c="dimmed">
                        {competition.area.name}
                      </Text>
                    </Group>
                  )}

                  <Badge
                    color={
                      competition.type === 'LEAGUE'
                        ? 'green'
                        : competition.type === 'CUP'
                        ? 'blue'
                        : 'grape'
                    }
                    variant="light"
                  >
                    {competition.type === 'LEAGUE' && 'Liga'}
                    {competition.type === 'CUP' && 'Copa'}
                    {competition.type === 'LEAGUE_CUP' && 'Copa de Liga'}
                    {competition.type === 'PLAYOFFS' && 'Playoffs'}
                  </Badge>
                </Group>

                {/* Información de la temporada actual */}
                {competition.currentSeason && (
                  <Group gap="md">
                    <Text size="sm" c="dimmed">
                      📅 {format(new Date(competition.currentSeason.startDate), 'dd MMM yyyy', { locale: es })} -{' '}
                      {format(new Date(competition.currentSeason.endDate), 'dd MMM yyyy', { locale: es })}
                    </Text>
                    {competition.currentSeason.currentMatchday && (
                      <Badge color="green" variant="filled">
                        Jornada {competition.currentSeason.currentMatchday}
                      </Badge>
                    )}
                  </Group>
                )}
              </Stack>
            </Group>
          </Group>
        </Paper>


        {/* Tabs con las diferentes secciones */}
        <Tabs defaultValue="standings" color="green" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="standings" leftSection={<IconTable size={16} />}>
              Clasificación
            </Tabs.Tab>
            <Tabs.Tab value="matches" leftSection={<IconCalendar size={16} />}>
              Próximos Partidos
            </Tabs.Tab>
            <Tabs.Tab value="scorers" leftSection={<IconBallFootball size={16} />}>
              Goleadores
            </Tabs.Tab>
            <Tabs.Tab value="teams" leftSection={<IconShield size={16} />}>
              Equipos
            </Tabs.Tab>
          </Tabs.List>

          {/* Tab: Clasificación */}
          <Tabs.Panel value="standings" pt="xl">
            {isLoadingStandings && <LoadingState message="Cargando clasificación..." />}

            {errorStandings && (
              <ErrorState
                message="No se pudo cargar la clasificación"
                onRetry={() => refetchStandings()}
              />
            )}

            {standings && (
              <Stack gap="lg">
                {standings.standings.length > 0 ? (
                  standings.standings.map((standing, index) => (
                    <StandingsTable key={`${standing.type}-${standing.group || index}`} standing={standing} />
                  ))
                ) : (
                  <Paper p="xl" radius="md" style={{ backgroundColor: '#25262b' }} withBorder>
                    <Stack align="center" gap="md">
                      <IconTable size={48} color="#868e96" />
                      <Text size="lg" c="dimmed" ta="center">
                        No hay clasificación disponible para esta competición
                      </Text>
                      <Text size="sm" c="dimmed" ta="center">
                        La clasificación solo está disponible para competiciones de tipo Liga
                      </Text>
                    </Stack>
                  </Paper>
                )}

                <Group justify="flex-end">
                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => refetchStandings()}
                  >
                    Actualizar clasificación
                  </Button>
                </Group>
              </Stack>
            )}
          </Tabs.Panel>

          {/* Tab: Próximos Partidos */}
          <Tabs.Panel value="matches" pt="xl">
            {isLoadingMatches && <LoadingState message="Cargando próximos partidos..." />}

            {errorMatches && (
              <ErrorState
                message="No se pudieron cargar los próximos partidos"
                onRetry={() => refetchMatches()}
              />
            )}

            {upcomingMatches && (
              <Stack gap="lg">
                <Group justify="space-between">
                  <Text size="lg" fw={600} c="white">
                    Próximos {upcomingMatches.resultSet.count} partidos
                  </Text>
                  <Badge color="green" variant="light">
                    Programados
                  </Badge>
                </Group>

                <MatchList
                  matches={upcomingMatches.matches}
                  emptyMessage="No hay partidos programados próximamente"
                />

                <Group justify="flex-end">
                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => refetchMatches()}
                  >
                    Actualizar partidos
                  </Button>
                </Group>
              </Stack>
            )}
          </Tabs.Panel>

          {/* Tab: Máximos Goleadores */}
          <Tabs.Panel value="scorers" pt="xl">
            {isLoadingScorers && <LoadingState message="Cargando máximos goleadores..." />}

            {errorScorers && (
              <ErrorState
                message="No se pudieron cargar los goleadores"
                onRetry={() => refetchScorers()}
              />
            )}

            {scorers && (
              <Stack gap="lg">
                {scorers.scorers.length > 0 ? (
                  <>
                    <TopScorersList scorers={scorers.scorers} />
                    <Group justify="flex-end">
                      <Button
                        variant="light"
                        color="gray"
                        leftSection={<IconRefresh size={16} />}
                        onClick={() => refetchScorers()}
                      >
                        Actualizar goleadores
                      </Button>
                    </Group>
                  </>
                ) : (
                  <Paper p="xl" radius="md" style={{ backgroundColor: '#25262b' }} withBorder>
                    <Stack align="center" gap="md">
                      <IconBallFootball size={48} color="#868e96" />
                      <Text size="lg" c="dimmed" ta="center">
                        No hay datos de goleadores disponibles
                      </Text>
                      <Text size="sm" c="dimmed" ta="center">
                        Los goleadores solo están disponibles una vez iniciada la temporada
                      </Text>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            )}
          </Tabs.Panel>

          {/* Tab: Equipos */}
          <Tabs.Panel value="teams" pt="xl">
            {isLoadingTeams && <LoadingState message="Cargando equipos..." />}

            {errorTeams && (
              <ErrorState
                message="No se pudieron cargar los equipos"
                onRetry={() => refetchTeams()}
              />
            )}

            {teams && (
              <Stack gap="lg">
                <Group justify="space-between">
                  <Text size="lg" fw={600} c="white">
                    {teams.count} equipos participantes
                  </Text>
                  <Badge color="green" variant="light">
                    Temporada {teams.season.startDate.split('-')[0]}/{teams.season.endDate.split('-')[0]}
                  </Badge>
                </Group>

                <TeamsList
                  teams={teams.teams}
                  onTeamClick={(team) => handleTeamClick(team.id)}
                />

                <Group justify="flex-end">
                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => refetchTeams()}
                  >
                    Actualizar equipos
                  </Button>
                </Group>
              </Stack>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
