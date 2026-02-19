/**
 * @module components/common
 */

import { Stack, Text, Loader, Center, Paper, Button, rem } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

/**
 * Props del componente LoadingState
 */
export interface LoadingStateProps {
  /** Mensaje de carga (opcional) */
  message?: string;
}

/**
 * Componente LoadingState
 * 
 * Muestra un indicador de carga con un mensaje opcional.
 * Indica al usuario que se está realizando una operación asíncrona.
 * 
 * @param props - Props del componente
 * @returns Elemento JSX del estado de carga
 */
export function LoadingState({ message = 'Cargando partidos...' }: LoadingStateProps) {
  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        borderColor: '#373A40',
        minHeight: rem(400),
      }}
      withBorder
    >
      <Center h="100%" style={{ minHeight: rem(300) }}>
        <Stack align="center" gap="lg">
          <Loader size="lg" color="green" />
          <Text size="lg" c="dimmed">
            {message}
          </Text>
        </Stack>
      </Center>
    </Paper>
  );
}

/**
 * Props del componente ErrorState
 */
export interface ErrorStateProps {
  /** Mensaje de error */
  message: string;
  /** Handler para reintentar (opcional) */
  onRetry?: () => void;
  /** Texto del botón de reintentar (opcional) */
  retryText?: string;
}

/**
 * Componente ErrorState
 * 
 * Muestra un mensaje de error con opción para reintentar la operación.
 * Implementa manejo de errores de forma visual y amigable.
 * 
 * @param props - Props del componente
 * @returns Elemento JSX del estado de error
 * 
 * @example
 * ```tsx
 * <ErrorState 
 *   message="No se pudieron cargar los partidos" 
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export function ErrorState({ message, onRetry, retryText = 'Reintentar' }: ErrorStateProps) {
  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        backgroundColor: '#25262b',
        borderColor: '#373A40',
        minHeight: rem(400),
      }}
      withBorder
    >
      <Center h="100%" style={{ minHeight: rem(300) }}>
        <Stack align="center" gap="lg">
          <IconAlertCircle size={48} color="#fa5252" />
          <Stack align="center" gap="xs">
            <Text size="lg" fw={600} c="red">
              Error al cargar los datos
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={400}>
              {message}
            </Text>
          </Stack>
          {onRetry && (
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={onRetry}
              variant="light"
              color="red"
            >
              {retryText}
            </Button>
          )}
        </Stack>
      </Center>
    </Paper>
  );
}
