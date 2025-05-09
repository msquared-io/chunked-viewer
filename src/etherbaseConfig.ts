import type { EtherbaseConfig } from "@msquared/etherbase-client"

const useLocalBackend = false
const localUrl = "http://localhost"

export const etherbaseConfig: EtherbaseConfig = {
  httpReaderUrl: useLocalBackend
    ? `${localUrl}:8082`
    : "https://spaceconfig.com",
  wsReaderUrl: useLocalBackend ? `${localUrl}:8082` : "wss://spaceconfig.com",
  wsWriterUrl: useLocalBackend ? `${localUrl}:8081` : "wss://spaceconfig.com",
  // privateKey:
  // "0x0c9a44c9e7778f9f3132ab2ad581b1473f84683e6b42da3938160dc602ee29d0",
  useBackend: true,
  debug: false,
  // optimized: {
  //   enabled: true,
  //   streamingCompression: false,
  // },
}

export const userStatsContract1 = "0x33369304d80935d3cCdA0b00DE544526688c9Daf"
export const inventoryContract = "0x42ee6f3Ef643524d3184BB6BF68763C8F966E84F"
export const userStatsContract2 = "0xa22C39134a8Fa95fF40e8270f45Fc7cF5daA4254"
