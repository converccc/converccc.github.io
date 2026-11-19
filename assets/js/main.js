/* ============================================================
   作品集 · 交互脚本
   1. 作品卡片数据渲染
   2. 鼠标跟随 3D 倾斜
   3. 滚动显现
   4. 打字机 / 数字动画 / 导航 / 移动菜单
   ============================================================ */

/* ---------- 1. 作品数据 ---------- */
const projects = [
  {
    title: "Nebula 数据可视化平台",
    desc: "面向业务团队的实时数据看板，支持拖拽搭建图表、多数据源接入与权限管理。",
    category: "Web 应用",
    tags: ["React", "TypeScript", "ECharts", "Node.js"],
    icon: "◈",
    colors: ["#7c5cff", "#4facfe"],
    demo: "#", code: "#", hot: true,
  },
  {
    title: "Flow 协作任务系统",
    desc: "类 Trello 的看板协作工具，支持实时同步、评论与工作流自动化。",
    category: "生产力工具",
    tags: ["Next.js", "WebSocket", "PostgreSQL"],
    icon: "▦",
    colors: ["#00e5c4", "#4facfe"],
    demo: "#", code: "#",
  },
  {
    title: "DevKit 组件库",
    desc: "企业级 React 组件库，含 60+ 组件、主题定制与完整文档站。",
    category: "开源项目",
    tags: ["React", "Storybook", "Tailwind"],
    icon: "⬡",
    colors: ["#ff5c9d", "#7c5cff"],
    demo: "#", code: "#",
  },
  {
    title: "CloudDeploy 部署平台",
    desc: "简化 CI/CD 流程的轻量平台，一键构建、预览与回滚前端项目。",
    category: "DevOps",
    tags: ["Go", "Docker", "GitHub Actions"],
    icon: "☁",
    colors: ["#4facfe", "#00e5c4"],
    demo: "#", code: "#",
  },
  {
    title: "Ink 博客引擎",
    desc: "基于 Markdown 的极简博客系统，支持标签、搜索与静态生成。",
    category: "开源项目",
    tags: ["Astro", "Markdown", "Vercel"],
    icon: "✎",
    colors: ["#7c5cff", "#ff5c9d"],
    demo: "#", code: "#",
  },
  {
    title: "Shopify 电商中台",
    desc: "多商户电商后台，订单、库存、营销与数据分析一体化。",
    category: "Web 应用",
    tags: ["Vue 3", "Nuxt", "Redis"],
    icon: "◇",
    colors: ["#ffb86c", "#ff5c9d"],
    demo: "#", code: "#",
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
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-badge">${p.category}</span>
          ${p.hot ? '<span class="project-badge hot">热门</span>' : ""}
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${p.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <div class="project-links">
          <a href="${p.demo}" target="_blank" rel="noopener">在线预览 ↗</a>
          <a href="${p.code}" target="_blank" rel="noopener">源码 →</a>
        </div>
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
  const words = ["全栈开发者", "架构爱好者", "开源贡献者", "问题解决者"];
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
