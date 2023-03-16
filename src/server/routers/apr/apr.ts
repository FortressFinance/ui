import { ethers } from "ethers"
import { z } from "zod"

import { fortressApi } from "@/lib/api/util"

import { procedure, router } from "@/server/trpc"

const vaultAprSchema = z.object({
  data: z.object({
    APR: z
      .object({
        baseApr: z.number(),
        crvApr: z.number(),
        cvxApr: z.number(),
        extraRewardsApr: z.number(),
        BALApr: z.number(),
        AuraApr: z.number(),
        GMXApr: z.number(),
        ETHApr: z.number(),
        totalApr: z.number(),
      })
      .partial(),
    APY: z.number(),
  }),
})

export const aprRouter = router({
  vaultApr: procedure
    .input(
      z.object({
        id: z.number(),
        chainId: z.number(),
        asset: z.string().refine((str) => ethers.utils.isAddress(str)),
        vaultAddress: z.string().refine((str) => ethers.utils.isAddress(str)),
        type: z.enum(["balancer", "curve", "token"]),
      })
    )
    .query(async ({ input }) => {
      try {
        const resp = await fortressApi.post(
          input.type === "token"
            ? "Token_Compounder/getVaultDynamicData"
            : "AMM_Compounder/getPoolDynamicData",
          {
            chainId: input.chainId,
            id: input.id,
            ...(input.type === "curve"
              ? { isCurve: true }
              : input.type === "balancer"
              ? { isCurve: false }
              : {}),
          }
        )
        const parsed = vaultAprSchema.parse(resp.data)
        return {
          apr: parsed.data.APR,
          apy: parsed.data.APY,
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        // TODO: Fallbacks
        return { apr: {}, apy: 0 }
      }
    }),
})
