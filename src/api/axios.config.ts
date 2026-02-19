/**
 * @module api/axios
 * Cliente HTTP configurado con interceptors para autenticación,
 * manejo de errores y logging. Implementa control de errores HTTP (4xx, 5xx)
 * y gestión de ausencia de conexión.
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from '../types/football.types';

/**
 * URL base de la API de Football-Data
 * En desarrollo usa el proxy de Vite (/api) para evitar CORS
 * En producción usa la URL real de la API
 */
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v4' 
  : (import.meta.env.VITE_FOOTBALL_API_BASE_URL || 'https://api.football-data.org/v4');

/**
 * API Key para autenticación
 * En desarrollo el proxy añade el header, pero lo mantenemos para producción
 */
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;

/**
 * Instancia configurada de Axios para la API de Football-Data
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de request que añade el API key a los headers
 * @param config - Configuración de la petición
 * @returns Configuración modificada con el header de autenticación
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // En producción, añadir API Key a los headers
    // En desarrollo, el proxy de Vite se encarga de añadirlo
    if (!import.meta.env.DEV && API_KEY) {
      config.headers['X-Auth-Token'] = API_KEY;
    }

    // Log de la petición en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de response que maneja errores HTTP de forma centralizada
 * @param response - Respuesta HTTP exitosa
 * @returns La respuesta sin modificar
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de la respuesta en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Manejo de errores HTTP

    // Error de red (sin conexión)
    if (!error.response) {
      // Mostrar detalles del error de red para facilitar el diagnóstico
      console.error('[Network Error] No hay respuesta del servidor', {
        message: error.message,
        code: (error as any).code,
        url: error.config?.url,
      });

      return Promise.reject({
        message: `No se puede conectar al servidor. ${error.message}`,
        type: 'NETWORK_ERROR',
        originalError: error,
      });
    }

    const { status, data } = error.response;

    // Errores 4xx - Errores del cliente
    if (status >= 400 && status < 500) {
      let errorMessage = 'Error en la petición';

      switch (status) {
        case 400:
          errorMessage = 'Petición incorrecta. Los parámetros no son válidos.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. Verifica tu API Key o el plan de suscripción.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 429:
          errorMessage = 'Límite de peticiones excedido. Intenta de nuevo más tarde.';
          break;
      }

      console.error(`[API Error ${status}]`, errorMessage, data);

      return Promise.reject({
        message: data?.error || errorMessage,
        status,
        type: 'CLIENT_ERROR',
        originalError: error,
      });
    }

    // Errores 5xx - Errores del servidor
    if (status >= 500) {
      console.error(`[Server Error ${status}]`, 'Error en el servidor de Football-Data');

      return Promise.reject({
        message: 'Error en el servidor. Intenta de nuevo más tarde.',
        status,
        type: 'SERVER_ERROR',
        originalError: error,
      });
    }

    // Cualquier otro error
    console.error('[API Error]', error);
    return Promise.reject({
      message: 'Ha ocurrido un error inesperado',
      type: 'UNKNOWN_ERROR',
      originalError: error,
    });
  }
);

/**
 * Cliente HTTP configurado para la API de Football-Data
 */
export default axiosInstance;

/**
 * Tipo de error personalizado devuelto por los interceptors
 */
export interface CustomApiError {
  message: string;
  status?: number;
  type: 'NETWORK_ERROR' | 'CLIENT_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';
  originalError: AxiosError;
}
