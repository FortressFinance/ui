import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  renderHook as defaultRenderHook,
  RenderHookOptions,
  waitFor,
} from "@testing-library/react"
import { setupWagmiClient } from "test/utils"
import { Client, WagmiConfig } from "wagmi"

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
    // eslint-disable-next-line no-console
    log: console.log,
    // eslint-disable-next-line no-console
    warn: console.warn,
  },
})

type Props = { client?: Client } & {
  children?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function renderHook<TResult, TProps>(
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

  const utils = defaultRenderHook<TResult, TProps>(hook, options)
  return {
    ...utils,
    waitFor: (utils as { waitFor?: typeof waitFor })?.waitFor ?? waitFor,
  }
}
