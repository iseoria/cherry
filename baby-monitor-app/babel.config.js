// baby-monitor-app/babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // 당분간 플러그인 아무것도 안 씀
    plugins: [],
  };
};
