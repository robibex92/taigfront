export const validateInput = (value, rules) => {
  let isValid = true;
  let errors = [];

  if (rules.required && !value) {
    isValid = false;
    errors.push('Это поле обязательно для заполнения');
  }

  if (rules.minLength && value.length < rules.minLength) {
    isValid = false;
    errors.push(`Минимальная длина ${rules.minLength} символов`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    isValid = false;
    errors.push('Неверный формат');
  }

  return { isValid, errors };
}; 