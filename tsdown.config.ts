import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'], // 指定入口文件
  outDir: 'dist', // 指定输出目录
  format: ['es'], // 生成ESM格式的文件
  dts: true, // 生成类型定义文件（d.ts）
  clean: true, // 打包前清除输出目录
  shims: true, // 添加 commonjs 的垫片以支持 node.js 环境
  banner: {
    js: '#!/usr/bin/env node\n',
  },
})
