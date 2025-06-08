export const TELEGRAM_CHATS = {
  // Основные группы и каналы
  GENERAL: {
    id: '-1002609427061',
    name: 'general чат в тестовой группе',
    type: 'group'
  },
  MAIN_GROUP: {
    id: '-1002609427061',
    threadId: '2',
    name: 'Купи/продай, отдам даром чат в тестовой группе',
    type: 'group'
  },
  ANNOUNCEMENTS: {
    id: '-1002609427061', // Можно указать отдельный чат для объявлений
    threadId: '3',
    name: 'Новости чат в тестовой группе',
    type: 'group'
  },
  FLOOD_TWO_HOUSES: {
    id: '-1001922890501',
    name: 'Чат болталки двух домов',
    type: 'group'
  },
  ADS_TWO_HOUSES: {
    id: '-1001922890501',
    threadId: '1588',
    name: 'Чат купи/продай двух домов',
    type: 'group'
  },
  ADS_THIRTY_NINE: {
    id: '-1001935812136',
    threadId: '5541',
    name: 'Чат купи/продай 39 дома',
    type: 'group'
  },
  GENERAL_THIRTY_NINE: {
    id: '-1001935812136',
    threadId: '5543',
    name: 'Чат Общие вопросы 39 дома',
    type: 'group'
  },

  THIRTY_NINE_TWO: {
    id: '-1001992407628',
    name: 'Чат 2 секции',
    type: 'group'
  },
  THIRTY_NINE_SEVEN: {
    id: '-1002030238237',
    name: 'Чат 7 секции',
    type: 'group'
  }
};

// Группы по умолчанию для различных событий
export const LIST_TELEGRAM_CHATS = {
  // Список чатов для обновления объявлений
  POSTS_ALL: [
    TELEGRAM_CHATS.GENERAL,
    TELEGRAM_CHATS.MAIN_GROUP
  ],
  ADS_ALL: [
    TELEGRAM_CHATS.GENERAL,
    TELEGRAM_CHATS.MAIN_GROUP
  ],
  ANNOUNCEMENT_UPDATE_GENERAL: [
    TELEGRAM_CHATS.ADS_TWO_HOUSES,
    TELEGRAM_CHATS.ADS_THIRTY_NINE
  ],

  NEWS_UPDATE: [
    TELEGRAM_CHATS.FLOOD_TWO_HOUSES,
    TELEGRAM_CHATS.GENERAL_THIRTY_NINE,
    TELEGRAM_CHATS.THIRTY_NINE_TWO,
    TELEGRAM_CHATS.THIRTY_NINE_SEVEN
  ]
};
