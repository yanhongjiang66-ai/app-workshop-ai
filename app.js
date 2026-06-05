const STORAGE_KEY = "ai-exam-coach-records-v4";

const fallbackQuestions = [
  {
    id: "civil-logic-1",
    category: "公职类",
    examType: "考公",
    subject: "行测-判断推理",
    chapter: "翻译推理",
    knowledgePoint: "逆否命题",
    type: "单选题",
    difficulty: "基础",
    stem: "如果某人参加甲项目，就必须参加乙项目。现在小王没有参加乙项目。以下哪项一定为真？",
    options: ["小王参加了甲项目", "小王没有参加甲项目", "小王参加了乙项目", "不能判断小王是否参加甲项目"],
    answer: "B",
    explanation: "题干是“甲 -> 乙”。已知“非乙”，根据逆否命题可推出“非甲”。这类题要先把条件翻译成逻辑箭头。",
    sourceType: "自建题库",
    licenseNote: "原创示例题，可用于产品演示；正式商用前仍建议做内容审核。"
  }
];

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
  custom: { examType: "其他考试", subject: "公共基础知识", question: "", myAnswer: "", correctAnswer: "", thinking: "" }
};

let questionBank = fallbackQuestions;
let activeCategory = "全部";
let activeExam = "全部";
let activeType = "全部";
let activeDifficulty = "全部";
let activeIndex = 0;
let selectedOption = "";
let latestMarkdown = "";
let latestMode = "local";

const $ = (id) => document.getElementById(id);
const form = $("coachForm");
const result = $("result");
const toast = $("toast");
const examType = $("examType");
const subject = $("subject");
const question = $("question");
const myAnswer = $("myAnswer");
const correctAnswer = $("correctAnswer");
const thinking = $("thinking");
const score = $("score");
const scoreLabel = $("scoreLabel");
const generatedAt = $("generatedAt");
const bankFilters = $("bankFilters");
const bankCount = $("bankCount");
const practiceExam = $("practiceExam");
const practiceSubject = $("practiceSubject");
const practiceProgress = $("practiceProgress");
const practiceTitle = $("practiceTitle");
const practiceStem = $("practiceStem");
const optionList = $("optionList");
const practiceExplain = $("practiceExplain");

