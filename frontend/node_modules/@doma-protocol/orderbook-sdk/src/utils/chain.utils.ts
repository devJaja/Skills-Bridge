import type { Caip2ChainId } from '../types';

export const CAIP2_PREFIX = 'eip155';

export const parseChainId = (network: Caip2ChainId): number => {
  const [prefix, id] = network.split(':');
  if (prefix !== CAIP2_PREFIX) {
    throw new Error('Invalid chainId');
  }
  return Number(id);
};
