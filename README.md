# 路云杰 · AI 产品经理作品集

一套零依赖、纯静态的个人作品集网站。深色科技风 + 3D 悬浮卡片 + 玻璃拟态，内容基于个人简历（AI 产品经理方向）定制，开箱即用，直接部署到 GitHub Pages。

## 目录结构

```
portfolio/
├── index.html              # 页面结构
├── assets/
│   ├── css/style.css       # 全部样式（配色、3D 效果、动画、响应式）
│   └── js/main.js          # 交互（作品数据、3D 倾斜、打字机、滚动动画）
└── README.md
```

## 本地预览

直接双击 `index.html` 即可打开。或在目录内起一个本地服务：

```bash
cd portfolio
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 改成你自己的作品集

所有需要改的地方都集中在两处：

### 1. 个人信息 —— 编辑 `index.html`
- `<title>` 与 meta 描述：改成你的名字和简介
- Hero 区：名字、打字机职位文案、简介、统计数据
- 「关于我」区：自我介绍、坐标/状态/专注领域
- 「技能」区：技术栈标签与时间线经历
- 「联系」区：邮箱、GitHub、社交链接

### 2. 作品列表 —— 编辑 `assets/js/main.js` 顶部的 `projects` 数组

每份作品的字段说明：

| 字段 | 说明 |
|------|------|
| `title` | 作品名称 |
| `desc` | 一句话简介 |
| `category` | 分类标签（如 Web 应用 / 开源项目） |
| `tags` | 技术栈标签数组 |
| `icon` | 一个符号/emoji 作为封面图形 |
| `colors` | 封面光晕的两种颜色（十六进制） |
| `demo` / `code` | 在线预览与源码链接 |
| `hot` | `true` 时显示「热门」角标 |

新增一份作品，只需往数组里加一个对象，卡片会自动渲染并带上 3D 倾斜效果。

### 3. 配色 —— 编辑 `assets/css/style.css` 顶部的 `:root`

改 `--primary`、`--primary-2`、`--accent`、`--gradient`、`--grad-text` 等变量即可全局换色。

## 部署到 GitHub Pages

### 方式 A：仓库根目录（推荐，最简单）

1. 在 GitHub 新建一个仓库，名字必须是 **`你的用户名.github.io`**（例如 `zhangsan.github.io`）。
2. 把 `portfolio/` 里的**全部文件**上传到仓库根目录（不要套一层文件夹）。
3. 进入仓库 **Settings → Pages**，Source 选择 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存。
4. 等 1–2 分钟，访问 `https://你的用户名.github.io` 即可看到网站。

### 方式 B：项目仓库 + GitHub Actions 自动部署

1. 新建任意名称的仓库（如 `my-portfolio`），上传全部文件。
2. 在仓库新建文件 `.github/workflows/deploy.yml`，内容：

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Settings → Pages → Source 改为 **GitHub Actions**。
4. 以后每次 `git push`，网站自动更新。

### 绑定自定义域名（可选）

1. 在 `portfolio/` 根目录新建一个名为 `CNAME` 的文件（无扩展名），内容只写你的域名，例如：

```
portfolio.yourname.com
```

2. 到域名服务商的 DNS 解析里，添加一条记录：

- **主域名**：`A` 记录指向 `185.199.108.153`（以及 `109/110/111.153` 四条）
- **子域名**：`CNAME` 记录指向 `你的用户名.github.io`

3. GitHub 会自动签发免费 HTTPS 证书，勾选 `Enforce HTTPS`。

## 国内访问提示

GitHub Pages 在国内访问速度不稳定。如果访客主要在国内，可选其一：

- 套一层 Cloudflare CDN（把 NS 改到 Cloudflare，开启代理）
- 把同样的静态文件放到 **Vercel** 或 **Netlify**（部署方式类似，国内节点更友好）
- 用腾讯云 CloudBase / 阿里云 OSS 静态托管（国内速度最佳，但绑定域名需备案）

## 小贴士

- 修改后不用重新构建，纯静态文件推送即生效。
- 想换字体，改 `index.html` 里的 Google Fonts 链接，或换成本地字体。
- 所有动画都做了 `prefers-reduced-motion` 适配，照顾无障碍访问。
