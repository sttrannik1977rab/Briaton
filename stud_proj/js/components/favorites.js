// Ключ для хранения избранного в LocalStorage
const STORAGE_KEY = 'favorites'; 

// Функция получения избранного из LocalStorage
export function getFavorites() {

    const favorites = localStorage.getItem(STORAGE_KEY);

    return favorites ? JSON.parse(favorites) : [];
}

// Функция сохранения избранного в LocalStorage
function saveFavorites(favorites) {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Функция добавления товара в избранное
export function addToFavorites(productId) {

    const favorites = getFavorites(); // вызываем избранное

    // Проверяем, если ли уже такой товар в избранном. Если нет, то добавляем и пересохраняем
    if (!favorites.includes(productId)) {

        favorites.push(productId);

        saveFavorites(favorites);
    }

    updateFavoritesIcons();  // обновляем иконки на странице
}

// Функция удаления товара из избранного
export function removeFromFavorites(productId) {

    let favorites = getFavorites(); // вызываем избранное

    favorites = favorites.filter(id => id !== productId); // получаем новый массив, без элемента с переданного в функцию id

    saveFavorites(favorites); // перезаписываем

    updateFavoritesIcons();  // обновляем иконки на странице
}

// Функция переключения избранного (добавить/удалить)
export function toggleFavorite(productId) {

    const favorites = getFavorites();

    if (favorites.includes(productId)) {

        removeFromFavorites(productId);

    } else {

        addToFavorites(productId);
    } 
}

// Проверить, в избранном ли товар
export function isFavorite(productId) {

    const favorites = getFavorites();

    return favorites.includes(productId);
}

// Функция обновления иконок на странице
export function updateFavoritesIcons() {

    const favoriteBtns = document.querySelectorAll('.favorite__btn'); // находим все кнопки "Избранное"
    const favorites = getFavorites(); // вызываем избранное

    // Перебираем полученный NodeList
    favoriteBtns.forEach(btn => {
        
        const productId = parseInt(btn.dataset.id); // берем id карточки товара

        // Если товар с таким id есть в избранном, то активируем класс
        if (favorites.includes(productId)) {

            btn.classList.add('favorite__btn--active');

        } else { // в противном случае удаляем

            btn.classList.remove('favorite__btn--active')
        }
    });
}

// Функция инициализации обработчиков для кнопок избранного (через делегирование)
export function initFavoritesDelegation() {

    document.body.addEventListener('click', (e) => {
        
        const favoriteBtn = e.target.closest('.favorite__btn');

        if (favoriteBtn) {

            e.preventDefault();
            e.stopPropagation();

            const productId = parseInt(favoriteBtn.dataset.id);
            toggleFavorite(productId);
        }
    });
}

// // Функция получения полных данных избранных товаров
// export async function getFavoriteProducts() {

//     const favorites = getFavorites();
//     const { productsAPI } = await import('../services/productsAPI.js');
//     const allProducts = await productsAPI.getAllProducts();
    
//     return allProducts.filter(product => favorites.includes(product.id));
// }

// Функция инициализации (вызывается в main.js)
export function initFavorites() {

    initFavoritesDelegation();
    updateFavoritesIcons();
}

