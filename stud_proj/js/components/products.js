import { productsAPI } from "../services/productsAPI.js";
import { renderProductCard } from "./cardRenderer.js";
import { updatePagination, resetPagination } from "./pagination.js";
import { updateTooltips } from "./tooltip.js";
import { updateFavoritesIcons } from "./favorites.js";

let searchQuery = ''; // хранит текущий поисковый запрос
let currentProducts = []; // храним текущие товары для пагинации

// Функция установки поискового запроса (вызывается из search.js)
export function setSearchQuery(query) {

    searchQuery = query;
}

// Функция получения поискового запроса
export function getSearchQuery() {

    return searchQuery;
}

// Функция сброса поиска (опционально)
export function resetSearchQuery() {

    searchQuery = '';
    const searchInput = document.querySelector('.catalog__search .custom-input__field');

    if (searchInput) {

        searchInput.value = '';
    }
}

// Рендер отображения товаров 
// Она принимает productsToRender - необязательный параметр. Если передан массив, то отображаем его. 
// В противном случае загружаем все данные из API
export async function renderProducts(productsToRender = null) {
    
    try { // Блок перехвата и обработки ошибок

        let products;

        // Если товары переданы в аргументе - используем их. 
        // Попутно проверяем, что в аргумент был передан именно массив
        if (productsToRender !== null && Array.isArray(productsToRender)) {

            products = productsToRender;

        } else if (productsToRender !== null) {

            console.warn('renderProducts получил не массив:', productsToRender);

            // Вызываем метод из productsAPI (получаем данные с сервера)
            products = await productsAPI.getAllProducts();

        } else {

            // Вызываем метод из productsAPI (получаем данные с сервера)
            products = await productsAPI.getAllProducts();
        }

        // Сохраняем текущие товары
        currentProducts = products;
        
        // Обновляем пагинацию
        updatePagination(products, renderProductsCallback);

    } catch(error) { // если в блоке try произошла ошибка, выполнение переходит сюда

        //error - объект ошибки; выводим пшибку в консоль
        console.error('Ошибка отображения товаров:', error);

        // Показываем сообщение пользователю
        const catalogList = document.querySelector('.catalog__list');

        if (catalogList) {

            catalogList.innerHTML = '<div class="error-message">Ошибка загрузки товаров</div>';
        }
    }
}

// Функция-колбек для отрисовки товаров (используется пагинацией)
function renderProductsCallback(products) {

    // Вызываем элемент списка карточек товара
    const catalogList = document.querySelector('.catalog__list');

    // Если элемент существует (не null)
    if (catalogList) {

        // Проверка на пустой массив
        if (products.length === 0) {

            catalogList.innerHTML = '<div class="empty-result">Товары не найдены</div>';

            return;
        }

        // - метод map() создает новый массив из HTML-строк; 
        // - для каждого товара создаем li c версткой карточки;
        // - метод join() объединяет массив строк в одну строку (необходим для использования innerHTML);
        // - innnerHTML вставляет HTML внутрь элемента catalogList 
        catalogList.innerHTML = products.map(product => `
            <li class="catalog__item">
                ${renderProductCard(product)}
            </li>
        `).join('');

        // Обновляем тултипы после отрисовки товаров
        updateTooltips();

        // Обновляем эконки избранного после отрисовки
        updateFavoritesIcons();  

        // После отрисовки обновляем кнопки
        // Динамический импорт, чтобы избежать циклической зависимости
        import('./basket.js').then(module => {

            module.updateAllCartButtons();
        });
    } 
}

// Функция для обновления каталога (вызывается после фильтрации/сортировки)
export async function updateCatalog(products) {

    currentProducts = products;

    resetPagination(); // сбрасываем на первую страницу
    
    updatePagination(products, renderProductsCallback);
}