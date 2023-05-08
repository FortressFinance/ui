import { UseQueryResult } from "@tanstack/react-query"
import { renderHook } from "test/renderHook"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"
import { useApiConcentratorTargetAssetId } from "@/hooks/lib/api/useApiConcentratorTargetAssetId"

jest.mock("@/hooks/lib/api/useApiConcentratorStaticData")

const apiData = [
  {
    name: "Fortress Curve FraxBP Concentrating into fcGLP",
    target_asset: {
      targetAssetId: 2,
      address: "0x86eE39B28A7fDea01b53773AEE148884Db311B46",
      type: "fortCrypto1",
    },
    concentrator: {
      ybToken: {
        concentratorId: 0,
        address: "0xA7C12b4B98E6A38c51B12668773DAe855DdDecf8",
        symbol: "fctrFraxBP-fcGLP",
      },
      primaryAsset: {
        address: "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5",
        isLpToken: true,
      },
      undelyingAssets: [
        {
          address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
          isLpToken: false,
        },
        {
          address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
          isLpToken: false,
        },
      ],
      platformFee: "0.05",
      harvestBounty: "0.025",
      withdrawalFee: "0.002",
    },
  },
  {
    name: "Fortress Curve TriCrypto Concentrating to fcGLP",
    target_asset: {
      targetAssetId: 3,
      address: "0x86eE39B28A7fDea01b53773AEE148884Db311B49",
      type: "fortCrypto2",
    },
    concentrator: {
      ybToken: {
        concentratorId: 1,
        address: "0x4cdEE506E9130f8A8947D80DCe1AbfDf0fa36fb5",
        symbol: "fctrTriCrypto-fcGLP",
      },
      primaryAsset: {
        address: "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2",
        isLpToken: true,
      },
      undelyingAssets: [
        {
          address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
          isLpToken: false,
        },
        {
          address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
          isLpToken: false,
        },
        {
          address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
          isLpToken: false,
        },
        {
          address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          isLpToken: false,
        },
      ],
      platformFee: "0.05",
      harvestBounty: "0.025",
      withdrawalFee: "0.002",
    },
  },
]

const mockedUseApiConcentratorData =
  useApiConcentratorStaticData as jest.MockedFunction<
    typeof useApiConcentratorStaticData
  >

describe("useApiConcentratorTargetAssetId", () => {
  beforeEach(() => {
    mockedUseApiConcentratorData.mockImplementation(
      () =>
        ({
          data: apiData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as UseQueryResult<Array<any>, unknown>)
    )
  })

  it("should return the target asset id if found - returns 2", async () => {
    const targetAsset = "0x86eE39B28A7fDea01b53773AEE148884Db311B46"
    const { result } = renderHook(() =>
      useApiConcentratorTargetAssetId({ targetAsset })
    )
    expect(result.current.data).toBe(2)
  })

  it("should return the target asset id if found - returns 3", async () => {
    const targetAsset = "0x86eE39B28A7fDea01b53773AEE148884Db311B49"
    const { result } = renderHook(() =>
      useApiConcentratorTargetAssetId({ targetAsset })
    )
    expect(result.current.data).toBe(3)
  })

  it("should return -1 if target asset not found", async () => {
    const targetAsset = "0x456"
    const { result } = renderHook(() =>
      useApiConcentratorTargetAssetId({ targetAsset })
    )
    expect(result.current.data).toBe(-1)
  })
})