/**
 * @module components/competitions/TeamsList
 */

import { SimpleGrid, Paper, Group, Text, Avatar, Stack, Badge, Center } from '@mantine/core';
import { IconShield, IconCalendar } from '@tabler/icons-react';
import type { FullTeam } from '../../types/football.types';

/**
 * Props del componente TeamsList
 */
export interface TeamsListProps {
  /** Array de equipos */
  teams: FullTeam[];
  /** Handler para click en un equipo (opcional) */
  onTeamClick?: (team: FullTeam) => void;
  /** Mensaje cuando no hay equipos (opcional) */
  emptyMessage?: string;
}

/**
 * Componente TeamCard
 * 
 * Muestra información de un equipo en formato de tarjeta
 */
function TeamCard({ team, onClick }: { team: FullTeam; onClick?: () => void }) {
  return (
    <Paper
      p="lg"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        borderColor: '#373A40',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
      }}
      withBorder
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(81, 207, 102, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <Stack gap="md" align="center">
        {/* Escudo del equipo */}
        <Avatar
          src={team.crest}
          alt={team.name}
          size={80}
          radius="md"
          style={{
            border: '2px solid #373A40',
          }}
        >
          <IconShield size={40} color="#868e96" />
        </Avatar>

        {/* Nombre del equipo */}
        <Stack gap={4} align="center" style={{ width: '100%' }}>
          <Text size="md" fw={600} c="white" ta="center" lineClamp={2} style={{ minHeight: '2.4em' }}>
            {team.name}
          </Text>
          <Badge color="gray" variant="light" size="sm">
            {team.tla}
          </Badge>
        </Stack>

        {/* Información adicional */}
        <Stack gap="xs" style={{ width: '100%' }}>
          {team.venue && (
            <Paper p="xs" radius="sm" style={{ backgroundColor: '#1a1b1e' }}>
              <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
                🏟️ {team.venue}
              </Text>
            </Paper>
          )}

          {team.founded && (
            <Group justify="center" gap={4}>
              <IconCalendar size={14} color="#868e96" />
              <Text size="xs" c="dimmed">
                Fundado: {team.founded}
              </Text>
            </Group>
          )}

          {team.clubColors && (
            <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
              🎨 {team.clubColors}
            </Text>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

/**
 * Componente TeamsList
 * 
 * Muestra una lista de equipos en formato de grid responsive.
 * Maneja el estado vacío con un mensaje personalizado.
 * 
 * @param props - Props del componente
 * @returns Elemento JSX con la lista de equipos
 * 
 * @example
 * ```tsx
 * <TeamsList 
 *   teams={teamsData.teams} 
 *   onTeamClick={(team) => navigate(`/teams/${team.id}`)}
 * />
 * ```
 */
export function TeamsList({ teams, onTeamClick, emptyMessage }: TeamsListProps) {
  if (teams.length === 0) {
    return (
      <Paper
        p="xl"
        radius="md"
        style={{
          backgroundColor: '#25262b',
          borderColor: '#373A40',
        }}
        withBorder
      >
        <Center>
          <Stack align="center" gap="md">
            <IconShield size={48} color="#868e96" />
            <Text size="lg" c="dimmed" ta="center">
              {emptyMessage || 'No hay equipos disponibles'}
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <SimpleGrid
      cols={{
        base: 1,
        xs: 2,
        sm: 3,
        md: 4,
        lg: 5,
      }}
      spacing="lg"
    >
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onClick={onTeamClick ? () => onTeamClick(team) : undefined}
        />
      ))}
    </SimpleGrid>
  );
}
