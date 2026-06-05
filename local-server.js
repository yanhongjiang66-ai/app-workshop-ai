const http = require("http");
const fs = require("fs");
const path = require("path");
const generatePlanHandler = require("./api/generate-plan");
const questionBankHandler = require("./api/question-bank");
const learningRecordsHandler = require("./api/learning-records");

const root = __dirname;
const port = Number(process.env.PORT || 8792);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".toml": "text/plain; charset=utf-8"
};

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = valueParts.join("=");
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function createApiResponse(res) {
  return {
    setHeader(name, value) {
      res.setHeader(name, value);
    },
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(payload) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(payload));
    },
    end(payload = "") {
      res.end(payload);
    }
  };
}

async function serveApi(req, res, handler) {
  const rawBody = await readBody(req);
  req.body = rawBody ? JSON.parse(rawBody) : {};
  await handler(req, createApiResponse(res));
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  res.setHeader("Content-Type", mimeTypes[path.extname(filePath)] || "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

loadEnv();

http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/generate-plan")) {
      await serveApi(req, res, generatePlanHandler);
      return;
    }
    if (req.url.startsWith("/api/question-bank")) {
      await serveApi(req, res, questionBankHandler);
      return;
    }
    if (req.url.startsWith("/api/learning-records")) {
      await serveApi(req, res, learningRecordsHandler);
      return;
    }
    serveStatic(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: error.message || "Server error" }));
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`AI 学考教练 v0.7: http://127.0.0.1:${port}`);
});
