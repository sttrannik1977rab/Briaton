import { setSearchQuery } from "./products.js";
import { filterAndSortProducts } from "./filters.js";

// Функция инициализации поиска
export function initSearch() {

    // Находим элемент поля поиска
    const searchInput = document.querySelector('.catalog__search .custom-input__field');

    if (!searchInput) return; // если элемент не найден, выходим из функции

    // Переменная для debonce (задержка после последнего ввода)
    let debounceTimer; // переменная для хранения ID таймера

    // Обработчик события ввода текста в поле поиска
    searchInput.addEventListener('input', (e) => {

        // Очищаем предыдущий таймер, если он существует
        if (debounceTimer) {

            clearTimeout(debounceTimer);
        }

        // Устанавливаем новый таймер (ждём 300мс после последнего ввода)
        debounceTimer = setTimeout(() => {

            // Получаем текущее значение поля поиска
            const query = e.target.value.trim(); // получаем текст из поля
            setSearchQuery(query);                // сохраняем запрос
            filterAndSortProducts();              // перезапускаем фильтрацию

        }, 300);
    });
}