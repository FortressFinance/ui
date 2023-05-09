import { useEffect, useState } from "react"
import { Address, useProvider, useWaitForTransaction } from "wagmi"

export function useExtractSolidityError() {
  const [hash, setHash] = useState<Address>()

  const provider = useProvider()

  const { data: waitTxData } = useWaitForTransaction({
    hash,
  })

  useEffect(() => {
    if (!waitTxData?.transactionHash) return

    provider.getTransaction(waitTxData?.transactionHash).then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
      provider
        .call(
          {
            from: response.from,
            to: response.to,
            data: response.data,
          },
          response.blockNumber
        )
        .then((callResult) => {
          const lastArg = callResult.substring(
            callResult.length - 64,
            callResult.length - 1
          )
          let reason = ""
          for (let n = 0; n < lastArg.length; n += 2) {
            reason += String.fromCharCode(
              parseInt(lastArg.substring(n, n + 2), 16)
            )
          }
          // Gotcha!
          // eslint-disable-next-line no-console
          console.log("Revert Reason:", reason)
        })
    })
  }, [provider, waitTxData])

  return setHash
}
