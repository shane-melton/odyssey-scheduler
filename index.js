require('ts-node/register');
const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require('tsconfig-paths/register');

// const baseUrl = "./";
//
// tsConfigPaths.register({
//   baseUrl: baseUrl,
//   paths: tsConfig.compilerOptions.paths
// });

require('./src/server/main');
