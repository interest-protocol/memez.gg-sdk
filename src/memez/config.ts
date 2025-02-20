import { bcs } from '@mysten/sui/bcs';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag } from '@mysten/sui/utils';

import {
  AddMigrationWitnessArgs,
  RemoveConfigurationArgs,
  RemoveMigrationWitnessArgs,
  SdkConstructorArgs,
  SetAuctionArgs,
  SetFeesArgs,
  SetPumpArgs,
  SetStableArgs,
} from './memez.types';
import { SDK } from './sdk';

export class ConfigSDK extends SDK {
  constructor(args: SdkConstructorArgs | undefined | null = null) {
    super(args);
  }

  public addMigrationWitness({
    tx = new Transaction(),
    authWitness,
    witness,
  }: AddMigrationWitnessArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.MIGRATOR_LIST,
      function: 'add',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.MIGRATOR_LIST({ mutable: true })),
        this.ownedObject(tx, authWitness),
      ],
      typeArguments: [normalizeStructTag(witness)],
    });

    return tx;
  }

  public removeMigrationWitness({
    tx = new Transaction(),
    authWitness,
    witness,
  }: RemoveMigrationWitnessArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.MIGRATOR_LIST,
      function: 'remove',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.MIGRATOR_LIST({ mutable: true })),
        this.ownedObject(tx, authWitness),
      ],
      typeArguments: [normalizeStructTag(witness)],
    });

    return tx;
  }

  public setFees({
    tx = new Transaction(),
    authWitness,
    configurationKey,
    values,
    recipients,
  }: SetFeesArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'set_fees',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: true })),
        this.ownedObject(tx, authWitness),
        tx.pure(bcs.vector(bcs.vector(bcs.u64())).serialize(values).toBytes()),
        tx.pure(
          bcs.vector(bcs.vector(bcs.Address)).serialize(recipients).toBytes()
        ),
      ],
      typeArguments: [normalizeStructTag(configurationKey)],
    });

    return tx;
  }

  public setAuction({
    tx = new Transaction(),
    authWitness,
    configurationKey,
    quoteCoinType,
    values,
  }: SetAuctionArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'set_auction',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: true })),
        this.ownedObject(tx, authWitness),
        tx.pure(bcs.vector(bcs.u64()).serialize(values).toBytes()),
      ],
      typeArguments: [
        normalizeStructTag(quoteCoinType),
        normalizeStructTag(configurationKey),
      ],
    });

    return tx;
  }

  public setPump({
    tx = new Transaction(),
    authWitness,
    configurationKey,
    values,
    quoteCoinType,
  }: SetPumpArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'set_pump',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: true })),
        this.ownedObject(tx, authWitness),
        tx.pure(bcs.vector(bcs.u64()).serialize(values).toBytes()),
      ],
      typeArguments: [
        normalizeStructTag(quoteCoinType),
        normalizeStructTag(configurationKey),
      ],
    });

    return tx;
  }

  public setStable({
    tx = new Transaction(),
    authWitness,
    configurationKey,
    quoteCoinType,
    values,
  }: SetStableArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'set_stable',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: true })),
        this.ownedObject(tx, authWitness),
        tx.pure(bcs.vector(bcs.u64()).serialize(values).toBytes()),
      ],
      typeArguments: [
        normalizeStructTag(quoteCoinType),
        normalizeStructTag(configurationKey),
      ],
    });

    return tx;
  }

  public removeConfiguration({
    tx = new Transaction(),
    configurationKey,
    model,
    authWitness,
  }: RemoveConfigurationArgs) {
    tx.moveCall({
      package: this.packages.MEMEZ_FUN.latest,
      module: this.modules.CONFIG,
      function: 'remove',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.CONFIG({ mutable: true })),
        this.ownedObject(tx, authWitness),
      ],
      typeArguments: [
        normalizeStructTag(configurationKey),
        normalizeStructTag(model),
      ],
    });

    return tx;
  }
}
