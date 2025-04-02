import type { EtherbaseConfig } from "@msquared/etherbase-client"

const useLocalBackend = false
const localUrl = "http://localhost"

export const etherbaseConfig: EtherbaseConfig = {
  httpReaderUrl: useLocalBackend
    ? `${localUrl}:8082`
    : "https://etherbase-reader-496683047294.europe-west2.run.app",
  wsReaderUrl: useLocalBackend
    ? `${localUrl}:8082`
    : "wss://etherbase-reader-496683047294.europe-west2.run.app",
  wsWriterUrl: useLocalBackend
    ? `${localUrl}:8081`
    : "wss://etherbase-writer-496683047294.europe-west2.run.app",
  // privateKey:
  // "0x0c9a44c9e7778f9f3132ab2ad581b1473f84683e6b42da3938160dc602ee29d0",
  useBackend: true,
  debug: false,
}
