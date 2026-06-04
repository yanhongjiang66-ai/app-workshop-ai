const templates = {
  tea: {
    idea: "我想做一个奶茶店微信小程序，用户可以在线点单、加入会员、领取优惠券，店员可以在后台处理订单和查看销售数据。",
    audience: "实体店老板和到店消费用户",
    industry: "餐饮零售",
    platform: "微信小程序",
    features: ["微信登录", "商品/服务列表", "在线下单", "支付", "会员积分", "优惠券", "后台管理", "数据看板"]
  },
  booking: {
    idea: "我想做一个预约服务小程序，用户可以选择门店、技师和时间，下单支付订金，商家后台能管理排班和订单。",
    audience: "理发店、美甲店、家政服务商和预约客户",
    industry: "预约服务",
    platform: "微信小程序",
    features: ["微信登录", "商品/服务列表", "在线下单", "支付", "后台管理", "数据看板"]
  },
  course: {
    idea: "我想做一个课程报名 App，学生可以查看课程、预约试听、购买课程包，老师可以发布课表和查看学员进度。",
    audience: "培训机构、老师、学生和家长",
    industry: "教育课程",
    platform: "手机 App",
    features: ["微信登录", "商品/服务列表", "在线下单", "支付", "会员积分", "后台管理", "数据看板", "AI 文案/客服"]
  },
  local: {
    idea: "我想做一个本地生活小程序，用户可以查看附近商家、领取优惠券、购买团购套餐，平台可以管理商家和活动。",
    audience: "本地商家、社区用户和平台运营人员",
    industry: "本地生活",
    platform: "微信小程序",
    features: ["微信登录", "商品/服务列表", "在线下单", "支付", "优惠券", "后台管理", "数据看板"]
  },
  custom: {
    idea: "",
    audience: "",
    industry: "企业工具",
    platform: "多端应用",
    features: ["微信登录", "后台管理", "数据看板", "AI 文案/客服"]
  }
};

const form = document.getElementById("builderForm");
const result = document.getElementById("result");
const toast = document.getElementById("toast");
const idea = document.getElementById("idea");
const audience = document.getElementById("audience");
const industry = document.getElementById("industry");
const style = document.getElementById("style");
const budget = document.getElementById("budget");
const score = document.getElementById("score");
const scoreLabel = document.getElementById("scoreLabel");
const generatedAt = document.getElementById("generatedAt");
let selectedPlatform = "微信小程序";
let latestMarkdown = "";
let latestMode = "local";

function iconRefresh() {
  if (window.lucide) window.lucide.createIcons();
}

function setPlatform(value) {
  selectedPlatform = value;
  document.querySelectorAll(".segment").forEach((button) => {
    button.classList.toggle("active", button.dataset.value === value);
  });
}

function setFeatures(values) {
  document.querySelectorAll("#features input").forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function getFeatures() {
  return Array.from(document.querySelectorAll("#features input:checked")).map((input) => input.value);
}

function collectFormData() {
  return {
    idea: idea.value.trim(),
    audience: audience.value.trim(),
    industry: industry.value,
    style: style.value,
    budget: budget.value,
    platform: selectedPlatform,
    features: getFeatures()
  };
}

function applyTemplate(key) {
  const data = templates[key];
  idea.value = data.idea;
  audience.value = data.audience;
  industry.value = data.industry;
  setPlatform(data.platform);
  setFeatures(data.features);
  document.querySelectorAll(".template-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.template === key);
  });
}

function inferStack(platformValue, featureValues) {
  if (platformValue === "微信小程序") {
    return featureValues.includes("后台管理")
      ? "uni-app + Node.js/FastAPI + PostgreSQL 或微信云开发"
      : "微信原生小程序 + 微信云开发";
  }
  if (platformValue === "手机 App") return "Flutter 或 React Native + Supabase/FastAPI";
  if (platformValue === "H5 Web App") return "Next.js 或 Vue + Supabase";
  return "uni-app 或 Taro + Node.js/FastAPI + PostgreSQL";
}

