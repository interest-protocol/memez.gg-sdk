import { Transaction } from '@mysten/sui/transactions';
import invariant from 'tiny-invariant';

import { SDK } from './sdk';
import { MigratorMigrateArgs, SdkConstructorArgs } from './types/memez.types';
import {
  RecrdSetInitializePriceArgs,
  RecrdSetRewardValueArgs,
  RecrdSetTreasuryArgs,
} from './types/migrators.types';
export class TestMigratorSDK extends SDK {
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
      package: this.packages.TEST_MEMEZ_MIGRATOR.latest,
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

export class RecrdMigratorSDK extends SDK {
  packageId =
    '0x682082068b8f1192f16a6074e107014d433e57ef839c7f9e3aea48f2d93a3ea2';

  adminId =
    '0xca3d834e9c872b2b3fc391ae1d4c2c27f95340ba36cd6762532872f1365b1838';

  upgradeCap =
    '0xc82c3fb9e2280554e008ebadc871d9189154a35a37021e8764ebed5e25e2ed49';

  witness =
    '0x682082068b8f1192f16a6074e107014d433e57ef839c7f9e3aea48f2d93a3ea2::recrd_migrator::Witness';

  module = 'recrd_migrator';

  recrdConfig = {
    objectId:
      '0x33347f5adc74fe9c2530df3f8dc456de9fb58764e7e15ff6380e8dae6f5dd62e',
    initialSharedVersion: '549909183',
  };

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
      package: this.packages.TEST_MEMEZ_MIGRATOR.latest,
      module: 'dummy',
      function: 'migrate',
      arguments: [migrator],
      typeArguments: [memeCoinType, quoteCoinType],
    });

    return {
      tx,
    };
  }

  public setRewardValue({
    tx = new Transaction(),
    rewardValue,
  }: RecrdSetRewardValueArgs) {
    tx.moveCall({
      package: this.packageId,
      module: this.module,
      function: 'set_reward_value',
      arguments: [
        tx.sharedObjectRef({
          objectId: this.recrdConfig.objectId,
          mutable: true,
          initialSharedVersion: this.recrdConfig.initialSharedVersion,
        }),
        this.ownedObject(tx, this.adminId),
        tx.pure.u64(rewardValue),
      ],
    });

    return {
      tx,
    };
  }

  public setTreasury({
    tx = new Transaction(),
    treasury,
  }: RecrdSetTreasuryArgs) {
    tx.moveCall({
      package: this.packageId,
      module: this.module,
      function: 'set_treasury',
      arguments: [
        tx.sharedObjectRef({
          objectId: this.recrdConfig.objectId,
          mutable: true,
          initialSharedVersion: this.recrdConfig.initialSharedVersion,
        }),
        this.ownedObject(tx, this.adminId),
        tx.pure.address(treasury),
      ],
    });

    return {
      tx,
    };
  }

  public setInitializePrice({
    tx = new Transaction(),
    price,
  }: RecrdSetInitializePriceArgs) {
    invariant(BigInt(price) > 0n, 'Price must be greater than 0');

    tx.moveCall({
      package: this.packageId,
      module: this.module,
      function: 'set_initialize_price',
      arguments: [
        tx.sharedObjectRef({
          objectId: this.recrdConfig.objectId,
          mutable: true,
          initialSharedVersion: this.recrdConfig.initialSharedVersion,
        }),
        this.ownedObject(tx, this.adminId),
        tx.pure.u64(price),
      ],
    });

    return {
      tx,
    };
  }
}
