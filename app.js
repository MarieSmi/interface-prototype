(() => {
  'use strict';

  // ---------- Данные ----------
  // Контент свёрстан целиком: середина (Главная / скелетон страницы раздела), справа информеры и ЦУ — одинаковые на всех страницах.
  const SKELETON_ROWS = 8;

  // Пункт подменю: [заголовок, уровень (1|2), элемент справа]
  // right (как в макете, Figma nuC4KFMiS36uDWDUp9wKGl 7706:22744; кликов нет): { count } — счётчик, { accent, count } — двойной
  // (акцентный + обычный), { accent } — только акцентный, 'arrow' — стрелка, 'plus' — плюс. submenu.headRight — то же у заголовка подменю.
  // У счётчика panel: true — своя зона клика и ховера («Открывать панель по клику на счетчик»); у заголовка 'plus-left' — «+»
  // вместо иконки по долгому наведению. pinned: true — пункт закреплён внизу колонки (окно настроек пункта).
  const sub = (title, level = 1, right) => ({ title, level, ...(right && { right }) });

  // Разделы аккордеона. icon — символ шрифта Accordion-Font.
  // submenu.cols — колонки подменю; submenu.head — своя подпись заголовка подменю (по умолчанию — название раздела).
  // submenu.headLabel — заголовок подменю только подпись (не пункт: не кликается, без ховера, в редакторе его нет).
  // Заголовок подменю ведёт на страницу раздела.
  const SECTIONS = [
    { id: 'contacts', title: 'Контакты', short: 'Контакты', icon: '',
      submenu: { cols: [[sub('Группы'), sub('Каналы'), sub('Новости'), sub('Звонки'), sub('Почта'),
        sub('Обсуждения'), sub('Обращения'), sub('Заявки')]] } },
    { id: 'tasks', title: 'Задачи', short: 'Задачи', icon: '',
      submenu: { head: 'Задачи на мне', cols: [
        [sub('От меня', 2), sub('На контроле', 2), sub('По сотрудникам', 2), sub('Разобрать', 2),
         sub('Доски'), sub('Проекты'), sub('Планы работ'), sub('Вехи и сроки'), sub('Кайдзен'), sub('Сбор отчетности')],
      ] } },
    { id: 'business', title: 'Бизнес', short: 'Бизнес', icon: '',
      submenu: { cols: [
        [sub('Продажи/CRM'), sub('Документы', 2), sub('Заказы', 2), sub('Клиенты', 2), sub('Активности', 2),
         sub('Розница/Кассы'), sub('Сервис'), sub('Сметы', 2), sub('Справочники', 2), sub('Виды работ', 2),
         sub('Транспорт'), sub('Машины', 2), sub('ЭТрН', 2), sub('Заказы', 2), sub('Штрафы', 2)],
        [sub('Каталог'), sub('Цены', 2), sub('Скидки и акции', 2), sub('Сертификаты', 2), sub('Списки товаров', 2), sub('Конкуренты', 2),
         sub('Маркетплейсы'), sub('Склад'), sub('Документы', 2), sub('Закупки/Расходы'), sub('Поставщики', 2), sub('Планы потребностей', 2), sub('Маркет')],
      ] } },
    { id: 'staff', title: 'Сотрудники', short: 'Сотр-ки', icon: '',
      submenu: { headRight: 'arrow', cols: [
        [sub('Проверка'), sub('Штат'), sub('Мотивация'), sub('Схемы', 2), sub('KPI', 2), sub('OKR', 2),
         sub('Кадровый учет'), sub('ГПХ', 2), sub('Заявления', 2), sub('Воинский учет', 2), sub('События', 2),
         sub('Вакансии'), sub('Подписи'), sub('Курсы'), sub('Списки')],
        [sub('Графики работ'), sub('Правила'), sub('Зарплата'), sub('Расчет', 2), sub('Больничные и пособия', 2), sub('Отпуска', 2),
         sub('Табели', 2), sub('Доп. начисления и удержания', 2), sub('Натуральный доход', 2), sub('Выплаты', 2),
         sub('Справки сотрудникам', 2), sub('Расчеты с физлицами', 2), sub('Налоги и отчетность', 2)],
      ] } },
    { id: 'docs', title: 'Документы', short: 'Док-ты', icon: '',
      submenu: { cols: [
        [sub('Входящие'), sub('Договоры'), sub('Факторинг'), sub('ЕГАИС'), sub('Меркурий'), sub('Маркировка'),
         sub('Прослеживаемость'), sub('Приказы / Извещения'), sub('Доверенности'), sub('Разобрать')],
        [sub('Исходящие'), sub('Акты сверки'), sub('Инструкции'), sub('База знаний'), sub('База знаний'), sub('Заметки', 1, 'plus')],
      ] } },
    { id: 'accounting', title: 'Учет', short: 'Учет', icon: '',
      submenu: { headLabel: true, cols: [
        [sub('Операции и проводки'), sub('Закрытие месяца'), sub('План счетов'), sub('Баланс'), sub('Имущество/НМА'),
         sub('Комиссия'), sub('Распределение затрат')],
        [sub('Налоги'), sub('ЕНС', 2), sub('НДС', 2), sub('Прибыль', 2), sub('УСН', 2), sub('АУСН', 2), sub('ЕСХН', 2),
         sub('Зарплатные', 2), sub('Взносы ИП', 2), sub('НДФЛ ИП', 2), sub('Патент', 2), sub('Имущественные', 2), sub('Прочие', 2)],
      ] } },
    { id: 'reports', title: 'Отчетность', short: 'Отчет-ть', icon: '',
      submenu: { cols: [[sub('Сдано | не сдано'), sub('Что сдавать'), sub('Доверенности'), sub('Аналитика')]] } },
    { id: 'companies', title: 'Компании', short: 'Комп-и', icon: '',
      submenu: { headRight: 'arrow', cols: [[sub('Наши контрагенты')]] } },
    { id: 'marketing', title: 'Маркетинг', short: 'Марке-нг', icon: '',
      submenu: { headLabel: true, cols: [
        [sub('Реклама'), sub('Реклама партнёров'), sub('Наши площадки'), sub('Реестр гостевого Wi-Fi'), sub('Сайты'),
         sub('Короткие ссылки'), sub('Посты'), sub('Отзывы'), sub('Аудитории')],
        [sub('Источники продаж'), sub('Коллтрекинг'), sub('Рассылки'), sub('Автообзвоны'), sub('Опросы')],
      ] } },
    { id: 'contact-center', title: 'Контакт-центр', short: 'К-центр', icon: '',
      submenu: { cols: [
        [sub('Чаты'), sub('Линии'), sub('Чат-боты'), sub('Почта компании'), sub('Телефония'), sub('Скрипты', 1, 'arrow'), sub('Интенты')],
        [sub('Обращения'), sub('Список', 2), sub('Клиенты', 2), sub('По видам', 2), sub('Инциденты')],
      ] } },
    { id: 'calendar', title: 'Календарь', short: 'Кален-рь', calendar: true,
      submenu: { cols: [[sub('Ежедневник'), sub('Планировщик'), sub('Табель'), sub('Встречи'), sub('Куда уходит время'), sub('Помещения')]] } },
    { id: 'profile', title: 'Сдобников С.В.', short: 'Сдобников', photo: 'assets/img/avatar-sdobnikov.png',
      submenu: { cols: [[sub('Инструкции'), sub('Зарплата'), sub('KPI'), sub('OKR'), sub('Мотивация'), sub('Мои планы'),
        sub('Документы'), sub('Настройки')]] } },
    { id: 'settings', title: 'Настройки', short: 'Настр-ки', icon: '',
      submenu: { cols: [[sub('Наши компании'), sub('Начальные остатки'), sub('Параметры учета'), sub('Кастомизация'),
        sub('Интеграции'), sub('Видеонаблюдение'), sub('KPI')]] } },
  ];

  // Исходный вид разделов — к нему возвращает ↺ в редакторе подменю.
  const PRISTINE = Object.fromEntries(SECTIONS.map((s) => [s.id, {
    title: s.title, short: s.short, icon: null, head: s.submenu.headLabel ? null : s.submenu.head ?? s.title, headRight: s.submenu.headRight ?? null, showHead: true, cols: s.submenu.cols.map((c) => c.slice()),
  }]));

  // Все разделы по id — и исходные, и добавленные в сценарии «Настройка аккордеона» (отмена / повтор возвращает их в список).
  const ALL_SECTIONS = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

  // Виды панели (окно «Меню» → «Состояние панели»): широкий аккордеон и три вида узкого.
  const PANEL_VIEWS = [
    { id: 'wide', title: 'Широкая' },
    { id: 'labels', title: 'Узкая с названиями' },
    { id: 'icons', title: 'Узкая без названий' },
    { id: 'panel', title: 'Раскрывается по ховеру' },
  ];

  // Настройки аккордеона — меняются в окне «Меню» и применяются сразу.
  const DEFAULTS = {
    view: 'wide',            // 'wide' — раскрытый | 'narrow' — узкий
    narrowView: 'labels',    // 'labels' | 'icons' | 'panel'
    submenuTrigger: 'click', // 'click' | 'hover'
  };
  const settings = { ...DEFAULTS };
  const COMMANDS_DELAY = 600; // мс до появления ✎ ⋮ на пункте
  const LEAVE_DELAY = 200;    // мс до закрытия подменю после ухода курсора (режим «по наведению»)

  const isNarrow = () => settings.view === 'narrow';
  const isPanel = () => isNarrow() && settings.narrowView === 'panel';
  // Без названий и в панели подменю открывается только по наведению.
  const triggerForced = () => isNarrow() && settings.narrowView !== 'labels';
  const trigger = () => (triggerForced() ? 'hover' : settings.submenuTrigger);

  const state = {
    page: { section: null, item: null }, // section=null → Главная
    openSection: null,
    panelOpen: false, // панель раскрыта по ховеру
    align: 'stretch', // позиционирование контента: 'stretch' | 'center' | 'left'
    informers: true, // «Информеры» в настройках правой панели: выкл — в колонке информеров нет кнопок телефона и чата
  };

  // ---------- DOM ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  const stage = $('#stage');
  const acc = $('#accordion');
  const list = $('#accList');
  const layer = $('#submenuLayer');
  const pageMain = $('#pageMain');
  const pageSkeleton = $('#pageSkeleton');

  // Рамка демо — модуль demo-frame (github.com/MarieSmi/ui-kit): шапка, сцена 1600×900 и вспомогательная панель
  // справа масштабируются как одно целое. Выбранный сценарий — в data-scenario у сцены, подсценарий вилки — в data-variant.
  let scale = 1;
  const frame = DemoFrame.mount({
    stage,
    head: {
      title: 'Настройка интерфейса в конструкторе', version: '27.1100',
      href: 'https://axure.tensor.ru/StandardsV8/guidelines.html', status: 'Запущено согласование 30.09.26',
    },
    devices: [
      { id: 'laptop', icon: 'laptop', label: 'Ноутбук', disabled: true }, // пока есть только монитор 1600×900
      { id: 'monitor', icon: 'monitor', label: 'Монитор', size: '1600х900', name: 'монитор' },
    ],
    device: 'monitor',
    // disabled — сценарий пока не сделан
    scenarios: [
      { id: 'demo', title: 'Общее демо' },
      { group: 'Точка захода в редактор', items: [
        { id: 'editor-inside', title: 'Админка (Inside)' },
        { id: 'editor-account', title: 'Аккаунт' },
        { id: 'editor-user', title: 'Пользователь', variants: [{ id: 'main', title: 'С главной' }, { id: 'settings', title: 'Из настроек' }] },
      ] },
    ],
    // сценарии «Аккордеон» и «Подменю» — в отдельном прототипе github.com/MarieSmi/accordion-setup;
    // сценарии «Добавление вкладки» (tab-toolbar, tab-dash-head) убраны с панели, код остался
    links: [
      { title: 'Макет', href: 'https://www.figma.com/proto/xMQ3ZEN4AUINgwjVoxR8hS/%D0%9D%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0-%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0-%D0%B2-%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80%D0%B5?node-id=16219-76404&p=f&t=RLyxreNsun3BEvZg-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=16219%3A76404&page-id=15961%3A68013&hide-ui=1' },
      { title: 'Настройка аккордеона', href: 'https://mariesmi.github.io/accordion-setup/' },
    ],
    team: [
      { label: 'Design', name: 'Смирнова Мария', links: [
        { title: 'Описание', href: 'https://project.sbis.ru/shared/disk/b5420018-3bcf-4a21-943d-7e19e3e7273a' },
        { title: 'Разработка макета', href: 'https://online.sbis.ru/opendoc.html?guid=01a0b8a6-0896-7495-b6ef-bb87253c728a&client=3' },
      ] },
      { label: 'Develop' },
    ],
    value: { scenario: stage.dataset.scenario },
    onScale: (s) => { scale = s; },
    onChange: ({ scenario, variant }) => {
      setMobile(false); // каждый сценарий начинается с десктопа
      stage.dataset.scenario = scenario;
      if (variant) stage.dataset.variant = variant;
      else delete stage.dataset.variant;
      // смена сценария закрывает все окна и меню на сцене
      closeOtherWindows();
      closePopups();
      closePlusMenu();
      closeIconPick();
      closeRpMore();
      closeAccMore();
      if (ae) closeAe();
      closeSubmenu();
      // каждый сценарий начинается с исходных вкладок; в «Добавлении вкладки» — одна «Главный», виджета вкладок нет
      closeTabsWin();
      selectTabs(false);
      resetTabs(scenario.startsWith('tab-'));
      removeAddedSections(); // пункты, добавленные в «Настройке аккордеона», живут только в этом сценарии
      resetHistory(); // смена сценария — не правка: история начинается заново
      setInside(variant ? `${scenario}:${variant}` : scenario);
      setEditorOnly();
    },
  });

  // Прямоугольник элемента в координатах сцены.
  function stageRect(node) {
    const s = stage.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    return { left: (r.left - s.left) / scale, top: (r.top - s.top) / scale, width: r.width / scale, height: r.height / scale };
  }

  const calendarHTML = () =>
    `<span class="acc-cal"><span class="acc-glyph acc-cal__frame"></span><span class="acc-cal__day">${new Date().getDate()}</span></span>`;

  // Своя иконка раздела, выбранная в редакторе: { font: 'cbuc24' | 'cbuc', ch }.
  const customGlyph = (ic) => `<span class="acc-glyph acc-glyph--${ic.font}">${ic.ch}</span>`;

  function iconHTML(sec) {
    if (sec.customIcon) return `<span class="acc-item__icon">${customGlyph(sec.customIcon)}</span>`;
    if (sec.photo) return `<img class="acc-item__photo" src="${sec.photo}" alt="">`;
    if (sec.calendar) return calendarHTML();
    return `<span class="acc-item__icon"><span class="acc-glyph">${sec.icon}</span></span>`;
  }

  // Иконка в заголовке подменю — как у пункта аккордеона: фото, календарь или символ шрифта.
  function headIconHTML(sec) {
    if (sec.customIcon) return `<span class="sm-head__icon"><span class="acc-item__icon">${customGlyph(sec.customIcon)}</span></span>`;
    if (sec.photo) return `<span class="sm-head__icon sm-head__icon--photo"><img class="sm-head__photo" src="${sec.photo}" alt=""></span>`;
    // Символ — в той же рамке, что в пункте аккордеона, чтобы иконка не сдвигалась при открытии подменю.
    return `<span class="sm-head__icon">${sec.calendar ? calendarHTML() : `<span class="acc-item__icon"><span class="acc-glyph">${sec.icon}</span></span>`}</span>`;
  }

  // ---------- Аккордеон ----------
  // Счётчик пункта аккордеона — из подменю: счётчик заголовка подменю, а без него — первого пункта (страница раздела по умолчанию).
  // Счётчик пункта аккордеона — счётчик заголовка подменю или его первого пункта
  function secCount(sec) {
    const isCount = (r) => r && typeof r === 'object';
    const r = isCount(sec.submenu?.headRight) ? sec.submenu.headRight : sec.submenu?.cols[0]?.[0]?.right;
    return isCount(r) ? r : null;
  }
  // у пункта аккордеона стрелка и «+» — свои (Figma 7706:22867): стрелка ArrowCutForward 8×16, «+» в круге 28
  function accRightHTML(r) {
    if (!r || r === 'plus-left') return '';
    if (r === 'arrow') return '<span class="sm-right acc-item__count acc-item__count--arrow"><span class="acc-arrow"></span></span>';
    if (r === 'plus') return '<span class="sm-right acc-item__count acc-item__count--plus"><span class="ico">&#xEB25;</span></span>';
    return rightHTML(r).replace('sm-right', 'sm-right acc-item__count');
  }
  const accCountHTML = (sec) => accRightHTML(secCount(sec));

  // Название пункта, не влезающее до элемента справа, помечается is-cut (CSS растворяет его конец) — следим за размером
  const cutObserver = new ResizeObserver((entries) => {
    for (const { target: t } of entries) t.classList.toggle('is-cut', t.scrollWidth > t.clientWidth + .5);
  });
  const watchCut = (root) => { for (const t of root.querySelectorAll('.acc-item__title')) cutObserver.observe(t); };

  function renderAccordion() {
    list.innerHTML = '';
    stage.classList.toggle('items-added', SECTIONS.some((s) => s.added)); // пин на «+» аккордеона — до первого добавленного пункта
    for (const sec of SECTIONS) {
      const li = el('li', 'acc-item' + (sec.pinned ? ' is-pinned' : ''));
      li.dataset.id = sec.id;
      const btn = el('button', 'acc-item__btn' + (sec.photo ? ' acc-item__btn--photo' : '') + (sec.submenu?.headRight === 'plus-left' ? ' has-plus-left' : ''),
        `${iconHTML(sec)}<span class="acc-item__title">${sec.title}</span>${accCountHTML(sec)}
         <span class="acc-item__short">${sec.short}</span>
         <span class="acc-cmds">
           <span class="acc-cmd" role="button" aria-label="Настроить"><span class="ico"></span></span>
           <span class="acc-cmd acc-cmd--dots" role="button" aria-label="Ещё"><span class="ico"></span></span>
         </span>`);
      btn.type = 'button';
      // Вторая строка — выбранный пункт подменю (видна только в раскрытом аккордеоне). Раздел и пункт — один блок
      // (Figma 16016:174944): общий фон у обёртки, ховер и команды ✎ ⋮ — у каждой строки свои.
      const subRow = el('button', 'acc-item__sub', `<span class="acc-item__sub-title"></span>
         <span class="acc-cmds">
           <span class="acc-cmd" role="button" aria-label="Настроить"><span class="ico"></span></span>
           <span class="acc-cmd acc-cmd--dots" role="button" aria-label="Ещё"><span class="ico"></span></span>
         </span>`);
      subRow.type = 'button';
      subRow.addEventListener('click', (e) => {
        const cmd = e.target.closest('.acc-cmd');
        if (cmd) { if (cmd.classList.contains('acc-cmd--dots')) toggleAccMore(sec.id, cmd, true); else openEditor(sec.id); return; }
        if (li.classList.contains('is-renaming')) return;
        btn.click();
      });
      const group = el('div', 'acc-item__group');
      group.append(btn, subRow);
      li.append(group);
      list.append(li);

      let timer = null;
      li.addEventListener('mouseenter', () => {
        li.classList.add('is-hover');
        timer = setTimeout(() => li.classList.add('is-delay'), COMMANDS_DELAY);
        if (trigger() === 'hover') {
          if (hasMenu(sec)) { if (state.openSection !== sec.id) openSubmenu(sec.id); }
          else closeSubmenu();
        }
      });
      li.addEventListener('mouseleave', () => {
        if (li.classList.contains('is-menu')) return; // пока открыто меню «⋮», строка остаётся подсвеченной, с командами
        clearTimeout(timer);
        li.classList.remove('is-hover', 'is-delay', 'is-sub-hover');
      });
      // переход между строками блока: подсветка и команды переезжают, задержка команд — заново
      const hoverRow = (sub) => {
        if (li.classList.contains('is-sub-hover') === sub) return;
        li.classList.toggle('is-sub-hover', sub);
        li.classList.remove('is-delay');
        clearTimeout(timer);
        timer = setTimeout(() => li.classList.add('is-delay'), COMMANDS_DELAY);
      };
      btn.addEventListener('mouseenter', () => hoverRow(false));
      subRow.addEventListener('mouseenter', () => hoverRow(true));
      btn.addEventListener('click', (e) => {
        // ✎ открывает редактор подменю; ⋮ — меню действий пункта.
        const cmd = e.target.closest('.acc-cmd');
        if (cmd) { if (cmd.classList.contains('acc-cmd--dots')) toggleAccMore(sec.id, cmd, false); else openEditor(sec.id); return; }
        if (li.classList.contains('is-renaming')) return;
        // Подменю для раздела ещё не нарисовано — переходим сразу на страницу раздела.
        if (!hasMenu(sec)) { navigate(sec.id, null); return; }
        if (state.openSection === sec.id) { if (trigger() === 'click') closeSubmenu(); }
        else openSubmenu(sec.id);
      });
    }
    syncAccordion();
    watchCut(list);
  }

  // Пункт подменю по ключу «колонка:строка».
  function subItem(sec, key) {
    const [ci, ii] = key.split(':').map(Number);
    return sec.submenu.cols[ci][ii];
  }
  const subTitle = (sec, key) => subItem(sec, key).title;

  function syncAccordion() {
    const { section, item } = state.page;
    for (const li of list.children) {
      const selected = li.dataset.id === section;
      li.classList.toggle('is-selected', selected);
      li.classList.toggle('is-open', li.dataset.id === state.openSection);
      const hasSub = selected && item != null;
      li.classList.toggle('has-sub', hasSub);
      if (hasSub) $('.acc-item__sub-title', li).textContent = subTitle(SECTIONS.find((s) => s.id === section), item);
    }
    renderMobile(); // ННП и мобильный аккордеон повторяют пункты и выбранную страницу
  }

  // Вид аккордеона по настройкам: раскрытый, узкий (с названиями / без), панель (свёрнута / раскрыта).
  // Сворачивание / разворачивание: ширина аккордеона и середины контента меняется плавно (CSS, .stage.is-resizing).
  // При сворачивании аккордеон до конца анимации остаётся раскрытым (обрезается по ширине), затем становится узким.
  const RESIZE_MS = 300;
  let resizeTimer = null;
  let shownNarrow = null; // вид аккордеона, применённый к сцене
  function applyView() {
    const narrow = isNarrow();
    if (shownNarrow !== null && narrow !== shownNarrow) {
      clearTimeout(resizeTimer);
      stage.classList.add('is-resizing');
      stage.classList.toggle('is-narrow', narrow);
      shownNarrow = narrow;
      resizeTimer = setTimeout(() => { stage.classList.remove('is-resizing'); applyAccView(); }, RESIZE_MS);
      if (narrow) return; // узкий вид — в конце анимации
    }
    shownNarrow = narrow;
    stage.classList.toggle('is-narrow', narrow);
    applyAccView();
  }

  function applyAccView() {
    const narrow = isNarrow();
    const panel = isPanel();
    if (!panel) state.panelOpen = false;
    acc.classList.toggle('is-narrow', narrow);
    acc.classList.toggle('is-panel', panel);
    acc.classList.toggle('is-panel-open', panel && state.panelOpen);
    acc.classList.toggle('is-compact', narrow && !(panel && state.panelOpen));
    acc.classList.toggle('is-labels', narrow && settings.narrowView === 'labels');
    $('#accBurger').setAttribute('aria-label', narrow ? 'Развернуть меню' : 'Свернуть меню');
    // в узком аккордеоне птичка не кнопка — клик по ней ведёт на «Главную», как и по всей шапке
    $('.acc-bird').dataset.tip = narrow ? 'На главную' : '';
  }

  function setPanelOpen(open) {
    if (!isPanel() || state.panelOpen === open) return;
    state.panelOpen = open;
    applyView();
  }

  // ---------- Уход курсора (режим «по наведению») ----------
  let leaveTimer = null;
  const cancelLeave = () => clearTimeout(leaveTimer);
  function scheduleLeave() {
    if (trigger() !== 'hover') return;
    cancelLeave();
    leaveTimer = setTimeout(() => { closeSubmenu(); setPanelOpen(false); }, LEAVE_DELAY);
  }

  acc.addEventListener('mouseenter', () => { cancelLeave(); setPanelOpen(true); });
  acc.addEventListener('mouseleave', scheduleLeave);

  // ---------- Подменю ----------
  // Элемент справа у пункта и заголовка подменю: счётчик, двойной счётчик, стрелка или плюс (без кликов)
  function rightHTML(r) {
    if (!r) return '';
    if (r === 'arrow') return '<span class="sm-right sm-right--arrow"><span class="ico">&#xE9AB;</span></span>';
    if (r === 'plus') return '<span class="sm-right sm-right--plus"><span class="ico">&#xEB25;</span></span>';
    if (r === 'plus-left') return ''; // «+» слева — вместо иконки заголовка (CSS .has-plus-left)
    return `<span class="sm-right${r.panel ? ' sm-right--btn' : ''}">${r.accent ? `<span class="sm-count sm-count--accent">${r.accent}</span>` : ''}${r.count ? `<span class="sm-count">${r.count}</span>` : ''}</span>`;
  }
  const itemHTML = (it) => `<span class="sm-item__title">${it.title}</span>${rightHTML(it.right)}`;
  const headTitleHTML = (sec, title) => `<span class="sm-head__title"><span class="sm-head__text">${title}</span>${rightHTML(sec.submenu.headRight)}</span>`;
  // Виджет «Календарь» под пунктами подменю Календаря — во всех видах подменю и в сводной
  function calendarWidgetHTML() {
    // Figma 9eLwMJLQCwT0xHKviN2j1P 16104:266292: «Месяц» со стрелками, дни недели, 6 недель; соседние месяцы серые, сб и вс — акцентным
    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('ru-RU', { month: 'long' });
    const start = new Date(now.getFullYear(), now.getMonth(), 1 - (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7);
    const cells = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((d) => `<span class="kind-cal__wd">${d}</span>`);
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const cls = (d.getMonth() !== now.getMonth() ? ' is-other' : '') + (i % 7 > 4 ? ' is-weekend' : '')
        + (d.toDateString() === now.toDateString() ? ' is-today' : '');
      cells.push(`<span class="kind-cal__day${cls}">${d.getDate()}</span>`);
    }
    return `<div class="kind-cal"><div class="kind-cal__head"><span class="kind-cal__arr"></span><span class="kind-cal__month">${month[0].toUpperCase() + month.slice(1)}</span><span class="kind-cal__arr"></span></div><div class="kind-cal__grid">${cells.join('')}</div></div>`;
  }
  // Подменю не бывает из одного пункта (заголовок тоже пункт; подпись headLabel — нет): такое не показывается,
  // клик по пункту аккордеона сразу ведёт на страницу раздела.
  function hasMenu(sec) {
    if (!sec.submenu) return false;
    if (sec.calendar) return true;
    const head = !sec.submenu.noHead && !sec.submenu.headLabel ? 1 : 0;
    return head + sec.submenu.cols.reduce((n, c) => n + c.length, 0) >= 2;
  }

  function openSubmenu(id) {
    const sec = SECTIONS.find((s) => s.id === id);
    closeSubmenu();
    if (!sec || !hasMenu(sec)) return;
    closeRp();
    state.openSection = id;

    // Вид подменю: по клику у раскрытого аккордеона — поверх пункта, с иконкой раздела;
    // по наведению и у узкого — справа от аккордеона, с жирным заголовком; у панели — справа, без заголовка.
    const kind = isPanel() ? 'panel' : (isNarrow() || trigger() === 'hover') ? 'narrow' : 'wide';
    const multi = sec.submenu.cols.length > 1;
    const box = el('div', `submenu submenu--${kind}` + (multi ? ' submenu--multi' : ''));
    const panel = el('div', 'submenu__panel');

    // Заголовок подменю ведёт на страницу раздела; у headLabel — только подпись. Удалённого в редакторе (noHead) нет.
    if (kind !== 'panel' && !sec.submenu.noHead) {
      const head = el('div', 'submenu__head');
      const headTitle = sec.submenu.head || sec.title;
      const label = sec.submenu.headLabel;
      const headBtn = el(label ? 'div' : 'button', 'sm-head' + (sec.submenu.headRight === 'plus-left' ? ' has-plus-left' : ''), kind === 'wide'
        ? `${headIconHTML(sec)}${headTitleHTML(sec, headTitle)}`
        : headTitleHTML(sec, headTitle));
      if (!label) {
        headBtn.type = 'button';
        headBtn.addEventListener('click', () => navigate(sec.id, null));
      }
      head.append(headBtn);
      panel.append(head);
    }

    const cols = el('div', 'submenu__cols');
    sec.submenu.cols.forEach((col, ci) => {
      const c = el('div', 'submenu__col');
      col.forEach((it, ii) => {
        const key = `${ci}:${ii}`;
        const b = el('button', 'sm-item' + (it.level === 2 ? ' sm-item--sub' : ''), itemHTML(it));
        b.type = 'button';
        if (state.page.section === sec.id && state.page.item === key) b.classList.add('is-current');
        b.addEventListener('click', () => navigate(sec.id, key));
        c.append(b);
      });
      cols.append(c);
    });
    panel.append(cols);
    if (sec.calendar) panel.insertAdjacentHTML('beforeend', calendarWidgetHTML());
    box.append(panel);

    // Плавающие кнопки: ✎ — у всех подменю; ✕ — только когда подменю открыто по клику (по наведению оно закрывается само).
    const float = el('div', 'submenu__float');
    if (trigger() === 'click') {
      const close = el('button', 'float-btn', `<img src="assets/img/close-menu.svg" width="12" height="12" alt="">`);
      close.type = 'button';
      close.setAttribute('aria-label', 'Закрыть');
      close.addEventListener('click', closeSubmenu);
      float.append(close);
    }
    const edit = el('button', 'float-btn float-btn--edit', '<span class="ico"></span>');
    edit.type = 'button';
    edit.setAttribute('aria-label', 'Редактировать подменю');
    edit.addEventListener('click', () => openEditor(sec.id));
    float.append(edit);
    box.append(float);

    layer.append(box);

    if (multi) fitMultiHead(box);

    // Позиция: поверх пункта (иконка заголовка совпадает с иконкой пункта)
    // или справа от аккордеона, вровень с пунктом.
    const li = list.querySelector(`[data-id="${id}"]`);
    const top = acc.offsetTop + li.offsetTop; // li позиционируется относительно .accordion
    box.style.left = (kind === 'wide' ? acc.offsetLeft + 4 : acc.offsetLeft + acc.offsetWidth + 4) + 'px';
    box.style.top = Math.min(top, 900 - box.offsetHeight) + 'px';

    box.addEventListener('mouseenter', cancelLeave);
    box.addEventListener('mouseleave', scheduleLeave);
    syncAccordion();
  }

  // Заголовок многоколоночного подменю — по ширине первой колонки (колонки шириной по самому длинному пункту).
  function fitMultiHead(box) {
    const headBtn = $('.sm-head', box);
    const col = $('.submenu__col', box);
    if (headBtn && col) headBtn.style.width = (col.offsetLeft + col.offsetWidth - headBtn.offsetLeft) + 'px';
  }

  function closeSubmenu() {
    layer.innerHTML = '';
    state.openSection = null;
    syncAccordion();
  }

  // ---------- Сводная «Виды подменю и пунктов»: подменю ----------
  // Статичные подменю из аккордеона (вид раскрытого аккордеона: с иконкой раздела): ховеры пунктов работают, кликов нет.
  const KINDS = [
    ['contacts', 'Одноколоночное'],
    ['business', 'Многоколоночное'],
    ['calendar', 'С виджетом'],
  ];
  const kindsBox = $('#submenuKinds');
  for (const [id, label] of KINDS) {
    const sec = SECTIONS.find((s) => s.id === id);
    const box = el('div', 'submenu submenu--wide' + (sec.submenu.cols.length > 1 ? ' submenu--multi' : ''));
    const panel = el('div', 'submenu__panel');
    panel.append(el('div', 'submenu__head', `<button class="sm-head" type="button">${headIconHTML(sec)}${headTitleHTML(sec, sec.submenu.head || sec.title)}</button>`));
    const cols = el('div', 'submenu__cols');
    for (const col of sec.submenu.cols) {
      const c = el('div', 'submenu__col');
      for (const it of col) c.append(el('button', 'sm-item' + (it.level === 2 ? ' sm-item--sub' : ''), itemHTML(it)));
      cols.append(c);
    }
    panel.append(cols);
    if (sec.calendar) panel.insertAdjacentHTML('beforeend', calendarWidgetHTML());
    box.append(panel);
    const kind = el('div', 'kind', `<div class="kind__label">${label}</div>`);
    kind.append(box);
    kindsBox.append(kind);
    // сводная скрыта до выбора сценария — ширина заголовка считается, когда подменю появляется
    if (sec.submenu.cols.length > 1) new ResizeObserver(() => box.offsetWidth && fitMultiHead(box)).observe(box);
  }

  // ---------- Сводная «Виды подменю и пунктов»: пункты ----------
  // Отличающиеся пункты подменю по группам; справа от каждой строки — подпись варианта. Ховеры работают, кликов нет.
  const secById = (id) => SECTIONS.find((s) => s.id === id);
  const wideHead = (id) => `<button class="sm-head" type="button">${headIconHTML(secById(id))}<span class="sm-head__title">${secById(id).title}</span></button>`;
  const ITEM_KINDS = [
    { label: 'Иконка / фото / дата', rows: [
      ['иконка', wideHead('contacts')], ['фото', wideHead('profile')], ['дата', wideHead('calendar')]] },
    { label: 'С действием / без действия', rows: [
      ['с действием', wideHead('contacts')],
      ['без действия', `<div class="sm-head">${headIconHTML(secById('accounting'))}<span class="sm-head__title">Учет</span></div>`]] },
    { label: 'Уровень вложенности', rows: [
      ['первый', '<button class="sm-item" type="button">Продажи/CRM</button>'],
      ['второй', '<button class="sm-item sm-item--sub" type="button">Документы</button>']] },
    { label: 'Элемент справа', rows: [
      ['новые и общие события', `<button class="sm-item" type="button">${itemHTML(sub('Входящие', 1, { accent: '20', count: '20.7K' }))}</button>`],
      ['только новые события', `<button class="sm-item" type="button">${itemHTML(sub('Группы', 1, { accent: '5' }))}</button>`],
      ['общие', `<button class="sm-item" type="button">${itemHTML(sub('Разобрать', 1, { count: '62' }))}</button>`],
      ['стрелка', `<button class="sm-item" type="button">${itemHTML(sub('Скрипты', 1, 'arrow'))}</button>`],
      ['плюс', `<button class="sm-item" type="button">${itemHTML(sub('Заметки', 1, 'plus'))}</button>`]] },
  ];
  const itemKindsBox = kindsBox.appendChild(el('div', 'kinds__items')); // колонкой справа от видов подменю
  for (const k of ITEM_KINDS) {
    const box = el('div', 'submenu submenu--wide');
    const panel = el('div', 'submenu__panel');
    const states = el('div', 'item-kind__states');
    for (const [state, html] of k.rows) {
      const row = html.includes('sm-head') ? el('div', 'submenu__head', html) : el('div', 'submenu__cols', `<div class="submenu__col">${html}</div>`);
      panel.append(row);
      states.append(el('div', 'item-kind__state', state));
    }
    box.append(panel);
    const kind = el('div', 'kind', `<div class="kind__label">${k.label}</div>`);
    const body = el('div', 'item-kind');
    body.append(box, states);
    kind.append(body);
    itemKindsBox.append(kind);
  }

  // ---------- Позиционирование контента (переключатель в шапке) ----------
  // «Растянуть» — контент на всю рабочую область; «По центру» / «Слева» — блок 1238
  // (аккордеон + контент + информеры + ЦУ) по центру области 1538 или у её левого края.
  // Плавно меняются ширина середины и центровка (CSS, --mid / --center): середина перестраивается
  // по ширине, аккордеон и ЦУ идут за её краями.
  const ALIGN_MS = 300; // как transition у .stage.is-aligning
  const alignBtns = [...document.querySelectorAll('#alignGroup .tb-btn')];
  let alignTimer = null;
  function setAlign(align) {
    if (align === state.align) return;
    state.align = align;
    clearTimeout(alignTimer);
    stage.classList.add('is-aligning');
    stage.classList.toggle('is-aligned', align !== 'stretch');
    // Центровку не снимаем при «Растянуть»: сдвиг сам уходит в 0, пока середина расширяется.
    if (align !== 'stretch') stage.classList.toggle('is-align-center', align === 'center');
    for (const b of alignBtns) {
      const on = b.dataset.align === align;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', on);
    }
    closeSubmenu();
    alignTimer = setTimeout(() => stage.classList.remove('is-aligning'), ALIGN_MS);
  }
  for (const b of alignBtns) b.addEventListener('click', () => setAlign(b.dataset.align));

  // ---------- Навигация ----------
  // Главная или скелетон страницы раздела (один на все разделы).
  function updatePage() {
    const page = state.page.section ? 'skeleton' : 'main';
    pageMain.hidden = page !== 'main';
    pageSkeleton.hidden = page !== 'skeleton';
    stage.classList.toggle('is-skeleton', page === 'skeleton');
    renderMobile();
  }
  // Строки-заглушки реестра в скелетоне
  $('#skList').innerHTML = '<div class="sk-row"><div class="sk-row__pic"></div><div class="sk-row__body"><div class="sk-row__lines"></div><div class="sk-row__tag"></div></div></div>'.repeat(SKELETON_ROWS);

  // Переход на другую страницу при несохранённых правках (история не на исходном снимке) — сначала «Сохранить изменения
  // текущей страницы?»: «Да» — правки остаются, «Нет» — откатываются, в обоих случаях переход; «Отмена» — остаться.
  const navConfirm = $('#navConfirm');
  let navPending = null;
  function navigate(section, item) {
    const same = state.page.section === section && state.page.item === item;
    if (!same && pageDirty()) {
      navPending = { section, item };
      closeSubmenu();
      setPanelOpen(false);
      navConfirm.hidden = false;
      return;
    }
    goPage(section, item);
  }
  navConfirm.addEventListener('click', (e) => {
    const answer = e.target.closest('[data-answer]')?.dataset.answer;
    if (!answer) return;
    navConfirm.hidden = true;
    const to = navPending;
    navPending = null;
    if (answer === 'cancel' || !to) return;
    if (answer === 'no') restore(hist[0]);
    resetHistory(); // сохранено или откачено — новая страница начинает с чистой истории
    goPage(to.section, to.item);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || navConfirm.hidden) return;
    e.stopImmediatePropagation(); // Esc — как «Отмена»
    navConfirm.hidden = true;
    navPending = null;
  }, true);
  function goPage(section, item) {
    state.page = { section, item };
    if (section) leaveTabs();
    updatePage();
    closeSubmenu();
    setPanelOpen(false);
    setMobAcc(false); // выбор страницы закрывает мобильный аккордеон
  }

  // ---------- Мобильный вид ----------
  // Кнопка «мобилка» в шапке: вместо аккордеона и контента — экран 400 с картинкой страницы
  // (Главная / скелетон раздела) и ННП внизу. ННП: «Меню», «Главная», затем разделы аккордеона по порядку;
  // клик по разделу открывает его страницу. «Меню» открывает аккордеон поверх экрана: закрывается по затемнению,
  // повторному «Меню» и выбору страницы; пункты мобильного аккордеона без кликов (только ховер / нажатие).
  // Узлы ищутся при каждом вызове: renderMobile зовётся и из рендера аккордеона при запуске.
  const isMobile = () => stage.classList.contains('is-mobile');
  const MOB_PAGES = { main: 'assets/img/mobile/main.png', skeleton: 'assets/img/mobile/skeleton.png' };

  // У активного пункта ННП иконка залитая (Figma 18871:38476: Контакты E928 → E98E, Главная E933 → E98A) — пары из Accordion-Font.
  // Свои иконки, фото и календарь — без заливки, только темнее.
  const NNP_FILLED = {
    '': '', '': '', '': '', '': '', '': '', '': '',
    '': '', '': '', '': '', '': '', '': '', '': '',
  };
  const nnpGlyph = (ch, on) => `<span class="nnp__glyph">${on ? NNP_FILLED[ch] ?? ch : ch}</span>`;
  function nnpIconHTML(sec, on) {
    if (sec.customIcon) return customGlyph(sec.customIcon);
    if (sec.photo) return `<img class="acc-item__photo" src="${sec.photo}" alt="">`;
    if (sec.calendar) return calendarHTML();
    return nnpGlyph(sec.icon, on);
  }
  function nnpItemHTML(id, icon, text, on, count) {
    return `<button class="nnp__item${on ? ' is-on' : ''}" type="button" data-id="${id}">
      <span class="nnp__icon">${icon}</span><span class="nnp__text">${text}</span>${count ? `<span class="nnp__count">${count}</span>` : ''}</button>`;
  }

  function renderMobile() {
    if (!stage.classList.contains('is-mobile')) return;
    const { section } = state.page;
    $('#mobPage').src = MOB_PAGES[section ? 'skeleton' : 'main'];
    $('#mobLogo').hidden = !!section; // логотип — только в шапке Главной
    $('#nnpList').innerHTML = nnpItemHTML('', nnpGlyph('', !section), 'Главная', !section)
      + SECTIONS.map((s) => nnpItemHTML(s.id, nnpIconHTML(s, s.id === section), s.short, s.id === section, secCount(s)?.accent)).join('');
    $('#mobAccList').innerHTML = SECTIONS.map((s) => `<li class="mob-acc__item${s.id === section ? ' is-selected' : ''}${s.pinned ? ' is-pinned' : ''}">
      <div class="mob-acc__btn"><span class="mob-acc__icon">${iconHTML(s)}</span><span class="mob-acc__title">${s.title}</span></div></li>`).join('');
  }

  function setMobAcc(open) {
    const box = $('#mobAcc');
    if (box) box.hidden = !open;
    $('#nnpMenu')?.classList.toggle('is-on', open);
  }

  function setMobile(on) {
    if (on === isMobile()) return;
    closeOtherWindows();
    closePopups();
    closeSubmenu();
    closeAccMore();
    stage.classList.toggle('is-mobile', on);
    $('#mob').hidden = !on;
    $('#devDesktop').classList.toggle('is-active', !on);
    $('#devMobile').classList.toggle('is-active', on);
    setMobAcc(false);
    renderMobile();
  }
  $('#devDesktop').addEventListener('click', () => setMobile(false));
  $('#devMobile').addEventListener('click', () => setMobile(true));
  for (const n of document.querySelectorAll('.mob-acc__saby, .mob-logo__saby')) n.innerHTML = $('#goHome').innerHTML;
  $('#nnpMenu').addEventListener('click', () => setMobAcc($('#mobAcc').hidden));
  $('#mobVeil').addEventListener('click', () => setMobAcc(false));
  $('#nnpList').addEventListener('click', (e) => {
    const item = e.target.closest('.nnp__item');
    if (item) navigate(item.dataset.id || null, null);
  });

  // На «Главную» ведёт клик по строке шапки, кроме птички (открывает окно «Логотип») и «+».
  // В узком аккордеоне (любой вид) птичка не кнопка: клик по ней, как и по всей шапке, ведёт на «Главную».
  $('.acc-header__row').addEventListener('click', (e) => {
    if (e.target.closest(isNarrow() ? '.acc-plus' : '.acc-plus, .acc-bird')) return;
    navigate(null, null);
  });

  // Клик вне подменю и аккордеона закрывает подменю.
  stage.addEventListener('mousedown', (e) => {
    if (!state.openSection) return;
    if (e.target.closest('.submenu') || e.target.closest('.acc-item')) return;
    closeSubmenu();
  });

  // ---------- Окна настроек (общее) ----------
  // Открыто всегда только одно окно. Окно открывается поверх вызвавшей кнопки (левый край — по кнопке,
  // верх — по верху шапки, как в макете) и перетаскивается за шапку в пределах сцены.
  const windows = {}; // имя → { win, btn, onOpen, onClose }
  let openWin = null;

  // Одновременно открыто одно окно на сцене: «Меню», «Логотип», окна правой панели, «Тема», выбор цвета, «Фон», «Вкладки», меню «Язык».
  // Каждое окно перед открытием закрывает остальные (своё закрывать не нужно — его закрывающая функция ничего не сломает).
  function closeOtherWindows() {
    setWindow(null);
    closeRp();
    closeThemePanel();
    closeColorWin();
    closeBgWin();
    if (tw) closeTabsWin();
    closeLangMenu();
    closeItemWin();
  }

  function registerWindow(name, { win, btn, onOpen = () => {}, onClose = () => {} }) {
    windows[name] = { win, btn, onOpen, onClose };
    btn.addEventListener('click', () => setWindow(openWin === name && !openFrom ? null : name));
    win.querySelector('.sw-done').addEventListener('click', () => setWindow(null));
    win.querySelector('.sw-close').addEventListener('click', () => setWindow(null));
    win.querySelector('.set-win__head').addEventListener('mousedown', (e) => startDrag(e, win));
  }

  // from — элемент, из которого открыто окно (по умолчанию его кнопка в шапке конструктора).
  // Из шапки: левый край по кнопке, верх по верху шапки, кнопка подсвечена. Из аккордеона (птичка): окно
  // встаёт углом на угол шапки аккордеона (отступы 12 и 7 от птички), кнопка в шапке не подсвечена.
  let openFrom = null;
  // from — элемент, от которого открыто окно (птичка аккордеона — окно на нём); side = { right } — окно справа от right в 8px, верх — по from
  function setWindow(name, from = null, side = null) {
    if (name) closeOtherWindows();
    if (openWin) {
      const w = windows[openWin];
      w.win.hidden = true;
      w.btn.classList.remove('is-active');
      w.onClose();
    }
    openFrom?.classList.remove('is-win-open');
    openWin = name;
    openFrom = from;
    if (!name) return;
    from?.classList.add('is-win-open');
    const w = windows[name];
    w.win.hidden = false;
    if (from && side) {
      const r = stageRect(from), edge = stageRect(side.right);
      w.win.style.left = Math.round(Math.min(edge.left + edge.width + 8, 1600 - w.win.offsetWidth)) + 'px';
      w.win.style.top = Math.round(Math.max(0, r.top)) + 'px';
    } else if (from) {
      const r = stageRect(from);
      w.win.style.left = Math.round(Math.max(0, r.left - 12)) + 'px';
      w.win.style.top = Math.round(Math.max(0, r.top - 7)) + 'px';
    } else {
      w.btn.classList.add('is-active');
      // 1 — внутренний отступ группы кнопок: окно встаёт по её краю, как в макете (Меню — 8px, Логотип — 86px).
      w.win.style.left = Math.round(stageRect(w.btn).left - 1) + 'px';
      w.win.style.top = '0px';
    }
    w.onOpen();
  }

  function startDrag(e, win) {
    if (e.button !== 0 || e.target.closest('button, .sme-title, .sme-icon, .iw-title, .ae-brand')) return;
    e.preventDefault();
    closePopups();
    const startX = e.clientX, startY = e.clientY;
    const left0 = win.offsetLeft, top0 = win.offsetTop;
    const move = (ev) => {
      const left = left0 + (ev.clientX - startX) / scale;
      const top = top0 + (ev.clientY - startY) / scale;
      win.style.left = Math.max(0, Math.min(1600 - win.offsetWidth, left)) + 'px';
      win.style.top = Math.max(0, Math.min(900 - win.offsetHeight, top)) + 'px';
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      win.classList.remove('is-dragging');
    };
    win.classList.add('is-dragging');
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  // Всплывающие списки внутри окон («Состояние панели», «Иконка»).
  function closePopups() { closeDropdown(); closeIconMenu(); closeTabMenus(); }

  // ---------- Окно «Меню» ----------
  const menuWin = $('#menuWin');
  const resetBtn = $('#mwReset');
  const narrowLink = $('#mwNarrowLink');
  const dropdown = $('#mwMenu');
  const dropdownList = $('#mwMenuList');

  const panelView = () => (isNarrow() ? settings.narrowView : 'wide');

  function renderWin() {
    narrowLink.textContent = PANEL_VIEWS.find((v) => v.id === panelView()).title;
    const forced = triggerForced();
    for (const r of menuWin.querySelectorAll('.mw-radio')) {
      const value = r.dataset.trigger;
      r.classList.toggle('is-on', value === trigger());
      r.classList.toggle('is-forced', forced && value === 'hover');
      r.disabled = forced && value === 'click';
    }
    resetBtn.disabled = Object.keys(DEFAULTS).every((k) => settings[k] === DEFAULTS[k]);
  }

  // Любое изменение в окне применяется к аккордеону сразу.
  function update(patch) {
    Object.assign(settings, patch);
    closeSubmenu();
    applyView();
    renderWin();
  }

  registerWindow('menu', { win: menuWin, btn: $('#menuBtn'), onOpen: renderWin, onClose: closeDropdown });
  resetBtn.addEventListener('click', () => update(DEFAULTS));
  for (const r of menuWin.querySelectorAll('.mw-radio')) r.addEventListener('click', () => update({ submenuTrigger: r.dataset.trigger }));
  // Бургер в шапке аккордеона сворачивает / разворачивает меню — как «Широкий» и узкие виды в окне «Меню».
  $('#accBurger').addEventListener('click', () => update({ view: isNarrow() ? 'wide' : 'narrow' }));
  // Значки ховера загружаем заранее, иначе при первом наведении круг на миг пустой.
  for (const n of ['collapse', 'expand']) new Image().src = `assets/img/burger-${n}.svg`;

  // Выпадающий список «Состояние панели»: всегда открывается на одном месте — первый пункт встаёт на место ссылки.
  function openDropdown() {
    dropdownList.innerHTML = '';
    PANEL_VIEWS.forEach((v) => {
      const b = el('button', 'mw-menu__item' + (v.id === panelView() ? ' is-on' : ''),
        `<span class="mw-menu__dot"></span><span class="mw-menu__text">${v.title}</span>`);
      b.type = 'button';
      b.addEventListener('click', () => { closeDropdown(); update(v.id === 'wide' ? { view: 'wide', narrowView: DEFAULTS.narrowView } : { view: 'narrow', narrowView: v.id }); });
      dropdownList.append(b);
    });
    dropdown.hidden = false;
    const r = stageRect(narrowLink);
    // 30 = отступ списка 8 + отступ пункта 8 + маркер 12 + 2; 12 — верхний отступ списка, 16 — половина пункта.
    dropdown.style.left = (r.left - 30) + 'px';
    dropdown.style.top = (r.top + r.height / 2 - 12 - 16) + 'px';
  }
  function closeDropdown() { dropdown.hidden = true; }

  narrowLink.addEventListener('click', () => (dropdown.hidden ? openDropdown() : closeDropdown()));
  $('#mwMenuClose').addEventListener('click', closeDropdown);
  stage.addEventListener('mousedown', (e) => {
    if (dropdown.hidden || e.target.closest('#mwMenu') || e.target === narrowLink) return;
    closeDropdown();
  });

  // ---------- Меню «Язык» (Figma 16065:176561) ----------
  // Кнопка «Язык RU» в шапке открывает меню языков. Пока только ховеры: клик по языку и «•••» ничего не делают.
  // Строка выбранного языка встаёт на высоту кнопки, ✕ меню — ровно поверх ✕ шапки конструктора (как на макете экрана).
  const LANGS = [['RU', 'Русский'], ['EN', 'English'], ['KK', 'Қазақша'], ['FR', 'Français'], ['UZ', 'Oʻzbek'], ['AR', 'اللغة العربية'], ['HE', 'עִברִי']];
  const langBtn = $('#langBtn');
  const langMenu = $('#langMenu');
  $('#langMenuList').innerHTML = LANGS.map(([code, name], i) =>
    `<div class="mw-menu__item${i === 0 ? ' is-on' : ''}"><span class="mw-menu__dot"></span><span class="lang-menu__code">${code}</span><span class="mw-menu__text">${name}</span></div>`).join('') +
    '<div class="lang-menu__more"><img src="assets/img/lang-more.svg" width="32" height="10" alt="Ещё"></div>';

  function openLangMenu() {
    closeOtherWindows(); // меню «Язык» — как окно: открыто одно
    langMenu.hidden = false;
    langBtn.classList.add('is-active');
    const btn = stageRect(langBtn);
    const close = stageRect($('.ctor-header .close-btn'));
    // правый край меню — по центру ✕ шапки (✕ меню: right −14, 28px); 8 — верхний отступ списка, 16 — половина строки
    langMenu.style.left = Math.round(close.left + close.width / 2 - langMenu.offsetWidth) + 'px';
    langMenu.style.top = Math.round(btn.top + btn.height / 2 - 8 - 16) + 'px';
  }
  function closeLangMenu() { langMenu.hidden = true; langBtn.classList.remove('is-active'); }

  langBtn.addEventListener('click', () => (langMenu.hidden ? openLangMenu() : closeLangMenu()));
  $('#langMenuClose').addEventListener('click', closeLangMenu);
  stage.addEventListener('mousedown', (e) => {
    if (!langMenu.hidden && !e.target.closest('#langMenu, #langBtn')) closeLangMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !langMenu.hidden) closeLangMenu(); });

  // ---------- Окно «Логотип» ----------
  // Логотип — иконка вместо птички в шапке аккордеона. «Загрузка» подставляет случайную иконку из набора.
  const LOGOS = ['leaf', 'sun', 'drop', 'hex', 'star'].map((n) => `assets/img/logos/${n}.svg`);
  const logoWin = $('#logoWin');
  const logoReset = $('#lwReset');
  const iconMenu = $('#iconMenu');
  let logo = null; // null — стандартная птичка

  const logoHTML = () => (logo ? `<img class="logo-img" src="${logo}" width="24" height="24" alt="">` : '<span class="ico24"></span>');

  // Логотип применяется сразу: в шапке аккордеона и в превью окна.
  function renderLogo() {
    for (const b of document.querySelectorAll('.acc-bird')) b.innerHTML = logoHTML(); // и птичка в шапке редактора аккордеона
    $('#lwBird .lw-bird__logo').innerHTML = logoHTML();
    logoReset.disabled = logo === null;
  }

  function setLogo(src) { logo = src; renderLogo(); }

  // Меню «Иконка»: открывается так, что скрепка в его заголовке встаёт на место нажатой кнопки.
  function openIconMenu(trigger) {
    iconMenu.hidden = false;
    const r = stageRect(trigger);
    // 20 — отступ заголовка слева, 12 — половина иконки 24; 8 — верхний отступ меню, 14 — половина строки заголовка.
    iconMenu.style.left = Math.round(r.left + r.width / 2 - 20 - 12) + 'px';
    iconMenu.style.top = Math.round(r.top + r.height / 2 - 8 - 14) + 'px';
  }
  function closeIconMenu() { iconMenu.hidden = true; }

  registerWindow('logo', { win: logoWin, btn: $('#logoBtn'), onOpen: renderLogo, onClose: closeIconMenu });
  // Птичка в шапке аккордеона открывает то же окно, что кнопка «Логотип» в шапке конструктора.
  // «Пользователь» логотип не настраивает: окна нет ни из шапки конструктора, ни из аккордеона, ни из его редактора.
  const logoOn = () => stage.dataset.scenario !== 'editor-user';
  $('.acc-bird').addEventListener('click', (e) => isNarrow() || !logoOn() || setWindow(openWin === 'logo' && openFrom ? null : 'logo', e.currentTarget));
  logoReset.addEventListener('click', () => setLogo(null));
  $('#lwBird').addEventListener('click', (e) => openIconMenu(e.currentTarget));
  $('#iconMenuClose').addEventListener('click', closeIconMenu);
  for (const item of iconMenu.querySelectorAll('.icon-menu__item')) {
    item.addEventListener('click', () => {
      const choices = LOGOS.filter((src) => src !== logo);
      setLogo(choices[Math.floor(Math.random() * choices.length)]);
      closeIconMenu();
    });
  }
  stage.addEventListener('mousedown', (e) => {
    if (iconMenu.hidden || e.target.closest('#iconMenu') || e.target.closest('#lwBird')) return;
    closeIconMenu();
  });

  // ---------- Окна правой панели ----------
  // Клик по иконке открывает её окно слева от колонки, повторный — закрывает; открыто одно окно.
  // Закрывают также клик мимо окна, Esc, открытие окна настроек, подменю или редактора.
  // Верх окна — по верху иконки, высота — по содержимому; data-fit="full" («Магазин») — до низа панели.
  let rpOpen = null;
  const rpBtn = (name) => $(`.rp-btn[data-rp="${name}"]`);

  function openRp(name) {
    const win = $('#rp-' + name);
    closeRp();
    if (!win) return;
    closeOtherWindows();
    closeSubmenu();
    rpOpen = name;
    const btn = rpBtn(name);
    btn.classList.add('is-active');
    win.hidden = false;
    win.style.top = Math.round(stageRect(btn).top) + 'px';
    win.style.bottom = win.dataset.fit === 'full' ? '8px' : '';
  }

  function closeRp() {
    if (!rpOpen) return;
    closeRpMenu();
    $('#rp-' + rpOpen).hidden = true;
    rpBtn(rpOpen).classList.remove('is-active');
    rpOpen = null;
  }

  for (const b of document.querySelectorAll('.rp-btn[data-rp]')) {
    b.addEventListener('click', () => (rpOpen === b.dataset.rp ? closeRp() : openRp(b.dataset.rp)));
  }
  stage.addEventListener('mousedown', (e) => {
    if (!rpMenu.hidden && !e.target.closest('#rpMenu, .rp-link')) closeRpMenu();
    if (rpOpen && !e.target.closest('.rp-win, .rp-btn[data-rp], #rpMenu')) closeRp();
  });
  // Esc сначала закрывает выпадающий список, потом окно.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!rpMenu.hidden) closeRpMenu();
    else closeRp();
  });

  // «Магазин»: список категорий (статика с ховером). open — раскрытый раздел, closed — свёрнутый, child — подраздел.
  const SHOP_CATS = [
    ['Все', 240, 'selected'], ['Секции', 4], ['Навигация', 1], ['Продажи', 32, 'open'],
    ['Каталог и цены', 7, 'child'], ['Розница', 10, 'child'], ['Presto', 2, 'child'], ['Saby Clients', 1, 'child'], ['Документы продаж', 6, 'child'],
    ['Отчетность', 7, 'closed'], ['Базовые возможности', 9, 'closed'], ['Документооборот', 5, 'closed'], ['Управление персоналом', 26, 'closed'],
    ['Бухгалтерия и зарплата', 40, 'closed'], ['Деньги', 5], ['Торги', 13], ['Компании', 9], ['Маркетинг', 6],
    ['CRM и контакт центр', 32, 'closed'], ['Задачи и проекты', 6], ['Корпоративная соцсеть', 21, 'closed'], ['Видеонаблюдение', 1],
    ['Управление транспортом', 6], ['Сайт', 21, 'closed'],
  ];
  const ARROWS = { open: '&#xE9AA;', closed: '&#xE9C2;' };
  $('#rpCats').innerHTML = SHOP_CATS.map(([name, count, kind]) =>
    `<div class="rp-cat${kind === 'child' ? ' rp-cat--child' : ''}${kind === 'selected' ? ' is-selected' : ''}">` +
    `<span class="ico rp-cat__arrow">${ARROWS[kind] ?? ''}</span><span class="rp-cat__name">${name}</span><span class="rp-cat__count">${count}</span></div>`).join('');

  // Карточки на картинке превью (координаты из макета 16041:48565): [x, y, ширина, высота, большая — с «+», действие].
  const SHOP_WIDGETS = [
    [12, 35, 75.5, 32], [95.5, 35, 75.5, 32], [179, 35, 75.5, 32], [262.5, 35, 75.5, 32], // секции
    [12, 108, 326, 52, true, 'tabs'], // вкладки
    [12, 247, 326, 50, true], [12, 372, 326, 202, true], [12, 634, 326, 50, true], // наценка, номенклатура, остаток
    [12, 759, 326, 202, true], // отчеты
  ];
  $('#rpShopPv').insertAdjacentHTML('beforeend', SHOP_WIDGETS.map(([x, y, w, h, big, act]) =>
    `<div class="rp-wz"${act ? ` data-act="${act}"` : ''} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${big ? '<span class="ico24 rp-wz__plus">&#xEAE9;</span>' : ''}</div>`).join(''));
  // Сценарий «Из магазина» (Figma 18797:65742): клик по «Вкладкам» закрывает магазин, виджет вкладок встаёт на своё место
  // с новой пустой вкладкой (addBlankTab). Пока виджет на странице, второй не добавляется.
  $('#rpShopPv').addEventListener('click', (e) => {
    if (!e.target.closest('.rp-wz[data-act="tabs"]') || stage.classList.contains('tabs-added')) return;
    closeRp();
    addBlankTab();
  });

  // «Настройки»: переключатель «Информеры» и выпадающие списки «На странице / В окне».
  // Выключенные «Информеры» прячут кнопки телефона и чата в колонке информеров (styles.css, .no-informers).
  const informers = $('#rpInformers');
  informers.addEventListener('click', () => {
    const on = !informers.classList.contains('is-on');
    informers.classList.toggle('is-on', on);
    informers.setAttribute('aria-checked', on);
    state.informers = on;
    stage.classList.toggle('no-informers', !on);
  });

  const rpMenu = $('#rpMenu');
  const rpMenuList = $('#rpMenuList');
  const NOTICE_MODES = ['На странице', 'В окне'];
  let rpMenuLink = null;

  // Как «Состояние панели» в окне «Меню»: выбранный пункт встаёт на место ссылки.
  function openRpMenu(link) {
    rpMenuLink = link;
    rpMenuList.innerHTML = '';
    NOTICE_MODES.forEach((title, i) => {
      const b = el('button', 'mw-menu__item' + (title === link.textContent ? ' is-on' : ''),
        `<span class="mw-menu__dot"></span><span class="mw-menu__text">${title}</span>`);
      b.type = 'button';
      b.addEventListener('click', () => { link.textContent = title; closeRpMenu(); });
      rpMenuList.append(b);
    });
    rpMenu.hidden = false;
    const r = stageRect(link);
    const at = Math.max(0, NOTICE_MODES.indexOf(link.textContent));
    rpMenu.style.left = (r.left - 30) + 'px';
    rpMenu.style.top = (r.top + r.height / 2 - 12 - 16 - at * 38) + 'px';
  }
  function closeRpMenu() { rpMenu.hidden = true; rpMenuLink = null; }

  for (const link of document.querySelectorAll('#rp-settings .rp-link')) {
    link.addEventListener('click', () => (rpMenuLink === link ? closeRpMenu() : openRpMenu(link)));
  }
  $('#rpMenuClose').addEventListener('click', closeRpMenu);

  // «⋮»: меню действий (статика с ховером), крестик меню — ровно поверх «⋮» (крестик: right −14, top 8, 28×28).
  const rpMore = $('#rpMore');
  const rpMoreMenu = $('#rpMoreMenu');
  function openRpMore() {
    rpMoreMenu.hidden = false;
    rpMore.classList.add('is-active');
    const r = stageRect(rpMore);
    rpMoreMenu.style.left = Math.round(r.left + r.width / 2 - rpMoreMenu.offsetWidth) + 'px';
    rpMoreMenu.style.top = Math.round(r.top + r.height / 2 - 8 - 14) + 'px';
  }
  function closeRpMore() { rpMoreMenu.hidden = true; rpMore.classList.remove('is-active'); }
  rpMore.addEventListener('click', () => (rpMoreMenu.hidden ? openRpMore() : closeRpMore()));
  $('#rpMoreClose').addEventListener('click', closeRpMore);
  stage.addEventListener('mousedown', (e) => {
    if (!rpMoreMenu.hidden && !e.target.closest('#rpMoreMenu, #rpMore')) closeRpMore();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !rpMoreMenu.hidden) closeRpMore(); });

  // ---------- Меню «⋮» пункта аккордеона (Figma xMQ3ZEN4AUINgwjVoxR8hS 19401:31603) ----------
  // Во всех сценариях конструктора. Крестик меню — ровно поверх «⋮» (крестик: right −14, top 8, 28×28).
  // «Настроить подменю» — редактор подменю; «Переименовать» — каретка в названии на месте; «Переместить» — только ховер
  // (подменю «Вверх / Вниз / В другой раздел» без действий); «Удалить» — пункт уходит (отмена в шапке возвращает).
  // У второй строки (выбранный пункт подменю) то же меню, действия — с этим пунктом подменю.
  const accMore = $('#accMore');
  let am = null; // { id, sub, li }
  const accMoreOn = () => itemSettingsOn();
  function toggleAccMore(id, cmd, sub) {
    if (am && am.id === id && am.sub === sub) { closeAccMore(); return; }
    closeAccMore();
    if (!accMoreOn()) return;
    closeOtherWindows();
    closeSubmenu();
    const li = cmd.closest('.acc-item');
    am = { id, sub, li };
    li.classList.add('is-menu');
    accMore.hidden = false;
    const r = stageRect(cmd);
    // у левого края сцены меню не помещается целиком — прижимается к краю (крестик тогда правее «⋮»)
    accMore.style.left = Math.max(0, Math.round(r.left + r.width / 2 - accMore.offsetWidth)) + 'px';
    accMore.style.top = Math.round(r.top + r.height / 2 - 8 - 14) + 'px';
  }
  function closeAccMore() {
    if (!am) return;
    const { li } = am;
    am = null;
    accMore.hidden = true;
    li.classList.remove('is-menu');
    if (!li.matches(':hover')) li.dispatchEvent(new Event('mouseleave'));
  }
  $('#accMoreClose').addEventListener('click', closeAccMore);
  stage.addEventListener('mousedown', (e) => {
    if (am && !e.target.closest('#accMore, .acc-cmd--dots')) closeAccMore();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && am) closeAccMore(); });
  accMore.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act || !am) return;
    const { id, sub, li } = am;
    closeAccMore();
    if (act === 'edit') openEditor(id);
    else if (act === 'rename') startAccRename(li, id, sub);
    else if (act === 'delete') deleteAccItem(id, sub);
  });

  // Переименование на месте: поле поверх названия, каретка в конце. Enter или уход фокуса — применить, Esc — отменить.
  // Название раздела не меняет заголовок подменю (как в редакторе); у второй строки меняется название пункта подменю.
  function startAccRename(li, id, sub) {
    const sec = SECTIONS.find((s) => s.id === id);
    const title = $(sub ? '.acc-item__sub-title' : '.acc-item__title', li);
    const row = $(sub ? '.acc-item__sub' : '.acc-item__btn', li);
    const t = stageRect(title), l = stageRect(li), rw = stageRect(row);
    const cs = getComputedStyle(title);
    const input = el('input', 'acc-rename');
    input.value = title.textContent;
    Object.assign(input.style, {
      left: (t.left - l.left) + 'px', top: (t.top - l.top) + 'px', height: t.height + 'px',
      width: (rw.left + rw.width - t.left - 12) + 'px', paddingTop: cs.paddingTop,
      fontSize: cs.fontSize, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing,
    });
    li.classList.add('is-renaming');
    li.append(input);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    let done = false;
    const finish = (apply) => {
      if (done) return;
      done = true;
      const value = input.value.replace(/\s+/g, ' ').trim();
      input.remove();
      li.classList.remove('is-renaming');
      if (!apply || !value || value === title.textContent) return;
      if (sub) {
        const [ci, ii] = state.page.item.split(':').map(Number);
        sec.submenu.cols = sec.submenu.cols.map((c) => c.slice());
        sec.submenu.cols[ci][ii] = { ...sec.submenu.cols[ci][ii], title: value };
      } else {
        if (!sec.submenu.headLabel && sec.submenu.head == null) sec.submenu.head = sec.title;
        sec.title = value;
        sec.short = value === PRISTINE[id].title ? PRISTINE[id].short : value;
      }
      renderAccordion();
      record();
    };
    input.addEventListener('blur', () => finish(true));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
    });
    // клики по полю не доходят до пункта (не открывают подменю)
    for (const type of ['click', 'mousedown']) input.addEventListener(type, (e) => e.stopPropagation());
  }

  // Удаление: раздел уходит из аккордеона (открытая страница раздела — на «Главную»);
  // у второй строки — пункт подменю (страница — раздела по умолчанию), пустая вторая колонка пропадает.
  function deleteAccItem(id, sub) {
    const sec = SECTIONS.find((s) => s.id === id);
    if (sub) {
      const [ci, ii] = state.page.item.split(':').map(Number);
      sec.submenu.cols = sec.submenu.cols.map((c) => c.slice());
      sec.submenu.cols[ci].splice(ii, 1);
      if (ci > 0 && !sec.submenu.cols[ci].length) sec.submenu.cols.splice(ci, 1);
      state.page.item = null;
      updatePage();
    } else {
      SECTIONS.splice(SECTIONS.indexOf(sec), 1);
      if (state.page.section === id) goPage(null, null);
    }
    renderAccordion();
    record();
  }

  // ---------- Редактор подменю ----------
  // ✎ (команда пункта или плавающая кнопка подменю) закрывает подменю и открывает окно редактора:
  // пункты подменю — виджеты, заголовок подменю — первый виджет. Иконка в шапке окна встаёт на иконку пункта.
  // Изменения копятся в черновике (с отменой / повтором) и применяются по ✓; ✕ при изменениях спрашивает.
  const editor = $('#smEditor');
  const shield = $('#smeShield');
  const smeTitle = $('#smeTitle');
  const smeCard = $('#smeCard');
  const smeConfirm = $('#smeConfirm');
  const smeIcon = $('#smeIcon');
  const smeUndo = $('#smeUndo'), smeRedo = $('#smeRedo'), smeReset = $('#smeReset');

  // ed: { sec, draft, hist, at, selected: 'head' | 'ci:ii' | null }
  // draft: { title — название раздела, icon — своя иконка (null — исходная), head — заголовок подменю (отдельная сущность; null у headLabel), showHead, cols }
  let ed = null;
  let iw = null; // окно настроек пункта: { key, title, level, pinned, cmd, show, panel, side, nums, start }

  const cloneDraft = (d) => ({ ...d, cols: d.cols.map((c) => c.slice()) });
  const draftKey = (d) => JSON.stringify([d.title, d.icon, d.head, d.headRight ?? null, d.showHead, d.cols]);

  function editorIconHTML(sec, icon) {
    if (icon) return customGlyph(icon);
    if (sec.photo) return `<img src="${sec.photo}" alt="">`;
    if (sec.calendar) return calendarHTML();
    return `<span class="acc-glyph">${sec.icon}</span>`;
  }

  function openEditor(id) {
    if (stage.dataset.scenario === 'editor-user') return; // пользователь подменю не настраивает
    const sec = SECTIONS.find((s) => s.id === id);
    closeSubmenu();
    closeOtherWindows();
    cancelLeave();
    setPanelOpen(false);
    const draft = {
      title: sec.title, icon: sec.customIcon ?? null, head: sec.submenu.headLabel ? null : sec.submenu.head ?? sec.title,
      headRight: sec.submenu.headRight ?? null, showHead: !sec.submenu.noHead,
      cols: sec.submenu.cols.map((c) => c.slice()),
    };
    ed = { sec, draft, hist: [cloneDraft(draft)], at: 0, selected: null, base: PRISTINE[id] }; // base — к чему возвращает «Вернуть исходное»
    smeConfirm.hidden = true;
    renderEditor();
    shield.hidden = false;
    editor.hidden = false;

    // Иконка шапки окна (центр: 10 + 14 слева, 7 + 16 сверху) — ровно на иконку пункта аккордеона.
    const li = list.querySelector(`[data-id="${id}"]`);
    const r = stageRect($('.acc-item__icon, .acc-cal, .acc-item__photo', li));
    const left = r.left + r.width / 2 - 24;
    const top = r.top + r.height / 2 - 23;
    editor.style.left = Math.round(left) + 'px';
    // Не помещается до низа сцены — поднимаем (иконка сдвигается, как у нижних подменю).
    editor.style.top = Math.round(Math.max(0, Math.min(top, 900 - editor.offsetHeight))) + 'px';
  }

  function closeEditor() {
    closeItemWin();
    stopTitleEdit(false);
    closeIconPick();
    closePlusMenu();
    itemEdit = null;
    smeConfirm.hidden = true;
    editor.hidden = true;
    shield.hidden = true;
    ed = null;
    if (editorOnly()) openEditorOnly();
  }

  // Группа «Редактор подменю»: на сцене только редактор «Документов» по центру; после ✓/✕ он открывается снова.
  // «С нуля» — тот же редактор, где есть только заголовок «Документы» (подменю из одного пункта в рантайме не показывается);
  // удалить и его — на белой карточке заглушка «+» (открывает меню «+»). Его ✓ не трогает «Документы» в аккордеоне. «Готовое подменю» — подменю как есть.
  const editorOnly = () => stage.dataset.scenario === 'submenu-editor';
  const editorFromScratch = () => editorOnly() && stage.dataset.variant === 'scratch';
  const runtimePreview = $('#runtimePreview');
  function openEditorOnly() {
    openEditor('docs');
    if (editorFromScratch()) {
      Object.assign(ed.draft, { showHead: true, cols: [[]] });
      ed.hist = [cloneDraft(ed.draft)];
      ed.base = cloneDraft(ed.draft);
      renderEditor();
    }
    // редактор — в правой половине, под подписью «Дизайнтайм»
    const design = $('.editor-only__design');
    editor.style.left = $('.kind__label', design).offsetLeft + 'px'; // левый край окна — по подписи «Дизайнтайм»
    editor.style.top = design.offsetTop + 32 + 'px';
  }
  function setEditorOnly() {
    if (editorOnly()) openEditorOnly();
    else if (ed) closeEditor();
  }

  // Плавающий тулбар выделенного виджета (Figma rHabzni5OI5D4fxBLQdj2m 131:17364, состав 854:7145): ⚙, удалить, ⋯ (без ‹).
  // Удаление работает, ⚙ и ⋯ — пока только наведение.
  function toolbar() {
    const tb = el('div', 'sme-tb');
    const btn = (cls, ch, label) => {
      const b = el('button', 'sme-tb__btn' + (cls ? ' ' + cls : ''), `<span class="ico24">${ch}</span>`);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      tb.append(b);
      return b;
    };
    // ⚙ — окно настроек пункта (в «Настройке аккордеона» и «Подменю → Редактор»; в остальных сценариях — наведение)
    const gear = btn('sme-tb__btn--gear' + (iw && iw.key === ed.selected ? ' is-active' : ''), '', 'Настройки');
    // у выделенной пустой колонки («col:N») ⚙ — пока только наведение
    if (itemSettingsOn() && !ed.selected.startsWith('col:')) gear.addEventListener('click', () => (iw && iw.key === ed.selected ? closeItemWin() : openItemWin(ed.selected)));
    btn('sme-tb__btn--del', '', 'Удалить').addEventListener('click', deleteSelected);
    btn('', '', 'Ещё');
    return tb;
  }

  // Тулбар текста на время переименования виджета (Figma 44fX18O5Huk4hmoaANMNIC 10467:56588, без удаления):
  // Стиль, «Т» и цвет — пока только наведение (без ‹). Нажатие в тулбаре не уводит фокус из текста.
  function textToolbar() {
    const tb = el('div', 'sme-tb sme-tb--text');
    tb.addEventListener('mousedown', (e) => e.preventDefault());
    const btn = (cls, html, label) => {
      const b = el('button', 'sme-tb__btn' + (cls ? ' ' + cls : ''), html);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      tb.append(b);
      return b;
    };
    btn('sme-tb__style', 'Заголовок 4<span class="ico">&#xE9AA;</span>', 'Стиль текста');
    btn('', '<span class="ico24">&#xEAC9;</span>', 'Начертание');
    btn('sme-tb__color', '<span class="sme-tb__swatch"></span>', 'Цвет текста');
    return tb;
  }

  // Двойной клик по тексту виджета — переименование на месте: каретка там, куда кликнули (мимо текста — в конец),
  // текст не выделяется. Enter или клик мимо — применить, Esc — отменить.
  let itemEdit = null; // { w, text, key }
  function startItemEdit(w, x, y) {
    const text = $('.sme-w__text', w);
    itemEdit = { w, text, key: w.dataset.key };
    $('.sme-tb', w)?.replaceWith(textToolbar());
    text.contentEditable = 'plaintext-only';
    text.focus();
    let range = document.caretRangeFromPoint?.(x, y);
    if (!range || !text.contains(range.startContainer)) {
      range = document.createRange();
      range.selectNodeContents(text);
    }
    range.collapse(false);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(range);
  }
  function stopItemEdit(apply) {
    if (!itemEdit) return;
    const { text, key } = itemEdit;
    itemEdit = null;
    const value = text.textContent.replace(/s+/g, ' ').trim();
    const draft = cloneDraft(ed.draft);
    if (key === 'head') draft.head = value;
    else {
      const [ci, ii] = key.split(':').map(Number);
      draft.cols[ci][ii] = { ...draft.cols[ci][ii], title: value };
    }
    if (apply && value && draftKey(draft) !== draftKey(ed.draft)) {
      commit(draft);
      select(key); // после правки виджет остаётся выделенным
    } else renderEditor();
  }

  function renderEditor() {
    const { draft, selected } = ed;
    if (iw && iw.key !== selected) closeItemWin(); // окно настроек — только у выделенного виджета
    if (!smeTitle.classList.contains('is-editing')) smeTitle.textContent = draft.title;
    smeIcon.innerHTML = editorIconHTML(ed.sec, draft.icon);
    smeCard.innerHTML = '';
    smeCard.classList.toggle('is-multi', draft.cols.length > 1);
    // правки реестра (двухколоночный, плюсы с меню «+», ховер только у виджета)
    const registry = itemSettingsOn();
    smeCard.classList.toggle('is-registry', registry);
    // в реестре плюсы сверху и снизу выделенного виджета открывают меню «+», выбранная страница встаёт на место плюса
    const mk = (side, ci, at) => {
      const m = el('span', `sme-mk sme-mk--${side}`);
      if (registry) Object.assign(m.dataset, { col: ci, at });
      return m;
    };
    const widget = (key, title, sub, right, ci, ii) => {
      const w = el('div', 'sme-w' + (sub ? ' sme-w--sub' : '') + (key === selected ? ' is-selected' : ''));
      w.dataset.key = key;
      w.append(el('span', 'sme-w__text', title), mk('top', ci, ii), mk('bottom', ci, key === 'head' ? 0 : ii + 1));
      // в «Настройке аккордеона» у виджета виден элемент справа из окна настроек
      if (itemSettingsOn() && right) $('.sme-w__text', w).insertAdjacentHTML('afterend', rightHTML(right));
      if (key === selected) w.append(toolbar());
      return w;
    };
    draft.cols.forEach((col, ci) => {
      const l = el('div', 'sme-list');
      if (ci === 0 && draft.head != null && draft.showHead) l.append(widget('head', draft.head, false, draft.headRight, ci, 0));
      col.forEach((it, ii) => l.append(widget(`${ci}:${ii}`, it.title, it.level === 2, it.right, ci, ii)));
      l.classList.toggle('has-selected', !!l.querySelector('.sme-w.is-selected'));
      // в реестре пустая колонка («Добавить колонку») — по клику меню «+», страница встаёт в неё; в остальных — плюсы по сторонам списка
      const empty = registry && !l.querySelector('.sme-w');
      if (empty) Object.assign(l.dataset, { col: ci, at: 0 });
      l.classList.toggle('is-empty', empty);
      if (empty) l.append(el('div', 'sme-empty', '<span class="sme-empty__btn"><span class="ico24">&#xE6D3;</span></span>'));
      // пустую колонку можно выделить, как виджет (ключ «col:N»): рамка и тулбар виджета
      if (empty && selected === `col:${ci}`) { l.classList.add('is-selected'); l.append(toolbar()); }
      if (!registry) l.append(mk('top'), mk('bottom'), mk('left'), mk('right'));
      smeCard.append(l);
    });
    // пустое подменю — заглушка «+» на всю карточку
    if (!smeCard.querySelector('.sme-w')) {
      smeCard.innerHTML = '';
      const stub = el('button', 'sme-stub sme-empty', '<span class="sme-empty__btn"><span class="ico24">&#xE6D3;</span></span>');
      stub.type = 'button';
      stub.setAttribute('aria-label', 'Добавить');
      stub.addEventListener('click', () => smePlus.click());
      smeCard.append(stub);
    }
    smeUndo.disabled = ed.at === 0;
    smeRedo.disabled = ed.at === ed.hist.length - 1;
    smeReset.disabled = draftKey(draft) === draftKey(ed.base);
    if (stage.dataset.scenario === 'submenu-editor') renderRuntime();
  }

  // Слева от редактора в группе «Редактор подменю» — рантайм из черновика, обновляется с каждой правкой:
  // пункт аккордеона (иконка, название, счётчик) и подменю (широкое, как по клику в аккордеоне). Ховеры работают, кликов нет.
  // Пока открыто окно настроек пункта — из черновика с его правками.
  const runtimeAcc = $('#runtimeAcc');
  function renderRuntime(draft = ed.draft) {
    const { sec } = ed;
    const view = { ...sec, title: draft.title, customIcon: draft.icon,
      submenu: { ...sec.submenu, head: draft.head ?? sec.submenu.head, headRight: draft.headRight ?? undefined, cols: draft.cols } };
    const li = el('li', 'acc-item');
    li.append(el('button', 'acc-item__btn' + (view.photo ? ' acc-item__btn--photo' : '') + (view.submenu.headRight === 'plus-left' ? ' has-plus-left' : ''),
      `${iconHTML(view)}<span class="acc-item__title">${view.title}</span>${accCountHTML(view)}`));
    li.addEventListener('mouseenter', () => li.classList.add('is-hover'));
    li.addEventListener('mouseleave', () => li.classList.remove('is-hover'));
    runtimeAcc.replaceChildren(el('ul', 'acc-list', ''));
    runtimeAcc.firstChild.append(li);

    const box = el('div', 'submenu submenu--wide' + (draft.cols.length > 1 ? ' submenu--multi' : ''));
    const panel = el('div', 'submenu__panel');
    if (draft.head == null) panel.append(el('div', 'submenu__head', `<div class="sm-head">${headIconHTML(sec)}${headTitleHTML(sec, sec.submenu.head || draft.title)}</div>`));
    else if (draft.showHead) panel.append(el('div', 'submenu__head', `<button class="sm-head${view.submenu.headRight === 'plus-left' ? ' has-plus-left' : ''}" type="button">${headIconHTML(view)}${headTitleHTML(view, draft.head)}</button>`));
    const cols = el('div', 'submenu__cols');
    for (const col of draft.cols) {
      const c = el('div', 'submenu__col');
      for (const it of col) c.append(el('button', 'sm-item' + (it.level === 2 ? ' sm-item--sub' : ''), itemHTML(it)));
      cols.append(c);
    }
    panel.append(cols);
    box.append(panel);
    // подменю из одного пункта (или пустого) нет — блок «Рантайм — подменю» пропадает
    const kind = runtimePreview.closest('.kind');
    const count = panel.querySelectorAll('button.sm-head, .sm-item').length;
    kind.hidden = count < 2;
    $('#runtimeNote').hidden = count !== 1; // один пункт — бледная подсказка под пунктом аккордеона
    if (kind.hidden) { runtimePreview.replaceChildren(); return; }
    runtimePreview.replaceChildren(box);
    if (draft.cols.length > 1) fitMultiHead(box); // заголовок многоколоночного — по ширине первой колонки, как в аккордеоне
  }

  // Изменение черновика — новый шаг истории (шаги «вперёд» отбрасываются).
  function commit(draft) {
    if (draftKey(draft) === draftKey(ed.draft)) return;
    ed.hist = ed.hist.slice(0, ed.at + 1);
    ed.hist.push(cloneDraft(draft));
    ed.at = ed.hist.length - 1;
    ed.draft = draft;
    ed.selected = null;
    renderEditor();
  }

  function goHistory(step) {
    const at = ed.at + step;
    if (at < 0 || at >= ed.hist.length) return;
    ed.at = at;
    ed.draft = cloneDraft(ed.hist[at]);
    ed.selected = null;
    renderEditor();
  }

  function select(key) {
    if (!ed || ed.selected === key) return;
    ed.selected = key;
    renderEditor();
  }

  function deleteSelected() {
    const key = ed.selected;
    if (!key) return;
    const draft = cloneDraft(ed.draft);
    if (key === 'head') draft.showHead = false;
    else if (key.startsWith('col:')) draft.cols.splice(+key.slice(4), 1); // пустая колонка
    else {
      const [ci, ii] = key.split(':').map(Number);
      draft.cols[ci].splice(ii, 1);
      if (ci > 0 && !draft.cols[ci].length) draft.cols.splice(ci, 1); // вторая колонка без виджетов пропадает
    }
    commit(draft);
  }

  // Применение черновика: аккордеон и подменю раздела перерисовываются с новым названием и списком.
  function saveEditor() {
    if (editorFromScratch()) { closeEditor(); return; }
    const { sec, draft } = ed;
    const pristine = PRISTINE[sec.id];
    // Открытый пункт подменю ищем по самому пункту — после удалений ключ «колонка:строка» мог сдвинуться.
    const current = state.page.section === sec.id && state.page.item != null ? subItem(sec, state.page.item) : null;
    sec.title = draft.title;
    sec.customIcon = draft.icon;
    sec.short = draft.title === pristine.title ? pristine.short : draft.title;
    if (draft.head != null) { sec.submenu.head = draft.head; sec.submenu.noHead = !draft.showHead; sec.submenu.headRight = draft.headRight ?? undefined; }
    sec.submenu.cols = draft.cols.map((c) => c.slice());
    if (current) {
      let key = null;
      sec.submenu.cols.forEach((c, ci) => { const ii = c.indexOf(current); if (ii >= 0 && key == null) key = `${ci}:${ii}`; });
      state.page.item = key;
    }
    closeEditor();
    renderAccordion();
  }

  // Название раздела: клик — правка на месте; Enter или уход фокуса — применить, Esc — отменить.
  // Каретка встаёт туда, куда кликнули (мимо текста — в конец), текст не выделяется.
  function startTitleEdit(e) {
    if (smeTitle.classList.contains('is-editing')) return;
    ed.selected = null;
    renderEditor();
    smeTitle.classList.add('is-editing');
    smeTitle.contentEditable = 'plaintext-only';
    smeTitle.focus();
    let range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (!range || !smeTitle.contains(range.startContainer)) {
      range = document.createRange();
      range.selectNodeContents(smeTitle);
      range.collapse(false);
    }
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(range);
  }

  function stopTitleEdit(apply) {
    if (!smeTitle.classList.contains('is-editing')) return;
    smeTitle.classList.remove('is-editing');
    smeTitle.contentEditable = 'false';
    smeTitle.scrollLeft = 0;
    const value = smeTitle.textContent.replace(/\s+/g, ' ').trim();
    if (ed && apply && value) commit({ ...cloneDraft(ed.draft), title: value });
    if (ed) smeTitle.textContent = ed.draft.title;
  }

  smeTitle.addEventListener('click', startTitleEdit);
  smeTitle.addEventListener('blur', () => stopTitleEdit(true));
  smeTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); smeTitle.blur(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); stopTitleEdit(false); }
  });

  // Клик по виджету выделяет его, клик мимо (в окне или за ним) — снимает выделение.
  editor.addEventListener('mousedown', (e) => {
    if (!ed || e.target.closest('.sme-mk')) return;
    if (itemEdit) {
      if (itemEdit.text.contains(e.target) || e.target.closest('.sme-tb--text')) return;
      // клик по рамке виджета мимо текста правку не заканчивает: каретка — к ближайшему месту в тексте (мимо — в конец)
      if (itemEdit.w.contains(e.target)) {
        e.preventDefault();
        const { text } = itemEdit;
        let range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
        if (!range || !text.contains(range.startContainer)) {
          range = document.createRange();
          range.selectNodeContents(text);
          range.collapse(e.clientX < text.getBoundingClientRect().left);
        }
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(range);
        return;
      }
      stopItemEdit(true);
    }
    // пустая колонка реестра: клик мимо «+» выделяет её (как виджет), «+» — меню «+» без смены выделения
    const cell = e.target.closest('.sme-list.is-empty');
    if (cell) {
      if (!e.target.closest('.sme-empty__btn')) select(`col:${cell.dataset.col}`);
      return;
    }
    const w = e.target.closest('.sme-w');
    // второе нажатие двойного клика по тексту — переименование (без выделения слова)
    if (w && e.detail === 2 && e.target.closest('.sme-w__text') && !e.target.closest('.sme-tb')) {
      e.preventDefault();
      select(w.dataset.key);
      closeItemWin();
      startItemEdit($(`.sme-w[data-key="${w.dataset.key}"]`, smeCard), e.clientX, e.clientY);
      return;
    }
    // повторный клик по выделенному виджету — окно настроек пункта (там, где оно есть)
    if (w && e.detail === 1 && ed.selected === w.dataset.key && !e.target.closest('.sme-tb') && itemSettingsOn() && iw?.key !== w.dataset.key) {
      openItemWin(w.dataset.key);
      return;
    }
    if (w) select(w.dataset.key);
    else select(null);
  });
  shield.addEventListener('mousedown', () => { if (!ed) return; stopItemEdit(true); select(null); });
  smeCard.addEventListener('keydown', (e) => {
    if (!itemEdit) return;
    if (e.key === 'Enter') { e.preventDefault(); stopItemEdit(true); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); stopItemEdit(false); }
  });
  $('.sme-head', editor).addEventListener('mousedown', (e) => startDrag(e, editor));

  smeUndo.addEventListener('click', () => goHistory(-1));
  smeRedo.addEventListener('click', () => goHistory(1));
  smeReset.addEventListener('click', () => commit(cloneDraft(ed.base)));
  $('#smeDone').addEventListener('click', saveEditor);
  $('#smeClose').addEventListener('click', () => {
    if (draftKey(ed.draft) === draftKey(ed.hist[0])) closeEditor();
    else smeConfirm.hidden = false;
  });
  smeConfirm.addEventListener('click', (e) => {
    const answer = e.target.closest('[data-answer]')?.dataset.answer;
    // Это же подтверждение спрашивает и окно «Вкладки», и ✕ шапки конструктора в сценарии «Админка».
    if (tw) { answerTabsConfirm(answer); return; }
    if (insideAsk) { answerInsideConfirm(answer); return; }
    if (ae) { answerAeConfirm(answer); return; }
    if (answer === 'yes') saveEditor();
    else if (answer === 'no') closeEditor();
    else if (answer === 'cancel') smeConfirm.hidden = true;
  });

  // ---------- Виджет «Вкладки» на Главной (Figma xMQ3ZEN4AUINgwjVoxR8hS 18731:100134) ----------
  // Клик по вкладке переключает содержимое дашборда и выделяет виджет (рамка + тулбар «+ ⚙ ⋯»), клик мимо снимает
  // выделение. Второй клик по активной вкладке — переименование на месте; вкладки перетаскиваются мышью. pane — что показывает вкладка:
  // 'main' — дашборд Главной, 'managers' — «Для менеджеров», 'empty' — пустая ячейка (новые и дублированные вкладки).
  // После перезагрузки страницы всё возвращается к исходному.
  let tabs = [{ id: 1, title: 'Главный', pane: 'main' }, { id: 2, title: 'Для менеджеров', pane: 'managers' }];
  let activeTab = 1;
  let nextTabId = 3;

  const tabsW = $('#tabsWidget');
  const tabsList = $('#tabsList');
  const tabAddMenu = $('#tabAddMenu');
  const tabDotsMenu = $('#tabDotsMenu');
  const findTab = (id) => tabs.find((t) => t.id === id);

  function renderTabs() {
    tabsList.innerHTML = '';
    for (const t of tabs) {
      const tab = el('span', 'pg-tab' + (t.id === activeTab ? ' is-active' : ''));
      tab.dataset.id = t.id;
      const text = el('span', 'pg-tab__text');
      text.textContent = t.title;
      text.dataset.text = t.title;
      tab.append(text);
      tabsList.append(tab);
    }
    const pane = findTab(activeTab).pane;
    for (const p of pageMain.querySelectorAll('.dash')) p.hidden = p.dataset.pane !== pane;
  }

  // single — сценарии «Добавление вкладки»: только «Главный», виджет вкладок скрыт до добавления вкладки (.tabs-added).
  function resetTabs(single) {
    tabs = [{ id: 1, title: 'Главный', pane: 'main' }];
    if (!single) tabs.push({ id: 2, title: 'Для менеджеров', pane: 'managers' });
    activeTab = 1;
    nextTabId = 3;
    stage.classList.toggle('tabs-added', !single);
    renderTabs();
  }

  // «С чистого листа» в сценариях «Добавление вкладки» (Figma 18797:65818): появляется виджет вкладок с новой
  // пустой вкладкой «Страница N», она активна, виджет выделен.
  function addBlankTab() {
    const id = nextTabId++;
    const title = `Страница ${tabs.length + 1}`;
    tabs.push({ id, title, pane: 'empty', def: title }); // def — исходное название: пока совпадает, вкладка «не тронута»
    activeTab = id;
    stage.classList.add('tabs-added');
    renderTabs();
    selectTabs(true);
  }

  function setActiveTab(id) {
    if (activeTab === id) return;
    activeTab = id;
    renderTabs();
  }

  // Перестановка мышью (вкладки в виджете — по X, строки в окне — по Y): элемент едет за курсором через соседей,
  // порядок применяется по отпусканию. Без сдвига (меньше 4px) это просто клик — onEnd(false).
  function startReorder(e, item, axis, onEnd) {
    if (e.button !== 0) return;
    e.preventDefault();
    const box = item.parentElement;
    const pos = (ev) => (axis === 'x' ? ev.clientX : ev.clientY);
    const start = pos(e);
    let moved = false;
    const move = (ev) => {
      const p = pos(ev);
      if (!moved) {
        if (Math.abs(p - start) < 4) return;
        moved = true;
        item.classList.add('is-dragging');
      }
      const before = [...box.children].find((n) => {
        if (n === item) return false;
        const r = n.getBoundingClientRect();
        return p < (axis === 'x' ? r.left + r.width / 2 : r.top + r.height / 2);
      });
      if (item.nextElementSibling !== (before || null)) box.insertBefore(item, before || null);
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      item.classList.remove('is-dragging');
      if (moved) {
        const order = [...box.children].map((n) => +n.dataset.id);
        tabs = order.map(findTab);
      }
      onEnd(moved);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  // ----- выделение виджета -----
  function selectTabs(on) {
    tabsW.classList.toggle('is-selected', on);
    if (!on) closeTabMenus();
  }

  tabsW.addEventListener('mousedown', (e) => {
    if (e.target.closest('.is-editing, .tabs-w__bar')) return;
    // «Пользователь» (и в приложении, и в конструкторе): вкладки только переключаются
    if (stage.dataset.scenario === 'editor-user') {
      const tab = e.target.closest('.pg-tab');
      if (tab && e.button === 0) setActiveTab(+tab.dataset.id);
      return;
    }
    // второй клик по активной вкладке (виджет уже выделен) — переименование на месте
    const wasSelected = tabsW.classList.contains('is-selected');
    selectTabs(true);
    const tab = e.target.closest('.pg-tab');
    if (!tab) return;
    const id = +tab.dataset.id;
    const rename = wasSelected && id === activeTab;
    startReorder(e, tab, 'x', (moved) => {
      if (moved) { renderTabs(); renderTabsWin(); } else if (rename) startTabRename(tab, e.clientX, e.clientY); else setActiveTab(id);
    });
  });

  // Клик мимо виджета, его меню и окна снимает выделение; пока открыто окно «Вкладки», виджет остаётся выделенным.
  stage.addEventListener('mousedown', (e) => {
    if (tw || e.target.closest('#tabsWidget, #tabAddMenu, #tabDotsMenu, #tabsWin, #smeConfirm, #tabsDelConfirm')) return;
    selectTabs(false);
  });

  // Уход с Главной: меню и окно закрываются (изменения остаются), выделение снимается.
  function leaveTabs() {
    if (tw) closeTabsWin();
    selectTabs(false);
  }

  // ----- переименование на месте (двойной клик): Enter или уход фокуса — применить, Esc — отменить -----
  // Без выделения текста: каретка встаёт в точку клика (x, y), а если клик мимо текста — в конец названия.
  function startTabRename(tabEl, x, y) {
    const t = findTab(+tabEl.dataset.id);
    const text = $('.pg-tab__text', tabEl);
    closeTabMenus();
    text.classList.add('is-editing');
    text.contentEditable = 'plaintext-only';
    text.focus();
    let range = null;
    if (document.caretPositionFromPoint) {
      const p = document.caretPositionFromPoint(x, y);
      if (p && text.contains(p.offsetNode)) {
        range = document.createRange();
        range.setStart(p.offsetNode, p.offset);
      }
    } else if (document.caretRangeFromPoint) {
      const r = document.caretRangeFromPoint(x, y);
      if (r && text.contains(r.startContainer)) range = r;
    }
    if (!range) {
      range = document.createRange();
      range.selectNodeContents(text);
    }
    range.collapse(false);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(range);
    let done = false;
    const finish = (apply) => {
      if (done) return;
      done = true;
      const value = text.textContent.replace(/\s+/g, ' ').trim();
      if (apply && value) t.title = value;
      renderTabs();
      renderTabsWin();
    };
    text.addEventListener('input', () => { text.dataset.text = text.textContent; });
    text.addEventListener('blur', () => finish(true));
    text.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); text.blur(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); finish(false); }
    });
  }

  // ----- меню «+» и «⋯» -----
  // «+»: заголовок меню («+ ВКЛАДКА») встаёт под кнопкой — его «+» по центру кнопки, на 4px ниже неё.
  // Из окна «Вкладки» — «+» меню ровно поверх «+» окна (как меню «Иконка» в окне «Логотип»).
  // 20 — отступ заголовка слева, 12 — половина иконки; 8 — верхний отступ меню, 14 — половина строки заголовка.
  function openAddMenu(trigger, over = false) {
    if (tw && !tabsWin.contains(trigger)) closeTabsWin(); // меню виджета и окно «Вкладки» вместе не открыты
    closeTabMenus();
    tabAddMenu.hidden = false;
    trigger.classList.add('is-active');
    // у ссылки «+вкладка» меню встаёт по её иконке, а не по центру всей ссылки
    const r = stageRect(trigger.querySelector(':scope > .ico') || trigger);
    tabAddMenu.style.left = Math.round(r.left + r.width / 2 - 20 - 12) + 'px';
    tabAddMenu.style.top = Math.round(over ? r.top + r.height / 2 - 8 - 14 : r.top + r.height + 4) + 'px';
    // вертикальная «+вкладка» в колонке информеров: меню закрывает ссылку целиком — «+» заголовка у её верхнего края
    if (trigger.id === 'infAddTab') tabAddMenu.style.top = Math.round(stageRect(trigger).top + 6 - 8 - 14) + 'px';
    tabAddMenu.trigger = trigger;
  }
  // «⋯»: под кнопкой на 4px, иконка первого пункта — под кнопкой (8 — отступ списка, 12 — отступ пункта).
  function openDotsMenu(trigger) {
    if (tw && !tabsWin.contains(trigger)) closeTabsWin(); // меню виджета и окно «Вкладки» вместе не открыты
    closeTabMenus();
    tabDotsMenu.hidden = false;
    trigger.classList.add('is-active');
    const r = stageRect(trigger);
    tabDotsMenu.style.left = Math.round(r.left + r.width / 2 - 8 - 12 - 12) + 'px';
    tabDotsMenu.style.top = Math.round(r.top + r.height + 4) + 'px';
  }
  function closeTabMenus() {
    tabAddMenu.hidden = true;
    tabDotsMenu.hidden = true;
    for (const b of document.querySelectorAll('.tabs-w__btn.is-active:not(#tabsGear), .tw-plus.is-active, .inf-plus.is-active, .pg-link.is-active, .pg-chip.is-active')) b.classList.remove('is-active');
  }
  const tabMenuOpen = () => !tabAddMenu.hidden || !tabDotsMenu.hidden;

  $('#tabsPlus').addEventListener('click', (e) => (tabAddMenu.hidden ? openAddMenu(e.currentTarget) : closeTabMenus()));
  $('#tabsDots').addEventListener('click', (e) => (tabDotsMenu.hidden ? openDotsMenu(e.currentTarget) : closeTabMenus()));
  $('#tabsGear').addEventListener('click', () => { closeTabMenus(); openTabsWin('list'); });
  // 🗑 в тулбаре: удаляет все пользовательские вкладки (кроме «Главного») — и виджет пропадает.
  // Одна нетронутая новая вкладка («Страница N» без переименования) — сразу; иначе — подтверждение «Да / Отмена».
  const tabsDelConfirm = $('#tabsDelConfirm');
  function deleteUserTabs() {
    if (tw) closeTabsWin();
    tabs = tabs.filter((t) => t.id === 1);
    activeTab = 1;
    selectTabs(false);
    stage.classList.remove('tabs-added');
    renderTabs();
  }
  $('#tabsDel').addEventListener('click', () => {
    closeTabMenus();
    const user = tabs.filter((t) => t.id !== 1);
    if (user.length === 1 && user[0].def && user[0].title === user[0].def) deleteUserTabs();
    else tabsDelConfirm.hidden = false;
  });
  tabsDelConfirm.addEventListener('click', (e) => {
    const answer = e.target.closest('[data-answer]')?.dataset.answer;
    if (!answer) return;
    tabsDelConfirm.hidden = true;
    if (answer === 'yes') deleteUserTabs();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || tabsDelConfirm.hidden) return;
    e.stopImmediatePropagation(); // Esc — как «Отмена»
    tabsDelConfirm.hidden = true;
  }, true);
  $('#tabAddClose').addEventListener('click', closeTabMenus);
  $('#tabDotsClose').addEventListener('click', closeTabMenus);
  // Сценарий «Плюс в тулбаре»: плюс в колонке информеров, «+» меню ровно поверх него.
  $('#infPlus').addEventListener('click', (e) => (tabAddMenu.hidden ? openAddMenu(e.currentTarget, true) : closeTabMenus()));
  // Сценарий «+вкладка в тулбаре»: вертикальная ссылка в колонке информеров, «+» меню ровно поверх её «+».
  $('#infAddTab').addEventListener('click', (e) => (tabAddMenu.hidden ? openAddMenu(e.currentTarget, true) : closeTabMenus()));
  // Сценарий «Из шапки дашборда»: ссылка «+вкладка» справа в шапке, «+» меню ровно поверх её «+».
  $('#dashAddTab').addEventListener('click', (e) => (tabAddMenu.hidden ? openAddMenu(e.currentTarget, true) : closeTabMenus()));
  // Сценарий «Чипса в тулбаре»: вертикальная чипса в колонке информеров, «+» меню — по её центру.
  $('#infChipTab').addEventListener('click', (e) => (tabAddMenu.hidden ? openAddMenu(e.currentTarget, true) : closeTabMenus()));
  // Подсценарий «По чипсе»: чипса «вкладки» открывает то же меню «+» поверх себя — «+» заголовка меню (иконка 24 в точке 20,10;
  // сам знак — с отступом 5 внутри) по середине чипсы, над началом слова. «С чистого листа» добавляет виджет вкладок, чипса пропадает.
  $('#dashChipTab').addEventListener('click', (e) => {
    if (!tabAddMenu.hidden) return closeTabMenus();
    const chip = e.currentTarget;
    openAddMenu(chip);
    const range = document.createRange();
    range.selectNodeContents(chip);
    const text = stageRect(range);
    const r = stageRect(chip);
    tabAddMenu.style.left = Math.round(text.left - 5 - 20) + 'px';
    tabAddMenu.style.top = Math.round(r.top + r.height / 2 - 12 - 10) + 'px';
  });
  // «С чистого листа» сразу добавляет вкладку «Страница N» (addBlankTab); из окна «Вкладки» — открывает экран новой вкладки
  $('#tabAddBlank').addEventListener('click', () => {
    closeTabMenus();
    if (tw) openTabsWin('new'); // из окна «Вкладки» — экран новой вкладки
    else addBlankTab(); // иначе сразу «Страница N»
  });
  tabDotsMenu.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'add') openAddMenu($('#tabsPlus'));
    else if (act === 'settings') { closeTabMenus(); openTabsWin('list'); }
  });
  stage.addEventListener('mousedown', (e) => {
    if (!tabMenuOpen() || e.target.closest('#tabAddMenu, #tabDotsMenu, #tabsPlus, #tabsDots, #twPlus, #infPlus, #infChipTab, #dashAddTab, #dashChipTab')) return;
    closeTabMenus();
  });

  // ---------- Окно «Вкладки» (Figma 18772:35266) ----------
  // Встаёт справа от виджета (8px). Экраны: список вкладок и одна вкладка (название, доступ).
  // Изменения сразу видны на дашборде; ↺ возвращает всё как было при открытии окна, ✓ закрывает,
  // ✕ при изменениях спрашивает «Сохранить изменения?» («Нет» — вернуть как было).
  // Новая вкладка («С чистого листа») появляется, как только у неё есть название.
  const tabsWin = $('#tabsWin');
  const twList = $('#twList');
  const twInput = $('#twInput');
  const twReset = $('#twReset');
  // tw: { start — снимок при открытии, screen: 'list' | 'edit', editId — открытая вкладка, isNew — экран новой вкладки, prevActive }
  let tw = null;

  const tabsSnapshot = () => JSON.stringify({ tabs, activeTab });
  function restoreTabs(snap) {
    const s = JSON.parse(snap);
    tabs = s.tabs;
    activeTab = s.activeTab;
  }

  function openTabsWin(screen) {
    if (!tw) {
      closeOtherWindows();
      tw = { start: tabsSnapshot() };
      tabsWin.hidden = false;
      const r = stageRect(tabsW);
      tabsWin.style.left = Math.round(Math.min(r.left + r.width + 8, 1600 - tabsWin.offsetWidth)) + 'px';
      tabsWin.style.top = Math.round(Math.max(0, r.top)) + 'px';
    }
    selectTabs(true);
    $('#tabsGear').classList.add('is-active'); // пока окно открыто, ⚙ подсвечена
    if (screen === 'new') showTabEdit(null);
    else showTabList();
  }

  function closeTabsWin() {
    closeTabMenus();
    smeConfirm.hidden = true;
    tabsWin.hidden = true;
    $('#tabsGear').classList.remove('is-active');
    tw = null;
    // виджет не может состоять из одной вкладки: если осталась одна, после закрытия окна (✓ или ✕) он исчезает
    if (tabs.length < 2 && stage.classList.contains('tabs-added')) {
      selectTabs(false);
      stage.classList.remove('tabs-added');
    }
  }

  function showTabList() {
    tw.screen = 'list';
    tw.editId = null;
    tw.isNew = false;
    renderTabsWin();
  }

  // id = null — новая вкладка: пустое поле, вкладка создаётся с первым символом названия.
  function showTabEdit(id) {
    tw.screen = 'edit';
    tw.editId = id;
    tw.isNew = id == null;
    tw.prevActive = activeTab;
    twInput.value = id == null ? '' : findTab(id).title;
    renderTabsWin();
    twInput.focus();
    twInput.setSelectionRange(twInput.value.length, twInput.value.length);
  }

  function renderTabsWin() {
    if (!tw) return;
    const edit = tw.screen === 'edit';
    tabsWin.classList.toggle('is-edit', edit);
    $('#twTitle').textContent = edit ? 'Вкладка' : 'Вкладки';
    twReset.disabled = tabsSnapshot() === tw.start;
    if (edit) return;
    twList.innerHTML = '';
    tabs.forEach((t, i) => {
      const row = el('div', 'tw-row');
      row.dataset.id = t.id;
      const text = el('span', 'tw-row__text');
      text.textContent = t.title;
      const cmds = el('span', 'tw-row__cmds',
        `<button class="tw-row__cmd" type="button" data-cmd="edit" aria-label="Настроить"><span class="ico24">&#xEAA9;</span></button>
         <button class="tw-row__cmd" type="button" data-cmd="copy" aria-label="Дублировать"><span class="ico24">&#xE669;</span></button>` +
        (i > 0 ? '<button class="tw-row__cmd tw-row__cmd--del" type="button" data-cmd="delete" aria-label="Удалить"><span class="ico24">&#xEB72;</span></button>' : ''));
      row.append(text, cmds);
      twList.append(row);
    });
  }

  // После любой правки — дашборд и окно перерисовываются.
  function tabsChanged() {
    if (!findTab(activeTab)) activeTab = tabs[0].id;
    renderTabs();
    renderTabsWin();
  }

  twList.addEventListener('mousedown', (e) => {
    const row = e.target.closest('.tw-row');
    if (!row) return;
    const id = +row.dataset.id;
    const cmd = e.target.closest('[data-cmd]')?.dataset.cmd;
    if (cmd) {
      e.preventDefault();
      if (cmd === 'edit') showTabEdit(id);
      else if (cmd === 'copy') {
        const i = tabs.findIndex((t) => t.id === id);
        tabs.splice(i + 1, 0, { id: nextTabId++, title: tabs[i].title, pane: 'empty' });
        tabsChanged();
      } else if (cmd === 'delete') {
        tabs = tabs.filter((t) => t.id !== id);
        tabsChanged();
      }
      return;
    }
    startReorder(e, row, 'y', (moved) => (moved ? tabsChanged() : showTabEdit(id)));
  });

  // Название применяется на лету; пустое поле у существующей вкладки не стирает её название.
  twInput.addEventListener('input', () => {
    const value = twInput.value.replace(/\s+/g, ' ').trim();
    if (tw.isNew) {
      if (value && tw.editId == null) {
        tw.editId = nextTabId++;
        tabs.push({ id: tw.editId, title: value, pane: 'empty' });
        activeTab = tw.editId;
      } else if (value) findTab(tw.editId).title = value;
      else if (tw.editId != null) {
        tabs = tabs.filter((t) => t.id !== tw.editId);
        tw.editId = null;
        activeTab = tw.prevActive;
      }
    } else if (value) findTab(tw.editId).title = value;
    tabsChanged();
  });
  twInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); showTabList(); }
  });

  $('#twBack').addEventListener('click', showTabList);
  $('#twPlus').addEventListener('click', (e) => (tabAddMenu.hidden ? openAddMenu(e.currentTarget, true) : closeTabMenus()));
  $('#twDone').addEventListener('click', closeTabsWin);
  twReset.addEventListener('click', () => {
    restoreTabs(tw.start);
    tabsChanged();
    showTabList();
  });
  $('#twClose').addEventListener('click', () => {
    if (tabsSnapshot() === tw.start) closeTabsWin();
    else smeConfirm.hidden = false;
  });
  function answerTabsConfirm(answer) {
    if (answer === 'yes') closeTabsWin();
    else if (answer === 'no') { restoreTabs(tw.start); closeTabsWin(); renderTabs(); }
    else if (answer === 'cancel') smeConfirm.hidden = true;
  }
  tabsWin.querySelector('.set-win__head').addEventListener('mousedown', (e) => startDrag(e, tabsWin));

  // Esc: подтверждение — «Отмена»; иначе снимает выделение виджета (если окно не открыто).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || ed) return;
    if (tw && !smeConfirm.hidden) { e.stopImmediatePropagation(); smeConfirm.hidden = true; return; }
    if (!tw && !tabMenuOpen() && e.target === document.body) selectTabs(false);
  });

  renderTabs();

  // ---------- Выбор иконки раздела (Figma 44fX18O5Huk4hmoaANMNIC 10506:57779; кружок цвета — 10506:66144, пока без выбора) ----------
  // Открывается по клику на иконку в шапке редактора, встаёт под ней. Выбранная иконка — в черновик (с отменой),
  // в аккордеон — по ✓. Вкладки справа прокручивают к группе; у последних вкладок групп в макете нет.
  const ICON_GROUPS = [
    { tab: '\uE68D', title: null, icons: ['E758', 'E90F', 'E61F', 'EAF8', ['cbuc', 'EA38'], 'E95B', 'EAA0', 'E9B1'] },
    { tab: '\uE931', title: 'Люди', icons: ['E9A7', 'E92D', 'E92E', 'E92F', 'E926', 'E6A9', 'E6AA', 'E6AB', 'E6AC', 'E6AD', 'E6AE', 'E6AF',
      'E6B0', 'E6B1', 'E6B2', 'E6B3', 'E6B4', 'E6B5', 'E6B6', 'E6B7', 'E6B8', 'E6B9', 'E6BA', 'E6BB', 'E6BC', 'E6BD', 'E6BE', 'EB6F'] },
    { tab: '\uE940', title: 'Статусы пользователя', icons: ['EB3E', 'EAAA', 'EA1C', 'EA1F', 'E96A', 'E949', 'E94A', 'E94B', 'E931', 'E932',
      'E933', 'E934', 'E935', 'E936', 'E937', 'E938', 'E939', 'E93A', 'E93B', 'E93C', 'E93D', 'E93E', 'E93F', 'E940', 'E941', 'E942',
      'E943', 'E944', 'E945', 'E67E', 'E618', 'E620'] },
    { tab: '\uE641', title: 'Финансы', icons: ['EAF2', 'EAD9', 'EA9E', 'EA9F', 'EAA0', 'EAA1', 'EAA2', 'EAA3', 'EAA4', 'EAA5', 'EAA6', 'EAB2',
      'EA93', 'EA38', 'EA35', 'EA06', 'EA0D', 'E9CD', 'E9BB', 'E98E', 'E981', 'E95B', 'E6D6', 'E6D7', 'E6A3', 'E695', 'E696', 'E641', 'E66F'] },
  ].map((g) => ({
    ...g,
    // строка — символ cbuc-icons24; [шрифт, код] — символ другого шрифта
    icons: g.icons.map((i) => (Array.isArray(i)
      ? { font: i[0], ch: String.fromCharCode(parseInt(i[1], 16)) }
      : { font: 'cbuc24', ch: String.fromCharCode(parseInt(i, 16)) })),
  }));
  const ICON_TABS_REST = ['\uE637', '\uE735', '\uE9E2', '\uE91B', '\uE9D9'];

  const iconPick = $('#iconPick');
  const iconPickList = $('#iconPickList');
  const iconPickTabs = $('#iconPickTabs');

  // Выбор иконки открывает редактор подменю (иконка в шапке) и редактор аккордеона (иконка пункта):
  // pick — { anchor — что нажато, cur — текущая иконка, apply(icon) — выбор }.
  let pick = null;
  function renderIconPick() {
    const cur = pick.cur;
    iconPickList.innerHTML = '';
    iconPickTabs.innerHTML = '';
    ICON_GROUPS.forEach((g, gi) => {
      const group = el('div', 'icon-pick__group');
      group.dataset.group = gi;
      if (g.title) group.append(el('div', 'icon-pick__title', g.title));
      const grid = el('div', 'icon-pick__grid');
      for (const ic of g.icons) {
        const b = el('button', 'icon-pick__btn', `<span class="${ic.font === 'cbuc' ? 'ico' : 'ico24'}">${ic.ch}</span>`);
        b.type = 'button';
        if (cur && cur.font === ic.font && cur.ch === ic.ch) b.classList.add('is-current');
        b.addEventListener('click', () => { const { apply } = pick; closeIconPick(); apply(ic); });
        grid.append(b);
      }
      group.append(grid);
      iconPickList.append(group);
    });
    [...ICON_GROUPS.map((g) => g.tab), ...ICON_TABS_REST].forEach((ch, i) => {
      const t = el('button', 'icon-pick__tab' + (i === 0 ? ' is-active' : ''), `<span class="ico">${ch}</span>`);
      t.type = 'button';
      if (i < ICON_GROUPS.length) t.addEventListener('click', () => {
        iconPickList.scrollTop = iconPickList.querySelector(`[data-group="${i}"]`).offsetTop;
      });
      iconPickTabs.append(t);
    });
  }

  // Активная вкладка — группа, которая сейчас вверху списка (в конце прокрутки — последняя).
  iconPickList.addEventListener('scroll', () => {
    const top = iconPickList.scrollTop + 1;
    let active = 0;
    for (const g of iconPickList.children) if (g.offsetTop <= top) active = +g.dataset.group;
    if (iconPickList.scrollTop + iconPickList.clientHeight >= iconPickList.scrollHeight - 1) active = ICON_GROUPS.length - 1;
    [...iconPickTabs.children].forEach((t, i) => t.classList.toggle('is-active', i === active));
  });

  function openIconPick(anchor = smeIcon, cur, apply) {
    if (anchor === smeIcon) {
      stopTitleEdit(true);
      ed.selected = null;
      renderEditor();
      cur = ed.draft.icon;
      apply = (ic) => commit({ ...cloneDraft(ed.draft), icon: ic });
    }
    pick = { anchor, cur, apply };
    renderIconPick();
    $('#iconPickSearch').value = '';
    iconPick.hidden = false;
    iconPickList.scrollTop = 0;
    anchor.classList.add('is-active');
    // Панель — поверх иконки: левый верхний угол панели в левом верхнем углу иконки (как окна «Меню» и «Логотип»).
    const r = stageRect(anchor);
    iconPick.style.left = Math.round(Math.max(0, Math.min(r.left, 1600 - iconPick.offsetWidth))) + 'px';
    iconPick.style.top = Math.round(Math.max(0, Math.min(r.top, 900 - iconPick.offsetHeight))) + 'px';
  }
  function closeIconPick() {
    iconPick.hidden = true;
    pick?.anchor.classList.remove('is-active');
    pick = null;
  }

  smeIcon.addEventListener('click', () => (iconPick.hidden ? openIconPick() : closeIconPick()));
  $('#iconPickClose').addEventListener('click', closeIconPick);
  // Клик мимо панели закрывает её (клик по самой иконке переключает панель).
  stage.addEventListener('mousedown', (e) => {
    if (iconPick.hidden || e.target.closest('#iconPick') || pick?.anchor.contains(e.target)) return;
    closeIconPick();
  }, true);

  // ---------- Меню «+» редактора (Figma 9eLwMJLQCwT0xHKviN2j1P 16090:257796) ----------
  // Строка шапки (поиск) — вровень с «+», левый край по «+». Клик по странице добавляет её виджетом в конец первой колонки.
  // Раскрываются «Моей компании» и «Отчетность» (остальные группы — пока без содержимого), «Добавить виджет» — только наведение.
  const PLUS_TREE = [
    { title: 'Моей компании', kind: 'group', open: true, items: ['О компании', 'Новости', 'Структура', 'Сотрудники', 'База знаний'] },
    { sep: true },
    { title: 'Отчетность', kind: 'group', open: true, items: ['Отчетность', 'Письма', 'Требования'] },
    { title: 'Документооборот', kind: 'folder' },
    { title: 'Управление персоналом', kind: 'folder' },
    { title: 'Бухгалтерия и зарплата', kind: 'folder' },
    { title: 'Госсистемы', kind: 'folder' },
    { title: 'Деньги', kind: 'group', items: [] },
    { title: 'Торги', kind: 'group', items: [] },
    { title: 'Маркетинг', kind: 'folder' },
    { title: 'Прочее', kind: 'folder' },
  ];
  const PLUS_OPEN = PLUS_TREE.filter((n) => n.open).map((n) => n.title);
  const plusMenu = $('#plusMenu');
  const plusList = $('#plusMenuList');
  const plusSearch = $('#plusMenuSearch');
  const smePlus = $('.sme-plus', editor);
  const accPlus = $('.acc-plus');
  let plusOwner = smePlus; // кнопка, открывшая меню: «+» редактора, плюс у виджета или «+» шапки аккордеона
  let plusAt = null; // плюс у виджета или пустая колонка: куда встанет страница — { col, at }

  function renderPlusMenu() {
    const q = plusSearch.value.trim().toLowerCase();
    const match = (t) => !q || t.toLowerCase().includes(q);
    const fromAcc = accEditor.contains(plusOwner); // плюс у пункта в редакторе аккордеона
    const fromEditor = plusOwner !== accPlus && !fromAcc;
    // В «Настройке аккордеона» и «Подменю → Редактор» уже добавленной страницы в меню нет: в редакторе — пунктов
    // и заголовка подменю, в «+» шапки аккордеона — добавленных пунктов аккордеона.
    const used = new Set(fromAcc ? ae.draft.map((it) => it.title) : fromEditor
      ? (itemSettingsOn() ? [ed.draft.showHead ? ed.draft.head : null, ...ed.draft.cols.flat().map((it) => it.title)] : [])
      : (accAddItems() ? SECTIONS.filter((s) => s.added).map((s) => s.title) : []));
    const pages = (n) => (n.items || []).filter((t) => !used.has(t));
    plusList.innerHTML = '';
    const row = (cls, html, onClick) => {
      const r = el('button', 'pm-row' + (cls ? ' ' + cls : ''), html);
      r.type = 'button';
      if (onClick) r.addEventListener('click', onClick);
      plusList.append(r);
    };
    // У «+» шапки аккордеона строк «Добавить виджет» и «Добавить колонку» нет. Реестр двухколоночный:
    // «Добавить колонку» — пока колонка одна (вторая без виджетов при удалении последнего пропадает).
    if (!q && fromEditor) {
      row('', '<span class="ico pm-ico">&#xEADD;</span><span>Добавить виджет</span>');
      if (itemSettingsOn() && ed.draft.cols.length < 2) row('', '<span class="ico24 pm-ico pm-ico--col">&#xEAEE;</span><span>Добавить колонку</span>', addColumn);
    }
    for (const n of PLUS_TREE) {
      if (n.sep) { if (!q) plusList.append(el('div', 'pm-sep')); continue; }
      const kids = pages(n).filter(match);
      if (q && !match(n.title) && !kids.length) continue;
      const arrow = n.kind === 'folder' ? '' : (n.open || (q && kids.length)) ? '' : '';
      // В меню «+» шапки аккордеона не кликаются страницы и пустые группы («Деньги», «Торги»).
      row('', `<span class="ico pm-ico">${arrow}</span><span>${n.title}</span>`,
        n.kind === 'group' && (fromEditor || fromAcc || n.items.length) ? () => { n.open = !n.open; renderPlusMenu(); } : null);
      // В «Настройке аккордеона» страница «Моей компании» из «+» шапки аккордеона добавляет пункт в аккордеон.
      const onPage = (t) => (fromAcc ? () => aeAddPage(t) : fromEditor ? () => addPage(t) : accAddItems() && n.title === 'Моей компании' ? () => addAccItem(t) : null);
      if (n.open || (q && kids.length)) for (const t of (q ? kids : pages(n))) row('pm-row--page', `<span>${t}</span>`, onPage(t));
    }
  }

  function addPage(title) {
    const draft = cloneDraft(ed.draft);
    let key;
    if (plusAt) { draft.cols[plusAt.col].splice(plusAt.at, 0, sub(title)); key = `${plusAt.col}:${plusAt.at}`; } // плюс у виджета или пустая колонка
    else {
      // новый пункт — в конец первой колонки, но над закреплёнными внизу
      const pinned = draft.cols[0].findIndex((it) => it.pinned);
      const at = pinned < 0 ? draft.cols[0].length : pinned;
      draft.cols[0].splice(at, 0, sub(title));
      key = `0:${at}`;
    }
    closePlusMenu();
    commit(draft);
    if (itemSettingsOn()) select(key); // добавленный пункт — выделен
  }

  // «Добавить колонку» — пустая колонка справа
  function addColumn() {
    const draft = cloneDraft(ed.draft);
    draft.cols.push([]);
    closePlusMenu();
    commit(draft);
  }

  // Во всех сценариях конструктора: страница из меню «+» шапки аккордеона становится пунктом в конце аккордеона
  // и открывается её страница (скелетон). Пустого подменю нет: в нём сразу заголовок — название пункта. Редактор подменю — по ✎ пункта, как у остальных разделов.
  const accAddItems = () => itemSettingsOn();
  const ADDED_ICON = ICON_GROUPS[0].icons[0]; // иконка нового пункта — первая из выбора иконок (меняется в редакторе)
  let addedCount = 0;
  function addAccItem(title) {
    const id = 'added-' + ++addedCount;
    const sec = { id, title, short: title, added: true, customIcon: ADDED_ICON, submenu: { head: title, cols: [[]] } };
    PRISTINE[id] = { title, short: title, icon: ADDED_ICON, head: title, showHead: true, cols: [[]] };
    ALL_SECTIONS[id] = sec;
    SECTIONS.push(sec);
    closePlusMenu();
    renderAccordion();
    goPage(id, null);
    record();
  }
  // Смена сценария: добавленные пункты уходят, удалённые меню «⋮» исходные разделы возвращаются на свои места.
  const ORIGINAL_IDS = SECTIONS.map((s) => s.id);
  function removeAddedSections() {
    const keep = ORIGINAL_IDS.map((id) => ALL_SECTIONS[id]);
    if (keep.length === SECTIONS.length && keep.every((s, i) => SECTIONS[i] === s)) return;
    SECTIONS.splice(0, SECTIONS.length, ...keep);
    if (ALL_SECTIONS[state.page.section]?.added) goPage(null, null);
    renderAccordion();
  }

  // ---------- Редактор аккордеона («Аккордеон → Настройка аккордеона») ----------
  // Кнопка-ссылка «Настроить» внизу аккордеона (в узком — карандаш, разворачивает аккордеон) открывает окно поверх аккордеона — как редактор подменю:
  // птичка в шапке окна встаёт на птичку аккордеона. В шапке окна — виджет шапки (птичка и saby): не удаляется,
  // ховер как в аккордеоне, клик — окно «Логотип». В карточке — аккордеон в его цветах: «ПРЕДПРИЯТИЕ» — статика,
  // разделы — виджеты. Клик выделяет (повторный — пока ничего, окно настроек позже), двойной клик по названию —
  // переименование, клик по иконке — выбор иконки, перетаскивание мышью — порядок, плюсы выделенного — меню «+»
  // (страница встаёт новым пунктом), тулбар: ⚙ и ⋯ — наведение, удаление. Правки — в черновике с отменой; ✓ применяет.
  const accEditor = $('#accEditor');
  const aeList = $('#aeList');
  const accGear = $('#accGear');
  const aeUndo = $('#aeUndo'), aeRedo = $('#aeRedo'), aeReset = $('#aeReset');
  $('#aeLogo').innerHTML = $('#goHome').innerHTML;

  // ae: { draft — [{ id, title, icon }], hist, at, selected — id | null }
  let ae = null;
  let aeEdit = null; // переименование: { text, id }
  const aeItem = (s) => ({ id: s.id, title: s.title, icon: s.customIcon ?? null, ...(s.pinned ? { pinned: true } : {}) });
  const aeKey = (d) => JSON.stringify(d);
  const aeBase = () => ORIGINAL_IDS.map((id) => ({ id, title: PRISTINE[id].title, icon: null })); // «Вернуть исходное»

  function openAe() {
    closeAccMore();
    closeSubmenu();
    closeOtherWindows();
    cancelLeave();
    const draft = SECTIONS.map(aeItem);
    ae = { draft, hist: [aeKey(draft)], at: 0, selected: null };
    smeConfirm.hidden = true;
    $('.ae-bird', accEditor).innerHTML = logoHTML();
    renderAe();
    shield.hidden = false;
    accEditor.hidden = false;
    stage.classList.add('is-ae-open');
    accGear.classList.add('is-active');
    // аккордеон окна — на аккордеоне страницы (у левого края сцены окно прижимается к краю), до низа сцены
    const acc = stageRect($('.accordion'));
    const card = $('.ae-card', accEditor);
    const top = Math.round(Math.max(0, acc.top - card.offsetTop));
    accEditor.style.left = Math.round(Math.max(0, acc.left - card.offsetLeft)) + 'px';
    accEditor.style.top = top + 'px';
    accEditor.style.height = (900 - top) + 'px';
  }
  function closeAe() {
    closeItemWin();
    closeAeMore();
    stopAeEdit(false);
    closeIconPick();
    closePlusMenu();
    if ($('#aeTheme').classList.contains('is-active')) closeColorWin();
    if (openWin === 'logo') setWindow(null);
    smeConfirm.hidden = true;
    accEditor.hidden = true;
    shield.hidden = true;
    stage.classList.remove('is-ae-open');
    accGear.classList.remove('is-active');
    ae = null;
  }

  // элемент справа пункта в редакторе: свой из окна настроек или счётчик раздела
  const aeRight = (it) => ('right' in it ? it.right : secCount(ALL_SECTIONS[it.id]));

  function renderAe() {
    const { draft, selected } = ae;
    if (iw?.ae && iw.key !== selected) closeItemWin(); // окно настроек — только у выделенного пункта
    closeAeMore(); // меню «⋯» — от тулбара, который сейчас перерисуется
    aeList.innerHTML = '';
    const mk = (side, at) => {
      const m = el('span', `sme-mk sme-mk--${side}`);
      Object.assign(m.dataset, { col: 0, at });
      return m;
    };
    draft.forEach((it, i) => {
      const s = ALL_SECTIONS[it.id];
      const view = { ...s, title: it.title, customIcon: it.icon };
      const w = el('div', 'sme-w ae-w' + (it.id === selected ? ' is-selected' : '') + (it.pinned ? ' is-pinned' : ''));
      w.dataset.id = it.id;
      w.append(el('div', 'acc-item__btn' + (view.photo && !view.customIcon ? ' acc-item__btn--photo' : ''),
        `${iconHTML(view)}<span class="acc-item__title">${it.title}</span>${accRightHTML(aeRight(it))}`));
      // у закреплённого снизу плюсов нет (над ним добавляют плюсом пункта выше)
      if (it.id === selected) w.append(...(it.pinned ? [] : [mk('top', i), mk('bottom', i + 1)]), aeToolbar());
      aeList.append(w);
    });
    watchCut(aeList);
    aeUndo.disabled = ae.at === 0;
    aeRedo.disabled = ae.at === ae.hist.length - 1;
    aeReset.disabled = aeKey(draft) === aeKey(aeBase());
    if (iw?.ae) renderItemWin(); // правки окна настроек видны на пункте и после перерисовки
  }

  // Тулбар выделенного пункта (Figma 18582:28278): «Закрепить снизу» / «Открепить» (18585:28344), ⚙ — окно настроек пункта
  // справа, удаление, ⋯ — наведение.
  function aeToolbar() {
    const tb = el('div', 'sme-tb');
    const btn = (cls, ch, label) => {
      const b = el('button', 'sme-tb__btn' + (cls ? ' ' + cls : ''), `<span class="ico24">${ch}</span>`);
      b.type = 'button';
      b.setAttribute('aria-label', label);
      tb.append(b);
      return b;
    };
    const pinned = !!ae.draft.find((it) => it.id === ae.selected)?.pinned;
    const pin = btn('sme-tb__btn--pin', pinned ? '' : '', pinned ? 'Открепить' : 'Закрепить снизу');
    pin.dataset.tip = pinned ? 'Открепить' : 'Закрепить снизу';
    pin.addEventListener('click', () => aeSetPin(ae.selected, !pinned));
    btn('sme-tb__btn--gear' + (iw?.ae && iw.key === ae.selected ? ' is-active' : ''), '', 'Настройки')
      .addEventListener('click', () => (iw?.ae && iw.key === ae.selected ? closeItemWin() : openAeItemWin(ae.selected)));
    btn('sme-tb__btn--del', '', 'Удалить').addEventListener('click', () => {
      aeCommit(ae.draft.filter((it) => it.id !== ae.selected));
    });
    const more = btn('sme-tb__btn--more' + (aeMoreOpen() ? ' is-active' : ''), '', 'Ещё');
    more.addEventListener('click', () => (aeMoreOpen() ? closeAeMore() : openAeMore(more)));
    return tb;
  }

  // Меню «⋯» тулбара пункта (Figma 18588:28495): в 8 под тулбаром, иконки пунктов — ровно под «⋯»
  const aeMore = $('#aeMore');
  const aeMoreOpen = () => !aeMore.hidden;
  function openAeMore(btnMore) {
    closeIwMenu();
    const pinned = !!ae.draft.find((it) => it.id === ae.selected)?.pinned;
    $('#aeMorePinIco').textContent = pinned ? '' : '';
    $('#aeMorePinText').textContent = pinned ? 'Открепить' : 'Закрепить снизу';
    aeMore.hidden = false;
    btnMore.classList.add('is-active');
    const tb = btnMore.closest('.sme-tb');
    const t = stageRect(tb), moreIco = stageRect($('.ico24', btnMore));
    aeMore.style.left = '0px';
    aeMore.style.top = Math.round(t.top + t.height + 8) + 'px';
    const shift = stageRect($('.ico24', aeMore)).left - stageRect(aeMore).left; // от края меню до первой иконки
    aeMore.style.left = Math.round(moreIco.left - shift) + 'px';
  }
  function closeAeMore() {
    if (aeMore.hidden) return;
    aeMore.hidden = true;
    $('.sme-tb__btn--more.is-active', aeList)?.classList.remove('is-active');
  }
  $('#aeMoreClose').addEventListener('click', closeAeMore);
  stage.addEventListener('mousedown', (e) => { if (aeMoreOpen() && !e.target.closest('#aeMore, .sme-tb__btn--more')) closeAeMore(); }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && aeMoreOpen()) closeAeMore(); });
  aeMore.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act || !ae?.selected) return;
    const id = ae.selected;
    closeAeMore();
    if (act === 'pin') aeSetPin(id, !ae.draft.find((it) => it.id === id).pinned);
    else if (act === 'settings') openAeItemWin(id);
    else if (act === 'delete') aeCommit(ae.draft.filter((it) => it.id !== id));
  });

  // Закрепить снизу можно только один пункт: он уходит в самый низ, у прежнего закреплённого закрепление снимается.
  // Открепленный пункт остаётся на месте.
  function aePin(draft, id, on) {
    const next = draft.map((it) => {
      const { pinned, ...rest } = it;
      return (on ? it.id === id : pinned && it.id !== id) ? { ...rest, pinned: true } : rest;
    });
    return on ? [...next.filter((it) => it.id !== id), next.find((it) => it.id === id)] : next;
  }

  // Закрепить / открепить — сразу шагом в черновик (из тулбара, меню «⋯» и окна настроек). Открытое окно пункта
  // следует за ним: закрепление в окне — уже применённое, ✕ окна его не откатывает.
  function aeSetPin(id, on) {
    aeCommit(aePin(ae.draft, id, on), id);
    if (!(iw?.ae && iw.key === id)) return;
    iw.pinned = on;
    const start = JSON.parse(iw.start);
    start[2] = on;
    iw.start = JSON.stringify(start);
    renderItemWin();
    placeAeItemWin(id);
  }

  function aeCommit(draft, selected = null) {
    if (aeKey(draft) === aeKey(ae.draft)) { aeSelect(selected); return; }
    ae.hist = ae.hist.slice(0, ae.at + 1);
    ae.hist.push(aeKey(draft));
    ae.at = ae.hist.length - 1;
    ae.draft = draft;
    ae.selected = selected;
    renderAe();
  }
  function aeGo(step) {
    const at = ae.at + step;
    if (at < 0 || at >= ae.hist.length) return;
    ae.at = at;
    ae.draft = JSON.parse(ae.hist[at]);
    ae.selected = null;
    renderAe();
  }
  function aeSelect(id) {
    if (!ae || ae.selected === id) return;
    // выделен может быть только один виджет: выделение пункта закрывает «Логотип», открытый по шапке
    if (id && openWin === 'logo' && openFrom === $('#aeBrand')) setWindow(null);
    ae.selected = id;
    renderAe();
  }

  // Новый пункт из меню «+» — как при добавлении из «+» шапки аккордеона: своя иконка, подменю из одного заголовка; встаёт на место плюса.
  function aeAddPage(title) {
    const id = 'added-' + ++addedCount;
    ALL_SECTIONS[id] = { id, title, short: title, added: true, customIcon: ADDED_ICON, submenu: { head: title, cols: [[]] } };
    PRISTINE[id] = { title, short: title, icon: ADDED_ICON, head: title, showHead: true, cols: [[]] };
    const draft = ae.draft.slice();
    // под закреплённым снизу пунктом новый не встаёт — только над ним
    const last = draft.length - (draft.some((it) => it.pinned) ? 1 : 0);
    draft.splice(Math.min(plusAt ? plusAt.at : draft.length, last), 0, { id, title, icon: ADDED_ICON });
    closePlusMenu();
    aeCommit(draft, id); // добавленный пункт — выделен
  }

  // ✓: аккордеон по черновику — порядок, названия, иконки; удалённые пропадают, новые встают. Заголовки подменю
  // при переименовании не меняются (как в редакторе подменю).
  function saveAe() {
    const items = ae.draft.map((it) => {
      const s = ALL_SECTIONS[it.id];
      if (it.title !== s.title && !s.submenu.headLabel && s.submenu.head == null) s.submenu.head = s.title;
      s.title = it.title;
      s.short = it.title === PRISTINE[it.id].title ? PRISTINE[it.id].short : it.title;
      s.customIcon = it.icon;
      s.pinned = !!it.pinned; // закреплённый снизу — в самом низу аккордеона
      return s;
    });
    SECTIONS.splice(0, SECTIONS.length, ...items);
    closeAe();
    if (state.page.section && !SECTIONS.some((s) => s.id === state.page.section)) goPage(null, null);
    renderAccordion();
    record();
  }
  function answerAeConfirm(answer) {
    if (answer === 'yes') saveAe();
    else if (answer === 'no') closeAe();
    else if (answer === 'cancel') smeConfirm.hidden = true;
  }

  // Переименование на месте: каретка там, куда кликнули (мимо текста — в конец). Enter или клик мимо — применить, Esc — отменить.
  function startAeEdit(id, x, y) {
    aeSelect(id);
    const text = $(`.ae-w[data-id="${id}"] .acc-item__title`, aeList);
    aeEdit = { text, id };
    $('.sme-tb', text.closest('.ae-w'))?.remove();
    text.contentEditable = 'plaintext-only';
    text.focus();
    let range = document.caretRangeFromPoint?.(x, y);
    if (!range || !text.contains(range.startContainer)) {
      range = document.createRange();
      range.selectNodeContents(text);
    }
    range.collapse(false);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(range);
  }
  function stopAeEdit(apply) {
    if (!aeEdit) return;
    const { text, id } = aeEdit;
    aeEdit = null;
    const value = text.textContent.replace(/\s+/g, ' ').trim();
    if (apply && value) aeCommit(ae.draft.map((it) => (it.id === id ? { ...it, title: value } : it)), id);
    else renderAe();
  }
  aeList.addEventListener('keydown', (e) => {
    if (!aeEdit) return;
    if (e.key === 'Enter') { e.preventDefault(); stopAeEdit(true); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); stopAeEdit(false); }
  });

  // Перетаскивание: нажатие на пункт и сдвиг больше 4px — пункт едет за курсором по вертикали, остальные расступаются;
  // отпускание ставит его на новое место. Без сдвига — клик: выделение.
  function aeDrag(e, w) {
    const ws = [...aeList.children];
    const from = ws.indexOf(w);
    const tops = ws.map((x) => x.offsetTop);
    const step = ws.length > 1 ? tops[1] - tops[0] : w.offsetHeight;
    const y0 = e.clientY;
    let to = from, dragging = false;
    const move = (ev) => {
      const dy = (ev.clientY - y0) / scale;
      if (!dragging) {
        if (Math.abs(dy) < 4) return;
        dragging = true;
        aeList.classList.add('is-dragging');
        w.classList.add('is-dragged');
      }
      const d = Math.max(tops[0] - tops[from], Math.min(tops[ws.length - 1] - tops[from], dy));
      w.style.transform = `translateY(${d}px)`;
      to = Math.max(0, Math.min(ws.length - 1, Math.round((tops[from] + d - tops[0]) / step)));
      ws.forEach((x, i) => {
        if (i === from) return;
        const shift = from < i && i <= to ? -step : to <= i && i < from ? step : 0;
        x.style.transform = shift ? `translateY(${shift}px)` : '';
      });
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      if (!dragging) {
        // повторный клик по выделенному — окно настроек пункта, как по ⚙ (если ещё не открыто)
        const id = w.dataset.id;
        if (ae.selected === id && e.detail === 1 && iw?.key !== id) openAeItemWin(id);
        else aeSelect(id);
        return;
      }
      aeList.classList.remove('is-dragging');
      const draft = ae.draft.slice();
      draft.splice(to, 0, ...draft.splice(from, 1));
      // закреплённый пункт всегда последний: перетаскивание его не сдвигает и других под него не ставит
      const p = draft.findIndex((it) => it.pinned);
      if (p >= 0) draft.push(...draft.splice(p, 1));
      aeCommit(draft, w.dataset.id);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  accEditor.addEventListener('mousedown', (e) => {
    if (!ae || e.button !== 0 || e.target.closest('.sme-mk, .sme-tb, .sme-head')) return;
    const w = e.target.closest('.ae-w');
    if (aeEdit) {
      if (aeEdit.text.contains(e.target)) return;
      stopAeEdit(true);
    }
    if (!w) { aeSelect(null); return; }
    const id = w.dataset.id;
    // второе нажатие двойного клика по названию — переименование
    if (e.detail === 2 && e.target.closest('.acc-item__title')) { e.preventDefault(); startAeEdit(id, e.clientX, e.clientY); return; }
    // иконка — выбор иконки пункта
    const icon = e.target.closest('.acc-item__icon, .acc-cal, .acc-item__photo');
    if (icon) {
      aeSelect(id);
      const anchor = $(`.ae-w[data-id="${id}"] :is(.acc-item__icon, .acc-cal, .acc-item__photo)`, aeList);
      if (pick?.anchor === anchor) { closeIconPick(); return; }
      openIconPick(anchor, ae.draft.find((it) => it.id === id).icon, (ic) => aeCommit(ae.draft.map((it) => (it.id === id ? { ...it, icon: ic } : it)), id));
      return;
    }
    e.preventDefault();
    aeDrag(e, w);
  });
  aeList.addEventListener('click', (e) => {
    const m = e.target.closest('.sme-mk');
    if (!m) return;
    const again = !plusMenu.hidden && plusOwner === m;
    if (!plusMenu.hidden) closePlusMenu();
    if (!again) openPlusMenu(m);
  });
  shield.addEventListener('mousedown', () => { if (!ae) return; stopAeEdit(true); aeSelect(null); });
  $('.sme-head', accEditor).addEventListener('mousedown', (e) => startDrag(e, accEditor));
  // виджет шапки: клик — окно «Логотип» (повторный — закрывает)
  $('#aeBrand').addEventListener('click', (e) => logoOn() && setWindow(openWin === 'logo' && openFrom ? null : 'logo', e.currentTarget, { right: $('.ae-card', accEditor) }));

  // в узком аккордеоне (снизу только карандаш) сначала разворачиваем его, редактор — по окончании анимации
  accGear.addEventListener('click', () => {
    if (ae) return;
    if (!isNarrow()) { openAe(); return; }
    update({ view: 'wide' });
    setTimeout(openAe, RESIZE_MS + 20);
  });
  // «+» шапки окна — меню «+», страница встаёт пунктом в конец
  const aePlus = $('#aePlus');
  aePlus.addEventListener('click', () => (plusMenu.hidden ? openPlusMenu(aePlus) : closePlusMenu()));
  aeUndo.addEventListener('click', () => aeGo(-1));
  aeRedo.addEventListener('click', () => aeGo(1));
  aeReset.addEventListener('click', () => aeCommit(aeBase()));
  $('#aeDone').addEventListener('click', saveAe);
  $('#aeClose').addEventListener('click', () => {
    if (aeKey(ae.draft) === ae.hist[0]) closeAe();
    else smeConfirm.hidden = false;
  });

  // ---------- Окно настроек пункта подменю (Figma 9eLwMJLQCwT0xHKviN2j1P 18562:24378) ----------
  // По ⚙ тулбара выделенного виджета, в «Настройке аккордеона» и «Подменю → Редактор». Встаёт справа от виджета (как «Вкладки»),
  // перетаскивается за шапку. Правки сразу видны на виджете: ✓ — одним шагом в черновик редактора, ✕ — без изменений,
  // ↺ — к виду на момент открытия. У заголовка подменю нет «Вложенности» и «Закрепить», зато есть «Размещение» плюса.
  const itemWin = $('#itemWin');
  const iwTitle = $('#iwTitle');
  const iwMenu = $('#iwMenu');
  const IW_LEVELS = [[1, '1 уровень'], [2, '2 уровень']];
  const IW_CMDS = [['none', 'Не выбрано'], ['count', 'Счетчик'], ['panel', 'Открытие панели'], ['add', 'Добавление']];
  const IW_SHOWS = [['both', 'Новые и общие события'], ['new', 'Только новые события'], ['total', 'Общее количество событий']];
  const IW_DEMO = { accent: '3', count: '12' }; // демо-цифры счётчика, если своих у пункта нет
  // окно и правки реестра — во всех сценариях, кроме скрытых «Добавления вкладки»
  function itemSettingsOn() { return !stage.dataset.scenario.startsWith('tab-'); }

  // Элемент справа пункта ⇄ настройки окна
  function iwFromRight(r) {
    const cfg = { cmd: 'none', show: 'new', panel: false, side: 'right', nums: { ...IW_DEMO } };
    if (r === 'arrow') cfg.cmd = 'panel';
    else if (r === 'plus' || r === 'plus-left') Object.assign(cfg, { cmd: 'add', side: r === 'plus' ? 'right' : 'left' });
    else if (r && typeof r === 'object') {
      Object.assign(cfg, { cmd: 'count', panel: !!r.panel, show: r.accent && r.count ? 'both' : r.accent ? 'new' : 'total' });
      cfg.nums = { accent: r.accent ?? IW_DEMO.accent, count: r.count ?? IW_DEMO.count };
    }
    return cfg;
  }
  function iwRight() {
    if (iw.cmd === 'panel') return 'arrow';
    if (iw.cmd === 'add') return iw.key === 'head' && iw.side === 'left' ? 'plus-left' : 'plus';
    if (iw.cmd !== 'count') return null;
    const r = {};
    if (iw.show !== 'total') r.accent = iw.nums.accent;
    if (iw.show !== 'new') r.count = iw.nums.count;
    if (iw.panel) r.panel = true;
    return r;
  }
  const iwState = () => JSON.stringify([iw.title, iw.level, iw.pinned, iwRight()]);

  function openItemWin(key) {
    closeOtherWindows();
    if (!plusMenu.hidden) closePlusMenu(); // два меню / окна сразу не открыты
    const d = ed.draft;
    const head = key === 'head';
    const [ci, ii] = head ? [] : key.split(':').map(Number);
    const it = head ? null : d.cols[ci][ii];
    const right = head ? d.headRight : it.right;
    iw = { key, title: head ? d.head : it.title, level: it?.level ?? 1, pinned: !!it?.pinned, ...iwFromRight(right) };
    iw.start = iwState();
    iwTitle.textContent = iw.title;
    renderItemWin();
    itemWin.hidden = false;
    // левый край — в 8 от правого края виджета, верх — по верху виджета
    const r = stageRect($(`.sme-w[data-key="${key}"]`, editor));
    itemWin.style.left = Math.round(Math.min(r.left + r.width + 8, 1600 - itemWin.offsetWidth)) + 'px';
    itemWin.style.top = Math.round(Math.max(0, Math.min(r.top, 900 - itemWin.offsetHeight))) + 'px';
    $('.sme-tb__btn--gear', editor)?.classList.add('is-active');
  }

  // Пункт аккордеона в его редакторе: то же окно (Figma 18585:28421) — иконка у названия, «Наполнение пункта»
  // (Команды, Выводить, чекбокс) и «Закрепить пункт снизу»; встаёт справа от пункта в 8px.
  function openAeItemWin(id) {
    closeOtherWindows();
    if (!plusMenu.hidden) closePlusMenu();
    closeIconPick();
    const it = ae.draft.find((x) => x.id === id);
    iw = { ae: true, key: id, title: it.title, level: 1, pinned: !!it.pinned, ...iwFromRight(aeRight(it)) };
    iw.start = iwState();
    iwTitle.textContent = iw.title;
    $('#iwIcon').innerHTML = iconHTML({ ...ALL_SECTIONS[id], customIcon: it.icon });
    renderItemWin();
    itemWin.hidden = false;
    placeAeItemWin(id);
    $('.sme-tb__btn--gear', aeList)?.classList.add('is-active');
  }
  // окно — справа от пункта в 8, верх — по верху пункта
  function placeAeItemWin(id) {
    const r = stageRect($(`.ae-w[data-id="${id}"]`, aeList));
    itemWin.style.left = Math.round(Math.min(r.left + r.width + 8, 1600 - itemWin.offsetWidth)) + 'px';
    itemWin.style.top = Math.round(Math.max(0, Math.min(r.top, 900 - itemWin.offsetHeight))) + 'px';
  }

  function closeItemWin() {
    if (!iw) return;
    iw = null;
    closeIwMenu();
    itemWin.hidden = true;
    for (const g of document.querySelectorAll('.sme-tb__btn--gear.is-active')) g.classList.remove('is-active');
  }

  function renderItemWin() {
    const acc = !!iw.ae; // пункт аккордеона в его редакторе
    const head = !acc && iw.key === 'head';
    // «Закрепить пункт снизу» — только у пункта аккордеона; «Вложенность» и «По клику» — только у пункта подменю
    const rows = { main: !acc, level: !head && !acc, show: iw.cmd === 'count', side: head && iw.cmd === 'add', pin: acc && !iw.pinned };
    $('#iwIcon').hidden = !acc;
    $('#iwFillTitle').textContent = acc ? 'Наполнение пункта' : 'Дополнительно';
    $('#iwCmdName').textContent = acc ? 'Команды' : 'Команда';
    for (const n of itemWin.querySelectorAll('[data-row]')) n.hidden = !rows[n.dataset.row];
    $('#iwLevel').textContent = IW_LEVELS.find(([v]) => v === iw.level)[1];
    $('#iwPage').textContent = iw.title;
    $('#iwCmd').textContent = IW_CMDS.find(([v]) => v === iw.cmd)[1];
    $('#iwShow').textContent = IW_SHOWS.find(([v]) => v === iw.show)[1];
    $('#iwPanel').classList.toggle('is-on', iw.panel);
    for (const b of $('#iwSide').children) b.classList.toggle('is-on', b.dataset.side === iw.side);
    $('#iwPinned').hidden = !(acc && iw.pinned); // закреплённый — свойство «Закреплен снизу ×» в блоке вместо чипсы
    $('#iwReset').disabled = iwState() === iw.start;
    // настройки сразу видны на виджете (название, уровень, элемент справа); в черновик — по ✓, ✕ возвращает виджет как был
    if (acc) {
      const aw = $(`.ae-w[data-id="${iw.key}"]`, aeList);
      if (!aw) return;
      $('.acc-item__title', aw).textContent = iw.title;
      $('.acc-item__count', aw)?.remove();
      $('.acc-item__title', aw).insertAdjacentHTML('afterend', accRightHTML(iwRight()));
      return;
    }
    const w = $(`.sme-w[data-key="${iw.key}"]`, editor);
    if (!w) return;
    $('.sme-w__text', w).textContent = iw.title;
    if (!head) w.classList.toggle('sme-w--sub', iw.level === 2);
    $('.sm-right', w)?.remove();
    const right = iwRight();
    if (right) $('.sme-w__text', w).insertAdjacentHTML('afterend', rightHTML(right));
    if (stage.dataset.scenario === 'submenu-editor') renderRuntime(iwDraft().draft);
  }
  function iwSet(patch) { Object.assign(iw, patch); renderItemWin(); }

  // Черновик с настройками окна; закреплённый пункт уходит в конец своей колонки.
  function iwDraft() {
    const { key } = iw;
    const title = iw.title.replace(/\s+/g, ' ').trim() || JSON.parse(iw.start)[0];
    const right = iwRight();
    const draft = cloneDraft(ed.draft);
    let selKey = key;
    if (key === 'head') Object.assign(draft, { head: title, headRight: right });
    else {
      const [ci, ii] = key.split(':').map(Number);
      const col = draft.cols[ci];
      const wasPinned = !!col[ii].pinned;
      const it = { ...col[ii], title, level: iw.level };
      delete it.right;
      delete it.pinned;
      if (right) it.right = right;
      if (iw.pinned) it.pinned = true;
      col[ii] = it;
      if (iw.pinned && !wasPinned) { col.splice(ii, 1); col.push(it); selKey = `${ci}:${col.length - 1}`; }
    }
    return { draft, selKey };
  }
  // ✓: настройки — в черновик одним шагом. Виджет остаётся выделенным.
  function applyItemWin() {
    if (iw.ae) { applyAeItemWin(); return; }
    const { draft, selKey } = iwDraft();
    closeItemWin();
    commit(draft);
    select(selKey);
  }

  // ✓ у пункта аккордеона: название, элемент справа (если отличается от счётчика раздела) и закрепление — шагом в черновик;
  // закреплённый пункт уходит в конец списка. Пункт остаётся выделенным.
  function applyAeItemWin() {
    const id = iw.key;
    const title = iw.title.replace(/\s+/g, ' ').trim() || JSON.parse(iw.start)[0];
    const right = iwRight();
    const same = JSON.stringify(right) === JSON.stringify(secCount(ALL_SECTIONS[id]));
    const { pinned } = iw;
    const wasPinned = !!ae.draft.find((it) => it.id === id).pinned;
    let draft = ae.draft.map((it) => {
      if (it.id !== id) return it;
      const next = { ...it, title };
      delete next.right;
      if (!same) next.right = right;
      return next;
    });
    if (pinned !== wasPinned) draft = aePin(draft, id, pinned);
    closeItemWin();
    aeCommit(draft, id);
  }

  $('#iwDone').addEventListener('click', applyItemWin);
  $('#iwClose').addEventListener('click', () => {
    const acc = iw?.ae;
    closeItemWin();
    if (acc) renderAe();
    else renderEditor(); // виджет — снова из черновика
  });
  $('#iwReset').addEventListener('click', () => {
    const [title, level, pinned, right] = JSON.parse(iw.start);
    iwTitle.textContent = title;
    iwSet({ title, level, pinned, ...iwFromRight(right), nums: iw.nums });
  });
  $('.set-win__head', itemWin).addEventListener('mousedown', (e) => startDrag(e, itemWin));
  // Название правится на месте: Enter — закончить, Esc — вернуть как было при открытии окна; пустое — тоже возвращается.
  const iwTitleBack = () => { iwTitle.textContent = JSON.parse(iw.start)[0]; iwSet({ title: iwTitle.textContent }); };
  iwTitle.addEventListener('input', () => iwSet({ title: iwTitle.textContent }));
  iwTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); iwTitle.blur(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); iwTitleBack(); iwTitle.blur(); }
  });
  iwTitle.addEventListener('blur', () => { if (iw && !iw.title.trim()) iwTitleBack(); });
  $('#iwPanel').addEventListener('click', () => iwSet({ panel: !iw.panel }));
  $('#iwSide').addEventListener('click', (e) => { const b = e.target.closest('[data-side]'); if (b) iwSet({ side: b.dataset.side }); });
  // у пункта аккордеона чипса и × свойства — то же действие, что в тулбаре: применяются сразу
  $('#iwPin').addEventListener('click', () => (iw.ae ? aeSetPin(iw.key, true) : iwSet({ pinned: true })));
  $('#iwUnpin').addEventListener('click', () => (iw.ae ? aeSetPin(iw.key, false) : iwSet({ pinned: false })));

  // Выпадающие списки окна («Вложенность», «Команда», «Выводить»): первый пункт встаёт на место ссылки, выбранный — с точкой.
  let iwMenuFor = null;
  function openIwMenu(link, options, current, width, pick) {
    iwMenuFor = link;
    const box = $('#iwMenuList');
    box.innerHTML = '';
    for (const [v, text] of options) {
      const b = el('button', 'mw-menu__item' + (v === current ? ' is-on' : ''), `<span class="mw-menu__dot"></span><span class="mw-menu__text">${text}</span>`);
      b.type = 'button';
      b.addEventListener('click', () => { closeIwMenu(); pick(v); });
      box.append(b);
    }
    iwMenu.style.width = width + 'px';
    iwMenu.hidden = false;
    const r = stageRect(link);
    // 30 = отступ списка 8 + отступ пункта 8 + маркер 12 + 2; 12 — верхний отступ списка, 16 — половина пункта.
    iwMenu.style.left = (r.left - 30) + 'px';
    iwMenu.style.top = (r.top + r.height / 2 - 12 - 16) + 'px';
  }
  function closeIwMenu() { iwMenu.hidden = true; iwMenuFor = null; }
  const iwToggle = (link, ...args) => (iwMenuFor === link ? closeIwMenu() : openIwMenu(link, ...args));
  $('#iwLevel').addEventListener('click', (e) => iwToggle(e.currentTarget, IW_LEVELS, iw.level, 190, (v) => iwSet({ level: v })));
  $('#iwCmd').addEventListener('click', (e) => iwToggle(e.currentTarget, IW_CMDS, iw.cmd, 190, (v) => iwSet({ cmd: v })));
  $('#iwShow').addEventListener('click', (e) => iwToggle(e.currentTarget, IW_SHOWS, iw.show, 271, (v) => iwSet({ show: v })));
  $('#iwMenuClose').addEventListener('click', closeIwMenu);
  stage.addEventListener('mousedown', (e) => {
    if (iwMenu.hidden || e.target.closest('#iwMenu') || e.target.closest('.iw-link') === iwMenuFor) return;
    closeIwMenu();
  }, true);

  // Зона счётчика с «Открывать панель по клику на счетчик» — свой клик: пункт по нему не открывается (панели пока нет).
  for (const box of [list, layer]) box.addEventListener('click', (e) => { if (e.target.closest('.sm-right--btn')) e.stopPropagation(); }, true);

  function openPlusMenu(owner) {
    // окно настроек пункта закрывается без сохранения (как по ✕); виджеты перерисовываются — плюс находим заново
    if (iw) {
      const m = owner.classList.contains('sme-mk') && owner.className.match(/sme-mk--\w+/)[0];
      const w = m && owner.parentElement.closest('.sme-w');
      const li = owner.classList.contains('sme-list') ? [...smeCard.children].indexOf(owner) : -1;
      const acc = iw.ae;
      closeItemWin();
      if (acc) renderAe();
      else renderEditor();
      if (w && acc) owner = $(`.ae-w[data-id="${w.dataset.id}"] > .${m}`, aeList);
      else if (w) owner = $(`.sme-w[data-key="${w.dataset.key}"] > .${m}`, smeCard);
      else if (li >= 0) owner = smeCard.children[li];
    }
    if (owner !== accPlus) stopTitleEdit(true);
    plusOwner = owner;
    plusAt = owner.dataset.at == null ? null : { col: +owner.dataset.col, at: +owner.dataset.at };
    plusSearch.value = '';
    // каждое открытие — исходный вид: раскрыты «Моей компании» и «Отчетность»
    for (const n of PLUS_TREE) if (n.kind === 'group') n.open = PLUS_OPEN.includes(n.title);
    renderPlusMenu();
    plusMenu.hidden = false;
    owner.classList.add('is-active');
    const r = stageRect(owner);
    // 9 — верхний отступ меню, 14 — половина строки поиска.
    plusMenu.style.left = Math.round(Math.min(r.left, 1600 - plusMenu.offsetWidth)) + 'px';
    plusMenu.style.top = Math.round(Math.max(0, Math.min(r.top + r.height / 2 - 9 - 14, 900 - plusMenu.offsetHeight))) + 'px';
    plusSearch.focus();
  }
  function closePlusMenu() {
    plusMenu.hidden = true;
    plusOwner.classList.remove('is-active');
  }

  smePlus.addEventListener('click', () => (plusMenu.hidden ? openPlusMenu(smePlus) : closePlusMenu()));
  accPlus.addEventListener('click', () => (plusMenu.hidden ? openPlusMenu(accPlus) : closePlusMenu()));
  smeCard.addEventListener('click', (e) => {
    const m = e.target.closest('.sme-mk') ?? (e.target.closest('.sme-empty__btn') && e.target.closest('.sme-list.is-empty'));
    if (!m || m.dataset.at == null) return; // вне реестра плюсы пока ничего не добавляют
    const again = !plusMenu.hidden && plusOwner === m;
    if (!plusMenu.hidden) closePlusMenu();
    if (!again) openPlusMenu(m);
  });
  $('#plusMenuClose').addEventListener('click', closePlusMenu);
  plusSearch.addEventListener('input', renderPlusMenu);
  stage.addEventListener('mousedown', (e) => {
    if (plusMenu.hidden || e.target.closest('#plusMenu') || e.target.closest('.sme-plus, .acc-plus, .sme-mk, .sme-list.is-empty .sme-empty__btn')) return;
    closePlusMenu();
  }, true);

  document.addEventListener('keydown', (e) => {
    if (!plusMenu.hidden && e.key === 'Escape') { e.stopImmediatePropagation(); closePlusMenu(); }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (!ed || smeTitle.classList.contains('is-editing') || itemEdit || e.target === plusSearch) return;
    if (!iconPick.hidden) {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); closeIconPick(); }
      return;
    }
    // Пока открыто подтверждение — только Esc (= «Отмена»).
    if (!smeConfirm.hidden) { if (e.key === 'Escape') { e.stopImmediatePropagation(); smeConfirm.hidden = true; } return; }
    if (e.key === 'Delete') { e.preventDefault(); deleteSelected(); }
    else if (e.key === 'Escape') {
      e.stopImmediatePropagation();
      select(null);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!dropdown.hidden || !iconMenu.hidden || tabMenuOpen()) closePopups();
    else closeSubmenu();
  });

  // ---------- Тултип ----------
  // Подсказка из data-tip ближайшего элемента: появляется через паузу под курсором, прячется при клике и уходе.
  const tip = el('div', 'tooltip');
  tip.hidden = true;
  stage.append(tip);
  let tipTarget = null, tipTimer = 0, tipX = 0, tipY = 0;
  const hideTip = () => { clearTimeout(tipTimer); tip.hidden = true; };
  stage.addEventListener('mousemove', (e) => { tipX = e.clientX; tipY = e.clientY; });
  stage.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-tip]');
    if (t === tipTarget) return;
    tipTarget = t;
    hideTip();
    if (!t) return;
    tipTimer = setTimeout(() => {
      if (!t.dataset.tip) return;
      tip.textContent = t.dataset.tip;
      tip.hidden = false;
      const s = stage.getBoundingClientRect();
      tip.style.left = `${Math.min((tipX - s.left) / scale, 1600 - tip.offsetWidth - 4)}px`;
      tip.style.top = `${(tipY - s.top) / scale + 18}px`;
    }, 500);
  });
  stage.addEventListener('mousedown', () => { hideTip(); tipTarget = null; });
  stage.addEventListener('mouseleave', () => { hideTip(); tipTarget = null; });


  // ---------- Тема оформления ----------
  // Готовые палитры: красят фон за контентом, аккордеон, подменю и акценты. Тема применяется сразу по клику на плашку,
  // ✓ и ✕ просто закрывают панель. Цвета — с миниатюр макета (16090:237338), «Голубая» — с экрана 19270:30531 (gradient 1).
  // acc — фон аккордеона (null — прозрачный, в кружке шахматка), marker — акцент 1, accent2 — акцент 2, pv — цвета превью.
  // Аккордеон прозрачный, лежит на фоне страницы. Наведение и выбранный пункт — лёгкий оттенок акцента темы, не серый.
  // Цвета непрозрачные: под командами ✎ ⋮ текст пункта должен закрываться.
  const light = (hover, selected) => ({
    '--acc-under': 'transparent', '--acc-item-hover': hover, '--acc-item-selected': selected, '--lw-bird-bg': 'transparent',
    '--acc-text': '#000', '--acc-icon': '#8991a9', '--acc-weight': '400', '--acc-cmd-dots': '#8991a9', '--acc-cmd-hover': '#333',
    '--acc-plus': '#8991a9', '--acc-plus-hover': '#333', '--acc-plus-hover-bg': 'rgba(0, 0, 0, .05)',
    '--acc-burger-hover': hover, '--acc-bird-hover': hover, '--submenu-bg': '#fff', '--submenu-item-hover': selected,
  });
  const GRAY = { // светло-серый аккордеон, тёмный текст
    '--acc-text': '#333', '--acc-icon': '#7b797a', '--acc-label': '#8c8c8c', '--acc-weight': '400', '--acc-cmd-dots': '#7b797a', '--acc-cmd-hover': '#000',
    '--acc-plus': '#7b797a', '--acc-plus-hover': '#000', '--acc-plus-hover-bg': 'rgba(0, 0, 0, .06)', '--submenu-bg': '#fff', '--submenu-item-hover': '#f0f0f0',
  };
  const PV_LIGHT = { title: '#d6d6d6', line: '#d7d7d7', icon: '#d0dce6', iconSel: '#d0dce6' };
  const PV_DARK = { title: '#e9ebec', line: '#6b7884', icon: '#98b2ca', iconSel: '#fff' };
  const PV_GRAY = { title: '#666', line: '#ccc', icon: '#7b797a', iconSel: '#7b797a' };
  const DARK_PAGE = { // тёмная страница: карточки, текст, скелетон
    '--c-surface': '#23303e', '--c-text': '#e9ebec', '--c-text-strong': '#e9ebec', '--c-name': '#a9bfd9', '--c-name2': '#8fb4e8', '--c-sum': '#c9d3e8',
    '--c-label': '#9aa6b4', '--c-link': '#6fa8ec', '--c-border': '#34465a', '--c-divider': '#34465a', '--c-row': '#2b3a4a',
    '--c-sk': '#34465a', '--c-sk-row': '#2b3a4a', '--c-sk-pic': '#2b3a4a',
  };
  const THEMES = [
    { id: 'blue', acc: null, marker: '#0c94ff', accent2: '#cc3d00', bg: 'linear-gradient(#f2f9ff, #f8f8f8 27.546%)', vars: light('#e8f1fb', '#eef5fd'), pv: { ...PV_LIGHT, sel: '#eef5fd' } },
    { id: 'pink', acc: null, marker: '#ff4567', accent2: '#f6733c', bg: 'linear-gradient(#fff2f4, #f8f8f8 27.546%)', vars: light('#fbe9ed', '#fdf1f3'), pv: { ...PV_LIGHT, sel: '#fdf1f3' } },
    // под ЦУ — свой фон (Figma 16288:199296)
    { id: 'dark', acc: '#2c3e50', marker: '#0c94ff', accent2: '#cc3d00', vars: { '--cu-bg': '#ecedee' }, pv: PV_DARK },
    { id: 'gray-blue', acc: '#e9e9e9', marker: '#357ed0', accent2: '#cc3d00', vars: { ...GRAY, '--acc-item-hover': '#f2f2f2', '--acc-item-selected': '#dedede', '--acc-burger-hover': '#dedede', '--acc-bird-hover': '#dedede' }, pv: PV_GRAY },
    { id: 'night', acc: '#050620', marker: '#71d186', accent2: '#f6733c',
      vars: { '--acc-item-hover': '#222b47', '--acc-item-selected': '#161e34', '--acc-cmd-dots': '#6b7c99', '--acc-burger-hover': '#161e34', '--acc-bird-hover': '#222b47', '--submenu-bg': '#222b47', '--submenu-item-hover': '#2f3a5a' },
      pv: { ...PV_DARK, line: '#505062', sel: '#161e34' } },
    { id: 'gray-pink', acc: '#e9e9e9', marker: '#ff4567', accent2: '#ff4567', vars: { ...GRAY, '--acc-item-hover': '#f2f2f2', '--acc-item-selected': '#dedede', '--acc-burger-hover': '#dedede', '--acc-bird-hover': '#dedede' }, pv: { ...PV_GRAY, title: '#ff4567' } },
    { id: 'gray-red', acc: '#f0f0f0', marker: '#cd3238', accent2: '#df1c33', vars: { ...GRAY, '--acc-item-hover': '#f8f8f8', '--acc-item-selected': '#e5e5e5', '--acc-burger-hover': '#e5e5e5', '--acc-bird-hover': '#e5e5e5' }, pv: { ...PV_GRAY, title: '#787878', line: '#d0d0d0' } },
    { id: 'dark-full', acc: '#2c3e50', marker: '#0c93fe', accent2: '#ffcc99', bg: '#1d2834', vars: DARK_PAGE, pv: { ...PV_DARK, card: '#23303e', box: '#2b3a4a', top: '#2b3a4a' } },
    { id: 'graphite', acc: '#323232', marker: '#962147', accent2: '#962147',
      vars: { '--acc-item-hover': '#404040', '--acc-item-selected': '#222', '--acc-bird': '#fff', '--acc-bird-bg': '#962147', '--acc-text': '#e6e6e6', '--acc-icon': '#9c9c9c', '--acc-label': '#8c8c8c',
        '--acc-cmd-dots': '#7a7a7a', '--acc-plus': '#9c9c9c', '--acc-burger-hover': '#2a2a2a', '--acc-bird-hover': '#404040', '--submenu-bg': '#404040', '--submenu-item-hover': '#4e4e4e' },
      pv: { title: '#e6e6e6', line: '#414141', icon: '#9c9c9c', iconSel: '#fff', sel: '#222' } },
    { id: 'mint', acc: '#d8e1e2', marker: '#00282c', accent2: '#00282c',
      vars: { '--acc-item-hover': '#cfdadb', '--acc-item-selected': '#e6ecee', '--acc-text': '#1b3e42', '--acc-icon': '#3d5b5e', '--acc-label': '#5d7a7d', '--acc-weight': '400',
        '--acc-cmd-dots': '#5d7a7d', '--acc-cmd-hover': '#00282c', '--acc-plus': '#3d5b5e', '--acc-plus-hover': '#00282c', '--acc-plus-hover-bg': 'rgba(0, 40, 44, .08)',
        '--acc-burger-hover': '#cfdadb', '--acc-bird-hover': '#cfdadb', '--submenu-bg': '#eef3f3', '--submenu-item-hover': '#d8e1e2' },
      pv: { title: '#1b3e42', line: '#98aaac', icon: '#00282c', iconSel: '#00282c', sel: '#e6ecee' } },
  ];
  const DEFAULT_BG = '#f8f8f8';
  // Все токены, которые задаёт хоть одна тема, — чтобы при смене темы сбросить прежние.
  const THEME_PROPS = [...new Set(THEMES.flatMap((t) => Object.keys(themeVars(t))))];
  let themeId = 'dark';

  // Свои цвета из окна выбора цвета (клик на кружок в шапке): {hex, a} поверх выбранной темы; смена темы их сбрасывает.
  // Не заданный цвет аккордеона (hex: null) — прозрачный. Для плашек тем custom пуст — они рисуются как есть.
  let custom = {};
  const toCss = (c) => {
    if (!c || !c.hex) return null;
    if (c.a >= 100) return c.hex;
    const [r, g, b] = hexRgb(c.hex);
    return `rgba(${r}, ${g}, ${b}, ${+(c.a / 100).toFixed(2)})`;
  };
  function hexRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = [...h].map((x) => x + x).join('');
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  function mixHex(a, b, k) {
    const rb = hexRgb(b);
    return '#' + hexRgb(a).map((x, i) => Math.round(x + (rb[i] - x) * k).toString(16).padStart(2, '0')).join('');
  }
  // Токены аккордеона под свой цвет: светлый — тёмный текст и серые оттенки, тёмный — белый текст по умолчанию, прозрачный — как «светлые» темы.
  function accVars(c, marker) {
    const { hex, a } = c;
    // прозрачный, почти прозрачный или белое забеление (фон-картинка, Figma «Тема аккордеона» / image) — как светлые темы
    if (!hex || a < 50 || (hex === '#ffffff' && a < 100)) return light(mixHex(marker, '#ffffff', .9), mixHex(marker, '#ffffff', .94));
    const [r, g, b] = hexRgb(hex);
    if ((.299 * r + .587 * g + .114 * b) / 255 > .6) {
      const h = mixHex(hex, '#000000', .04), sel = mixHex(hex, '#000000', .1);
      return { ...GRAY, '--acc-item-hover': h, '--acc-item-selected': sel, '--acc-burger-hover': sel, '--acc-bird-hover': sel, '--submenu-item-hover': sel };
    }
    const hov = mixHex(hex, '#ffffff', .12), sel = mixHex(hex, '#000000', .2);
    return { '--acc-item-hover': hov, '--acc-item-selected': sel, '--acc-burger-hover': sel, '--acc-bird-hover': hov, '--submenu-bg': mixHex(hex, '#ffffff', .1), '--submenu-item-hover': hov };
  }
  const baseColor = (c) => (c ? { hex: c, a: 100 } : { hex: null, a: 0 });
  function effColors(t, own = custom) {
    const e = { acc: t.acc, marker: t.marker, accent2: t.accent2, vars: t.vars };
    if (own.marker) e.marker = toCss(own.marker);
    if (own.accent2) e.accent2 = toCss(own.accent2);
    // свой фон — страница светлая: тёмные карточки темы «на всю страницу» не берём; аккордеон и фон под ЦУ остаются от темы
    if (own.bg) { e.bg = bgCss(own.bg); e.pvBg = bgPreview(own.bg); e.vars = Object.fromEntries(Object.entries(t.vars).filter(([k]) => !k.startsWith('--c-'))); }
    if (own.acc) {
      e.acc = toCss(own.acc);
      const page = Object.fromEntries(Object.entries(t.vars).filter(([k]) => (!own.bg && k.startsWith('--c-')) || k === '--cu-bg'));
      e.vars = { ...page, ...accVars(own.acc, own.marker ? own.marker.hex : t.marker) };
      // превью: цвета текста и иконок аккордеона под его новый фон
      e.pv = !e.vars['--acc-text'] ? PV_DARK : e.vars['--acc-text'] === '#000' ? { ...PV_LIGHT, sel: e.vars['--acc-item-selected'] } : PV_GRAY;
    }
    return e;
  }

  function themeVars(t, e = effColors(t, {})) {
    return {
      ...e.vars,
      '--acc-bg': e.acc ?? 'transparent', '--acc-marker': e.marker, '--accent2': e.accent2, '--content-bg': e.bg ?? t.bg ?? DEFAULT_BG,
    };
  }

  // Переменные превью: фон, аккордеон, текст и иконки аккордеона, маркер, акцент 2, карточка страницы.
  function pvStyle(t, e = effColors(t, {})) {
    const v = { ...themeVars(t, e) };
    const p = e.pv ?? t.pv;
    // фон-картинка: под страницей забеление 70%, как на сцене; аккордеон без цвета или белый 70% лежит на том же забелении
    const img = /^url\(/.test(e.pvBg ?? '');
    const veilAcc = img && (v['--acc-bg'] === 'transparent' || v['--acc-bg'] === 'rgba(255, 255, 255, 0.7)');
    const pv = {
      bg: e.pvBg ?? v['--content-bg'], veil: img ? 'rgba(255, 255, 255, .7)' : 'transparent', acc: veilAcc ? 'transparent' : v['--acc-bg'], sel: p.sel ?? v['--acc-item-selected'] ?? '#273748',
      bird: v['--acc-bird'] ?? e.marker, 'bird-bg': v['--acc-bird-bg'] ?? 'transparent',
      title: p.title, line: p.line, icon: p.icon, 'icon-sel': p.iconSel, marker: e.marker, accent2: e.accent2,
      card: p.card ?? '#fff', box: p.box ?? '#f4f4f4', top: p.top ?? '#fff',
    };
    return Object.entries(pv).map(([k, c]) => `--pv-${k}:${c}`).join(';');
  }

  // Превью 306×181: аккордеон (птичка, название, пункт, выбранный пункт с маркером) и страница (вкладка, карточка).
  function pvHTML(t, e) {
    return `<span class="tpv" style="${pvStyle(t, e)}">` +
      '<i class="tpv__veil"></i><i class="tpv__acc"></i><i class="tpv__bird">&#xE9E2;</i><i class="tpv__title"></i>' +
      '<i class="tpv__dot" style="top:46px"></i><i class="tpv__line" style="top:54px;width:60px"></i>' +
      '<i class="tpv__sel"></i><i class="tpv__mark"></i><i class="tpv__dot" style="top:79px;background:var(--pv-icon-sel)"></i>' +
      '<i class="tpv__line" style="top:87px;width:34px"></i><i class="tpv__line tpv__a2" style="top:87px;left:84px;width:10px"></i><i class="tpv__line tpv__a1" style="top:87px;left:98px;width:10px"></i>' +
      '<i class="tpv__tab"></i><i class="tpv__bar"></i><i class="tpv__sq" style="left:272.8px"></i><i class="tpv__sq" style="left:283.3px"></i>' +
      '<i class="tpv__sheet"></i><i class="tpv__box" style="left:148.6px;top:45.25px;width:35px;height:33.5px"></i>' +
      '<i class="tpv__box" style="left:188.8px;top:45.25px;width:101.4px;height:11.7px;border-radius:6px"></i>' +
      '<i class="tpv__box" style="left:188.8px;top:65.4px;width:101.4px;height:11.7px;border-radius:6px"></i>' +
      '<i class="tpv__box" style="left:148.6px;top:85.5px;width:141.6px;height:11.7px;border-radius:6px"></i>' +
      '</span>';
  }

  // Кружки темы: цвет аккордеона (прозрачный — шахматка), «Акцентный» (рыжий, accent2), «Акцентный 2» (синий, marker).
  const swatchList = (t) => [t.acc, t.accent2, t.marker];
  const COLOR_KEYS = ['acc', 'accent2', 'marker'];
  // Кружок в шапке: «нет цвета» — перечёркнутый, полупрозрачный — шахматка; клик открывает окно выбора цвета.
  const headSwatch = (c, key) => {
    const alpha = c && /^rgba/.test(c);
    return `<span class="swatch${c ? (alpha ? ' is-alpha' : '') : ' is-none'}" data-key="${key}"${c ? ` style="--c:${c}"` : ''}></span>`;
  };

  const themePanel = $('#themePanel');
  const themeBtn = $('#themeBtn');
  const tpGrid = $('#tpGrid');

  const tpUserGrid = $('#tpUserGrid');
  const tileHTML = (id, t, e = effColors(t, {})) =>
    `<button class="tp-tile" type="button" data-theme="${id}"><span class="tp-tile__wrap">` +
    `<span class="tp-tile__sw">${[e.acc, e.accent2, e.marker].map((c) => (c ? `<i${/^rgba/.test(c) ? ' class="is-alpha"' : ''} style="--c:${c}"></i>` : '<i class="is-none"></i>')).join('')}</span>` +
    `<span class="tp-tile__pv">${pvHTML(t, e)}</span>` +
    '<span class="tp-tile__check"><span class="ico24">&#xE616;</span></span></span></button>';
  tpGrid.innerHTML = THEMES.map((t) => tileHTML(t.id, t)).join('');

  // Пользовательская тема (Figma 18321:16888): одна; появляется, как только цвета перенастроены в окне выбора цвета,
  // и дальше обновляется при каждой перенастройке. Группа «Пользовательские» — над «Системными», плитка без подписи.
  // base — системная тема, поверх которой заданы свои цвета own. Выбор системной темы её не удаляет.
  let userTheme = null;
  const USER = 'user';
  const baseTheme = () => THEMES.find((x) => x.id === (themeId === USER ? userTheme.base : themeId));

  function renderUserTheme() {
    $('#tpUserGroup').hidden = tpUserGrid.hidden = !userTheme;
    if (!userTheme) { tpUserGrid.innerHTML = ''; return; }
    const t = THEMES.find((x) => x.id === userTheme.base);
    tpUserGrid.innerHTML = tileHTML(USER, t, effColors(t, userTheme.own));
    tpUserGrid.firstChild.classList.toggle('is-active', themeId === USER);
  }

  function applyTheme(id) {
    themeId = id;
    custom = id === USER ? { ...userTheme.own } : {};
    paintTheme();
    for (const b of tpGrid.children) b.classList.toggle('is-active', b.dataset.theme === id);
    renderUserTheme();
  }

  // Свои цвета изменены в окне выбора цвета: активной становится пользовательская тема.
  function saveUserTheme() {
    if (themeId !== USER) {
      userTheme = { base: themeId, own: {} };
      themeId = USER;
      for (const b of tpGrid.children) b.classList.remove('is-active');
    }
    userTheme.own = { ...custom };
    renderUserTheme();
  }

  // Красит страницу выбранной темой с учётом своих цветов (custom).
  function paintTheme() {
    const t = baseTheme();
    const e = effColors(t);
    for (const p of THEME_PROPS) stage.style.removeProperty(p);
    for (const [p, v] of Object.entries(themeVars(t, e))) stage.style.setProperty(p, v);
    $('#themeSwatches').innerHTML = [e.acc, e.accent2, e.marker].map((c, i) => headSwatch(c, COLOR_KEYS[i])).join('');
    paintBg(t);
    // по наведению — кнопка «Настроить» (Figma 16360:50515); клик — расширенные настройки
    $('#tpBig').innerHTML = pvHTML(t, e) + '<span class="tp-setup"><span class="ico24">&#xE660;</span>Настроить</span>';
  }

  function openThemePanel() {
    closeOtherWindows();
    themePanel.hidden = false;
    themeBtn.classList.add('is-active');
  }
  function closeThemePanel() {
    themePanel.hidden = true;
    themePanel.classList.remove('is-edit');
    themeBtn.classList.remove('is-active');
  }

  themeBtn.addEventListener('click', () => (themePanel.hidden ? openThemePanel() : closeThemePanel()));
  $('#tpDone').addEventListener('click', closeThemePanel);
  $('#tpClose').addEventListener('click', closeThemePanel);

  // Расширенные настройки темы (Figma 18846:22607): «Настроить» на большом превью → список цветов темы.
  // Пока ничего не кликается, только ховеры; «‹» возвращает к списку тем, ✓ закрывает панель. Кружки — картинки из макета.
  const THEME_COLORS = ['Акцентный', 'Акцентный 2', 'Дополнительный', 'Опасность', 'Успех', 'Предупреждение', 'Информирование', 'Текст',
    'Поверхности', 'Ссылки', 'Метки', 'Заголовки', 'Системные', 'Меню навигации', 'Расширенный набор цветов'];
  $('#tpColors').innerHTML = THEME_COLORS.map((name, i) =>
    `<div class="tp-color"><span class="tp-color__pv" style="background-image:url(assets/img/theme-colors/c${String(i + 1).padStart(2, '0')}.png)"></span>` +
    `<span class="tp-color__name">${name}</span><span class="tp-color__arrow"><span class="ico">&#xE9C2;</span></span></div>`).join('');
  $('#tpBig').addEventListener('click', (e) => { if (e.target.closest('.tp-setup')) themePanel.classList.add('is-edit'); });
  $('#tpBack').addEventListener('click', () => themePanel.classList.remove('is-edit'));

  // Информер «сегодня» в колонке панели: число и день недели.
  const today = new Date();
  $('#tpToday b').textContent = today.getDate();
  $('#tpToday small').textContent = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][today.getDay()];
  $('#tpEditDone').addEventListener('click', closeThemePanel);
  $('#themePanel .tp-card').addEventListener('click', (e) => {
    const tile = e.target.closest('.tp-tile');
    if (tile) applyTheme(tile.dataset.theme);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !bgWin.hidden) closeBgWin();
    else if (e.key === 'Escape' && !colorWin.hidden) closeColorWin();
    else if (e.key === 'Escape' && !themePanel.hidden) closeThemePanel();
  });

  // Окно выбора цвета (Figma 19278:31867, ховер 16369:59560, поле цвета 16385:66609): открывается по клику на кружок темы в шапке.
  // Цвет применяется к странице сразу и делает тему пользовательской; ✓ и ✕ закрывают окно и оставляют выбранное,
  // ↺ возвращает всё как было при открытии окна (тему, пользовательскую тему и цвет).
  const CW_TITLES = { acc: 'Меню навигации', accent2: 'Акцентный', marker: 'Акцентный 2' };
  const CW_ACC = [null, '#f0f0f0', '#f6eaf0', '#e9e9e9', '#d8e1e2', '#2c3e50', '#502c2c', '#402c50', '#323232', '#050620'];
  const CW_ACCENT = ['#943253', '#f16767', '#f6733c', '#e5cb45', '#009918', '#0c94ff', '#326194', '#4c3294', '#943288', '#999999',
    '#ffe3ec', '#ffe5e3', '#fff1e3', '#fffbe3', '#e3ffe8', '#e3faff', '#e3f1ff', '#eae3ff', '#ffe3fa', '#ededed'];
  const colorWin = $('#colorWin');
  const aeTheme = $('#aeTheme');
  const cwHex = $('#cwHex');
  const cwAlpha = $('#cwAlpha');
  const cwReset = $('#cwReset');
  let cwKey = null;
  let cwOrig;
  let cwSnap;

  const cwCurrent = () => custom[cwKey] ?? baseColor(baseTheme()[cwKey]);
  // Новый цвет: в custom, в пользовательскую тему и на страницу.
  function cwApply(c) {
    custom[cwKey] = c;
    saveUserTheme();
    paintTheme();
  }
  function cwSet(c) {
    if (JSON.stringify(c) === JSON.stringify(cwCurrent())) return;
    cwApply(c);
    cwRender(true);
  }
  // fields — обновить и поля ввода (не нужно, пока пользователь печатает в одном из них)
  function cwRender(fields) {
    const c = cwCurrent();
    const pill = $('#cwPill');
    pill.className = 'cw-pill' + (!c.hex ? ' is-none' : c.a < 100 ? ' is-alpha' : '');
    pill.style.setProperty('--c', toCss(c) ?? '#fff');
    if (fields) {
      cwHex.value = c.hex ? c.hex.slice(1).toUpperCase() : '';
      cwAlpha.value = c.hex ? c.a : 0;
    }
    cwReset.disabled = JSON.stringify(c) === JSON.stringify(cwOrig);
  }
  // anchor — кнопка, открывшая окно не из шапки (валик редактора аккордеона): окно встаёт по ней так же, как по кружку
  // в шапке — центр вызывающего элемента в точке (37, 22) окна, окно его накрывает
  function openColorWin(key, anchor) {
    closeOtherWindows();
    closePopups();
    cwKey = key;
    $('#cwTitle').textContent = CW_TITLES[key];
    $('#cwPresets').innerHTML = (key === 'acc' ? CW_ACC : CW_ACCENT).map((h) =>
      `<button class="cw-sw${h ? '' : ' is-none'}" type="button" data-hex="${h ?? ''}"${h ? ` style="--c:${h}"` : ''} aria-label="${h ?? 'Без цвета'}"></button>`).join('');
    cwOrig = cwCurrent();
    cwSnap = JSON.stringify({ themeId, userTheme });
    // окно — над своим кружком: левый край на 23px левее нажатого кружка
    const sw = stageRect(anchor ?? $(`#themeSwatches .swatch[data-key="${key}"]`));
    colorWin.hidden = false;
    colorWin.style.left = Math.round(Math.max(0, Math.min(sw.left + sw.width / 2 - 37, 1600 - colorWin.offsetWidth))) + 'px';
    colorWin.style.top = anchor ? Math.round(Math.max(0, sw.top + sw.height / 2 - 22)) + 'px' : '0';
    aeTheme.classList.toggle('is-active', !!anchor);
    cwRender(true);
  }
  function closeColorWin() { colorWin.hidden = true; cwKey = null; aeTheme.classList.remove('is-active'); }
  // валик в шапке редактора аккордеона — то же окно, что и первый кружок «Темы» (цвет аккордеона); повторный клик закрывает
  aeTheme.addEventListener('click', () => (aeTheme.classList.contains('is-active') ? closeColorWin() : openColorWin('acc', aeTheme)));

  $('#themeSwatches').addEventListener('click', (e) => {
    const sw = e.target.closest('.swatch');
    if (sw) openColorWin(sw.dataset.key);
  });
  $('#cwPresets').addEventListener('click', (e) => {
    const sw = e.target.closest('.cw-sw');
    if (!sw) return;
    // выбор цвета из палитры применяет его и сразу закрывает окно
    cwSet(sw.dataset.hex ? { hex: sw.dataset.hex, a: 100 } : { hex: null, a: 0 });
    closeColorWin();
  });
  cwHex.addEventListener('input', () => {
    const v = '#' + cwHex.value.trim().replace(/^#/, '');
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) {
      const hex = v.length === 4 ? '#' + [...v.slice(1)].map((x) => x + x).join('') : v;
      const c = cwCurrent();
      cwApply({ hex: hex.toLowerCase(), a: c.hex ? c.a : 100 });
      cwRender(false);
      cwAlpha.value = custom[cwKey].a;
    }
  });
  cwAlpha.addEventListener('input', () => {
    cwAlpha.value = cwAlpha.value.replace(/\D/g, '');
    if (cwAlpha.value === '') return;
    const a = Math.min(100, +cwAlpha.value);
    const c = cwCurrent();
    cwApply({ hex: c.hex ?? (a > 0 ? '#ffffff' : null), a });
    cwRender(false);
    if (!c.hex && a > 0) cwHex.value = 'FFFFFF';
  });
  for (const input of [cwHex, cwAlpha]) input.addEventListener('blur', () => cwRender(true));
  cwReset.addEventListener('click', () => {
    const snap = JSON.parse(cwSnap);
    userTheme = snap.userTheme;
    applyTheme(snap.themeId);
    cwRender(true);
  });
  $('#cwDone').addEventListener('click', closeColorWin);
  $('#cwClose').addEventListener('click', closeColorWin);

  // ---------- Фон (Figma 16385:63244, верхняя строка 16385:63266) ----------
  // Свой фон хранится в custom.bg и, как свои цвета, делает тему пользовательской; выбор системной темы возвращает фон темы.
  // Фон не меняет цвет аккордеона и фон под ЦУ — они остаются от темы (или свои). Картинка: под серединой и информерами
  // забеление 70%, поля по бокам — картинка как есть.
  // {kind: 'color', hex, a} · {kind: 'grad', c} — от акцента 10% к #f8f8f8 · {kind: 'img', i, fx} — fx: настройки «Картинки».
  const BG_GRADS = ['#943253', '#f16767', '#e59545', '#e5cb45', '#009918', '#0c94ff', '#326194', '#4c3294', '#943288'];
  const BG_COLORS = ['#ffe3ec', '#ffe5e3', '#fff1e3', '#fffbe3', '#e3ffe8', '#e3faff', '#e3f1ff', '#eae3ff', '#ffe3fa', '#ededed'];
  const BG_IMGS = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `assets/img/bg/0${n}.jpg`);
  const FX_DEFAULT = { op: 100, blur: 0, con: 100, sat: 100, temp: 0 };
  // Ползунки «Картинки»: диапазон и единица; 0 у контраста и насыщенности — серое / плоское, 100 — как в оригинале.
  const FX = [
    { key: 'op', name: 'Прозрачность', min: 0, max: 100, unit: '%' },
    { key: 'blur', name: 'Размытие', min: 0, max: 100, unit: '' },
    { key: 'con', name: 'Контраст', min: 0, max: 200, unit: '%' },
    { key: 'sat', name: 'Насыщенность', min: 0, max: 200, unit: '%' },
    { key: 'temp', name: 'Температура', min: -100, max: 100, unit: '' },
  ];
  const rgba = (hex, a) => `rgba(${hexRgb(hex).join(', ')}, ${a})`;
  const gradTop = (b) => (b.c ? rgba(b.c, .1) : b.top);

  function bgCss(b) {
    if (b.kind === 'img') return DEFAULT_BG; // картинка — отдельным слоем .content::before
    if (b.kind === 'grad') return `linear-gradient(${gradTop(b)}, rgba(248, 248, 248, 0) 27.546%), ${DEFAULT_BG}`;
    return b.a >= 100 ? b.hex : `linear-gradient(${toCss(b)}, ${toCss(b)}), #fff`;
  }
  // Кружок в шапке, плашка в окне и превью темы
  function bgPreview(b) {
    if (b.kind === 'img') return `url(${BG_IMGS[b.i]}) center / cover`;
    if (b.kind === 'grad') return `linear-gradient(${gradTop(b)}, rgba(248, 248, 248, 0)), ${DEFAULT_BG}`;
    return bgCss(b);
  }
  // Текущий фон: свой или фон темы (градиент темы «Голубая» / «Розовая» — начало градиента из её bg)
  function curBg() {
    if (custom.bg) return custom.bg;
    const bg = baseTheme().bg ?? DEFAULT_BG;
    const m = /^linear-gradient\((#[0-9a-f]{6})/i.exec(bg);
    return m ? { kind: 'grad', top: m[1] } : { kind: 'color', hex: bg, a: 100 };
  }

  function paintBg(t) {
    const b = curBg();
    const img = b.kind === 'img';
    const sw = $('#bgSwatch');
    sw.className = 'swatch' + (img ? ' is-img' : b.kind === 'color' && b.a < 100 ? ' is-alpha' : '');
    sw.style.setProperty('--c', img ? `url(${BG_IMGS[b.i]})` : custom.bg ? bgPreview(b) : t.bg ?? DEFAULT_BG);
    stage.classList.toggle('is-bg-img', img);
    // аккордеон белый 70%, как задаёт картинка (не перекрашен), — его забеление входит в общий слой под контентом (styles.css).
    // Аккордеон без цвета лежит на том же забелении, что и контент: картинка под ним тоже под белым 70%.
    const acc = custom.acc ?? baseColor(t.acc);
    const clear = !acc.hex || acc.a === 0;
    stage.classList.toggle('is-acc-veil', img && (clear || (acc.hex === '#ffffff' && acc.a === 70)));
    stage.classList.toggle('is-acc-clear', img && clear);
    if (!img) { for (const p of ['--bg-img', '--bg-op', '--bg-filter', '--bg-tint']) stage.style.removeProperty(p); return; }
    const f = b.fx;
    // температура: тёплый или холодный оттенок поверх картинки (soft-light)
    const tint = f.temp > 0 ? `255, 140, 0, ${(f.temp / 100 * .6).toFixed(2)}` : `0, 110, 255, ${(-f.temp / 100 * .6).toFixed(2)}`;
    stage.style.setProperty('--bg-img', `url(${BG_IMGS[b.i]})`);
    stage.style.setProperty('--bg-op', f.op / 100);
    stage.style.setProperty('--bg-filter', `blur(${f.blur / 5}px) contrast(${f.con}%) saturate(${f.sat}%)`);
    stage.style.setProperty('--bg-tint', `linear-gradient(rgba(${tint}), rgba(${tint}))`);
  }

  const bgWin = $('#bgWin');
  const bgBtn = $('#bgBtn');
  const bgHex = $('#bgHex');
  const bgAlpha = $('#bgAlpha');
  $('#bgPresets').innerHTML =
    BG_GRADS.map((c) => `<button class="cw-sw is-grad" type="button" data-grad="${c}" style="--c:${rgba(c, .1)}" aria-label="Градиент"></button>`).join('') +
    [DEFAULT_BG, ...BG_COLORS].map((h) => `<button class="cw-sw" type="button" data-hex="${h}" style="--c:${h}" aria-label="${h}"></button>`).join('');
  $('#bgCat').innerHTML = BG_IMGS.map((src, i) =>
    `<button class="bg-tile" type="button" data-img="${i}" style="--img:url(${src})" aria-label="Картинка ${i + 1}"><span class="bg-tool"><span class="ico">&#xE660;</span></span></button>`).join('');

  // Новый фон: аккордеон не трогаем; тема становится пользовательской.
  function setBg(b) {
    custom.bg = b;
    saveUserTheme();
    paintTheme();
    bgRender(true);
  }
  // Настройки картинки меняются без сброса аккордеона
  function setFx(key, v, typed) {
    custom.bg = { ...custom.bg, fx: { ...custom.bg.fx, [key]: v } };
    saveUserTheme();
    paintTheme();
    fxRender(typed ? key : null);
  }

  function bgRender(fields) {
    const b = curBg();
    bgWin.dataset.kind = b.kind;
    const pill = $('#bgPill');
    pill.className = 'cw-pill' + (b.kind === 'img' ? ' is-img' : '');
    pill.style.setProperty('--c', b.kind === 'img' ? `url(${BG_IMGS[b.i]})` : bgPreview(b));
    if (b.kind === 'grad') $('#bgGradFrom').textContent = (b.c ? mixHex(DEFAULT_BG, b.c, .1) : b.top).slice(1).toUpperCase();
    if (fields && b.kind === 'color') { bgHex.value = b.hex.slice(1).toUpperCase(); bgAlpha.value = b.a; }
  }

  // «Картинка»: превью и ползунки
  $('#bgFx').innerHTML = FX.map((x) =>
    `<div class="bg-row" data-fx="${x.key}"><span class="bg-row__label">${x.name}</span>` +
    '<span class="bg-slider"><i class="bg-slider__fill"></i><i class="bg-slider__thumb"></i></span>' +
    `<span class="bg-num${x.unit ? '' : ' no-unit'}"><input type="text" inputmode="numeric" autocomplete="off" maxlength="4" aria-label="${x.name}"><span>${x.unit}</span></span></div>`).join('');
  function fxRender(skipInput) {
    const f = custom.bg.fx;
    for (const x of FX) {
      const row = $(`[data-fx="${x.key}"]`, bgWin);
      row.style.setProperty('--k', (f[x.key] - x.min) / (x.max - x.min));
      if (skipInput !== x.key) $('input', row).value = f[x.key];
    }
  }
  function openPic() {
    if (custom.bg?.kind !== 'img') return;
    bgWin.classList.add('is-pic');
    $('#bgTitle').textContent = 'Картинка';
    $('#bgPicPv').style.setProperty('--img', `url(${BG_IMGS[custom.bg.i]})`);
    fxRender();
  }
  function closePic() {
    bgWin.classList.remove('is-pic');
    $('#bgTitle').textContent = 'Фон';
  }

  function openBgWin() {
    closeOtherWindows();
    closePopups();
    closePic();
    bgRender(true);
    // окно встаёт левым краем по левому краю кнопки «Фон», верх — по верху шапки
    const r = stageRect(bgBtn);
    bgWin.hidden = false;
    bgWin.style.left = Math.round(r.left) + 'px';
    bgWin.style.top = '0';
    bgBtn.classList.add('is-active');
  }
  function closeBgWin() {
    bgWin.hidden = true;
    bgBtn.classList.remove('is-active');
  }

  bgBtn.addEventListener('click', () => (bgWin.hidden ? openBgWin() : closeBgWin()));
  $('#bgDone').addEventListener('click', closeBgWin);
  $('#bgClose').addEventListener('click', closeBgWin);
  $('#bgBack').addEventListener('click', closePic);
  $('#bgPresets').addEventListener('click', (e) => {
    const sw = e.target.closest('.cw-sw');
    if (!sw) return;
    // заготовленный цвет или градиент применяется и сразу закрывает окно; картинка — нет (у неё есть настройки)
    setBg(sw.dataset.grad ? { kind: 'grad', c: sw.dataset.grad } : { kind: 'color', hex: sw.dataset.hex, a: 100 });
    closeBgWin();
  });
  // клик по картинке — поставить её фоном (настройки сбрасываются для новой картинки); карандаш на картинке — ещё и открыть «Картинку»
  $('#bgCat').addEventListener('click', (e) => {
    const tile = e.target.closest('.bg-tile');
    if (!tile) return;
    const i = +tile.dataset.img;
    if (!(custom.bg?.kind === 'img' && custom.bg.i === i)) setBg({ kind: 'img', i, fx: { ...FX_DEFAULT } });
    if (e.target.closest('.bg-tool')) openPic();
  });
  bgHex.addEventListener('input', () => {
    const v = '#' + bgHex.value.trim().replace(/^#/, '');
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return;
    const hex = (v.length === 4 ? '#' + [...v.slice(1)].map((x) => x + x).join('') : v).toLowerCase();
    const b = curBg();
    setBg({ kind: 'color', hex, a: b.kind === 'color' ? b.a : 100 });
  });
  bgAlpha.addEventListener('input', () => {
    bgAlpha.value = bgAlpha.value.replace(/\D/g, '');
    if (bgAlpha.value === '') return;
    const b = curBg();
    setBg({ kind: 'color', hex: b.hex, a: Math.min(100, +bgAlpha.value) });
  });
  for (const input of [bgHex, bgAlpha]) input.addEventListener('blur', () => bgRender(true));

  // Ползунки: нажатие и перетаскивание; поле справа — ввод числа
  $('#bgFx').addEventListener('pointerdown', (e) => {
    const slider = e.target.closest('.bg-slider');
    if (!slider) return;
    const x = FX.find((f) => f.key === slider.parentNode.dataset.fx);
    const move = (ev) => {
      const r = slider.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      const v = Math.round(x.min + k * (x.max - x.min));
      if (v !== custom.bg.fx[x.key]) setFx(x.key, v);
    };
    slider.setPointerCapture(e.pointerId);
    move(e);
    slider.onpointermove = move;
    slider.onpointerup = slider.onpointercancel = () => { slider.onpointermove = slider.onpointerup = slider.onpointercancel = null; };
  });
  $('#bgFx').addEventListener('input', (e) => {
    const row = e.target.closest('[data-fx]');
    const x = FX.find((f) => f.key === row.dataset.fx);
    const input = e.target;
    input.value = input.value.replace(x.min < 0 ? /[^\d-]/g : /\D/g, '');
    if (!/^-?\d+$/.test(input.value)) return;
    setFx(x.key, Math.min(x.max, Math.max(x.min, +input.value)), true);
  });
  $('#bgFx').addEventListener('focusout', () => { if (custom.bg?.kind === 'img') fxRender(); });

  // ---------- Отмена / повтор в шапке конструктора ----------
  // История — снимки всего, что пользователь меняет на странице: вид аккордеона, логотип, позиционирование, «Информеры»,
  // тема и свои цвета / фон, вкладки, разделы (после ✓ редактора подменю). Шаг записывается после действия пользователя
  // (клик, отпускание ползунка, Enter / Esc, уход фокуса); ввод в поля — одним шагом после паузы.
  // Новый шаг отбрасывает шаги «вперёд». Пока открыт редактор подменю, шапка под его подложкой — у него своя история.
  const undoBtn = $('#undoBtn'), redoBtn = $('#redoBtn');
  const INPUT_PAUSE = 500;
  let hist = [], histAt = 0, inputTimer = null;

  // Только изменения: свёрнут ли аккордеон, какая вкладка активна, что выделено и какие окна открыты — не пишется.
  const snapshot = () => JSON.stringify({
    submenuTrigger: settings.submenuTrigger,
    logo, align: state.align, informers: state.informers, themeId, userTheme,
    tabs, tabsAdded: stage.classList.contains('tabs-added'),
    sections: SECTIONS.map((s) => ({ id: s.id, title: s.title, short: s.short, customIcon: s.customIcon ?? null, pinned: !!s.pinned,
      head: s.submenu.head ?? null, headRight: s.submenu.headRight ?? null, noHead: !!s.submenu.noHead, cols: s.submenu.cols })),
  });

  function renderHistory() {
    undoBtn.disabled = histAt === 0;
    redoBtn.disabled = histAt === hist.length - 1;
  }
  // Есть несохранённые правки: снимок отличается от начала истории (недописанный ввод — сначала записать).
  function pageDirty() {
    record();
    return snapshot() !== hist[0];
  }
  function resetHistory() {
    hist = [snapshot()];
    histAt = 0;
    renderHistory();
  }
  function record() {
    clearTimeout(inputTimer);
    const snap = snapshot();
    if (snap === hist[histAt]) return;
    hist = hist.slice(0, histAt + 1);
    hist.push(snap);
    histAt = hist.length - 1;
    renderHistory();
  }

  function restore(snap) {
    const s = JSON.parse(snap);
    if (tw) closeTabsWin();
    closePopups();
    closeSubmenu();
    // открытие подменю (окно «Меню»); вид панели — свёрнута / раскрыта / узкая — не трогаем
    settings.submenuTrigger = s.submenuTrigger;
    applyView();
    renderWin();
    setLogo(s.logo);
    setAlign(s.align);
    if (s.informers !== state.informers) informers.click();
    // тема: системная или пользовательская со своими цветами и фоном; открытые окна цвета и фона — по новым цветам
    userTheme = s.userTheme;
    applyTheme(s.themeId);
    if (!colorWin.hidden) cwRender(true);
    if (!bgWin.hidden) {
      if (custom.bg?.kind === 'img') { $('#bgPicPv').style.setProperty('--img', `url(${BG_IMGS[custom.bg.i]})`); fxRender(); }
      else closePic();
      bgRender(true);
    }
    // вкладки
    // активная вкладка остаётся, если она есть в восстановленных
    tabs = s.tabs;
    if (!findTab(activeTab)) activeTab = tabs[0].id;
    stage.classList.toggle('tabs-added', s.tabsAdded);
    if (!s.tabsAdded) selectTabs(false);
    renderTabs();
    // разделы; открытый пункт подменю, которого больше нет, снимается
    // список разделов — по снимку (добавленные в «Настройке аккордеона» уходят и возвращаются)
    SECTIONS.splice(0, SECTIONS.length, ...s.sections.map((d) => ALL_SECTIONS[d.id]));
    if (state.page.section && !SECTIONS.some((x) => x.id === state.page.section)) { state.page = { section: null, item: null }; updatePage(); }
    SECTIONS.forEach((sec, i) => {
      const d = s.sections[i];
      Object.assign(sec, { title: d.title, short: d.short, customIcon: d.customIcon, pinned: d.pinned });
      Object.assign(sec.submenu, { head: d.head ?? undefined, headRight: d.headRight ?? undefined, noHead: d.noHead, cols: d.cols });
    });
    const { section, item } = state.page;
    if (section && item != null && !subItem(SECTIONS.find((x) => x.id === section), item)) state.page.item = null;
    renderAccordion();
  }

  function goGlobal(step) {
    record(); // недописанный ввод — отдельным шагом
    const at = histAt + step;
    if (at < 0 || at >= hist.length) return;
    histAt = at;
    restore(hist[at]);
    renderHistory();
  }
  undoBtn.addEventListener('click', () => goGlobal(-1));
  redoBtn.addEventListener('click', () => goGlobal(1));

  // Перехват на фазе погружения: обработчики, останавливающие событие, не мешают записи; запись — после них.
  const later = () => setTimeout(record);
  for (const type of ['click', 'pointerup', 'focusout']) document.addEventListener(type, later, true);
  document.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Delete') later(); }, true);
  document.addEventListener('input', () => { clearTimeout(inputTimer); inputTimer = setTimeout(record, INPUT_PAUSE); }, true);

  // ---------- Точка захода в редактор: «Админка (Inside)», «Аккаунт», «Пользователь» ----------
  // Экран приложения (Figma xMQ3ZEN4AUINgwjVoxR8hS: админка 18428:12935, панель «Online» 19470:56425, аккаунт 19523:72338,
  // пользователь из настроек 19523:73629) поверх конструктора; превью на экранах красится токенами темы со сцены, логотип и надпись —
  // как в аккордеоне. «С главной» (18398:16347) — сама сцена как приложение (.stage.is-runtime), вход — «4 квадратика».
  // «Настроить» открывает конструктор (редактор), ✓ шапки — сохранить и вернуться, ✕ — вернуться; если были правки,
  // сначала «Сохранить изменения?»: «Да» — как ✓, «Нет» — откатить правки этого захода, «Отмена» — остаться в редакторе.
  const screenEntry = (sec) => ({
    trigger: sec.querySelector('.ins-setup'),
    show() {
      for (const b of sec.querySelectorAll('.ipv__bird')) b.innerHTML = logoHTML();
      for (const l of sec.querySelectorAll('.ipv__logo')) l.innerHTML = $('#goHome').innerHTML;
      // вид аккордеона со сцены: узкий (с названиями / без названий / панель) — в превью тоже узкий
      for (const v of sec.querySelectorAll('.ipv')) {
        v.classList.toggle('is-narrow', isNarrow());
        v.classList.toggle('is-labels', isNarrow() && settings.narrowView === 'labels');
      }
      sec.hidden = false;
    },
    hide() { sec.hidden = true; },
  });
  const runtimeEntry = {
    trigger: $('#infApps'),
    show() {
      closePopups();
      selectTabs(false);
      if (state.page.section) { state.page = { section: null, item: null }; updatePage(); renderAccordion(); } // дашборд — Главная
      stage.classList.add('is-runtime');
    },
    hide() { stage.classList.remove('is-runtime'); },
  };
  // ключ — сценарий или «сценарий:вилка»
  const ENTRIES = {
    'editor-inside': screenEntry($('#inside')), 'editor-account': screenEntry($('#account')),
    'editor-user:settings': screenEntry($('#userSettings')), 'editor-user:main': runtimeEntry,
  };
  let entry = null;      // точка захода текущего сценария; null — другой сценарий
  let insideSnap = null; // снимок при входе в редактор с экрана; null — редактор открыт не с экрана
  let insideAsk = false; // подтверждение открыто ✕ шапки в сценарии захода

  function showInside() {
    setMobile(false); // экран приложения и «С главной» — десктопные; мобильный вид — только в конструкторе
    closeOtherWindows();
    closeSubmenu();
    insideSnap = null;
    entry.show();
  }
  function setInside(scenario) {
    insideAsk = false;
    smeConfirm.hidden = true;
    for (const e of Object.values(ENTRIES)) e.hide();
    insideSnap = null;
    entry = ENTRIES[scenario] ?? null;
    if (entry) showInside();
  }
  function answerInsideConfirm(answer) {
    smeConfirm.hidden = true;
    insideAsk = false;
    if (answer === 'cancel') return;
    if (answer === 'no') restore(insideSnap);
    resetHistory();
    showInside();
  }

  for (const e of Object.values(ENTRIES)) {
    e.trigger.addEventListener('click', () => {
      e.hide();
      resetHistory(); // отмена в редакторе — только в пределах этого захода
      insideSnap = snapshot();
    });
  }
  $('.ctor-header .done-btn').addEventListener('click', () => {
    // «Общее демо»: ✓ сохраняет настройки и уводит на сценарий захода из админки
    if (stage.dataset.scenario === 'demo') { frame.select('editor-inside'); return; }
    if (insideSnap === null) return;
    record();
    resetHistory();
    showInside();
  });
  $('.ctor-header .close-btn').addEventListener('click', () => {
    if (insideSnap === null) return;
    record();
    if (snapshot() === insideSnap) { resetHistory(); showInside(); return; }
    closeOtherWindows();
    insideAsk = true;
    smeConfirm.hidden = false;
  });

  applyTheme(themeId);
  renderAccordion();
  applyView();
  resetHistory();
})();
