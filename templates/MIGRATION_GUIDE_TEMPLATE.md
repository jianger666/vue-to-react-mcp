# Vue to React 迁移指南

本文档记录了在 Vue 到 React 迁移过程中的最佳实践和注意事项。

## 迁移原则

1. **组件结构**: 保持组件的单一职责原则
2. **状态管理**: 合理使用 React Hooks 替代 Vue 的响应式数据
3. **生命周期**: 正确映射 Vue 生命周期到 React 的 useEffect
4. **样式处理**: 优先使用 CSS Modules 或 styled-components

## 组件迁移映射

### 模板语法
- `v-if` → 条件渲染表达式
- `v-for` → `map` 函数
- `v-model` → 受控组件
- `@click` → `onClick`

### 生命周期映射
- `created` → `useEffect(() => {}, [])`
- `mounted` → `useEffect(() => {}, [])`
- `updated` → `useEffect(() => {})`
- `destroyed` → `useEffect(() => { return () => {} }, [])`

### 计算属性和侦听器
- `computed` → `useMemo`
- `watch` → `useEffect` with dependencies

## 路由迁移

### Vue Router → React Router
- 路由配置从对象形式改为组件形式
- 导航守卫改为高阶组件或自定义 Hook

## 状态管理

### Vuex → Redux/Context
- `mutations` → `reducers`
- `actions` → `async actions`
- `getters` → `selectors`

## 最佳实践

1. **保持组件纯净**: 避免在组件内部直接修改 props
2. **合理拆分组件**: 将大组件拆分为更小的可复用组件
3. **类型安全**: 使用 TypeScript 提供类型支持
4. **性能优化**: 使用 React.memo 和 useMemo 优化性能

---

*此文档会随着迁移经验的积累不断更新* 