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
  try {
    const result = await translate(text, null, 'en')
    return result?.translation ? camelCase(result.translation) : text
  }
  catch {
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
  let newPath = path.join(dir, base + ext)
  if (!CONFIG.skipExisting || !fs.existsSync(newPath))
    return newPath

  let count = 1
  while (fs.existsSync(newPath)) {
    newPath = path.join(dir, `${base}-${count++}${ext}`)
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
      // 检测是否包含中文字符
      const hasChinese = /[\u4E00-\u9FFF]/.test(parsed.name)

      // 如果没有中文且不包含@2x，则跳过
      if (!hasChinese && !parsed.name.includes('@2x'))
        continue

      // 处理文件名（移除@2x）
      const nameWithoutAt2x = parsed.name.replaceAll('@2x', '')
      const newBase = hasChinese
        ? await convertFilename(nameWithoutAt2x)
        : camelCase(nameWithoutAt2x)

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

      // 添加延迟以避免API调用过于频繁（仅在需要翻译时）
      if (hasChinese) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.delay))
      }
    }
    catch (error: any) {
      console.error(`❌ 失败: ${oldName} - ${error.message || error}`)
    }
  }
}
