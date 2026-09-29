// 태블릿 프로토타입 페이지(MD의 '### 태블릿 NN · 제목' 카드): 실제로 동작하는 이응이 프로토타입(oiooi-proto.js)을 가운데에 띄운다.
// 카드마다 탭 하나(카드가 하나뿐이면 탭 없이 그 화면만. 이때도 탭 자리는 비워 두어 다른 장과 위치를 맞춘다): '화면'은 탭을 누르면 이동할 프로토타입 화면 이름, 첫 카드의 '안내'는 태블릿 위 작은 캡션,
// 첫 카드의 '허용'(' / '로 구분)은 이 페이지에서 갈 수 있는 화면만 남기고 나머지(다른 장에서 보여 줄 화면)는 막는다. '막힘 안내'는 그때 띄울 문구, '숨김 메뉴'는 GNB에서 숨길 메뉴(이동할 화면 이름).
// 포트폴리오 안에서는 GNB의 Sign in·My page도 막는다.
// 프로토타입(이미지·영상 약 6MB)은 페이지 근처에 오면 불러오고, 들어올 때마다 첫 탭 화면부터 보여 준다.
import { mountTablet } from './oiooi-proto.js?v=53586a79';
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// 프로토타입 화면 → 선택할 탭 화면. 온보딩부터 추천까지는 '맞춤활동 추천' 탭에 속한다.
const GROUP = {loading: 'onboard', recommend: 'onboard'};

export function tablet(pageId, cards) {
  return `<div class="tablet" data-first="${escape(cards[0].screen)}"${cards[0].allow ? ` data-allow="${escape(cards[0].allow)}"` : ''}${cards[0].blocked ? ` data-blocked="${escape(cards[0].blocked)}"` : ''}${cards[0].hide ? ` data-hide-nav="${escape(cards[0].hide.split(' / ').join(' '))}"` : ''}>
    ${cards[0].caption ? `<p class="tablet-caption"><span class="tablet-dot" aria-hidden="true"></span>${escape(cards[0].caption)}</p>` : ''}
    <div class="tablet-stage" data-wheel-trap></div>
    ${cards.length > 1 ? `<div class="proto-tabs tablet-tabs" role="tablist" aria-label="프로토타입 화면">${cards.map(card => `<button type="button" role="tab" aria-selected="false" data-screen="${escape(card.screen)}">${escape(card.title)}</button>`).join('')}</div>`
      : '<div class="proto-tabs tablet-tabs is-empty" aria-hidden="true"><button type="button" tabindex="-1">&nbsp;</button></div>'}
  </div>`;
}

export function mountTabletPage(page) {
  const root = page.querySelector('.tablet'); if (!root) return;
  const tabs = [...root.querySelectorAll('.tablet-tabs button[data-screen]')], first = root.dataset.first;
  let handle = null;
  const select = name => { const key = GROUP[name] ?? name; if (tabs.some(t => t.dataset.screen === key)) tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.screen === key))); };
  const allow = root.dataset.allow ? root.dataset.allow.split(' / ') : null;
  const load = () => { if (!handle) handle = mountTablet(root.querySelector('.tablet-stage'), {start: first, caption: false, cover: false, onScreen: select, allow, signIn: false, ...(root.dataset.blocked ? {blocked: root.dataset.blocked} : {})}); };
  tabs.forEach(tab => tab.addEventListener('click', () => { load(); handle.go(tab.dataset.screen); }));
  addEventListener('portfolio:page', e => { const pages = [...document.querySelectorAll('.page')]; if (Math.abs(e.detail.index - pages.indexOf(page)) <= 1) load(); });
  let wasActive = false;
  const sync = () => { const active = page.classList.contains('is-active'); if (active === wasActive) return; wasActive = active; if (active) { const fresh = !handle; load(); if (!fresh) handle.go(first); } };
  new MutationObserver(sync).observe(page, {attributes: true, attributeFilter: ['class']});
  sync();
}
