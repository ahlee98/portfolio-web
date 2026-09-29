// 최상단 -hello. 인터랙션: 마우스 렌즈 왜곡 · 시차 이동 · 따라다니는 커서 · 클릭 시 손 이모지
// (ahlee98.github.io/ah_portfolio 히어로 스크립트를 옮김. 화면 밖에서는 애니메이션을 멈춘다.)
const BG = '#f7f7f5', W = 1800, H = 920, LENS = 400;
const hero = document.getElementById('hello');
const wrap = document.getElementById('hello-wrap');
const cnv = document.getElementById('hello-canvas');
cnv.width = W; cnv.height = H;
const ctx = cnv.getContext('2d');
const src = document.createElement('canvas');
src.width = W; src.height = H;
const sCtx = src.getContext('2d');
let srcPx = null;

async function buildSource() {
  await document.fonts.load('600 260px "Poppins"').catch(() => {});
  await document.fonts.ready;
  sCtx.fillStyle = BG; sCtx.fillRect(0, 0, W, H);
  sCtx.fillStyle = '#111111';
  sCtx.font = '600 260px "Poppins", system-ui, sans-serif';
  sCtx.textAlign = 'center'; sCtx.textBaseline = 'alphabetic';
  if ('letterSpacing' in sCtx) sCtx.letterSpacing = '8px';
  sCtx.fillText('-hello.', W / 2, 510);
  srcPx = sCtx.getImageData(0, 0, W, H).data;
  ctx.drawImage(src, 0, 0);
}
buildSource();

let vpX = innerWidth / 2, vpY = innerHeight / 2;
let cnvX = -LENS * 3, cnvY = H / 2, curCnvX = cnvX, curCnvY = cnvY, curParX = 0, curParY = 0;
const cursorEl = document.getElementById('cursor');
let cursorCx = 0, cursorCy = 0, cursorTx = 0, cursorTy = 0;

document.addEventListener('mousemove', e => {
  vpX = cursorTx = e.clientX; vpY = cursorTy = e.clientY;
  const r = cnv.getBoundingClientRect();
  cnvX = (e.clientX - r.left) * W / r.width;
  cnvY = (e.clientY - r.top) * H / r.height;
});
hero.addEventListener('mouseenter', () => cursorEl.classList.add('visible'));
hero.addEventListener('mouseleave', () => { cursorEl.classList.remove('visible'); cnvX = -LENS * 6; });
wrap.addEventListener('mouseenter', () => cursorEl.classList.add('on-hello'));
wrap.addEventListener('mouseleave', () => cursorEl.classList.remove('on-hello'));
const projectsBtn = hero.querySelector('.hello-projects-btn');
projectsBtn.addEventListener('mouseenter', () => cursorEl.classList.remove('visible'));
projectsBtn.addEventListener('mouseleave', () => cursorEl.classList.add('visible'));

let running = false;
function tick() {
  if (!running) return;
  curCnvX += (cnvX - curCnvX) * 0.11;
  curCnvY += (cnvY - curCnvY) * 0.11;
  cursorCx += (cursorTx - cursorCx) * 0.18;
  cursorCy += (cursorTy - cursorCy) * 0.18;
  cursorEl.style.left = cursorCx.toFixed(1) + 'px';
  cursorEl.style.top = cursorCy.toFixed(1) + 'px';
  const tarParX = (vpX / innerWidth - 0.5) * 80, tarParY = (vpY / innerHeight - 0.5) * 40;
  curParX += (tarParX - curParX) * 0.07;
  curParY += (tarParY - curParY) * 0.07;
  wrap.style.transform = `translate(${curParX.toFixed(2)}px, ${curParY.toFixed(2)}px)`;

  if (srcPx) {
    ctx.drawImage(src, 0, 0);
    const mx = curCnvX, my = curCnvY;
    const dxC = curCnvX - W / 2, dyC = curCnvY - 510;
    const proximity = Math.max(0, 1 - Math.sqrt(dxC * dxC + dyC * dyC) / 2000);
    const activeLens = LENS * (0.25 + 0.75 * proximity), activeLens2 = activeLens * activeLens;
    const ax0 = Math.max(0, Math.floor(mx - activeLens)), ax1 = Math.min(W - 1, Math.ceil(mx + activeLens));
    const ay0 = Math.max(0, Math.floor(my - activeLens)), ay1 = Math.min(H - 1, Math.ceil(my + activeLens));
    const apw = ax1 - ax0 + 1, aph = ay1 - ay0 + 1;
    if (apw > 0 && aph > 0) {
      const out = new Uint8ClampedArray(apw * aph * 4);
      for (let py = 0; py < aph; py++) {
        for (let px = 0; px < apw; px++) {
          const x = ax0 + px, y = ay0 + py, dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
          const di = (py * apw + px) << 2;
          let sx = x, sy = y;
          if (d2 < activeLens2 && d2 > 0.25) {
            const d = Math.sqrt(d2), t = d / activeLens, st = 0.17 + 0.83 * t * t;
            sx = (mx + (dx / d) * st * activeLens + 0.5) | 0;
            sy = (my + (dy / d) * st * activeLens + 0.5) | 0;
            if (sx < 0 || sx >= W || sy < 0 || sy >= H) { out[di] = 0xf7; out[di+1] = 0xf7; out[di+2] = 0xf5; out[di+3] = 255; continue; }
          }
          const si = (sy * W + sx) << 2;
          out[di] = srcPx[si]; out[di+1] = srcPx[si+1]; out[di+2] = srcPx[si+2]; out[di+3] = srcPx[si+3];
        }
      }
      ctx.putImageData(new ImageData(out, apw, aph), ax0, ay0);
    }
  }
  requestAnimationFrame(tick);
}
// hello는 고정된 채 다음 페이지에 덮이므로, 완전히 덮이면(한 화면 이상 스크롤) 멈춘다.
const main = document.getElementById('pages');
function toggle() {
  const visible = main.clientHeight > 0 && main.scrollTop < 2; // 스크롤을 시작하면 렌즈 계산을 멈춰 전환을 가볍게
  if (visible && !running) { running = true; requestAnimationFrame(tick); }
  running = visible;
}
main.addEventListener('scroll', toggle, {passive: true}); addEventListener('resize', toggle); toggle();

const EMOJIS = ['🖐️', '👋', '🤚'], GRAVITY = 0.22, LIFE = 180;
function spawnEmoji(x, y) {
  const el = document.createElement('span');
  el.className = 'emoji-burst';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.body.appendChild(el);
  const vx = (Math.random() - 0.5) * 5, rot = (Math.random() - 0.5) * 2.5;
  let cx = 0, cy = 0, angle = 0, frame = 0, curVy = -(8 + Math.random() * 4);
  (function step() {
    cx += vx; curVy += GRAVITY; cy += curVy; angle += rot; frame++;
    const opacity = Math.max(0, 1 - frame / LIFE), scale = 0.5 + Math.min(1, frame / 12) * 0.6;
    el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
    el.style.opacity = opacity.toFixed(3);
    if (opacity > 0) requestAnimationFrame(step); else el.remove();
  })();
}
wrap.addEventListener('click', e => {
  const count = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) setTimeout(() => spawnEmoji(e.clientX, e.clientY), i * 60);
});
