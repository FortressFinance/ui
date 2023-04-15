export const FortressLendingPair = [
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "_configData",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_swap",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_maxLTV",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_liquidationFee",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_borrowwer",
        type: "address",
      },
    ],
    name: "AlreadyCalledOnBlock",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_exchangeRate",
        type: "uint256",
      },
    ],
    name: "BorrowerSolvent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
    ],
    name: "Insolvent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_availableAmount",
        type: "uint256",
      },
    ],
    name: "InsufficientAssetsInContract",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidProtocolFee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidUnderlyingAsset",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
    ],
    name: "OracleLTEZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_blockTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
    ],
    name: "PastDeadline",
    type: "error",
  },
  {
    inputs: [],
    name: "Paused",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "PriceTooLarge",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minAmount",
        type: "uint256",
      },
    ],
    name: "SlippageTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
    ],
    name: "AddCollateral",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_interestEarned",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_deltaTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_feesAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_feesShare",
        type: "uint256",
      },
    ],
    name: "AddInterest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_borrowAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_sharesAdded",
        type: "uint256",
      },
    ],
    name: "BorrowAsset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_borrowAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_borrowShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_initialCollateralAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountCollateralOut",
        type: "uint256",
      },
    ],
    name: "LeveragedPosition",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_collateralForLiquidator",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_sharesToLiquidate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountLiquidatorToRepay",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_sharesToAdjust",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountToAdjust",
        type: "uint256",
      },
    ],
    name: "Liquidate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
    ],
    name: "RemoveCollateral",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_payer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountToRepay",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    name: "RepayAsset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_collateralToSwap",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountAssetOut",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_sharesRepaid",
        type: "uint256",
      },
    ],
    name: "RepayAssetWithCollateral",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_rate",
        type: "uint256",
      },
    ],
    name: "UpdateExchangeRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "_newFee",
        type: "uint64",
      },
    ],
    name: "UpdateFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "UpdateOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "_depositLiquidity",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_withdrawLiquidity",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_addLeverage",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_removeLeverage",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_addInterest",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_liquidations",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_addCollateral",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_removeCollateral",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_repayAsset",
        type: "bool",
      },
    ],
    name: "UpdatePauseSettings",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_ratePerSec",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_deltaTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_utilizationRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newRatePerSec",
        type: "uint256",
      },
    ],
    name: "UpdateRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_swap",
        type: "address",
      },
    ],
    name: "UpdateSwap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountToTransfer",
        type: "uint256",
      },
    ],
    name: "WithdrawFees",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
    ],
    name: "addCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "addInterest",
    outputs: [
      {
        internalType: "uint256",
        name: "_interestEarned",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_feesAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_feesShare",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_newRate",
        type: "uint64",
      },
    ],
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
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "asset",
    outputs: [
      {
        internalType: "contract ERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assetContract",
    outputs: [
      {
        internalType: "contract IERC20",
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
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cleanLiquidationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralContract",
    outputs: [
      {
        internalType: "contract IERC20",
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
        name: "shares",
        type: "uint256",
      },
    ],
    name: "convertToAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_roundUp",
        type: "bool",
      },
    ],
    name: "convertToAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_roundUp",
        type: "bool",
      },
    ],
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRateInfo",
    outputs: [
      {
        internalType: "uint64",
        name: "lastBlock",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "feeToProtocolRate",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "lastTimestamp",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "ratePerSec",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dirtyLiquidationFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchangeRateInfo",
    outputs: [
      {
        internalType: "uint32",
        name: "lastTimestamp",
        type: "uint32",
      },
      {
        internalType: "uint224",
        name: "exchangeRate",
        type: "uint224",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getConstants",
    outputs: [
      {
        internalType: "uint256",
        name: "_LTV_PRECISION",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_LIQ_PRECISION",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_UTIL_PREC",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_FEE_PRECISION",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_EXCHANGE_PRECISION",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "_DEFAULT_INT",
        type: "uint64",
      },
      {
        internalType: "uint16",
        name: "_DEFAULT_PROTOCOL_FEE",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_MAX_PROTOCOL_FEE",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_rateInitCallData",
        type: "bytes",
      },
    ],
    name: "initialize",
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
    name: "lastInteractionBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_borrowAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_initialCollateralAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_underlyingAsset",
        type: "address",
      },
    ],
    name: "leveragePosition",
    outputs: [
      {
        internalType: "uint256",
        name: "_totalCollateralAdded",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128",
        name: "_sharesToLiquidate",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
    ],
    name: "liquidate",
    outputs: [
      {
        internalType: "uint256",
        name: "_collateralForLiquidator",
        type: "uint256",
      },
    ],
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
    name: "maxDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxLTV",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
    name: "maxMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "maxRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "maxWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "_assets",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
        name: "",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oracleDivide",
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
    name: "oracleMultiply",
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
    name: "oracleNormalization",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "pauseSettings",
    outputs: [
      {
        internalType: "bool",
        name: "depositLiquidity",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "withdrawLiquidity",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "addLeverage",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "removeLeverage",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "addInterest",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "liquidations",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "addCollateral",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "removeCollateral",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "repayAsset",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    name: "previewRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_assets",
        type: "uint256",
      },
    ],
    name: "previewWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rateContract",
    outputs: [
      {
        internalType: "contract IRateCalculator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rateInitCallData",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "_assets",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_collateralAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "removeCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_borrower",
        type: "address",
      },
    ],
    name: "repayAsset",
    outputs: [
      {
        internalType: "uint256",
        name: "_amountToRepay",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_collateralToSwap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_underlyingAsset",
        type: "address",
      },
    ],
    name: "repayAssetWithCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "_amountAssetOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swap",
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
    name: "symbol",
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
    inputs: [],
    name: "totalAUM",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBorrow",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateExchangeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "_exchangeRate",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_newFee",
        type: "uint64",
      },
    ],
    name: "updateFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
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
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_configData",
        type: "bytes",
      },
    ],
    name: "updatePauseSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_swap",
        type: "address",
      },
    ],
    name: "updateSwap",
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
    name: "userBorrowShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
    name: "userCollateralBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    name: "withdrawFees",
    outputs: [
      {
        internalType: "uint256",
        name: "_amountToTransfer",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
