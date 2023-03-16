import { aprRouter } from "@/server/routers/apr/apr"
import { mergeRouters } from "@/server/trpc"

export const appRouter = mergeRouters(aprRouter)

export type AppRouter = typeof appRouter
