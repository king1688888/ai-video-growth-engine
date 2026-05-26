# API 契约最终计划

> 权威文档：D16  
> 风格：RESTful + JSON，前缀 `/api/v1`  
> 日期：2026-05-26

---

## 技术约定

| 项 | 约定 |
|------|------|
| 版本 | `/api/v1` |
| 鉴权 | Bearer Token (JWT)；后台 Admin RBAC |
| 幂等 | 写操作支持 `Idempotency-Key` Header |
| Trace | 返回 `X-Request-Id`；异步传递 `trace_id` |
| 响应包 | `{ success: boolean, data: T, error: ErrorInfo, meta: Meta }` |
| 分页 | Cursor pagination: `next_cursor` + `limit` |
| 错误码 | `APP_DOMAIN_REASON`，如 `CREDIT_INSUFFICIENT_BALANCE` |
| 时间 | ISO 8601 UTC |
| 文件 URL | 短期签名 URL（默认 1h） |

## P0 API 清单

### Auth（M01）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册 |
| POST | `/auth/login` | 登录 |
| POST | `/auth/refresh` | 刷新 Token |
| POST | `/auth/logout` | 退出 |
| GET | `/auth/me` | 当前用户信息 |

### Profile（M02）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/profiles` | 创建画像 |
| GET | `/profiles/:id` | 获取画像 |
| PATCH | `/profiles/:id` | 更新画像 |

### Consent（M03）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/consents` | 创建授权确认 |
| GET | `/consents/latest` | 获取最新授权状态 |

### Asset（M04）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/assets/upload-url` | 获取上传签名 URL |
| POST | `/assets/confirm` | 确认上传完成 |
| GET | `/assets/:id` | 获取资产信息 |

### Task（M06）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/tasks` | 创建分析任务 |
| GET | `/tasks/:id` | 获取任务状态 |
| GET | `/tasks/:id/progress` | 获取进度详情 |
| POST | `/tasks/:id/cancel` | 取消任务 |
| GET | `/tasks` | 任务列表（分页） |

### Billing（M05）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/billing/balance` | 查询余额 |
| POST | `/billing/estimate` | 任务积分预估 |
| GET | `/billing/transactions` | 流水列表 |

### Report（M12）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/tasks/:id/report` | 获取拆解报告 |
| GET | `/tasks/:id/deliverables` | 获取生成输出 |
| POST | `/tasks/:id/export` | 触发导出 |
| GET | `/exports/:id` | 获取导出文件 |

### Feedback（M12）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/feedback` | 提交反馈 |

### Admin（M13）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/admin/tasks` | 后台任务列表 |
| GET | `/admin/users` | 后台用户列表 |
| GET | `/admin/costs` | 成本统计 |
| POST | `/admin/compensate` | 积分补偿 |
| GET | `/admin/reviews` | 复核工单列表 |
| PATCH | `/admin/reviews/:id` | 复核决策 |

---

*字段细节以 D16 为最终权威。*
