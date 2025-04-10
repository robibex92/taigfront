export const formatDate = (date) => {
  if (!date) return "Дата не указана"; // Если дата отсутствует
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.warn("Invalid date value:", date);
    return "Некорректная дата";
  }
  return parsedDate.toLocaleDateString(); // Форматируйте дату по вашему усмотрению
};
