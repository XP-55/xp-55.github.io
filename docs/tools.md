# 工具

常用脚本与片段，辅助内容发布与站点维护。

## 文档转换

- docx_to_md_flatten.py  
  将 .docx 转为 Markdown（安全模式），自动添加前置区块并移除作者行。

- convert_docx.py  
  将 .docx 转为 Markdown（完整模式），尝试保留图片，失败时可回退安全模式。

## 广告嵌入

- includes/adsense-inline.html  
  可在文章中通过 include 引入，展示内联广告位。

## 使用

```bash
# 安全文本
python3 tools/docx_to_md_flatten.py \
  --input /abs/path.docx \
  --output docs/blog/posts/my-post.md \
  --title "标题" --date 2026-01-01

# 完整模式（含图片）
python3 tools/convert_docx.py \
  --input /abs/path.docx \
  --output docs/blog/posts/my-post.md \
  --assets-dir docs/blog/posts/my-post-assets \
  --title "标题" --date 2026-01-01
```

