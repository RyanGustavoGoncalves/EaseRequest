import React, { useState } from "react";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birth, setBirth] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        await cadastrar();
        limpar();
    };

    const cadastrar = async () => {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            birth: birth,
        };

        console.log(data);

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            });

            if (response.status === 201) {
                console.log("Cadastro bem-sucedido!");
            } else if (response.status === 400) {
                const errorData = await response.json();
                const errorArray = [];

                // Mapeia os erros recebidos do backend para um formato mais legível
                for (const fieldName in errorData) {
                    const errorMessage = errorData[fieldName];
                    errorArray.push({ fieldName, errorMessage });
                }

                // Adiciona erro caso as senhas não sejam iguais
                // Certifique-se de ter os estados corretos para as senhas (password e inpConfSenha)
                // e substitua os valores corretos nos seguintes trechos
                if (password !== inpConfSenha) {
                    const passwordError = {
                        fieldName: "password",
                        errorMessage: "Senhas não são iguais!",
                    };
                    errorArray.push(passwordError);
                }

                // Exibe o modal de erro
                setModalOpacity({ display: "block" });
                setErrors(errorArray);
                setModal({ display: "block" });
            } else {
                console.log("Ocorreu um erro inesperado: " + response.status);
            }
        } catch (error) {
            console.log("Erro ao enviar a solicitação:", error);
            // Tratamento adicional de erro aqui, se necessário
        }
    };

    const limpar = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setBirth("");
    };

    return (
        <main className="registerMain">
            <fieldset>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>firstName</legend>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>lastName</legend>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>email</legend>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>password</legend>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>birth</legend>
                        <input
                            type="date"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                        />
                    </fieldset>
                    <button type="submit">Register</button>
                </form>
            </fieldset>
        </main>
    );
};

export default Register;
