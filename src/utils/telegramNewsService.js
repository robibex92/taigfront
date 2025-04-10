import axios from 'axios';
import { LIST_TELEGRAM_CHATS } from '../config/telegramChats';
import { announcementApi } from '../api/announcementApi';

const TELEGRAM_API_URL = process.env.REACT_APP_API_URL;
const SERVER_SALT = process.env.REACT_APP_SERVER_SALT;

const api = axios.create({
  baseURL: TELEGRAM_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function to escape Markdown V2 special characters
function escapeMarkdownV2(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\\/g, '\\\\')  // Сначала экранируем обратные слэши
    .replace(/([_*[\]()~`>#+\-={}|.!])/g, '\\$1')  // Экранируем все спецсимволы Markdown
    .replace(/\n/g, '\\n')   // Экранируем переносы строк
    .trim();  // Убираем лишние пробелы в начале и конце строки
}

function formatTelegramMessage(post) {
  const markerPrefix = post.marker === 'critical' ? '🚨 *ВАЖНОЕ* 🚨' :
                       post.marker === 'marketing' ? '📣 *Реклама*' :
                       '📝';

  const title = escapeMarkdownV2(post.title || '');
  const content = escapeMarkdownV2(post.content || '');

  return `${markerPrefix}\n🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸\n${title}\n🔸🔸🔸🔸🔸🔸🔸🔸🔸🔸\n${content}`;
}

// Функция для отправки новости в Telegram
export const sendPostToTelegram = async (post) => {
  // Validate post input
  if (!post || !post.id) {
    console.error('Ошибка: Некорректный пост', post);
    return { success: false, error: 'Invalid post data' };
  }

  // Validate post_id
  const postId = Number(post.id);
  if (isNaN(postId)) {
    console.error('Ошибка: post_id не является числом', post.id);
    return { success: false, error: 'Некорректный post_id' };
  }

  try {
    // Проверяем, был ли пост уже отправлен
    const existingMessages = await announcementApi.getTelegramMessages(postId);

    if (existingMessages && existingMessages.length > 0) {
      console.warn(`Пост ${postId} уже был отправлен ранее`);
      return { success: false, error: 'Message already sent' };
    }

    const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  
    // Validate bot token
    if (!botToken) {
      return { success: false, error: 'Missing bot token' };
    }

    // Validate chat list
    if (!Array.isArray(LIST_TELEGRAM_CHATS.NEWS_UPDATE) || LIST_TELEGRAM_CHATS.NEWS_UPDATE.length === 0) {
      return { success: false, error: 'No chats available' };
    }

    // Prepare message text with markdown escaping
    const messageText = formatTelegramMessage(post);

    // Enhance image URL to prevent caching issues
    const enhancedImageUrl = post.image_url 
      ? `${post.image_url}?v=${Date.now()}` 
      : null;

    // Send promises for каждого чата
    const sendPromises = LIST_TELEGRAM_CHATS.NEWS_UPDATE.map(async (chat, index) => {
      try {
        // Добавляем задержку между запросами
        if (index > 0) {
          await delay(1000); 
        }

        // Determine API endpoint and body based on image availability
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/${enhancedImageUrl ? 'sendPhoto' : 'sendMessage'}`;
        
        // Формируем тело запроса
        const body = {
          chat_id: chat.id,
          parse_mode: 'MarkdownV2',
          ...(chat.threadId && { message_thread_id: chat.threadId }) // Добавляем threadId, если он есть
        };

        // Добавляем параметры в зависимости от типа сообщения
        if (enhancedImageUrl) {
          body.photo = enhancedImageUrl;
          body.caption = messageText;
        } else {
          body.text = messageText;
        }

        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        const result = await response.json();

        if (!result.ok) {
          console.error(`Telegram API Error for chat ${chat.id}:`, result);
          throw new Error(`Telegram API Error: ${JSON.stringify(result)}`);
        }

        const messageId = result.result.message_id; 

        // Сохраняем информацию о сообщении с учетом thread_id
        await updateMessageIdInDatabase(postId, messageId, chat);

        return result;
      } catch (error) {
        console.error(`Ошибка при отправке в чат ${chat.id}:`, error);
        return null;
      }
    });

    // Use Promise.allSettled to handle individual promise failures
    const results = await Promise.allSettled(sendPromises);

    // Check overall success
    const successfulResults = results.filter(result => result.status === 'fulfilled' && result.value !== null);
    const failedResults = results.filter(result => result.status === 'rejected' || result.value === null);

    return {
      success: successfulResults.length > 0,
      successCount: successfulResults.length,
      failedCount: failedResults.length,
      error: failedResults.length > 0 ? 'Некоторые сообщения не были отправлены' : null
    };

  } catch (error) {
    console.error('Критическая ошибка при отправке поста:', error);
    return { 
      success: false, 
      error: error.message || 'Неизвестная ошибка при отправке поста' 
    };
  }
};

// Функция для обновления message_id в базе данных
const updateMessageIdInDatabase = async (postId, messageId, chat) => {
  try {
    await announcementApi.createTelegramMessage({
      chat_id: chat.id,
      message_id: messageId,
      post_id: postId,
      thread_id: chat.threadId || null,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при обновлении сообщения в базе данных:', error);
  }
};

// Функция для удаления сообщений поста при смене статуса на "inactive"
export const deleteInactivePostMessages = async (postId) => {
  try {
    // Получаем информацию о посте
    const post = await announcementApi.getAnnouncement(postId);

    // Удаляем сообщения из всех чатов NEWS_UPDATE
    const deletePromises = LIST_TELEGRAM_CHATS.NEWS_UPDATE.map(async (chat) => {
      try {
        const response = await fetch(`https://api.telegram.org/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/deleteMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chat.id,
            message_id: post.message_id 
          })
        });

        return await response.json();
      } catch (error) {
        return null;
      }
    });

    // Ожидаем результаты всех удалений
    const results = await Promise.all(deletePromises);

    return {
      success: results.every(result => result && result.ok),
      results
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Функция для задержки
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendNewsToTelegram = async (news) => {
  try {
    const response = await api.post('/telegram/news', {
      ...news,
      salt: SERVER_SALT
    });
    return response.data;
  } catch (error) {
    console.error('Error sending news to Telegram:', error);
    throw error;
  }
};

export const sendUpdateToTelegram = async (update) => {
  try {
    const response = await api.post('/telegram/update', {
      ...update,
      salt: SERVER_SALT
    });
    return response.data;
  } catch (error) {
    console.error('Error sending update to Telegram:', error);
    throw error;
  }
};

export default {
  sendNewsToTelegram,
  sendUpdateToTelegram
};
