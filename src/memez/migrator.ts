import { Transaction } from '@mysten/sui/transactions';

import { SDK } from './sdk';
import { MigratorMigrateArgs, SdkConstructorArgs } from './types/memez.types';

export class MigratorSDK extends SDK {
  constructor(args: SdkConstructorArgs | undefined | null = null) {
    super(args);
  }

  public migrate({
    tx = new Transaction(),
    migrator,
    memeCoinType,
    quoteCoinType,
  }: MigratorMigrateArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_MIGRATOR.latest,
      module: 'dummy',
      function: 'migrate',
      arguments: [migrator],
      typeArguments: [memeCoinType, quoteCoinType],
    });

    return {
      tx,
    };
  }
}
