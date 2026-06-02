import { productsAPI } from "../services/productsAPI.js";
import { renderProducts, updateCatalog } from "./products.js";
import { updateTooltips } from "./tooltip.js";
import { getSearchQuery } from "./products.js";

// По умолчанию, текущий выбранный город
let currentCity = 'Москва';

// Функция установки города (вызывается из меню)
export function setCurrentCity(city) {

    currentCity = city; // сохраняем (обновляем) название города в переменной
    // сonsole.log('Выбран город:', currentCity);

    // После смены города, обновляем список товаров
    filterAndSortProducts();
}

// Функция получения текущего города
export function getCurrentCity() {

    return currentCity;
}

// Функция подсчета количества товаров в каждой категории
export async function updateCategoriesCount() {
    
    try {

        // Получаем все товары
        const products = await productsAPI.getAllProducts();
        
        // Создаем объект хранения количества товаров по категориям
        const categoriesCount = {

            pendant: 0, // подвесные
            nightlights: 0, // ночники
            overhead: 0, // накладные
            point: 0, // точечные
            ceiling: 0, // потолочные
        };

        // Подсчитываем количество товаров в каждой категории
        products.forEach(product => {
            
            // product.type - массив категорий товаров
            product.type.forEach(category => {
                
                if (categoriesCount[category] !== undefined) categoriesCount[category]++;
            });
        });

        // Обновляем отображение количества на странице
        // Object.entries превращает объект в массив пар [ключ, значение]
        for (const [category, count] of Object.entries(categoriesCount)) {

            const countElement = document.querySelector(`.custom-checkbox__count[data-category="${category}"]`);

            if (countElement) countElement.textContent = count;
        }

        return categoriesCount;

    } catch (error) {

        console.error('Ошибка подсчета категорий:', error);

        return null;
    }
}

// Функция получения выбранных категорий
function getSelectedCategories() {
    
    // Собираем выбранные категории
    const selectedCategories = []; // создаем пустой массив
    const checkboxes = document.querySelectorAll('.custom-checkbox__field:checked'); // вызываем все элементы со статусом checked

    // Перебираем полученный NodeList и добавляем в массив
    checkboxes.forEach(checkbox => {
        
        selectedCategories.push(checkbox.value);
    });

    return selectedCategories;
}

// Функция получения результата с фильтра по наличию
function getAvailabilityFilter() {

    const instockRadio = document.querySelector('#instock'); // радио "В наличии"
    const allItemRadio = document.querySelector('#all-item'); // радио "Все"

    if (instockRadio && instockRadio.checked) {

        return 'instock'; // в наличии

    } else {

        return 'all'; // все
    }
}

// Функция получения значения сортировки
function getSortValue() {

    const sortSelect = document.querySelector('.catalog__sort-select');

    if (sortSelect) { return sortSelect.value }
    
    return 'rating-max';
}

// Функция применения фильтров
function applyFilters(products, selectedCategories, availabilityFilter) {

    // Копируем (сохраняем) ссылку на полученные данные, чтобы сохранить оригинал
    let filtered = products;

    // 0. Фильтр по поисковому запросу
    const searchQyery = getSearchQuery(); // получаем текст из поля поиска

    console.log(searchQyery)

    if (searchQyery) { // если строка не пустая

        const lowerQuery = searchQyery.toLowerCase(); // приводим к нижнему регистру

        console.log(lowerQuery)
        
        filtered = filtered.filter(product => product.name.toLowerCase().includes(lowerQuery)); // ищем товары соответствующие поисковому запросу
    }

    // 1. Фильтр по категориям
    //Если есть выбранные категории, то
    if (selectedCategories.length > 0) {

        filtered = filtered.filter(product => {

            if (!product.type || !Array.isArray(product.type)) return false;

            // Проверяем, есть ли хотя бы одна общая категория
            return product.type.some(category => selectedCategories.includes(category));
        });
    }

    // 2. Фильтр по наличию (с учетом города)
    if (availabilityFilter === 'instock') {

        filtered = filtered.filter(product => {

            const availability = product.availability;

            if (!availability) return false;

            // Получаем количество в зависимости от выбранного города
            let quantity = 0;

            switch(currentCity) {

                case 'Москва': quantity = availability.moscow || 0; break;
                case 'Оренбург': quantity = availability.orenburg || 0; break;
                case 'Санкт-Петербург': quantity = availability.saintPetersburg || 0; break;
                default: quantity = availability.orenburg || 0;
            }

            return quantity > 0;
        });
    }

    return filtered;
}

// Функция применения сортировки
function applySorting(products, sortValue) {

    const sorted = [...products];

    switch(sortValue) {

        case 'rating-max': return sorted.sort((a, b) => b.rating - a.rating);
        case 'price-min': return sorted.sort((a, b) => a.price.new - b.price.new);
        case 'price-max': return sorted.sort((a, b) => b.price.new - a.price.new);
        default: return sorted;
    }
}

// Основная функция фильтрации и сортировки
export async function filterAndSortProducts() {
    
    try {

        // 1. Получаем все товары
        let products = await productsAPI.getAllProducts();

        // 2. Получаем значения фильтров
        const selectedCategories = getSelectedCategories();
        const availabilityFilter = getAvailabilityFilter();

        // 3. Применяем фильтры
        products = applyFilters(products, selectedCategories, availabilityFilter);

        // 4. Применяем сортировку
        const sortValue = getSortValue();
        products = applySorting(products, sortValue);

        // 5. Обновляем каталог с пагинацией
        await updateCatalog(products);

       // Обновляем тултипы после фильтрации
        updateTooltips(); 

    } catch(error) {

        console.error('Ошибка фильтрации и сортировки:', error);
        await updateCatalog([]);
    }
}


