import path from 'node:path'

import type { ModeType } from './constants'

import { MODE } from './constants'
import { processFiles } from './utils'

/**
 * 主程序入口
 * 支持通过命令行参数指定目录
 *
 * 命令行参数:
 * - `[directory]`: 指定要处理的目录，默认为当前目录 './'
 */
(async () => {
  // 解析命令行参数
  const args = process.argv.slice(2)
  const targetDir = args.find(arg => !arg.startsWith('-')) || './'

  // 设置默认模式为英文翻译
  const mode: ModeType = MODE.ENGLISH

  try {
    console.log(`🟢 开始处理目录: ${path.resolve(targetDir)}`)
    console.log(`🔄 使用模式: ${mode.toUpperCase()}`)

    await processFiles(targetDir, mode)

    console.log('✅ 所有文件处理完成')
  }
  catch (error: any) {
    console.error(`🔴 程序异常: ${error.message}`)
    process.exit(1)
  }
})()
