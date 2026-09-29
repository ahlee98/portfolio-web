// 이응이 표지 가운데: 태블릿 프로토타입(portfolio-dreamy의 oiooi-prototype.html) 첫 화면만 옮긴 정지 화면 + 배경 영상.
// 1366×1024 캔버스를 틀 폭에 맞춰 축소한다. 영상은 표지 근처에 오면 불러오고, 표지가 보일 때만 재생한다.
const DIR = './assets/oiooi-hero/', W = 1366, H = 1024;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export function mountWeb(figure, page) {
  figure.innerHTML = `<div class="web-device"><div class="web-glass"><div class="web-canvas" aria-hidden="true">
    <video class="bg" poster="${DIR}hero.webp" muted loop playsinline preload="none"></video><i class="shade"></i>
    <img class="logo" src="${DIR}logo.webp" alt=""><span class="sign">Sign in</span>
    <h4>DESIGN, PLAY AND KIDS.</h4><p>이응이는 아이들이 놀이를 통해 세상을 경험하기를 희망합니다.</p>
    <div class="btns"><span>About us</span><span>Shop</span></div>
    <span class="scroll"><img src="${DIR}scroll.gif" alt=""><span>scroll</span></span>
  </div></div></div>`;
  figure.setAttribute('aria-label', '이응이 웹 메인 화면');
  const glass = figure.querySelector('.web-glass'), canvas = figure.querySelector('.web-canvas'), video = figure.querySelector('video');
  new ResizeObserver(() => { const k = glass.clientWidth / W; canvas.style.transform = `scale(${k})`; glass.style.height = `${H * k}px`; }).observe(glass);
  let loaded = false;
  const load = () => { if (!loaded) { loaded = true; video.src = `${DIR}hero.mp4`; } };
  addEventListener('portfolio:page', e => { const pages = [...document.querySelectorAll('.page')]; if (Math.abs(e.detail.index - pages.indexOf(page)) <= 1) load(); });
  const sync = () => {
    if (page.classList.contains('is-active') && !reduced.matches && !document.hidden) { load(); video.play().catch(() => {}); }
    else video.pause();
  };
  new MutationObserver(sync).observe(page, {attributes: true, attributeFilter: ['class']});
  document.addEventListener('visibilitychange', sync);
  sync();
}
