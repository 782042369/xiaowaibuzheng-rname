# @xiaowaibuzheng/rname

[![NPM version](https://img.shields.io/npm/v/@xiaowaibuzheng/rname?color=a1b858&label=)](https://www.npmjs.com/package/@xiaowaibuzheng/rname)

一个用于批量重命名包含中文字符的文件的命令行工具，可以将中文文件名翻译为英文并转换为驼峰命名格式。

## 功能特点

- 将包含中文的文件名翻译为英文并转换为驼峰命名格式
- 支持跳过已存在的文件名以避免冲突
- 支持通过 Bing 翻译 API 进行高质量翻译
- 可通过 npx 直接运行，无需全局安装

## 安装

### 作为 CLI 工具全局安装

```bash
npm install -g @xiaowaibuzheng/rname
```

### 使用 npx 直接运行（推荐）

```bash
npx @xiaowaibuzheng/rname [directory]
```

## 使用方法

### 基本用法

```bash
# 将当前目录下的中文文件名翻译为英文
npx @xiaowaibuzheng/rname

# 指定特定目录
npx @xiaowaibuzheng/rname ./images
```

### 参数说明

| 参数          | 说明             | 默认值          |
| ------------- | ---------------- | --------------- |
| `[directory]` | 要处理的目录路径 | 当前目录 (`./`) |

### 示例

假设目录中有以下文件：

```
./我的图片.png
./测试文档.docx
./产品介绍@2x.jpg
```

执行命令：

```bash
npx @xiaowaibuzheng/rname
```

结果可能是：

```
🟢 开始处理目录: /path/to/current/directory
🔄 使用模式: ENGLISH
✅ ENGLISH: 我的图片.png                → myPicture.png
✅ ENGLISH: 测试文档.docx              → testDocument.docx
✅ ENGLISH: 产品介绍@2x.jpg            → productIntroduction.jpg
✅ 所有文件处理完成
```

## 注意事项

1. 由于调用 Bing 翻译 API，会有一定延迟
2. 工具会自动跳过不含中文字符的文件名
3. 如果目标文件名已存在，工具会在新文件名后添加数字后缀以避免覆盖
4. 对于带有 `@2x` 后缀的文件（通常为高清图片），会去除该后缀再进行转换

## 依赖说明

- [bing-translate-api](https://github.com/microsoft/bing-translate-api) - 用于中文翻译为英文
- [es-toolkit](https://github.com/tjx666/adobe-devtools) - 用于字符串处理

## 许可证

[MIT](./LICENSE)
