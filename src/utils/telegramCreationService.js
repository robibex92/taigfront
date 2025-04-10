import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SERVER_SALT = process.env.REACT_APP_SERVER_SALT;

// Заменяем функцию escapeMarkdownV2 на escapeHTML
function escapeHTML(text) {
  if (!text) return '';
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

const separator = '🔹🔹🔹🔹🔹🔹🔹🔹🔹🔹';

function generateAnnouncementUrl(announcementId) {
  return `https://tp.sibroot.ru/#/announcement/${announcementId}`;
}

// Функция для получения безопасной картинки
function getSafeImageUrl(imageUrl) {
  return imageUrl || 'https://tp.sibroot.ru/uploads/default-image.png';
}

// Функция с повторными попытками запроса
async function retryRequest(url, body, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log("Отправляемый запрос:", JSON.stringify(body, null, 2));
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.data.parameters?.retry_after || 5;
        console.warn(`429 Too Many Requests, ждем ${retryAfter} секунд...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return; // Прерываем текущую попытку и пробуем заново
      } else {
        console.error(`Attempt ${attempt} failed:`, error.response ? error.response.data : error.message);
      }

      if (attempt === maxRetries) {
        console.error('Все попытки неудачны');
        return null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

export class TelegramCreationService {
  static async sendMessage({
    message,
    chatIds,
    threadIds = [],
    photos = [],
    adId,
    userId
  }) {
    try {
      const response = await axios.post(`${API_URL}/telegram/createAnnouncement`, {
        message,
        chatIds,
        threadIds,
        photos,
        adId,
        userId,
        server_salt: SERVER_SALT
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке объявления в Telegram:', error);
      return { success: false, message: error.message };
    }
  }

  static async updateAnnouncement({
    chatIds,
    messageIds,
    message,
    photos = [],
    adId,
    userId
  }) {
    try {
      const updatePromises = chatIds.map(async (chatId, index) => {
        const existingMessageId = messageIds[index];

        if (!existingMessageId) return;

        // Пытаемся обновить медиа-сообщение с caption
        if (photos.length > 0) {
          const editMediaUrl = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/editMessageMedia`;
          
          const mediaGroup = photos.map((imageUrl, index) => ({
            type: 'photo',
            media: getSafeImageUrl(imageUrl),
            ...(index === 0 ? { caption: message, parse_mode: "HTML" } : {})
          }));

          try {
            const editMediaBody = {
              chat_id: chatId,
              message_id: existingMessageId,
              media: mediaGroup[0]
            };

            const editMediaResponse = await axios.post(editMediaUrl, editMediaBody);

            if (editMediaResponse.status === 200) {
              return;
            }
          } catch (mediaError) {
            console.error('Ошибка обновления медиа:', mediaError.response ? mediaError.response.data : mediaError);
          }
        }

        // Если медиа не удалось обновить, пробуем обновить caption
        try {
          const editCaptionUrl = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/editMessageCaption`;
          
          const captionBody = {
            chat_id: chatId,
            message_id: existingMessageId,
            caption: message,
            parse_mode: "HTML"
          };

          const captionResponse = await axios.post(editCaptionUrl, captionBody);

          if (captionResponse.status === 200) {
            return;
          }
        } catch (captionError) {
          console.error('Ошибка обновления caption:', captionError.response ? captionError.response.data : captionError);
        }

        // Если caption не удалось обновить, пробуем обновить текст сообщения
        try {
          const editMessageUrl = `https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/editMessageText`;
          
          const textBody = {
            chat_id: chatId,
            message_id: existingMessageId,
            text: message,
            parse_mode: "HTML"
          };

          const textResponse = await axios.post(editMessageUrl, textBody);

          if (textResponse.status !== 200) {
            console.error(`Ошибка обновления текста сообщения ${existingMessageId}:`, textResponse.data);
          }
        } catch (textError) {
          console.error(`Ошибка при обновлении сообщения ${existingMessageId}:`, textError.response ? textError.response.data : textError);
        }
      });

      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      console.error('Ошибка при обновлении объявления в Telegram:', error);
      return { success: false, message: error.message };
    }
  }

  static async generateAnnouncementText(data) {
    const { title, content, price, username, user_id: userId } = data;
  
    const authorText = username
      ? `👤 <b>Автор объявления</b>: @${username}`
      : `👤 <b>Автор объявления</b>: <a href="tg://user?id=${userId}">ID</a>`;
  
    return `
📢 <b>Новое объявление</b> 📢
${escapeHTML(title)}
${separator}
${escapeHTML(content)}
${price ? `\n💰 <b>Цена</b>: ${escapeHTML(price.toString())} ₽` : ''}
${authorText}
🔗 <b>Посмотреть это объявление на сайте</b>: <a href="${generateAnnouncementUrl(data.id)}">Здесь</a>`.trim();
  }
  
}

export default TelegramCreationService;
