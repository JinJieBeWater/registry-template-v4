'use client'

import * as React from 'react'
import { Button } from '../../ui/button'
import { Card } from '../../ui/card'
import { PointerHint } from '../../ui/pointer-hint'

export function PointerHintDemo() {
  const [activeHint, setActiveHint] = React.useState<{
    type: 'default' | 'success' | 'error' | 'warning'
    message: string
  } | null>(null)

  const [hideOnClickable, setHideOnClickable] = React.useState(false)
  const [size, setSize] = React.useState(30)

  return (
    <Card
      className="p-6 space-y-8"
      id="demo-area">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Pointer Hint 演示</h2>
        <p className="text-muted-foreground">一个轻量级的鼠标跟随提示组件，用于显示即时反馈。</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hideOnClickable}
              onChange={e => setHideOnClickable(e.target.checked)}
            />
            在可点击元素上隐藏
          </label>
          <div className="flex items-center gap-2">
            <span>光标大小：</span>
            <input
              type="range"
              min="20"
              max="60"
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-24"
            />
            <span>{size}px</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setActiveHint({ type: 'default', message: '这是默认提示' })}
            onMouseLeave={() => setActiveHint(null)}>
            默认提示
          </Button>

          <Button
            onClick={() => setActiveHint({ type: 'success', message: '操作成功！' })}
            onMouseLeave={() => setActiveHint(null)}
            className="bg-green-500 hover:bg-green-600">
            成功提示
          </Button>

          <Button
            onClick={() => setActiveHint({ type: 'error', message: '出错了！' })}
            onMouseLeave={() => setActiveHint(null)}
            className="bg-red-500 hover:bg-red-600">
            错误提示
          </Button>

          <Button
            onClick={() => setActiveHint({ type: 'warning', message: '请注意！' })}
            onMouseLeave={() => setActiveHint(null)}
            className="bg-yellow-500 hover:bg-yellow-600">
            警告提示
          </Button>
        </div>
      </div>

      <PointerHint
        // trackId="demo-area"
        variant={activeHint?.type}
        hideOnClickable={hideOnClickable}
        size={size}>
        {activeHint?.message}
      </PointerHint>
    </Card>
  )
}
