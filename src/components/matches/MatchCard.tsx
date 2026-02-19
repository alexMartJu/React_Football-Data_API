/**
 * @module components/matches/MatchCard
 */

import { Card, Group, Stack, Text, Badge, Image, rem, Box } from '@mantine/core';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Match } from '../../types/football.types';
import { MATCH_STATUS_COLORS, MATCH_STATUS_LABELS } from '../../constants/competitions';

/**
 * Props del componente MatchCard
 */
export interface MatchCardProps {
  /** Datos del partido a mostrar */
  match: Match;
  /** Handler para click en el card (opcional) */
  onClick?: () => void;
}

/**
 * Componente MatchCard
 * 
 * Muestra la información de un partido en formato de tarjeta incluyendo:
 * - Equipos con escudos
 * - Resultado o hora del partido
 * - Estado del partido
 * - Competición
 * 
 * Implementa gestión de imágenes de forma eficiente (caché del navegador).
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la tarjeta del partido
 * 
 * @example
 * ```tsx
 * <MatchCard match={matchData} onClick={() => navigate(`/match/${matchData.id}`)} />
 * ```
 */
export function MatchCard({ match, onClick }: MatchCardProps) {
  const matchDate = parseISO(match.utcDate);
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const statusColor = MATCH_STATUS_COLORS[match.status] || '#868e96';

  /**
   * Formatea la hora del partido
   */
  const getMatchTime = (): string => {
    if (isLive && match.minute) {
      return `${match.minute}'`;
    }
    return format(matchDate, 'HH:mm', { locale: es });
  };

  /**
   * Obtiene el resultado del partido
   */
  const getScore = (): string => {
    if (match.score.fullTime.home !== null && match.score.fullTime.away !== null) {
      return `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
    }
    return '-';
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        backgroundColor: '#25262b',
        borderColor: '#373A40',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      <Stack gap="md">
        {/* Header con competición y estado */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            {match.competition.emblem && (
              <Image
                src={match.competition.emblem}
                alt={match.competition.name}
                w={20}
                h={20}
                fit="contain"
              />
            )}
            <Text size="xs" c="dimmed" fw={500}>
              {match.competition.name}
            </Text>
          </Group>
          <Badge
            color={statusColor}
            variant={isLive ? 'filled' : 'light'}
            size="sm"
            style={{
              animation: isLive ? 'pulse 2s infinite' : 'none',
            }}
          >
            {MATCH_STATUS_LABELS[match.status] || match.status}
          </Badge>
        </Group>

        {/* Equipos y resultado */}
        <Group justify="space-between" align="center" gap="md">
          {/* Equipo local */}
          <Stack gap={rem(8)} align="center" style={{ flex: 1 }}>
            <Box
              style={{
                width: rem(60),
                height: rem(60),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2c2e33',
                borderRadius: '50%',
                padding: rem(8),
              }}
            >
              {match.homeTeam.crest ? (
                <Image
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.name}
                  w={44}
                  h={44}
                  fit="contain"
                />
              ) : (
                <Text size="xl" fw={700} c="dimmed">
                  {match.homeTeam.tla}
                </Text>
              )}
            </Box>
            <Text
              size="sm"
              fw={600}
              ta="center"
              c="white"
              style={{
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {match.homeTeam.shortName}
            </Text>
          </Stack>

          {/* Resultado o hora */}
          <Stack gap={rem(4)} align="center">
            {isFinished || isLive ? (
              <>
                <Text size="xl" fw={700} c="white">
                  {getScore()}
                </Text>
                {isLive && (
                  <Text size="xs" c="green">
                    EN VIVO
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text size="lg" fw={600} c="dimmed">
                  VS
                </Text>
                <Text size="sm" c="dimmed">
                  {getMatchTime()}
                </Text>
              </>
            )}
          </Stack>

          {/* Equipo visitante */}
          <Stack gap={rem(8)} align="center" style={{ flex: 1 }}>
            <Box
              style={{
                width: rem(60),
                height: rem(60),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2c2e33',
                borderRadius: '50%',
                padding: rem(8),
              }}
            >
              {match.awayTeam.crest ? (
                <Image
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.name}
                  w={44}
                  h={44}
                  fit="contain"
                />
              ) : (
                <Text size="xl" fw={700} c="dimmed">
                  {match.awayTeam.tla}
                </Text>
              )}
            </Box>
            <Text
              size="sm"
              fw={600}
              ta="center"
              c="white"
              style={{
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {match.awayTeam.shortName}
            </Text>
          </Stack>
        </Group>

        {/* Footer con información adicional */}
        <Group justify="space-between" mt="xs">
          <Text size="xs" c="dimmed">
            {format(matchDate, "d 'de' MMMM, yyyy", { locale: es })}
          </Text>
          {match.matchday && (
            <Text size="xs" c="dimmed">
              Jornada {match.matchday}
            </Text>
          )}
        </Group>
      </Stack>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>
    </Card>
  );
}
