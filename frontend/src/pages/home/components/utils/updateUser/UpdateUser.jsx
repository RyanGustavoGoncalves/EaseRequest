export const updateUser = async (editUser, token, setUserData) => {
    try {
        const response = await fetch("http://localhost:8080", {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(editUser),
        });

        if (response.status === 200) {
            const responseData = await response.json();
            if (responseData && responseData) {
                setUserData(responseData);
                alert("Update realizado com sucesso!");
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
