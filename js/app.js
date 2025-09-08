(() => {
    "use strict";

    // --- Инициализация переменных ---
    const scriptForm = document.querySelector(".page__form");
    const phoneInput = document.querySelector(".page__tel");
    const messagersContainer = document.querySelector(".page__messagers");
    const errorMessage = document.getElementById("errorMessage");

    // --- Вспомогательные функции ---

    // Функция для очистки и нормализации номера (оставляет только цифры)
    function normalizePhoneNumber(phone) {
        return phone.replace(/\D/g, '');
    }

    // Функция для проверки номера (российские номера: 10 или 11 цифр)
    function isValidRussianPhone(phoneDigits) {
        const length = phoneDigits.length;

        // Номер без кода страны (10 цифр)
        if (length === 10) {
            return { isValid: true, cleanNumber: phoneDigits };
        }

        // Номер с кодом страны (11 цифр, начинается с 7 или 8)
        if (length === 11 && (phoneDigits.startsWith('7') || phoneDigits.startsWith('8'))) {
            return { isValid: true, cleanNumber: phoneDigits.slice(1) };
        }

        return { isValid: false, cleanNumber: null };
    }

    // Функция для форматирования номера для красивого отображения
    function formatPhoneNumber(cleanNumber) {
        // Формат: +7 (900) 123-45-67
        const match = cleanNumber.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
        }
        return `+7${cleanNumber}`;
    }

    // Функция для очистки сообщений об ошибках
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.classList.remove('active');
        phoneInput.classList.remove('input-error');
    }

    // Функция для отображения ошибки
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('active');
        phoneInput.classList.add('input-error');
    }

    // Функция для создания разметки мессенджеров
    function createMessengerLinks(cleanNumber) {
        const formattedNumber = formatPhoneNumber(cleanNumber);

        return `
            <div class="messagers__header">
                <p class="messagers__title">Ссылки для номера:</p>
                <p class="messagers__number">${formattedNumber}</p>
            </div>
            <div class="messagers__links">
                <a href="https://wa.me/7${cleanNumber}" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp">
                    <img class="messager-button" src="/img/what.svg" alt="WhatsApp">
                    <span>WhatsApp</span>
                </a>
                <a href="https://t.me/+7${cleanNumber}" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram">
                    <img class="messager-button" src="/img/teleg.svg" alt="Telegram">
                    <span>Telegram</span>
                </a>
                <a href="viber://chat?number=7${cleanNumber}" target="_blank" rel="noopener noreferrer" aria-label="Написать в Viber">
                    <img class="messager-button" src="/img/viber.svg" alt="Viber">
                    <span>Viber</span>
                </a>
            </div>
        `;
    }

    // --- Обработчики событий ---

    // Обработчик ввода: маскирование номера в реальном времени
    phoneInput.addEventListener('input', function (e) {
        clearError();

        let value = this.value.replace(/\D/g, '');

        // Форматирование в реальном времени
        if (value.length > 0) {
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue = '+7 ';
            }
            if (value.length > 1) {
                formattedValue += value.slice(1, 4);
            }
            if (value.length > 4) {
                formattedValue += ' ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formattedValue += '-' + value.slice(9, 11);
            }

            this.value = formattedValue;
        }
    });

    // Обработчик отправки формы
    scriptForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        const inputValue = phoneInput.value.trim();
        clearError();

        // Проверка на пустое поле
        if (!inputValue) {
            showError('Пожалуйста, введите номер телефона.');
            phoneInput.focus();
            return;
        }

        // Нормализация и валидация
        const digitsOnly = normalizePhoneNumber(inputValue);
        const validationResult = isValidRussianPhone(digitsOnly);

        if (!validationResult.isValid) {
            showError('Пожалуйста, введите корректный российский номер телефона (10 или 11 цифр).');
            phoneInput.focus();
            return;
        }

        // Если валидация пройдена, показываем ссылки
        messagersContainer.innerHTML = createMessengerLinks(validationResult.cleanNumber);

        // Прокручиваем страницу к результату
        messagersContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Обработчик для кнопки "Вставить из буфера"
    phoneInput.addEventListener('paste', function (e) {
        // Даем время на вставку, затем форматируем
        setTimeout(() => {
            this.dispatchEvent(new Event('input'));
        }, 0);
    });

    // --- Прочие инициализации ---
    let addWindowScrollEvent = false;
    setTimeout(() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (e) => {
                document.dispatchEvent(windowScroll);
            });
        }
    }, 0);

    window.FLS = true;
})();