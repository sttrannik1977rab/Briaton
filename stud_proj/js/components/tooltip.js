// Обработчик показа тултипа. Данная функция вызывается при наведении на кнопку с иконкой подсказки.
function showHandler(e) {

    // e - объект события (Event)
    // e.currentTarget - элемент, на который повешен обработчик (в нашем случае кнопка .tooltip__btn)
    const btn = e.currentTarget;

    // Проверяем, есть ли у кнопки свойство _tooltipContent
    // _tooltipContent мы добавили в initTooltips() — это ссылка на блок с содержимым подсказки
    if (btn._tooltipContent) {

        // Показываем подсказку (меняем display с 'none' на 'block')
        btn._tooltipContent.style.display = 'block';
    }
}

// Обработчик скрытия тултипа. Вызывается при уходе курсора с кнопки.
function hideHandler(e) {

    const btn = e.currentTarget;

    if (btn._tooltipContent) {

        // Скрываем подсказку (меняем display обратно на 'none')
        btn._tooltipContent.style.display = 'none';
    }
}

// Инициализация тултипов
export function initTooltips() {
    
    // Находим все кнопки тултипов
    const tooltipBtns = document.querySelectorAll('.tooltip__btn');
    
    // Перебираем каждую найденную кнопку
    tooltipBtns.forEach(btn => {

        // Находим ближайший родительский элемент с классом .tooltip
        // Это нужно, чтобы внутри этого .tooltip найти контент подсказки
        const tooltip = btn.closest('.tooltip');

        if (!tooltip) return; // если родитель с классом .tooltip не найден, пропускаем эту кнопку
        
        // Внутри найденного .tooltip ищем элемент с классом .tooltip__content
        const tooltipContent = tooltip.querySelector('.tooltip__content');

        if (!tooltipContent) return; // если контент подсказки не найден, пропускаем эту кнопку
        
        // Удаляем старые обработчики, если они были добавлены ранее
        // Это нужно, чтобы при повторной инициализации (например, после фильтрации)
        // не создать дублирующиеся обработчики
        btn.removeEventListener('mouseenter', showHandler);
        btn.removeEventListener('mouseleave', hideHandler);
        
        // Сохраняем ссылку на контент подсказки прямо в свойство кнопки
        // Это позволяет в showHandler и hideHandler получить доступ к контенту
        btn._tooltipContent = tooltipContent;
        
        // Добавляем новые обработчики
        // mouseenter — когда мышь наезжает на кнопку → показываем подсказку
        // mouseleave — когда мышь уходит с кнопки → скрываем подсказку
        btn.addEventListener('mouseenter', showHandler);
        btn.addEventListener('mouseleave', hideHandler);    
    });
}

// Обновление тултипов (после фильтрации/сортировки/пагинации)
export function updateTooltips() {

    initTooltips(); // заново инициализируем все подсказки
}