function makePages(featureValues) {
  const pages = ["首页/推荐", "商品或服务列表", "详情页", "下单确认页", "我的"];
  if (featureValues.includes("会员积分")) pages.push("会员中心");
  if (featureValues.includes("优惠券")) pages.push("优惠券中心");
  if (featureValues.includes("后台管理")) pages.push("商家后台");
  if (featureValues.includes("数据看板")) pages.push("经营看板");
  if (featureValues.includes("AI 文案/客服")) pages.push("AI 客服/文案助手");
  return pages;
}

function makeDataModel(featureValues) {
  const tables = ["users 用户表", "items 商品/服务表", "orders 订单表", "order_items 订单明细表"];
  if (featureValues.includes("支付")) tables.push("payments 支付记录表");
  if (featureValues.includes("会员积分")) tables.push("members 会员表", "points 积分流水表");
  if (featureValues.includes("优惠券")) tables.push("coupons 优惠券表", "coupon_claims 领取记录表");
  if (featureValues.includes("后台管理")) tables.push("admins 管理员表", "stores 门店表");
  return tables;
}

function makeApis(featureValues) {
  const apis = ["POST /auth/login", "GET /items", "GET /items/:id", "POST /orders", "GET /orders/:id"];
  if (featureValues.includes("支付")) apis.push("POST /payments/create", "POST /payments/notify");
  if (featureValues.includes("优惠券")) apis.push("GET /coupons", "POST /coupons/claim");
  if (featureValues.includes("后台管理")) apis.push("GET /admin/orders", "PATCH /admin/orders/:id/status");
  if (featureValues.includes("数据看板")) apis.push("GET /admin/analytics/summary");
  return apis;
}

function buildLocalMarkdown(data) {
  const pages = makePages(data.features);
  const tables = makeDataModel(data.features);
  const apis = makeApis(data.features);
  const stack = inferStack(data.platform, data.features);
  const productName = data.industry === "餐饮零售" ? "门店点单增长小程序" : `${data.industry}业务生成器`;

  return `# ${productName}

## 产品定义
这是一个面向${data.audience || "目标用户"}的${data.platform}，帮助用户完成${data.features.includes("在线下单") ? "在线下单、支付和后续服务管理" : "核心业务流程线上化"}。

## MVP 功能
${data.features.map((item) => `- ${item}`).join("\n")}

## 页面结构
${pages.map((item) => `- ${item}`).join("\n")}

## 技术方案
- 推荐技术栈：${stack}
- UI 风格：${data.style}
- 项目复杂度：${data.budget}

## 数据库表
${tables.map((item) => `- ${item}`).join("\n")}

## 接口设计
${apis.map((item) => `- ${item}`).join("\n")}

## 开发提示词
请你作为资深全栈工程师，帮我开发一个${data.platform}项目。产品想法：${data.idea}。目标用户：${data.audience}。行业：${data.industry}。必须功能：${data.features.join("、")}。请先输出文件结构、页面路由、数据库设计、接口设计，再逐步实现 MVP。`;
}

