import { BrowserProvider, type Eip1193Provider, JsonRpcSigner } from 'ethers';
import type { WalletClient } from 'viem';

import type { Caip2ChainId } from '../types';

export const viemToEthersSigner = (
  viemWalletClient: WalletClient,
  chainId: Caip2ChainId,
): JsonRpcSigner => {
  const { account, chain, transport } = viemWalletClient;

  if (!account?.address) {
    throw new Error('No address found');
  }
  if (!chain) {
    throw new Error('No chain found');
  }

  const network = {
    chainId: Number(chainId.split(':')[1]),
    name: '',
  };

  // Use type assertion to treat transport as Eip1193Provider
  const provider = new BrowserProvider(transport as unknown as Eip1193Provider, network);
  return new JsonRpcSigner(provider, account.address);
};
