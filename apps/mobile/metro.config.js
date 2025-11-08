const path = require('node:path')
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')
const baseConfig = getDefaultConfig(projectRoot)

module.exports = mergeConfig(baseConfig, {
  resolver: {
    unstable_enableSymlinks: true,
    // Keep resolution predictable within the monorepo
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules')
    ],
    // Avoid picking up nested node_modules from packages (prevents duplicate React)
    disableHierarchicalLookup: true,
    // Optional: pin key modules to workspace root
    extraNodeModules: {
      // Ensure single copies resolved from workspace root
      react: path.resolve(workspaceRoot, 'node_modules/react'),
      'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
      '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime')
    },
    // Guard against accidentally resolving nested copies from packages
    blockList: [
      new RegExp(`[\\\\/]packages[\\\\/][^\\\\/]+[\\\\/]node_modules[\\\\/]react([\\\\/].*)?$`),
      new RegExp(`[\\\\/]packages[\\\\/][^\\\\/]+[\\\\/]node_modules[\\\\/]react-native([\\\\/].*)?$`),
    ]
  },
  watchFolders: [
    workspaceRoot,
    path.resolve(workspaceRoot, 'packages/shared')
  ]
})
