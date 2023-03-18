import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, RenderHookOptions, waitFor } from "@testing-library/react"
import { Client, createClient, CreateClientConfig, WagmiConfig } from "wagmi"
import { MockConnector } from "wagmi/connectors/mock"

import { getProvider, getSigners, setupWagmiClient } from "test/utils"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
})

type Props = { client?: Client } & {
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode
}

export function wrapper({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client = setupWagmiClient({ queryClient: queryClient as any }),
  ...rest
}: Props = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client} {...rest} />
    </QueryClientProvider>
  )
}

export function renderWagmiHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  {
    wrapper: wrapper_,
    ...options_
  }: RenderHookOptions<TProps & { client?: Client }> | undefined = {}
) {
  const options: RenderHookOptions<TProps & { client?: Client }> = {
    ...(wrapper_
      ? { wrapper: wrapper_ }
      : {
          wrapper: (props) => wrapper({ ...props, ...options_?.initialProps }),
        }),
    ...options_,
  }

  queryClient.clear()

  const utils = renderHook<TResult, TProps>(hook, options)
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor })?.waitFor ?? waitFor,
  }
}
