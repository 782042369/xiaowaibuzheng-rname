import { translate } from 'bing-translate-api'
import { camelCase } from 'es-toolkit'
import fs from 'node:fs'
import path from 'node:path'

import type { ModeType } from '../constants'

import { CONFIG } from '../constants'

/**
 * 将中文文本翻译为英文
 * @param text - 要翻译的文本
 * @returns 翻译后的文本（驼峰命名）
 */
async function convertFilename(text: string): Promise<string> {
  // 检测是否包含中文字符
  const hasChinese = /[\u4E00-\u9FFF]/.test(text)

  if (!hasChinese)
    return text // 无中文直接返回原名

  try {
    const result = await translate(text, null, 'en')

    if (result?.translation) {
      return camelCase(result.translation)
    }
    return text // 翻译失败返回原文
  }
  catch (error: any) {
    console.error(`翻译失败: ${text} - ${error.message}`)
    return text
  }
}

/**
 * 生成唯一的文件路径，如果文件已存在则添加数字后缀
 * @param dir - 目录路径
 * @param base - 文件基础名
 * @param ext - 文件扩展名
 * @returns 唯一的文件路径
 */
function getUniquePath(dir: string, base: string, ext: string) {
  let count = 0
  let newPath = path.join(dir, base + ext)

  while (CONFIG.skipExisting && fs.existsSync(newPath)) {
    newPath = path.join(dir, `${base}-${++count}${ext}`)
  }
  return newPath
}

/**
 * 处理目录中的所有文件
 * @param directory - 要处理的目录
 * @param mode - 转换模式
 */
export async function processFiles(directory: string, mode: ModeType) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })

  for (const dirent of entries) {
    if (!dirent.isFile())
      continue

    const oldName = dirent.name
    const parsed = path.parse(oldName)

    try {
      // 转换文件名主体（去掉@2x后缀后再转换）
      const newBase = await convertFilename(parsed.name.replaceAll('@2x', ''))
      const newPath = getUniquePath(directory, newBase, parsed.ext)
      const newName = path.basename(newPath)

      // 执行重命名操作
      if (newName !== oldName) {
        fs.renameSync(path.join(directory, oldName), newPath)
        console.log(`✅ ${mode.toUpperCase()}: ${oldName.padEnd(30)} → ${newName}`)
      }
      else {
        console.log(`⏩ 跳过: ${oldName} (无需修改)`)
      }

      // 添加延迟以避免API调用过于频繁
      await new Promise(resolve => setTimeout(resolve, CONFIG.delay))
    }
    catch (error: any) {
      console.error(`❌ 失败: ${oldName} - ${error.message}`)
    }
  }
}
