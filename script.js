import { watches } from './data.js';

// Подключаем Telegram SDK
const tg = window.Telegram.WebApp;
tg.ready();

let currentIndex = 0;

// Функция отображения часов
function showWatch(index) {
  const watch = watches[index];
  const watchDiv = document.getElementById('watch');
  watchDiv.innerHTML = `
    <h2>${watch.name}</h2>
    <p><strong>Цена:</strong> ${watch.price}</p>
    <img src="${watch.image}" alt="${watch.name}" />
    <p>${watch.description}</p>
  `;
}

// Кнопки
document.getElementById('prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + watches.length) % watches.length;
  showWatch(currentIndex);
});

document.getElementById('next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % watches.length;
  showWatch(currentIndex);
});

// Кнопка "Хочу купить"
document.getElementById('buy').addEventListener('click', () => {
  const selectedWatch = watches[currentIndex];

  // Автоматически получаем данные пользователя из Telegram
  const user = tg.initDataUnsafe.user;
  const username = user.username ? `@${user.username}` : 'не указан';
  const name = user.first_name + (user.last_name ? ` ${user.last_name}` : '');
  const userId = user.id;

  // Формируем сообщение
  const message = `
🔔 Заявка на покупку!
⌚ Модель: ${selectedWatch.name}
📝 Описание: ${selectedWatch.description}
💰 Цена: ${selectedWatch.price}
👤 Покупатель: ${name}
📞 Telegram: ${username}
🆔 ID: ${userId}
⏰ Время: ${new Date().toLocaleString('ru-RU')}
  `;

  // Отправляем в бота
  fetch('https://api.telegram.org/bot7740102968:AAGsHI28hDe5VPAuDU04VfYJH2FVEiCN9TM/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: '-1002898062426', // ← сюда ID чата менеджеров
      text: message,
      parse_mode: 'HTML'
    })
  })
  .then(() => {
    tg.showAlert('Спасибо! Менеджер свяжется с вами в Telegram.');
  })
  .catch(err => {
    console.error('Ошибка отправки:', err);
    tg.showAlert('Произошла ошибка. Напишите нам вручную.');
  });
});

// Показать первый товар
showWatch(currentIndex);
