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

const questionBank = [
  {
    id: "civil-logic-1",
    category: "公职类",
    examType: "考公",
    subject: "行测-判断推理",
    chapter: "翻译推理",
    difficulty: "基础",
    stem: "如果某人参加甲项目，就必须参加乙项目。现在小王没有参加乙项目。以下哪项一定为真？",
    options: ["小王参加了甲项目", "小王没有参加甲项目", "小王参加了乙项目", "不能判断小王是否参加甲项目"],
    answer: "B",
    explanation: "题干是“甲 -> 乙”。已知“非乙”，根据逆否命题可推出“非甲”。这类题要先把条件翻译成逻辑箭头。"
  },
  {
    id: "public-law-1",
    category: "公职类",
    examType: "事业编/考编",
    subject: "公共基础知识",
    chapter: "行政法",
    difficulty: "基础",
    stem: "行政处罚与行政强制的主要区别，下列说法更准确的是哪一项？",
    options: ["行政处罚重在惩戒违法行为，行政强制重在保障行政决定执行或防止危害扩大", "二者都只能由法院实施", "行政强制一定是罚款", "行政处罚不需要法律依据"],
    answer: "A",
    explanation: "行政处罚强调对违法行为的惩戒，行政强制强调执行保障或防止危害扩大。看到“强制”不能直接等同于罚款。"
  },
  {
    id: "teacher-learning-1",
    category: "教师类",
    examType: "教师资格证",
    subject: "教育知识与能力",
    chapter: "学习理论",
    difficulty: "基础",
    stem: "学生通过观察教师示范后学会某种行为，这主要体现了哪种学习理论？",
    options: ["经典条件反射", "操作性条件反射", "社会学习理论", "认知结构学习理论"],
    answer: "C",
    explanation: "观察榜样并模仿属于班杜拉社会学习理论。操作性条件反射更强调强化与行为后果。"
  },
  {
    id: "cet4-vocab-1",
    category: "英语类",
    examType: "大学英语四级",
    subject: "英语-词汇语法",
    chapter: "核心词汇",
    difficulty: "基础",
    stem: "The university plans to ______ more scholarships for students from low-income families.",
    options: ["provide", "prevent", "pretend", "prefer"],
    answer: "A",
    explanation: "provide scholarships 表示“提供奖学金”。prevent 是阻止，pretend 是假装，prefer 是更喜欢。"
  },
  {
    id: "cet6-reading-1",
    category: "英语类",
    examType: "大学英语六级",
    subject: "英语-阅读理解",
    chapter: "主旨判断",
    difficulty: "中等",
    stem: "In academic reading, the main idea of a paragraph is most often found by identifying the sentence that controls the supporting details. What should a reader focus on first?",
    options: ["Every unfamiliar word", "The topic sentence and logical connectors", "Only the last sentence", "The longest sentence"],
    answer: "B",
    explanation: "六级阅读主旨题要优先抓主题句和逻辑连接词，再看例子、数据和解释如何支撑中心。"
  },
  {
    id: "postgrad-english-1",
    category: "学历升学类",
    examType: "考研",
    subject: "英语-阅读理解",
    chapter: "态度题",
    difficulty: "中等",
    stem: "考研英语阅读中，作者态度题最应该优先依据什么判断？",
    options: ["自己对话题的看法", "文中评价性形容词、副词和转折后的重点", "文章出现次数最多的名词", "选项中最绝对的表达"],
    answer: "B",
    explanation: "态度题要回到原文，通过评价性词语、转折关系和作者结论判断，不能代入自己的立场。"
  },
  {
    id: "qualification-law-1",
    category: "职业资格类",
    examType: "职业资格考试",
    subject: "职业资格-法律法规",
    chapter: "合规基础",
    difficulty: "基础",
    stem: "职业资格类考试中，遇到法律条文题，最稳妥的解题顺序是？",
    options: ["先凭生活经验判断", "先看主体、行为、条件、法律后果", "只看选项长度", "优先选择语气最强的选项"],
    answer: "B",
    explanation: "法规题要拆主体、行为、条件和法律后果。生活经验可以辅助理解，但不能替代条文逻辑。"
  },
  {
    id: "adult-education-1",
    category: "学历升学类",
    examType: "专升本/自考",
    subject: "英语-词汇语法",
    chapter: "语法基础",
    difficulty: "基础",
    stem: "I will call you as soon as I ______ home.",
    options: ["get", "got", "will get", "am getting"],
    answer: "A",
    explanation: "as soon as 引导时间状语从句时，主句用将来时，从句通常用一般现在时表将来。"
  }
];

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
const bankCount = document.getElementById("bankCount");
const bankFilters = document.getElementById("bankFilters");
const practiceExam = document.getElementById("practiceExam");
const practiceSubject = document.getElementById("practiceSubject");
const practiceProgress = document.getElementById("practiceProgress");
const practiceTitle = document.getElementById("practiceTitle");
const practiceStem = document.getElementById("practiceStem");
const optionList = document.getElementById("optionList");
const practiceExplain = document.getElementById("practiceExplain");
const STORAGE_KEY = "ai-exam-coach-records-v2";
let latestMarkdown = "";
let latestMode = "local";
let latestData = null;
let activeCategory = "全部";
let activeQuestionIndex = 0;
let selectedOption = "";

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

