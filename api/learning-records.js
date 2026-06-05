const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");
const recordsPath = path.join(dataDir, "server-learning-records.json");

function sanitizeDeviceId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
}

function readStore() {
  if (!fs.existsSync(recordsPath)) {
    return { version: "0.7.0", updatedAt: "", recordsByDevice: {} };
  }
  const data = JSON.parse(fs.readFileSync(recordsPath, "utf-8"));
  return {
    version: data.version || "0.7.0",
    updatedAt: data.updatedAt || "",
    recordsByDevice: data.recordsByDevice && typeof data.recordsByDevice === "object" ? data.recordsByDevice : {}
  };
}

function writeStore(store) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(recordsPath, JSON.stringify({
    version: "0.7.0",
    updatedAt: new Date().toISOString(),
    recordsByDevice: store.recordsByDevice || {}
  }, null, 2));
}

function normalizeRecord(record) {
  return {
    id: String(record.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    createdAt: record.createdAt || new Date().toISOString(),
    mode: record.mode || "local",
    status: record.status || "mistake",
    mastered: Boolean(record.mastered),
    data: record.data && typeof record.data === "object" ? record.data : {},
    markdown: String(record.markdown || "")
  };
}

function mergeRecords(current, incoming) {
  const merged = [...current];
  incoming.map(normalizeRecord).forEach((record) => {
    const index = merged.findIndex((item) => item.id === record.id);
    if (index >= 0) merged[index] = record;
    else merged.unshift(record);
  });
  return merged
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 120);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const deviceId = sanitizeDeviceId(req.body?.deviceId || new URL(req.url, "http://127.0.0.1").searchParams.get("deviceId"));
  if (!deviceId) {
    res.status(400).json({ error: "缺少学习档案 ID。" });
    return;
  }

  const store = readStore();
  const current = Array.isArray(store.recordsByDevice[deviceId]) ? store.recordsByDevice[deviceId] : [];

  if (req.method === "GET") {
    res.status(200).json({ version: "0.7.0", deviceId, records: current });
    return;
  }

  if (req.method === "DELETE") {
    store.recordsByDevice[deviceId] = [];
    writeStore(store);
    res.status(200).json({ ok: true, total: 0 });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Only GET, POST and DELETE are supported." });
    return;
  }

  const incoming = Array.isArray(req.body.records) ? req.body.records : req.body.record ? [req.body.record] : [];
  if (!incoming.length) {
    res.status(400).json({ error: "没有可同步的学习记录。" });
    return;
  }

  store.recordsByDevice[deviceId] = mergeRecords(current, incoming);
  writeStore(store);
  res.status(200).json({ ok: true, total: store.recordsByDevice[deviceId].length });
};
