// Mirrors the web app's src/lib/api-client.ts (same snake_case->camelCase
// unwrap, same ApiError shape) so feature `api.ts` files can be ported
// across with minimal changes. Differs only in needing an absolute base URL
// (no window.location origin on-device) and a pluggable token getter.

export const API_BASE = 'https://seashell-mosquito-856465.hostingersite.com/api/v1'

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

let authToken: string | null = null
let onUnauthorized: (() => void) | null = null

export function configureApiClient(options: { onUnauthorized: () => void }) {
  onUnauthorized = options.onUnauthorized
}

export function setApiToken(token: string | null) {
  authToken = token
}

export function getApiToken(): string | null {
  return authToken
}

function toCamel(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

function camelizeDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelizeDeep)

  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[toCamel(key)] = camelizeDeep(val)
    }
    if (typeof out.code === 'string' && out.code) {
      out.dbId = out.id
      out.id = out.code
    }
    return out
  }

  return value
}

export interface PageMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface Page<T> {
  data: T[]
  meta: PageMeta
}

function isPaginatedPayload(json: unknown): json is Record<string, unknown> & { data: unknown[]; current_page: number } {
  return (
    !!json &&
    typeof json === 'object' &&
    Array.isArray((json as Record<string, unknown>).data) &&
    'current_page' in (json as Record<string, unknown>)
  )
}

function unwrap(json: unknown): unknown {
  if (isPaginatedPayload(json)) {
    return {
      data: (json.data as unknown[]).map(camelizeDeep),
      meta: {
        currentPage: json.current_page,
        lastPage: json.last_page,
        perPage: json.per_page,
        total: json.total,
      },
    }
  }

  if (json && typeof json === 'object' && Object.keys(json).length === 1 && 'data' in json) {
    return camelizeDeep((json as Record<string, unknown>).data)
  }

  return camelizeDeep(json)
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params } = options

  const url = new URL(API_BASE + path)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401) {
    onUnauthorized?.()
  }

  if (response.status === 204) {
    return undefined as T
  }

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const message = (json as { message?: string } | null)?.message ?? `Request failed (${response.status})`
    throw new ApiError(message, response.status, (json as { errors?: Record<string, string[]> } | null)?.errors)
  }

  return unwrap(json) as T
}

export const api = {
  get: <T>(path: string, params?: RequestOptions['params']) => request<T>(path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  async getBlob(path: string): Promise<Blob> {
    const response = await fetch(new URL(API_BASE + path).toString(), {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
    if (response.status === 401) onUnauthorized?.()
    if (!response.ok) throw new ApiError(`Request failed (${response.status})`, response.status)
    return response.blob()
  },
}
