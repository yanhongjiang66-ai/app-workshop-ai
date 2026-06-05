const samples = {
  civil: {
    examType: "考公",
    subject: "行测-判断推理",
    question: "某单位要从甲、乙、丙、丁四人中选两人参加培训。已知：如果选甲，就必须选乙；如果不选丙，就不能选丁。现在已经确定不选乙。问以下哪项一定为真？A. 不选甲 B. 选丙 C. 不选丁 D. 选甲",
    myAnswer: "C",
    correctAnswer: "A",
    thinking: "我觉得既然不选乙，根据如果选甲就必须选乙，所以应该不选甲。但题目问一定为真，我又看到不选丙就不能选丁，所以我感觉不选丁也可能成立，于是选了 C。"
  },
  public: {
    examType: "事业编/考编",
    subject: "公共基础知识",
    question: "行政处罚与行政强制的主要区别是什么？以下说法哪项更准确？A. 行政处罚重在惩戒违法行为，行政强制重在保障行政决定执行或防止危害扩大 B. 二者都只能由法院实施 C. 行政强制一定是罚款 D. 行政处罚不需要法律依据",
    myAnswer: "C",
    correctAnswer: "A",
    thinking: "我看到强制两个字，就想到强制交钱，所以觉得行政强制就是罚款，选了 C。"
  },
  teacher: {
    examType: "教师资格证",
    subject: "教育知识与能力",
    question: "学生通过观察教师示范后学会某种行为，这主要体现了哪种学习理论？A. 经典条件反射 B. 操作性条件反射 C. 社会学习理论 D. 认知结构学习理论",
    myAnswer: "B",
    correctAnswer: "C",
    thinking: "我觉得学生学会行为，应该是强化形成的，所以选了操作性条件反射。"
  },
  essay: {
    examType: "考公",
    subject: "申论/主观题",
    question: "请根据材料，概括基层治理中群众参与不足的主要原因。",
    myAnswer: "群众参与不足主要是因为群众素质不高、基层工作宣传不到位。",
    correctAnswer: "",
    thinking: "我先找材料里出现频率高的词，然后把原因归纳为群众和基层两个方面，但不确定是否全面。"
  },
  custom: {
    examType: "其他考试",
    subject: "公共基础知识",
    question: "",
    myAnswer: "",
    correctAnswer: "",
    thinking: ""
  }
};

const form = document.getElementById("coachForm");
const result = document.getElementById("result");
const toast = document.getElementById("toast");
const examType = document.getElementById("examType");
const subject = document.getElementById("subject");
const question = document.getElementById("question");
const myAnswer = document.getElementById("myAnswer");
const correctAnswer = document.getElementById("correctAnswer");
const thinking = document.getElementById("thinking");
const score = document.getElementById("score");
const scoreLabel = document.getElementById("scoreLabel");
const generatedAt = document.getElementById("generatedAt");
const totalCount = document.getElementById("totalCount");
const mistakeCount = document.getElementById("mistakeCount");
const lastSubject = document.getElementById("lastSubject");
const historyList = document.getElementById("historyList");
const mistakeList = document.getElementById("mistakeList");
const STORAGE_KEY = "ai-exam-coach-records-v2";
let latestMarkdown = "";
let latestMode = "local";
let latestData = null;

function iconRefresh() {
  if (window.lucide) window.lucide.createIcons();
}

function getFocuses() {
  return Array.from(document.querySelectorAll("#focuses input:checked")).map((input) => input.value);
}

function applySample(key) {
  const data = samples[key];
  examType.value = data.examType;
  subject.value = data.subject;
  question.value = data.question;
  myAnswer.value = data.myAnswer;
  correctAnswer.value = data.correctAnswer;
  thinking.value = data.thinking;
  document.querySelectorAll(".template-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.template === key);
  });
}

function collectFormData() {
  return {
    examType: examType.value,
    subject: subject.value,
    question: question.value.trim(),
    myAnswer: myAnswer.value.trim(),
    correctAnswer: correctAnswer.value.trim(),
    thinking: thinking.value.trim(),
    focuses: getFocuses()
  };
}

function getRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function setRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 80)));
}

function isWrongAnswer(data) {
  if (!data.correctAnswer || !data.myAnswer) return true;
  return data.correctAnswer.trim().toLowerCase() !== data.myAnswer.trim().toLowerCase();
}

function saveRecord(data, markdown, mode) {
  const records = getRecords();
  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    mode,
    status: isWrongAnswer(data) ? "mistake" : "correct",
    mastered: false,
    data,
    markdown
  };
  records.unshift(record);
  setRecords(records);
  renderRecords();
  return record;
}

