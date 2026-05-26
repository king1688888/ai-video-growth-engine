# AI 短视频爆款增长引擎

> AI-Powered Short Video Growth Engine

## 项目定位

本项目是 **AI 短视频爆款增长引擎**，核心能力为：

- **视频拆解**：对标账号爆款视频的结构化拆解与分析
- **原创脚本生成**：基于拆解结果，AI 生成原创短视频脚本

本项目**不是**搬运、克隆、洗稿、仿脸、仿声工具。

## 当前阶段

**MVP1：视频拆解 + 原创脚本生成**

## 项目结构

```
ai-video-growth-engine/
├── docs/
│   ├── product/          # D00-D24 产品文档体系
│   ├── source/           # 原始方案文档
│   └── setup/            # 仓库配置与审计文档
├── .github/
│   └── workflows/        # CI/CD 工作流
├── .gitignore
└── README.md
```

## 文档体系

| 文档 | 说明 |
|------|------|
| D00 | 项目根上下文和单一事实源 |
| D01-D15 | 产品功能与设计文档 |
| D16 | 数据库/API 最高工程契约 |
| D17 | 异步任务、状态机、文件资产生命周期契约 |
| D18 | 前端工程文档 |
| D19 | 商业化、积分、订单、成本结算契约 |
| D20 | 测试、验收、发布、监控、告警门禁 |
| D21 | 合规、授权、AIGC 标识、内容审核底线 |
| D22 | 部署与运维文档 |
| D23 | AIcoding Agent 行为规范 |
| D24 | 最终验收、交接、上线决策总控 |

## 开发规范

### 分支策略

- `main`：受保护的生产分支，禁止直接 push
- `feature/*`：功能开发分支
- `fix/*`：修复分支
- `refactor/*`：重构分支
- `setup/*`：配置与基础设施分支

### 工作流程

```
feature/xxx → PR → CI 检查 → Review → Merge → main
```

### 禁止事项

1. 不得直接修改 main 分支
2. 不得写死 API Key、密钥、账号密码
3. 不得用 mock 冒充真实能力（必须 mock 时需标记 `is_mock=true`）
4. 不得跳过数据库、API、测试、合规等环节

## 技术栈（规划）

- 后端：Python / FastAPI
- 数据库：MySQL / TiDB
- 任务队列：Celery / Redis
- AI：OpenAI API / 多模型适配
- 前端：React + TypeScript + TailwindCSS

## License

Private - All Rights Reserved

---

*本项目由 AI 辅助开发，遵循 D23 AIcoding Agent 行为规范。*
