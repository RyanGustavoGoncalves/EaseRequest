import React, { useState } from "react";
import '../components/style.css'
import img from '../assets/imgFront2.png';
import imgError from '../assets/icons8-erro-48 (1).png';

const Login = ({ toggleForm }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState([]);

    const [modal, setModal] = useState({ display: 'none' });
    const [modalOpacity, setModalOpacity] = useState({ display: 'none' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        await cadastrar();
        limpar();
    };

    const closeModalOpacity = () => {
        setModalOpacity({ display: 'none' });
        setModal({ display: 'none' });
    };

    const limpar = () => {
        setUsername('');
        setPassword('');
    };

    const cadastrar = async () => {
        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const responseJson = await response.json();
                const token = responseJson.token;
                console.log(token);
                console.log("Login bem sucedido!");
                localStorage.setItem('token', token);
                window.location.href = `http://localhost:5173/welcome`;
            } else if (response.status === 401) {
                const error = await response.json(Error);
                console.log(error);
                setErrors([error]);
                setModalOpacity({ display: 'block' });
                setModal({ display: 'block' });
            } else {
                console.log("Ocorreu um erro inesperado: " + response.status);
            }
        } catch (error) {
            console.error("Erro ao enviar a solicitação:", error);
        }
    };

    const handleInputFocus = (labelId) => {
        const label = document.getElementById(labelId);
        label.classList.add('active');
    };

    const handleInputBlur = (labelId) => {
        const label = document.getElementById(labelId);
        const input = document.getElementById(labelId.replace('Label', '')); // Obtém o input associado ao label

        if (input && input.value.trim() !== '') {
            label.classList.add('active');
            return;
        }

        label.classList.remove('active');
    };

    return (
        <section>
            <fieldset className="authFieldset">
                <form onSubmit={handleSubmit} className="authForm">
                    <div className="authFieldLogin">
                        <label id="usernameLabel" className={username ? 'active' : ''} htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onMouseEnter={() => handleInputFocus('usernameLabel')}
                            onMouseLeave={() => handleInputBlur('usernameLabel')}

                        />
                    </div>
                    <div className="authFieldLogin">
                        <label id="passwordLabel" className={password ? 'active' : ''} htmlFor="password">password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onMouseEnter={() => handleInputFocus('passwordLabel')}
                            onMouseLeave={() => handleInputBlur('passwordLabel')}
                        />
                    </div>
                    <div className="btn">
                        <button type="submit">Login</button>
                        <a onClick={toggleForm}>
                            <span>Don't have registration? register now!</span>
                        </a>
                    </div>
                </form>
                <div className="imgFront"><img src={img} alt="authentication" /></div>
                <div className="modal" style={{ display: modal.display }}>
                    <div className="errorModal">
                        <div className="errorIcon">
                            <img src={imgError} alt="Error" />
                            <h2>Erro!</h2>
                        </div>
                        <hr />
                        <div className="errorMessages">
                            {errors.map((erro, index) => (
                                <div key={index}>
                                    <strong>{erro.Error}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Modal de fundo */}
                <div className="modalOpacity" onClick={closeModalOpacity} style={{ display: modalOpacity.display }}></div>
            </fieldset>
        </section>
    );
};

export default Login;
