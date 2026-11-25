# Briaton — каталог товаров

Учебный интернет-магазин освещения: каталог светильников с фильтрами, сортировкой, поиском, пагинацией, избранным и корзиной на `localStorage`.

## Технологии

- **HTML5** — семантическая разметка
- **SCSS / CSS** — стили (компиляция через `sass`)
- **JavaScript (ES-модули)** — вся логика без фреймворков
- **LocalStorage** — хранение избранного и корзины
- **Сторонние библиотеки:**
  - [Swiper 11](https://swiperjs.com/) — слайдер «Товары дня»
  - [JustValidate](https://github.com/horprogs/Just-validate) — валидация формы
  - [Tippy.js](https://atomiks.github.io/tippyjs/) + [Popper.js](https://popper.js.org/) — подключены, но в текущей реализации тултипы самописные (см. «Известные особенности»)

## Структура проекта

stud-proj/
├── catalog.html              # Страница каталога
├── favorites.html            # Страница избранного
├── css/
│   ├── style.css             # Скомпилированные стили (подключены в HTML)
│   ├── style.css.map
│   ├── swiper.css            # Не подключены (стили уже в style.css)
│   ├── swiper.css.map
│   ├── tippy.css             # Не подключены (стили уже в style.css)
│   └── tippy.css.map
├── scss/
│   ├── style.scss            # Точка входа SCSS
│   ├── vendor/
│   │   ├── swiper.scss
│   │   └── tippy.scss
│   ├── global/
│   │   ├── _normalize.scss
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _fonts.scss
│   │   ├── _reboot.scss
│   │   ├── _container.scss
│   │   └── _visually-hidden.scss
│   └── blocks/
│       ├── _btn.scss
│       ├── _btn-close.scss
│       ├── _header.scss
│       ├── _location.scss
│       ├── _basket.scss
│       ├── _breadcrumbs.scss
│       ├── _main-menu.scss
│       ├── _catalog.scss
│       ├── _catalog-form.scss
│       ├── _custom-checkbox.scss
│       ├── _custom-radio.scss
│       ├── _product-card.scss
│       ├── _tooltip.scss
│       ├── _day-products.scss
│       ├── _description.scss
│       ├── _faq.scss
│       ├── _accordion.scss
│       ├── _questions.scss
│       ├── _custom-input.scss
│       ├── _footer.scss
│       ├── _message.scss
│       ├── _notification.scss
│       ├── _favorite.scss
│       └── _favorites.scss
├── data/
│   └── data.json             # Данные товаров (20 позиций)
├── fonts/                    # Noto Sans (Regular, Medium, SemiBold, Bold) — woff2 + woff
├── images/
│   ├── sprite.svg            # SVG-спрайт иконок
│   ├── item-1.png … item-16.png
│   └── lamp.png
├── js/
│   ├── main.js               # Точка входа
│   ├── components/
│   │   ├── accordion.js
│   │   ├── basket.js
│   │   ├── cardRenderer.js
│   │   ├── dayProducts.js
│   │   ├── dropDownMenus.js
│   │   ├── favorites.js
│   │   ├── favorites-page.js
│   │   ├── filters.js
│   │   ├── formValidation.js
│   │   ├── pagination.js
│   │   ├── products.js
│   │   ├── search.js
│   │   └── tooltip.js
│   ├── services/
│   │   └── productsAPI.js
│   └── vendor/
│       ├── swiper.js
│       ├── just-validate.js
│       ├── popprjs.min.js
│       └── tippy.min.js
└── package.json

## Запуск проекта

### 1. Установка зависимостей

npm install

### 2. Компиляция стилей (watch-режим)

npm run watch

Или разово:

npx sass scss/style.scss css/style.css

### 3. Запуск локального сервера

Проект **должен** открываться через локальный сервер (не через `file://`), иначе не загрузятся `data.json` и модули.

Варианты:
- **VS Code Live Server** — установите расширение и нажмите «Go Live».
- **Python:**
  python -m http.server 5500
- **Node.js:**
  npx http-server

Затем откройте `http://localhost:5500/catalog.html`.

## Функциональность

### Каталог
- **Фильтрация** по типу светильника (чекбоксы: подвесные, потолочные, накладные, точечные, ночники) и статусу наличия (радио).
- **Сортировка** по популярности и цене (select).
- **Поиск** по названию с debounce (300 мс).
- **Пагинация** — 6 товаров на страницу.
- **Кнопка сброса** всех фильтров и сортировки.
- **Наличие по городам** — фильтр «В наличии» учитывает выбранный город (Москва / Оренбург / Санкт-Петербург), счётчики в чекбоксах тоже пересчитываются.

### Избранное
- Добавление/удаление по кнопке-сердечку на карточке.
- Счётчик в шапке.
- Отдельная страница `favorites.html` с пустым состоянием.
- Хранение в `localStorage` под ключом `favorites`.

### Корзина
- Добавление товара из карточки (кнопка «В корзину»).
- Изменение количества (`+` / `−`), удаление товара, очистка корзины.
- Подсчёт суммы и общего количества.
- Выпадающее меню корзины в шапке.
- Уведомление о добавлении товара (2 с).
- Хранение в `localStorage` под ключом `basket`.

### Дополнительно
- **Товары дня** — Swiper-слайдер с адаптивными брейкпоинтами (768 / 1024 / 1200).
- **FAQ-аккордеон** — одновременно открыт только один элемент.
- **Валидация формы** обратной связи (`JustValidate`) + модальное окно с результатом отправки.
- **Тултипы** наличия товара по городам при наведении (самописные, на `mouseenter` / `mouseleave`).
- **Меню каталога**, **выбор города**, **дропдаун корзины** — с закрытием по клику вне, по `ESC` и по крестику.

## Соглашения по коду

- **БЭМ** для классов (`block__element--modifier`).
- Модули разделены по ответственности: `products`, `filters`, `basket`, `favorites` и т.д.
- Циклические зависимости обходятся **динамическими импортами** (например, `products.js` → `basket.js`).
- Все данные о товарах — в `data/data.json`, доступ через `productsAPI`.
- Переменные SCSS: цвета, шрифт `$ff-mulish` (фактически Noto Sans), брейкпоинты `$vp-tablet` / `$vp-mobile`, `$transition`.

## Примечания

Проект содержит более расширенный функционал по сравнению с базовым ТЗ курсовой работы по курсу JavaScript учебной платформы Skillbox. Дальнейшая работа над проектом прекращена, по причине неактуальности в настоящее время используемых в данной работе инструментов. 



## Автор

Андрей Пушкин — студент Skillbox, курсовой проект по JavaScript.