import { bcs } from '@mysten/sui/bcs';
import { Transaction } from '@mysten/sui/transactions';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { devInspectAndGetReturnValues } from '@polymedia/suitcase-core';
import invariant from 'tiny-invariant';

import { SDK } from './sdk';
import {
  DestroyAdminArgs,
  DestroySuperAdminArgs,
  FinishSuperAdminTransferArgs,
  IsAdminArgs,
  NewAdminAndTransferArgs,
  NewAdminArgs,
  RevokeAdminArgs,
  SdkConstructorArgs,
  StartSuperAdminTransferArgs,
} from './types/memez.types';

export class AclSDK extends SDK {
  constructor(args: SdkConstructorArgs | undefined | null = null) {
    super(args);
  }

  public newAdmin({ tx = new Transaction(), superAdmin }: NewAdminArgs) {
    const admin = tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'new',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: true })),
        this.ownedObject(tx, superAdmin),
      ],
    });

    return {
      admin,
      tx,
    };
  }

  public newAdminAndTransfer({
    tx = new Transaction(),
    superAdmin,
    recipient,
  }: NewAdminAndTransferArgs) {
    invariant(
      isValidSuiAddress(recipient),
      'recipient must be a valid Sui address'
    );

    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'new_and_transfer',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: true })),
        this.ownedObject(tx, superAdmin),
        tx.pure.address(recipient),
      ],
    });

    return tx;
  }

  public revokeAdmin({
    tx = new Transaction(),
    superAdmin,
    admin,
  }: RevokeAdminArgs) {
    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'revoke',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: true })),
        this.ownedObject(tx, superAdmin),
        tx.pure.address(admin),
      ],
    });

    return tx;
  }

  public destroyAdmin({ tx = new Transaction(), admin }: DestroyAdminArgs) {
    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'destroy_admin',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: true })),
        this.ownedObject(tx, admin),
      ],
    });

    return tx;
  }

  public destroySuperAdmin({
    tx = new Transaction(),
    superAdmin,
  }: DestroySuperAdminArgs) {
    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'destroy',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: true })),
        this.ownedObject(tx, superAdmin),
      ],
    });

    return tx;
  }

  public startSuperAdminTransfer({
    tx = new Transaction(),
    superAdmin,
    recipient,
  }: StartSuperAdminTransferArgs) {
    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'start_transfer',
      arguments: [this.ownedObject(tx, superAdmin), tx.pure.address(recipient)],
    });

    return tx;
  }

  public finishSuperAdminTransfer({
    tx = new Transaction(),
    superAdmin,
  }: FinishSuperAdminTransferArgs) {
    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'finish_transfer',
      arguments: [this.ownedObject(tx, superAdmin)],
    });

    return tx;
  }

  public async isAdmin({ admin }: IsAdminArgs) {
    const tx = new Transaction();

    tx.moveCall({
      package: this.packages.ACL.latest,
      module: this.modules.ACL,
      function: 'is_admin',
      arguments: [
        tx.sharedObjectRef(this.sharedObjects.ACL({ mutable: false })),
        tx.pure.address(admin),
      ],
    });

    const result = await devInspectAndGetReturnValues(this.client, tx, [
      [bcs.Bool],
    ]);

    return result[0][0];
  }
}
