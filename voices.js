// 사용자 평가 페이지(MD의 '### 후기 · 제목' 카드, 이응이 6장): 흑백 사진 위에 사용자 후기 말풍선이 4초마다 차례로 바뀌고, 아래에 평가 점수 원형.
// 카드 항목: '이미지'는 파일 이름(assets/<페이지 id>/), '인용'은 말풍선 문장(여러 개면 순서대로 교체, ' / '는 줄바꿈).
// '#### 소제목'은 원형(소제목 = 평가 이름, '점수 — 4.29 / 5'). 모양은 2장 문제 재정의 탭(reframe.js)과 같은 틀·말풍선·원을 쓴다.
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const INTERVAL = 4000, OUT = 360;
const lines = text => escape(text).split(' / ').join('<br>');
const score = text => { const [v, max] = String(text ?? '').split(' / '); return max ? `${escape(v)}<span> / ${escape(max)}</span>` : escape(v); };

export function voices(pageId, cards) {
  const card = cards[0], dir = `./assets/${pageId}/`;
  return `<div class="voices">
    <div class="reframe-stage voices-stage">
      <div class="reframe-panel is-framed on">
        <div class="reframe-img">${card.image ? `<img data-src="${dir}${escape(card.image)}" alt="${escape(card.alt ?? card.title)}" decoding="async">` : ''}</div>
        <p class="reframe-bubble is-dark voices-bubble" aria-live="polite"></p>
        ${card.columns ? `<ul class="reframe-circles voices-scores">${card.columns.map((col, k) => `<li style="--k:${k + 1}"><small>${escape(col.label)}</small><strong>${score(col.text)}</strong></li>`).join('')}</ul>` : ''}
      </div>
    </div>
    <template class="voices-texts">${card.quotes.map(q => `<span>${lines(q)}</span>`).join('')}</template>
  </div>`;
}

export function mountVoices(page) {
  const root = page.querySelector('.voices'); if (!root) return;
  const bubble = root.querySelector('.voices-bubble'), texts = [...root.querySelector('.voices-texts').content.children].map(s => s.innerHTML);
  let i = -1, timer, loaded = false;
  const preload = () => { if (loaded) return; loaded = true; root.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); }); };
  // 교체: 지금 말풍선은 위로 올라가며 사라지고(leave), 다음 후기는 아래에서 위로 올라온다(show). 마우스를 올려도 멈추지 않는다(창이 가려져 있을 때만 쉰다).
  const show = n => {
    i = n; const first = !bubble.classList.contains('show');
    if (!first) bubble.classList.add('leave');
    setTimeout(() => {
      bubble.classList.add('reset'); bubble.classList.remove('show', 'leave'); bubble.innerHTML = texts[i];
      void bubble.offsetWidth; bubble.classList.remove('reset'); bubble.classList.add('show');
    }, first ? 0 : OUT);
  };
  const tick = () => { clearTimeout(timer); timer = setTimeout(() => { if (document.hidden) return tick(); show((i + 1) % texts.length); tick(); }, INTERVAL); };
  addEventListener('portfolio:page', e => { const pages = [...document.querySelectorAll('.page')]; if (Math.abs(e.detail.index - pages.indexOf(page)) <= 1) preload(); });
  let wasActive = false;
  const sync = () => { const active = page.classList.contains('is-active'); if (active === wasActive) return; wasActive = active; if (active) { preload(); const panel = root.querySelector('.reframe-panel'); panel.classList.remove('on'); void panel.offsetWidth; panel.classList.add('on'); show(0); tick(); } else clearTimeout(timer); }; // 들어올 때마다 사진·원이 다시 떠오른다
  new MutationObserver(sync).observe(page, {attributes: true, attributeFilter: ['class']});
  sync();
}
