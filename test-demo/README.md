# 测试用例演示

这个目录包含了各种类型的文件名，用于演示 `@xiaowaibuzheng/rname` 工具的处理效果。

## 文件类型示例

### 1. 纯中文文件名
- [ ] 我的文档.txt → 待处理为: myDocument.txt
- [ ] 产品介绍.pdf → 待处理为: productIntroduction.pdf

### 2. 中文+@2x 文件名
- [ ] 图片素材@2x.png → 待处理为: imageMaterial.png
- [ ] 背景图@2x.jpg → 待处理为: backgroundImage.jpg

### 3. 纯英文文件名（不需要处理）
- [ ] document.txt → 保持不变
- [ ] readme.md → 保持不变

### 4. 纯英文+@2x 文件名
- [ ] background_image@2x.png → 待处理为: backgroundImage.png
- [ ] icon_sprite@2x.svg → 待处理为: iconSprite.svg

## 使用方法

```bash
# 在项目根目录执行
npx @xiaowaibuzheng/rname ./test-demo
```

或者全局安装后执行：

```bash
rname ./test-demo
```

## 预期结果

执行完成后，上述标记为"待处理"的文件应该被重命名为对应的目标文件名，而标记为"保持不变"的文件应该不会被修改。