/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: path
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

