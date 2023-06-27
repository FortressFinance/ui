import Link from "next/link"

import { VaultProductType } from "@/lib/types"

import {
  crvTriCryptoTokenAddress,
  crvTwoCryptoTokenAddress,
  fraxBpTokenAddress,
  sGlpTokenAddress,
} from "@/constant/addresses"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const strategyText: { [key in VaultProductType]: any } = {
  compounder: {
    [sGlpTokenAddress]: (
      <>
        <p>
          This vault accepts deposits in form of its primary asset sGLP and any
          of its underlying assets mentioned below, all of which will be
          converted to staked sGLP automatically.
        </p>
        <p>
          Deposited assets are used to provide liquidity for GMX traders,
          earning trading fees plus GMX emissions on its staked sGLP.
        </p>
        <p>
          The vault auto-compounds the accumulated rewards periodically into
          more staked sGLP.
        </p>
        <p>
          Investors receive vault shares as ERC20 tokens called fcGLP,
          representing their pro-rata share of the compounding funds.
        </p>
        <p>
          Investors can use fcGLP in other Fortress products or integrated
          protocols.
        </p>
        <p>
          The staked sGLP contains the following basket of assets: WETH, ETH,
          FRAX, USDC and USDT.
        </p>
      </>
    ),
    [crvTriCryptoTokenAddress]: (
      <>
        <p>
          This vault accepts deposits in form of its primary asset crv3Crypto
          and any of its underlying assets mentioned below, all of which will be
          converted to Curve LP tokens automatically.
        </p>
        <p>
          Deposited assets are used to provide liquidity for Curve Finance,
          earning swap fees plus CRV emissions for extra yield.
        </p>
        <p>
          The vault auto-compounds the accumulated rewards periodically into
          more LP tokens.
        </p>
        <p>
          Investors receive vault shares as ERC20 tokens called fcTriCrypto,
          representing their pro-rata share of the compounding funds.
        </p>
        <p>
          Investors can use fcTriCrypto in other Fortress products or integrated
          protocols.
        </p>
        <p>
          The TriCrypto vault contains the following underlying assets: WBTC,
          WETH, ETH, and USDT.
        </p>
      </>
    ),
    [crvTwoCryptoTokenAddress]: (
      <>
        <p>
          This vault accepts deposits in form of its primary asset 2CRV and any
          of its underlying assets mentioned below, all of which will be
          converted to Curve LP tokens automatically.
        </p>
        <p>
          Deposited assets are used to provide liquidity for Curve Finance,
          earning swap fees plus CRV emissions for extra yield.
        </p>
        <p>
          The vault auto-compounds the accumulated rewards periodically into
          more LP tokens.
        </p>
        <p>
          Investors receive vault shares as ERC20 tokens called fc2Pool,
          representing their pro-rata share of the compounding funds.
        </p>
        <p>
          Investors can use fc2Pool in other Fortress products or integrated
          protocols.
        </p>
        <p>
          The 2Pool vault contains the following underlying assets: USDC and
          USDT.
        </p>
      </>
    ),
    [fraxBpTokenAddress]: (
      <>
        <p>
          This vault accepts deposits in form of its primary asset FRAXBP-f and
          any of its underlying assets mentioned below, all of which will be
          converted to Curve LP tokens automatically.
        </p>
        <p>
          Deposited assets are used to provide liquidity for Curve Finance,
          earning swap fees plus CRV emissions for extra yield.
        </p>
        <p>
          The vault auto-compounds the accumulated rewards periodically into
          more LP tokens.
        </p>
        <p>
          Investors receive vault shares as ERC20 tokens called fcFraxBP,
          representing their pro-rata share of the compounding funds.
        </p>
        <p>
          Investors can use fcFraxBP in other Fortress products or integrated
          protocols.
        </p>
        <p>
          The FraxBP vault contains the following underlying assets: USDC and
          FRAX.
        </p>
      </>
    ),
  },
  concentrator: {
    [crvTriCryptoTokenAddress]: (
      <>
        <p>
          This vault accepts deposits in form of its primary asset crv3Crypto
          and any of its underlying assets mentioned below, all of which will be
          converted to Fortress Compounding LP tokens automatically.
        </p>
        <p>
          Deposited assets are used to provide liquidity for Curve Finance,
          earning swap fees plus CRV emissions for extra yield.
        </p>
        <p>
          The vault auto-concentrates the accumulated rewards periodically into{" "}
          <Link
            href="https://docs.fortress.finance/resources/smart-contracts/glp-compounder"
            className="flex items-center gap-3 underline underline-offset-4"
            target="_blank"
          >
            the GLP Compounder.
          </Link>
        </p>
        <p>
          Investors receive vault shares as ERC20 tokens called
          fctrTriCrypto-fcGLP, representing their pro-rata share of the
          concentrated funds.
        </p>
        <p>
          Investors can use fctrTriCrypto-fcGLP in other Fortress products or
          integrated protocols.
        </p>
        <p>
          The TriCrypto vault contains the following underlying assets: WBTC,
          WETH, ETH, and USDT.
        </p>
      </>
    ),
    [fraxBpTokenAddress]: (
      <>
        <p>
          This vault accepts deposits in form of its primary asset FRAXBP-f and
          any of its underlying assets mentioned below, all of which will be
          converted to Fortress Compounding LP tokens automatically.
        </p>
        <p>
          Deposited assets are used to provide liquidity for Curve Finance,
          earning swap fees plus CRV emissions for extra yield.
        </p>
        <p>
          The vault auto-concentrates the accumulated rewards periodically into{" "}
          <Link
            href="https://docs.fortress.finance/resources/smart-contracts/glp-compounder"
            className="flex items-center gap-3 underline underline-offset-4"
            target="_blank"
          >
            the GLP Compounder.
          </Link>
        </p>
        <p>
          Investors receive vault shares as ERC20 tokens called
          fctrFraxBP-fcGLP, representing their pro-rata share of the
          concentrated funds.
        </p>
        <p>
          Investors can use fctrFraxBP-fcGLP in other Fortress products or
          integrated protocols.
        </p>
        <p>
          The FraxBP vault contains the following underlying assets: USDC and
          FRAX.
        </p>
      </>
    ),
  },
  managedVaults: {},
}

export default strategyText
