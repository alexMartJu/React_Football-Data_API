/**
 * @module components/matches/MatchHeader
 */

import { Group, Stack, Text, Badge, Paper, Title, Avatar, Center, Box } from '@mantine/core';
import { IconCalendar, IconClock, IconMapPin, IconUsers, IconUserCheck } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Match } from '../../types/football.types';
import { MATCH_STATUS_COLORS } from '../../constants/competitions';

/**
 * Props del componente MatchHeader
 */
export interface MatchHeaderProps {
  /** Información del partido */
  match: Match;
}

/**
 * Componente MatchHeader
 * 
 * Muestra la información general del partido incluyendo:
 * - Equipos enfrentados con escudos
 * - Resultado final o hora del partido
 * - Estado del partido
 * - Fecha, Hora y Estadio
 * - Árbitros
 * - Asistencia
 * 
 * @param props - Props del componente
 * @returns Elemento JSX del encabezado del partido
 * 
 * @example
 * ```tsx
 * <MatchHeader match={matchData} />
 * ```
 */
export function MatchHeader({ match }: MatchHeaderProps) {
  const matchDate = parseISO(match.utcDate);
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const statusColor = MATCH_STATUS_COLORS[match.status] || '#868e96';

  /**
   * Obtiene la etiqueta del estado en español
   */
  const getStatusLabel = (): string => {
    const labels: Record<string, string> = {
      SCHEDULED: 'Programado',
      TIMED: 'Programado',
      IN_PLAY: 'En Juego',
      PAUSED: 'Descanso',
      FINISHED: 'Finalizado',
      SUSPENDED: 'Suspendido',
      POSTPONED: 'Pospuesto',
      CANCELLED: 'Cancelado',
      AWARDED: 'Concedido',
    };
    return labels[match.status] || match.status;
  };

  /**
   * Obtiene el árbitro principal
   */
  const getMainReferee = () => {
    return match.referees?.find((ref) => ref.type === 'REFEREE');
  };

  /**
   * Formatea el resultado del partido
   */
  const getScore = (): string => {
    if (!isFinished && !isLive) return 'vs';
    return `${match.score.fullTime.home ?? '-'} : ${match.score.fullTime.away ?? '-'}`;
  };

  const mainReferee = getMainReferee();

  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        border: '1px solid #373A40',
      }}
    >
      <Stack gap="xl">
        {/* Competición y Estado */}
        <Group justify="space-between">
          <Group gap="sm">
            {match.competition.emblem && (
              <Avatar src={match.competition.emblem} size={30} radius="sm" />
            )}
            <div>
              <Text size="sm" c="dimmed">
                {match.competition.name}
              </Text>
              {match.season && (
                <Text size="xs" c="dimmed">
                  Temporada {match.season.startDate.substring(0, 4)}/{match.season.endDate.substring(2, 4)}
                </Text>
              )}
            </div>
          </Group>
          <Badge
            size="lg"
            color={statusColor}
            variant="filled"
            radius="sm"
            style={{ fontWeight: 600 }}
          >
            {getStatusLabel()}
          </Badge>
        </Group>

        {/* Equipos y Resultado */}
        <Group justify="space-between" align="center" gap="xl">
          {/* Equipo Local */}
          <Stack gap="sm" align="center" style={{ flex: 1 }}>
            <Avatar
              src={match.homeTeam.crest}
              size={100}
              radius="md"
              style={{
                border: '2px solid #51cf66',
                backgroundColor: '#1a1b1e',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <Title order={3} c="white">
                {match.homeTeam.name}
              </Title>
              <Text size="sm" c="dimmed">
                {match.homeTeam.tla}
              </Text>
            </div>
          </Stack>

          {/* Resultado */}
          <Center>
            <Box style={{ textAlign: 'center' }}>
              <Title order={1} size={60} c={isFinished ? 'white' : 'dimmed'} fw={700}>
                {getScore()}
              </Title>
              {match.score.halfTime && (
                <Text size="sm" c="dimmed" mt="xs">
                  HT: {match.score.halfTime.home} - {match.score.halfTime.away}
                </Text>
              )}
              {match.score.duration === 'PENALTY_SHOOTOUT' && match.score.penalties && (
                <Badge color="orange" variant="light" mt="xs">
                  Penaltis: {match.score.penalties.home} - {match.score.penalties.away}
                </Badge>
              )}
            </Box>
          </Center>

          {/* Equipo Visitante */}
          <Stack gap="sm" align="center" style={{ flex: 1 }}>
            <Avatar
              src={match.awayTeam.crest}
              size={100}
              radius="md"
              style={{
                border: '2px solid #51cf66',
                backgroundColor: '#1a1b1e',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <Title order={3} c="white">
                {match.awayTeam.name}
              </Title>
              <Text size="sm" c="dimmed">
                {match.awayTeam.tla}
              </Text>
            </div>
          </Stack>
        </Group>

        {/* Información Adicional */}
        <Group justify="space-around" grow>
          {/* Fecha */}
          <Paper p="md" radius="sm" style={{ backgroundColor: '#1a1b1e' }}>
            <Group gap="sm">
              <IconCalendar size={20} color="#51cf66" />
              <div>
                <Text size="xs" c="dimmed">
                  Fecha
                </Text>
                <Text size="sm" fw={600}>
                  {format(matchDate, "d 'de' MMMM, yyyy", { locale: es })}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Hora */}
          <Paper p="md" radius="sm" style={{ backgroundColor: '#1a1b1e' }}>
            <Group gap="sm">
              <IconClock size={20} color="#51cf66" />
              <div>
                <Text size="xs" c="dimmed">
                  Hora
                </Text>
                <Text size="sm" fw={600}>
                  {format(matchDate, 'HH:mm', { locale: es })}
                </Text>
              </div>
            </Group>
          </Paper>

          {/* Estadio */}
          {match.venue && (
            <Paper p="md" radius="sm" style={{ backgroundColor: '#1a1b1e' }}>
              <Group gap="sm">
                <IconMapPin size={20} color="#51cf66" />
                <div>
                  <Text size="xs" c="dimmed">
                    Estadio
                  </Text>
                  <Text size="sm" fw={600} lineClamp={1}>
                    {match.venue}
                  </Text>
                </div>
              </Group>
            </Paper>
          )}

          {/* Asistencia */}
          {match.attendance && (
            <Paper p="md" radius="sm" style={{ backgroundColor: '#1a1b1e' }}>
              <Group gap="sm">
                <IconUsers size={20} color="#51cf66" />
                <div>
                  <Text size="xs" c="dimmed">
                    Asistencia
                  </Text>
                  <Text size="sm" fw={600}>
                    {match.attendance.toLocaleString()}
                  </Text>
                </div>
              </Group>
            </Paper>
          )}

          {/* Árbitro */}
          {mainReferee && (
            <Paper p="md" radius="sm" style={{ backgroundColor: '#1a1b1e' }}>
              <Group gap="sm">
                <IconUserCheck size={20} color="#51cf66" />
                <div>
                  <Text size="xs" c="dimmed">
                    Árbitro
                  </Text>
                  <Text size="sm" fw={600} lineClamp={1}>
                    {mainReferee.name}
                  </Text>
                </div>
              </Group>
            </Paper>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
