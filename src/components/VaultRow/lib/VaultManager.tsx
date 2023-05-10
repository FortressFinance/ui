import { FC } from "react"
import { TiSocialTwitter } from "react-icons/ti"

import { shortenAddress } from "@/lib/helpers"

export const VaultManager: FC = () => {
  return (
    <div className="lg:grid-row-2 lg:grid">
      <div className="max-lg:hidden">
        {shortenAddress("0x8a31792e120C521003768A70e2Ef8725CF9a2B07")}
      </div>
      <div className="lg:hidden">
        {shortenAddress("0x8a31792e120C521003768A70e2Ef8725CF9a2B07", 2)}
      </div>
      <div className="flex justify-center max-lg:hidden">
        <TiSocialTwitter className="h-5 w-5 cursor-pointer" />
      </div>
    </div>
  )
}
