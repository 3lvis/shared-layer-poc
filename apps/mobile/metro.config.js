const path = require('node:path')
const fs = require('node:fs')
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')
const baseConfig = getDefaultConfig(projectRoot)

function collectBunNodeModules(workspaceRoot) {
  try {
    const bunRoot = path.join(workspaceRoot, 'node_modules', '.bun')
    if (!fs.existsSync(bunRoot)) return []
    const entries = fs
      .readdirSync(bunRoot)
      .filter(name => {
        try {
          return fs.statSync(path.join(bunRoot, name)).isDirectory()
        } catch {
          return false
        }
      })
    const results = []
    // Prefer react-native inner node_modules first (0.82 if present)
    let rn = entries.find(n => n.startsWith('react-native@0.82')) || entries.find(n => n.startsWith('react-native@'))
    if (rn) {
      const rnNM = path.join(bunRoot, rn, 'node_modules')
      if (fs.existsSync(rnNM)) results.push(rnNM)
    }
    for (const name of entries) {
      const nm = path.join(bunRoot, name, 'node_modules')
      if (fs.existsSync(nm)) results.push(nm)
    }
    // Dedupe
    return Array.from(new Set(results))
  } catch {
    return []
  }
}

module.exports = mergeConfig(baseConfig, {
  resolver: {
    unstable_enableSymlinks: true,
    // Ensure a single React copy is resolved from the workspace root
    extraNodeModules: {
      '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime'),
      'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
      // Always resolve React from the workspace root to avoid duplicates
      react: path.resolve(workspaceRoot, 'node_modules/react'),
    },
    // Avoid picking up nested node_modules from packages (prevents duplicate React)
    disableHierarchicalLookup: true,
    nodeModulesPaths: (() => {
      const paths = [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
      ]
      const bunPaths = collectBunNodeModules(workspaceRoot)
      if (bunPaths.length) paths.push(...bunPaths)
      return paths
    })(),
    // Avoid resolving nested React copies from package-level node_modules (cross-platform)
    blockList: [
      new RegExp(`[\\\\/]packages[\\\\/][^\\\\/]+[\\\\/]node_modules[\\\\/]react([\\\\/].*)?$`),
      new RegExp(`[\\\\/]packages[\\\\/][^\\\\/]+[\\\\/]node_modules[\\\\/]react-native([\\\\/].*)?$`),
    ],
  },
  watchFolders: [
    workspaceRoot,
    path.resolve(workspaceRoot, 'packages/shared')
  ]
})
