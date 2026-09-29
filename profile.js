// 마지막 장 Profile(content/profile.md → profile.json): 왼쪽에 직함·이름, 오른쪽에 경력·프로젝트 경험·논문 목록.
// 목록이 길면 오른쪽 영역 안에서 스크롤되고, 끝에 닿은 뒤에 페이지가 넘어간다(app.js의 안쪽 스크롤 우선 규칙).
const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// 연락처: 이름 아래 작게. 메일·전화는 누르면 바로 연결된다.
const contact = p => (p.email || p.phone) ? `<dl class="profile-contact">${p.email ? `<div><dt>email.</dt><dd><a href="mailto:${escape(p.email)}">${escape(p.email)}</a></dd></div>` : ''}${p.phone ? `<div><dt>phone.</dt><dd><a href="tel:${escape(p.phone.replace(/\s/g, ''))}">${escape(p.phone)}</a></dd></div>` : ''}</dl>` : '';

export function renderProfile(section, profile) {
  section.innerHTML = `<div class="profile-inner">
    <div class="profile-head"><p class="profile-role">${escape(profile.role)}</p><h2 id="profile-title">${escape(profile.name)}</h2>${contact(profile)}</div>
    <div class="profile-body">${profile.sections.map((sec, k) => `<section class="profile-sec" style="--k:${k}"><h3>${escape(sec.title)}</h3><ul>${sec.items.map(item => `<li>
      <span class="profile-period">${escape(item.period)}</span>
      <div class="profile-item"><p class="profile-title">${escape(item.title)}${item.badge ? `<span class="profile-badge">${escape(item.badge)}</span>` : ''}</p>${item.text ? `<p class="profile-text">${escape(item.text)}</p>` : ''}
        ${item.details.length ? `<ul class="profile-details">${item.details.map(d => `<li>${escape(d)}</li>`).join('')}</ul>` : ''}</div>
    </li>`).join('')}</ul></section>`).join('')}</div>
  </div>`;
}
