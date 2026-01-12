/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_IS_DEMO: string;
  readonly VITE_INBOUND_EMAIL: string;
  readonly VITE_JITSU_HOST?: string;
  readonly VITE_JITSU_WRITE_KEY?: string;
  readonly VITE_CLICKHOUSE_HOST?: string;
  readonly VITE_CLICKHOUSE_USER?: string;
  readonly VITE_CLICKHOUSE_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
