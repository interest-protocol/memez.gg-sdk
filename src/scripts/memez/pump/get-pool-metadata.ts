import { log, memezPumpTestnet, TEST_POOL_ID } from '../../utils.script';

(async () => {
  const r = await memezPumpTestnet.getPoolMetadata({
    poolId: TEST_POOL_ID,
    quoteCoinType: '0x2::sui::SUI',
    memeCoinType:
      '0xccba2a10e21adb177c0cd252049d774db4943d5acdd43904131ef7958c73d86a::meme::MEME',
    curveType:
      '0x63fed690a1154cfc4b31658443227de047cf3d305179aa5836e177c9efa57854::memez_pump::Pump',
  });

  log(r);
})();
