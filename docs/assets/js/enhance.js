document.addEventListener('DOMContentLoaded', () => {
  // Post page: inject reading time and badges
  const h1 = document.querySelector('.md-content .md-typeset h1');
  const article = document.querySelector('.md-content .md-typeset');
  if (h1 && article) {
    const text = article.innerText || '';
    // Try to detect categories/tags/keywords from front matter rendered text
    const bodyText = text;
    const badges = [];
    const collect = (re) => {
      const m = bodyText.match(re);
      if (!m) return;
      m[1]
        .split(/\n|,|;/)
        .map(s => s.replace(/^-?\s*/,'').trim())
        .filter(Boolean)
        .slice(0,3)
        .forEach(v => badges.push(v));
    };
    collect(/categories?:\s*([\s\S]*?)(?:\n\w|$)/i);
    collect(/tags?:\s*([\s\S]*?)(?:\n\w|$)/i);
    collect(/keywords?:\s*([\s\S]*?)(?:\n\w|$)/i);
    if (badges.length) {
      const wrap = document.createElement('div');
      wrap.className = 'dsw-post-meta';
      badges.forEach(c => {
        const b = document.createElement('span');
        b.className = 'dsw-badge';
        b.textContent = c;
        wrap.appendChild(b);
      });
      h1.insertAdjacentElement('afterend', wrap);
    }
  }

  // Blog index: transform list into cards (best-effort)
  const possibleLists = Array.from(document.querySelectorAll('.md-content .md-typeset ul'));
  if (possibleLists.length) {
    // pick the longest list as posts list
    const list = possibleLists.reduce((a,b)=> (b.children.length>a.children.length?b:a));
    if (list && list.children.length >= 1) {
      const container = document.createElement('div');
      container.className = 'dsw-cards';
      Array.from(list.children).forEach(li => {
        const link = li.querySelector('a');
        if (!link) return;
        const card = document.createElement('div');
        card.className = 'dsw-card';
        const h3 = document.createElement('h3');
        h3.innerHTML = link.innerHTML;
        h3.querySelectorAll('small').forEach(s=>s.remove());
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.appendChild(h3);
        card.appendChild(a);
        container.appendChild(card);
      });
      // replace list
      list.replaceWith(container);
    }
  }

  // Home: render latest posts from sitemap.xml
  const homeContainer = document.querySelector('#dsw-home-posts');
  if (homeContainer) {
    const limit = 6;
    fetch('/sitemap.xml')
      .then(r => r.text())
      .then(xml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const urls = Array.from(doc.querySelectorAll('url'));
        const posts = urls
          .map(u => ({
            loc: u.querySelector('loc')?.textContent || '',
            lastmod: u.querySelector('lastmod')?.textContent || ''
          }))
          .filter(o => /\/posts\//.test(o.loc));
        posts.sort((a,b) => (b.lastmod||'').localeCompare(a.lastmod||''));
        return posts.slice(0, limit);
      })
      .then(list => Promise.all(list.map(item =>
        fetch(item.loc).then(r => r.text()).then(html => {
          const p = new DOMParser().parseFromString(html, 'text/html');
          const title = p.querySelector('.md-content h1')?.textContent?.trim()
                        || p.querySelector('title')?.textContent?.trim()
                        || item.loc.replace(/^.*\/([^/]+)\/?$/, '$1');
          return { href: item.loc, title };
        })).catch(() => ({ href: item.loc, title: item.loc }))
      ))
      .then(items => {
        items.forEach(it => {
          const card = document.createElement('div');
          card.className = 'dsw-card';
          const a = document.createElement('a');
          const h3 = document.createElement('h3');
          h3.textContent = it.title;
          a.href = it.href;
          a.appendChild(h3);
          card.appendChild(a);
          homeContainer.appendChild(card);
        });
      })
      .catch(() => {
        // fallback: simple link to blog index
        const a = document.createElement('a');
        a.href = '/posts/';
        a.textContent = '查看全部文章';
        homeContainer.appendChild(a);
      });
  }
});
