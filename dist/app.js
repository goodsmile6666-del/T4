const services = [
  {"서비스ID":"A001","서비스명":"주민등록 발급 안내","안내분야":"민원","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1374"},
  {"서비스ID":"A002","서비스명":"전입신고 안내","안내분야":"민원","소관기관":"보건복지부","온라인안내":"가능","콜센터":"1352"},
  {"서비스ID":"A003","서비스명":"인감증명 안내","안내분야":"민원","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1313"},
  {"서비스ID":"A004","서비스명":"민원접수 안내","안내분야":"민원","소관기관":"교육부","온라인안내":"가능","콜센터":"1341"},
  {"서비스ID":"A005","서비스명":"정부24 이용 안내","안내분야":"민원","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1356"},
  {"서비스ID":"A006","서비스명":"기초연금 안내","안내분야":"복지","소관기관":"행정안전부","온라인안내":"불가","콜센터":"1386"},
  {"서비스ID":"A007","서비스명":"복지급여 안내","안내분야":"복지","소관기관":"고용노동부","온라인안내":"가능","콜센터":"1319"},
  {"서비스ID":"A008","서비스명":"장애인지원 안내","안내분야":"복지","소관기관":"보건복지부","온라인안내":"가능","콜센터":"1337"},
  {"서비스ID":"A009","서비스명":"아동수당 안내","안내분야":"복지","소관기관":"지자체","온라인안내":"가능","콜센터":"1326"},
  {"서비스ID":"A010","서비스명":"지방세 납부 안내","안내분야":"세금","소관기관":"보건복지부","온라인안내":"가능","콜센터":"1357"},
  {"서비스ID":"A011","서비스명":"취득세 안내","안내분야":"세금","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1341"},
  {"서비스ID":"A012","서비스명":"재산세 안내","안내분야":"세금","소관기관":"지자체","온라인안내":"가능","콜센터":"1317"},
  {"서비스ID":"A013","서비스명":"자동차등록 안내","안내분야":"교통","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1399"},
  {"서비스ID":"A014","서비스명":"운전면허 안내","안내분야":"교통","소관기관":"보건복지부","온라인안내":"불가","콜센터":"1357"},
  {"서비스ID":"A015","서비스명":"주정차단속 안내","안내분야":"교통","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1367"},
  {"서비스ID":"A016","서비스명":"재난지원금 안내","안내분야":"재난","소관기관":"행정안전부","온라인안내":"불가","콜센터":"1356"},
  {"서비스ID":"A017","서비스명":"대피소 안내","안내분야":"재난","소관기관":"국세청","온라인안내":"가능","콜센터":"1359"},
  {"서비스ID":"A018","서비스명":"안전신고 안내","안내분야":"재난","소관기관":"국세청","온라인안내":"가능","콜센터":"1357"},
  {"서비스ID":"A019","서비스명":"국민취업지원 안내","안내분야":"일자리","소관기관":"지자체","온라인안내":"가능","콜센터":"1386"},
  {"서비스ID":"A020","서비스명":"구직급여 안내","안내분야":"일자리","소관기관":"국토교통부","온라인안내":"불가","콜센터":"1350"},
  {"서비스ID":"A021","서비스명":"청년일자리 안내","안내분야":"일자리","소관기관":"지자체","온라인안내":"가능","콜센터":"1392"},
  {"서비스ID":"A022","서비스명":"평생교육 안내","안내분야":"교육","소관기관":"국토교통부","온라인안내":"가능","콜센터":"1379"},
  {"서비스ID":"A023","서비스명":"학자금 안내","안내분야":"교육","소관기관":"지자체","온라인안내":"가능","콜센터":"1324"},
  {"서비스ID":"A024","서비스명":"교육비지원 안내","안내분야":"교육","소관기관":"행정안전부","온라인안내":"가능","콜센터":"1368"}
];

const searchInput = document.querySelector("#service-search");
const clearSearchButton = document.querySelector("#clear-search");
const filterList = document.querySelector("#category-filters");
const serviceList = document.querySelector("#service-list");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const template = document.querySelector("#service-template");
const categories = ["전체", ...new Set(services.map((service) => service.안내분야))];

let selectedCategory = "전체";

function renderFilters() {
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.textContent = category;
    button.dataset.category = category;
    button.setAttribute("aria-pressed", String(category === selectedCategory));
    button.addEventListener("click", () => {
      selectedCategory = category;
      filterList.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-pressed", String(item.dataset.category === selectedCategory));
      });
      renderServices();
    });
    fragment.append(button);
  });
  filterList.append(fragment);
}

function getFilteredServices() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("ko-KR");
  return services.filter((service) => {
    const matchesCategory = selectedCategory === "전체" || service.안내분야 === selectedCategory;
    const matchesKeyword = service.서비스명.toLocaleLowerCase("ko-KR").includes(keyword);
    return matchesCategory && matchesKeyword;
  });
}

function createServiceCard(service) {
  const card = template.content.firstElementChild.cloneNode(true);
  card.querySelector(".category-badge").textContent = service.안내분야;
  card.querySelector(".service-id").textContent = service.서비스ID;
  card.querySelector(".service-name").textContent = service.서비스명;
  card.querySelector(".agency").textContent = service.소관기관;

  const onlineStatus = card.querySelector(".online-status");
  onlineStatus.textContent = service.온라인안내;
  onlineStatus.classList.add(service.온라인안내 === "가능" ? "available" : "unavailable");

  const phoneNumber = card.querySelector(".phone-number");
  phoneNumber.textContent = service.콜센터;
  phoneNumber.href = `tel:${service.콜센터}`;
  phoneNumber.setAttribute("aria-label", `${service.서비스명} 콜센터 ${service.콜센터}`);
  return card;
}

function renderServices() {
  const filteredServices = getFilteredServices();
  const fragment = document.createDocumentFragment();
  filteredServices.forEach((service) => fragment.append(createServiceCard(service)));
  serviceList.replaceChildren(fragment);
  resultCount.textContent = filteredServices.length;
  emptyState.hidden = filteredServices.length !== 0;
  serviceList.hidden = filteredServices.length === 0;
  clearSearchButton.hidden = searchInput.value.length === 0;
}

function resetAll() {
  searchInput.value = "";
  selectedCategory = "전체";
  filterList.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === "전체"));
  });
  renderServices();
  searchInput.focus();
}

searchInput.addEventListener("input", renderServices);
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  renderServices();
  searchInput.focus();
});
document.querySelector("#reset-filters").addEventListener("click", resetAll);
document.querySelector("#empty-reset").addEventListener("click", resetAll);

renderFilters();
renderServices();
