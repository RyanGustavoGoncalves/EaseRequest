export const FileChange = async (e, token) => {
    const fileInput = e.target;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                // Faça a requisição para o endpoint de atualização de imagem
                const response = await fetch('http://localhost:8080/updateUserImage', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Adicione o token de autenticação
                    },
                    body: formData,
                });

                if (response.ok) {
                    // Atualize o estado ou faça outras ações necessárias
                    console.log('Imagem do usuário atualizada com sucesso!');
                } else {
                    // Lide com erros de resposta
                    console.error('Erro ao atualizar imagem do usuário:', response.status);
                }
            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
            }
        }
    }
};
