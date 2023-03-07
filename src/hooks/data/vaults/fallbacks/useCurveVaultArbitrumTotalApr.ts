import axios from "axios"
import { Address, useQuery } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import { CONVEX_SIDECHAINS_URL } from "@/constant/env"

const ARBI_CURVE_ADDRESS: Record<Address, Address> = {
  "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2": "0x960ea3e3C7FB317332d990873d354E18d7645590",
  "0x7f90122BF0700F9E7e1F688fe926940E8839F353": "0x7f90122BF0700F9E7e1F688fe926940E8839F353",
}


export default function useCurveVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const poolCurveAddress = ARBI_CURVE_ADDRESS[asset?? "0x"] ?? "0x"
  const curveApiQuery = useQuery([chainId, asset, "curveApi"], {
    queryFn: () => getCurveArbitrumApi(poolCurveAddress),
    retry: false,
    enabled: enabled,
  })

  return curveApiQuery
}

async function getCurveArbitrumApi(poolCurveAddress: Address) {
  const resp = await axios.get(`${CONVEX_SIDECHAINS_URL}`)
  const apys = resp?.data?.apys
  let totalApr = 0
  Object.entries(apys).forEach(entry => {
    const key = entry[0]
    const value: any = entry[1]
    if(key !== undefined && key.toLocaleLowerCase().includes(poolCurveAddress.toLocaleLowerCase())){
      const baseApy=Number(value?.baseApy)/100
      const crvApy=Number(value?.crvApy)/100
      const cvxApy=Number(value?.cvxApy)/100
      const extraRewards=Number(value?.extraRewards)
      totalApr = baseApy + crvApy + cvxApy + extraRewards
    }
  });
  return totalApr
}
