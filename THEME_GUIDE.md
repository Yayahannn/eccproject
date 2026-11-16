# shadcn 主题化规范

> ⚠️ **禁止硬编码**：所有样式必须使用主题变量，修改 `src/index.css` 即可全局调整风格。

## 快速对照表

| ❌ 禁止 | ✅ 正确 | 说明 |
|--------|---------|------|
| `#ffffff` / `rgb()` | `bg-background` / `var(--background)` | 颜色变量 |
| `bg-red-500` / `text-green-500` | `bg-destructive` / `text-primary` | 语义化颜色 |
| `rounded-[8px]` | `rounded-lg` / `rounded-xl` | 圆角变量 |
| `style={{ color: '#000' }}` | `style={{ color: 'var(--foreground)' }}` | CSS 变量 |

## 可用变量

### 颜色
```
background, foreground           # 背景/前景
primary, primary-foreground      # 主色
secondary, secondary-foreground  # 次要色
muted, muted-foreground          # 柔和色
accent, accent-foreground        # 强调色
destructive, destructive-foreground  # 错误/删除
border, input, ring              # 边框/焦点
chart-1 ~ chart-5                # 图表色
```

### 圆角（基于 `--radius`）
```
rounded-sm, rounded-md, rounded-lg
rounded-xl, rounded-2xl, rounded-3xl, rounded-4xl
```

### 字体
```
font-sans, font-heading
```

## 常见模式

### 状态颜色映射
```tsx
// ✅ 正确
const statusStyles = {
  online: 'text-primary',
  offline: 'text-muted-foreground',
  error: 'text-destructive',
}

// ❌ 错误
const statusStyles = {
  online: 'text-green-500',
  offline: 'text-gray-500',
  error: 'text-red-500',
}
```

### 卡片样式
```tsx
// ✅ 正确
<div className="bg-card border border-border rounded-lg p-4">
  <h3 className="text-muted-foreground text-sm">标题</h3>
  <p className="text-foreground text-2xl">内容</p>
</div>

// ❌ 错误
<div style={{ backgroundColor: '#fff', borderRadius: '8px' }}>
  <h3 style={{ color: '#64748b' }}>标题</h3>
</div>
```

## 验证

完成后运行：
```bash
npm run check:styles
```

---

> 💡 记住：改一个 CSS 变量，全站样式跟着变。不要破坏这个能力。