function html(text) {
  return String(text || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function toastMsg(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function upgradeStaticPage() {
  document.querySelectorAll(".metric-row strong")[0].textContent = "v0.4";
  document.querySelectorAll(".metric-row strong")[1].textContent = "题库系统";
  const pill = document.querySelector(".status-pill");
  if (pill) pill.innerHTML = '<i data-lucide="database"></i> 合规题库版';
  const bankText = document.querySelector(".bank-panel .records-header p");
  if (bankText) bankText.textContent = "题库已拆成独立数据文件，扩容时按公开合规题源、自建题库、AI 原创同类训练题三类管理，避免版权风险。";
  if (!document.getElementById("sourcePolicy")) {
    bankFilters.insertAdjacentHTML("beforebegin", '<div class="source-note" id="sourcePolicy">内容合规原则：不直接搬运未经授权的历年真题；每道题都要标注来源、题型、难度和版权说明。当前内置题为演示级示例题。</div>');
  }
  const row = document.querySelector("#practiceCard .btn-row");
  if (row && !$("generateSimilarBtn")) {
    row.insertAdjacentHTML("beforeend", '<button class="btn" type="button" id="generateSimilarBtn"><i data-lucide="copy-plus"></i> 生成同类题</button>');
  }
  const roadmap = document.querySelector(".agent-roadmap p");
  if (roadmap) roadmap.textContent = "当前是 AI 学考教练 v0.4：题库数据独立、支持来源标注和合规扩容，下一步可做批量导入和云端题库后台。";
  document.head.insertAdjacentHTML("beforeend", `<style>
    .source-note{padding:9px 10px;border-radius:8px;border:1px solid #f1d59f;background:#fff3d8;color:#6d4508;font-size:12px;line-height:1.5}
    .bank-filters{display:grid;gap:10px}.bank-category-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px}.bank-select-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.bank-select{display:grid;gap:5px}.bank-select span{color:#667371;font-size:12px;font-weight:800}.markdown-result h2{font-size:15px;margin:18px 0 8px}.markdown-result p,.markdown-result li{font-size:13px;line-height:1.65;color:#42504d}
    @media(max-width:780px){.bank-select-row{grid-template-columns:1fr}}
  </style>`);
}

async function loadQuestions() {
  try {
    const res = await fetch("data/questions.json", { cache: "no-store" });
    if (!res.ok) throw new Error("题库文件请求失败");
    const data = await res.json();
    if (!Array.isArray(data.questions)) throw new Error("题库格式不正确");
    questionBank = data.questions;
  } catch (error) {
    questionBank = fallbackQuestions;
    toastMsg("题库文件未加载，已使用备用题库");
  }
}

function filtered() {
  return questionBank.filter((item) => {
    const type = item.type || "单选题";
    return (activeCategory === "全部" || item.category === activeCategory)
      && (activeExam === "全部" || item.examType === activeExam)
      && (activeType === "全部" || type === activeType)
      && (activeDifficulty === "全部" || item.difficulty === activeDifficulty);
  });
}

function activeQuestion() {
  const list = filtered();
  return list[activeIndex % Math.max(list.length, 1)] || questionBank[0];
}

function select(label, key, value, options) {
  return `<label class="bank-select"><span>${label}</span><select data-filter="${key}">${options.map((item) => `<option value="${html(item)}" ${item === value ? "selected" : ""}>${html(item)}</option>`).join("")}</select></label>`;
}

function renderFilters() {
  const categories = ["全部", ...new Set(questionBank.map((q) => q.category))];
  const exams = ["全部", ...new Set(questionBank.map((q) => q.examType))];
  const types = ["全部", ...new Set(questionBank.map((q) => q.type || "单选题"))];
  const difficulties = ["全部", ...new Set(questionBank.map((q) => q.difficulty))];
  bankFilters.innerHTML = `<div class="bank-category-row">${categories.map((category) => `<button class="bank-filter ${category === activeCategory ? "active" : ""}" type="button" data-category="${html(category)}">${html(category)}</button>`).join("")}</div><div class="bank-select-row">${select("考试", "exam", activeExam, exams)}${select("题型", "type", activeType, types)}${select("难度", "difficulty", activeDifficulty, difficulties)}</div>`;
  bankCount.textContent = String(filtered().length);
}

function renderQuestion() {
  const list = filtered();
  if (!list.length) {
    practiceTitle.textContent = "当前筛选下暂无题目";
    practiceStem.textContent = "请切换分类、考试、题型或难度。";
    optionList.innerHTML = "";
    return;
  }
  const q = activeQuestion();
  selectedOption = "";
  practiceExam.textContent = q.examType;
  practiceSubject.textContent = `${q.subject} / ${q.chapter || "综合"}`;
  practiceProgress.textContent = `${activeIndex + 1} / ${list.length}`;
  practiceTitle.textContent = `${q.category} · ${q.type || "单选题"} · ${q.difficulty}`;
  practiceStem.textContent = q.stem;
  document.getElementById("practiceSource")?.remove();
  practiceStem.insertAdjacentHTML("afterend", `<div class="source-note" id="practiceSource">来源：${html(q.sourceType || "自建题库")} · ${html(q.licenseNote || "请确认内容来源合规")}</div>`);
  optionList.innerHTML = (q.options || []).map((option, i) => {
    const letter = String.fromCharCode(65 + i);
    return `<button class="option-btn" type="button" data-option="${letter}"><strong>${letter}</strong><span>${html(option)}</span></button>`;
  }).join("");
  practiceExplain.classList.add("hidden");
  practiceExplain.innerHTML = "";
  icons();
}

function collect() {
  return {
    examType: examType.value,
    subject: subject.value,
    question: question.value.trim(),
    myAnswer: myAnswer.value.trim(),
    correctAnswer: correctAnswer.value.trim(),
    thinking: thinking.value.trim(),
    focuses: Array.from(document.querySelectorAll("#focuses input:checked")).map((i) => i.value)
  };
}

function mdToHtml(markdown) {
  return markdown.split(/\r?\n/).map((line) => {
    const t = line.trim();
    if (!t) return "";
    if (t.startsWith("## ")) return `<h2>${html(t.slice(3))}</h2>`;
    if (/^[-*]\s+/.test(t)) return `<li>${html(t.replace(/^[-*]\s+/, ""))}</li>`;
    if (/^\d+\.\s+/.test(t)) return `<li>${html(t.replace(/^\d+\.\s+/, ""))}</li>`;
    return `<p>${html(t)}</p>`;
  }).join("");
}

function localMarkdown(data, reason = "") {
  return `## 本地备用诊断\n${reason ? `备用原因：${reason}\n` : ""}\n## 初步判断\n- 考试类型：${data.examType}\n- 科目模块：${data.subject}\n- 我的答案：${data.myAnswer || "未填写"}\n- 正确答案：${data.correctAnswer || "未提供"}\n\n## 思维评价\n你已经写出了自己的推理过程，这是很好的复盘习惯。请重点检查题干条件是否完整转化、是否把可能为真误当成一定为真、是否混淆概念定义。\n\n## 纠正方法\n1. 先把题干条件逐条翻译成逻辑关系或关键词。\n2. 再用已知条件排除不可能选项。\n3. 最后只选择“一定成立”的结论，不要选择“可能成立”的结论。\n\n## 错题本总结\n- 知识点：${data.subject}\n- 错因：推理链不完整或概念混淆\n- 下次提醒：先判断题目问的是“一定为真”还是“可能为真”。`;
}

function renderMarkdown(markdown, mode, reason = "") {
  latestMarkdown = markdown;
  latestMode = mode;
  score.textContent = mode === "ai" ? "AI" : "备";
  scoreLabel.textContent = mode === "ai" ? "智能诊断" : "本地备用";
  generatedAt.textContent = `${mode === "ai" ? "AI 已诊断" : "本地备用已生成"}：${new Date().toLocaleString("zh-CN", { hour12: false })}`;
  result.innerHTML = `<section class="result-section"><div class="tagline"><span class="tag">${mode === "ai" ? "AI 思维诊断" : "本地备用生成"}</span>${reason ? `<span class="tag">备用原因：${html(reason)}</span>` : ""}</div></section><section class="result-section"><div class="markdown-result">${mdToHtml(markdown)}</div></section><section class="result-section"><div class="btn-row"><button class="btn primary" type="button" id="copyBtn"><i data-lucide="copy"></i> 复制诊断</button><button class="btn" type="button" id="downloadBtn"><i data-lucide="download"></i> 下载错题总结</button></div></section>`;
  $("copyBtn").onclick = async () => { await navigator.clipboard.writeText(latestMarkdown); toastMsg("诊断结果已复制"); };
  $("downloadBtn").onclick = () => {
    const blob = new Blob([latestMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = latestMode === "ai" ? "ai-exam-coach-diagnosis.md" : "exam-coach-fallback.md";
    a.click();
    URL.revokeObjectURL(url);
  };
  icons();
}

function loading() {
  score.textContent = "...";
  scoreLabel.textContent = "诊断中";
  generatedAt.textContent = "AI 正在分析你的答案、推理链和错因。";
  result.innerHTML = '<div class="loading-box"><div><div class="spinner"></div><p>正在定位知识点、拆解做题思路、生成纠正建议...</p></div></div>';
}

async function callAi(data) {
  const res = await fetch("/api/generate-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.error || "AI 接口调用失败");
  return payload;
}

function saveRecord(data, markdown, mode) {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  list.unshift({ id: Date.now(), createdAt: new Date().toISOString(), data, markdown, mode, status: data.correctAnswer && data.myAnswer && data.correctAnswer.toLowerCase() === data.myAnswer.toLowerCase() ? "correct" : "mistake" });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 80)));
  renderRecords();
}

async function diagnose() {
  const data = collect();
  if (!data.question) return toastMsg("请先粘贴题目内容");
  if (!data.thinking) return toastMsg("请写下你的做题思路");
  loading();
  try {
    const payload = await callAi(data);
    renderMarkdown(payload.markdown || "", "ai");
    saveRecord(data, payload.markdown || "", "ai");
  } catch (error) {
    const text = localMarkdown(data, error.message);
    renderMarkdown(text, "local", error.message);
    saveRecord(data, text, "local");
  }
}

function renderRecords() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  $("totalCount").textContent = String(list.length);
  $("mistakeCount").textContent = String(list.filter((r) => r.status === "mistake").length);
  $("lastSubject").textContent = list[0]?.data?.subject || "--";
  const item = (r) => `<article class="record-item"><div><div class="record-title">${html((r.data.question || "未命名题目").slice(0, 44))}</div><div class="record-meta"><span>${html(r.data.examType)}</span><span>${html(r.data.subject)}</span><span>${new Date(r.createdAt).toLocaleString("zh-CN", { hour12: false })}</span></div></div><div class="record-actions"><span class="record-status ${r.status}">${r.status === "mistake" ? "待复盘" : "已正确"}</span></div></article>`;
  $("historyList").innerHTML = list.length ? list.slice(0, 12).map(item).join("") : '<div class="record-empty">还没有诊断记录。完成一次诊断后，这里会自动保存。</div>';
  $("mistakeList").innerHTML = list.filter((r) => r.status === "mistake").length ? list.filter((r) => r.status === "mistake").slice(0, 12).map(item).join("") : '<div class="record-empty">当前没有待复盘错题。</div>';
}

function applySample(key) {
  const data = samples[key];
  examType.value = data.examType;
  subject.value = data.subject;
  question.value = data.question;
  myAnswer.value = data.myAnswer;
  correctAnswer.value = data.correctAnswer;
  thinking.value = data.thinking;
  document.querySelectorAll(".template-btn").forEach((button) => button.classList.toggle("active", button.dataset.template === key));
}

async function generateSimilar() {
  const q = activeQuestion();
  const data = {
    examType: q.examType,
    subject: q.subject,
    question: `请基于以下题目的知识点，原创生成 3 道同类训练题，不要照搬题干和选项。\n\n原题：${q.stem}\n选项：${(q.options || []).join(" / ")}\n正确答案：${q.answer}\n解析：${q.explanation}`,
    myAnswer: "",
    correctAnswer: "",
    thinking: "请生成同类训练题，并标注每题答案、解析、知识点、难度和版权说明：AI 原创训练题，仅作练习参考。",
    focuses: ["相似题训练建议", "知识点定位", "正确解题路径"]
  };
  loading();
  try {
    const payload = await callAi(data);
    renderMarkdown(payload.markdown || "", "ai");
  } catch (error) {
    renderMarkdown(localMarkdown(data, error.message), "local", error.message);
  }
}

bankFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  activeExam = "全部";
  activeType = "全部";
  activeDifficulty = "全部";
  activeIndex = 0;
  renderFilters();
  renderQuestion();
});

