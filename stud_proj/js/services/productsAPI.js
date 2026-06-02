//import { api } from './api.js'

// Паттерн "объект с методами" (работа с сервером)
export const productsAPI = {

    // Получить все товары из data.json. 
    async getAllProducts() {

        try { // try-catch - перехватываем возможные ошибки

            // Отправляем HTTP-запрос к файлу data.json
            const response = await fetch('./data/data.json') 

            // Проверяем, успешно ли загрузился файл. Если ошибка, то создаем новую ошибку с текстом
            if (!response.ok) throw new Error(`ошибка загрузки: ${response.status}`);

            // Парсим JSON в JS, await - ждем, пока парсинг завершится
            const products  = await response.json(); 

            // Возвращаем массив товаров
            return products;

        } catch (error){

            // Выводим ошибку в консоль
            console.error('Ошибка в productsAPI.getAllProducts:', error);

            // Пробрасываем ошибку дальше (чтобы вызывающий код тоже знал об ошибке)
            throw error;
        }
    },

    // Получить один товар по ID
    async getProductById(id) {

        // Вызываем метод getAllProducts из этого же объекта, this ссылается на сам объект productsAPI
        const products = await this.getAllProducts();

        // Метод find() ищет первый элемент, для которого данное условие вернет true 
        // => product.id === id - сравниваем id товара с переданным id 
        // => возвращаем найденный товар (или undefined)    
        return products.find(product => product.id === id);
    },

    // Получить товары по категории
    async getProductsByCategory(category) {

        const products = await this.getAllProducts();

        // Метод filter(), создает новый массив с элементами, прошедшими проверку 
        // => product.type && product.type.includes(category) - проверяем, совпадает ли категория товара
        // => возвращает массив отфильтрованных товаров
        return products.filter(product => product.type && product.type.includes(category));
    }
};

// // с реальным API
// async getAllProducts() {
//     return await api.get('/products');
// }

// // productsAPI.js - низкий уровень
// catch (error) {
//     console.error('productsAPI:', error);
//     throw error;  // ← ПРОБРАСЫВАЕМ
// }

// // filters.js - средний уровень
// catch (error) {
//     console.error('filters:', error);
//     throw error;  // ← ПРОБРАСЫВАЕМ
// }

// // main.js - верхний уровень
// catch (error) {
//     console.error('main:', error);
//     // НЕ ПРОБРАСЫВАЕМ, а показываем пользователю
//     catalogList.innerHTML = `
//         <div class="error-message">
//             <p>😕 Не удалось загрузить товары</p>
//             <button onclick="location.reload()">Попробовать снова</button>
//         </div>
//     `;
// }