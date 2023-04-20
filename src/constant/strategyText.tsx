import {
  crvTriCryptoTokenAddress,
  crvTwoCryptoTokenAddress,
  fraxBpTokenAddress,
  glpTokenAddress,
} from "@/constant/addresses"

const strategyText = {
  [`compounder_${glpTokenAddress}`]: (
    <>
      <p>
        This vault accepts deposits in form of its primary asset sGLP and any of
        its underlying assets mentioned below, all of which will be converted to
        staked sGLP automatically.
      </p>
      <p>
        Deposited assets are used to provide liquidity for GMX traders, earning
        trading fees plus GMX emissions on its staked sGLP.
      </p>
      <p>
        The vault auto-compounds the accumulated rewards periodically into more
        staked sGLP.
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
  [`compounder_${crvTriCryptoTokenAddress}`]: (
    <>
      <p>
        This vault accepts deposits in form of its primary asset crv3Crypto and
        any of its underlying assets mentioned below, all of which will be
        converted to Curve LP tokens automatically.
      </p>
      <p>
        Deposited assets are used to provide liquidity for Curve Finance,
        earning swap fees plus CRV emissions for extra yield.
      </p>
      <p>
        The vault auto-compounds the accumulated rewards periodically into more
        LP tokens.
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
  [`compounder_${crvTwoCryptoTokenAddress}`]: (
    <>
      <p>
        This vault accepts deposits in form of its primary asset 2CRV and any of
        its underlying assets mentioned below, all of which will be converted to
        Curve LP tokens automatically.
      </p>
      <p>
        Deposited assets are used to provide liquidity for Curve Finance,
        earning swap fees plus CRV emissions for extra yield.
      </p>
      <p>
        The vault auto-compounds the accumulated rewards periodically into more
        LP tokens.
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
        The 2Pool vault contains the following underlying assets: USDC and USDT.
      </p>
    </>
  ),
  [`compounder_${fraxBpTokenAddress}`]: (
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
        The vault auto-compounds the accumulated rewards periodically into more
        LP tokens.
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
  [`concentrator_${crvTriCryptoTokenAddress}`]: (
    <>
      <p>
        This vault accepts deposits in the form of crv3Crypto, which serves as
        its principal asset, as well as any of the underlying assets listed
        below, all of which will be instantly converted to Fortress Compounding
        LP tokens.
      </p>
      <p>
        This auto-concentrators vault swaps its reward tokens into fcGLP, which
        are then invested in vaults with differing risk profiles from the
        originating vault, and claims its strategy rewards on a periodic basis.
      </p>
      <p>
        Investors receive their proportionate share of the concentrator money in
        the form of ERC20 tokens called fctrTriCrypto-fcGLP, which stands for
        vault shares.
      </p>
      <p>
        The fctrTriCrypto-fcGLP can be used by investors in other Fortress
        products or integrated protocols.
      </p>
      <p>
        The following underlying assets are present in the Curve.fi USD-BTC-ETH
        vault: crv3Crypto, USDT, WBTC, WETH, and ETH.
      </p>
    </>
  ),
}

export default strategyText
