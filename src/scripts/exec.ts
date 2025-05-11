import { exec } from 'child_process';
import invariant from 'tiny-invariant';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

(async () => {
  const argv = await yargs(hideBin(process.argv))
    .option('network', {
      alias: 'n',
      type: 'string',
      description: 'Specify the network',
    })
    .option('function', {
      alias: 'f',
      type: 'string',
      description: 'Specify the memez function to run',
    })
    .parse();

  const { network, function: functionName } = argv;

  invariant(functionName, 'Function name is required');

  const file = functionName.split('::')[0];
  const fn = functionName.split('::')[1];

  const command = `tsx src/scripts/executables/${file}/${fn}.ts --network ${network}`;

  exec(command, (error, stdout) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    console.log(stdout);
  });
})();
