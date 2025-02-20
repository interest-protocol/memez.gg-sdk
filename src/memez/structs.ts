import { bcs, BcsType } from '@mysten/sui/bcs';
import { fromHex, toHex } from '@mysten/sui/utils';

const Address = bcs.bytes(32).transform({
  // To change the input type, you need to provide a type definition for the input
  input: (val: string) => fromHex(val),
  output: (val) => toHex(val),
});

export const FeePayload = bcs.struct('FeePayload', {
  value: bcs.u64(),
  percentages: bcs.vector(bcs.u64()),
  recipients: bcs.vector(Address),
});

export const MemezFees = bcs.struct('MemezFees', {
  creatorFee: FeePayload,
  swapFee: FeePayload,
  migration: FeePayload,
  allocation: FeePayload,
  vestingPeriod: bcs.u64(),
});

export const VecMap = (K: BcsType<any, any>, V: BcsType<any, any>) =>
  bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
    contents: bcs.vector(bcs.struct('Entry', { key: K, value: V })),
  });
