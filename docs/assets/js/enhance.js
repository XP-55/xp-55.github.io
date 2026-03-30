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
});
