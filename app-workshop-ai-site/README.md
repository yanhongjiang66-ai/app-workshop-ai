# 应用工匠 AI 部署包

这是“应用工匠 AI”的网页原型。v0.2 已经加入 AI 接口能力：前端会优先请求服务端 AI 接口，接口未配置时自动使用本地规则生成。

## 文件结构

- `index.html`：页面结构
- `styles.css`：页面样式
- `app.js`：前端交互、AI 调用和本地备用生成逻辑
- `api/generate-plan.js`：Vercel AI 生成接口
- `netlify/functions/generate-plan.js`：Netlify AI 生成接口
- `local-server.js`：本地开发服务器
- `.env.example`：环境变量示例
- `agent-prompt.md`：智能体系统提示词
- `ROADMAP.md`：后续迭代路线
- `vercel.json`：Vercel 静态部署配置
- `netlify.toml`：Netlify 静态部署配置

## 本地运行 v0.2

1. 复制 `.env.example` 为 `.env`
2. 在 `.env` 里填写：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-4.1-mini
```

3. 运行：

```bash
npm run dev
```

4. 打开：

```text
http://127.0.0.1:8792
```

如果没有配置 `OPENAI_API_KEY`，页面仍然可以运行，但会自动使用本地备用生成。

## 最简单的分享方式

把整个 `app-workshop-ai-site` 文件夹压缩后发给别人，对方解压并双击 `index.html` 就能打开。

注意：双击打开只能使用本地备用生成，不能调用 AI。要使用真实 AI，需要本地运行 `npm run dev` 或部署到 Vercel/Netlify 并配置环境变量。

## 推荐部署方式：Vercel

1. 打开 https://vercel.com
2. 登录账号
3. 新建项目
4. 上传或导入这个文件夹
5. 在项目 Settings > Environment Variables 里添加 `OPENAI_API_KEY`
6. 可选添加 `OPENAI_MODEL`
7. 部署完成后，复制 Vercel 给你的公开链接

## Netlify 部署

1. 打开 https://app.netlify.com/drop
2. 把整个 `app-workshop-ai-site` 文件夹拖进去
3. 在 Site configuration > Environment variables 里添加 `OPENAI_API_KEY`
4. 可选添加 `OPENAI_MODEL`
5. 等待部署完成
6. 复制公开链接发给别人

## GitHub Pages 部署

1. 新建一个 GitHub 仓库
2. 上传 `index.html`
3. 在仓库 Settings > Pages 中启用 GitHub Pages
4. 选择主分支作为发布来源
5. 等待生成公开链接

注意：GitHub Pages 只能部署静态页面，不能运行后端 AI 接口。用 GitHub Pages 时页面会自动退回本地备用生成。

## 自己服务器部署

把 `index.html` 上传到网站根目录即可，例如 Nginx、宝塔、阿里云、腾讯云静态网站都可以。

## 注意

当前版本已经预留并实现 AI 接口，但还不是完整 SaaS。后续可以继续增加：

- 用户登录
- AI API 接入
- 生成历史
- 会员套餐
- 在线支付
- 模板市场
- 后台管理

推荐下一步做 `ROADMAP.md` 里的 v0.3：项目记忆和生成历史。
