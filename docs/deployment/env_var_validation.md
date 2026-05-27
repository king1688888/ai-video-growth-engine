# 环境变量校验

> 更新日期: 2026-05-27

---

## 一、启动时强制校验

应用启动时（`server/_core/env.ts`）应校验以下环境变量。缺失或不合规则启动失败。

### 必需变量（缺失则启动失败）

| 变量 | 校验规则 |
|------|----------|
| `DATABASE_URL` | 非空，符合 mysql://user:pass@host:port/db |
| `JWT_SECRET` | 非空，长度 ≥ 32 字符 |
| `VITE_APP_ID` | 非空 |
| `OAUTH_SERVER_URL` | 非空，符合 https:// |
| `BUILT_IN_FORGE_API_KEY` | 非空 |

### 推荐变量（缺失则警告）

| 变量 | 警告条件 |
|------|----------|
| `REDIS_URL` | 缺失时记录 warning |
| `SENTRY_DSN` | production 缺失时记录 warning |

## 二、生产环境额外校验

`NODE_ENV=production` 时额外检查：

| 检查 | 失败动作 |
|------|----------|
| `FEATURE_MOCK_AI === "false"` | 启动失败 |
| `FEATURE_MOCK_PAYMENT === "false"` | 启动失败 |
| `FEATURE_AUTO_PUBLISH === "false"` | 启动失败 |
| `JWT_SECRET !== "dev-jwt-secret-change-in-production"` | 启动失败 |
| `OPENAI_API_KEY` 不以 "sk-placeholder" 开头 | 启动失败 |
| `DATABASE_URL` 不包含 "postgres_dev_password" 等开发字符串 | 启动失败 |

## 三、校验代码建议位置

```ts
// server/_core/envValidation.ts（建议新增）

export function validateProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const errors: string[] = [];

  // Mock 必须关闭
  if (process.env.FEATURE_MOCK_AI === "true") {
    errors.push("FEATURE_MOCK_AI=true is forbidden in production");
  }
  if (process.env.FEATURE_MOCK_PAYMENT === "true") {
    errors.push("FEATURE_MOCK_PAYMENT=true is forbidden in production");
  }
  if (process.env.FEATURE_AUTO_PUBLISH === "true") {
    errors.push("FEATURE_AUTO_PUBLISH=true is forbidden");
  }

  // 默认密钥必须替换
  if (process.env.JWT_SECRET === "dev-jwt-secret-change-in-production") {
    errors.push("JWT_SECRET must be changed in production");
  }
  if (process.env.OPENAI_API_KEY?.startsWith("sk-placeholder")) {
    errors.push("OPENAI_API_KEY is still placeholder in production");
  }
  if (process.env.DATABASE_URL?.includes("postgres_dev_password")) {
    errors.push("DATABASE_URL contains dev password in production");
  }

  if (errors.length > 0) {
    console.error("\n[FATAL] Production environment validation failed:");
    errors.forEach((e) => console.error("  - " + e));
    process.exit(1);
  }
}
```

## 四、.env.example 维护规则

1. **绝不放真实值**：所有 secret 字段使用 placeholder（如 `sk-placeholder-xxx`）
2. **注释清晰**：每个变量上方有 `# Purpose: xxx` 注释
3. **分组排序**：按 Database / Cache / Storage / AI / Auth / Payment / Monitoring 分组
4. **同步更新**：新增环境变量必须同步更新 .env.example

## 五、CI 中校验

GitHub Actions 中应有任务校验：

```yaml
- name: Validate .env.example
  run: |
    # 检查不包含真实密钥模式
    if grep -E "sk-[a-zA-Z0-9]{20,}" .env.example; then
      echo "FAIL: .env.example contains potential real key"
      exit 1
    fi
    # 检查所有必需变量都存在
    for var in DATABASE_URL JWT_SECRET REDIS_URL; do
      if ! grep -q "^$var=" .env.example; then
        echo "FAIL: $var missing in .env.example"
        exit 1
      fi
    done
```

---
