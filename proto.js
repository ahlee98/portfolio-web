// 설명 페이지 목업: 좌 As-is 정지 화면, 우 To-be 프로토타입(케이스를 순서대로 자동 재생).
// 페이지(id)별 설정. 좌표·크기는 모두 375 × 812 화면 기준. 원본은 img/ibuja/ (webp로 변환해 assets/에 둠)
const SCREEN_H = 812, STATUS_H = 47; // 상태바(9:41) 높이: 긴 화면을 스크롤해도 고정
// 케이스 단계: show 화면 전환(기본 밀어내기, 'fade'면 겹쳐 바꿈) · scroll 목표 위치(px), 시간 · tap 터치 표시(화면 좌표)
//   swipe 카드 내용 교체 · overlay 딤과 함께 팝업 등장(이미 있으면 교체) · close 팝업 닫기 · play 모듈 모션 · wait 대기(ms)
//   intro 탭을 눌러 바로 시작할 때는 건너뛰는 단계 · reveal 재생하지 않은 도형 묶음을 완성 상태로 · ensure 앞 케이스 화면이 없을 때만(탭으로 바로 왔을 때) 화면을 띄움 · toast / untoast 안내창 띄우기·닫기 · swap 같은 스크롤 위치에서 화면 바꿈 · tabbar 하단 탭 바
const PROTOS = {
  // 4장 부모: 원본 solution_asis_01.png · tobe_부모/
  'ibuja-4': {
    dir: './assets/ibuja-parent/', asis: 'asis.png',
    screens: {'entry-home': 812, 'entry-report': 3426, 'first-main': 1908, 'first-article': 2488, 'install-main': 1768},
    // 카드 이미지(367×592, 화면의 x 4 · y 684) 중 텍스트·그래픽·인디케이터 영역(안쪽 x 8 · y 84, 351×432)만 잘라 바꾼다.
    // 노란 박스와 CTA 버튼(카드 안 y 521~)은 원래 화면 것을 그대로 둬 고정된다. 밑은 같은 노란색으로 깔아 원래 내용을 가림
    carousel: {screen: 'install-main', x: 12, y: 768, w: 351, h: 432, image: {w: 367, h: 592, x: 8, y: 84}, bg: '#faf464', cards: [2, 3, 4, 5, 6].map(n => `install-card-${n}.webp`)},
    cases: [
      [['show', 'entry-home'], ['wait', 900], ['tap', 245, 725], ['show', 'entry-report'], ['wait', 500], ['scroll', 2614, 5200], ['wait', 400], ['tap', 185, 748], ['wait', 300]],
      [['show', 'first-main'], ['wait', 800], ['scroll', 750, 1600], ['wait', 300], ['tap', 272, 602], ['show', 'first-article'], ['wait', 500], ['scroll', 1676, 4200], ['wait', 700]],
      [['show', 'install-main'], ['wait', 700], ['scroll', 560, 1400], ['wait', 500], ['swipe'], ['swipe'], ['swipe'], ['swipe'], ['wait', 200], ['tap', 271, 676], ['wait', 600]],
    ],
  },
  // 5장 자녀: 원본 img/ibuja/tobe_자녀/ 번호 순(정기용돈 01~05 · 모으기 01~03 · 투자하기 01~06 · +Contents), As-is는 solution_asis_02.png
  'ibuja-5': {
    dir: './assets/ibuja-child/', asis: 'asis.webp',
    // 컨페티: 정기용돈 팝업 디자인에 들어 있던 리본 조각 이미지(1024×1536)에서 조각 12개의 위치 [x, y, w, h]
    confetti: {
      ribbon: {src: 'confetti.webp', count: 35, size: [.11, .07], rects: [[444,116,108,92],[120,124,124,104],[824,176,128,136],[80,464,120,92],[856,516,88,88],[24,812,76,80],[856,816,140,108],[132,988,120,108],[692,1084,96,72],[104,1264,128,104],[848,1304,96,72],[440,1348,100,84]]},
      // 동전: 모으기 시작 팝업(모으기 03.svg) 안에 있던 동전 이미지에서 10개
      coins: {src: 'coins.webp', count: 16, size: [.06, .03], rot: .3 /* 회전·뒤집힘 속도 배율(1 = 리본) */, rects: [[724,60,236,216],[112,92,180,192],[448,200,108,200],[748,444,152,148],[152,488,204,192],[44,820,180,168],[752,820,176,216],[352,1088,168,132],[136,1228,100,220],[628,1252,204,204]]},
    },
    screens: {'allowance-01': 1307, 'allowance-03': 2655, 'allowance-05': 4055, 'save-01': 2655, 'invest-01': 2660, 'invest-05': 3030, 'history-01': 3632},
    // 팝업·제안 창: 이미지에 딤이 들어 있어, 본체(rect)만 잘라 올리고 딤은 같은 세기로 따로 깐다
    overlays: {
      'allowance-02': {rect: [20, 197, 335, 418], dim: .2, confetti: 'ribbon'}, 'allowance-04': {rect: [20, 197, 335, 418], dim: .4},
      'save-02': {rect: [4, 80, 367, 524], dim: .4}, 'save-03': {rect: [20, 197, 335, 418], dim: .4, confetti: 'coins'},
      'invest-02': {rect: [4, 80, 367, 524], dim: .4}, 'invest-03': {rect: [4, 80, 367, 524], dim: .4, swap: true}, // 같은 창에서 종목만 선택됨
      'invest-04': {rect: [20, 197, 335, 418], dim: .4, confetti: 'ribbon'}, 'invest-06': {rect: [4, 80, 367, 600], dim: .4},
    },
    // 모듈 모션(표지처럼): 이 화면들은 줄인 SVG(assets/ibuja-child/svg/)를 그대로 넣고, SVG 안의 실제 도형 묶음을 움직인다.
    // 화면별 { 묶음 이름: { container: SVG 안 위치('0' = svg의 첫 요소, '0.28' = 그 안의 28번째), mods: [[시작, 끝 요소 번호, 모션, 지연ms]] } }
    svgGroups: {
      'allowance-01': {'question-blob': {container: '0', mods: [[16, 18, 'pop', 0], [19, 21, 'pop', 120], [22, 22, 'pop', 200]]}}, // '?' 원형(탭으로 바로 시작할 때만 생략)
      'allowance-05': {'spend-blobs': {container: '0', mods: [[2, 7, 'rise', 0], [26, 28, 'pop', 150], [23, 25, 'pop', 270], [19, 22, 'pop', 390], [29, 29, 'rise', 610]]}, // 2~7: 계좌 정보(계좌번호·금액)
        'sub-line': {container: '0', mods: [[8, 8, 'rise', 0]]}}, // 8: 안내창 아래 설명 한 줄. 안내창이 닫힐 때 나타남
      'save-01': {'spend-blobs': {container: '0', mods: [[27, 29, 'pop', 0], [24, 26, 'pop', 120], [20, 23, 'pop', 240], [30, 30, 'rise', 460]]}},
      'invest-01': {'save-intro': {container: '0', mods: [[1, 4, 'rise', 0], [15, 24, 'wheel', 150], [25, 27, 'fade', 800]]}, // 표지처럼: 금액 → 카드 원형 회전 → 점 표시
        'save-blobs': {container: '0.28', mods: [[13, 15, 'pop', 0], [10, 12, 'pop', 130], [4, 9, 'pop', 260]]}},
      'invest-05': {'invest-intro': {container: '0', mods: [[3, 7, 'rise', 0], [8, 8, 'rise', 250], [19, 21, 'rise', 400]]}, // 표지처럼: 금액 → 지금까지 수익 → 기간 버튼(그래프는 정지)
        'invest-blobs': {container: '0.22', mods: [[4, 7, 'pop', 0], [8, 11, 'pop', 180]]}},
      'history-01': { // 이력관리 01(마이): 키워드 도형·스티커 → 자산 원형
        'my-hero': {container: '0', mods: [[1, 1, 'pop', 100], [2, 2, 'pop', 160], [3, 3, 'pop', 220], [4, 4, 'pop', 280], [19, 19, 'pop', 320], [20, 20, 'pop', 360],
          [5, 6, 'drop', 420], [7, 9, 'drop', 480], [10, 12, 'drop', 540], [13, 15, 'drop', 600], [16, 18, 'drop', 660]]},
        'my-blobs': {container: '0.44', mods: [[21, 24, 'pop', 0], [17, 20, 'pop', 130], [13, 16, 'pop', 260]]},
      },
    },
    // 안내창: 다른 화면 SVG의 요소를 그림자 정의와 함께 떼어 현재 화면 위에 띄운다(스크롤과 무관하게 고정)
    toasts: {account: {from: 'allowance-03', container: '0', index: 30}}, // '계좌번호가 생겼어요!' (X: 335, 266)
    svgHide: {'allowance-05': [['0', 31]], 'history-01': [['0', 110]]}, // 숨길 요소: 화면에 그려진 하단 탭 바(고정 탭 바와 겹치지 않게)
    // 분홍 카드는 화면 밖 부분이 비어 있어, 노란 카드 내용을 분홍 카드 위치·기울기로 옮겨 채운다(표지 모으기 화면과 같은 처리)
    cardCopy: {'invest-01': {container: '0', from: 24, to: 23, transform: 'translate(-184.5 380) rotate(-20) translate(-347.375 -342)'}},
    // 하단 탭 바(화면 아래 고정): 표지 SVG(my.svg)의 탭 바에서 아이콘·라벨을 가져와 3칸(쓰기·모으기·마이) → 4칸(+투자하기)으로 배치
    tabbar: {src: './assets/ibuja-screens/my.svg', items: {spend: [1, 2, 63], save: [3, 4, 145.5], invest: [5, 6, 227.5], my: [8, 9, 311]}}, // [아이콘, 라벨 요소 번호, 원래 가운데 x]
    cases: [
      // 정기 용돈 시작: 남은 용돈('?' 원형 등장, 탭을 눌러 바로 볼 때는 생략) → 정기용돈 팝업(리본) → 쓰기 메인(원형 → 버튼과 함께 계좌번호 안내창) → 안내창 X로 닫기 → 맨 아래까지 스크롤
      [['tabbar', 'off'], ['show', 'allowance-01', 'cut'], ['intro', 'play', 'question-blob'], ['intro', 'wait', 600], ['reveal'], ['overlay', 'allowance-02'], ['wait', 1500], ['tap', 187, 567], ['close'], ['show', 'allowance-05', 'fade'],
        ['toast', 'account', 610], ['play', 'spend-blobs'], ['wait', 1000], ['tap', 335, 266], ['untoast'], ['play', 'sub-line'], ['wait', 300], ['scroll', 3243, 6000], ['wait', 600],
        ['scroll', 0, 2200]], // 맨 위로 조금 빠르게 올린 뒤, 곧바로 모으기 케이스의 제안 팝업으로 이어짐
      // 모으기 시작: (정기 용돈에서 이어지면 그 화면 위에서 바로) 부모 제안 → 제안 수락 → 모으기 시작 팝업. 탭으로 바로 오면 쓰기 메인을 먼저 띄움
      [['ensure', 'save-01'], ['overlay', 'save-02'], ['wait', 1400], ['tap', 270, 555], ['overlay', 'save-03'], ['wait', 1300], ['tap', 187, 567], ['close'],
        ['tabbar', 'grow'], ['show', 'invest-01', 'fade'], ['play', 'save-intro'], ['wait', 500], ['scroll', 420, 1200], ['play', 'save-blobs'], ['wait', 500],
        ['scroll', 1848, 3500], ['wait', 500], ['scroll', 0, 2000]], // 탭 바 등장·선택 이동 → 모으기 메인(표지처럼 등장) → 맨 아래까지 갔다가 다시 위로 → 투자 제안으로 이어짐
      // 투자하기 시작: (모으기에서 이어지면 그 화면 위에서 바로) 부모 투자 제안 → 삼성전자 선택 → 투자하기 → 투자 시작 팝업 → 투자 메인(원형 등장) → 3일 뒤 수익 안내
      [['ensure', 'invest-01'], ['tabbar', 'save-now'], ['overlay', 'invest-02'], ['wait', 1000], ['tap', 113, 412], ['overlay', 'invest-03'], ['wait', 700],
        ['tap', 270, 555], ['overlay', 'invest-04'], ['wait', 1500], ['tap', 187, 567], ['close'],
        ['tabbar', 'invest'], ['show', 'invest-05', 'fade'], ['play', 'invest-intro'], ['wait', 500], ['scroll', 400, 1200], ['play', 'invest-blobs'], ['wait', 500],
        ['scroll', 2218, 4200], ['wait', 500], ['scroll', 0, 2200], ['wait', 300], ['overlay', 'invest-06'], ['wait', 1800], ['tap', 100, 632], ['close'], ['wait', 300],
        ['tap', 311, 764], ['tabbar', 'my']], // 투자했어요(리본) → 탭 바에 투자하기가 생기며 선택 → 투자 메인 → 맨 아래 갔다 위로 → 수익률 팝업 닫기 → 마이 → 자산 이력
      // 자산 이력 확인: 이력관리 01(키워드 → 자산 원형) → 맨 아래까지 갔다가 다시 위로. 하단 탭 바는 마이 선택으로 고정
      [['tabbar', 'my-now'], ['show', 'history-01', 'fade'], ['play', 'my-hero'], ['wait', 1300], ['scroll', 520, 1400], ['play', 'my-blobs'], ['wait', 1200],
        ['scroll', 2820, 5000], ['wait', 500], ['scroll', 0, 2600], ['wait', 800]],
    ],
  },
};
const PACE = 1.3; // 전체 재생 속도 배율(클수록 느림). 화면 전환·스크롤·카드 교체·터치·팝업·모듈·대기 시간에 모두 곱한다
const EASE = 'cubic-bezier(.3,.8,.2,1)';
const MOTIONS = {
  pop: {frames: [{transform: 'scale(.55)', opacity: 0}, {transform: 'none', opacity: 1}], easing: 'cubic-bezier(.3,1.4,.5,1)', duration: 650},
  'pop-soft': {frames: [{transform: 'scale(.92)', opacity: 0}, {transform: 'none', opacity: 1}], easing: 'cubic-bezier(.3,1.2,.5,1)', duration: 700},
  rise: {frames: [{transform: 'translateY(20px)', opacity: 0}, {transform: 'none', opacity: 1}], easing: EASE, duration: 550},
  wheel: {frames: [{transform: 'rotate(22deg)'}, {transform: 'none'}], easing: 'cubic-bezier(.3,1.12,.4,1)', duration: 1050, origin: '188px 1046px'}, // 카드 아래 한 점을 축으로 한 칸 돌아 들어옴
  fade: {frames: [{opacity: 0}, {opacity: 1}], easing: 'ease', duration: 500},
  drop: {frames: [{transform: 'translateY(-36px) rotate(-14deg) scale(.75)', opacity: 0}, {transform: 'none', opacity: 1}], easing: 'cubic-bezier(.3,1.35,.5,1)', duration: 750},
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const pct = (v, total) => `${(v / total) * 100}%`;
// 화면(375 × screenH) 안의 한 영역을 잘라 보여주는 조각
const crop = (src, [x, y, w, h], screenH, extra = '') =>
  `<div class="proto-crop" style="left:${pct(x, 375)};top:${pct(y, screenH)};width:${pct(w, 375)};height:${pct(h, screenH)};${extra}"><img src="${src}" alt="" style="width:${(375 / w) * 100}%;left:${-(x / w) * 100}%;top:${-(y / h) * 100}%"></div>`;

export function mockups(pageId, cards) {
  const proto = PROTOS[pageId]; if (!proto) return '';
  const [asis, tobe] = cards;
  const caption = card => `<figcaption><b>${card.title}</b><span>${card.text}</span></figcaption>`;
  return `<div class="mockups" data-proto="${pageId}">
    <figure class="mock">${caption(asis)}<div class="mock-phone"><div class="mock-screen"><img data-src="${proto.dir}${proto.asis}" alt="As-is 화면: ${asis.text}"></div></div></figure>
    <figure class="mock mock-proto">${caption(tobe)}<div class="mock-phone"><div class="mock-screen" role="img" aria-label="To-be 프로토타입: ${tobe.text}"></div></div></figure>
  </div>
  <div class="proto-tabs" role="tablist" aria-label="To-be 케이스">${(tobe.cases || []).map((name, i) => `<button type="button" role="tab" data-case="${i}">${name}</button>`).join('')}</div>`;
}

// 줄인 SVG 불러오기(한 번만). 여러 SVG가 한 문서에 들어가므로 id에 화면 이름을 붙인다
const svgCache = {};
const loadSvg = (proto, name) => svgCache[proto.dir + name] ??= fetch(`${proto.dir}svg/${name}.svg`).then(r => r.text()).then(t => t.replace(/(\bid="|url\(#|href="#)/g, `$1${name}-`));
const NS = 'http://www.w3.org/2000/svg';

// 화면 하나: 스크롤되는 긴 이미지(또는 SVG) + 고정 상태바(같은 이미지의 윗부분)
function screenEl(proto, name, svgText) {
  const h = proto.screens[name], src = `${proto.dir}${name}.webp`;
  const el = document.createElement('div'); el.className = 'proto-screen';
  el.innerHTML = `<div class="proto-scroll" style="height:${pct(h, SCREEN_H)}"><img src="${src}" alt=""></div><div class="proto-status" style="background-image:url('${src}');background-size:100% ${pct(h, STATUS_H)}"></div>`;
  const c = proto.carousel;
  if (c?.screen === name) el.querySelector('.proto-scroll').insertAdjacentHTML('beforeend',
    `<div class="proto-carousel" style="left:${pct(c.x, 375)};top:${pct(c.y, h)};width:${pct(c.w, 375)};height:${pct(c.h, h)};background:${c.bg}">${c.cards.map((src, k) =>
      `<div class="proto-card"${k ? ' style="opacity:0"' : ''}><img src="${proto.dir}${src}" alt="" style="width:${(c.image.w / c.w) * 100}%;left:${-(c.image.x / c.w) * 100}%;top:${-(c.image.y / c.h) * 100}%"></div>`).join('')}</div>`);
  const groups = proto.svgGroups?.[name];
  if (groups && svgText) { // 도형 묶음을 만들어 두고, 재생할 때까지 숨긴다
    const scroll = el.querySelector('.proto-scroll'); scroll.innerHTML = svgText; const svg = scroll.querySelector('svg');
    // 감싸면 요소 번호가 밀리므로, 모든 묶음의 위치를 먼저 찾아 둔 뒤 감싼다
    const found = Object.entries(groups).map(([group, g]) => { let box = svg; for (const i of g.container.split('.').filter(Boolean)) box = box.children[+i]; return [group, g, [...box.children]]; });
    const at = path => { let box = svg; for (const i of path.split('.').filter(Boolean)) box = box.children[+i]; return box; };
    const copy = proto.cardCopy?.[name];
    if (copy) { const box = at(copy.container), from = box.children[copy.from], to = box.children[copy.to], g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', copy.transform); g.append(...[...from.children].slice(1).map(el => el.cloneNode(true)));
      [...to.children].slice(1).forEach(el => el.remove()); to.append(g); }
    (proto.svgHide?.[name] ?? []).map(([c, i]) => at(c).children[i]).forEach(el => el.style.display = 'none');
    for (const [group, g, kids] of found) {
      for (const [from, to, motion, delay] of g.mods) { const w = document.createElementNS(NS, 'g');
        w.setAttribute('class', 'm'); Object.assign(w.dataset, {group, motion, delay}); w.style.opacity = 0;
        kids[from].before(w); w.append(...kids.slice(from, to + 1)); }
    }
  }
  el.dataset.name = name; el.dataset.height = h;
  return el;
}

export function mountProto(root) {
  const box = root.querySelector('.mockups'); if (!box) return;
  const proto = PROTOS[box.dataset.proto], stage = box.querySelector('.mock-proto .mock-screen');
  const tabs = [...root.querySelectorAll('.proto-tabs button')];
  const page = root.closest('.page');
  let run = 0, paused = false, current = null, anim = null, overlay = null;

  // 일시정지·취소를 따르는 대기와 애니메이션
  const alive = id => id === run;
  const dur = ms => reduced.matches ? 0 : ms * PACE;
  const sleep = (ms, id) => new Promise(resolve => { let left = ms * PACE, last = performance.now();
    (function tick(now) { if (!alive(id)) return resolve(false); if (!paused) left -= now - last; last = now; left <= 0 ? resolve(true) : requestAnimationFrame(tick); })(last); });
  const animate = async (el, frames, options, id) => {
    anim = el.animate(frames, {fill: 'forwards', ...options, duration: dur(options.duration ?? 0)}); if (paused) anim.pause();
    try { await anim.finished; } catch { return false; } return alive(id);
  };
  const side = (el, frames, options) => { const a = el.animate(frames, {fill: 'forwards', ...options, duration: dur(options.duration), delay: (options.delay ?? 0) * (reduced.matches ? 0 : 1)}); if (paused) a.pause(); return a; };

  async function show(name, how, id, first) {
    const svgText = proto.svgGroups?.[name] ? await loadSvg(proto, name) : null; if (!alive(id)) return false;
    const next = screenEl(proto, name, svgText);
    const prev = current; prev ? prev.after(next) : stage.prepend(next); // 새 화면은 이전 화면 바로 위, 팝업·터치 표시보다는 아래
    await next.querySelector('.proto-scroll > img')?.decode?.().catch(() => {}); if (!alive(id)) { next.remove(); return false; } // 그림 해석이 끝난 뒤 전환(멈칫 방지)
    current = next;
    if (first) { prev?.remove(); return true; }
    let ok;
    if (how === 'cut') ok = alive(id); // 바로 바뀜
    else if (how === 'fade') ok = await animate(next, [{opacity: 0}, {opacity: 1}], {duration: 450, easing: 'ease'}, id);
    else { // 앱 화면 전환처럼 오른쪽에서 밀려 들어옴
      if (prev) { // 밀려나는 화면은 옆으로 조금 이동하며 반투명 막으로 어두워짐(필터보다 가벼움)
        side(prev, [{transform: 'none'}, {transform: 'translateX(-28%)'}], {duration: 520, easing: EASE});
        const shade = document.createElement('div'); shade.className = 'proto-shade'; prev.append(shade); side(shade, [{opacity: 0}, {opacity: 1}], {duration: 520, easing: EASE});
      }
      ok = await animate(next, [{transform: 'translateX(100%)'}, {transform: 'none'}], {duration: 520, easing: EASE}, id);
    }
    prev?.remove(); return ok;
  }
  const scroller = () => current.querySelector('.proto-scroll');
  // 같은 스크롤 위치에서 다른 화면으로 바로 바꿈(탭 전환처럼 윗부분이 같은 화면끼리)
  async function swap(name, id) {
    const sc = scroller(), y = -new DOMMatrix(getComputedStyle(sc).transform).m42 / sc.offsetHeight * +current.dataset.height;
    const svgText = proto.svgGroups?.[name] ? await loadSvg(proto, name) : null; if (!alive(id)) return false;
    const next = screenEl(proto, name, svgText); next.querySelector('.proto-scroll').style.transform = `translateY(${-(y / proto.screens[name]) * 100}%)`;
    current.after(next); current.remove(); current = next; return true;
  }
  const scrollTo = (y, ms, id) => { const h = +current.dataset.height, from = getComputedStyle(scroller()).transform;
    return animate(scroller(), [{transform: from === 'none' ? 'none' : from}, {transform: `translateY(${-(y / h) * 100}%)`}], {duration: ms, easing: 'cubic-bezier(.45,.05,.3,1)'}, id); };

  let cardIndex = 0;
  // 카드 내용 교체: 이전 내용은 왼쪽으로 살짝 빠지며 사라지고, 다음 내용은 오른쪽에서 살짝 들어오며 나타난다(박스·CTA는 고정)
  const swipe = async id => { const items = current.querySelectorAll('.proto-card'), prev = items[cardIndex], next = items[++cardIndex]; if (!next) return true;
    side(prev, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateX(-6%)'}], {duration: 560, easing: EASE});
    const ok = await animate(next, [{opacity: 0, transform: 'translateX(6%)'}, {opacity: 1, transform: 'none'}], {duration: 560, easing: EASE}, id);
    return ok && sleep(700, id); };

  // 팝업: 딤을 깔고 본체를 아래에서 올린다. 이미 떠 있으면 본체만 바꾼다
  async function openOverlay(name, id) {
    const {rect, dim} = proto.overlays[name], src = `${proto.dir}${name}.webp`, r = 24; // 모서리 반경(375 기준)
    const body = document.createElement('div'); body.className = 'proto-popup';
    body.innerHTML = crop(src, rect, SCREEN_H, `border-radius:${pct(r, rect[2])} / ${pct(r, rect[3])}`);
    if (!overlay) {
      overlay = document.createElement('div'); overlay.className = 'proto-overlay';
      overlay.innerHTML = `<div class="proto-dim" style="background:rgba(0,0,0,${dim})"></div>`; stage.append(overlay);
      side(overlay.firstElementChild, [{opacity: 0}, {opacity: 1}], {duration: 380, easing: 'ease'});
      overlay.append(body);
      if (proto.overlays[name].confetti) confetti(proto.overlays[name].confetti, id);
      return animate(body.firstElementChild, [{transform: 'translateY(18%)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 520, easing: 'cubic-bezier(.3,1.15,.4,1)'}, id);
    }
    const old = [...overlay.querySelectorAll('.proto-popup')].at(-1); overlay.querySelector('.proto-dim').style.background = `rgba(0,0,0,${dim})`; overlay.insertBefore(body, overlay.querySelector('.proto-confetti'));
    if (proto.overlays[name].confetti) confetti(proto.overlays[name].confetti, id);
    if (proto.overlays[name].swap) { // 같은 창 안에서 선택만 바뀌는 경우: 제자리에서 겹쳐 바꿈
      const ok = await animate(body.firstElementChild, [{opacity: 0}, {opacity: 1}], {duration: 260, easing: 'ease'}, id); old.remove(); return ok;
    }
    side(old, [{opacity: 1}, {opacity: 0, transform: 'scale(.96)'}], {duration: 300, easing: 'ease'});
    const ok = await animate(body.firstElementChild, [{transform: 'scale(.92)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 480, easing: 'cubic-bezier(.3,1.3,.5,1)'}, id);
    old.remove(); return ok;
  }
  async function closeOverlay(id) {
    if (!overlay) return true; const el = overlay; overlay = null;
    side([...el.querySelectorAll('.proto-popup')].at(-1).firstElementChild, [{opacity: 1}, {opacity: 0, transform: 'translateY(10%)'}], {duration: 320, easing: 'ease-in'});
    const ok = await animate(el, [{opacity: 1}, {opacity: 0}], {duration: 380, easing: 'ease'}, id);
    el.remove(); return ok;
  }

  // 모듈 모션: 현재 화면 SVG의 도형 묶음을 차례로 등장시킨다(표지와 같은 방식)
  async function playGroup(name, id) {
    const mods = [...current.querySelectorAll(`g.m[data-group="${name}"]`)];
    const done = mods.map(g => { const m = MOTIONS[g.dataset.motion]; g.style.opacity = ''; if (m.origin) { g.style.transformBox = 'view-box'; g.style.transformOrigin = m.origin; }
      return side(g, m.frames, {duration: m.duration, easing: m.easing, delay: +g.dataset.delay * PACE, fill: 'both'}).finished.catch(() => {}); });
    await Promise.all(done); return alive(id);
  }

  // 컨페티: 팝업 위에서 리본 조각(디자인의 이미지)이 터져 나와 흩날린다(재생을 기다리지 않음, 일시정지·취소를 따름)
  let sprites = {}; // 컨페티 이미지(페이지 근처에 오면 불러옴)
  function confetti(kind, id) {
    const conf = proto.confetti?.[kind], sprite = sprites[kind];
    if (reduced.matches || !overlay || !sprite?.complete) return;
    const c = document.createElement('canvas'); c.className = 'proto-confetti'; overlay.append(c);
    const W = c.width = stage.clientWidth * 2, H = c.height = stage.clientHeight * 2, g = c.getContext('2d');
    const rects = conf.rects;
    const bits = Array.from({length: conf.count}, () => { const a = -Math.PI / 2 + (Math.random() - .5) * 1.6, v = (.9 + Math.random() * .6) * H * .014; // 폭죽처럼 위로 높이 솟구침
      return {x: W / 2 + (Math.random() - .5) * W * .16, y: H * .52, vx: Math.cos(a) * v * 1.3, vy: Math.sin(a) * v, rect: rects[Math.random() * rects.length | 0], size: W * (conf.size[0] + Math.random() * conf.size[1]),
        r: Math.random() * 6, vr: (Math.random() - .5) * .2 * (conf.rot ?? 1), spin: Math.random() * 6}; });
    let t = 0, last = performance.now(); const life = 3400 * PACE;
    (function frame(now) {
      if (!alive(id) || !c.isConnected) return c.remove();
      const dt = paused ? 0 : Math.min(40, now - last); last = now; t += dt;
      g.clearRect(0, 0, W, H); const k = dt / 16;
      for (const b of bits) { b.vy += H * .00016 * k; b.vx *= .968 ** k; b.vy *= .968 ** k; b.x += b.vx * k; b.y += b.vy * k; b.r += b.vr * k; b.spin += .18 * (conf.rot ?? 1) * k;
        g.save(); g.globalAlpha = Math.max(0, 1 - Math.max(0, t - life * .6) / (life * .4)); g.translate(b.x, b.y); g.rotate(b.r); g.scale(.6 + .4 * Math.cos(b.spin * .7), Math.cos(b.spin)); // 리본이 펄럭이듯 뒤집힘
        const [sx, sy, sw, sh] = b.rect, w = b.size, h = w * sh / sw; g.drawImage(sprite, sx, sy, sw, sh, -w / 2, -h / 2, w, h); g.restore(); }
      t < life ? requestAnimationFrame(frame) : c.remove();
    })(last);
  }

  // 안내창: 설정한 SVG 요소를 떼어 화면 위쪽에 띄운다. delay 뒤에 내려오며 나타나고(기다리지 않음), untoast로 닫는다
  let toast = null;
  async function showToast(name, delay, id) {
    const t = proto.toasts[name], doc = new DOMParser().parseFromString(await loadSvg(proto, t.from), 'image/svg+xml');
    if (!alive(id)) return false;
    let box = doc.documentElement; for (const i of t.container.split('.').filter(Boolean)) box = box.children[+i];
    const el = document.createElement('div'); el.className = 'proto-toast';
    el.innerHTML = `<svg viewBox="0 0 375 812" xmlns="${NS}">${doc.querySelector('defs')?.outerHTML ?? ''}${box.children[t.index].outerHTML}</svg>`;
    toast?.remove(); toast = el; stage.append(el);
    side(el, [{transform: 'translateY(-14px)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 480, easing: EASE, delay: delay * PACE, fill: 'both'});
    return true;
  }
  async function hideToast(id) {
    if (!toast) return true; const el = toast; toast = null;
    const ok = await animate(el, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateY(-10px)'}], {duration: 320, easing: 'ease-in'}, id);
    el.remove(); return ok;
  }

  // 하단 탭 바. grow: 쓰기·모으기·마이 탭 바가 올라온 뒤 선택이 쓰기 → 모으기 / invest: 투자하기 탭이 새로 생기며(4칸) 선택이 투자하기로
  //   my: 선택이 마이로 / save-now · my-now: 해당 상태로 바로 표시(이미 그 상태면 그대로) / off: 없앰. 선택 이동은 기다리지 않아 다음 화면 전환과 동시에 일어남
  let tabbar = null;
  const SLOTS = {3: [73.2, 187.5, 301.8], 4: [63, 145.5, 227.5, 311]}, PILL = {3: 104, 4: 78}; // 칸 가운데 x(375 기준)와 선택 표시 폭
  async function buildTabbar() {
    const t = proto.tabbar, doc = new DOMParser().parseFromString(await fetch(t.src).then(r => r.text()), 'image/svg+xml');
    const root = doc.documentElement.querySelector(':scope > g'), bar = root.children[root.children.length - 1].children;
    const el = document.createElement('div'); el.className = 'proto-tabbar';
    el.innerHTML = `<svg viewBox="0 0 375 812" xmlns="${NS}"><g class="tb-bar">${bar[0].outerHTML}<rect class="tb-pill" y="732" width="104" height="64" rx="32" fill="#F5F7F9"/>${Object.entries(t.items).map(([key, [icon, label, cx]]) =>
      `<g class="tab-item" data-key="${key}" data-cx="${cx}">${bar[icon].outerHTML}${bar[label].outerHTML}</g>`).join('')}</g></svg>`;
    return el;
  }
  const itemAt = (g, tabs) => `translateX(${SLOTS[tabs.length][tabs.indexOf(g.dataset.key)] - +g.dataset.cx}px)`;
  const pillAt = (tabs, key) => `translateX(${SLOTS[tabs.length][tabs.indexOf(key)] - 52}px) scaleX(${PILL[tabs.length] / 104})`;
  function setState(el, tabs, active) { // 애니메이션 없이 배치
    el.querySelectorAll('.tab-item').forEach(g => { const on = tabs.includes(g.dataset.key); g.style.opacity = on ? '' : 0; if (on) g.style.transform = itemAt(g, tabs); g.classList.toggle('on', g.dataset.key === active); });
    el.querySelector('.tb-pill').style.transform = pillAt(tabs, active); Object.assign(el.dataset, {tabs: tabs.join(' '), active});
  }
  const select = (el, active) => { const tabs = el.dataset.tabs.split(' '), pill = el.querySelector('.tb-pill');
    side(pill, [{transform: pillAt(tabs, el.dataset.active)}, {transform: pillAt(tabs, active)}], {duration: 520, easing: 'cubic-bezier(.3,1.3,.5,1)'});
    el.querySelectorAll('.tab-item').forEach(g => g.classList.toggle('on', g.dataset.key === active)); el.dataset.active = active; };
  async function setTabbar(mode, id) {
    if (mode === 'off') { tabbar?.remove(); tabbar = null; return true; }
    const want = {'save-now': ['spend save my', 'save'], 'my-now': ['spend save invest my', 'my']}[mode];
    if (want && tabbar?.dataset.tabs === want[0] && tabbar.dataset.active === want[1]) return true;
    if (want || mode === 'grow' || !tabbar) { // 새로 만들어 해당 상태로
      const el = await buildTabbar(); if (!alive(id)) return false;
      tabbar?.remove(); tabbar = el; stage.append(el);
      const [tabs, active] = want ?? (mode === 'grow' ? ['spend save my', 'spend'] : mode === 'invest' ? ['spend save my', 'save'] : ['spend save invest my', 'invest']);
      setState(el, tabs.split(' '), active); if (want) return true;
      if (mode === 'grow') { // 탭 바가 아래에서 올라온 뒤 선택 이동
        if (!(await animate(el.querySelector('.tb-bar'), [{transform: 'translateY(120px)'}, {transform: 'none'}], {duration: 560, easing: EASE}, id)) || !(await sleep(350, id))) return false;
        select(el, 'save'); return sleep(450, id);
      }
    }
    const el = tabbar;
    if (mode === 'invest') { // 투자하기 탭이 가운데로 새로 생기며 4칸으로 벌어짐 → 선택이 투자하기로
      const tabs = ['spend', 'save', 'invest', 'my'], move = {duration: 480, easing: EASE};
      el.querySelectorAll('.tab-item').forEach(g => { if (g.dataset.key !== 'invest') { side(g, [{transform: g.style.transform}, {transform: itemAt(g, tabs)}], move); g.style.transform = itemAt(g, tabs); } });
      const pill = el.querySelector('.tb-pill'); side(pill, [{transform: pill.style.transform}, {transform: pillAt(tabs, 'save')}], move);
      const inv = el.querySelector('[data-key="invest"]'); inv.style.opacity = ''; inv.style.transform = itemAt(inv, tabs);
      if (!(await animate(inv, [{transform: `${itemAt(inv, tabs)} scale(.4)`, opacity: 0}, {transform: itemAt(inv, tabs), opacity: 1}], {duration: 520, easing: 'cubic-bezier(.3,1.4,.5,1)', delay: 120 * PACE}, id)) || !(await sleep(250, id))) return false;
      el.dataset.tabs = tabs.join(' '); select(el, 'invest'); return true; // 선택 이동과 함께 다음 화면으로
    }
    if (mode === 'my') { select(el, 'my'); return true; }
    return true;
  }

  const tap = async (x, y, id) => { const dot = document.createElement('span'); dot.className = 'proto-tap';
    dot.style.left = pct(x, 375); dot.style.top = pct(y, SCREEN_H); stage.append(dot);
    const ok = await animate(dot, [{transform: 'translate(-50%,-50%) scale(.4)', opacity: 0}, {transform: 'translate(-50%,-50%) scale(1)', opacity: .9, offset: .35}, {transform: 'translate(-50%,-50%) scale(1.25)', opacity: 0}], {duration: 700, easing: 'ease-out'}, id);
    dot.remove(); return ok; };

  const clearStage = () => { stage.querySelectorAll('.proto-tap, .proto-overlay, .proto-toast, .proto-tabbar').forEach(el => el.remove()); overlay = null; toast = null; tabbar = null; };
  async function play(start, fromTab = false) { // fromTab: 케이스 탭을 눌러 시작(그 첫 케이스에서는 intro 단계를 건너뜀)
    const id = ++run; let i = start, first = true, loop = 0; clearStage();
    while (alive(id)) {
      tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
      cardIndex = 0;
      if (overlay && !(await closeOverlay(id))) return; // 앞 케이스가 팝업이 뜬 채 끝났으면 닫고 시작
      toast?.remove(); toast = null;
      for (let [type, a, b, c] of proto.cases[i]) {
        if (type === 'intro') { if (fromTab && loop === 0) continue; [type, a, b] = [a, b, c]; }
        const ok = type === 'show' ? await show(a, b, id, first) : type === 'wait' ? await sleep(a, id) : type === 'scroll' ? await scrollTo(a, b, id)
          : type === 'tap' ? await tap(a, b, id) : type === 'overlay' ? await openOverlay(a, id) : type === 'close' ? await closeOverlay(id)
          : type === 'ensure' ? (current && !first ? true : (await show(a, null, id, first)) && (current.querySelectorAll('g.m').forEach(g => g.style.opacity = ''), true)) // 앞 화면이 없을 때만 완성된 상태로 띄움
          : type === 'reveal' ? (current.querySelectorAll('g.m').forEach(g => g.style.opacity === '0' && (g.style.opacity = '')), true) // 재생하지 않은 도형 묶음은 완성된 상태로
          : type === 'swap' ? await swap(a, id)
          : type === 'tabbar' ? await setTabbar(a, id)
          : type === 'play' ? await playGroup(a, id) : type === 'toast' ? await showToast(a, b ?? 0, id) : type === 'untoast' ? await hideToast(id) : await swipe(id);
        first = false; if (!ok) return;
      }
      i = (i + 1) % proto.cases.length; loop++;
    }
  }
  const stop = () => { run++; stage.getAnimations({subtree: true}).forEach(a => a.cancel()); };
  tabs.forEach((t, k) => t.addEventListener('click', () => { stop(); play(k, true); }));
  // 올려 두면 멈춤. 이미 끝난 애니메이션은 건드리지 않는다(끝난 것을 멈췄다 play()하면 처음부터 다시 재생돼 화면이 튕김).
  const unfinished = a => a.currentTime < a.effect.getComputedTiming().endTime;
  box.addEventListener('mouseenter', () => { paused = true; stage.getAnimations({subtree: true}).forEach(a => a.playState === 'running' && a.pause()); });
  box.addEventListener('mouseleave', () => { paused = false; stage.getAnimations({subtree: true}).forEach(a => a.playState === 'paused' && unfinished(a) && a.play()); });
  // 페이지가 보일 때만 재생, 다시 들어오면 첫 케이스부터
  let wasActive = false;
  // 페이지를 떠나면 재생을 멈추고 화면을 지워 메모리를 비운다(다시 들어오면 새로 그림)
  const unmount = () => { stop(); stage.replaceChildren(); current = null; overlay = null; toast = null; tabbar = null; };
  new MutationObserver(() => { const active = page.classList.contains('is-active'); if (active !== wasActive) { wasActive = active; active ? (preload(), play(0)) : unmount(); } }).observe(page, {attributes: true, attributeFilter: ['class']});
  // 필요할 때 불러오기: 이 페이지 바로 앞뒤에 오면 화면 그림·SVG·컨페티·As-is를 미리 불러온다(첫 로딩을 가볍게)
  let loaded = false;
  function preload() {
    if (loaded) return; loaded = true;
    root.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    Object.keys(proto.screens).forEach(name => { const img = new Image(); img.src = `${proto.dir}${name}.webp`; img.decode?.().catch(() => {}); });
    [...Object.keys(proto.svgGroups ?? {}), ...Object.values(proto.toasts ?? {}).map(t => t.from)].forEach(name => loadSvg(proto, name));
    sprites = Object.fromEntries(Object.entries(proto.confetti ?? {}).map(([k, c]) => [k, Object.assign(new Image(), {src: proto.dir + c.src})]));
  }
  addEventListener('portfolio:page', e => { const pages = [...document.querySelectorAll('.page')]; if (Math.abs(e.detail.index - pages.indexOf(page)) <= 1) preload(); });
  if (page.classList.contains('is-active')) { wasActive = true; preload(); play(0); }
}
