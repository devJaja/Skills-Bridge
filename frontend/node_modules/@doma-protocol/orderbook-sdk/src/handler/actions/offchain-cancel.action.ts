import type { Signer } from 'ethers';

export interface OffChainCancel {
  orderHash: string;
  signature: string;
}

export type OffChainCancelAction = {
  type: 'offChainCancel';
  getMessageToSign: () => string;
  createCancelSignature: () => Promise<OffChainCancel>;
};

export const createOffChainCancelAction = (
  signer: Signer,
  orderHash: string,
  seaportContractAddress: string,
  chainId: number,
): OffChainCancelAction => {
  // EIP-712 data
  const domain = {
    name: 'Seaport',
    version: '1.6',
    chainId: chainId,
    verifyingContract: seaportContractAddress,
  };
  const types = {
    OrderHash: [{ name: 'orderHash', type: 'bytes32' }],
  };
  const value = {
    orderHash: orderHash,
  };

  return {
    type: 'offChainCancel',
    getMessageToSign: () => orderHash,
    createCancelSignature: async (): Promise<OffChainCancel> => {
      // Sign the EIP-712 data
      const signature = await signer.signTypedData(domain, types, value);

      return {
        orderHash,
        signature,
      };
    },
  };
};
