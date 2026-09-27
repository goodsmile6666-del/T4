const form = document.getElementById('filters');
const queryInput = document.getElementById('query');
const categorySelect = document.getElementById('category');
const agencySelect = document.getElementById('agency');
const onlineSelect = document.getElementById('online');
const resetButton = document.getElementById('reset');
const resultCount = document.getElementById('result-count');
const activeFilter = document.getElementById('active-filter');
const serviceList = document.getElementById('service-list');

let services = [];

function addOptions(select, values) {
  values
    .sort((a, b) => a.localeCompare(b, 'ko-KR'))
    .forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
}

function highlightedText(text, keyword) {
  const fragment = document.createDocumentFragment();
  if (!keyword) {
    fragment.append(document.createTextNode(text));
    return fragment;
  }

  const source = text.toLocaleLowerCase('ko-KR');
  const target = keyword.toLocaleLowerCase('ko-KR');
  let cursor = 0;
  let index = source.indexOf(target);

  while (index !== -1) {
    fragment.append(document.createTextNode(text.slice(cursor, index)));
    const mark = document.createElement('mark');
    mark.textContent = text.slice(index, index + keyword.length);
    fragment.append(mark);
    cursor = index + keyword.length;
    index = source.indexOf(target, cursor);
  }

  fragment.append(document.createTextNode(text.slice(cursor)));
  return fragment;
}

function makeServiceCard(service, keyword) {
  const article = document.createElement('article');
  article.className = 'service-card';

  const top = document.createElement('div');
  top.className = 'service-card__top';

  const category = document.createElement('span');
  category.className = 'category-badge';
  category.textContent = service.안내분야;

  const online = document.createElement('span');
  online.className = `online-badge online-badge--${service.온라인안내 === '가능' ? 'yes' : 'no'}`;
  online.textContent = `온라인 ${service.온라인안내}`;
  top.append(category, online);

  const title = document.createElement('h3');
  title.append(highlightedText(service.서비스명, keyword));

  const id = document.createElement('p');
  id.className = 'service-card__id';
  id.textContent = `서비스 ID ${service.서비스ID}`;

  const details = document.createElement('dl');
  const agencyTerm = document.createElement('dt');
  agencyTerm.textContent = '소관기관';
  const agencyValue = document.createElement('dd');
  agencyValue.append(highlightedText(service.소관기관, keyword));
  const callTerm = document.createElement('dt');
  callTerm.textContent = '콜센터';
  const callValue = document.createElement('dd');
  callValue.append(highlightedText(service.콜센터, keyword));
  details.append(agencyTerm, agencyValue, callTerm, callValue);

  article.append(top, title, id, details);
  return article;
}

function currentFilters() {
  return {
    keyword: queryInput.value.trim(),
    category: categorySelect.value,
    agency: agencySelect.value,
    online: onlineSelect.value
  };
}

function render() {
  const filters = currentFilters();
  const normalizedKeyword = filters.keyword.toLocaleLowerCase('ko-KR');

  const filtered = services.filter((service) => {
    const searchable = [service.서비스명, service.소관기관, service.안내분야, service.콜센터]
      .join(' ')
      .toLocaleLowerCase('ko-KR');
    return (!normalizedKeyword || searchable.includes(normalizedKeyword))
      && (!filters.category || service.안내분야 === filters.category)
      && (!filters.agency || service.소관기관 === filters.agency)
      && (!filters.online || service.온라인안내 === filters.online);
  });

  resultCount.textContent = String(filtered.length);
  serviceList.replaceChildren();
  serviceList.setAttribute('aria-busy', 'false');

  const active = [
    filters.keyword && `검색 “${filters.keyword}”`,
    filters.category,
    filters.agency,
    filters.online && `온라인 ${filters.online}`
  ].filter(Boolean);
  activeFilter.textContent = active.length ? active.join(' · ') : '전체 서비스를 표시합니다.';

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'status-card';
    empty.innerHTML = '<strong>조건에 맞는 서비스가 없습니다.</strong>검색어나 필터를 바꿔보세요.';
    serviceList.append(empty);
    return;
  }

  filtered.forEach((service) => serviceList.append(makeServiceCard(service, filters.keyword)));
}

form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('input', render);
form.addEventListener('change', render);

resetButton.addEventListener('click', () => {
  queryInput.value = '';
  categorySelect.value = '';
  agencySelect.value = '';
  onlineSelect.value = '';
  render();
  queryInput.focus();
});

fetch('services.json')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    services = data;
    addOptions(categorySelect, [...new Set(data.map((service) => service.안내분야))]);
    addOptions(agencySelect, [...new Set(data.map((service) => service.소관기관))]);
    render();
  })
  .catch(() => {
    resultCount.textContent = '0';
    activeFilter.textContent = '목록을 불러오지 못했습니다.';
    serviceList.setAttribute('aria-busy', 'false');
    serviceList.innerHTML = '<div class="status-card" role="alert"><strong>서비스 목록을 불러오지 못했습니다.</strong>잠시 후 페이지를 새로고침해 주세요.</div>';
  });
