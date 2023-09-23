import { Command } from 'commander';

let program = new Command();

program.option('--mode <env>', 'set your environment', 'dev');

program.parse(process.argv);

export default program;
