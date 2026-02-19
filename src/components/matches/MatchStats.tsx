/**
 * @module components/matches/MatchStats
 */

import { Stack, Text, Paper, Group, Progress, Title, SimpleGrid } from '@mantine/core';
import type { Match } from '../../types/football.types';

/**
 * Props del componente MatchStats
 */
export interface MatchStatsProps {
  /** Información del partido con estadísticas */
  match: Match;
}

/**
 * Componente MatchStats
 * 
 * Muestra las estadísticas del partido incluyendo:
 * - Posesión de balón
 * - Tiros a puerta
 * - Corners
 * - Faltas
 * - Tarjetas
 * - Y más estadísticas
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de las estadísticas
 * 
 * @example
 * ```tsx
 * <MatchStats match={matchData} />
 * ```
 */
export function MatchStats({ match }: MatchStatsProps) {
  const homeStats = match.homeTeam.statistics;
  const awayStats = match.awayTeam.statistics;

  if (!homeStats || !awayStats) {
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
          <Text c="dimmed" size="lg">
            Las estadísticas no están disponibles para este partido
          </Text>
        </Stack>
      </Paper>
    );
  }

  /**
   * Renderiza una barra de estadística comparativa
   */
  const renderStatBar = (label: string, homeValue: number, awayValue: number, showPercentage = false) => {
    const total = homeValue + awayValue;
    const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;

    return (
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600} size="sm">
            {showPercentage ? `${homeValue}%` : homeValue}
          </Text>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Text fw={600} size="sm">
            {showPercentage ? `${awayValue}%` : awayValue}
          </Text>
        </Group>
        <Progress.Root size={24} radius="xl">
          <Progress.Section value={homePercentage} color="green">
            <Progress.Label>{homePercentage.toFixed(0)}%</Progress.Label>
          </Progress.Section>
          <Progress.Section value={100 - homePercentage} color="blue">
            <Progress.Label>{(100 - homePercentage).toFixed(0)}%</Progress.Label>
          </Progress.Section>
        </Progress.Root>
      </Stack>
    );
  };

  /**
   * Renderiza una estadística en formato de tarjeta
   */
  const renderStatCard = (label: string, homeValue: number, awayValue: number) => (
    <Paper
      p="md"
      radius="sm"
      style={{
        backgroundColor: '#1a1b1e',
        border: '1px solid #373A40',
        textAlign: 'center',
      }}
    >
      <Text size="xs" c="dimmed" mb="xs">
        {label}
      </Text>
      <Group justify="space-around" grow>
        <Text size="xl" fw={700} c="green">
          {homeValue}
        </Text>
        <Text size="xl" fw={700} c="blue">
          {awayValue}
        </Text>
      </Group>
    </Paper>
  );

  return (
    <Stack gap="xl">
      {/* Encabezados de equipos */}
      <Group justify="space-between" px="md">
        <Text fw={700} c="green" size="lg">
          {match.homeTeam.shortName}
        </Text>
        <Text fw={700} c="blue" size="lg">
          {match.awayTeam.shortName}
        </Text>
      </Group>

      {/* Posesión de Balón */}
      {homeStats.ball_possession !== undefined && awayStats.ball_possession !== undefined && (
        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '1px solid #373A40',
          }}
        >
          <Title order={4} c="white" mb="md" ta="center">
            Posesión de Balón
          </Title>
          {renderStatBar('', homeStats.ball_possession, awayStats.ball_possession, true)}
        </Paper>
      )}

      {/* Estadísticas Principales */}
      <Paper
        p="lg"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          border: '1px solid #373A40',
        }}
      >
        <Stack gap="lg">
          <Title order={4} c="white" mb="sm">
            Estadísticas Principales
          </Title>

          {homeStats.shots !== undefined && awayStats.shots !== undefined &&
            renderStatBar('Tiros', homeStats.shots, awayStats.shots)}

          {homeStats.shots_on_goal !== undefined && awayStats.shots_on_goal !== undefined &&
            renderStatBar('Tiros a puerta', homeStats.shots_on_goal, awayStats.shots_on_goal)}

          {homeStats.shots_off_goal !== undefined && awayStats.shots_off_goal !== undefined &&
            renderStatBar('Tiros fuera', homeStats.shots_off_goal, awayStats.shots_off_goal)}

          {homeStats.corner_kicks !== undefined && awayStats.corner_kicks !== undefined &&
            renderStatBar('Corners', homeStats.corner_kicks, awayStats.corner_kicks)}

          {homeStats.fouls !== undefined && awayStats.fouls !== undefined &&
            renderStatBar('Faltas', homeStats.fouls, awayStats.fouls)}

          {homeStats.offsides !== undefined && awayStats.offsides !== undefined &&
            renderStatBar('Fueras de juego', homeStats.offsides, awayStats.offsides)}
        </Stack>
      </Paper>

      {/* Tarjetas */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {homeStats.yellow_cards !== undefined && awayStats.yellow_cards !== undefined &&
          renderStatCard('Tarjetas Amarillas', homeStats.yellow_cards, awayStats.yellow_cards)}

        {homeStats.yellow_red_cards !== undefined && awayStats.yellow_red_cards !== undefined &&
          renderStatCard('Segunda Amarillas', homeStats.yellow_red_cards, awayStats.yellow_red_cards)}

        {homeStats.red_cards !== undefined && awayStats.red_cards !== undefined &&
          renderStatCard('Tarjetas Rojas', homeStats.red_cards, awayStats.red_cards)}
      </SimpleGrid>

      {/* Otras Estadísticas */}
      <Paper
        p="lg"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          border: '1px solid #373A40',
        }}
      >
        <Stack gap="lg">
          <Title order={4} c="white" mb="sm">
            Otras Estadísticas
          </Title>

          {homeStats.saves !== undefined && awayStats.saves !== undefined &&
            renderStatBar('Paradas', homeStats.saves, awayStats.saves)}

          {homeStats.throw_ins !== undefined && awayStats.throw_ins !== undefined &&
            renderStatBar('Saques de banda', homeStats.throw_ins, awayStats.throw_ins)}

          {homeStats.goal_kicks !== undefined && awayStats.goal_kicks !== undefined &&
            renderStatBar('Saques de meta', homeStats.goal_kicks, awayStats.goal_kicks)}

          {homeStats.free_kicks !== undefined && awayStats.free_kicks !== undefined &&
            renderStatBar('Tiros libres', homeStats.free_kicks, awayStats.free_kicks)}
        </Stack>
      </Paper>
    </Stack>
  );
}
