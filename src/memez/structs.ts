import { bcs, BcsType } from '@mysten/sui/bcs';

export const FeePayload = bcs.struct('FeePayload', {
  value: bcs.u64(),
  percentages: bcs.vector(bcs.u64()),
  recipients: bcs.vector(bcs.Address),
});

export const MemezFees = bcs.struct('MemezFees', {
  creation: FeePayload,
  meme_swap: FeePayload,
  quote_swap: FeePayload,
  migration: FeePayload,
  allocation: FeePayload,
  vesting_periods: bcs.vector(bcs.u64()),
  dynamic_stake_holders: bcs.u64(),
});

export const VecMap = (K: BcsType<any, any>, V: BcsType<any, any>) =>
  bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
    contents: bcs.vector(bcs.struct('Entry', { key: K, value: V })),
  });
