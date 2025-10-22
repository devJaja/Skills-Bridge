export interface BlockchainOperationHandler<TParams, TResult> {
  execute(params: TParams): Promise<TResult>;
}
