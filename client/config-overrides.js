const {
  removeModuleScopePlugin,
  override,
  babelInclude,
  addWebpackAlias,
} = require("customize-cra");
const path = require("path");
const baseConfig = require("./base-tsconfig.json");

const { paths } = baseConfig.compilerOptions;

const removePathSuffix = (path) => path.split("/*")[0];

module.exports = override(
  removeModuleScopePlugin(),
  babelInclude([path.resolve("src"), path.resolve("../common")]),
  addWebpackAlias(
    Object.keys(paths).reduce(
      (obj, item) => ({
        ...obj,
        [removePathSuffix(item)]: `${path.resolve(
          __dirname,
          removePathSuffix(paths[item][0])
        )}`,
      }),
      {}
    )
  )
);
