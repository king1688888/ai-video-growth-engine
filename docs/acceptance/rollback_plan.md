# 回滚方案（Rollback Plan）

> Authority: D20 (Release Gate)  
> 日期: 2026-05-26

---

## 回滚触发条件

| # | 条件 | 严重度 | 自动/手动 |
|---|------|--------|----------|
| 1 | 积分重复扣费 | Critical | 手动 |
| 2 | 用户数据泄露 | Critical | 立即手动 |
| 3 | 风控完全失效 | Critical | 手动 |
| 4 | 数据库迁移失败 | High | 自动回滚迁移 |
| 5 | 主流程成功率 < 50% | High | 手动 |
| 6 | API 服务不可用 > 5min | High | 自动重启/手动回滚 |
| 7 | 模型供应商全部不可用 | Medium | 降级到 Mock（仅内测） |

## 回滚步骤

### 应用回滚

```bash
# 1. 回退到上一个稳定版本
git revert HEAD --no-edit
git push origin main

# 2. 或回退到指定 commit
git reset --hard <last-stable-commit>
git push origin main --force  # 需要临时关闭 enforce_admins

# 3. 部署平台自动部署回退版本
# Railway/Render: 选择上一个成功部署
# Vercel: Instant Rollback 功能
```

### 数据库回滚

```bash
# Prisma 迁移回退
cd packages/database
npx prisma migrate reset --force  # 开发环境
# 或
npx prisma migrate resolve --rolled-back <migration_name>  # 生产环境
```

### 积分紧急修复

```bash
# 如果发生重复扣费：
# 1. 暂停任务创建（Feature Flag）
# 2. 运行对账脚本
# 3. 批量补偿受影响用户
# 4. 修复根因后恢复
```

### 风控紧急措施

```bash
# 如果风控失效：
# 1. 立即关闭导出功能（Feature Flag）
# 2. 隔离已导出的高风险内容
# 3. 通知受影响用户
# 4. 修复后逐步恢复
```

## 回滚验证

回滚后必须验证：
1. `/api/v1/health` 返回 200
2. 数据库连接正常
3. Redis 连接正常
4. 积分余额一致
5. 无新的错误日志

---

*本方案为 MVP1 回滚预案。正式生产前需要演练验证。*
