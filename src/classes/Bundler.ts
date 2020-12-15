import * as fs from 'fs/promises'
import * as path from 'path'

export default class Bundler {
    public static async bundle (entryPointContents:string, entryPointPath:string) {
        let m

        const importPattern = /import ('|")(.*)('|")/gm

        while ((m = importPattern.exec(entryPointContents)) !== null) {
            if (m.index === importPattern.lastIndex) {
                importPattern.lastIndex++
            }

            const entryPointDirectory = /.*\//.exec(entryPointPath)[0]

            const fileNameToInclude = path.join(entryPointDirectory, m[2])
            const fileContentsToInclude = await fs.readFile(fileNameToInclude, 'utf-8')
            const replacePattern = new RegExp(`import ('|")${m[2]}('|")`, 'gm')

            const bundled = await Bundler.bundle(fileContentsToInclude, fileNameToInclude)

            entryPointContents = entryPointContents.replace(replacePattern, bundled)
        }

        return entryPointContents
    }
}
