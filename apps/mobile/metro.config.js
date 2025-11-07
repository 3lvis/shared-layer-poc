const path = require('node:path')
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')
const baseConfig = getDefaultConfig(projectRoot)

module.exports = mergeConfig(baseConfig, {
  resolver: {
    unstable_enableSymlinks: true,
    // Ensure a single React copy is resolved from the workspace root
    extraNodeModules: {
      '@babel/runtime': path.resolve(workspaceRoot, 'node_modules/@babel/runtime'),
      'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
      'react': path.resolve(workspaceRoot, 'node_modules/react'),
    },
    // Avoid picking up nested node_modules from packages (prevents duplicate React)
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules')
    ],
  },
  watchFolders: [
    workspaceRoot,
    path.resolve(workspaceRoot, 'packages/shared')
  ]
})
