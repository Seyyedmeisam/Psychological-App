#!/usr/bin/env bun

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const moduleName = process.argv[2]

if (!moduleName || !/^[a-z][a-z0-9-]*$/.test(moduleName)) {
  console.error('Usage: bun run create:module <name>  (e.g. session, counselor)')
  process.exit(1)
}

const pascal = moduleName
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')

const plural = `${moduleName}s`
const pascalPlural = `${pascal}s`
const paramName = `${moduleName}Id`

const root = process.cwd()
const sourceDir = join(root, 'src/modules/book')
const targetDir = join(root, `src/modules/${moduleName}`)

if (existsSync(targetDir)) {
  console.error(`Module already exists: ${targetDir}`)
  process.exit(1)
}

const replacements: Array<[RegExp, string]> = [
  [/book/g, moduleName],
  [/Book/g, pascal],
  [/books/g, plural],
  [/Books/g, pascalPlural],
  [/bookId/g, paramName],
]

const transform = (content: string) =>
  replacements.reduce((acc, [pattern, value]) => acc.replace(pattern, value), content)

const copyTransformed = (from: string, to: string) => {
  mkdirSync(to, { recursive: true })
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const sourcePath = join(from, entry.name)
    const targetName = entry.name
      .replace(/book/g, moduleName)
      .replace(/Book/g, pascal)
      .replace(/books/g, plural)
      .replace(/Books/g, pascalPlural)
      .replace(/bookId/g, paramName)
    const targetPath = join(to, targetName)

    if (entry.isDirectory()) {
      copyTransformed(sourcePath, targetPath)
      continue
    }

    const raw = readFileSync(sourcePath, 'utf8')
    writeFileSync(targetPath, transform(raw))
  }
}

copyTransformed(sourceDir, targetDir)

const routeTreePath = join(root, 'src/routeTree.config.ts')
const routeTree = readFileSync(routeTreePath, 'utf8')

if (!routeTree.includes(`'/${plural}'`)) {
  const insertion = `    physical('/${plural}', '../modules/${moduleName}/routes'),\n`
  const updated = routeTree.replace(
    /(\s+physical\('\/books', '\.\.\/modules\/book\/routes'\),\n)/,
    `$1${insertion}`,
  )
  writeFileSync(routeTreePath, updated)
}

const queryKeysPath = join(root, 'src/core/constants/queryKeys.ts')
const queryKeys = readFileSync(queryKeysPath, 'utf8')

if (!queryKeys.includes(`${plural}:`)) {
  const block = `
  ${plural}: ['${plural}'] as const,
  ${plural}List: (params?: Record<string, unknown>) =>
    ['${plural}', 'list', params] as const,
  ${plural}Infinite: (params?: Record<string, unknown>) =>
    ['${plural}', 'infinite', params] as const,
  ${moduleName}: (id: number) => ['${plural}', id] as const,`

  writeFileSync(
    queryKeysPath,
    queryKeys.replace(/(\n} as const\n)/, `${block}\n$1`),
  )
}

const headerPath = join(root, 'src/modules/app/components/layout/CtHeader.tsx')
const header = readFileSync(headerPath, 'utf8')

if (!header.includes(`to: '/${plural}'`)) {
  writeFileSync(
    headerPath,
    header.replace(
      /(const navItems = \[\n)/,
      `$1  { to: '/${plural}' as const, label: '${pascalPlural}' },\n`,
    ),
  )
}

console.log(`Created module: src/modules/${moduleName}`)
console.log('Updated routeTree.config.ts, queryKeys.ts, and CtHeader navigation.')
