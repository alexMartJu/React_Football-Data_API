/**
 * @module components/matches/MatchTimeline
 */

import { Stack, Text, Badge, Paper, Group, Timeline, Title, Avatar } from '@mantine/core';
import {
  IconBallFootball,
  IconCards,
  IconReplace,
  IconUser,
} from '@tabler/icons-react';
import type { Match, Goal, Booking, Substitution } from '../../types/football.types';

/**
 * Props del componente MatchTimeline
 */
export interface MatchTimelineProps {
  /** Información del partido con eventos */
  match: Match;
}

/**
 * Tipo de evento unificado para la línea de tiempo
 */
type TimelineEvent = {
  minute: number;
  type: 'goal' | 'booking' | 'substitution';
  data: Goal | Booking | Substitution;
};

/**
 * Componente MatchTimeline
 * 
 * Muestra la línea de tiempo del partido incluyendo:
 * - Goles
 * - Tarjetas (amarillas y rojas)
 * - Sustituciones
 * 
 * Todos los eventos ordenados cronológicamente.
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la línea de tiempo
 * 
 * @example
 * ```tsx
 * <MatchTimeline match={matchData} />
 * ```
 */
export function MatchTimeline({ match }: MatchTimelineProps) {
  /**
   * Combina todos los eventos en una sola línea de tiempo ordenada
   */
  const getTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Agregar goles
    match.goals?.forEach((goal) => {
      events.push({
        minute: goal.minute + (goal.injuryTime || 0),
        type: 'goal',
        data: goal,
      });
    });

    // Agregar tarjetas
    match.bookings?.forEach((booking) => {
      events.push({
        minute: booking.minute,
        type: 'booking',
        data: booking,
      });
    });

    // Agregar sustituciones
    match.substitutions?.forEach((sub) => {
      events.push({
        minute: sub.minute,
        type: 'substitution',
        data: sub,
      });
    });

    // Ordenar por minuto
    return events.sort((a, b) => a.minute - b.minute);
  };

  /**
   * Renderiza el icono según el tipo de evento
   */
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return <IconBallFootball size={20} />;
      case 'booking':
        return <IconCards size={20} />;
      case 'substitution':
        return <IconReplace size={20} />;
      default:
        return <IconUser size={20} />;
    }
  };

  /**
   * Obtiene el color según el tipo de evento
   */
  const getEventColor = (type: string, data?: any) => {
    switch (type) {
      case 'goal':
        return 'green';
      case 'booking':
        return data?.card === 'YELLOW' ? 'yellow' : 'red';
      case 'substitution':
        return 'blue';
      default:
        return 'gray';
    }
  };

  /**
   * Renderiza el contenido de un gol
   */
  const renderGoalEvent = (goal: Goal) => {
    const teamCrest = goal.team.id === match.homeTeam.id ? match.homeTeam.crest : match.awayTeam.crest;
    return (
      <Group gap="sm" align="flex-start">
        <Avatar src={teamCrest} size={30} radius="sm" />
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb={4}>
            <Text fw={700} size="sm">
              {goal.scorer.name}
            </Text>
            {goal.type === 'PENALTY' && (
              <Badge size="xs" color="orange" variant="light">
                Penalti
              </Badge>
            )}
            {goal.type === 'OWN' && (
              <Badge size="xs" color="red" variant="light">
                Autogol
              </Badge>
            )}
          </Group>
          {goal.assist && (
            <Text size="xs" c="dimmed">
              Asistencia de {goal.assist.name}
            </Text>
          )}
          <Text size="xs" c="dimmed" mt={4}>
            {goal.score.home} - {goal.score.away}
          </Text>
        </div>
      </Group>
    );
  };

  /**
   * Renderiza el contenido de una tarjeta
   */
  const renderBookingEvent = (booking: Booking) => {
    const teamCrest = booking.team.id === match.homeTeam.id ? match.homeTeam.crest : match.awayTeam.crest;
    return (
      <Group gap="sm" align="flex-start">
        <Avatar src={teamCrest} size={30} radius="sm" />
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb={4}>
            <Text fw={600} size="sm">
              {booking.player.name}
            </Text>
            <Badge
              size="xs"
              color={booking.card === 'YELLOW' ? 'yellow' : 'red'}
              variant="filled"
            >
              {booking.card === 'YELLOW'
                ? 'Tarjeta Amarilla'
                : booking.card === 'YELLOW_RED'
                ? 'Segunda Amarilla'
                : 'Tarjeta Roja'}
            </Badge>
          </Group>
        </div>
      </Group>
    );
  };

  /**
   * Renderiza el contenido de una sustitución
   */
  const renderSubstitutionEvent = (sub: Substitution) => {
    const teamCrest = sub.team.id === match.homeTeam.id ? match.homeTeam.crest : match.awayTeam.crest;
    return (
      <Group gap="sm" align="flex-start">
        <Avatar src={teamCrest} size={30} radius="sm" />
        <div style={{ flex: 1 }}>
          <Group gap="xs" mb={4}>
            <IconReplace size={16} color="#51cf66" />
            <Text size="sm" c="red" style={{ textDecoration: 'line-through' }}>
              {sub.playerOut.name}
            </Text>
          </Group>
          <Group gap="xs">
            <Text size="sm" c="green" fw={600}>
              ↪ {sub.playerIn.name}
            </Text>
          </Group>
        </div>
      </Group>
    );
  };

  /**
   * Renderiza el contenido del evento según su tipo
   */
  const renderEventContent = (event: TimelineEvent) => {
    switch (event.type) {
      case 'goal':
        return renderGoalEvent(event.data as Goal);
      case 'booking':
        return renderBookingEvent(event.data as Booking);
      case 'substitution':
        return renderSubstitutionEvent(event.data as Substitution);
      default:
        return null;
    }
  };

  const timelineEvents = getTimelineEvents();

  if (timelineEvents.length === 0) {
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
          <IconBallFootball size={48} color="#868e96" />
          <Text c="dimmed" size="lg">
            No hay eventos disponibles para este partido
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      p="lg"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        border: '1px solid #373A40',
      }}
    >
      <Title order={3} c="white" mb="xl">
        Cronología del Partido
      </Title>

      <Timeline active={timelineEvents.length} bulletSize={36} lineWidth={2} color="green">
        {timelineEvents.map((event, index) => (
          <Timeline.Item
            key={index}
            bullet={getEventIcon(event.type)}
            title={
              <Badge
                size="lg"
                color={getEventColor(event.type, event.data)}
                variant="filled"
                radius="sm"
              >
                {event.minute}'
                {event.type === 'goal' && (event.data as Goal).injuryTime
                  ? ` +${(event.data as Goal).injuryTime}`
                  : ''}
              </Badge>
            }
          >
            <Paper
              p="md"
              mt="xs"
              radius="sm"
              style={{
                backgroundColor: '#1a1b1e',
                border: '1px solid #373A40',
              }}
            >
              {renderEventContent(event)}
            </Paper>
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
}
