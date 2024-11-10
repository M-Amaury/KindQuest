/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PRIVATE_KEY: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 