/**
 * @module components/teams/CoachCard
 */

import { Paper, Group, Text, Avatar, Badge, Stack, Divider } from '@mantine/core';
import { IconUser, IconCalendar, IconFlag, IconFileText } from '@tabler/icons-react';
import type { CoachWithContract } from '../../types/football.types';

/**
 * Props del componente CoachCard
 */
export interface CoachCardProps {
  /** Información del entrenador */
  coach: CoachWithContract;
}

/**
 * Componente CoachCard
 * 
 * Muestra información del entrenador incluyendo:
 * - Nombre completo
 * - Nacionalidad
 * - Fecha de nacimiento y edad
 * - Información del contrato (inicio y fin)
 * 
 * @param props - Props del componente
 * @returns Elemento JSX de la tarjeta del entrenador
 * 
 * @example
 * ```tsx
 * <CoachCard coach={team.coach} />
 * ```
 */
export function CoachCard({ coach }: CoachCardProps) {
  /**
   * Calcula la edad a partir de la fecha de nacimiento
   */
  const calculateAge = (dateOfBirth: string | null): string => {
    if (!dateOfBirth) return '-';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  /**
   * Formatea la fecha para mostrar
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        border: '2px solid #51cf66',
      }}
    >
      <Stack gap="lg">
        {/* Header con avatar y nombre */}
        <Group>
          <Avatar
            size={80}
            radius="xl"
            color="green"
            style={{
              border: '3px solid #51cf66',
            }}
          >
            <IconUser size={40} />
          </Avatar>
          <div style={{ flex: 1 }}>
            <Badge
              size="sm"
              color="green"
              variant="light"
              mb="xs"
              leftSection={<IconUser size={12} />}
            >
              Entrenador
            </Badge>
            <Text size="xl" fw={700} c="white">
              {coach.name}
            </Text>
            {coach.firstName && coach.lastName && (
              <Text size="sm" c="dimmed">
                {coach.firstName} {coach.lastName}
              </Text>
            )}
          </div>
        </Group>

        <Divider color="dark" />

        {/* Información personal */}
        <Stack gap="md">
          {/* Nacionalidad */}
          {coach.nationality && (
            <Group gap="xs">
              <IconFlag size={18} color="#51cf66" />
              <Text size="sm" c="dimmed" style={{ flex: 0, minWidth: '100px' }}>
                Nacionalidad:
              </Text>
              <Badge color="blue" variant="light">
                {coach.nationality}
              </Badge>
            </Group>
          )}

          {/* Fecha de nacimiento y edad */}
          {coach.dateOfBirth && (
            <Group gap="xs">
              <IconCalendar size={18} color="#51cf66" />
              <Text size="sm" c="dimmed" style={{ flex: 0, minWidth: '100px' }}>
                Nacimiento:
              </Text>
              <Text size="sm" c="white">
                {formatDate(coach.dateOfBirth)}
              </Text>
              <Badge color="gray" variant="light">
                {calculateAge(coach.dateOfBirth)} años
              </Badge>
            </Group>
          )}

          {/* Contrato */}
          {coach.contract && (
            <>
              <Divider color="dark" />
              <Group gap="xs">
                <IconFileText size={18} color="#51cf66" />
                <Text size="sm" c="dimmed" style={{ flex: 0, minWidth: '100px' }}>
                  Contrato:
                </Text>
                <Group gap="xs">
                  <Badge color="green" variant="light">
                    Desde {new Date(coach.contract.start).getFullYear()}
                  </Badge>
                  <Text size="sm" c="dimmed">
                    hasta
                  </Text>
                  <Badge color="orange" variant="light">
                    {new Date(coach.contract.until).getFullYear()}
                  </Badge>
                </Group>
              </Group>
            </>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
