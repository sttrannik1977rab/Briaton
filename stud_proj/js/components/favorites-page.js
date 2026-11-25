import { getFavoriteProducts, updateFavoritesIcons } from "./favorites.js";
import { renderProductCard } from "./cardRenderer.js";
import { updateTooltips } from "./tooltip.js";

export async function renderFavoritesPage() {
    // Находим контейнеры на странице
    const favoritesList = document.querySelector('#favorites-list');
    const favoritesEmpty = document.querySelector('#favorites-empty');

    // Если это не страница избранного — выходим
    if (!favoritesList || !favoritesEmpty) return;

    try {
        // Получаем полные данные избранных товаров
        const favoriteProducts = await getFavoriteProducts();

        // Если избранное пусто — показываем пустое состояние
        if (favoriteProducts.length === 0) {
            favoritesList.innerHTML = '';
            favoritesList.style.display = 'none';
            favoritesEmpty.style.display = 'flex';
            return;
        }

        // Скрываем пустое состояние, показываем список
        favoritesEmpty.style.display = 'none';
        favoritesList.style.display = 'grid';

        // Отрисовываем карточки товаров
        favoritesList.innerHTML = favoriteProducts.map(product => 
            `
                <li class="favorites__item">
                    ${renderProductCard(product)}
                </li>
            `
        ).join('');

        // Обновляем иконки сердечек и тултипы
        updateFavoritesIcons();
        updateTooltips();
    } catch (error) {
        console.error('Ошибка рендера избранного:', error);
    }
}
