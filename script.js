/* ============================================================
   СОДЕРЖИМОЕ ПРОГРАММЫ
   Классы → авторы → произведения
   slug — короткий идентификатор, попадёт в URL теста.
   ============================================================ */
const PROGRAM = {
  "9": [
    { author: "А.С. Пушкин", works: [
      { title: "Евгений Онегин",     slug: "pushkin-onegin" },
      { title: "Капитанская дочка",  slug: "pushkin-kapitanskaya" },
      { title: "Медный всадник",     slug: "pushkin-mednyj-vsadnik" },
    ]},
    { author: "Н.В. Гоголь", works: [
      { title: "Мёртвые души",       slug: "gogol-mertvye" },
      { title: "Шинель",             slug: "gogol-shinel" },
    ]},
    { author: "А.С. Грибоедов", works: [
      { title: "Горе от ума",        slug: "griboedov-gore" },
    ]},
  ],

  "8": [
    { author: "А.С. Пушкин", works: [
      { title: "Капитанская дочка",  slug: "pushkin-kapitanskaya-8" },
    ]},
    { author: "М.Ю. Лермонтов", works: [
      { title: "Мцыри",              slug: "lermontov-mcyri" },
    ]},
  ],

  "7": [
    { author: "Н.В. Гоголь", works: [
      { title: "Тарас Бульба",       slug: "gogol-taras" },
    ]},
  ],

  "6": [
    { author: "А.С. Пушкин", works: [
      { title: "Дубровский",         slug: "pushkin-dubrovskij" },
    ]},
  ],

  "5": [
    { author: "И.С. Тургенев", works: [
      { title: "Муму",               slug: "turgenev-mumu" },
    ]},
  ],
};

/* ============================================================
   Отрисовка меню (аккордеон)
   ============================================================ */
function buildMenu() {
  const nav = document.getElementById('menuNav');
  if (!nav) return;

  Object.keys(PROGRAM).forEach(classNum => {
    const block = document.createElement('div');
    block.className = 'class-block';

    // Кнопка класса
    const btn = document.createElement('button');
    btn.className = 'class-btn';
    btn.innerHTML = `<span>${classNum}й класс</span><span class="arrow">▶</span>`;
    block.appendChild(btn);

    // Тело класса
    const body = document.createElement('div');
    body.className = 'class-body';

    // Авторы
    PROGRAM[classNum].forEach((authorObj, aIdx) => {
      const aBlock = document.createElement('div');
      aBlock.className = 'author-block';

      const aBtn = document.createElement('button');
      aBtn.className = 'author-btn';
      aBtn.innerHTML = `<span>${authorObj.author}</span><span class="arrow">▶</span>`;
      aBlock.appendChild(aBtn);

      const aBody = document.createElement('div');
      aBody.className = 'author-body';

      authorObj.works.forEach(w => {
        const a = document.createElement('a');
        a.className = 'work-link';
        a.href = `test.html?class=${classNum}&work=${w.slug}`;
        a.textContent = w.title;
        aBody.appendChild(a);
      });

      aBlock.appendChild(aBody);
      body.appendChild(aBlock);

      // Аккордеон авторов (только один внутри класса)
      aBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = aBlock.classList.contains('open');
        body.querySelectorAll('.author-block').forEach(b => b.classList.remove('open'));
        if (!wasOpen) aBlock.classList.add('open');
      });
    });

    // Ссылка «Вся программа»
    const allLink = document.createElement('a');
    allLink.className = 'all-program';
    allLink.href = `test.html?class=${classNum}`;
    allLink.textContent = 'Вся программа';
    body.appendChild(allLink);

    block.appendChild(body);
    nav.appendChild(block);

    // Аккордеон классов (только один открыт)
    btn.addEventListener('click', () => {
      const wasOpen = block.classList.contains('open');
      nav.querySelectorAll('.class-block').forEach(b => b.classList.remove('open'));
      if (!wasOpen) block.classList.add('open');
    });
  });
}

/* ============================================================
   Индексация для поиска
   ============================================================ */
function buildSearchIndex() {
  const index = [];

  Object.keys(PROGRAM).forEach(classNum => {
    // Сам класс
    index.push({
      type: 'class',
      path: `${classNum}й класс`,
      name: `Вся программа — ${classNum}й класс`,
      url: `test.html?class=${classNum}`,
    });

    PROGRAM[classNum].forEach(authorObj => {
      // Автор
      index.push({
        type: 'author',
        path: `${classNum}й класс`,
        name: authorObj.author,
        url: `test.html?class=${classNum}&author=${encodeURIComponent(authorObj.author)}`,
      });

      authorObj.works.forEach(w => {
        // Произведение
        index.push({
          type: 'work',
          path: `${classNum}й класс · ${authorObj.author}`,
          name: w.title,
          url: `test.html?class=${classNum}&work=${w.slug}`,
        });
      });
    });
  });

  return index;
}

const SEARCH_INDEX = buildSearchIndex();

/* ============================================================
   Поиск с подсветкой
   ============================================================ */
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const safe = escapeHtml(text);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return safe.replace(re, '<mark>$1</mark>');
}

function runSearch(query) {
  const resultsBox = document.getElementById('searchResults');
  if (!resultsBox) return;

  const q = query.trim().toLowerCase();

  if (!q) {
    resultsBox.classList.remove('show');
    resultsBox.innerHTML = '';
    return;
  }

  const matches = SEARCH_INDEX.filter(item =>
    item.name.toLowerCase().includes(q) || item.path.toLowerCase().includes(q)
  ).slice(0, 20);

  if (matches.length === 0) {
    resultsBox.innerHTML = `<div class="search-empty">Ничего не найдено</div>`;
    resultsBox.classList.add('show');
    return;
  }

  resultsBox.innerHTML = matches.map(item => `
    <a class="search-result" href="${item.url}">
      <div class="path">${escapeHtml(item.path)}</div>
      <div class="name">${highlight(item.name, query.trim())}</div>
    </a>
  `).join('');

  resultsBox.classList.add('show');
}

/* ============================================================
   Общая логика страницы (шапка, шторка, поиск)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildMenu();

  const burger      = document.getElementById('burger');
  const drawer      = document.getElementById('drawer');
  const overlay     = document.getElementById('overlay');
  const searchBtn   = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const openDrawer = () => {
    drawer.classList.add('open');
    overlay.classList.add('show');
    burger.classList.add('active');
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    burger.classList.remove('active');
  };
  burger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  overlay.addEventListener('click', closeDrawer);

  const openSearch = () => {
    searchModal.classList.add('show');
    setTimeout(() => searchInput.focus(), 150);
  };
  const closeSearch = () => {
    searchModal.classList.remove('show');
    searchInput.value = '';
    searchResults.classList.remove('show');
    searchResults.innerHTML = '';
  };
  searchBtn.addEventListener('click', openSearch);
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  searchInput.addEventListener('input', (e) => runSearch(e.target.value));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeDrawer(); closeSearch(); }
  });
});