// Adapted from here: https://github.com/dividab/tsconfig-paths#bootstrapping-with-explicit-params
// This allows node to find the @core/ path when the server is ran in production

const tsConfigPaths = require("tsconfig-paths");

tsConfigPaths.register({
  baseUrl: './',
  paths: {
    "@core/*": ["./build/core/src/*"],
    "@server/*": ["./build/server/src/*"],
  },
});
