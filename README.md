# AI 上岸教练 v0.2

这是面向考公、考编、事业单位、教师资格证、教师招聘等考试的学习诊断智能体原型。

v0.2 已完成：

- AI 做题思维诊断
- 错因分类和纠正路径
- 错题本总结
- 诊断历史自动保存
- 待复盘错题统计
- 回填旧题继续复盘
- 导出学习记录
- DeepSeek API 接入
- AI 不可用时本地备用生成

## 文件结构

- `index.html`：页面结构
- `styles.css`：页面样式
- `app.js`：前端交互、AI 调用、错题本和学习记录
- `api/generate-plan.js`：DeepSeek 生成接口
- `local-server.js`：本地/服务器运行入口
- `.env.example`：环境变量示例
- `agent-prompt.md`：智能体提示词
- `ROADMAP.md`：后续迭代路线

## 环境变量

复制 `.env.example` 为 `.env`，填写：

```text
DEEPSEEK_API_KEY=你的DeepSeek密钥
DEEPSEEK_MODEL=deepseek-chat
PORT=8792
```

## 本地或服务器运行

```bash
npm install
npm run dev
```

默认访问：

```text
http://127.0.0.1:8792
```

## 阿里云服务器运行

建议用 PM2 后台运行：

```bash
cd /var/www/ai-exam-coach
npm install
pm2 start local-server.js --name ai-exam-coach
pm2 save
```

Nginx 反向代理到：

```text
http://127.0.0.1:8792
```

## 当前限制

- 学习记录保存在用户自己的浏览器里，不同手机/电脑不会同步。
- 暂无账号登录。
- 暂无云端数据库。
- 暂无支付和会员系统。

下一步建议做 v0.3：账号登录 + 云端错题本 + 知识点掌握进度。
