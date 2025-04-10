import React from 'react';

const Login = () => {
  return (
    <div>
      <h2>Вход</h2>
      <form>
        <input type="text" placeholder="Логин" />
        <input type="password" placeholder="Пароль" />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Login; 