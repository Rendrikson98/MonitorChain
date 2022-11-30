export const videoContract = {
  abi: [
    {
      inputs: [
        {
          internalType: 'address payable',
          name: '_contentCreatorAddress',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '_cpmValue',
          type: 'uint256',
        },
      ],
      stateMutability: 'payable',
      type: 'constructor',
      payable: true,
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'getInfoVideo',
      outputs: [
        {
          components: [
            {
              internalType: 'uint256',
              name: 'totalViews',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'retentionRate',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'totalViewingTime',
              type: 'uint256',
            },
            {
              internalType: 'address payable',
              name: 'contentCreatorAddress',
              type: 'address',
            },
            {
              internalType: 'address payable',
              name: 'platformAddress',
              type: 'address',
            },
          ],
          internalType: 'struct videoStruct',
          name: '',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'getTotalView',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'getRetentionRate',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'getTotalViewingTime',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'assistedTime',
          type: 'uint256',
        },
      ],
      name: 'updateInfoVideo',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
  ],
  address: '0x4e03077b8dbae442c8b4ef157b1f32c05358cd57',
  bytecode:
    '0x608060405234801561001057600080fd5b506004361061007d5760003560e01c80638da5cb5b1161005b5780638da5cb5b146100da578063bcb377db146100f8578063ecceb9d514610116578063fcbc1c2b146101345761007d565b80636cfee2c014610082578063722713f7146100a05780637a372f6c146100be575b600080fd5b61008a610152565b60405161009791906105e0565b60405180910390f35b6100a8610236565b6040516100b5919061060a565b60405180910390f35b6100d860048036038101906100d39190610656565b61023e565b005b6100e261036d565b6040516100ef9190610692565b60405180910390f35b610100610391565b60405161010d919061060a565b60405180910390f35b61011e61039e565b60405161012b919061060a565b60405180910390f35b61013c6103ab565b604051610149919061060a565b60405180910390f35b61015a6104c3565b60036040518060a00160405290816000820154815260200160018201548152602001600282015481526020016003820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016004820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050905090565b600047905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c39061070a565b60405180910390fd5b600060016003600001546102e09190610759565b9050600081836003600101546102f69190610759565b61030091906107de565b90506000836003600201546103159190610759565b9050826003600001819055508160036001018190555080600360020181905550600180546103439190610759565b6001819055506101f46001540361036757600060018190555061036660016103b8565b5b50505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600360020154905090565b6000600360000154905090565b6000600360010154905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610446576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043d9061070a565b60405180910390fd5b6003800160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc633b9aca0083610494919061080f565b9081150290604051600060405180830381858888f193505050501580156104bf573d6000803e3d6000fd5b5050565b6040518060a00160405280600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b6000819050919050565b6105318161051e565b82525050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061056282610537565b9050919050565b61057281610557565b82525050565b60a08201600082015161058e6000850182610528565b5060208201516105a16020850182610528565b5060408201516105b46040850182610528565b5060608201516105c76060850182610569565b5060808201516105da6080850182610569565b50505050565b600060a0820190506105f56000830184610578565b92915050565b6106048161051e565b82525050565b600060208201905061061f60008301846105fb565b92915050565b600080fd5b6106338161051e565b811461063e57600080fd5b50565b6000813590506106508161062a565b92915050565b60006020828403121561066c5761066b610625565b5b600061067a84828501610641565b91505092915050565b61068c81610557565b82525050565b60006020820190506106a76000830184610683565b92915050565b600082825260208201905092915050565b7f566f6365206e616f206520646f6e6f20646f20636f6e747261746f0000000000600082015250565b60006106f4601b836106ad565b91506106ff826106be565b602082019050919050565b60006020820190508181036000830152610723816106e7565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006107648261051e565b915061076f8361051e565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156107a4576107a361072a565b5b828201905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006107e98261051e565b91506107f48361051e565b925082610804576108036107af565b5b828204905092915050565b600061081a8261051e565b91506108258361051e565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561085e5761085d61072a565b5b82820290509291505056fea2646970667358221220ac1a746aa56a40ee154c72dca44f891b55631c956ee69193be8ff17a45cb242e64736f6c634300080e0033',
};
