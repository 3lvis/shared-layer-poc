import { createRequire } from 'node:module'

// Factory to create a plugin that resolves React/ReactDOM from the web workspace,
// ensuring a single React instance across the monorepo.
export function aliasReactSingletonPlugin(root) {
  const require = createRequire(import.meta.url)
  const resolveFromWeb = (id) => require.resolve(id, { paths: [root] })
  return {
    name: 'alias-react-singleton',
    setup(build) {
      build.onResolve({ filter: /^react$/ }, () => ({ path: resolveFromWeb('react') }))
      build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: resolveFromWeb('react/jsx-runtime') }))
      build.onResolve({ filter: /^react\/jsx-dev-runtime$/ }, () => ({ path: resolveFromWeb('react/jsx-dev-runtime') }))
      build.onResolve({ filter: /^react-dom$/ }, () => ({ path: resolveFromWeb('react-dom') }))
      build.onResolve({ filter: /^react-dom\/client$/ }, () => ({ path: resolveFromWeb('react-dom/client') }))
    }
  }
}

