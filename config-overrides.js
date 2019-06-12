const path = require('path');
const fs = require('fs');

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config.module.rules.push({
    test: /\.js$|\.jsx$/,
    enforce: 'post',
    use: {
      loader: 'istanbul-instrumenter-loader',
      options: {
        esModules: true
      }
    },
    include: path.resolve(fs.realpathSync(process.cwd()), 'src')
  });
  return config;
};
