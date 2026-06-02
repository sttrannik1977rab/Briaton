// Ключ для хранения корзины в LocalStorage
const STORAGE_KEY = 'basket';

let isDelegationInitialized = false;

// Функция получения корзины из LS
export function getBasket() {

    const basket = localStorage.getItem(STORAGE_KEY);

    return basket ? JSON.parse(basket) : [];
}

// Функция сохранения корзины в LS
function saveBasket(basket) {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
}

// Функция добавления товаров в корзину
export function addToBasket(product) {

    // Получаем текущую корзину
    const basket = getBasket();


    //Проверяем, есть ли уже такой товар в корзине
    const existingItem = basket.find(item => item.id === product.id);

    if (existingItem) {

        // Если товар уже есть, увеличиваем количество
        existingItem.quantity += 1;

    } else {

        //Если такого товара нет, то добавляем новый
        basket.push({

            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Сохраняем обновленную корзину
    saveBasket(basket);
    
    // Обновляем отображение корзины
    renderBasket();

    // Обновляем счетчик товаров в корзине
    updateBasketCounter();

    // Обновляем состояние кнопок
    updateAllCartButtons();
}

//Функция удаления товара из корзины
export function removeFromBasket(productId) {

    // Получаем текущую корзину
    let basket = getBasket();

    basket = basket.filter(item => item.id !== productId);

    // Сохраняем обновленную корзину
    saveBasket(basket);

    // Обновляем отображение корзины
    renderBasket();

    // Обновляем счетчик товаров
    updateBasketCounter();

    // Обновляем состояние кнопок
    updateAllCartButtons();
}

// Функция изменения количества товаров
function updateQuantity(productId, newQuantity) {

    if (newQuantity < 1) {
        
        // Если количество товара меньше 1, удаляем товар
        removeFromBasket(productId);

        return;
    }

    // Вызываем текущую корзину и ищем нужный товар с помощью метода find() (сравниваем id c productId)
    const basket = getBasket();
    
    const item = basket.find(item => item.id === productId);

    // Если данный товар найден, то 
    if (item) {

        item.quantity = newQuantity; // изменяем количество
        saveBasket(basket); // пересохраняем корзину
        renderBasket(); // отображаем измененную корзину
        updateBasketCounter(); // обновляем счетчик товаров
        updateAllCartButtons(); // обновляем состояние кнопок
    }
}

// Функция очистки всей корзины
export function clearBasket() {

    saveBasket([]); // сохраняем корзину с пустым массивом
    renderBasket(); // отображаем пустую корзину
    updateBasketCounter(); // обновляем счетчик
    updateAllCartButtons(); // обновляем состояние кнопок
}

// Функция создания HTML-структуры окна корзины
function createBasketEl() {

    // Вызываем HTML-элемент окна корзины
    const basketEl = document.querySelector('.header__basket');
    
    basketEl.innerHTML = `
        <div class="basket__wrapper">
            <div class="basket__header">
                <h2 class="basket__title">Корзина</h2>
                <button class="basket__clear btn btn--clear" id="clear-basket">Удалить все</button>
            </div>
            <ul class="basket__list"></ul>
            <div class="basket__footer">
                <div class="basket__total">
                    <span class="basket__total-text">Итого:</span>
                    <span class="basket__total-price">0</span>
                    <span class="basket__total-currency">₽</span>
                </div>
                <a class="basket__link btn" href="#">Перейти к оформлению</a>
            </div>
        </div>
        <div class="basket__empty-block">Корзина пока пуста</div>    
    `;   
}

// Рендер содержимого корзины
export function renderBasket() {

    // Сохраняем состояние открытости корзины
    const basketMenu = document.querySelector('.basket');
    const wasOpen = basketMenu ? basketMenu.classList.contains('basket--active') : false;

    // Вызываем функцию создания HTML-структуры окна корзины
    createBasketEl();

    // Вызываем необходимые элементы
    const basketList = document.querySelector('.basket__list');
    const basketEmptyBlock = document.querySelector('.basket__empty-block');
    const basketWrapper = document.querySelector('.basket__wrapper');

    // Проверяем существование элемента списка корзины
    if (!basketList) return;

    // Вызываем текущую корзину
    const basket = getBasket();

    if (basket.length === 0) {

        // Корзина пуста
        basketList.innerHTML = '';
        if (basketEmptyBlock) basketEmptyBlock.style.display = 'block';
        if (basketWrapper) basketWrapper.classList.remove('basket__wrapper--active');

        return;   
    }

    //Корзина не пуста
    if (basketEmptyBlock) basketEmptyBlock.style.display = 'none'
    if (basketWrapper) basketWrapper.classList.add('basket__wrapper--active');
    

    // Отрисовываем товары в корзине
    basketList.innerHTML = basket.map(item => `
        <li class="basket__item">
            <div class="basket__img">
                <img src="${item.image}" alt="${item.name}" height="60" width="60">
            </div>
            <span class="basket__name">${escapeHtml(item.name)}</span>
            <div class="basket__cost">
                <span class="basket__price">${(item.price * item.quantity).toLocaleString()} ₽</span>
                <div class="basket__controls">
                    <button class="basket__quantity-btn basket__quantity-btn--minus btn-close" data-id="${item.id}">-</button>
                    <span class="basket__quantity">${item.quantity}</span>
                    <button class="basket__quantity-btn basket__quantity-btn--plus btn-close" data-id="${item.id}">+</button>
                </div> 
            </div>       	
            <button class="basket__item-close btn-close" data-id="${item.id}" type="button">
                <svg class="basket__close-icon" width="24" height="24" aria-hidden="true">
                    <use xlink:href="images/sprite.svg#icon-close"></use>
                </svg>
            </button>
        </li>
    `).join('');

    // Обновляем итоговую сумму
    updateTotalPrice();

    // Восстанавливаем состояние открытости корзины
    if (wasOpen && basketMenu) {

        basketMenu.classList.add('basket--active');
    }
}

// Обновление общей суммы корзины
function updateTotalPrice() {

    const basket = getBasket();
    const total = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const totalElement = document.querySelector('.basket__total-price');
    
    if (totalElement) totalElement.textContent = total.toLocaleString();
}

// Обновление счетчика на иконке корзины
export function updateBasketCounter() {

    const basket = getBasket();
    const totalItems = basket.reduce((sum, item) => sum + item. quantity, 0);

    const counterElement = document.querySelector('#basket-counter');

    if (counterElement) {

        if (totalItems > 0) {

            counterElement.textContent = totalItems;
            counterElement.style.display = 'flex';

        } else {

            counterElement.style.display = 'none';
        }
    }
}

// Функция обновления всех кнопок "В корзину" на странице каталога
export function updateAllCartButtons() {

    const basket = getBasket(); // вызываем текущее состояние корзины

    // Находим все кнопки "В корзину"
    const addButtons = document.querySelectorAll('.btn--icon');

    // Перебираем полученный NodeList 
    addButtons.forEach(btn => {
        
        // Береем id товара и ищем по нему этот товар в корзине
        const productId = parseInt(btn.dataset.id); 
        const productInBasket = basket.find(item => item.id === productId);

        // Находим текстовый элемент внутри кнопки
        const btnText = btn.querySelector('.btn__text');
        if (!btnText) return;

        // Если товар найден (уже находится в корзине)
        if (productInBasket) {

            // Меняем текст кнопки и добавляем класс
            btnText.textContent = 'В корзине';
            btn.classList.add('btn--in-cart');

            //Создаем или находим счетчик
            let countSpanWrap = btn.querySelector('.btn__count-wrap');
            let countSpan = btn.querySelector('.btn__count');

            if (!countSpanWrap) {

                countSpanWrap = document.createElement('span');
                countSpanWrap.className = 'btn__count-wrap';

                countSpan = document.createElement('span');
                countSpan.className = 'btn__count';

                countSpanWrap.append(countSpan);

                btn.appendChild(countSpanWrap);
            }

            // Показываем wrapper
            countSpanWrap.style.display = 'inline-flex';

            // Показываем количество именно этого товара
            countSpan.textContent = productInBasket.quantity;

        } else {

            // Товар не в корзине — возвращаем исходное состояние
            btnText.textContent = 'В корзину';
            btn.classList.remove('btn--in-cart');
            
            // Скрываем или удаляем счётчик
            const countSpanWrap = btn.querySelector('.btn__count-wrap');

            if (countSpanWrap) {

                countSpanWrap.style.display = 'none';

                // Очищаем текст счётчика
                const countSpan = countSpanWrap.querySelector('.btn__count');
                
                if (countSpan) {
                    countSpan.textContent = '';
                }
            }

            
        }  
    });
}

// Функция извлечения данных из карточки товара
function extractProductdata(productCard) {

    // Извлекаем данные о товаре из карточки
    // Извлекаем id товара:
    // "?" - опциональный безопасный доступ (в случае, если элемент не найден просто выдаст undefined)
    const productId = parseInt(productCard.querySelector('.btn--icon')?.getAttribute('data-id'));                            
    // Дополнительно проверяем наличие id                           
    if (isNaN(productId)) {
        console.error('Не удалось определить ID товара');
        return;
    }

    // Извлекаем остальные данные
    const productName = productCard.querySelector('.product-card__title')?.textContent; // извлекаем название товара
    if (!productName) {
        console.error('Не удалось определить название товара');
        return;
    }

    const productPriceText = productCard.querySelector('.product-card__price-number')?.textContent; // извлекаем цену товара
    const productPrice = parseInt(productPriceText?.replace(/\s/g, '') || 0); //.replace(/\s/g, ''), \s - любой пробельный символ (пробел, табуляция)
                                                                                // g - флаг "глобально" (все вхождения), '11 540' → '11540'
                                                                                // parseInt() - преобразуем строку в число
                                                                                // || 0 - если цена не найдена, ставим 0
    if (!productPrice || isNaN(productPrice)) {
        console.error('Не удалось определить цену товара');
        return;
    }

    const productImage = productCard.querySelector('.product-card__img')?.getAttribute('src') || ''; // извлекаем путь к изображению
    
    // Создаём объект товара из полученных данных
    const product = {

        id: productId,
        name: productName || 'Без названия',
        price: productPrice || 0,
        image: productImage || ''
    };

    return product;
}

// Инициализация делегирования для корзины
export function initDelegation() {

    if (isDelegationInitialized) return;  // защита от повторов
    isDelegationInitialized = true;

    // Вешаем обработчик на body, но обрабатываем только события корзины и добавление в корзину
    document.body.addEventListener('click', (e) => {
        
        // 1. Очистка корзины
        // Пояснения:
        //  e - объект события, e.target - свойство объекта события, указывающее на элемент, к которому привязано событие
        // С помощью метода closest, мы ищем этот эл-т по известному классу и записываем его в переменную
        const clearBtn = e.target.closest('.basket__clear'); 
        
        // Если клик произошел по кнопке очистки (элемент существует), то:
        if (clearBtn) {

            e.preventDefault(); // удаляем стандартное поведение браузера
            e.stopPropagation(); // останавливаем всплытие события до body
            clearBasket(); // вызываем ф-ю очистки всей корзины

            return; // выходим из функции
        }

        // 2. Удаление товара
        const removeBtn = e.target.closest('.basket__item-close'); // ищем элемент, по которому произошел клик

        // Если клик произошел по кнопке удаления (элемент существует), то:
        if (removeBtn) {

            e.preventDefault(); // удаляем стандартное поведение браузера
            e.stopPropagation(); // останавливаем всплытие события до body
            const productId = parseInt(removeBtn.dataset.id); // берем его id

            removeFromBasket(productId); // вызываем ф-ю удаления товара с этим id

            return; // выходим из функции
        }

        // 3. Уменьшение количества
        const minusBtn = e.target.closest('.basket__quantity-btn--minus'); // ищем элемент, по которому произошел клик

        // Если клик произошел по кнопке удаления (элемент существует), то:
        if (minusBtn) {

            e.preventDefault(); // удаляем стандартное поведение браузера
            e.stopPropagation(); // останавливаем всплытие события до body
            const productId = parseInt(minusBtn.dataset.id); // берем его id

            const basket = getBasket(); // вызываем текущую корзину

            // С помощью метода find перебираем массив, сравниваем id элементов с найденным и
            // записываем в переменную найденный элемент
            const item = basket?.find(i => i.id === productId);

            // Если элемент найден (не null), то ф-ю изменения количества товаров
            if (item) {

                const newQuantity = item.quantity - 1;
                updateQuantity(productId, newQuantity);
            }

            return; // выходим из функции
        }

        // 4. Увеличение количества
        const plusBtn = e.target.closest('.basket__quantity-btn--plus'); // ищем элемент, по которому произошел клик

        // Если клик произошел по кнопке удаления (элемент существует), то:
        if (plusBtn) {

            e.preventDefault(); // удаляем стандартное поведение браузера
            e.stopPropagation(); // останавливаем всплытие события до body
            const productId = parseInt(plusBtn.dataset.id); // берем его id

            const basket = getBasket(); // вызываем текущую корзину

            // С помощью метода find перебираем массив, сравниваем id элементов с найденным и
            // записываем в переменную найденный элемент
            const item = basket?.find(i => i.id === productId);

            // Если элемент найден (не null), то ф-ю изменения количества товаров
            if (item) {

                const newQuantity = item.quantity + 1;
                updateQuantity(productId, newQuantity);
            }

            return; // выходим из функции
        }

        // 5. Добавление товара в корзину (из каталога)
        const addBtn = e.target.closest('.btn--icon'); // находим элемент, по которому произошел клик

        // Если этот элемент найден и у него есть родитель, то
        if (addBtn && addBtn.closest('.product-card')) {

            e.preventDefault(); // удаляем стандартное поведение браузера

            const productCard = addBtn.closest('.product-card'); //находим соответствующую карточку товара
            const product = extractProductdata(productCard); // вызываем ф-ю извлечения данных из карточки товара
            addToBasket(product); //с полученными данными вызываем ф-ю добавления товаров в корзину 
            showAddedToCartNotification(product.name); // вызываем ф-ю показа уведомления о добавлении товара в корзину
        }
    });
}

// // Обработчики событий на кнопках в корзине
// function attachBasketEventListeners() {

//     // Кнопки удаления товара
//     const closeButtons = document.querySelectorAll('.basket__item-close');

//     closeButtons.forEach(btn => {
        
//         btn.removeEventListener('click', handleRemoveClick);
//         btn.addEventListener('click', handleRemoveClick);
//     });

//     // Кнопки изменения количества
//     const minusButtons = document.querySelectorAll('.basket__quantity-btn--minus');

//     minusButtons.forEach(btn => {
//         btn.removeEventListener('click', handleMinusClick);
//         btn.addEventListener('click', handleMinusClick);
//     });
    
//     const plusButtons = document.querySelectorAll('.basket__quantity-btn--plus');

//     plusButtons.forEach(btn => {
//         btn.removeEventListener('click', handlePlusClick);
//         btn.addEventListener('click', handlePlusClick);
//     });
// }

// // Обработчики для кнопок
// function handleRemoveClick(e) {

//     const btn = e.currentTarget;
//     e.stopPropagation();
//     const productId = parseInt(btn.dataset.id);

//     removeFromBasket(productId);
// }

// function handleMinusClick(e) {

//     const btn = e.currentTarget;
//     e.stopPropagation();
//     const productId = parseInt(btn.dataset.id);
//     const basket = getBasket();
//     const item = basket.find(i => i.id === productId);

//     if (item) {

//         updateQuantity(productId, item.quantity - 1);
//     }
// }

// function handlePlusClick(e) {

//     const btn = e.currentTarget;
//     e.stopPropagation();
//     const productId = parseInt(btn.dataset.id);
//     const basket = getBasket();
//     const item = basket.find(i => i.id === productId);

//     if (item) {

//         updateQuantity(productId, item.quantity + 1);
//     }
// }

// // Инициализация обработчиков кнопок "В корзину" на карточках товаров
// export function initAddToCartButtons() {

//     // Находим все кнопки "В корзину" на странице
//     const addButtons = document.querySelectorAll('.btn--icon');
    
//     addButtons.forEach(btn => {
//         // Удаляем старый обработчик, чтобы не было дублирования
//         btn.removeEventListener('click', handleAddToCart);
//         // Добавляем новый
//         btn.addEventListener('click', handleAddToCart);
//     });
// }

// // Обработчик добавления товара в корзину
// function handleAddToCart(e) {

//     e.preventDefault(); // убираем стандартное поведение браузера
//     e.stopPropagation(); // останавливаем всплытие
    
//     // Находим ближайшую карточку товара
//     // Пояснения: e - объект события, с currentTarget - св-во объекта, указывающее на эл-т, к которому привязано событие.
//     // С помощью метода closest мы ищем родителя выщеуказанного элемента по известному классу. Это и будет карточка товара, 
//     // содержащая кнопку, на которую мы нажали.
//     const productCard = e.currentTarget.closest('.product-card');
    
//     // Проверяем существование элемента
//     if (!productCard) return;
    
//     // Извлекаем данные о товаре из карточки

//     // Извлекаем id товара:
//     // "?" - опциональный безопасный доступ (в случае, если элемент не найден просто выдаст undefined)
//     const productId = parseInt(productCard.querySelector('.btn--icon')?.getAttribute('data-id'));                            
//     // Дополнительно проверяем наличие id                           
//     if (isNaN(productId)) {
//         console.error('Не удалось определить ID товара');
//         return;
//     }

//     // Извлекаем остальные данные
//     const productName = productCard.querySelector('.product-card__title')?.textContent; // извлекаем название товара
//     if (!productName) {
//         console.error('Не удалось определить название товара');
//         return;
//     }

//     const productPriceText = productCard.querySelector('.product-card__price-number')?.textContent; // извлекаем цену товара
//     const productPrice = parseInt(productPriceText?.replace(/\s/g, '') || 0); //.replace(/\s/g, ''), \s - любой пробельный символ (пробел, табуляция)
//                                                                                 // g - флаг "глобально" (все вхождения), '11 540' → '11540'
//                                                                                 // parseInt() - преобразуем строку в число
//                                                                                 // || 0 - если цена не найдена, ставим 0
//     if (!productPrice || isNaN(productPrice)) {
//         console.error('Не удалось определить цену товара');
//         return;
//     }

//     const productImage = productCard.querySelector('.product-card__img')?.getAttribute('src'); // извлекаем путь к изображению
    
//     // Создаём объект товара из полученных данных
//     const product = {

//         id: productId,
//         name: productName || 'Без названия',
//         price: productPrice || 0,
//         image: productImage || ''
//     };
    
//     // Добавляем в его корзину
//     addToBasket(product);
    
//     // Анимация или уведомление (опционально)
//     showAddedToCartNotification(productName);
// }

// Функция показа уведомления о добавлении товара в корзину
// productName - название товара, которое будет отображено в уведомлении (аргумент функции)
function showAddedToCartNotification(productName) {

    // Создаём временное уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `✓ ${productName} добавлен в корзину`;
    
    // Добавляем созданный элемент в конец body
    document.body.appendChild(notification);
    
    // Автоудаление элемента через указанное время (через 2с)
    setTimeout(() => {

        notification.remove();
    }, 2000);
}

// Инициализация корзины при загрузке страницы
export function initBasket() {
    
    renderBasket();
    updateBasketCounter();
    updateAllCartButtons(); // обновляем состояние кнопок
    initDelegation(); // обработчики корзины (очистка, удаление, +/-, добавление товара в корзину)
    
}

// Защита от XSS (экранирование HTML)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

    