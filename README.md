# DeepSkills · Security & Cloud Notes

专注网络安全、Check Point、云安全与 AI+安全的知识与实战沉淀。此仓库为网站源码，在线站点见 [deepskills.wiki](https://deepskills.wiki)。

## 特性

- Material for MkDocs 架构，专注阅读体验
- 博客与知识库一体化，目录清晰
- GitHub Actions 自动构建发布到 GitHub Pages
- 自定义域名与 CNAME 自动同步

## 目录结构

- `docs/` 网站内容
  - `blog/` 博文与作者配置
  - `index.md` 首页
  - 其他页面：about、projects、links 等
- `tools/` 文档工具脚本（如 `.docx` → Markdown 转换）
- `mkdocs.yml` 站点配置（主题、插件、导航）
- `.github/workflows/` 自动化工作流

## 将 Word 文档发布为博文

支持把 `.docx` 转为 Markdown 并发布到 `docs/blog/posts/`，自动移除作者行并可保留图片。

方式一：通过仓库内脚本

```bash
# 安装依赖（首次）
python3 -m pip install --user mammoth docx2python docx2md

# 安全文本模式
python3 tools/docx_to_md_flatten.py \
  --input /abs/path/to/file.docx \
  --output docs/blog/posts/my-post.md \
  --title "标题" \
  --date 2025-01-02

# 完整模式（尝试保留图片）
python3 tools/convert_docx.py \
  --input /abs/path/to/file.docx \
  --output docs/blog/posts/my-post.md \
  --assets-dir docs/blog/posts/my-post-assets \
  --title "标题" \
  --date 2025-01-02
```

方式二：在对话中直接说明“把某个 .docx 发布为博文”，我会按“docx2md”流程自动完成。

## 本地预览

```bash
pip install mkdocs-material
mkdocs serve
```

访问 http://127.0.0.1:8000/

## 许可证

MIT License
