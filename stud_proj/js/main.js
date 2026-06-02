import { initCatalogMenu, initLocationMenu, initBasketMenu } from './components/dropDownMenus.js';
import { renderProducts } from './components/products.js';
import { filterAndSortProducts, updateCategoriesCount } from './components/filters.js';
import { initBasket } from './components/basket.js';
import { initFaqAccodion } from './components/accordion.js';
import { renderDayProducts } from './components/dayProducts.js'
import { initFormValidate } from './components/formValidation.js';
import { initTooltips, updateTooltips } from './components/tooltip.js';
import { initSearch } from './components/search.js';
import { initFavorites } from './components/favorites.js';

window.addEventListener('DOMContentLoaded', async () => {

    try {

        //Иницилизируем меню
        initCatalogMenu();
        initLocationMenu();
        initBasketMenu();

        // Отображаем товары 
        await renderProducts();

        // Инициализируем тултипы
        initTooltips();

        // Подсчитываем и отображаем количество в категориях
        await updateCategoriesCount();

        // Инициализируем корзину
        initBasket();

        // Инициализируем избранное
        initFavorites(); 
        
        //Вызываем все checkbox-элементы
        const checkboxes = document.querySelectorAll('.custom-checkbox__field');

        // Вешаем на них обработчики событий
        checkboxes.forEach(checkbox => {

            checkbox.addEventListener('change', () => {
                
                filterAndSortProducts(); // фильтруем при изменении

                // Обновляем тултипы
                setTimeout(() => updateTooltips(), 100);
            });
        });

        // Вызываем все radio-кнопки
        const radioButtons = document.querySelectorAll('.custom-radio__field');

        // Вешаем на них обработчики событий
        radioButtons.forEach(radio => {
            
            radio.addEventListener('change', () => {
                
               filterAndSortProducts(); // сортируем при изменении 

               // Обновляем тултипы
                setTimeout(() => updateTooltips(), 100);
            });
        });

        // Вызываем select-элемент
        const sortSelect = document.querySelector('.catalog__sort-select');

        if (sortSelect) {

            //Вешаем на него обработчик событий
            sortSelect.addEventListener('change', () => {
                
                filterAndSortProducts(); 

                // Обновляем тултипы
                setTimeout(() => updateTooltips(), 100);
            });
        }
        
        // Кнопка сброса фильтров
        const resetBtn = document.querySelector('.catalog-form__reset'); // вызываем элемент кнопки

        // Если элемент существует, вешаем на эту кнопку обработчик события
        if (resetBtn) {

            resetBtn.addEventListener('click', () => {
                
                // Снимаем все отметки
                checkboxes.forEach(checkbox => {
                    
                    checkbox.checked = false;
                });

                // Ставим радио "Все"
                const allItemsRadio = document.querySelector('#all-item');
                if (allItemsRadio) allItemsRadio.checked = true;

                // Сбрасываем сортировку на значение по умолчанию
                if (sortSelect) sortSelect.value = 'rating-max';

                // Вызываем без параметра все товары
                filterAndSortProducts();

                // Обновляем тултипы
                setTimeout(() => updateTooltips(), 100);
            });
        }
        
        // Иницилизируем аккардеон
        initFaqAccodion();

        // Иницилизируем блок "Товары дня"
        renderDayProducts();

        // Инициализируем блок с валидацией
        initFormValidate();

        // Инициализируем функцию поиска
        initSearch();

    } catch(error) {

        console.error('Ошибка инициализации:', error);
    }
});
