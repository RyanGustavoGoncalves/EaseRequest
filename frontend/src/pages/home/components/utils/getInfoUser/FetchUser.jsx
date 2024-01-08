import { useEffect } from "react";

export const FetchUser = async (token, setUserData) => {
    try {
        const response = await fetch("http://localhost:8080/user/token", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const responseData = await response.json();

            if (responseData && responseData) {
                setUserData(responseData);
            } else {
                console.error("A resposta não contém um nome de usuário válido:", responseData);
            }
        } else {
            console.log("Ocorreu um erro inesperado ao buscar as informações do usuário: " + response.status);
        }
    } catch (error) {
        console.log("Erro ao buscar as informações do usuário:", error);
        alert("Erro ao buscar as informações do usuário. Por favor, tente novamente mais tarde.");
    }
};

