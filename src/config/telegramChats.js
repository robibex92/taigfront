export const TELEGRAM_CHATS = {
  // Основные группы и каналы
  GENERAL: {
    id: '-1002609427061',
    name: 'general',
    type: 'group'
  },
  MAIN_GROUP: {
    id: '-1002609427061',
    threadId: '2',
    name: 'Купи',
    type: 'group'
  },
  ANNOUNCEMENTS: {
    id: '-1002609427061', // Можно указать отдельный чат для объявлений
    threadId: '3',
    name: 'Новости',
    type: 'group'
  },
  FLOOD_TWO_HOUSES: {
    id: '-1001922890501',
    name: 'Болталка двух домов',
    type: 'group'
  },
  ADS_TWO_HOUSES: {
    id: '-1001922890501',
    threadId: '1588',
    name: 'Купи продай тайгинский парк.',
    type: 'group'
  },
  ADS_THIRTY_NINE: {
    id: '-1001935812136',
    threadId: '5541',
    name: 'Купи/продай, отдам даром',
    type: 'group'
  },
  GENERAL_THIRTY_NINE: {
    id: '-1001935812136',
    threadId: '5543',
    name: 'чат Общие вопросы дома 39',
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
  ANNOUNCEMENT_UPDATE: [
    //TELEGRAM_CHATS.GENERAL,
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
