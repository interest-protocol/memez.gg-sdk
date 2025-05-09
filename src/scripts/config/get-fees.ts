import { getEnv } from '../utils.script';

(async () => {
  const { configSdk, configKeys, log } = await getEnv();

  const fees = await configSdk.getFees({
    configurationKey: configKeys.MEMEZ,
  });

  log(fees);
})();
