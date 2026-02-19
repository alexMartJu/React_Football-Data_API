/**
 * @module components/matches/MatchLineups
 */

import { Group, Stack, Text, Badge, Paper, Avatar, Title, SimpleGrid } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import type { Match } from '../../types/football.types';

/**
 * Props del componente MatchLineups
 */
export interface MatchLineupsProps {
  /** Información del partido con alineaciones */
  match: Match;
}

/**
 * Componente MatchLineups
 * 
 * Muestra las alineaciones de ambos equipos incluyendo:
 * - Formación táctica
 * - Jugadores titulares
 * - Jugadores suplentes
 * - Dorsal y posición
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de las alineaciones
 * 
 * @example
 * ```tsx
 * <MatchLineups match={matchData} />
 * ```
 */
export function MatchLineups({ match }: MatchLineupsProps) {
  const hasLineups = match.homeTeam.lineup && match.awayTeam.lineup;

  if (!hasLineups) {
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
          <IconUser size={48} color="#868e96" />
          <Text c="dimmed" size="lg">
            Las alineaciones no están disponibles para este partido
          </Text>
        </Stack>
      </Paper>
    );
  }

  /**
   * Renderiza la lista de jugadores
   */
  const renderPlayerList = (players: typeof match.homeTeam.lineup, title: string) => (
    <Stack gap="md">
      <Title order={4} c="green" style={{ borderBottom: '2px solid #51cf66', paddingBottom: '8px' }}>
        {title} ({players?.length || 0})
      </Title>
      <Stack gap="xs">
        {players?.map((player) => (
          <Group
            key={player.id}
            p="sm"
            gap="sm"
            style={{
              backgroundColor: '#1a1b1e',
              borderRadius: '8px',
              border: '1px solid #373A40',
            }}
          >
            {/* Dorsal */}
            <Badge
              size="lg"
              color="dark"
              variant="filled"
              radius="sm"
              style={{
                fontWeight: 700,
                minWidth: '40px',
              }}
            >
              {player.shirtNumber ?? '-'}
            </Badge>

            {/* Avatar */}
            <Avatar color="green" radius="xl" size="md">
              <IconUser size={20} />
            </Avatar>

            {/* Info del jugador */}
            <div style={{ flex: 1 }}>
              <Text fw={600} size="sm">
                {player.name}
              </Text>
              {player.position && (
                <Text size="xs" c="dimmed">
                  {player.position}
                </Text>
              )}
            </div>
          </Group>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Stack gap="xl">
      {/* Formaciones */}
      <Group justify="space-around" grow>
        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '2px solid #51cf66',
            textAlign: 'center',
          }}
        >
          <Group gap="sm" justify="center">
            <Avatar src={match.homeTeam.crest} size={40} radius="md" />
            <div>
              <Text size="xs" c="dimmed">
                Formación
              </Text>
              <Title order={2} c="green">
                {match.homeTeam.formation || 'N/A'}
              </Title>
            </div>
          </Group>
        </Paper>

        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '2px solid #51cf66',
            textAlign: 'center',
          }}
        >
          <Group gap="sm" justify="center">
            <Avatar src={match.awayTeam.crest} size={40} radius="md" />
            <div>
              <Text size="xs" c="dimmed">
                Formación
              </Text>
              <Title order={2} c="green">
                {match.awayTeam.formation || 'N/A'}
              </Title>
            </div>
          </Group>
        </Paper>
      </Group>

      {/* Alineaciones */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        {/* Equipo Local */}
        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '1px solid #373A40',
          }}
        >
          <Stack gap="xl">
            {/* Header del equipo */}
            <Group gap="sm">
              <Avatar src={match.homeTeam.crest} size={50} radius="md" />
              <div>
                <Title order={3}>{match.homeTeam.name}</Title>
                {match.homeTeam.coach && (
                  <Text size="sm" c="dimmed">
                    DT: {match.homeTeam.coach.name}
                  </Text>
                )}
              </div>
            </Group>

            {/* Titulares */}
            {renderPlayerList(match.homeTeam.lineup, 'Titulares')}

            {/* Suplentes */}
            {match.homeTeam.bench && match.homeTeam.bench.length > 0 && (
              <>{renderPlayerList(match.homeTeam.bench, 'Suplentes')}</>
            )}
          </Stack>
        </Paper>

        {/* Equipo Visitante */}
        <Paper
          p="lg"
          radius="md"
          style={{
            backgroundColor: '#25262b',
            border: '1px solid #373A40',
          }}
        >
          <Stack gap="xl">
            {/* Header del equipo */}
            <Group gap="sm">
              <Avatar src={match.awayTeam.crest} size={50} radius="md" />
              <div>
                <Title order={3}>{match.awayTeam.name}</Title>
                {match.awayTeam.coach && (
                  <Text size="sm" c="dimmed">
                    DT: {match.awayTeam.coach.name}
                  </Text>
                )}
              </div>
            </Group>

            {/* Titulares */}
            {renderPlayerList(match.awayTeam.lineup, 'Titulares')}

            {/* Suplentes */}
            {match.awayTeam.bench && match.awayTeam.bench.length > 0 && (
              <>{renderPlayerList(match.awayTeam.bench, 'Suplentes')}</>
            )}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
