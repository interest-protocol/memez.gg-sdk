import {
  normalizeStructTag,
  normalizeSuiAddress,
  normalizeSuiObjectId,
  SUI_TYPE_ARG,
} from '@mysten/sui/utils';

export enum Modules {
  FUN = 'memez_fun',
  ACL = 'access_control',
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
  NEXA = '0x4',
  XPUMP = '0x5',
}

export enum Progress {
  Bonding = 'Bonding',
  Migrating = 'Migrating',
  Migrated = 'Migrated',
}

export const PACKAGES = {
  MEMEZ_FUN: {
    original: normalizeSuiAddress(
      '0x646e2bc436448a03b457dc48f6276586dd70838d0adce8f9515d50f64328dea6'
    ),
    latest: normalizeSuiAddress(
      '0x646e2bc436448a03b457dc48f6276586dd70838d0adce8f9515d50f64328dea6'
    ),
  },
  MEMEZ: {
    original: normalizeSuiAddress(
      '0x1cdc5a945766eadba28f2fff020d8b16eb5336d5892288590a525df1fcdd307f'
    ),
    latest: normalizeSuiAddress(
      '0x1cdc5a945766eadba28f2fff020d8b16eb5336d5892288590a525df1fcdd307f'
    ),
  },
  VESTING: {
    original: normalizeSuiAddress(
      '0xbc838799ce0c571fddb5c650adae05ed141070501558743f2f28d2d3fbede8d6'
    ),
    latest: normalizeSuiAddress(
      '0xbc838799ce0c571fddb5c650adae05ed141070501558743f2f28d2d3fbede8d6'
    ),
  },
  TEST_MEMEZ_MIGRATOR: {
    original: normalizeSuiAddress(
      '0x343ef1c5e36c63903b0a36ee8920476d0151ce22b33ae4f2ebe001535ace48bb'
    ),
    latest: normalizeSuiAddress(
      '0x343ef1c5e36c63903b0a36ee8920476d0151ce22b33ae4f2ebe001535ace48bb'
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
  INTEREST_ACL: {
    original: normalizeSuiAddress(
      '0x32ffaa298a6d6528864bf2b32acfcb7976a95e26dcc24e40e2535c0551b9d68a'
    ),
    latest: normalizeSuiAddress(
      '0x32ffaa298a6d6528864bf2b32acfcb7976a95e26dcc24e40e2535c0551b9d68a'
    ),
  },
} as const;

export const OWNED_OBJECTS = {
  MEMEZ_SUPER_ADMIN: normalizeSuiObjectId(
    '0xa31863b769a961e28f6937563483b7476208f7a9f4b10dd661fc4c5978a7eba8'
  ),
  VESTING_UPGRADE_CAP: normalizeSuiObjectId(
    '0x91d2da1c0929db3e040d483fbbf5f169ce9b964b07ce3c084efbfcccf74220ec'
  ),
  MEMEZ_FUN_UPGRADE_CAP: normalizeSuiObjectId(
    '0x749551a71c6dc97e374d77ff872fe6646fe249ab22e55966a4bdb4ab71ea8cc1'
  ),
  TEST_MEMEZ_MIGRATOR_UPGRADE_CAP: normalizeSuiObjectId(
    '0x123088ffb2395a6a2e8a5873eb3fdec622c6485a4e18e323eee52a949cb757ec'
  ),
  ADMIN: normalizeSuiObjectId(
    '0xf3083824beecb93d1ed2ebb1cec5bcea80e962291b14c7e7836472db349d25ef'
  ),
  MEMEZ_PUBLISHER: normalizeSuiObjectId(
    '0xa979ae60cc980f79d21503f59542897ccc7269a2e5fac266e0a6ac43066aab64'
  ),
  MEMEZ_UPGRADE_CAP: normalizeSuiObjectId(
    '0x82dcbdd113e3609cdd23e305f957832f1b44522e692ced9d72c60413f10b5bcf'
  ),
} as const;

export const SHARED_OBJECTS = {
  ACL: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0xdcbc773e0893b6c848d5a6d49cb672b7f7e251312d044d65c2d1675a1debfff8'
    ),
    initialSharedVersion: '395367186',
    mutable,
  }),
  VERSION: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x51a8f0e4872ac07208dd4b7c0b33a0b972ddc0d80b0f6c8144f6ac7947516499'
    ),
    initialSharedVersion: '395367188',
    mutable,
  }),
  CONFIG: ({ mutable }: { mutable: boolean }) => ({
    objectId: normalizeSuiObjectId(
      '0x2e8a424acb907e3112701f3987a451d9674fb8340fc5304ad6aa27473222272d'
    ),
    initialSharedVersion: '395367188',
    mutable,
  }),
} as const;

export const MIGRATOR_WITNESSES = {
  TEST: `${PACKAGES.TEST_MEMEZ_MIGRATOR.original}::dummy::Witness`,
} as const;

export const TYPES = {
  MEMEZ_OTW: `${PACKAGES.MEMEZ.original}::memez::MEMEZ`,
  MEMEZ_FEE: `${PACKAGES.MEMEZ_FUN.original}::memez_fees::MemezFees`,
} as const;

export const CONFIG_KEYS = {
  RECRD: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Recrd`,
  NEXA: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Nexa`,
  MEMEZ: `${PACKAGES.MEMEZ_WITNESS.original}::memez_witness::Memez`,
} as const;

export const MAX_BPS = 10_000n;

export const CONFIG_QUOTE_COIN_TYPES = {
  [CONFIG_KEYS.RECRD]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.NEXA]: normalizeStructTag(SUI_TYPE_ARG),
  [CONFIG_KEYS.MEMEZ]: normalizeStructTag(SUI_TYPE_ARG),
} as const;
