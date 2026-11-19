/* ============================================================
   作品集 · 交互脚本 v3
   数据渲染 / 3D 倾斜 / 滚动进度 / 光晕跟随 / 磁力按钮 /
   渐进入场 / 打字机 / 数字动画 / 导航 / 移动菜单
   ============================================================ */

/* ---------- 1. 作品数据 ---------- */
const projects = [
  {
    title: "AI Agent 自动化工作流",
    org: "B 端安全数据平台 · AI Agent 自动化",
    date: "2026.05 — 2026.09",
    desc: "基于自研 Agent 平台编排数据校验自动化工作流，设计并封装数据抽取、规则校验、异常告警等多个 Skill 节点，将人工多环节串联为端到端自动化链路。",
    category: "AI 应用",
    tags: ["Agent 工作流", "Skill 设计", "Prompt 工程", "自动化"],
    icon: "◇",
    colors: ["#8b7cff", "#5aa9ff"],
    highlights: ["7×24 稳定运行", "Token 成本压缩", "端到端自动化"],
    hot: true,
  },
  {
    title: "基于 NLP 的工业互联网漏洞知识图谱",
    org: "AI 项目 · 主要负责人",
    date: "2023.07 — 2024.06",
    desc: "针对漏洞信息碎片化痛点，设计「采集 → 清洗 → 信息抽取 → 图谱构建」整体方案，应用 NER 抽取漏洞特征并完成 PyTorch/TensorFlow 与 CUDA 环境适配。",
    category: "数据智能",
    tags: ["NER", "知识图谱", "PyTorch", "信息抽取"],
    icon: "◈",
    colors: ["#46e0c4", "#5aa9ff"],
    highlights: ["抽取效率 +30%", "数万节点图谱", "自动化分析与预警"],
    hot: true,
  },
  {
    title: "「乐活运动」微信小程序",
    org: "工程项目 · 项目负责人",
    date: "2024.08 — 2025.04",
    desc: "对接需求调研与方案设计，确定 Vue + SpringBoot + MySQL 前后端分离架构，负责支付接口安全加固与敏感数据 AES 加密存储方案。",
    category: "全栈工程",
    tags: ["Vue", "SpringBoot", "MySQL", "JWT / AES"],
    icon: "▦",
    colors: ["#ff6ba8", "#8b7cff"],
    highlights: ["数千名用户", "零注入/越权漏洞", "安全日志审计"],
  },
  {
    title: "多线程 TCP 安全日志传输系统",
    org: "工程项目 · 负责人",
    date: "2024.01 — 2024.06",
    desc: "面向工业互联网安全日志审计场景，基于 Winsock2 搭建 Server/Client 架构，std::thread 实现多客户端并发，结合 AES 加密与心跳机制保障实时可靠传输。",
    category: "系统开发",
    tags: ["C++", "Winsock2", "多线程", "AES"],
    icon: "⬡",
    colors: ["#ffb86c", "#ff6ba8"],
    highlights: ["多客户端并发", "AES 加密", "心跳机制"],
  },
];

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = projects.map((p, i) => `
    <article class="project-card reveal" style="transition-delay:${(i % 3) * 0.08}s" data-index="${i}">
      <div class="project-thumb">
        <div class="thumb-glow" style="color:${p.colors[0]}"></div>
        <span class="thumb-icon" style="text-shadow:0 0 30px ${p.colors[1]}">${p.icon}</span>
        <span class="project-date">${p.date}</span>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-badge">${p.category}</span>
          ${p.hot ? '<span class="project-badge hot">精选</span>' : ""}
        </div>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-org">${p.org}</div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-highlights">${p.highlights.map(h => `<span class="hl">✦ ${h}</span>`).join("")}</div>
        <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
      </div>
    </article>
  `).join("");
}
renderProjects();

