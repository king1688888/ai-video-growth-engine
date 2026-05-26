# Owner 签署清单（Owner Signoff Checklist）

> Authority: D24  
> 日期: 2026-05-26  
> 说明: 以下事项需要 Owner 最终确认后方可进入下一阶段。

---

## 技术决策确认

- [ ] **技术栈**: Next.js + NestJS + Prisma + PostgreSQL + BullMQ + Redis + Python Worker + R2
- [ ] **部署方案**: Vercel + Railway + Cloudflare R2
- [ ] **数据库**: PostgreSQL 15+

## 商业化决策确认

- [ ] **积分定价**: 注册赠送 50 积分，单次拆解 8-12 积分
- [ ] **支付方式**: MVP1 内测期手动发放积分（IS_PAYMENT_MOCK=true）
- [ ] **首发行业**: 企业 IP + 本地商家

## 合规决策确认

- [ ] **仓库可见性**: Public → Private（建议改为 Private）
- [ ] **AI 模型供应商**: OpenAI / 通义千问（需确认）
- [ ] **用户协议**: Agent 生成草稿 + Owner/法务确认
- [ ] **隐私政策**: Agent 生成草稿 + Owner/法务确认

## 发布决策确认

- [ ] **合并所有 PR**: #7, #8, #9, #10, #11, #12
- [ ] **配置真实环境变量**: DB/Redis/S3/AI API Key
- [ ] **执行数据库迁移**: prisma migrate deploy
- [ ] **配置监控告警**: Sentry + Grafana + Uptime
- [ ] **授权进入内测**: 确认可以邀请首批用户

## 风险确认

- [ ] 了解当前 Known Issues（见 final_acceptance_report.md）
- [ ] 了解回滚方案（见 rollback_plan.md）
- [ ] 了解监控告警配置要求（见 release_runbook.md）

---

## 签署

| 角色 | 签署人 | 日期 | 备注 |
|------|--------|------|------|
| 项目 Owner | | | |
| 技术负责人 | Manus Agent | 2026-05-26 | 建议 Conditional Go |

---

**签署后，Manus Agent 将执行：**
1. 合并所有 PR 到 main
2. 配置部署环境
3. 执行数据库迁移
4. 部署到 staging
5. 运行 Smoke Test
6. 邀请首批内测用户

---

*本清单由 Manus Agent 生成。Owner 签署后视为授权进入内测阶段。*
