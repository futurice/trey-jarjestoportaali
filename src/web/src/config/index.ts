/// <reference types="vite/client" />

export interface ApiConfig {
  baseUrl: string
}

export interface ObservabilityConfig {
  connectionString: string
}

export interface SupabaseConfig {
  url: string
  key: string
}

export interface SentryConfig {
  dsn: string
}

export interface AppConfig {
  api: ApiConfig
  observability: ObservabilityConfig
  supabase: SupabaseConfig
  sentry: SentryConfig
}

const config: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3100",
  },
  observability: {
    connectionString: import.meta.env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING || "",
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    key: import.meta.env.VITE_SUPABASE_KEY || "",
  },
  sentry: {
    dsn: import.meta.env.VITE_SENTRY_DSN || "",
  },
}

export default config
