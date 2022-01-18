import typescript from "@rollup/plugin-typescript"
import * as fs from "fs"
import cleanup from "rollup-plugin-cleanup"

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"))
const banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
 * @file ${pkg.description}
 * @copyright ${pkg.author.name} ${new Date().getFullYear()}
 * @license ${pkg.license}
 * @see [Github]{@link ${pkg.homepage}}
*/`

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.exports.require, format: "cjs", banner, exports: "auto" },
    { file: pkg.exports.import, format: "es", banner }
  ],
  external: Object.keys(pkg.dependencies),
  plugins: [typescript({ tsconfig: "./build.tsconfig.json" }), cleanup({ comments: "jsdoc" })]
}
