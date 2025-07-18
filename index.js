const fs = require('fs');
const path = require('path');
const { pinyin } = require('pinyin-pro');
const { translate } = require('bing-translate-api');
const camelCase = require('lodash.camelcase');

// 配置参数
const CONFIG = {
  delay: 800,           // API调用延迟(毫秒)
  maxRetries: 2,        // 最大重试次数
  skipExisting: true,   // 跳过已存在的文件名
};

// 模式枚举
const MODE = {
  PINYIN: 'pinyin',
  ENGLISH: 'english'
};

// 核心转换函数
async function convertFilename(text, mode) {
  // 检测是否包含中文字符
  const hasChinese = /[\u4e00-\u9fff]/.test(text);

  if (!hasChinese) return text; // 无中文直接返回

  if (mode === MODE.PINYIN) {
    // 拼音转换模式
    return text.split('').map(char =>
      /[\u4e00-\u9fff]/.test(char)
        ? pinyin(char, { toneType: 'none' })
        : char
    ).join('');
  } else {
    // 英文翻译模式
    try {
      const result = await translate(text, null, 'en');

      if (result?.translation) {
        let translated = camelCase(result.translation);


        return translated;
      }
      return text; // 翻译失败返回原文
    } catch (error) {
      console.error(`翻译失败: ${text} - ${error.message}`);
      return text;
    }
  }
}

// 生成唯一文件名
function getUniquePath(dir, base, ext) {
  let count = 0;
  let newPath = path.join(dir, base + ext);

  while (CONFIG.skipExisting && fs.existsSync(newPath)) {
    newPath = path.join(dir, `${base}-${++count}${ext}`);
  }
  return newPath;
}

// 主处理函数
async function processFiles(directory, mode) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const dirent of entries) {
    if (!dirent.isFile()) continue;

    const oldName = dirent.name;
    const parsed = path.parse(oldName);

    try {
      // 转换文件名主体
      const newBase = await convertFilename(parsed.name.replaceAll('@2x', ''), mode);
      const newPath = getUniquePath(directory, newBase, parsed.ext);
      const newName = path.basename(newPath);

      // 执行重命名
      if (newName !== oldName) {
        fs.renameSync(path.join(directory, oldName), newPath);
        console.log(`✅ ${mode.toUpperCase()}: ${oldName.padEnd(30)} → ${newName}`);
      } else {
        console.log(`⏩ 跳过: ${oldName} (无需修改)`);
      }

      // 延迟防止API限制
      if (mode === MODE.ENGLISH) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.delay));
      }
    } catch (error) {
      console.error(`❌ 失败: ${oldName} - ${error.message}`);
    }
  }
}

// 启动程序
(async () => {
  // 解析命令行参数
  const args = process.argv.slice(2);
  const modeIndex = args.findIndex(arg => arg === '-m' || arg === '--mode');
  const mode = modeIndex !== -1 && args[modeIndex + 1]
    ? args[modeIndex + 1].toLowerCase()
    : MODE.PINYIN;

  const targetDir = args.find(arg => !arg.startsWith('-')) || './';

  // 验证模式
  if (!Object.values(MODE).includes(mode)) {
    console.error(`❌ 错误: 无效模式 "${mode}"，请选择 ${Object.values(MODE).join('/')}`);
    process.exit(1);
  }

  try {
    console.log(`🟢 开始处理目录: ${path.resolve(targetDir)}`);
    console.log(`🔄 使用模式: ${mode.toUpperCase()}`);

    await processFiles(targetDir, mode);

    console.log('✅ 所有文件处理完成');
  } catch (error) {
    console.error(`🔴 程序异常: ${error.message}`);
    process.exit(1);
  }
})();
