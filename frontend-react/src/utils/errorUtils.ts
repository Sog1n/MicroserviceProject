import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    return {
      message:
        (data?.message as string) ||
        (data?.error as string) ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
      details: data,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: String(error) };
}
