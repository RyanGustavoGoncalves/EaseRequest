# Documentação do Código - HomeSecurity e Home Component:

1. Importações:
React e Hooks:
Importação do React e dos hooks useState e useEffect.
Imagens e Estilos:
Importação de imagens e estilos necessários para o componente.
React Router:
Importação do componente Link do React Router.
Componentes Personalizados:
Importação dos componentes Modal e InputField de locais específicos.

2. Constantes Iniciais:
Token:
Recuperação do token armazenado no localStorage.
Estados:
Declaração dos estados iniciais usando o hook useState.

3. Efeito de Expansão do Campo de Descrição:
isExpanded:
Estado para controlar a expansão do campo de descrição.
Utilizado no clique para expandir ou contrair a descrição.

4. Estados do Modal:
modalIsOpen, modalConfirmIsOpen, modalUpdateIsOpen, modalDeleteIsOpen, modalFilterIsOpen:
Estados para controlar a abertura e fechamento de diferentes modais.
Utilizados nas funções openModal, closeModal, etc.

5. Estados de Filtro e Pesquisa:
searchTerm, filterCriteria, selectedStatus:
Estados para controlar os termos de pesquisa, critérios de filtro e status selecionados.
Utilizados para filtrar as solicitações exibidas.

6. Estados Relacionados a Requisições e Usuários:
toolBoxes, loading, formData, singleRequest, editedRequest, requestsLoaded:
Estados relacionados às solicitações e seus detalhes.
Utilizados para renderizar as solicitações e gerenciar modificações.

7. Funções Auxiliares:
focusDescription:
Função para alternar o estado isExpanded ao clicar na descrição.
8. Efeito para Buscar Solicitações:
useEffect para fetchRequests:
Efeito que é acionado quando requestsLoaded é falso.
Realiza uma chamada à API para buscar as solicitações.

9. Intervalo de Atualização Automática:
useEffect para Atualização Automática:
Efeito que aciona a função fetchRequests a cada 5 segundos.

10. Função de Busca de Solicitações:
fetchRequests:
Realiza uma chamada à API para obter as solicitações e atualiza o estado toolBoxes com os dados recebidos.

11. Funções de Controle do Modal:
openModal, closeModal, openModalConfirm, ...:
Funções para abrir e fechar diferentes modais.
Controlam também o overflow do corpo do documento.

12. Função para Adicionar Nova Solicitação:
handleAddBox:
Adiciona uma nova solicitação ao estado toolBoxes e limpa o estado formData.

13. Funções de Manipulação de Inputs:
handleInputFocus, handleInputBlur:
Funções para manipular o foco e desfoque dos campos de entrada.

14. Função de Salvamento de Nova Solicitação:
handleSave:
Atualiza o estado formData com os valores dos campos de entrada e chama a função newRequest para enviar a nova solicitação à API.

15. Função de Manipulação de Pesquisa:
handleSearch:
Atualiza o estado searchTerm com o valor do campo de pesquisa.

16. Função para Criar Nova Solicitação:
newRequest:
Envia uma nova solicitação à API com base nos dados em formData.

17. Funções para Atualizar e Deletar Solicitação:
updateRequest, deleteRequest:
Atualiza ou deleta uma solicitação existente na API.

18. Função para Buscar Solicitação por ID:
fetchRequestById:
Busca uma solicitação específica na API com base no ID.

19. Função para Manipular Mudanças de Status:
handleStatusChange:
Adiciona ou remove um status da lista selectedStatus ao ser marcado ou desmarcado.

20. Função para Calcular a Diferença de Tempo:
calculateTimeDifference:
Calcula a diferença de tempo entre a data atual e uma data de lançamento.

21. Função para Obter a Classe de Status:
getStatusClass:
Retorna uma classe de estilo com base no status da solicitação.

22. Renderização do Componente:
return(...):
Estrutura JSX que renderiza o componente.

23. Estilização Inline:
Estilos CSS incorporados diretamente no JSX para posicionamento e formatação.