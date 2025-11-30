// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// onnx 파일을 asset으로 인식하게 추가
config.resolver.assetExts.push('onnx');

module.exports = config;