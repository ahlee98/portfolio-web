// 작업 사진 슬라이드(MD의 '### 사진 NN · 제목' 카드): 사진이 차례로 자동 전환되고, 사진이 뜬 뒤 조금 늦게 말풍선이 올라온다.
// 사진은 카드 순서대로 dir/1.webp, 2.webp …를 쓴다. 탭을 누르면 그 사진으로 이동, 올려 두면 멈춘다.
const DIRS = {'ibuja-6': './assets/ibuja-ai/'};
const INTERVAL = 4800, BUBBLE_OUT = 260, BUBBLE_DELAY = 650;
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function photos(pageId, cards) {
  const dir = DIRS[pageId] ?? `./assets/${pageId}/`;
  return `<div class="photos" data-dir="${dir}">
    <div class="photo-stage">
      <div class="photo-frame">${cards.map((card, i) => `<img class="photo" data-src="${dir}${i + 1}.webp" alt="${escape(card.title)} 작업 사진" decoding="async">`).join('')}</div>
      <p class="photo-bubble" aria-live="polite"></p>
    </div>
    <div class="proto-tabs photo-tabs" role="tablist" aria-label="작업 사진">${cards.map((card, i) => `<button type="button" role="tab" aria-selected="false" data-i="${i}">${escape(card.title)}</button>`).join('')}</div>
    <template class="photo-texts">${cards.map(card => `<span>${escape(card.text ?? '').replace(/\n/g, '<br>')}</span>`).join('')}</template>
  </div>`;
}

export function mountPhotos(page) {
  const root = page.querySelector('.photos'); if (!root) return;
  const imgs = [...root.querySelectorAll('.photo')], tabs = [...root.querySelectorAll('.photo-tabs button')];
  const bubble = root.querySelector('.photo-bubble'), texts = [...root.querySelector('.photo-texts').content.children].map(s => s.innerHTML);
  let current = -1, timer, pending = [], loaded = false;
  const later = (fn, ms) => pending.push(setTimeout(fn, ms));
  const clear = () => { clearTimeout(timer); pending.forEach(clearTimeout); pending = []; };
  function preload() {
    if (loaded) return; loaded = true;
    imgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  }
  function show(i, instant) {
    clear();
    const prev = imgs[current];
    bubble.classList.remove('show');
    later(async () => {
      await imgs[i].decode?.().catch(() => {}); // 사진이 준비된 뒤 전환해 빈 화면이 비치지 않게
      imgs.forEach(img => img.classList.remove('was'));
      if (prev && prev !== imgs[i]) { prev.classList.remove('on'); prev.classList.add('was'); } // 이전 사진은 아래에 깔아 두고, 새 사진이 그 위로 떠오른다
      imgs[i].classList.add('on');
      tabs.forEach((tab, k) => tab.setAttribute('aria-selected', String(k === i)));
      current = i;
      later(() => { bubble.innerHTML = texts[i]; bubble.classList.add('show'); }, instant ? 350 : BUBBLE_DELAY);
      next();
    }, current < 0 || instant ? 0 : BUBBLE_OUT);
  }
  function next() {
    clearTimeout(timer);
    timer = setTimeout(function tick() {
      if (root.matches(':hover') || document.hidden) { timer = setTimeout(tick, 600); return; } // 올려 두면 잠시 멈춤
      show((current + 1) % imgs.length);
    }, INTERVAL);
  }
  tabs.forEach(tab => tab.addEventListener('click', () => { const i = Number(tab.dataset.i); if (i !== current) show(i); }));
  const reset = () => { clear(); imgs.forEach(img => img.classList.remove('on', 'was')); bubble.classList.remove('show'); current = -1; };
  addEventListener('portfolio:page', e => { const pages = [...document.querySelectorAll('.page')]; if (Math.abs(e.detail.index - pages.indexOf(page)) <= 1) preload(); });
  // 들어올 때마다 첫 사진부터, 나가면 멈춘다(흐려지며 나가는 동안 사진은 그대로 둔다).
  let wasActive = false;
  const sync = () => { const active = page.classList.contains('is-active'); if (active === wasActive) return; wasActive = active; if (active) { preload(); reset(); show(0, true); } else clear(); };
  new MutationObserver(sync).observe(page, {attributes: true, attributeFilter: ['class']});
  sync();
}
