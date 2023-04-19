import { useRouter } from "next/router"
import { FC, PropsWithChildren, useEffect } from "react"

import { resolvedRoute } from "@/lib/helpers"
import { useClientReady } from "@/hooks"

type DisabledPageProps = {
  isDisabled: boolean
}

export const DisabledPage: FC<PropsWithChildren<DisabledPageProps>> = ({
  children,
  isDisabled,
}) => {
  const isClientReady = useClientReady()
  const router = useRouter()
  useEffect(() => {
    if (isClientReady && isDisabled) {
      const link = resolvedRoute("/app/yield")
      router.replace(link.href, link.as)
    }
  }, [isClientReady, isDisabled, router])
  return isDisabled ? null : <>{children}</>
}
