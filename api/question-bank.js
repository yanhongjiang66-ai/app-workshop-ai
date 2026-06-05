const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const serverBankPath = path.join(dataDir, "server-question-bank.json");

function normalizeQuestion(item, index = 0) {
  const options = Array.isArray(item.options)
    ? item.options
    : String(item.options || "").split("|").map((option) => option.trim()).filter(Boolean);
  return {
    id: String(item.id || `server-${Date.now()}-${index}`).trim(),
    category: String(item.category || "").trim(),
    examType: String(item.examType || item.exam || "").trim(),
    subject: String(item.subject || "").trim(),
    chapter: String(item.chapter || "综合").trim(),
    knowledgePoint: String(item.knowledgePoint || item.knowledge || "").trim(),
    type: String(item.type || "单选题").trim(),
    difficulty: String(item.difficulty || "基础").trim(),
    stem: String(item.stem || item.question || "").trim(),
    options,
    answer: String(item.answer || "").trim().toUpperCase(),
    explanation: String(item.explanation || "").trim(),
    tags: Array.isArray(item.tags) ? item.tags : String(item.tags || "").split("|").map((tag) => tag.trim()).filter(Boolean),
    sourceType: String(item.sourceType || "自建题库").trim(),
    source: String(item.source || "").trim(),
    licenseNote: String(item.licenseNote || item.license || "").trim()
  };
}

function validateQuestion(item) {
  const missing = [];
  ["category", "examType", "subject", "type", "difficulty", "stem", "answer", "explanation", "sourceType", "source", "licenseNote"].forEach((key) => {
    if (!item[key]) missing.push(key);
  });
  if (!Array.isArray(item.options) || item.options.length < 2) missing.push("options");
  if (item.type === "单选题" && !/^[A-Z]$/.test(item.answer)) missing.push("answer格式");
  return missing;
}

function readServerBank() {
  if (!fs.existsSync(serverBankPath)) return { version: "0.6.0", updatedAt: "", questions: [] };
  const data = JSON.parse(fs.readFileSync(serverBankPath, "utf-8"));
  return {
    version: data.version || "0.6.0",
    updatedAt: data.updatedAt || "",
    questions: Array.isArray(data.questions) ? data.questions : []
  };
}

function writeServerBank(questions) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(serverBankPath, JSON.stringify({
    version: "0.6.0",
    updatedAt: new Date().toISOString(),
    questions
  }, null, 2));
}

function assertAdminToken(body) {
  const expected = (process.env.ADMIN_TOKEN || "").trim();
  if (!expected) return "服务端未配置 ADMIN_TOKEN，不能发布题库。";
  if ((body.token || "").trim() !== expected) return "管理员口令不正确。";
  return "";
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    res.status(200).json(readServerBank());
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Only GET and POST are supported." });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  const tokenError = assertAdminToken(body);
  if (tokenError) {
    res.status(401).json({ error: tokenError });
    return;
  }

  const incoming = Array.isArray(body.questions) ? body.questions : [];
  if (!incoming.length) {
    res.status(400).json({ error: "没有可发布的题目。" });
    return;
  }

  const validItems = [];
  const errors = [];
  incoming.forEach((rawItem, index) => {
    const item = normalizeQuestion(rawItem, index);
    const missing = validateQuestion(item);
    if (missing.length) errors.push(`第 ${index + 1} 题缺少或格式错误：${missing.join("、")}`);
    else validItems.push(item);
  });

  if (errors.length) {
    res.status(400).json({ error: errors.slice(0, 5).join("；") });
    return;
  }

  const current = readServerBank().questions;
  const merged = [...current];
  validItems.forEach((item) => {
    const index = merged.findIndex((entry) => entry.id === item.id);
    if (index >= 0) merged[index] = item;
    else merged.push(item);
  });
  writeServerBank(merged);
  res.status(200).json({ ok: true, imported: validItems.length, total: merged.length });
};
