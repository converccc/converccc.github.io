/* ============================================================
   作品集 · 交互脚本（路云杰 · AI 产品经理）
   1. 经历/项目数据渲染
   2. 鼠标跟随 3D 倾斜
   3. 滚动显现
   4. 打字机 / 数字动画 / 导航 / 移动菜单
   ============================================================ */

/* ---------- 1. 项目/经历数据 ---------- */
const projects = [
  {
    title: "AI Agent 自动化工作流",
    org: "北京微步在线科技（ThreatBook）· 全栈工程师实习",
    date: "2026.05 — 2026.09",
    desc: "基于公司自研 Agent 平台编排数据校验自动化工作流，设计并封装数据抽取、规则校验、异常告警等多个 Skill 节点，将人工多环节串联为端到端自动化链路。",
    category: "实习经历",
    tags: ["Agent 工作流", "Skill 设计", "Prompt 工程", "B 端安全平台"],
    icon: "◇",
    colors: ["#7c5cff", "#4facfe"],
    highlights: ["7×24 稳定运行", "Token 成本压缩", "端到端自动化链路"],
    hot: true,
  },
  {
    title: "基于 NLP 的工业互联网漏洞知识图谱",
    org: "主要负责人 · AI 项目",
    date: "2023.07 — 2024.06",
    desc: "针对漏洞信息碎片化痛点，设计「采集 → 清洗 → 信息抽取 → 图谱构建」整体方案，应用 NER 抽取漏洞特征并完成 PyTorch/TensorFlow 与 CUDA 环境适配。",
    category: "AI 项目",
    tags: ["NER", "知识图谱", "PyTorch", "信息抽取"],
    icon: "◈",
    colors: ["#00e5c4", "#4facfe"],
    highlights: ["抽取效率 +30%", "数万节点图谱", "自动化分析与预警"],
    hot: true,
  },
  {
    title: "「乐活运动」微信小程序",
    org: "项目负责人",
    date: "2024.08 — 2025.04",
    desc: "对接客户完成需求调研与 PRD 撰写，确定 Vue + SpringBoot + MySQL 前后端分离架构，负责支付接口安全加固与敏感数据 AES 加密存储方案。",
    category: "工程项目",
    tags: ["Vue", "SpringBoot", "MySQL", "JWT / AES"],
    icon: "▦",
    colors: ["#ff5c9d", "#7c5cff"],
    highlights: ["数千名用户", "零注入/越权漏洞", "安全日志审计"],
  },
  {
    title: "多线程 TCP 安全日志传输系统",
    org: "负责人",
    date: "2024.01 — 2024.06",
    desc: "面向工业互联网安全日志审计场景，基于 Winsock2 搭建 Server/Client 架构，std::thread 实现多客户端并发，结合 AES 加密与心跳机制保障实时可靠传输。",
    category: "工程项目",
    tags: ["C++", "Winsock2", "多线程", "AES"],
    icon: "⬡",
    colors: ["#ffb86c", "#ff5c9d"],
    highlights: ["多客户端并发", "AES 加密", "心跳机制"],
  },
];

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;
  grid.innerHTML = projects.map((p, i) => `
    <article class="project-card reveal" style="transition-delay:${(i % 3) * 0.08}s" data-index="${i}">
      <div class="project-thumb">
        <div class="thumb-glow" style="background:${p.colors[0]}"></div>
        <span class="thumb-icon" style="text-shadow:0 0 30px ${p.colors[1]}">${p.icon}</span>
        <span class="project-date">${p.date}</span>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-badge">${p.category}</span>
          ${p.hot ? '<span class="project-badge hot">重点</span>' : ""}
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

/* ---------- 2. 鼠标跟随 3D 倾斜 ---------- */
function initTilt(selector, maxRotate = 10) {
  document.querySelectorAll(selector).forEach(el => {
    const reset = () => {
      el.style.transform = "";
      el.style.boxShadow = "";
    };
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-py * maxRotate).toFixed(2);
      const ry = (px * maxRotate).toFixed(2);
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      el.style.boxShadow = `${-px * 20}px ${py * 20 + 16}px 40px rgba(0,0,0,0.45), 0 0 30px rgba(124,92,255,0.18)`;
    });
    el.addEventListener("mouseleave", reset);
  });
}
initTilt(".project-card", 9);
initTilt(".glass-card", 10);
initTilt(".contact-card", 6);

/* ---------- 3. Hero 视差跟随 ---------- */
const heroVisual = document.getElementById("heroVisual");
if (heroVisual && window.matchMedia("(pointer:fine)").matches) {
  document.querySelector(".hero").addEventListener("mousemove", e => {
    const r = heroVisual.getBoundingClientRect();
    const px = (e.clientX - (r.left + r.width / 2)) / r.width;
    const py = (e.clientY - (r.top + r.height / 2)) / r.height;
    heroVisual.querySelectorAll("[data-depth]").forEach(el => {
      const d = parseFloat(el.dataset.depth) || 1;
      el.style.translate = `${(-px * 18 * d).toFixed(1)}px ${(-py * 18 * d).toFixed(1)}px`;
    });
  });
  document.querySelector(".hero").addEventListener("mouseleave", () => {
    heroVisual.querySelectorAll("[data-depth]").forEach(el => { el.style.translate = ""; });
  });
}

/* ---------- 4. 滚动显现 ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- 5. 数字递增动画 ---------- */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
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

/* ---------- 6. 打字机 ---------- */
const typedEl = document.getElementById("typed");
if (typedEl) {
  const words = ["AI 产品经理", "AI 产品探索者", "技术与产品的桥梁", "全栈背景的产品人"];
  let wi = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = words[wi];
    typedEl.textContent = word.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > word.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, deleting ? 70 : 130);
  };
  tick();
}

/* ---------- 7. 导航高亮 / 滚动头部 / 移动菜单 ---------- */
const header = document.getElementById("siteHeader");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

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

/* ---------- 8. 年份 ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
