import { describe, expect, it, vi } from 'vitest'
vi.mock('react-syntax-highlighter', () => ({
  Prism: () => null,
}))
vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneLight: {},
}))
import {
  ChatPanel,
  SourceSelectionController,
  SourcesPanel,
  StudioPanel,
  WorkspaceHeader,
} from '../index'

const isReactComponent = (value: unknown) =>
  typeof value === 'function' || (typeof value === 'object' && value !== null)

describe('notebook workspace entry exports', () => {
  it('exposes panel and layout components from unified entry', () => {
    // memo()/forwardRef 组件的 typeof 为 object，普通函数组件为 function
    expect(isReactComponent(ChatPanel)).toBe(true)
    expect(isReactComponent(SourcesPanel)).toBe(true)
    expect(isReactComponent(SourceSelectionController)).toBe(true)
    expect(isReactComponent(StudioPanel)).toBe(true)
    expect(isReactComponent(WorkspaceHeader)).toBe(true)
  })
})
