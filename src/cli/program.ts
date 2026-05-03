import fs from 'node:fs/promises'
import path from 'node:path'

import { Command } from 'commander'

import { PackageWithExports, resolvePackageExports } from '@/api-extractor/package-exports.js'
import { loadAndResolveConfig } from '@/config-file/load-config.js'

import { CliOptions, resolveCliOptions } from './options.js'

import pkg from '#package.json' with { type: 'json' }

interface DocweaverCommand extends Command {
  option(
    flags: `--${keyof CliOptions}${'' | ` <${string}>` | ` [${string}]`}`,
    description: string,
  ): this
}

export const program: DocweaverCommand = new Command()

program
  .name('docweaver')
  .description('CLI for docweaver')
  .version(pkg.version)
  .option('--package <file-path>', 'the package.json file of the package to be documented.')
  .option('--tsconfig <file-path>', 'the tsconfig.json file of the package to be documented')
  .option('--config <file-path>', '')
  .option('--config.loader <mode>', '')
  .option('--config.encoding <buffer-encoding>', '')
  .option('--config.tsconfig <path>', '')
  .action(async (args: Record<string, unknown>) => {
    const options = resolveCliOptions(args)

    const config = await loadAndResolveConfig(options)

    console.log({ config })

    const packageContents = PackageWithExports.assert(
      JSON.parse(await fs.readFile(config.package, 'utf8')),
    )

    const exports = await resolvePackageExports({
      packageContents,
      packageDirectory: path.dirname(config.package),
    })

    console.dir({ exports }, { depth: 4 })
  })
