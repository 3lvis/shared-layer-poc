/**
 * @format
 */
const React = require('react')
const {AppRegistry} = require('react-native')
const { SafeAreaProvider } = require('react-native-safe-area-context')
const App = require('./App').default
const {name: appName} = require('./app.json')

AppRegistry.registerComponent(appName, () => function Root() {
  return React.createElement(
    SafeAreaProvider,
    null,
    React.createElement(App, null)
  )
})
