export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  const body = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? 'Ocurrió un error inesperado')
  }

  return body as T
}

export function apiGet<T>(path: string) {
  return apiFetch<T>(path)
}

export function apiPost<T>(path: string, data?: unknown) {
  return apiFetch<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined })
}

export function apiPatch<T>(path: string, data: unknown) {
  return apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(data) })
}

export function apiDelete(path: string) {
  return apiFetch<void>(path, { method: 'DELETE' })
}
