// 配置参数
export const CONFIG = {
  delay: 800, // API调用延迟(毫秒)
  maxRetries: 2, // 最大重试次数
  skipExisting: true, // 跳过已存在的文件名
} as const

// 模式枚举
export const MODE = {
  ENGLISH: 'english',
} as const

export type ModeType = typeof MODE[keyof typeof MODE]
