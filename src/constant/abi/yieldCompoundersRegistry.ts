export const yieldCompoundersRegistry = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAMMType",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTargetAsset",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_compounder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "RegisterAMMCompounder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_concentrator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "RegisterAMMConcentrator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_compounder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "RegisterTokenCompounder",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_fortETH",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_fortUSD",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_fortCrypto1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_fortCrypto2",
        type: "address",
      },
    ],
    name: "UpdateConcentratorsTargetAssets",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "UpdateOwner",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balancerCompounders",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balancerCompoundersPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balancerCrypto1Concentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balancerCrypto1ConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balancerCrypto2Concentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balancerCrypto2ConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balancerEthConcentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balancerEthConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balancerUsdConcentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "balancerUsdConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "concentratorTargetAssets",
    outputs: [
      {
        internalType: "address",
        name: "fortETH",
        type: "address",
      },
      {
        internalType: "address",
        name: "fortUSD",
        type: "address",
      },
      {
        internalType: "address",
        name: "fortCrypto1",
        type: "address",
      },
      {
        internalType: "address",
        name: "fortCrypto2",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "curveCompounders",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "curveCompoundersPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "curveCrypto1Concentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "curveCrypto1ConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "curveCrypto2Concentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "curveCrypto2ConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "curveEthConcentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "curveEthConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "curveUsdConcentrators",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "curveUsdConcentratorsPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getAmmCompounderDescription",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getAmmCompounderName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getAmmCompounderSymbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getAmmCompounderUnderlyingAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getAmmCompounderVault",
    outputs: [
      {
        internalType: "address",
        name: "_compounderVault",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
    ],
    name: "getAmmCompoundersPrimaryAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "_primaryAssets",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "getConcentrator",
    outputs: [
      {
        internalType: "address",
        name: "_concentrator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getConcentratorDescription",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getConcentratorName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
    ],
    name: "getConcentratorPrimaryAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "_primaryAssets",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getConcentratorSymbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getConcentratorTargetVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getConcentratorUnderlyingAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getTokenCompounderDescription",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getTokenCompounderName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getTokenCompounderSymbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getTokenCompounderUnderlyingAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getTokenCompounderVault",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenCompoundersPrimaryAssets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "owners",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_compounder",
        type: "address",
      },
      {
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "registerAmmCompounder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isCurve",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_concentrator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_targetAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "registerAmmConcentrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_compounder",
        type: "address",
      },
      {
        internalType: "address",
        name: "_primaryAsset",
        type: "address",
      },
    ],
    name: "registerTokenCompounder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenCompounders",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenCompoundersPrimaryAssets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_fortETH",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fortUSD",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fortCrypto1",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fortCrypto2",
        type: "address",
      },
    ],
    name: "updateConcentratorsTargetAssets",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "updateOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
