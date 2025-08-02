// script.js — Полная версия без import и data.js

console.log("✅ script.js загружен");

// Данные о часах (встроены прямо в скрипт)
const watches = [
  {
    id: 1,
    name: "Rolex Submariner",
    price: "120 000 ₽",
    description: "Легендарные водонепроницаемые часы для дайвинга.",
    image: "https://i.imgur.com/8VUwW.jpg"
  },
  {
    id: 2,
    name: "Omega Speedmaster",
    price: "95 000 ₽",
    description: "Часы, побывавшие на Луне.",
    image: "https://i.imgur.com/5XaBZ.jpg"
  },
  {
    id: 3,
    name: "Apple Watch Ultra",
    price: "65 000 ₽",
    description: "Умные часы для экстремалов.",
    image: "https://i.imgur.com/7YvEJ.jpg"
  }
];

// Подключаем Telegram WebApp
const tg = window.Telegram?.WebApp || null;
if (tg) tg.ready();

let currentIndex = 0;

function showWatch(index) {
  const watchDiv = document.getElementById('watch');
  const watch = watches[index];

  if (!watchDiv) {
    console.error('❌ Элемент #watch не найден');
    return;
  }
  if (!watch) {
    console.error('❌ Нет часов с индексом', index);
    return;
  }

  watchDiv.innerHTML = `
    <h2>${watch.name}</h2>
    <p><strong>Цена:</strong> ${watch.price}</p>
    <img src="${watch.image}" alt="${watch.name}" style="max-width: 100%; border-radius: 10px;" />
    <p>${watch.description}</p>
  `;
}

// Кнопки
document.getElementById('prev')?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + watches.length) % watches.length;
  showWatch(currentIndex);
});

document.getElementById('next')?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % watches.length;
  showWatch(currentIndex);
});

document.getElementById('buy')?.addEventListener('click', () => {
  const selectedWatch = watches[currentIndex];
  const user = tg?.initDataUnsafe?.user;

  if (!user) {
    alert('Не удалось получить данные. Откройте в Telegram.');
    return;
  }

  const name = user.first_name + (user.last_name ? ` ${user.last_name}` : '');
  const username = user.username ? `@${user.username}` : 'не указан';

  const message = `
🔔 Заявка на покупку!
⌚ Модель: ${selectedWatch.name}
📝 Описание: ${selectedWatch.description}
💰 Цена: ${selectedWatch.price}
👤 Покупатель: ${name}
📞 Telegram: ${username}
⏰ Время: ${new Date().toLocaleString('ru-RU')}
  `.trim();

  // ⚠️ ЗАМЕНИ НА СВОЙ ТОКЕН И CHAT_ID
  fetch('https://api.telegram.org/bot7740102968:AAGsHI28hDe5VPAuDU04VfYJH2FVEiCN9TM/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: '-1002898062426',
      text: message,
      parse_mode: 'HTML'
    })
  })
  .then(() => {
    tg?.showAlert?.('Спасибо! С вами свяжутся в Telegram.');
  })
  .catch(err => {
    console.error('Ошибка:', err);
    tg?.showAlert?.('Ошибка отправки. Напишите нам вручную.');
  });
});

// Показать первый товар
showWatch(0);
