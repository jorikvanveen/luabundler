#!/usr/bin/env node

import * as yargs from 'yargs'
import * as fs from 'fs/promises'

import Bundler from './classes/Bundler'

const DEBUG_MODE = false

interface Args {
    file: string
    output: string
    _: (string | number)[],
    $0: string
    [key: string]: unknown
}

const mainArgv = yargs
    .scriptName('luabundler')
    .showHelpOnFail(true)
    .command('bundle', 'bundle your lua file', yargs => {
        yargs.option('file', {
            type: 'string',
            demandOption: true,
            alias: 'f',
            describe: 'The entry point to bundle from'
        })

        yargs.option('output', {
            type: 'string',
            alias: 'o',
            describe: 'The lua file to output to',
            default: 'out.lua'
        })
    }, async (argv) => {
        const parsedArgs = argv as Args

        const inputFileContents = await fs.readFile(parsedArgs.file, 'utf-8')
        const bundled = await Bundler.bundle(inputFileContents, parsedArgs.file)

        console.log(bundled)

        await fs.writeFile(parsedArgs.output, bundled, 'utf-8')
    })
    .help()
    .argv

if (DEBUG_MODE) {
    console.log(mainArgv)
}
