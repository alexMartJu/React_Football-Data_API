/**
 * @module pages/TeamDetail
 */

import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Stack,
  Avatar,
  Tabs,
  SimpleGrid,
  Button,
  Divider,
} from '@mantine/core';
import {
  IconShield,
  IconUsers,
  IconCalendar,
  IconTrophy,
  IconRefresh,
  IconHome,
  IconBallFootball,
  IconUser,
  IconBuilding,
  IconCoin,
} from '@tabler/icons-react';
import { useTeam, useTeamMatches } from '../hooks/useTeamDetail';
import { LoadingState, ErrorState } from '../components/common/States';
import { SquadTable } from '../components/teams/SquadTable';
import { CoachCard } from '../components/teams/CoachCard';
import { MatchList } from '../components/matches/MatchList';

/**
 * Componente TeamDetail
 * 
 * Página que muestra información detallada de un equipo consumiendo múltiples endpoints:
 * - GET /v4/teams/{id} - Información completa del equipo
 * - GET /v4/teams/{id}/matches?status=FINISHED&limit=5 - Últimos 5 partidos
 * - GET /v4/teams/{id}/matches?status=SCHEDULED&limit=5 - Próximos 5 partidos
 * 
 * @returns Elemento JSX de la página de detalle de equipo
 */
