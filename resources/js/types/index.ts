export interface CatalogItem {
  id: number
  nombre: string
}

export interface User {
  id: number
  nombres: string
  apellido_paterno: string
  apellido_materno: string | null
  name: string
  email: string
  email_verified_at: string | null
  foto_perfil_url: string | null
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export type PageProps<T = Record<string, unknown>> = {
  auth: {
    user: User
  }
  permisos: string[]
  flash: {
    success: string | null
    error: string | null
  }
} & T
