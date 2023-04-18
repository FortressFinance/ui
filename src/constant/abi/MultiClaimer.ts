export const MultiClaimer = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_vaults",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "multiClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "_rewards",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
