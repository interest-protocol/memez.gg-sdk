import {
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  SUI_TYPE_ARG,
} from '@mysten/sui/utils';

import { OwnedObjects, Package } from './types/memez.types';

export enum Modules {
  FUN = 'memez_fun',
  ACL = 'acl',
  MIGRATOR_LIST = 'memez_migrator_list',
  PUMP = 'memez_pump',
  CONFIG = 'memez_config',
  VERSION = 'memez_allowed_versions',
  METADATA = 'memez_metadata',
  STABLE = 'memez_stable',
  PUMP_CONFIG = 'memez_pump_config',
  STABLE_CONFIG = 'memez_stable_config',
}

// TODO: Need to be updated
export enum Treasuries {
  RECRD = '0x2',
  MEMEZ = '0x3',
  WINX = '0x4',
  NEXA = '0x5',
  DEXTER = '0x6',
}

export enum Progress {
  Bonding = 'Bonding',
  Migrating = 'Migrating',
  Migrated = 'Migrated',
}

export const PACKAGES: Package = {
  MEMEZ_FUN: {
    original: normalizeSuiAddress(
      '0x0d2de7abb5af102967b8bdd0d550fd571da19e563ece6806ebd25692b21b2f8a'
    ),
    latest: normalizeSuiAddress(
      '0x0d2de7abb5af102967b8bdd0d550fd571da19e563ece6806ebd25692b21b2f8a'
    ),
  },
  ACL: {
    original: normalizeSuiAddress(
      '0x5d406d0307d260f6ffc01f87960b0c28b8c5c3f0e8e71897b1a924a757232179'
    ),
    latest: normalizeSuiAddress(
      '0x5d406d0307d260f6ffc01f87960b0c28b8c5c3f0e8e71897b1a924a757232179'
    ),
  },
  VESTING: {
    original: normalizeSuiAddress(
      '0xdada5d84429db8d56a775593b2893fc030826055dc84fa47ccdfd4933a63d093'
    ),
    latest: normalizeSuiAddress(
      '0xdada5d84429db8d56a775593b2893fc030826055dc84fa47ccdfd4933a63d093'
    ),
  },
  MEMEZ_MIGRATOR: {
    original: normalizeSuiAddress(
      '0xf66e73ad11ab61164ebc5b581ba05a1ac1be01b8d64e19acabfb0f0572e3251e'
    ),
    latest: normalizeSuiAddress(
      '0xf66e73ad11ab61164ebc5b581ba05a1ac1be01b8d64e19acabfb0f0572e3251e'
    ),
  },
  MEMEZ_WITNESS: {
    original: normalizeSuiAddress(
      '0x6083aeb2d22514d0e849fdde75b60c7d0f857facefb3b2d7d2e975b78d8a0c75'
    ),
    latest: normalizeSuiAddress(
      '0x6083aeb2d22514d0e849fdde75b60c7d0f857facefb3b2d7d2e975b78d8a0c75'
    ),
  },
} as const;

export const OWNED_OBJECTS: OwnedObjects = {
  SUPER_ADMIN: normalizeSuiObjectId(
    '0xe3058ee659ef181a8669da12c3368e5b87ac93cb6a66a6a78fe3e812dcb04d15'
  ),
  ACL_UPGRADE_CAP: normalizeSuiObjectId(
    '0x5e56e4dda714c27c1f246c9e570ce0aee4dc25a520e2d6e6931aa7a7b72cdd72'
  ),
  VESTING_UPGRADE_CAP: normalizeSuiObjectId(
    '0x5aecaddf8df660e91d7b002a6bea814fdb5ef34f940ae7bc4ac17db817c51bed'
  ),
  MEMEZ_FUN_UPGRADE_CAP: normalizeSuiObjectId(
    '0xc667d90fed63b6c96ef89b002c5616d8147fc27ab5a3bb1c4c43dc73b4e7f323'
  ),
  MEMEZ_MIGRATOR_UPGRADE_CAP: normalizeSuiObjectId(
    '0x0806f525f06e0fcf0f79baeabcf4c49de2be292b87f59c9fabf59fbf779fe2f4'
  ),
  ADMIN: normalizeSuiObjectId(
    '0x8998ca48bb71c4df67705a551485e1129fbd542b8e85f2680b5b4d69e237d338'
  ),
} as const;

export const SHARED_OBJECTS = {
  ACL: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x1b5397ee2f6f8ccfb26016c1ed996f25b2277acb9ed5173fa0bed386360960d8'
    ),
    initialSharedVersion: '384530228',
    mutable,
  }),
  MIGRATOR_LIST: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0xe33c39026d61bb05d38bf662fc38d6337048c7a569d1707b3d1477bb1023967c'
    ),
    initialSharedVersion: '395367155',
    mutable,
  }),
  VERSION: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0xff4bcdce04b9297e57ed9a4e25d79d3fcdc506c4ddf2fb278a93f572209e4c0d'
    ),
    initialSharedVersion: '395367155',
    mutable,
  }),
  CONFIG: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x89a460758f68139433736ca802c8ed54f0f9df70acbda314daab968744d89864'
    ),
    initialSharedVersion: '395367155',
    mutable,
  }),
} as const;

export const MIGRATOR_WITNESSES = {
  TEST: `${PACKAGES.MEMEZ_MIGRATOR.original}::dummy::Witness`,
} as const;

export const CONFIG_KEYS = {
  DEFAULT: `${PACKAGES.MEMEZ_FUN.original}::memez_config::DefaultKey`,
  RECRD: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Recrd`,
  NEXA: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Nexa`,
  MEMEZ: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Memez`,
} as const;

export const CONFIG_MODELS = {
  FEE: `${PACKAGES.MEMEZ_FUN.original}::memez_fees::MemezFees`,
  PUMP: `${PACKAGES.MEMEZ_FUN.original}::memez_pump_model::PumpModel`,
  STABLE: `${PACKAGES.MEMEZ_FUN.original}::memez_stable_model::StableModel`,
  AUCTION: `${PACKAGES.MEMEZ_FUN.original}::memez_auction_model::AuctionModel`,
} as const;

export const MAX_BPS = 10_000n;

export const CONFIG_QUOTE_COIN_TYPES = {
  [CONFIG_KEYS.DEFAULT]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.RECRD]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.NEXA]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.MEMEZ]: normalizeStructTag(SUI_TYPE_ARG),
} as const;