function getFilteredQuestions() {
  return activeCategory === "全部"
    ? questionBank
    : questionBank.filter((item) => item.category === activeCategory);
}

function getActiveQuestion() {
  const questions = getFilteredQuestions();
  return questions[activeQuestionIndex % questions.length] || questionBank[0];
}

function renderBankFilters() {
  const categories = ["全部", ...new Set(questionBank.map((item) => item.category))];
  bankFilters.innerHTML = categories.map((category) => `
    <button class="bank-filter ${category === activeCategory ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </button>
  `).join("");
  bankCount.textContent = String(getFilteredQuestions().length);
}

function renderPracticeQuestion() {
  const questions = getFilteredQuestions();
  const current = getActiveQuestion();
  selectedOption = "";
  practiceExam.textContent = current.examType;
  practiceSubject.textContent = `${current.subject} / ${current.chapter}`;
  practiceProgress.textContent = `${activeQuestionIndex + 1} / ${questions.length}`;
  practiceTitle.textContent = `${current.category} · ${current.difficulty}`;
  practiceStem.textContent = current.stem;
  practiceExplain.classList.add("hidden");
  practiceExplain.innerHTML = "";
  optionList.innerHTML = current.options.map((option, index) => {
    const letter = String.fromCharCode(65 + index);
    return `
      <button class="option-btn" type="button" data-option="${letter}">
        <strong>${letter}</strong><span>${escapeHtml(option)}</span>
      </button>
    `;
  }).join("");
  iconRefresh();
}

function selectPracticeOption(option) {
  selectedOption = option;
  document.querySelectorAll(".option-btn").forEach((button) => {
    button.classList.toggle("selected", button.dataset.option === option);
  });
}

function checkPracticeAnswer() {
  const current = getActiveQuestion();
  if (!selectedOption) {
    showToast("请先选择一个答案");
    return;
  }
  const isCorrect = selectedOption === current.answer;
  document.querySelectorAll(".option-btn").forEach((button) => {
    button.classList.toggle("correct", button.dataset.option === current.answer);
    button.classList.toggle("wrong", button.dataset.option === selectedOption && !isCorrect);
  });
  practiceExplain.classList.remove("hidden");
  practiceExplain.innerHTML = `
    <strong>${isCorrect ? "答对了" : "这题需要复盘"}</strong>
    <p>正确答案：${current.answer}</p>
    <p>${escapeHtml(current.explanation)}</p>
  `;
  showToast(isCorrect ? "答对了，继续保持" : "已显示解析，可交给 AI 诊断");
}

function nextPracticeQuestion() {
  const questions = getFilteredQuestions();
  activeQuestionIndex = (activeQuestionIndex + 1) % questions.length;
  renderPracticeQuestion();
}

function sendPracticeToCoach() {
  const current = getActiveQuestion();
  examType.value = current.examType;
  subject.value = current.subject;
  question.value = `${current.stem}\nA. ${current.options[0]}\nB. ${current.options[1]}\nC. ${current.options[2]}\nD. ${current.options[3]}`;
  myAnswer.value = selectedOption || "";
  correctAnswer.value = current.answer;
  thinking.value = selectedOption
    ? `我在题库练习中选择了 ${selectedOption}，但我想让 AI 帮我判断这道题的知识点、解题路径和容易出错的地方。`
    : "我还没有作答，想先让 AI 帮我讲清楚这道题的知识点和解题方法。";
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("题目已带入 AI 诊断区");
}

function initQuestionBank() {
  renderBankFilters();
  renderPracticeQuestion();
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

bankFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  activeQuestionIndex = 0;
  renderBankFilters();
  renderPracticeQuestion();
});

optionList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option]");
  if (!button) return;
  selectPracticeOption(button.dataset.option);
});

document.getElementById("checkAnswerBtn").addEventListener("click", checkPracticeAnswer);
document.getElementById("nextQuestionBtn").addEventListener("click", nextPracticeQuestion);
document.getElementById("sendToCoachBtn").addEventListener("click", sendPracticeToCoach);

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
initQuestionBank();
