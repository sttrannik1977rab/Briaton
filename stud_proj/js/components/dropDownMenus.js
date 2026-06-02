import { setCurrentCity } from "./filters.js";

// Функция открытия-закрытия меню каталога (экспортируем ее для использования в main.js)
export function initCatalogMenu() {

    // Вызываем необходимые элементы
    const catalogMenu = document.querySelector('.main-menu'); // меню каталога
    const btnCatalog = document.querySelector('.header__catalog-btn'); // кнопка, которая открывает меню
    const btnCatalogClose = document.querySelector('.main-menu__close'); // кнопка, которая закрывает меню (крестик)
    
    // Проверяем существование элементов
    if (!btnCatalog || !catalogMenu) return; 
    
    // Открытие меню по кнопке. Вешаем обработчик события
    btnCatalog.addEventListener('click', (e) => {

        // Останавливаем всплытие события. Это нужно, чтобы клик по кнопке не сработал на других обработчиках, например, document.addEventListener('click') 
        e.stopPropagation();
        
        // Добавляем класс main-menu--active к меню, который делает меню видимым
        catalogMenu.classList.add('main-menu--active'); 
    });
    
    // Закрытие по крестику. Проверяем, существует ли элемент и вешаем на кнопку обработчик события
    if (btnCatalogClose) {

        btnCatalogClose.addEventListener('click', () => {

            // Удаляем класс и тем самым делаем меню не видимым
            catalogMenu.classList.remove('main-menu--active');
        });
    }
    
    // Закрытие по клику на фон (псевдоэлемент)
    catalogMenu.addEventListener('click', (e) => {

        // Вызываем внутренний контейнер с содержимым меню
        const wrapperCatalogMenu = catalogMenu.querySelector('.main-menu__wrapper');

        // Проверяем, что клик был именно по фону (псевдоэлементу main__menu), а не по wrapper
        if (wrapperCatalogMenu && !wrapperCatalogMenu.contains(e.target)) {

            // Если условия выполняются, то удаляем класс
            catalogMenu.classList.remove('main-menu--active'); 
        }
    });
    
    // Закрытие по ESC. Вешаем обработчик события на всю страницу
    document.addEventListener('keydown', (e) => {

        // Проверяем, что нажатая клавиша - именно ESC и меню в данный момент открыто 
        if (e.key === 'Escape' && catalogMenu.classList.contains('main-menu--active')) {

            // Если условия выполнятюся, то удаляем класс 
            catalogMenu.classList.remove('main-menu--active');

        }
    });
}

// Функция открытия-закрытия меню установки города (экспортируем ее для использования в main.js)
export function initLocationMenu() {

    // Вызываем необходимые элементы
    const locationSublist = document.querySelector('.location__sublist'); // выпадающий список городов
    const btnLocationCity = document.querySelector('.location__city'); // кнопка, с текущим городом, открывающая меню
    const locationCityName = document.querySelector('.location__city-name'); //кнопка, с названием города
    
    // Проверяем существование элементов
    if (!btnLocationCity || !locationSublist) return;

    // Открытие и закрытие меню по кнопке
    btnLocationCity.addEventListener('click', (e) => {
        
        // Останавливаем всплытие. В данной ситуации можно и не ставить, т.к.
        // после всплытия до document условие if выдаст true&&false=false. Т.е. закрытия не будет.
        e.stopPropagation();
        
        // Добавляем класс или удаляем класс
        btnLocationCity.classList.toggle('location__city--active');
    });

    // Закрытие по клику на область вне
    document.addEventListener('click', (e) => {
        
        //Проверяем, что клик был именно по области вне всплывающего окна
        if (!locationSublist.contains(e.target) && !btnLocationCity.contains(e.target)) {

            // Если условие выполняется, удаляем класс
            btnLocationCity.classList.remove('location__city--active'); 
        }
    });

    // Выбор опции из списка (замена текста у элемента кнопки) и закрытие окна
    // Находим все кнопки с городами внутри выпадающего списка
    const btnlocationSublinks = document.querySelectorAll('.location__sublink');

    // Если есть хотя бы один город в списке
    if (btnlocationSublinks.length > 0) {

        // Перебираем полученный NodeList
        btnlocationSublinks.forEach(btnlocationSublink => {
            
            // Вешаем обработчик
            btnlocationSublink.addEventListener('click', (e) => {
                
                // Тоже можно не ставить. При всплытии выдыется результат false&&true=false, т.е. всплытия тоже не будет
                // Но если появятся другие обработчики, которые не должны срабатывать на клик пункта меню 
                // - в этом случае этот метод будет необходим!!!!
                e.stopPropagation(); 

                //Если элемент существует, то записываем в него textContent кнопки btnlocationSublink и с тем названием города
                //вызываем функцию установки города
                if (locationCityName) {

                    const selectedCity = btnlocationSublink.textContent.trim();

                    locationCityName.textContent = selectedCity;

                    setCurrentCity(selectedCity);
                }
                
                btnLocationCity.classList.remove('location__city--active'); // закрываем окно после выбора города
            });
        });   
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        
        if (e.key === 'Escape' && btnLocationCity.classList.contains('location__city--active')) {

            btnLocationCity.classList.remove('location__city--active');
        }
    });
}

// Функция открытия-закрытия корзины (экспортируем ее для инициализации в main.js и использования в basket.js)
export function initBasketMenu() {

    // Вызываем необходимые элементы
    const btnBasket = document.querySelector('#user-basket'); // кнопка открытия меню корзины
    const basketMenu = document.querySelector('.basket');

    //Проверяем существование элементов
    if (!btnBasket || !basketMenu) return;

    // Открытие и закрытие меню корзины по кнопке
    btnBasket.addEventListener('click', (e) =>  {
        
        e.stopPropagation(); // останавливаем всплытие (можно не ставить, 
        // при всплытии до document условие if выдаст true&&false=false, т.е. закрытия не будет)

        // Добавляем класс basket--active к меню, который делает меню видимым
        basketMenu.classList.toggle('basket--active');
    });


    // Закрытие по клику на область вне
    document.addEventListener('click', (e) => {
        
        //Проверяем, что клик был именно по области вне всплывающего окна корзины
        if (!basketMenu.contains(e.target) && !btnBasket.contains(e.target)) {

            basketMenu.classList.remove('basket--active'); // убираем класс
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
       
        if (e.key === 'Escape' && basketMenu.classList.contains('basket--active')) {

            basketMenu.classList.remove('basket--active'); // убираем класс
        }
    });
}
