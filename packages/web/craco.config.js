module.exports = {
  webpack: {
    alias: {
      '@core': '@unnamed/core/src',
      '@server': '@unnamed/server/src',
    },
    configure: cfg => {

      cfg.module.rules.push({
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.json',
        },
      })

      return cfg;
    }
  },
};
