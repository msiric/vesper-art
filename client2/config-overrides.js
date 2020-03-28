// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const path = require('path')
const {
  override,
  fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy,
  addWebpackPlugin,
} = require('customize-cra')

const AntDesignThemePlugin = require('antd-theme-webpack-plugin')
const AntDesignThemePluginVariablesToChange = require('./src/components/kit-vendors/antd/themes/variablesToChange.js')
const AntDesignThemePluginOptions = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src/components/kit-vendors/antd/themes'),
  varFile: path.join(__dirname, './src/components/kit-vendors/antd/themes/variables.less'),
  mainLessFile: path.join(__dirname, './src/components/kit-vendors/antd/themes/main.less'),
  themeVariables: AntDesignThemePluginVariablesToChange,
  indexFileName: false,
  generateOnce: false // generate color.less on each compilation
}

module.exports = override(
  addDecoratorsLegacy(),
  useEslintRc(),
  fixBabelImports('import', {
    libraryName: 'antd', libraryDirectory: 'es', style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
  }),
  addWebpackPlugin(new AntDesignThemePlugin(AntDesignThemePluginOptions)),
)