function setGeneratedMeta(mode, feasibility) {
  const now = new Date();
  latestMode = mode;
  score.textContent = mode === "ai" ? "AI" : feasibility;
  scoreLabel.textContent = mode === "ai" ? "智能生成" : "可行度";
  generatedAt.textContent = `${mode === "ai" ? "AI 已生成" : "本地备用已生成"}：${now.toLocaleString("zh-CN", { hour12: false })}`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listType = null;

  function closeList() {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      return;
    }
    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      return;
    }
    if (line.startsWith("# ")) {
      closeList();
      html.push(`<h2>${escapeHtml(line.slice(2))}</h2>`);
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${escapeHtml(line.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${escapeHtml(line.replace(/^\d+\.\s+/, ""))}</li>`);
      return;
    }
    closeList();
    html.push(`<p>${escapeHtml(line)}</p>`);
  });

  closeList();
  return html.join("");
}

function renderMarkdownResult(markdown, mode, feasibility = 88, errorMessage = "") {
  latestMarkdown = markdown;
  setGeneratedMeta(mode, feasibility);
  const modeTag = mode === "ai"
    ? '<span class="tag">AI 动态生成</span>'
    : '<span class="tag">本地备用生成</span>';
  const errorTag = errorMessage ? `<span class="tag">备用原因：${escapeHtml(errorMessage)}</span>` : "";

  result.innerHTML = `
    <section class="result-section">
      <div class="tagline">${modeTag}${errorTag}</div>
    </section>
    <section class="result-section">
      <div class="markdown-result">${markdownToHtml(markdown)}</div>
    </section>
    <section class="result-section">
      <div class="btn-row">
        <button class="btn primary" type="button" id="copyBtn"><i data-lucide="copy"></i> 复制提示词</button>
        <button class="btn" type="button" id="downloadBtn"><i data-lucide="download"></i> 下载方案</button>
      </div>
    </section>
  `;
  document.getElementById("copyBtn").addEventListener("click", copyPrompt);
  document.getElementById("downloadBtn").addEventListener("click", downloadPlan);
  iconRefresh();
}

function renderLoading() {
  score.textContent = "...";
  scoreLabel.textContent = "生成中";
  generatedAt.textContent = "正在调用 AI；如果接口未配置，会自动使用本地备用生成。";
  result.innerHTML = `
    <div class="loading-box">
      <div>
        <div class="spinner"></div>
        <p>应用工匠正在拆解需求、页面、数据模型和开发提示词...</p>
      </div>
    </div>
  `;
}

async function callAi(data) {
  const endpoints = ["/api/generate-plan", "/.netlify/functions/generate-plan"];
  let lastError = "";

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.status === 404 || response.status === 405) {
        lastError = "AI 接口未部署";
        continue;
      }

      const payload = await response.json().catch(() => ({}));
      if (response.ok && (payload.markdown || payload.text)) {
        return payload;
      }
      if (response.ok) {
        lastError = "AI 接口未部署";
        continue;
      }
      const fatalError = new Error(payload.error || "AI 接口调用失败");
      fatalError.fatal = true;
      throw fatalError;
    } catch (error) {
      if (error.fatal) throw error;
      lastError = error.message || "网络请求失败";
    }
  }

  throw new Error(lastError || "AI 接口不可用");
}

function generateLocalPlan(errorMessage = "") {
  const data = collectFormData();
  const feasibility = Math.max(72, 96 - Math.max(0, data.features.length - 6) * 4);
  renderMarkdownResult(buildLocalMarkdown(data), "local", feasibility, errorMessage);
}

async function generatePlan() {
  const data = collectFormData();
  if (!data.idea) {
    showToast("先写一句产品想法");
    idea.focus();
    return;
  }

  renderLoading();
  try {
    const payload = await callAi(data);
    renderMarkdownResult(payload.markdown || payload.text || "", "ai");
    showToast("AI 方案已生成");
  } catch (error) {
    generateLocalPlan(error.message);
    showToast("AI 未就绪，已使用本地备用");
  }
}

async function copyPrompt() {
  const prompt = latestMarkdown.split("## 给开发智能体的提示词")[1]?.trim()
    || latestMarkdown.split("## 开发提示词")[1]?.trim()
    || latestMarkdown;
  try {
    await navigator.clipboard.writeText(prompt);
    showToast("提示词已复制");
  } catch {
    showToast("复制失败，请手动选择文本");
  }
}

function downloadPlan() {
  const blob = new Blob([latestMarkdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = latestMode === "ai" ? "ai-app-plan.md" : "app-mini-program-plan.md";
  link.click();
  URL.revokeObjectURL(url);
  showToast("方案已下载");
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".template-btn").forEach((button) => {
  button.addEventListener("click", () => applyTemplate(button.dataset.template));
});

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => setPlatform(button.dataset.value));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generatePlan();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  applyTemplate("tea");
  generateLocalPlan();
});

document.getElementById("sampleBtn").addEventListener("click", () => {
  const keys = ["tea", "booking", "course", "local"];
  const current = document.querySelector(".template-btn.active")?.dataset.template || "tea";
  const next = keys[(keys.indexOf(current) + 1) % keys.length];
  applyTemplate(next);
  generateLocalPlan();
});

iconRefresh();
generateLocalPlan();
