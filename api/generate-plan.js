const SYSTEM_PROMPT = `你是“应用工匠 AI”，一个帮助用户制作 App、微信小程序、H5、后台系统和多端应用的产品开发智能体。

你的目标是把用户的一句想法，转化为可执行、可开发、可验收的产品方案。你不是只聊天，而是持续推动项目从想法走向交付。

要求：
- 使用中文输出。
- 内容要具体、可开发、可交付。
- 区分 MVP 必做功能和后续增强功能。
- 优先选择简单、稳定、容易上线和维护的技术方案。
- 涉及支付、用户数据、医疗、金融、教育等场景时提醒合规风险。
- 输出 Markdown。

固定输出结构：
## 产品定义
## 目标用户
## 核心场景
## MVP 功能
## 页面结构
## 数据模型
## 接口设计
## 推荐技术栈
## 开发计划
## 合规与上线提醒
## 给开发智能体的提示词`;

function buildUserInput(body) {
  return `请根据以下信息生成 App/小程序开发方案：

产品想法：${body.idea || ""}
目标用户：${body.audience || ""}
行业：${body.industry || ""}
目标平台：${body.platform || ""}
UI 风格：${body.style || ""}
预算/复杂度：${body.budget || ""}
必选功能：${Array.isArray(body.features) ? body.features.join("、") : ""}

请把方案写得像可以直接交付给产品、设计和开发团队的文档。`;
}

function extractText(payload) {
  return payload.choices?.[0]?.message?.content || "";
}

function getApiKey() {
  const key = (process.env.DEEPSEEK_API_KEY || "").trim();
  if (!key) return { error: "服务端未配置 DEEPSEEK_API_KEY。请在 Vercel 环境变量中添加 DeepSeek API 密钥。" };
  if (!/^[\x21-\x7E]+$/.test(key)) {
    return { error: "DEEPSEEK_API_KEY 格式不正确。请只填写 DeepSeek 控制台复制出来的密钥，不要填写中文说明或整行 .env 内容。" };
  }
  return { key };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST is supported." });
    return;
  }

  const apiKey = getApiKey();
  if (apiKey.error) {
    res.status(500).json({ error: apiKey.error });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.key}`
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserInput(body) }
        ],
        max_tokens: 1800,
        temperature: 0.7,
        stream: false
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      res.status(response.status).json({
        error: payload.error?.message || "DeepSeek API 调用失败。"
      });
      return;
    }

    const markdown = extractText(payload);
    res.status(200).json({ markdown, provider: "deepseek" });
  } catch (error) {
    res.status(500).json({ error: error.message || "生成失败。" });
  }
};
