# Prompt 变更政策

> Authority: D10, D12, D23

---

## 触发条件

Prompt 变更包括：模板文本修改、变量增减、输出 Schema 变更、版本发布。

## 必须执行

| 步骤 | 说明 | 阻塞发布 |
|------|------|----------|
| 1. 创建新 PromptVersion（draft） | 不影响生产 | 否 |
| 2. 运行 D12 Benchmark Suite | SMOKE + REGRESSION + 对应 Prompt 专项 | 是 |
| 3. 对比质量指标 | 新版 ≥ 旧版（或在可接受范围内） | 是 |
| 4. 运行红队样本 | 确认风控不退化 | 是 |
| 5. 记录成本变化 | 新 Prompt 的 token 消耗对比 | 否 |
| 6. PR Review + Benchmark 截图 | 证据化 | 是 |
| 7. 灰度发布（10% → 50% → 100%） | 观察线上质量 | 是 |
| 8. 回滚预案 | 切回上一个 active 版本 | 是 |

## PR 模板

```markdown
## Prompt 变更 PR

### 变更 Prompt
- ID: P0X_XXX
- 旧版本: v__
- 新版本: v__

### 变更原因
<!-- 为什么需要修改 -->

### 变更内容
<!-- diff 或描述 -->

### Benchmark 结果
| 指标 | 旧版 | 新版 | 变化 |
|------|------|------|------|
| Schema 合法率 | | | |
| 质量评分 | | | |
| 红队拦截率 | | | |
| Token 消耗 | | | |
| 延迟 | | | |

### 成本影响
<!-- 预估成本变化 -->

### 回滚方式
将 PromptVersion status 切回上一个 active 版本。
```

## 禁止

- 不得直接修改 active 版本的 prompt_text
- 不得跳过 Benchmark 直接发布
- 不得在业务代码中硬编码 Prompt 文本

---
