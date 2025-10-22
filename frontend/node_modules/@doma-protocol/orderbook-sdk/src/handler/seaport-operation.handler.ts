import type { Caip2ChainId, DomaOrderbookSDKConfig, ProgressStep } from '../types';
import { type BlockchainActions, executeAllActions } from '../core';
import type { ApiClient } from '../api/api.client';
import type { BlockchainOperationHandler } from './types';
import type { JsonRpcSigner } from 'ethers';
import { Seaport } from '@opensea/seaport-js';
import { DomaOrderbookError, DomaOrderbookErrorCode } from '../errors';

export abstract class SeaportOperationHandler<TParams, TResult>
  implements BlockchainOperationHandler<TParams, TResult>
{
  protected apiClient: ApiClient;
  protected chainId: Caip2ChainId;
  protected config: DomaOrderbookSDKConfig;
  protected onProgress?: (progress: ProgressStep[]) => void;
  protected signer: JsonRpcSigner;
  protected seaport: Seaport;

  constructor(
    config: DomaOrderbookSDKConfig,
    apiClient: ApiClient,
    signer: JsonRpcSigner,
    chainId: Caip2ChainId,
    onProgress?: (progress: ProgressStep[]) => void,
    options: {
      seaportBalanceAndApprovalChecksOnOrderCreation?: boolean;
    } = {},
  ) {
    const { seaportBalanceAndApprovalChecksOnOrderCreation = true } = options;

    this.config = config;
    this.apiClient = apiClient;
    this.chainId = chainId;
    this.onProgress = onProgress;
    this.signer = signer;
    this.seaport = new Seaport(this.signer, {
      balanceAndApprovalChecksOnOrderCreation: seaportBalanceAndApprovalChecksOnOrderCreation,
    });
  }

  protected async getWalletAddress(): Promise<string> {
    const walletAddress = await this.signer.getAddress();
    if (!walletAddress) {
      throw new DomaOrderbookError(
        DomaOrderbookErrorCode.SIGNER_NOT_PROVIDED,
        'Wallet address not found',
      );
    }
    return walletAddress;
  }

  protected async executeBlockchainOperation<R>(
    actions: ReadonlyArray<BlockchainActions>,
  ): Promise<R> {
    return executeAllActions<R>(actions, {
      onProgress: this.onProgress,
    });
  }

  public abstract execute(params: TParams): Promise<TResult>;
}