/* ---------- 2. 3D 倾斜 ---------- */
function initTilt(selector, maxRotate = 10) {
  document.querySelectorAll(selector).forEach(el => {
    const reset = () => { el.style.transform = ""; el.style.boxShadow = ""; };
    let rect = null;
    el.addEventListener("mouseenter", () => { rect = el.getBoundingClientRect(); });
    el.addEventListener("mousemove", e => {
      // 滚动期间跳过，避免 getBoundingClientRect 强制布局与滚动冲突
      if (document.body.classList.contains("is-scrolling")) return;
      if (!rect) rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * maxRotate).toFixed(2)}deg) rotateY(${(px * maxRotate).toFixed(2)}deg) translateY(-6px)`;
      el.style.boxShadow = `${-px * 20}px ${py * 20 + 16}px 45px rgba(0,0,0,0.5), 0 0 32px rgba(139,124,255,0.18)`;
    });
    el.addEventListener("mouseleave", () => { rect = null; reset(); });
  });
}
initTilt(".project-card", 9);
initTilt(".skill-category", 8);
initTilt(".contact-card", 6);

/* ---------- 3. Hero 视差 ---------- */
const heroVisual = document.getElementById("heroVisual");
if (heroVisual && window.matchMedia("(pointer:fine)").matches) {
  const hero = document.querySelector(".hero");
  const layers = heroVisual.querySelectorAll("[data-depth]");
  let rect = null;
  hero.addEventListener("mouseenter", () => { rect = heroVisual.getBoundingClientRect(); });
  hero.addEventListener("mousemove", e => {
    // 滚动期间跳过视差计算，避免强制布局
    if (document.body.classList.contains("is-scrolling")) return;
    if (!rect) rect = heroVisual.getBoundingClientRect();
    const px = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const py = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    layers.forEach(el => {
      const d = parseFloat(el.dataset.depth) || 1;
      el.style.translate = `${(-px * 20 * d).toFixed(1)}px ${(-py * 20 * d).toFixed(1)}px`;
    });
  });
  hero.addEventListener("mouseleave", () => {
    rect = null;
    layers.forEach(el => { el.style.translate = ""; });
  });
}

/* ---------- 4. 滚动进度条 + 导航状态（rAF 节流 + 缓存布局） ---------- */
const progress = document.getElementById("scrollProgress");
const header = document.getElementById("siteHeader");
let ticking = false, maxScroll = 1, wasScrolled = false;
function measure() {
  maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}
function onScroll() {
  const y = window.scrollY;
  // 用 transform scaleX 代替修改 width，避免触发重排
  if (progress) progress.style.transform = `scaleX(${y / maxScroll})`;
  const scrolled = y > 24;
  if (scrolled !== wasScrolled) {
    header.classList.toggle("scrolled", scrolled);
    wasScrolled = scrolled;
  }
  ticking = false;
}
let scrollEndTimer = null;
window.addEventListener("scroll", () => {
  // 滚动期间暂停装饰性无限动画，把合成/主线程资源让给滚动本身
  document.body.classList.add("is-scrolling");
  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => document.body.classList.remove("is-scrolling"), 180);
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
window.addEventListener("resize", measure, { passive: true });
measure();
onScroll();

/* ---------- 5. 鼠标光晕（交给 CSS transition 合成，不占用主线程 rAF） ---------- */
const glow = document.getElementById("cursorGlow");
if (glow && window.matchMedia("(pointer:fine)").matches) {
  let moveTick = false, px = 0, py = 0;
  window.addEventListener("mousemove", e => {
    px = e.clientX; py = e.clientY;
    if (!moveTick) {
      moveTick = true;
      requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
        moveTick = false;
      });
    }
  }, { passive: true });
}

/* ---------- 6. 磁力按钮 ---------- */
if (window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".magnetic").forEach(btn => {
    let rect = null;
    btn.addEventListener("mouseenter", () => { rect = btn.getBoundingClientRect(); });
    btn.addEventListener("mousemove", e => {
      if (document.body.classList.contains("is-scrolling")) return;
      if (!rect) rect = btn.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.25}px)`;
    });
    btn.addEventListener("mouseleave", () => { rect = null; btn.style.transform = ""; });
  });
}

/* ---------- 7. 渐进入场 ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- 8. 数字递增 ---------- */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1500;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * eased) + (p === 1 ? "+" : "");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const metaObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      metaObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroMeta = document.querySelector(".hero-meta");
if (heroMeta) metaObserver.observe(heroMeta);

/* ---------- 9. 打字机 ---------- */
const typedEl = document.getElementById("typed");
if (typedEl) {
  const words = ["变成真实的产品", "从想法走向落地", "用数据驱动决策"];
  let wi = 0, ci = words[0].length, deleting = false;
  const tick = () => {
    // 滚动过程中暂停打字机，避免与滚动争抢主线程
    if (document.body.classList.contains("is-scrolling")) {
      setTimeout(tick, 120);
      return;
    }
    const word = words[wi];
    typedEl.textContent = word.slice(0, ci);
    if (!deleting) {
      ci--;
      if (ci === 0) { deleting = true; setTimeout(tick, 500); return; }
    } else {
      ci++;
      if (ci > word.length) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 1800); return; }
    }
    setTimeout(tick, deleting ? 80 : 45);
  };
  tick();
}

/* ---------- 10. 导航高亮 / 移动菜单 / 年份 ---------- */
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
    }
  });
}, { threshold: 0.35, rootMargin: "-20% 0px -60% 0px" });
sections.forEach(s => navObserver.observe(s));

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("navLinks");
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
