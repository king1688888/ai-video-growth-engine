# 域名 / SSL / DNS 检查清单

> 更新日期: 2026-05-27

---

## 一、当前域名状态

| 环境 | 域名 | SSL | 状态 |
|------|------|-----|------|
| Staging（当前） | aivideogrow-7hmdkh5f.manus.space | Manus 自动 | ✅ 可访问 |
| Production | 待 Owner 决策（建议如 video.example.com） | 待配置 | ⏳ |

## 二、生产域名配置流程

### 步骤 1：选择域名

建议格式：
- 主域：`example.com`
- Web：`app.example.com` 或 `video.example.com`
- API：`api.example.com`（如分离）
- CDN：`cdn.example.com`

### 步骤 2：DNS 配置

需在域名注册商或 Cloudflare 配置：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| A / CNAME | app | Manus 部署 IP / 域名 | 300 |
| A | api | （如果分离） | 300 |
| CAA | @ | 0 issue "letsencrypt.org" | 3600 |
| TXT | @ | （SPF / DMARC，邮件用） | 3600 |

### 步骤 3：SSL 证书

**Manus Webdev 自动方案**：
- 部署时自动颁发 Let's Encrypt 证书
- 自动续期（90 天）

**自定义域名方案**：
1. 在 Manus 项目 Settings → Domains 添加自定义域名
2. 配置 DNS CNAME 指向 Manus 提供的目标
3. 等待证书自动颁发（通常 5-10 分钟）

### 步骤 4：HSTS / 安全头

需在应用层配置（已自动）：

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

### 步骤 5：CORS 配置

仅允许：
- 生产前端域名
- staging 前端域名（如有）

不允许：
- 通配符 `*`（除非纯公开 API）
- localhost（除 dev 环境）

## 三、回调 URL 注册

OAuth / 支付回调 URL 需在对应平台注册：

| 平台 | 回调 URL |
|------|----------|
| Manus OAuth | `https://<your-domain>/api/oauth/callback` |
| 微信支付 | `https://<your-domain>/api/webhooks/wechat-pay` |
| 支付宝 | `https://<your-domain>/api/webhooks/alipay` |

## 四、域名上线 Checklist

- [ ] 域名所有权确认（备案信息齐全，国内域名需 ICP）
- [ ] DNS A/CNAME 记录已生效（dig 验证）
- [ ] SSL 证书已颁发（curl -I 验证 200）
- [ ] HSTS 头存在
- [ ] CORS 仅允许白名单域
- [ ] OAuth 回调 URL 已在 Portal 注册
- [ ] 支付回调 URL 已在商户后台注册（接入支付时）
- [ ] 监控告警的域名健康检查已配置

## 五、域名监控

建议接入 Uptime Robot / StatusCake，每分钟检查：
- 首页 200
- API health 200
- SSL 证书剩余天数 > 30

---
