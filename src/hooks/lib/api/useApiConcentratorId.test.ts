import { UseQueryResult } from "@tanstack/react-query"
import { renderHook } from "test/renderHook"

import { useApiConcentratorId } from "@/hooks/lib/api/useApiConcentratorId"
import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

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
      targetAssetId: 2,
      address: "0x86eE39B28A7fDea01b53773AEE148884Db311B46",
      type: "fortCrypto1",
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

describe("useApiConcentratorId", () => {
  beforeEach(() => {
    mockedUseApiConcentratorData.mockImplementation(
      () =>
        ({
          data: apiData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as UseQueryResult<Array<any>, unknown>)
    )
  })

  it("should return -1 if no target asset is provided", () => {
    const { result } = renderHook(() => useApiConcentratorId({}))
    expect(result.current.data).toBe(-1)
  })

  it("should return -1 if target asset is not found", () => {
    const { result } = renderHook(() =>
      useApiConcentratorId({ targetAsset: "0x123" })
    )
    expect(result.current.data).toBe(-1)
  })

  it("should return -1 if primary asset is not found", () => {
    const { result } = renderHook(() =>
      useApiConcentratorId({
        targetAsset: "0x86ee39b28a7fdea01b53773aee148884db311b46",
        primaryAsset: "0x123",
      })
    )
    expect(result.current.data).toBe(-1)
  })

  it("should return the concentrator id if target and primary asset are found - return value 0", () => {
    const { result } = renderHook(() =>
      useApiConcentratorId({
        targetAsset: "0x86ee39b28a7fdea01b53773aee148884db311b46",
        primaryAsset: "0xC9B8a3FDECB9D5b218d02555a8Baf332E5B740d5",
      })
    )
    expect(result.current.data).toBe(0)
  })

  it("should return the concentrator id if target and primary asset are found - return value 1", () => {
    const { result } = renderHook(() =>
      useApiConcentratorId({
        targetAsset: "0x86ee39b28a7fdea01b53773aee148884db311b46",
        primaryAsset: "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2",
      })
    )
    expect(result.current.data).toBe(1)
  })
})
