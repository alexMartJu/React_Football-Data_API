/**
 * @module components/matches/MatchH2H
 */

import { Stack, Text, Badge, Paper, Group, Title, Avatar, SimpleGrid } from '@mantine/core';
import { IconTrophy, IconCalendar, IconMapPin } from '@tabler/icons-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MatchesResponse, Match } from '../../types/football.types';

/**
 * Props del componente MatchH2H
 */
export interface MatchH2HProps {
  /** Datos de enfrentamientos directos */
  h2h: MatchesResponse;
  /** ID del equipo local para resaltar victorias */
  homeTeamId: number;
  /** ID del equipo visitante para resaltar victorias */
  awayTeamId: number;
}

/**
 * Componente MatchH2H
 * 
 * Muestra el historial de enfrentamientos directos entre dos equipos:
 * - Estadísticas generales (victorias, empates, derrotas)
 * - Últimos partidos jugados
 * 
 * @param props - Props del componente
 * @returns Elemento JSX del historial H2H
 * 
 * @example
 * ```tsx
 * <MatchH2H h2h={h2hData} homeTeamId={81} awayTeamId={86} />
 * ```
 */
export function MatchH2H({ h2h, homeTeamId, awayTeamId }: MatchH2HProps) {
  /**
   * Obtiene el color de la tarjeta según el resultado para un equipo específico
   */
  const getResultColor = (match: Match, teamId: number): string => {
    if (!match.score.winner) return 'gray';

    if (match.score.winner === 'HOME_TEAM') {
      return match.homeTeam.id === teamId ? 'green' : 'red';
    } else if (match.score.winner === 'AWAY_TEAM') {
      return match.awayTeam.id === teamId ? 'green' : 'red';
    }

    return 'gray';
  };

  /**
   * Obtiene el texto del resultado para un equipo específico
   */
  const getResultText = (match: Match, teamId: number): string => {
    if (!match.score.winner) return 'E';

    if (match.score.winner === 'HOME_TEAM') {
      return match.homeTeam.id === teamId ? 'V' : 'D';
    } else if (match.score.winner === 'AWAY_TEAM') {
      return match.awayTeam.id === teamId ? 'V' : 'D';
    }

    return 'E';
  };

  /**
   * Calcula las estadísticas del equipo local
   */
  const getHomeTeamStats = () => {
    let wins = 0;
    let draws = 0;
    let losses = 0;

    h2h.matches.forEach((match) => {
      const result = getResultText(match, homeTeamId);
      if (result === 'V') wins++;
      else if (result === 'E') draws++;
      else if (result === 'D') losses++;
    });

    return { wins, draws, losses };
  };

  /**
   * Calcula las estadísticas del equipo visitante
   */
  const getAwayTeamStats = () => {
    let wins = 0;
    let draws = 0;
    let losses = 0;

    h2h.matches.forEach((match) => {
      const result = getResultText(match, awayTeamId);
      if (result === 'V') wins++;
      else if (result === 'E') draws++;
      else if (result === 'D') losses++;
    });

    return { wins, draws, losses };
  };

  const homeStats = getHomeTeamStats();
  const awayStats = getAwayTeamStats();

  if (h2h.matches.length === 0) {
    return (
      <Paper
        p="xl"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          border: '1px solid #373A40',
        }}
      >
        <Stack align="center" gap="md" py="xl">
          <IconTrophy size={48} color="#868e96" />
          <Text c="dimmed" size="lg">
            No hay historial de enfrentamientos disponible
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap="lg">
      {/* Estadísticas Generales */}
      <Paper
        p="lg"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          border: '1px solid #373A40',
        }}
      >
        <Title order={3} c="white" mb="md">
          Estadísticas Generales
        </Title>

        <Text c="dimmed" size="sm" mb="lg">
          Últimos {h2h.matches.length} enfrentamientos
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {/* Equipo Local */}
          <Paper
            p="md"
            radius="sm"
            style={{
              backgroundColor: '#1a1b1e',
              border: '1px solid #373A40',
            }}
          >
            <Text fw={600} size="sm" c="dimmed" mb="md">
              Equipo Local
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Victorias</Text>
                <Badge color="green" variant="filled">
                  {homeStats.wins}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Empates</Text>
                <Badge color="gray" variant="filled">
                  {homeStats.draws}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Derrotas</Text>
                <Badge color="red" variant="filled">
                  {homeStats.losses}
                </Badge>
              </Group>
            </Stack>
          </Paper>

          {/* Equipo Visitante */}
          <Paper
            p="md"
            radius="sm"
            style={{
              backgroundColor: '#1a1b1e',
              border: '1px solid #373A40',
            }}
          >
            <Text fw={600} size="sm" c="dimmed" mb="md">
              Equipo Visitante
            </Text>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Victorias</Text>
                <Badge color="green" variant="filled">
                  {awayStats.wins}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Empates</Text>
                <Badge color="gray" variant="filled">
                  {awayStats.draws}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Derrotas</Text>
                <Badge color="red" variant="filled">
                  {awayStats.losses}
                </Badge>
              </Group>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Paper>

      {/* Últimos Partidos */}
      <Paper
        p="lg"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          border: '1px solid #373A40',
        }}
      >
        <Title order={3} c="white" mb="lg">
          Últimos Partidos
        </Title>

        <Stack gap="md">
          {h2h.matches.map((match) => (
            <Paper
              key={match.id}
              p="md"
              radius="sm"
              style={{
                backgroundColor: '#1a1b1e',
                border: '1px solid #373A40',
              }}
            >
              {/* Fecha y competición */}
              <Group gap="xs" mb="md">
                <IconCalendar size={16} color="#868e96" />
                <Text size="sm" c="dimmed">
                  {format(new Date(match.utcDate), "d 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })}
                </Text>
                <Badge size="sm" variant="light" color="blue">
                  {match.competition.name}
                </Badge>
              </Group>

              {/* Equipos y resultado */}
              <Group justify="space-between" align="center" mb="sm">
                {/* Equipo Local */}
                <Group gap="sm" style={{ flex: 1 }}>
                  <Avatar src={match.homeTeam.crest} size={32} radius="sm" />
                  <Text size="sm" fw={600}>
                    {match.homeTeam.name}
                  </Text>
                  <Badge
                    size="sm"
                    color={getResultColor(match, match.homeTeam.id)}
                    variant="filled"
                  >
                    {getResultText(match, match.homeTeam.id)}
                  </Badge>
                </Group>

                {/* Marcador */}
                <Paper
                  px="lg"
                  py="xs"
                  radius="sm"
                  style={{
                    backgroundColor: '#25262b',
                    border: '1px solid #373A40',
                  }}
                >
                  <Text size="xl" fw={700} ta="center">
                    {match.score.fullTime.home ?? '-'} - {match.score.fullTime.away ?? '-'}
                  </Text>
                </Paper>

                {/* Equipo Visitante */}
                <Group gap="sm" style={{ flex: 1 }} justify="flex-end">
                  <Badge
                    size="sm"
                    color={getResultColor(match, match.awayTeam.id)}
                    variant="filled"
                  >
                    {getResultText(match, match.awayTeam.id)}
                  </Badge>
                  <Text size="sm" fw={600}>
                    {match.awayTeam.name}
                  </Text>
                  <Avatar src={match.awayTeam.crest} size={32} radius="sm" />
                </Group>
              </Group>

              {/* Información adicional */}
              {match.venue && (
                <Group gap="xs" mt="sm">
                  <IconMapPin size={14} color="#868e96" />
                  <Text size="xs" c="dimmed">
                    {match.venue}
                  </Text>
                </Group>
              )}
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
