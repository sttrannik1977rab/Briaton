export function initFaqAccodion() {

    // Вызываем необходимые элементы
    const btnAccordions = document.querySelectorAll('.accordion__btn');

    // С помощью метода ForEach перебираем полученный NodeList
    btnAccordions.forEach(btn => {

        btn.addEventListener('click', (e) => {

            e.preventDefault();
            
            // Проверяем, активна ли текущая кнопка
            const isActive = btn.classList.contains('accordion__btn--active');
            
            // Если кликнули по активной кнопке — просто закрываем её и выходим
            if (isActive) {

                btn.classList.remove('accordion__btn--active');

                return;
            }
            
            // Закрываем ВСЕ!!! кнопки
            btnAccordions.forEach(otherBtn => {

                otherBtn.classList.remove('accordion__btn--active');
            });
            
            // Открываем текущую
            btn.classList.add('accordion__btn--active');
        });
    });
}