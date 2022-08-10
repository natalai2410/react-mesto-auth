import { useState } from "react";

function Login({onLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLoginChange(e) {
        setEmail(e.target.value);
    }

    function handleLoginPassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password) {
            return;
        }
        //вызываем фунцию onLogin и передаем в нее  данные  для  вход
        onLogin(email, password);

    }

    return (
        <section className="login">
            <h2 className="login__title">Вход</h2>
            <form className="login__form" onSubmit={handleSubmit} name='form-login'>
                <input className="login__input"
                       type="email"
                       placeholder="Email"
                       value={email}
                       required
                       onChange={ handleLoginChange}
                />
                <input className="login__input"
                       type="password"
                       placeholder="Пароль"
                       value={password}
                       required
                       onChange={ handleLoginPassword}
                />
                <button className="login__btn" type="submit">Войти</button>
            </form>
        </section>
    );
}

export default Login;