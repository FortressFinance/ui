import axios from "axios"
import { Address } from "wagmi"

import { getCurvePrice } from "./getCurvePrice"

jest.mock("axios")

describe("getCurvePrice", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should fetch pool data and calculate LP token price correctly", async () => {
    const asset: Address = "0x8e0B8c8BB9db49a46697F3a5Bb8A308e744821D2"
    const chainId = 1
    const mockedRespData = {
      data: {
        poolData: [
          {
            id: "2",
            address: "0x960ea3e3C7FB317332d990873d354E18d7645590",
            name: "Curve.fi USD-BTC-ETH",
            lpTokenAddress: asset,
            virtualPrice: "1034821788607005647",
            totalSupply: "41427535640294390159786",
            symbol: "crv3crypto",
            coins: [
              {
                address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
                decimals: 6,
                symbol: "USDT",
                usdPrice: 1.001,
                poolBalance: "16445610183127",
              },
              {
                address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
                decimals: "8",
                symbol: "WBTC",
                usdPrice: 29381,
                poolBalance: "55503608132",
              },
              {
                address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
                decimals: "18",
                symbol: "WETH",
                usdPrice: 1897.12,
                poolBalance: "8631301923515208018602",
              },
            ],
          },
        ],
      },
    }
    const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>
    mockAxiosGet.mockResolvedValueOnce({ data: mockedRespData })
    const lpTokenPrice = await getCurvePrice({ asset, chainId })
    expect(mockAxiosGet).toHaveBeenCalledTimes(1)
    expect(mockAxiosGet).toHaveBeenCalledWith(
      "https://api.curve.fi/api/getPools/ethereum/main"
    )
    expect(lpTokenPrice).toEqual(1186.2686409932685)
  })

  it("should throw an error if the chain is not supported", async () => {
    const asset: Address = "0x123"
    const chainId = 123
    await expect(getCurvePrice({ asset, chainId })).rejects.toThrow(
      "Unsupported chain"
    )
  })
})
