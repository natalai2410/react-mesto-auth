import React from "react";
import {Link} from "react-router-dom";

function Register({onRegister}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleLoginChange(e) {
        setEmail(e.target.value);
    }

    function handleLoginPassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onRegister(email, password);
    }

    return (
        <section className="login">
            <h2 className="login__title">Регистрация</h2>
            <form className="login__form" onSubmit={handleSubmit} name='form-register'>
                <input className="login__input"
                       type="email"
                       placeholder="Email"
                       value={email}
                       required
                       onChange={handleLoginChange}
                />
                <input className="login__input"
                       type="password"
                       placeholder="Пароль"
                       value={password}
                       required
                       onChange={handleLoginPassword}
                />
                <button className="login__btn" type="submit">Зарегистрироваться</button>
            </form>
            <p className="login__text">Уже зарегистрированы? <Link to="/signin" className="login__link">Войти</Link></p>
        </section>
    )
}

export default Register;