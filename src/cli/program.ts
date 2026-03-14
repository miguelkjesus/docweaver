import { Command } from 'commander'

import { loadConfig } from '@/config-file/load-config.js'
import { mergeConfig } from '@/config-file/merge-config.js'

import { parseCliOptions } from './options.js'

import pkg from '#package' with { type: 'json' }

export const program = new Command()

program
  .name('docspec')
  .description('CLI for DocSpec')
  .version(pkg.version)
  .option('--paths <paths...>', 'specify the paths to search for documentation files in')
  .option('--files <paths...>', 'matchers for the documentation files')
  .option('--tsconfig <paths...>', 'matchers for the documentation files')
  .option('--config <path>', '')
  .option('--config.loader <mode>', '')
  .option('--config.encoding <buffer-encoding>', '')
  .option('--config.json.encoding <buffer-encoding>', '')
  .option('--config.yaml.encoding <buffer-encoding>', '')
  .option('--config.bundle.tsconfig <path>', '')
  .action(async (args: Record<string, unknown>) => {
    const options = parseCliOptions(args)

    const config = mergeConfig(await loadConfig(options.config), options)

    console.log(config)
  })