export function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teamId = id ? parseInt(id, 10) : null;

  // Hook para obtener datos del equipo
  const {
    data: team,
    isLoading: isLoadingTeam,
    error: errorTeam,
    refetch: refetchTeam,
  } = useTeam(teamId);

  // Hook para obtener últimos partidos finalizados
  const {
    data: lastMatches,
    isLoading: isLoadingLastMatches,
    error: errorLastMatches,
    refetch: refetchLastMatches,
  } = useTeamMatches(
    teamId,
    { status: 'FINISHED', limit: 5 },
    !!teamId && !!team
  );

  // Hook para obtener próximos partidos programados
  const {
    data: nextMatches,
    isLoading: isLoadingNextMatches,
    error: errorNextMatches,
    refetch: refetchNextMatches,
  } = useTeamMatches(
    teamId,
    { status: 'SCHEDULED', limit: 5 },
    !!teamId && !!team
  );

  /**
   * Handler para navegación a detalle de partido
   */
  const handleMatchClick = (matchId: number) => {
    navigate(`/matches/${matchId}`);
  };

  // Estados de carga
  if (isLoadingTeam) {
    return (
      <Container size="xl" py="xl">
        <LoadingState message="Cargando información del equipo..." />
      </Container>
    );
  }

  // Estados de error
  if (errorTeam || !team) {
    return (
      <Container size="xl" py="xl">
        <ErrorState
          message={errorTeam?.message || 'No se pudo cargar la información del equipo'}
          onRetry={refetchTeam}
        />
      </Container>
    );
  }

  /**
   * Formatea el valor de mercado
   */
  const formatMarketValue = (value: number | undefined): string => {
    if (!value) return '-';
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K €`;
    }
    return `${value} €`;
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header con información del equipo */}
        <Paper
          shadow="md"
          p="xl"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '2px solid #51cf66',
          }}
        >
          <Group align="flex-start" wrap="nowrap">
            {/* Logo del equipo */}
            <Avatar
              src={team.crest}
              alt={team.name}
              size={100}
              radius="md"
              style={{
                border: '3px solid #51cf66',
                boxShadow: '0 0 20px rgba(81, 207, 102, 0.3)',
              }}
            >
              <IconShield size={50} />
            </Avatar>

            {/* Información principal */}
            <div style={{ flex: 1 }}>
              <Group gap="xs" mb="xs">
                <Title order={1} c="white">
                  {team.name}
                </Title>
                <Badge color="green" size="lg" variant="filled">
                  {team.tla}
                </Badge>
              </Group>

              <Text size="lg" c="dimmed" mb="md">
                {team.shortName}
              </Text>

              {/* Información adicional en grid */}
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
                {/* Área/País */}
                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    🌍
                  </Text>
                  <div>
                    <Text size="xs" c="dimmed">
                      País
                    </Text>
                    <Text size="sm" fw={600}>
                      {team.area.name}
                    </Text>
                  </div>
                </Group>

                {/* Fundación */}
                {team.founded && (
                  <Group gap="xs">
                    <IconCalendar size={18} color="#51cf66" />
                    <div>
                      <Text size="xs" c="dimmed">
                        Fundado
                      </Text>
                      <Text size="sm" fw={600}>
                        {team.founded}
                      </Text>
                    </div>
                  </Group>
                )}

                {/* Estadio */}
                {team.venue && (
                  <Group gap="xs">
                    <IconHome size={18} color="#51cf66" />
                    <div>
                      <Text size="xs" c="dimmed">
                        Estadio
                      </Text>
                      <Text size="sm" fw={600}>
                        {team.venue}
                      </Text>
                    </div>
                  </Group>
                )}

                {/* Valor de mercado */}
                {team.marketValue && (
                  <Group gap="xs">
                    <IconCoin size={18} color="#51cf66" />
                    <div>
                      <Text size="xs" c="dimmed">
                        Valor
                      </Text>
                      <Text size="sm" fw={600}>
                        {formatMarketValue(team.marketValue)}
                      </Text>
                    </div>
                  </Group>
                )}
              </SimpleGrid>

              {/* Colores del club */}
              {team.clubColors && (
                <Group gap="xs" mt="md">
                  <Text size="sm" c="dimmed">
                    🎨 Colores:
                  </Text>
                  <Badge color="dark" variant="light">
                    {team.clubColors}
                  </Badge>
                </Group>
              )}
            </div>
          </Group>

          {/* Competiciones actuales */}
          {team.runningCompetitions && team.runningCompetitions.length > 0 && (
            <>
              <Divider my="lg" color="dark" />
              <Stack gap="xs">
                <Group gap="xs">
                  <IconTrophy size={18} color="#51cf66" />
                  <Text size="sm" fw={600} c="white">
                    Competiciones Actuales ({team.runningCompetitions.length})
                  </Text>
                </Group>
                <Group gap="xs">
                  {team.runningCompetitions.map((competition) => (
                    <Badge
                      key={competition.id}
                      color={competition.type === 'LEAGUE' ? 'green' : 'blue'}
                      variant="light"
                      size="lg"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/competitions/${competition.code}`)}
                    >
                      {competition.name}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </>
          )}
        </Paper>

        {/* Tabs con contenido */}
        <Tabs defaultValue="info" color="green">
          <Tabs.List>
            <Tabs.Tab value="info" leftSection={<IconShield size={18} />}>
              Información
            </Tabs.Tab>
            <Tabs.Tab value="squad" leftSection={<IconUsers size={18} />}>
              Plantilla ({team.squad.length})
            </Tabs.Tab>
            <Tabs.Tab value="last-matches" leftSection={<IconBallFootball size={18} />}>
              Últimos Partidos
            </Tabs.Tab>
            <Tabs.Tab value="next-matches" leftSection={<IconCalendar size={18} />}>
              Próximos Partidos
            </Tabs.Tab>
          </Tabs.List>

          {/* Tab: Información */}
          <Tabs.Panel value="info" pt="xl">
            <Stack gap="xl">
              {/* Entrenador */}
              {team.coach && (
                <div>
                  <Group mb="md">
                    <IconUser size={24} color="#51cf66" />
                    <Title order={2} c="white">
                      Entrenador
                    </Title>
                  </Group>
                  <CoachCard coach={team.coach} />
                </div>
              )}

              {/* Información del club */}
              <Paper p="xl" radius="md" style={{ backgroundColor: '#25262b' }}>
                <Group mb="md">
                  <IconBuilding size={24} color="#51cf66" />
                  <Title order={2} c="white">
                    Información del Club
                  </Title>
                </Group>
                <Stack gap="md">
                  {team.address && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" style={{ minWidth: '100px' }}>
                        Dirección:
                      </Text>
                      <Text size="sm" c="white">
                        {team.address}
                      </Text>
                    </Group>
                  )}
                  {team.website && (
                    <Group gap="xs">
                      <Text size="sm" c="dimmed" style={{ minWidth: '100px' }}>
                        Web:
                      </Text>
                      <Text
                        size="sm"
                        c="blue"
                        component="a"
                        href={team.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        {team.website}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Paper>

              {/* Cuerpo técnico */}
              {team.staff && team.staff.length > 0 && (
                <Paper p="xl" radius="md" style={{ backgroundColor: '#25262b' }}>
                  <Group mb="md">
                    <IconUsers size={24} color="#51cf66" />
                    <Title order={2} c="white">
                      Cuerpo Técnico ({team.staff.length})
                    </Title>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                    {team.staff.map((member) => (
                      <Paper
                        key={member.id}
                        p="md"
                        radius="sm"
                        style={{
                          backgroundColor: '#1a1b1e',
                          border: '1px solid #2c2e33',
                        }}
                      >
                        <Group gap="sm">
                          <Avatar color="gray" radius="xl" size="sm">
                            <IconUser size={16} />
                          </Avatar>
                          <div>
                            <Text size="sm" fw={600}>
                              {member.name}
                            </Text>
                            {member.nationality && (
                              <Text size="xs" c="dimmed">
                                {member.nationality}
                              </Text>
                            )}
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Paper>
              )}
            </Stack>
          </Tabs.Panel>

          {/* Tab: Plantilla */}
          <Tabs.Panel value="squad" pt="xl">
            <Paper p="xl" radius="md" style={{ backgroundColor: '#1a1b1e' }}>
              <Group justify="space-between" mb="xl">
                <Group>
                  <IconUsers size={24} color="#51cf66" />
                  <Title order={2} c="white">
                    Plantilla Completa
                  </Title>
                  <Badge color="green" size="lg" variant="light">
                    {team.squad.length} jugadores
                  </Badge>
                </Group>
                <Button
                  variant="light"
                  color="green"
                  leftSection={<IconRefresh size={16} />}
                  onClick={() => refetchTeam()}
                >
                  Actualizar
                </Button>
              </Group>
              <SquadTable squad={team.squad} />
            </Paper>
          </Tabs.Panel>

          {/* Tab: Últimos Partidos */}
          <Tabs.Panel value="last-matches" pt="xl">
            <Paper p="xl" radius="md" style={{ backgroundColor: '#1a1b1e' }}>
              <Group justify="space-between" mb="xl">
                <Group>
                  <IconBallFootball size={24} color="#51cf66" />
                  <Title order={2} c="white">
                    Últimos Partidos
                  </Title>
                  {lastMatches && (
                    <Badge color="gray" size="lg" variant="light">
                      {lastMatches.matches.length} partidos
                    </Badge>
                  )}
                </Group>
                <Button
                  variant="light"
                  color="green"
                  leftSection={<IconRefresh size={16} />}
                  onClick={() => refetchLastMatches()}
                >
                  Actualizar
                </Button>
              </Group>

              {isLoadingLastMatches && <LoadingState message="Cargando últimos partidos..." />}
              {errorLastMatches && (
                <ErrorState
                  message="No se pudieron cargar los últimos partidos"
                  onRetry={refetchLastMatches}
                />
              )}
              {lastMatches && (
                <MatchList
                  matches={lastMatches.matches}
                  onMatchClick={handleMatchClick}
                  emptyMessage="No hay partidos finalizados recientes"
                />
              )}
            </Paper>
          </Tabs.Panel>

          {/* Tab: Próximos Partidos */}
          <Tabs.Panel value="next-matches" pt="xl">
            <Paper p="xl" radius="md" style={{ backgroundColor: '#1a1b1e' }}>
              <Group justify="space-between" mb="xl">
                <Group>
                  <IconCalendar size={24} color="#51cf66" />
                  <Title order={2} c="white">
                    Próximos Partidos
                  </Title>
                  {nextMatches && (
                    <Badge color="green" size="lg" variant="light">
                      {nextMatches.matches.length} partidos
                    </Badge>
                  )}
                </Group>
                <Button
                  variant="light"
                  color="green"
                  leftSection={<IconRefresh size={16} />}
                  onClick={() => refetchNextMatches()}
                >
                  Actualizar
                </Button>
              </Group>

              {isLoadingNextMatches && <LoadingState message="Cargando próximos partidos..." />}
              {errorNextMatches && (
                <ErrorState
                  message="No se pudieron cargar los próximos partidos"
                  onRetry={refetchNextMatches}
                />
              )}
              {nextMatches && (
                <MatchList
                  matches={nextMatches.matches}
                  emptyMessage="No hay próximos partidos programados"
                />
              )}
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
