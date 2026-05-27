# 生产 Mock 禁用政策

> Authority: D21, D23  
> 更新日期: 2026-05-27

---

## 一、政策声明

**生产环境（`NODE_ENV=production`）下，所有 Mock Provider / Mock Payment / Mock Storage 必须默认关闭。** 任何启用 Mock 的尝试必须导致：

1. 应用启动失败（环境校验阶段）
2. 触发立即告警（如已启动）
3. 拒绝服务请求并返回 500

## 二、禁用的 Mock 列表

| Mock 名称 | 控制变量 | 生产值 | 检测点 |
|-----------|---------|--------|--------|
| Mock LLM Provider | `FEATURE_MOCK_AI` | `false` | env 校验 + Adapter 检查 |
| Mock Payment | `FEATURE_MOCK_PAYMENT` | `false` | env 校验 + Service 检查 |
| Mock ASR Provider | `ASR_PROVIDER` | 非 `mock` | Factory 检查 |
| Mock OCR Provider | `OCR_PROVIDER` | 非 `mock` | Factory 检查 |
| Mock Storage | `STORAGE_PROVIDER` | 非 `mock` | Factory 检查 |
| 自动发布功能 | `FEATURE_AUTO_PUBLISH` | `false`（永久） | 永久禁止 |

## 三、双层防护

### 第一层：启动时校验

`server/_core/envValidation.ts`（参考 `env_var_validation.md`）

### 第二层：运行时检查

每个 Mock Adapter 在调用时检查：

```ts
async call(request) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("MockProvider cannot be used in production");
  }
  // ...
}
```

## 四、当前实现状态

| 防护层 | 当前状态 |
|--------|----------|
| 启动校验 | ⚠️ 需补充（建议下个 PR 实施） |
| Adapter 运行时检查 | ✅ 已实现（packages/shared/src/guards/rbac.ts: validateProductionEnvironment） |
| Mock Payment 检测 | ⚠️ 仅常量，需补充运行时检查 |

## 五、违规处理

| 违规情况 | 处理 |
|---------|------|
| 生产偶发 Mock 调用 | 立即关闭流量 → 启动校验更新 → 紧急修复 |
| 故意绕过 Mock 隔离 | 走 incident review → 取消相关 Agent 权限 |
| 测试 Mock 误入生产 | 立即回滚 → 数据修复（如积分误发） |

## 六、不在禁用之列的"Mock"

以下不算违规：

- **测试用 Mock**（vitest 中的 mock 函数）
- **类型定义中的 placeholder**（TypeScript types）
- **文档示例**（带 `<placeholder>` 标记）

## 七、审计要求

每次部署前，CI 必须：

1. 扫描代码：无硬编码 mock URL
2. 扫描配置：生产环境变量符合规范
3. 扫描日志：上次部署后无 `is_mock=true` 的生产调用

---
