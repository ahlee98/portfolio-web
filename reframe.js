// 문제 재정의 탭(MD의 '### 탭 NN · 제목' 카드): 탭마다 이미지 한 장 위에 말풍선과 원형 인사이트를 올린다.
// 카드 항목: '이미지'는 파일 이름(assets/<페이지 id>/), '가설'은 밝은 말풍선, 그 밖의 문장은 어두운 말풍선.
// '#### 소제목'(아이·부모·교사)은 이미지 아래쪽 원형 인사이트로 표시한다. 탭을 누르면 교체되고, 페이지에 들어올 때마다 첫 탭부터.
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function reframe(pageId, cards) {
  const dir = `./assets/${pageId}/`;
  return `<div class="reframe">
    <div class="reframe-stage">${cards.map((card, i) => `<div class="reframe-panel${card.columns ? ' is-framed' : ''}" data-i="${i}" role="tabpanel" aria-label="${escape(card.title)}">
      <div class="reframe-img">${card.image ? `<img data-src="${dir}${escape(card.image)}" alt="${escape(card.alt ?? card.title)}" decoding="async">` : ''}</div>
      ${card.bubbles.map((b, k) => `<p class="reframe-bubble ${b.light ? 'is-light' : 'is-dark'} b${k + 1}" style="--k:${k}">${escape(b.text)}</p>`).join('')}
      ${card.columns ? `<ul class="reframe-circles">${card.columns.map((col, k) => `<li style="--k:${k + card.bubbles.length}"><small>${escape(col.label)}</small><strong>${escape(col.text).replace(/ \/ /g, '<br>')}</strong></li>`).join('')}</ul>` : ''}
    </div>`).join('')}</div>
    <div class="proto-tabs reframe-tabs" role="tablist" aria-label="문제 정의 과정">${cards.map((card, i) => `<button type="button" role="tab" aria-selected="false" data-i="${i}">${escape(card.title)}</button>`).join('')}</div>
  </div>`;
}

export function mountReframe(page) {
  const root = page.querySelector('.reframe'); if (!root) return;
  const panels = [...root.querySelectorAll('.reframe-panel')], tabs = [...root.querySelectorAll('.reframe-tabs button')];
  let loaded = false;
  const preload = () => { if (loaded) return; loaded = true; root.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); }); };
  function show(i) {
    panels.forEach((p, k) => { const on = k === i; if (on && !p.classList.contains('on')) { p.classList.remove('on'); void p.offsetWidth; } p.classList.toggle('on', on); });
    tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
  }
  tabs.forEach(tab => tab.addEventListener('click', () => show(Number(tab.dataset.i))));
  addEventListener('portfolio:page', e => { const pages = [...document.querySelectorAll('.page')]; if (Math.abs(e.detail.index - pages.indexOf(page)) <= 1) preload(); });
  let wasActive = false;
  const sync = () => { const active = page.classList.contains('is-active'); if (active === wasActive) return; wasActive = active; if (active) { preload(); panels.forEach(p => p.classList.remove('on')); show(0); } };
  new MutationObserver(sync).observe(page, {attributes: true, attributeFilter: ['class']});
  sync();
}
