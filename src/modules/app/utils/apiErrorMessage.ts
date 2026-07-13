import axios from 'axios'

type LaravelValidationErrorPayload = {
  message?: string
  errors?: Record<string, string[]>
}

const DEFAULT_ERROR_MESSAGE = 'Request failed. Please try again.'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as LaravelValidationErrorPayload | undefined

    const firstFieldError = data?.errors
      ? Object.values(data.errors).flat().find(Boolean)
      : undefined

    if (firstFieldError) return firstFieldError
    if (data?.message) return data.message
    if (error.message) return error.message
    return DEFAULT_ERROR_MESSAGE
  }

  if (error instanceof Error) {
    return error.message
  }

  return DEFAULT_ERROR_MESSAGE
}

