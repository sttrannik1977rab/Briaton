// Функция инициализации валидации формы
export function initFormValidate() {

    // Вызываем элемент формы из блока
    const form = document.querySelector('.questions__form');

    // Проверяем наличие элемента формы
    if (!form) return;

    // Создаем экземпляр
    const validator = new JustValidate(form, {

        // Настройки валидатора
        focusInvalidField: true,      // фокусироваться на первом невалидном поле
        lockForm: true,                // блокировать форму до исправления ошибок
        validateBeforeSubmitting: true // валидировать перед отправкой
    });

    // Правила для поля "Name"
    validator.addField('#name', [

        {
            rule: 'required',                          // обязательно для заполнения
            errorMessage: 'Введите ваше имя'
        },

        {
            rule: 'minLength',                         // минимальная длина
            value: 3,
            errorMessage: 'Минимальная длина три символа'
        },

        {
            rule: 'maxLength',                         // максимальная длина
            value: 20,
            errorMessage: 'Максимальная длина двадцать символов'
        }
    ]);

    // Правила для поля "Email"
    validator.addField('#email', [

        {
            rule: 'required',                          // обязательно для заполнения
            errorMessage: 'Введите вашу почту'
        },

        {
            rule: 'email',                             // проверка на email
            errorMessage: 'Почта введена неверно'
        }
    ]);

    // Правила для чекбокса
    validator.addField('#agree', [
        {
            rule: 'required',                          // обязательно к выбору
            errorMessage: 'Согласие обязательно'
        }
    ]);

    // Обработка успешной отправки
    validator.onSuccess(async (e) => {

        e.preventDefault(); // отменяем стандартную отправку

        // Собираем данные из формы
        const formData = new FormData(form); 

        const data = {

            name: formData.get('name'),
            email: formData.get('email'),
            agree: formData.get('agree') === 'on'
        };

        try {
            
            // Отправляем данные на сервер
            const response = await fetch('https://httpbin.org/post', {

                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            });

            if (response.ok) {

                // Успешная отправка
                showModal('success', 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');

                form.reset(); // очищаем форму

            } else {

                // Ошибка сервера
                showModal('error', 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
            }

        } catch (error) {

            // Ошибка сети или другой проблемы
            console.error('error', 'Не удалось отправить заявку. Проверьте подключение к интернету и попробуйте снова.');  
        }
    });

    // Функция модального окна
    function showModal(type, message) {

        // Удаляем старое модальное окно, если оно есть
        const oldMessage = document.querySelector('.message');
        if (oldMessage) oldMessage.remove();

        // Создаем модальное окно
        const messageBlock = document.createElement('div');
        messageBlock.className = 'message';

        messageBlock.innerHTML = `
            <div class="message__content">
                <button class="message__close" type="button" aria-label="Закрыть">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <p>${message}</p>
            </div>
        `;
    
        document.body.appendChild(messageBlock);
        
        // Закрытие по крестику
        const closeBtn = messageBlock.querySelector('.message__close');
        closeBtn.addEventListener('click', () => {
            messageBlock.remove();
        });
        
        // Закрытие по клику на фон
        messageBlock.addEventListener('click', (e) => {
            if (e.target === messageBlock) {
                messageBlock.remove();
            }
        });
        
        // Закрытие по ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                messageBlock.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
}
