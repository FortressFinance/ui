import { arbitrumConfig } from "@/constant/chainConfig/arbitrum"
import { ChainConfig } from "@/constant/chainConfig/types"

export const arbitrumForkConfig: ChainConfig = {
  ...arbitrumConfig,
  registryAddress: "0x31A65C6d4EB07ad51E7afc890aC3b7bE84dF2Ead",
  lendingPairs: [],
  fctrTriCryptoFcGlpTokenAddress: "0xeFeF25D7AD0689c29c400eD6eC29c57Cb86cB058",
  fcTriCryptoTokenAddress: "0xE0eEbD35B952c9C73a187edA3D669d9BcFD79006",
  fcGlpTokenAddress: "0xBDF9001c5d3fFc03AB6564CA28E530665594dfF7",
  fctrFraxBPFcGlpTokenAddress: "0xA7C12b4B98E6A38c51B12668773DAe855DdDecf8",
}
