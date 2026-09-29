// 프로젝트 표지(각 프로젝트 1장): cover.html 틀에 content.json의 cover 값을 채운다.
import { mountPhone } from './phone.js?v=53586a79';
import { mountWeb } from './web-screen.js?v=53586a79';
const template = document.createElement('template');
try {
  const response = await fetch('./cover.html'); if (!response.ok) throw new Error('Cover unavailable');
  template.innerHTML = await response.text();
} catch(error) { console.error(error); template.innerHTML = '<div class="cover-inner"><div class="cover-key"><p class="cover-project" data-field="project"></p><h2 class="cover-title" data-field="title"></h2></div></div>'; }

export function renderCover(section, project) {
  const node = template.content.cloneNode(true), cover = project.cover;
  node.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;
    if (field === 'image') { if (cover.device !== 'web') el.src = `./assets/${cover.image}`; el.alt = `${project.name} 대표 화면`; }
    else if (field === 'process') el.replaceChildren(...cover.process.map(text => Object.assign(document.createElement('li'), {textContent: text})));
    else el.textContent = cover[field];
  });
  node.querySelector('.cover-title').id = `${section.id}-title`;
  const phone = node.querySelector('.cover-phone');
  if (cover.device === 'web') { phone.classList.add('cover-web'); mountWeb(phone, section); } // 웹 서비스는 휴대폰 대신 태블릿 웹 화면(프로토타입 첫 화면)
  if (phone && cover.device !== 'web') mountPhone(phone, project.id).catch(console.error); // 탭 화면이 있으면 더미 이미지를 움직이는 화면으로 교체
  section.append(node);
}
