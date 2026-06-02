import { productsAPI } from "../services/productsAPI.js";
import { renderProductCard } from "./cardRenderer.js";
import { initTooltips } from "./tooltip.js";

// Функция создания слайдов
export async function renderDayProducts() {

    try {

        // Вызываем данные из data.json
        let products = await productsAPI.getAllProducts();

        // С помощью метода filter перебираем полученный массив товаров и 
        // оставляем только те товары, у которых есть свойство goodsOfDay со значением true 
        const dayProducts = products.filter(product => product.goodsOfDay === true);

        // Находим контейнер слайдера
        const dayProductsList = document.querySelector('.day-products__list');

        //Если dayProductsList соответствует условиям, то
        if (dayProductsList && dayProducts.length > 0) {

            // Для каждого элемента массива dayProducts создаем элемент li и 
            // помещаем в него HTML-структуру карточки продукта (с данными из dayProducts) с помощью вызова ф-ии renderProductCard()
            // с учетом высоты карточки
            dayProductsList.innerHTML = dayProducts.map(product => `
                <li class="day-products__item swiper-slide">
                    ${renderProductCard(product, 'small')}
                </li>
            `).join('');    
        }

        initDayProductsSwiper();

        // Инициализируем тултипы для товаров дня
        initTooltips();

    } catch(error) {

        console.error('Ошибка загрузки товаров дня:', error);

    }
}

// Функция инициализации слайдера Swiper
function initDayProductsSwiper() {

    // Проверяем, что библиотека Swiper загружена
    if (typeof Swiper === 'undefined') {

        console.error('Swiper библиотека не загружена');

        return;
    }
    
    // Проверяем, что контейнер слайдера существует
    const sliderContainer = document.querySelector('.day-products__slider');
    if (!sliderContainer) return;
    
    // Инициализируем Swiper
    new Swiper('.day-products__slider', {

        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        
        navigation: {

            nextEl: '.day-products__navigation-btn--next',
            prevEl: '.day-products__navigation-btn--prev',
        },
        
        breakpoints: {

            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
        }
    });
}