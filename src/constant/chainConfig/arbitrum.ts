import { ChainConfig } from "@/constant/chainConfig/types"

export const arbitrumConfig: ChainConfig = {
  registryAddress: "0x03605C3A3dAf860774448df807742c0d0e49460C",
  fctrTriCryptoFcGlpTokenAddress: "0x4cdEE506E9130f8A8947D80DCe1AbfDf0fa36fb5",
  fcTriCryptoTokenAddress: "0x32ED4f40ce345Eca65F24735Ad9D35c7fF3460E5",
  fcGlpTokenAddress: "0x86eE39B28A7fDea01b53773AEE148884Db311B46",
  fctrFraxBPFcGlpTokenAddress: "0xA7C12b4B98E6A38c51B12668773DAe855DdDecf8",
  fallbackType: {
    "0x86eE39B28A7fDea01b53773AEE148884Db311B46": "token",
    "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5": "curve",
    "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": "curve",
  },
}
