import type { EtherbaseConfig } from "@msquared/etherbase-client"

const useLocalBackend = true
const localUrl = "http://localhost"

export const etherbaseConfig: EtherbaseConfig = {
  httpReaderUrl: useLocalBackend
    ? `${localUrl}:8082`
    : "https://spaceconfig.com",
  wsReaderUrl: useLocalBackend
    ? `${localUrl}:8082`
    : "wss://spaceconfig.com",
  wsWriterUrl: useLocalBackend
    ? `${localUrl}:8081`
    : "wss://spaceconfig.com",
  // privateKey:
  // "0x0c9a44c9e7778f9f3132ab2ad581b1473f84683e6b42da3938160dc602ee29d0",
  useBackend: true,
  debug: true,
  // optimized: {
  //   enabled: true,
  //   streamingCompression: false,
  // },
}