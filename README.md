# Deep Skills Wiki (xp-55.github.io)

这是我的个人技术博客网站的源代码仓库。

## 🛠️ 技术栈

- **框架**: [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
- **部署**: [GitHub Actions](.github/workflows/deploy.yml)
- **静态托管**: GitHub Pages
- **自定义域名**: [deepskills.wiki](https://deepskills.wiki)

## 📁 项目结构

- `docs/`: 存放所有 Markdown 源码文件。
  - `blog/`: 存放博文。
  - `index.md`: 网站首页内容。
- `mkdocs.yml`: 网站配置文件（主题、插件、导航等）。
- `.github/workflows/`: 存放自动化部署工作流。

## 🚀 本地开发

如果您想在本地预览网站，请确保已安装 Python：

```bash
# 安装依赖
pip install mkdocs-material

# 启动本地开发服务器
mkdocs serve
```

然后访问 `http://127.0.0.1:8000/` 即可预览。

## 📄 许可

MIT License
