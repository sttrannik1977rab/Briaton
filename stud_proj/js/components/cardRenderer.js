// Функция создания HTML-разметки карточки товара
export function renderProductCard(product, size = 'normal') {

    // Карточку формируем в зависимости от ее размеров (высоты)
    const sizeClass = size === 'small' ? 'product-card--small' : '';
    const imgHeight = size === 'small' ? '344' : '436'; 
    return `
        <div class="product-card ${sizeClass}">
            <div class="product-card__visual">
                <img class="product-card__img" src="${product.image}" height="${imgHeight}" width="290"
                    alt="${product.name}">
                <button class="favorite__btn" data-id="${product.id}" type="button" aria-label="В избранное">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <div class="product-card__more">
                    <a href="#" class="product-card__link btn btn--icon" data-id="${product.id}">
                        <span class="btn__text">В корзину</span>
                        <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="images/sprite.svg#icon-basket"></use>
                        </svg>
                    </a>
                    <a href="#" class="product-card__link btn btn--secondary">
                        <span class="btn__text">Подробнее</span>
                    </a>
                </div>
            </div>
            <div class="product-card__info">
                <h2 class="product-card__title">${product.name}</h2>
                <span class="product-card__old">
                    <span class="product-card__old-number">${product.price.old.toLocaleString()}</span>
                    <span class="product-card__old-add">₽</span>
                </span>
                <span class="product-card__price">
                    <span class="product-card__price-number">${product.price.new.toLocaleString()}</span>
                    <span class="product-card__price-add">₽</span>
                </span>
                <div class="product-card__tooltip tooltip">
                    <button class="tooltip__btn" aria-label="Показать подсказку">
                        <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
                            <use xlink:href="images/sprite.svg#icon-i"></use>
                        </svg>
                    </button>
                    <div class="tooltip__content">
                        <span class="tooltip__text">Наличие товара по городам:</span>
                        <ul class="tooltip__list">
                            <li class="tooltip__item">
                            <span class="tooltip__text">Москва: <span class="tooltip__count">${product.availability.moscow}</span></span>
                            </li>
                            <li class="tooltip__item">
                            <span class="tooltip__text">Оренбург: <span class="tooltip__count">${product.availability.orenburg}</span></span>
                            </li>
                            <li class="tooltip__item">
                            <span class="tooltip__text">Санкт-Петербург: <span class="tooltip__count">${product.availability.saintPetersburg}</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}