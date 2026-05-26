# 对象存储与资产生命周期计划

> 权威文档：D17  
> 存储：S3-compatible（Cloudflare R2 首选）  
> 日期：2026-05-26

---

## Bucket 结构

| Bucket | 用途 | 访问 | 生命周期 |
|--------|------|------|----------|
| `uploads-raw` | 用户上传原视频 | 私有，Signed URL | 任务完成后 30 天 |
| `processing` | 视频处理中间产物（帧、音频、代理文件） | 私有，Worker 直接访问 | 任务完成后 7 天 |
| `assets-published` | 用户可见结果资产（报告、导出文件） | 私有，Signed URL | 用户可删除，默认 180 天 |
| `system-internal` | 系统内部资产（证据包、模型输入快照） | 私有，仅 Worker | 90 天 |

## 上传流程

```text
1. 前端请求 POST /api/v1/assets/upload-url
2. API 返回 S3 Presigned PUT URL + asset_id
3. 前端直传 S3（不经过 API 服务器）
4. 前端确认 POST /api/v1/assets/confirm { asset_id }
5. API 验证文件存在 + 大小/类型校验
6. 更新 Asset 状态为 UPLOADED
```

## 资产状态流转

```text
PENDING_UPLOAD → UPLOADED → SCANNING → AVAILABLE
  → PROCESSING → DERIVED/GENERATED
  → PUBLISHED → EXPORT_READY
  → EXPIRE_SCHEDULED → DELETING → DELETED → TOMBSTONED
```

## 生命周期策略

| 事件 | 动作 |
|------|------|
| 任务成功 | 原视频保留 30 天，中间产物 7 天，结果 180 天 |
| 任务失败 | 原视频保留 7 天（供重试），中间产物立即标记清理 |
| 用户删除 | 标记 `DELETING`，异步清理 S3 对象，保留 `TOMBSTONED` 审计记录 |
| 投诉删除 | 立即隔离（`QUARANTINED`），审核后物理删除 |
| 过期扫描 | 每日 cron 扫描 `expire_at < now()`，触发清理队列 |

## 安全约束

- 所有用户访问通过 Signed URL（1h 有效期）
- Worker 使用 Service Account 访问
- 不返回永久公开 URL
- 上传文件类型白名单：`video/mp4`, `video/quicktime`, `video/webm`
- 最大文件：200MB
- 最大时长：3 分钟

---

*本文档为 MVP1 架构冻结版本。*