function formatTime(iso) {
  return new Date(iso).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function getTitle(text) {
  const compact = (text || "").replace(/\s+/g, " ").trim();
  return compact.length > 44 ? `${compact.slice(0, 44)}...` : compact || "未命名题目";
}

function recordToHtml(record) {
  const data = record.data || {};
  const statusText = record.mastered ? "已掌握" : record.status === "mistake" ? "待复盘" : "已正确";
  return `
    <article class="record-item" data-record-id="${record.id}">
      <div class="record-main">
        <div class="record-title">${escapeHtml(getTitle(data.question))}</div>
        <div class="record-meta">
          <span>${escapeHtml(data.examType || "考试")}</span>
          <span>${escapeHtml(data.subject || "模块")}</span>
          <span>${formatTime(record.createdAt)}</span>
          <span>${record.mode === "ai" ? "AI" : "备用"}</span>
        </div>
        <div class="record-answer">
          我的答案：${escapeHtml(data.myAnswer || "未填")} / 正确答案：${escapeHtml(data.correctAnswer || "未提供")}
        </div>
      </div>
      <div class="record-actions">
        <span class="record-status ${record.mastered ? "mastered" : record.status}">${statusText}</span>
        <button class="icon-btn" type="button" data-action="load" title="回填题目"><i data-lucide="corner-down-left"></i></button>
        <button class="icon-btn" type="button" data-action="toggle" title="标记掌握"><i data-lucide="check-circle"></i></button>
        <button class="icon-btn" type="button" data-action="copy" title="复制总结"><i data-lucide="copy"></i></button>
      </div>
    </article>
  `;
}

function renderEmptyRecords(target, text) {
  target.innerHTML = `<div class="record-empty">${text}</div>`;
}

function renderRecords() {
  const records = getRecords();
  const mistakes = records.filter((record) => record.status === "mistake" && !record.mastered);
  totalCount.textContent = String(records.length);
  mistakeCount.textContent = String(mistakes.length);
  lastSubject.textContent = records[0]?.data?.subject || "--";

  if (records.length) {
    historyList.innerHTML = records.slice(0, 12).map(recordToHtml).join("");
  } else {
    renderEmptyRecords(historyList, "还没有诊断记录。完成一次诊断后，这里会自动保存。");
  }

  if (mistakes.length) {
    mistakeList.innerHTML = mistakes.slice(0, 12).map(recordToHtml).join("");
  } else {
    renderEmptyRecords(mistakeList, "当前没有待复盘错题。");
  }
  iconRefresh();
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
  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

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

function buildLocalMarkdown(data, errorMessage = "") {
  return `## 本地备用诊断

${errorMessage ? `备用原因：${errorMessage}\n` : ""}
## 初步判断
- 考试类型：${data.examType}
- 科目模块：${data.subject}
- 我的答案：${data.myAnswer || "未填写"}
- 正确答案：${data.correctAnswer || "未提供"}

## 思维评价
你已经写出了自己的推理过程，这是很好的复盘习惯。当前本地备用模式只能做基础提示：请重点检查“题干条件是否被完整转化”“是否把可能为真误当成一定为真”“是否混淆概念定义”。

## 错因分类
- 审题不完整
- 条件转化不严谨
- 对“必然/可能/不能推出”的区分需要加强

## 纠正方法
1. 先把题干条件逐条翻译成逻辑关系或关键词。
2. 再用已知条件排除不可能选项。
3. 最后只选择“一定成立”的结论，不要选择“可能成立”的结论。

## 错题本条目
- 知识点：${data.subject}
- 错因：推理链不完整或概念混淆
- 下次提醒：先判断题目问的是“一定为真”还是“可能为真”。`;
}

function setMeta(mode) {
  latestMode = mode;
  score.textContent = mode === "ai" ? "AI" : "备";
  scoreLabel.textContent = mode === "ai" ? "智能诊断" : "本地备用";
  generatedAt.textContent = `${mode === "ai" ? "AI 已诊断" : "本地备用已生成"}：${new Date().toLocaleString("zh-CN", { hour12: false })}`;
}

function renderMarkdown(markdown, mode, errorMessage = "") {
  latestMarkdown = markdown;
  setMeta(mode);
  result.innerHTML = `
    <section class="result-section">
      <div class="tagline">
        <span class="tag">${mode === "ai" ? "AI 思维诊断" : "本地备用生成"}</span>
        ${errorMessage ? `<span class="tag">备用原因：${escapeHtml(errorMessage)}</span>` : ""}
      </div>
    </section>
    <section class="result-section">
      <div class="markdown-result">${markdownToHtml(markdown)}</div>
    </section>
    <section class="result-section">
      <div class="btn-row">
        <button class="btn primary" type="button" id="copyBtn"><i data-lucide="copy"></i> 复制诊断</button>
        <button class="btn" type="button" id="downloadBtn"><i data-lucide="download"></i> 下载错题总结</button>
      </div>
    </section>
  `;
  document.getElementById("copyBtn").addEventListener("click", copyResult);
  document.getElementById("downloadBtn").addEventListener("click", downloadResult);
  iconRefresh();
}

function renderLoading() {
  score.textContent = "...";
  scoreLabel.textContent = "诊断中";
  generatedAt.textContent = "AI 正在分析你的答案、推理链和错因。";
  result.innerHTML = `
    <div class="loading-box">
      <div>
        <div class="spinner"></div>
        <p>正在定位知识点、拆解做题思路、生成纠正建议...</p>
      </div>
    </div>
  `;
}

async function callAi(data) {
  const response = await fetch("/api/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "AI 接口调用失败");
  }
  return payload;
}

async function diagnose() {
  const data = collectFormData();
  latestData = data;
  if (!data.question) {
    showToast("请先粘贴题目内容");
    question.focus();
    return;
  }
  if (!data.thinking) {
    showToast("请写下你的做题思路");
    thinking.focus();
    return;
  }

  renderLoading();
  try {
    const payload = await callAi(data);
    renderMarkdown(payload.markdown || "", "ai");
    saveRecord(data, payload.markdown || "", "ai");
    showToast("AI 诊断已生成");
  } catch (error) {
    const fallback = buildLocalMarkdown(data, error.message);
    renderMarkdown(fallback, "local", error.message);
    saveRecord(data, fallback, "local");
    showToast("AI 未就绪，已使用本地备用");
  }
}

async function copyResult() {
  try {
    await navigator.clipboard.writeText(latestMarkdown);
    showToast("诊断结果已复制");
  } catch {
    showToast("复制失败，请手动选择文本");
  }
}

function downloadResult() {
  const blob = new Blob([latestMarkdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = latestMode === "ai" ? "ai-exam-coach-diagnosis.md" : "exam-coach-fallback.md";
  link.click();
  URL.revokeObjectURL(url);
  showToast("错题总结已下载");
}

function loadRecord(record) {
  const data = record.data || {};
  examType.value = data.examType || examType.value;
  subject.value = data.subject || subject.value;
  question.value = data.question || "";
  myAnswer.value = data.myAnswer || "";
  correctAnswer.value = data.correctAnswer || "";
  thinking.value = data.thinking || "";
  renderMarkdown(record.markdown || buildLocalMarkdown(data), record.mode || "local");
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("已回填这道题");
}

async function copyRecord(record) {
  const data = record.data || {};
  const text = `# 错题复盘

考试类型：${data.examType || ""}
科目模块：${data.subject || ""}
我的答案：${data.myAnswer || ""}
正确答案：${data.correctAnswer || ""}
时间：${new Date(record.createdAt).toLocaleString("zh-CN", { hour12: false })}

${record.markdown || ""}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("错题总结已复制");
  } catch {
    showToast("复制失败，请手动选择文本");
  }
}

function handleRecordAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = button.closest("[data-record-id]");
  const records = getRecords();
  const record = records.find((entry) => entry.id === item?.dataset.recordId);
  if (!record) return;

  const action = button.dataset.action;
  if (action === "load") {
    loadRecord(record);
    return;
  }
  if (action === "copy") {
    copyRecord(record);
    return;
  }
  if (action === "toggle") {
    record.mastered = !record.mastered;
    setRecords(records);
    renderRecords();
    showToast(record.mastered ? "已标记掌握" : "已恢复待复盘");
  }
}

function exportRecords() {
  const records = getRecords();
  if (!records.length) {
    showToast("暂无记录可导出");
    return;
  }
  const content = records.map((record, index) => {
    const data = record.data || {};
    return `# ${index + 1}. ${data.subject || "学习记录"}

时间：${new Date(record.createdAt).toLocaleString("zh-CN", { hour12: false })}
考试类型：${data.examType || ""}
题目：${data.question || ""}
我的答案：${data.myAnswer || ""}
正确答案：${data.correctAnswer || ""}
状态：${record.mastered ? "已掌握" : record.status === "mistake" ? "待复盘" : "已正确"}

${record.markdown || ""}`;
  }).join("\n\n---\n\n");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ai-exam-coach-records-v0.2.md";
  link.click();
  URL.revokeObjectURL(url);
  showToast("学习记录已导出");
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".template-btn").forEach((button) => {
  button.addEventListener("click", () => applySample(button.dataset.template));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  diagnose();
});

document.getElementById("resetBtn").addEventListener("click", () => applySample("civil"));
document.getElementById("sampleBtn").addEventListener("click", () => {
  const keys = ["civil", "public", "teacher", "essay"];
  const current = document.querySelector(".template-btn.active")?.dataset.template || "civil";
  const next = keys[(keys.indexOf(current) + 1) % keys.length];
  applySample(next);
});

document.querySelectorAll(".record-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".record-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
    historyList.classList.toggle("hidden", button.dataset.recordTab !== "history");
    mistakeList.classList.toggle("hidden", button.dataset.recordTab !== "mistakes");
  });
});

historyList.addEventListener("click", handleRecordAction);
mistakeList.addEventListener("click", handleRecordAction);
document.getElementById("exportRecordsBtn").addEventListener("click", exportRecords);
document.getElementById("clearRecordsBtn").addEventListener("click", () => {
  if (!confirm("确定清空本机学习记录吗？")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderRecords();
  showToast("学习记录已清空");
});

iconRefresh();
latestData = collectFormData();
renderMarkdown(buildLocalMarkdown(latestData), "local");
renderRecords();
