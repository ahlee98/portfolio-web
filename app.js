import { renderCover } from './cover.js?v=73322c77';
import { mockups, mountProto } from './proto.js?v=73322c77';
import { photos, mountPhotos } from './photos.js?v=73322c77';
import { reframe, mountReframe } from './reframe.js?v=73322c77';
import { tablet, mountTabletPage } from './tablet.js?v=73322c77';
import { renderProfile } from './profile.js?v=73322c77';
import { voices, mountVoices } from './voices.js?v=73322c77';
const main = document.querySelector('#pages');
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const steps = ['Overview', 'Problem', 'Direction', 'Solution 01', 'Solution 02', 'Learning'];
const labels = ['프로젝트 소개', '문제 정의', '해결 방향', '솔루션 ①', '솔루션 ②', '검증 & 러닝'];
function diagram(project, i) {
  if (i === 0 || i === 3 || i === 4) {
    const asset = `${project.id}-${i === 0 ? 'cover' : i === 3 ? 'solution1' : 'solution2'}.webp`;
    return `<figure class="visual image-stage"><span class="visual-label">${i === 0 ? 'PROJECT PREVIEW' : 'DESIGN IN DETAIL'}</span><img src="./assets/${asset}" alt="${escape(project.name)} ${labels[i]} 설계 화면" ${i ? 'loading="lazy"' : ''}><figcaption>${project.name} <span>${i === 0 ? project.category : labels[i]}</span></figcaption></figure>`;
  }
  if (i === 1) return `<div class="visual concept"><span class="visual-label">REFRAMING THE PROBLEM</span><p class="before">${project.id === 'ibuja' ? '유아스러운 UI' : '추가 구매 부진'}</p><span class="connector">↓</span><p class="after">${project.id === 'ibuja' ? '성장해도<br>계속 쓸 이유' : '구매 이후에도<br>계속 활용할 이유'}</p><div class="concept-foot">${project.id === 'ibuja' ? '화면의 인상에서 서비스의 역할로' : '판매의 한계에서 활용 경험의 단절로'}</div></div>`;
  if (i === 2) return `<div class="visual strategy"><span class="visual-label">SERVICE DIRECTION</span><div class="strategy-core">${project.id === 'ibuja' ? '자산 형성' : '맞춤 학습 경험'}</div><div class="strategy-pair"><div><small>${project.id === 'ibuja' ? 'PARENT' : 'PERSONALIZE'}</small><strong>${project.id === 'ibuja' ? '성장을 돕는<br>금융 파트너' : '아이에게 맞는<br>활동 추천'}</strong></div><span>＋</span><div><small>${project.id === 'ibuja' ? 'CHILD' : 'PARTICIPATE'}</small><strong>${project.id === 'ibuja' ? '돈을 모으는<br>견습 자산가' : '직접 해보고<br>함께 나누기'}</strong></div></div><p>${project.id === 'ibuja' ? '서로 다른 동기를 하나의 이용 이유로' : '교구와 콘텐츠를 하나의 경험으로'}</p></div>`;
  const hana = project.id === 'ibuja';
  return `<div class="visual validation"><span class="visual-label">${hana ? 'VALIDATE, THEN REFINE' : 'USER EVALUATION · 13 PEOPLE'}</span>${hana ? '<div class="validation-steps"><span>01 워크숍</span><span>02 AI 프로토타입</span><span>03 전문가 평가</span></div>' : ''}<div class="scores"><div><strong>${hana ? '4.8' : '4.29'}</strong><span>/ 5</span><p>${hana ? '도움말·문서' : '서비스 전략'}</p></div><div><strong>${hana ? '4.5' : '4.17'}</strong><span>/ 5</span><p>${hana ? '기억보다 인지' : 'UX 허니콤'}</p></div></div><div class="learning"><small>LEARNING</small><p>${hana ? '검증은 아이디어를<br>설계 기준으로 만드는 과정' : '정교한 맞춤화만큼<br>쉬운 시작과 참여가 중요'}</p></div></div>`;
}
// ‘…’로 묶인 말은 뒤에 붙는 조사까지 한 덩어리로 묶어 줄바꿈으로 쪼개지지 않게 한다.
const keepQuoted = html => html.replace(/‘[^’]+’[^\s‘]*/g, m => `<span class="nowrap">${m}</span>`);
// 제목(KEY)의 ' / '는 줄바꿈. 나눈 줄은 한 줄로 유지하고, 나누지 않은 제목은 폭에 맞춰 자연스럽게 줄바꿈한다.
const keyLines = key => key.includes(' / ') ? key.split(' / ').map(line => `<span class="key-line">${keepQuoted(escape(line))}</span>`).join('') : keepQuoted(escape(key));
const evidence = points => `<ul class="evidence">${points.map(point => { const split = point.indexOf(' — '); return `<li>${split > -1 ? `<span>${escape(point.slice(0,split))}</span><p>${escape(point.slice(split+3))}</p>` : `<p>${escape(point)}</p>`}</li>`; }).join('')}</ul>`;
// 카드형 콘텐츠(MD의 ### 카드): 카드 → 말풍선 순으로 --i 순번을 매겨 차례로 등장시킨다.
function cards(list) {
  let n = 0;
  const bubbles = texts => texts.length ? `<ul class="bubbles">${texts.map(text => `<li style="--i:${n++}">${escape(text)}</li>`).join('')}</ul>` : '';
  const note = card => card.note ? `<p class="card-note">${escape(card.note)}</p>` : '';
  return `<div class="cards">${list.map(card => {
    // 2열(#### 소제목): 열 사이에 + 아이콘. 카드 문장이 있으면 제목·문장 아래 안쪽 패널에 넣는다.
    // 3열 이상(Step)은 + 아이콘 없이 열마다 타일로 나눈다(is-steps).
    const pair = (cols, plus = cols.length < 3) => cols.map((col, k) => `${k && plus ? '<span class="pair-plus" aria-hidden="true"></span>' : ''}<div class="pair-col"><p class="card-title">${escape(col.label)}</p><p class="card-text">${keepQuoted(escape(col.text))}</p>${bubbles(col.bubbles)}</div>`).join('');
    if (card.columns && card.text) return `<div class="card card-stage${card.dark ? ' is-dark' : ''}${card.columns.length > 2 ? ' is-steps' : ''}" style="--i:${n++}"><p class="card-title">${escape(card.title)}</p><div class="card-body"><p class="card-text">${escape(card.text)}</p>${note(card)}</div><div class="card-panel pair">${pair(card.columns)}</div></div>`;
    if (card.columns) return `<div class="card card-pair pair" style="--i:${n++}">${pair(card.columns)}</div>`;
    if (card.dark) return `<div class="card card-dark" style="--i:${n++}"><div><p>${escape(card.text)}</p>${note(card)}</div></div>`;
    return `<div class="card" style="--i:${n++}"><p class="card-title">${escape(card.title)}</p><div class="card-body"><p class="card-text">${escape(card.text)}</p>${note(card)}${bubbles(card.bubbles)}</div></div>`;
  }).join('')}</div>`;
}
const stepLinks = (project, active) => project.pages.map((page,i) => `<a href="#${page.id}" aria-label="${project.name} ${i+1}장 ${steps[i]}"${i === active ? ' aria-current="step"' : ''}><i></i></a>`).join('');
try {
  const response = await fetch('./content.json', {cache: 'no-cache'}); if (!response.ok) throw new Error('Content unavailable');
  const projects = await response.json();
  for (const project of projects) {
    // 표지는 프로젝트 그룹 안에서 고정(sticky)되고, 밝은 설명 페이지가 그 위를 덮으며 올라온다.
    // 첫 프로젝트는 hello와 같은 그룹에 넣어, 아이부자 표지가 hello를 덮으며 올라오게 한다.
    const group = project === projects[0] ? main.querySelector('.stack-group') : Object.assign(document.createElement('div'), {className: 'stack-group'});
    project.pages.forEach((page, i) => {
      const section = document.createElement('section'); section.className = `page ${i ? 'project-page' : 'cover-page'} stacked ${project.id}`; if (!i) section.dataset.theme = 'dark'; section.id = page.id; section.dataset.project = project.id; section.dataset.chapter = `${project.name} / ${steps[i]}`; section.setAttribute('aria-labelledby', `${page.id}-title`);
      if (i === 0) renderCover(section, project);
      else section.innerHTML = `<div class="page-inner"><div class="key-region"><h2 id="${page.id}-title">${keyLines(page.key)}</h2></div><div class="content-region">${page.cards ? (page.cards[0].mockup ? mockups(page.id, page.cards) : page.cards[0].photo ? photos(page.id, page.cards) : page.cards[0].tab ? reframe(page.id, page.cards) : page.cards[0].tablet ? tablet(page.id, page.cards) : page.cards[0].voices ? voices(page.id, page.cards) : cards(page.cards)) : diagram(project,i) + evidence(page.points)}</div><article class="sub-region"><p class="sub-label">${steps[i]}</p><p class="description">${escape(page.sub)}</p></article></div>`;
      group.append(section);
      mountProto(section); // 목업 페이지면 To-be 프로토타입 재생 준비
      mountPhotos(section); // 작업 사진 페이지면 자동 전환 준비
      mountReframe(section); // 문제 재정의 탭 페이지면 탭 전환 준비
      mountTabletPage(section); // 태블릿 프로토타입 페이지면 근처에서 불러오기 준비
      mountVoices(section); // 사용자 평가 페이지면 후기 말풍선 교체 준비
    });
    main.append(group);
  }
  // 마지막 장: Profile(profile.json). 불러오지 못하면 프로젝트만 보여 준다.
  const profile = await fetch('./profile.json', {cache: 'no-cache'}).then(r => r.ok ? r.json() : null).catch(() => null);
  if (profile) {
    // 프로젝트 표지처럼 어두운 면으로, 자기 그룹 안에서 고정(sticky)된 채 앞 페이지를 덮으며 올라온다.
    const group = Object.assign(document.createElement('div'), {className: 'stack-group'});
    const section = Object.assign(document.createElement('section'), {className: 'page profile-page stacked', id: 'profile'});
    Object.assign(section.dataset, {project: 'profile', chapter: 'PROFILE', theme: 'dark'}); section.setAttribute('aria-labelledby', 'profile-title');
    renderProfile(section, profile); group.append(section); main.append(group);
  }
  // 고정(sticky)되는 페이지는 자체 위치가 스크롤에 따라 바뀌므로, 제자리에 둔 투명 표식으로 스냅한다.
  document.querySelectorAll('.stack-group').forEach(group => [...group.children].forEach((page, k) => { if (page.classList.contains('stacked')) group.append(Object.assign(document.createElement('i'), {className: 'snap-mark', style: `top:${k * 100}dvh`})); }));
  // 내용이 화면 높이보다 길면 스크롤 대신 통째로 줄여 한 화면에 담는다(작은 노트북 화면 등). 넓이는 가운데 기준으로 함께 줄어든다.
  // scale 속성은 자리(레이아웃)를 줄이지 않으므로, 줄어든 만큼 아래 여백을 당겨 가운데 정렬이 맞게 한다. 사진이 늦게 불러와져 높이가 바뀌면 다시 맞춘다.
  const fitRegion = region => {
    const kids = [...region.children]; if (!kids.length || region.querySelector('.tablet')) return;
    const apply = f => kids.forEach(k => { k.style.transformOrigin = 'top center'; k.style.scale = f === 1 ? '' : f; k.style.marginBottom = f === 1 ? '' : `${-(1 - f) * k.offsetHeight}px`; });
    apply(1);
    const cs = getComputedStyle(region), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    let f = 1;
    for (let pass = 0; pass < 4 && region.scrollHeight - region.clientHeight > 1 && f > .55; pass++) { // 간격·여백은 줄지 않아 한 번에 안 맞을 수 있어 몇 번 더 좁힌다
      f = Math.max(.55, f * (region.clientHeight - pad) / (region.scrollHeight - pad) - .005); apply(f);
    }
  };
  // 관찰 콜백 안에서 바로 크기를 바꾸지 않고 다음 프레임에 몰아서 맞춘다(ResizeObserver 반복 오류 방지).
  const fitPending = new Set(); let fitFrame = 0;
  const fitObserver = new ResizeObserver(entries => { entries.forEach(e => { const r = e.target.closest('.content-region'); if (r) fitPending.add(r); }); if (!fitFrame) fitFrame = requestAnimationFrame(() => { fitFrame = 0; fitPending.forEach(fitRegion); fitPending.clear(); }); });
  document.querySelectorAll('.content-region').forEach(region => { fitObserver.observe(region); [...region.children].forEach(k => fitObserver.observe(k)); });
  document.fonts?.ready.then(() => document.querySelectorAll('.content-region').forEach(fitRegion));
  const pages = [...document.querySelectorAll('.page')]; let current = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu'), stepsEl = document.querySelector('.steps-fixed');
  // 이동을 시작하는 순간 현재 페이지를 갱신해, 스크롤이 끝나기 전 연속 입력도 올바른 페이지에서 계산하고 내용 교체도 바로 시작한다.
  let target = null, targetTimer;
  // 같은 프로젝트의 설명 페이지끼리는 내용이 화면에 고정돼 있어 위치만 즉시 옮기고(스크롤 없음) 내용 교체만 보여준다.
  const sameStage = (a, b) => [a, b].every(i => pages[i].classList.contains('project-page')) && pages[a].dataset.project === pages[b].dataset.project;
  // 페이지 이동 스크롤은 직접 애니메이션한다. 사파리는 scroll-snap이 걸린 영역에서 scrollTo({behavior: 'smooth'})가 제자리로 되돌아가
  // 페이지 상태만 바뀌고 화면은 안 움직이는(두 장이 겹쳐 보이는) 문제가 있어, 브라우저 기본 부드러운 스크롤을 쓰지 않는다.
  let scrollAnim = 0;
  const scrollMain = (top, instant) => {
    cancelAnimationFrame(scrollAnim);
    const from = main.scrollTop, dist = top - from;
    if (instant || Math.abs(dist) < 1) { main.scrollTop = top; return; }
    const dur = Math.min(900, 480 + Math.abs(dist) / main.clientHeight * 120), start = performance.now();
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = now => { const t = Math.min(1, (now - start) / dur); main.scrollTop = from + dist * ease(t); if (t < 1) scrollAnim = requestAnimationFrame(step); };
    scrollAnim = requestAnimationFrame(step);
  };
  const go = index => {
    if (index < 0 || index >= pages.length || index === current) return;
    const instant = reduced.matches || sameStage(current, index);
    update(index); target = index; clearTimeout(targetTimer); targetTimer = setTimeout(() => { target = null; }, 3000);
    scrollMain(index * main.clientHeight, instant);
  };
  function update(index) {
    current = index;
    document.querySelectorAll('.menu a[data-project]').forEach(a => { if (a.dataset.project === pages[index].dataset.project) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
    const entering = !pages[index].classList.contains('is-active');
    pages.forEach((p,i) => { p.classList.toggle('is-active', i === index); p.classList.toggle('past', i < index); }); // past: 지나간 페이지는 위로, 남은 페이지는 아래에서 교체
    // 등장 모션(카드 → 말풍선)은 들어올 때마다 다시 재생. 나가는 페이지는 seen을 유지해 흐려지는 동안 내용이 보이게 둔다.
    if (entering) { pages[index].classList.remove('seen'); void pages[index].offsetWidth; pages[index].classList.add('seen'); }
    dispatchEvent(new CustomEvent('portfolio:page', {detail: {index}})); // 목업 페이지가 근처 자료를 미리 불러오도록 알림
    // 고정 인디케이터: 현재 프로젝트의 6장 중 현재 위치 표시
    const project = projects.find(p => p.id === pages[index].dataset.project);
    stepsEl.innerHTML = project ? stepLinks(project, project.pages.findIndex(page => page.id === pages[index].id)) : '';
    if (location.hash !== `#${pages[index].id}`) history.replaceState(null,'',`#${pages[index].id}`);
  }
  // 스크롤 위치에 맞춰: 덮이는 표지를 살짝 어둡고 작게, 고정 메뉴·페이지 점선은 아래 깔린 면의 밝기에 맞춰 글자색 전환
  // 최상단 hello에서는 자체 헤더가 있어 고정 메뉴·페이지 점선을 숨긴다.
  const pageAt = y => pages[Math.min(pages.length-1, Math.floor((main.scrollTop + y) / main.clientHeight))];
  function render() {
    const h = main.clientHeight; if (!h) return; // 960px 미만에서는 본문이 숨겨져 높이가 0
    // 현재 위치 앞뒤 페이지만, 값이 바뀔 때만 갱신한다(매 프레임 전체 스타일 재계산 방지).
    const at = main.scrollTop / h, set = (p, name, value) => { if (p.style.getPropertyValue(name) !== value) p.style.setProperty(name, value); };
    pages.forEach((p,i) => {
      if (Math.abs(i - at) > 2) return;
      if (p.classList.contains('cover-page') || p.id === 'hello') set(p, '--covered', Math.min(1, Math.max(0, at - i)).toFixed(3));
    });
    for (const [el, y] of [[menu, menu.getBoundingClientRect().bottom - 20], [stepsEl, stepsEl.getBoundingClientRect().top + 4]]) { const under = pageAt(y); el.classList.toggle('on-dark', under.dataset.theme === 'dark'); el.classList.toggle('is-hidden', under.id === 'hello'); }
    const nearest = Math.min(pages.length-1, Math.round(main.scrollTop / h));
    if (target !== null) { if (Math.abs(main.scrollTop - target * h) < 2) target = null; return; } // 이동 중에는 목적지를 유지
    if (nearest !== current || !pages[nearest].classList.contains('is-active')) update(nearest);
  }
  let ticking = false;
  main.addEventListener('scroll', () => { if (!ticking) requestAnimationFrame(() => { render(); ticking = false; }); ticking = true; }, {passive:true});
  // 창 크기가 바뀌면 페이지 높이가 달라지므로, 보던 페이지 위치로 다시 맞춘다(다른 페이지로 튀지 않게).
  addEventListener('resize', () => { target = current; scrollMain(current * main.clientHeight, true); render(); });
  document.addEventListener('click',event => { const a=event.target.closest('a[href^="#"]'); if(!a)return; const index=pages.findIndex(p=>`#${p.id}`===a.hash); if(index<0)return; event.preventDefault(); go(index); });
  // 휠·트랙패드: 한 번 쓸 때마다 한 장씩 넘긴다(스크롤 없는 방식). 관성으로 이어지는 입력이 잦아들 때까지 다음 이동을 막는다.
  // 새 제스처 판정: 입력이 160ms 넘게 비었거나(관성 끝), 뚜렷하게 방향이 바뀌면 새로 쓴 것으로 본다.
  // 같은 방향 관성 입력은 세기가 오르내려도 끝날 때까지 무시해, 한 번 쓸면 한 장만 넘어간다. 반대로 쓸면 관성 도중에도 바로 반응.
  let wheelSum = 0, gestureUsed = false, lastWheel = 0, lastDelta = 0, lockedAt = -Infinity, innerAt = -Infinity;
  const canScrollInside = (target, dy) => { for (let el = target; el && el !== main; el = el.parentElement) { if (el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY)) { if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true; } } return false; };
  addEventListener('wheel', event => {
    if (matchMedia('(max-width: 959px)').matches) return;
    const now = performance.now();
    // 긴 본문·프로토타입은 영역 안에서 먼저 스크롤한다. 안쪽을 스크롤한 제스처는 끝에 닿아도 페이지를 넘기지 않고(관성으로 바로 넘어가는 것 방지),
    // 손을 뗐다가 다시 굴려야 넘어간다. 마우스 휠처럼 끊어지는 입력은 안쪽 스크롤 직후 0.5초 동안 끝에서 한 번 멈춘다.
    if (canScrollInside(event.target, event.deltaY)) { lastWheel = innerAt = now; if (Math.abs(event.deltaY) >= 4) lastDelta = event.deltaY; gestureUsed = true; return; }
    event.preventDefault();
    // 프로토타입처럼 직접 조작하는 영역(data-wheel-trap) 위에서는 끝에 닿아도 페이지를 넘기지 않는다. 페이지 이동은 영역 바깥에서.
    if (event.target.closest('[data-wheel-trap]')) { lastWheel = now; gestureUsed = true; return; }
    const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? main.clientHeight : 1); // 줄·페이지 단위 휠 보정
    if (!dy) return;
    const flipped = Math.abs(dy) >= 4 && Math.sign(dy) !== Math.sign(lastDelta || dy); // 관성 끝의 미세한 역방향 값은 무시
    if (now - lastWheel > 160 || flipped) { gestureUsed = false; wheelSum = 0; }
    lastWheel = now; if (Math.abs(dy) >= 4) lastDelta = dy;
    if (gestureUsed || now - lockedAt < 300 || now - innerAt < 500) return; // 같은 제스처의 관성 입력·안쪽 스크롤 직후 입력은 무시
    wheelSum += dy;
    if (Math.abs(wheelSum) < 12) return;
    go(current + Math.sign(wheelSum)); gestureUsed = true; lockedAt = now;
  }, {passive: false});
  document.addEventListener('keydown', event => { if(matchMedia('(max-width: 959px)').matches || event.target.closest('button,a,input,textarea,select')) return; const keys={ArrowDown:current+1,PageDown:current+1,ArrowUp:current-1,PageUp:current-1,Home:0,End:pages.length-1}; if(keys[event.key]!==undefined){event.preventDefault();go(keys[event.key]);} });
  const initial = pages.findIndex(p=>`#${p.id}`===location.hash); if(initial>0) scrollMain(initial * main.clientHeight, true);
  update(Math.max(initial,0)); render();
  window.addEventListener('hashchange',()=>{const index=pages.findIndex(p=>`#${p.id}`===location.hash);if(index>=0)go(index);});
} catch(error) { console.error(error); const note=document.createElement('p'); note.className='load-error';note.textContent='콘텐츠를 불러오지 못했습니다. 페이지를 새로고침해주세요.';main.append(note); }
