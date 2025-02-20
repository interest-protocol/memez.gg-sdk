import { Transaction } from '@mysten/sui/transactions';

import { MigratorMigrateArgs, SdkConstructorArgs } from './memez.types';
import { SDK } from './sdk';

export class MigratorSDK extends SDK {
  constructor(args: SdkConstructorArgs | undefined | null = null) {
    super(args);
  }

  public migrate({
    tx = new Transaction(),
    migrator,
    memeCoinType,
  }: MigratorMigrateArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_MIGRATOR.latest,
      module: 'test_migrator',
      function: 'migrate',
      arguments: [migrator],
      typeArguments: [memeCoinType],
    });

    return {
      tx,
    };
  }
}
