// Карта соответствия текстовых описаний цветов и их HEX-кодов
export const COLOR_MAP = {
  'белый': '#FFFFFF', 'white': '#FFFFFF',
  'черный': '#000000', 'black': '#000000',
  'серый': '#808080', 'gray': '#808080', 
  'silver': '#C0C0C0', 'серебристый': '#C0C0C0',
  'синий': '#0000FF', 'blue': '#0000FF', 
  'красный': '#FF0000', 'red': '#FF0000',
  'зеленый': '#008000', 'green': '#008000',
  'желтый': '#FFFF00', 'yellow': '#FFFF00',
  'коричневый': '#A52A2A', 'brown': '#A52A2A',
  'бежевый': '#F5F5DC', 'beige': '#F5F5DC',
  'оранжевый': '#FFA500', 'orange': '#FFA500',
  'фиолетовый': '#800080', 'purple': '#800080',
  'розовый': '#FFC0CB', 'pink': '#FFC0CB'
};

export const getColorFromDescription = (description) => {
  // Возвращает HEX-цвет для SVG и фона

  if (!description) return '#808080';

  const normalizedColor = String(description).toLowerCase().trim();
  
  // Проверяем точное совпадение
  if (COLOR_MAP[normalizedColor]) {
    return COLOR_MAP[normalizedColor];
  }

  // Ищем по ключевым словам
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (normalizedColor.includes(key)) {
      return value;
    }
  }

  return '#808080'; // Цвет по умолчанию - серый
};

// Получить русский цвет по описанию или английскому названию
export const getRussianColorName = (description) => {
  if (!description) return '';
  const normalizedColor = String(description).toLowerCase().trim();
  // Карта английских -> русских
  const colorMapRu = {
    'white': 'белый',
    'black': 'черный',
    'gray': 'серый',
    'silver': 'серебристый',
    'blue': 'синий',
    'red': 'красный',
    'green': 'зеленый',
    'yellow': 'желтый',
    'brown': 'коричневый',
    'beige': 'бежевый',
    'orange': 'оранжевый',
    'purple': 'фиолетовый',
    'pink': 'розовый',
    'серебристый': 'серебристый',
    'белый': 'белый',
    'черный': 'черный',
    'серый': 'серый',
    'синий': 'синий',
    'красный': 'красный',
    'зеленый': 'зеленый',
    'желтый': 'желтый',
    'коричневый': 'коричневый',
    'бежевый': 'бежевый',
    'оранжевый': 'оранжевый',
    'фиолетовый': 'фиолетовый',
    'розовый': 'розовый',
  };
  // Точное совпадение
  if (colorMapRu[normalizedColor]) return colorMapRu[normalizedColor];
  // По подстроке
  for (const [key, value] of Object.entries(colorMapRu)) {
    if (normalizedColor.includes(key)) return value;
  }
  return description;
};

