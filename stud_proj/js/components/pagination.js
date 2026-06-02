import { updateTooltips } from "./tooltip.js";

// Пагинация для каталога товаров

let currentPage = 1; // текущая страница 
const itemsPerPage = 6; // кол-во товаров на странице
let totalItems = 0; // общее количество товаров
let currentProducts = []; // текущий отфильтрованный/отсортированный массив товаров

// Функция обновления пагинации
export function updatePagination(products, renderCallback) {

    // Сохраняем текущие товары
    currentProducts = products;
    totalItems = products.length;
    
    // Вычисляем количество страниц
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Получаем контейнер пагинации
    const paginationContainer = document.querySelector('.catalog__pagination');
    
    // Если пагинации нет на странице или товаров меньше 6 — скрываем пагинацию
    if (!paginationContainer || totalItems <= itemsPerPage) {

        if (paginationContainer) {

            paginationContainer.style.display = 'none';
        }

        // Показываем все товары
        renderCallback(products);

        return;
    }
    
    // Показываем пагинацию
    paginationContainer.style.display = 'flex';
    
    // Генерируем HTML для пагинации
    paginationContainer.innerHTML = generatePaginationHTML(totalPages, currentPage);
    
    // Показываем товары для текущей страницы
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productsForPage = products.slice(start, end);

    renderCallback(productsForPage);
    
    // Добавляем обработчики для кнопок пагинации
    attachPaginationEventHandlers(totalPages, renderCallback);
}

// Генерация HTML для пагинации (под твои CSS классы)
function generatePaginationHTML(totalPages, currentPage) {

    let html = '';
    
    // Кнопка "Назад"
    html += `<li class="catalog__pagination-item">
        <button class="catalog__pagination-link catalog__pagination-link--prev" ${currentPage === 1 ? 'disabled' : ''}>
            ←
        </button>
    </li>`;
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {

        html += `<li class="catalog__pagination-item">
            <button class="catalog__pagination-link ${i === currentPage ? 'catalog__pagination-link--active' : ''}" data-page="${i}">
                ${i}
            </button>
        </li>`;
    }
    
    // Кнопка "Далее"
    html += `<li class="catalog__pagination-item">
        <button class="catalog__pagination-link catalog__pagination-link--next" ${currentPage === totalPages ? 'disabled' : ''}>
            →
        </button>
    </li>`;
    
    return html;
}

// Добавление обработчиков событий на кнопки пагинации
function attachPaginationEventHandlers(totalPages, renderCallback) {

    // Обработчики для кнопок с номерами страниц
    const pageButtons = document.querySelectorAll('.catalog__pagination-link[data-page]');

    pageButtons.forEach(btn => {

        // Удаляем старый обработчик, чтобы не было дублирования
        btn.removeEventListener('click', (e) => {});

        btn.addEventListener('click', (e) => {

            const page = parseInt(e.currentTarget.dataset.page);

            if (!isNaN(page) && page !== currentPage) {

                currentPage = page;

                updatePagination(currentProducts, renderCallback);

                // Обновляем тултипы после смены страницы
                updateTooltips();

                // Прокручиваем страницу к началу каталога
                scrollToCatalog();
            }
        });
    });
    
    // Кнопка "Назад"
    const prevBtn = document.querySelector('.catalog__pagination-link--prev');

    if (prevBtn && !prevBtn.disabled) {

        prevBtn.removeEventListener('click', (e) => {});

        prevBtn.addEventListener('click', () => {

            if (currentPage > 1) {

                currentPage--;
                updatePagination(currentProducts, renderCallback);
                scrollToCatalog();
            }
        });
    }
    
    // Кнопка "Далее"
    const nextBtn = document.querySelector('.catalog__pagination-link--next');

    if (nextBtn && !nextBtn.disabled) {

        nextBtn.removeEventListener('click', (e) => {});
        
        nextBtn.addEventListener('click', () => {

            if (currentPage < totalPages) {

                currentPage++;
                updatePagination(currentProducts, renderCallback);
                scrollToCatalog();
            }
        });
    }
}

// Функция прокрутки к началу каталога
function scrollToCatalog() {

    const catalog = document.querySelector('.catalog');

    if (catalog) {

        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Сброс пагинации на первую страницу
export function resetPagination() {

    currentPage = 1;
}

// Получение количества страниц
export function getTotalPages() {

    return Math.ceil(totalItems / itemsPerPage);
}