#!/usr/bin/env node

import { Command } from 'commander'
import { register } from 'tsx/esm/api'

import { build } from './build'
import { CLIConfig, findAndLoadConfig } from './config'

import pkg from '#package' with { type: 'json' }

register()

const program = new Command()

program
  .name('docspec')
  .description('CLI for DocSpec')
  .version(pkg.version)
  .option('--paths <paths...>', 'specify the paths to search for documentation files in')
  .option('--files <paths...>', 'matchers for the documentation files')
  .option('--emitNodes <path>', 'emit the intermediate nodes to the specified path in JSON format')
  .action(async (cliConfig: CLIConfig) => {
    const config = await findAndLoadConfig(cliConfig)

    await build(config)
  })

program.parse()