bankFilters.addEventListener("change", (event) => {
  const input = event.target.closest("[data-filter]");
  if (!input) return;
  if (input.dataset.filter === "exam") activeExam = input.value;
  if (input.dataset.filter === "type") activeType = input.value;
  if (input.dataset.filter === "difficulty") activeDifficulty = input.value;
  activeIndex = 0;
  renderFilters();
  renderQuestion();
});

optionList.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-option]");
  if (!btn) return;
  selectedOption = btn.dataset.option;
  document.querySelectorAll(".option-btn").forEach((item) => item.classList.toggle("selected", item === btn));
});

$("checkAnswerBtn").onclick = () => {
  const q = activeQuestion();
  if (!selectedOption) return toastMsg("请先选择一个答案");
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.classList.toggle("correct", btn.dataset.option === q.answer);
    btn.classList.toggle("wrong", btn.dataset.option === selectedOption && selectedOption !== q.answer);
  });
  practiceExplain.classList.remove("hidden");
  practiceExplain.innerHTML = `<strong>${selectedOption === q.answer ? "答对了" : "这题需要复盘"}</strong><p>正确答案：${html(q.answer)}</p><p>${html(q.explanation)}</p>`;
};

$("nextQuestionBtn").onclick = () => { activeIndex = (activeIndex + 1) % Math.max(filtered().length, 1); renderQuestion(); };
$("sendToCoachBtn").onclick = () => {
  const q = activeQuestion();
  examType.value = q.examType;
  subject.value = q.subject;
  question.value = `${q.stem}\n${(q.options || []).map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`).join("\n")}`;
  myAnswer.value = selectedOption;
  correctAnswer.value = q.answer;
  thinking.value = selectedOption ? `我在题库练习中选择了 ${selectedOption}，请帮我判断知识点、解题路径和容易出错的地方。` : "我还没有作答，想先让 AI 讲清楚这道题的知识点和解题方法。";
  scrollTo({ top: 0, behavior: "smooth" });
};

form.addEventListener("submit", (event) => { event.preventDefault(); diagnose(); });
document.querySelectorAll(".template-btn").forEach((button) => button.onclick = () => applySample(button.dataset.template));
$("resetBtn").onclick = () => applySample("civil");
$("sampleBtn").onclick = () => applySample(["civil", "public", "teacher", "essay"][Math.floor(Math.random() * 4)]);
document.querySelectorAll(".record-tab").forEach((button) => button.onclick = () => {
  document.querySelectorAll(".record-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
  $("historyList").classList.toggle("hidden", button.dataset.recordTab !== "history");
  $("mistakeList").classList.toggle("hidden", button.dataset.recordTab !== "mistakes");
});
$("exportRecordsBtn").onclick = () => toastMsg("v0.4 简版记录已保存在浏览器，v0.5 将升级导入导出");
$("clearRecordsBtn").onclick = () => { localStorage.removeItem(STORAGE_KEY); renderRecords(); toastMsg("学习记录已清空"); };

upgradeStaticPage();
loadQuestions().then(() => { renderFilters(); renderQuestion(); });
renderMarkdown(localMarkdown(collect()), "local");
renderRecords();
setTimeout(() => { $("generateSimilarBtn")?.addEventListener("click", generateSimilar); icons(); }, 0);
icons();
