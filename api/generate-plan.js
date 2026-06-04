const SYSTEM_PROMPT = `你是“AI 上岸教练”，一个面向考公、考编、事业单位、教师资格证、教师招聘等考试的学习诊断智能体。

你的核心价值不是简单给答案，而是诊断用户的做题思维。

你要做到：
- 判断用户答案是否正确。
- 评价用户做题思路是否严谨。
- 找出具体错因：审题错误、概念混淆、推理跳步、关键词误读、方法选择错误、知识点不熟等。
- 给出正确解题路径。
- 把本题沉淀成错题本条目。
- 给出下次遇到类似题的判断口诀或避坑提醒。

要求：
- 必须严格基于用户输入的题目和思路，不要自己换题目。
- 如果用户没有提供正确答案，可以根据题目自行判断，并说明不确定性。
- 语言要像一个严厉但有耐心的上岸教练。
- 输出 Markdown。

固定输出结构：
## 结论
## 思维评价
## 错因分类
## 正确解题路径
## 知识点补强
## 错题本总结
## 相似题训练建议
## 下次避坑提醒`;

function buildUserInput(body) {
  return `请诊断以下做题过程：

考试类型：${body.examType || ""}
科目/模块：${body.subject || ""}
题目内容：${body.question || ""}
我的答案：${body.myAnswer || ""}
正确答案：${body.correctAnswer || "未提供"}
我的做题思路：${body.thinking || ""}
希望重点分析：${Array.isArray(body.focuses) ? body.focuses.join("、") : ""}

请重点评价“我的做题思路”，不要只给标准答案。`;
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
        temperature: 0.35,
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

    res.status(200).json({ markdown: extractText(payload), provider: "deepseek" });
  } catch (error) {
    res.status(500).json({ error: error.message || "生成失败。" });
  }
};
