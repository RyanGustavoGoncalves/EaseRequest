export const tokenCheckAndUpdatePassword = async (tokenMailLabel, token, setModalLabelAndPassword, setUpdateModal) => {
    console.log(tokenMailLabel)
    try {
        const response = await fetch("http://localhost:8080/update-password/confirm-reset", {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(tokenMailLabel),
        });

        if (response.ok) {
            alert("Atualizado com sucesso!");
        } else {
            console.log("Ocorreu um erro ao gerar o token:", response.status);
            const errorMessage = await response.text(); // Obtém o corpo da resposta em caso de erro
            alert(`Erro ao gerar o token: ${errorMessage}`);
            setModalLabelAndPassword(false);
            setUpdateModal(true);
        }
    } catch (error) {
        console.log("Erro ao gerar o token:", error);
        alert("Erro ao gerar o token. Por favor, tente novamente mais tarde.");
    }
}