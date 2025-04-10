import React, { useEffect, useRef } from 'react';

const TelegramLoginButton = ({ botName, onAuth, buttonSize = 'large', requestAccess = 'write', cornerRadius = 8 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Удаляем предыдущий скрипт, если он существует
    const existingScript = document.getElementById('telegram-login-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Создаем глобальную функцию для обработки авторизации
    window.onTelegramAuth = (user) => {
      // Логируем полученные данные для отладки
      console.log('Telegram user data:', user);

      // Проверяем, что данные пользователя содержат обязательные поля
      if (!user.id || !user.username) {
        console.error('Invalid Telegram user data:', user);
        return;
      }

      // Передаем данные в родительскую компоненту
      onAuth(user);
    };

    // Создаем и добавляем скрипт
    const script = document.createElement('script');
    script.id = 'telegram-login-script';
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', requestAccess);
    script.setAttribute('data-radius', cornerRadius);
    script.setAttribute('data-debug', 'true');

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Очистка при размонтировании
    return () => {
      if (existingScript) {
        existingScript.remove();
      }
      delete window.onTelegramAuth;
    };
  }, [botName, onAuth, buttonSize, requestAccess, cornerRadius]);

  return <div ref={containerRef}></div>;
};

export default TelegramLoginButton;
