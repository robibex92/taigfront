import React, { useEffect } from "react";

const AuthButton = ({ onAuth }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute("data-telegram-login", "YourBotName"); // Замените на имя вашего бота
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "handleTelegramAuth");
    script.async = true;
    document.body.appendChild(script);

    window.handleTelegramAuth = (user) => {
      onAuth(user);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuth]);

  return <div id="telegram-auth-button" />;
};

export default AuthButton;
