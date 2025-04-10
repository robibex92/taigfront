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
