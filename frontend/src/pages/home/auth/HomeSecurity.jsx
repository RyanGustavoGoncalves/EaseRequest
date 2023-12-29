import React, { useState, useEffect } from "react";
import wave from '../assets/wave(1).svg';
import '../components/style.css';
import '../components/style.css';
import mais from '../assets/mais(1).png';
import lupa from '../assets/lupa.png';
import { Link } from "react-router-dom";
import Modal from '../../components/Modal';
import InputField from "../components/InputField";

const HomeSecurity = () => {
    const token = localStorage.getItem('token');
    const [toolBoxes, setToolBoxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        problem: "",
        description: "",
        priority: "",
        status: "",
        creationRequest: "",
        user: [{
            idUsers: "",
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            role: "",
        }]
    });

    const [isExpanded, setExpanded] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState(false);
    const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [requestsLoaded, setRequestsLoaded] = useState(false);
    const [singleRequest, setSingleRequest] = useState({});
    const [editedRequest, setEditedRequest] = useState({
        id: "",
        problem: "",
        description: "",
        priority: "",
        status: "",
    });
    const [sortedToolBoxes, setSortedToolBoxes] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState('');

    // Simulando os dados iniciais
    useEffect(() => {
        const initialToolBoxes = [
            { id: 1, priority: 'HIGH', problem: 'Issue 1' },
            { id: 2, priority: 'MEDIUM', problem: 'Issue 2' },
            { id: 3, priority: 'LOW', problem: 'Issue 3' },
            {id: 4, priority: 'PENDING', problem: 'Issue 4'}
            // Adicione mais dados conforme necessário
        ];

        setToolBoxes(initialToolBoxes);
        setSortedToolBoxes(initialToolBoxes); // Inicialmente, exibe todos os itens sem ordenação
    }, []);

    // Atualizar a lista ordenada sempre que o critério de filtro ou as caixas de ferramentas mudarem
    useEffect(() => {
        updateSortedToolBoxes();
    }, [filterCriteria, toolBoxes]);

    // Função para atualizar a lista ordenada com base no critério de filtro
    const updateSortedToolBoxes = () => {
        let updatedSortedToolBoxes = [...toolBoxes];

        if (filterCriteria) {
            // Filtrar os itens com base no critério
            updatedSortedToolBoxes = toolBoxes.filter((box) => box.priority === filterCriteria);
            // Adicionar os itens restantes que não correspondem ao critério
            const remainingItems = toolBoxes.filter((box) => box.priority !== filterCriteria);
            updatedSortedToolBoxes = updatedSortedToolBoxes.concat(remainingItems);
        }

        setSortedToolBoxes(updatedSortedToolBoxes);
    };

    const focusDescription = () => {
        setExpanded(!isExpanded);
    };

    useEffect(() => {
        if (!requestsLoaded) {
            fetchRequests();
        }
    }, [requestsLoaded]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log(token);
            fetchRequests();
        }, 5000); // Consulta a cada 5 segundos (ajuste conforme necessário)

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado

    }, []);

    //Request get para mostrar requisições guardadas no banco de dados
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/request", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const responseData = await response.json();

                if (Array.isArray(responseData.content)) {
                    // Mapeie as solicitações e inclua os dados do usuário
                    const updatedToolBoxes = responseData.content.map(box => {
                        return {
                            ...box,
                            user: box.user, // Ajuste o nome do campo aqui
                        };
                    });

                    setToolBoxes(updatedToolBoxes);
                    setRequestsLoaded(true);
                } else {
                    console.error("A resposta não contém uma matriz válida:", responseData);
                }
            }
        } catch (error) {
            console.log("Erro ao buscar as solicitações:", error);
        } finally {
            setLoading(false);
        }
    };


    //Modal Functions
    const openModal = () => {
        document.body.style.overflow = "hidden";
        setModalIsOpen(true);
    };

    const closeModal = () => {
        document.body.style.overflow = "auto";
        setModalIsOpen(false);
    };

    const openModalConfirm = (id) => {
        document.body.style.overflow = "hidden";
        fetchRequestById(id)
        setModalConfirmIsOpen(true);
    };

    const closeModalConfirm = () => {
        document.body.style.overflow = "auto";
        setModalConfirmIsOpen(false);
    };

    const openModalUpdate = (id) => {
        document.body.style.overflow = "hidden";
        fetchRequestById(id);
        setEditedRequest({ ...singleRequest });
        console.log(editedRequest);
        setModalUpdateIsOpen(true);
    };

    const closeModalUpdate = () => {
        document.body.style.overflow = "auto";
        setModalUpdateIsOpen(false);
    };

    const openModalDelete = (id) => {
        document.body.style.overflow = "hidden";
        fetchRequestById(id)
        setModalDeleteIsOpen(true);
    };

    const closeModalDelete = () => {
        document.body.style.overflow = "auto";
        setModalDeleteIsOpen(false);
        closeModalConfirm(false);
    };

    const handleAddBox = () => {
        setToolBoxes([...toolBoxes, formData]);
        setFormData({
            id: "",
            problem: "",
            description: "",
            priority: "",
            status: "",
            creationRequest: "",
            user: [{
                idUsers: "",
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                role: "",
            }]
        });
        closeModal();
    };

    //Function para animação do input do modal
    const handleInputFocus = (labelId) => {
        const label = document.getElementById(labelId);
        label.classList.add('active');
    };

    const handleInputBlur = (labelId) => {
        const label = document.getElementById(labelId);
        const input = document.getElementById(labelId.replace('Label', ''));

        if (input && input.value.trim() !== '') {
            label.classList.add('active');
            return;
        }

        label.classList.remove('active');
    };

    const handleSave = () => {
        setFormData({
            ...formData,
            problem: document.getElementById("problem").value,
            description: document.getElementById("description").value,
            priority: document.getElementById("priority").value,
            status: document.getElementById("status").value
        });
        newRequest();
        handleAddBox();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    //Request para salvar um nova requisição
    const newRequest = async () => {
        const data = {
            problem: formData.problem,
            description: formData.description,
            priority: formData.priority,
            status: formData.status
        };

        try {
            const response = await fetch("http://localhost:8080/request", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                method: "POST",
                body: JSON.stringify(data),
            });

            if (response.status === 201) {
                alert("Cadastro bem-sucedido!");
            } else if (response.status === 400) {
                const errorData = await response.json();
                const errorArray = [];

                for (const fieldName in errorData) {
                    const errorMessage = errorData[fieldName];
                    errorArray.push({ fieldName, errorMessage });
                }

            } else {
                console.log("Ocorreu um erro inesperado: " + response.status);
            }
        } catch (error) {
            console.log("Erro ao enviar a solicitação:", error);
        }
    };

    const updateRequest = async (editedRequest) => {
        console.log(editedRequest);
        try {
            const response = await fetch(`http://localhost:8080/request/${editedRequest.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editedRequest),
            });

            if (response.ok) {
                // Atualização bem-sucedida
                console.log('Solicitação atualizada com sucesso!');
                // Atualize o estado de singleRequest para refletir as alterações
                setSingleRequest({ ...editedRequest });
                closeModalUpdate(); // Feche o modal após a atualização
            } else {
                // Lidar com erros de resposta
                console.error('Erro ao atualizar a solicitação:', response.status);
            }
        } catch (error) {
            // Lidar com erros de rede ou outros erros
            console.error('Erro ao fazer a solicitação de atualização:', error);
        }
    };

    const deleteRequest = async (editedRequest) => {
        console.log(editedRequest);
        try {
            const response = await fetch(`http://localhost:8080/request/${editedRequest.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {

                console.log('Request deletada com sucesso!');
                closeModalUpdate();
            } else {

                console.error('Erro ao deletar a request:', response.status);
            }
        } catch (error) {
            // Lidar com erros de rede ou outros erros
            console.error('Erro ao fazer a solicitação delete:', error);
        } finally {
            closeModalDelete();
        }
    };

    const fetchRequestById = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/request/${id}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const responseData = await response.json();

                // Log da resposta para análise
                console.log("Resposta da API:", responseData);

                // Certifica-se de que 'content' é um objeto antes de definir 'singleRequest'
                if (responseData && typeof responseData === 'object') {
                    // Aqui, você pode lidar com a resposta do endpoint específico
                    // Por exemplo, definir um estado no React para armazenar a solicitação única

                    // Extraia os dados do usuário e adicione-os à solicitação única
                    const user = responseData.user; // Supondo que os dados do usuário estejam em "users"
                    const updatedSingleRequest = {
                        ...responseData,
                        user: user,
                    };

                    setSingleRequest(updatedSingleRequest);
                } else {
                    console.error("A resposta não contém um objeto válido:", responseData);
                }
            } else if (response.status === 404) {
                console.log("Solicitação não encontrada");
                // Lidar com o caso em que a solicitação não foi encontrada
            } else {
                console.log("Ocorreu um erro inesperado: " + response.status);
            }
        } catch (error) {
            console.log("Erro ao buscar a solicitação:", error);
        }
    };

    // Movendo a declaração para o local apropriado
    const filteredAndSortedToolBoxes = Array.isArray(toolBoxes)
        ? toolBoxes
            .filter((box) => box.problem.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                // Ordena com base na prioridade (HIGH, MEDIUM, LOW)
                const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
        : [];


    return (
        <section className="homeSection">
            <div className="wave">
                <img src={wave} alt="" />
            </div>
            <div className="subNav">
                <h1>ADMIN</h1>
                <div className="searchRequest">
                    <div className="lupaSearch">
                        <img src={lupa} alt="Search" />
                        <input
                            type="text"
                            placeholder="Search.."
                            onChange={handleSearch}
                            value={searchTerm}
                            title="Search"
                        />
                        <div className="addBtn">
                            <button onClick={openModal} title="Add">Add</button>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="filterPriority">Filter by Priority:</label>
                                <select
                                    id="filterPriority"
                                    value={filterCriteria}
                                    onChange={(e) => setFilterCriteria(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="LOW">LOW</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="homeDescript">
                <div className="boxTools">
                    <div className="tool" onClick={openModal}>
                        <h2>Create new Request</h2>
                        <img src={mais} alt="Add" width={40} />
                    </div>
                    {filteredAndSortedToolBoxes.map((box, index) => (
                        // Verifica se o item atende aos critérios de filtro antes de renderizá-lo
                        (filterCriteria === '' || box.priority === filterCriteria) && (
                            <div key={index} className="tool" onClick={() => openModalConfirm(box.id)}>
                                {loading ? (
                                    <div className="loading-overlay">Carregando...</div>
                                ) : (
                                    <>
                                        <p>Request ID: {box.id}</p>
                                        <h2>{box.problem}</h2>
                                        <p>{box.priority}</p>
                                        <p>{box.status}</p>
                                        <p>{box.creationRequest}</p>
                                        {/* Adicione uma verificação condicional para box.user */}
                                        <p>User ID: {box.user ? box.user.idUsers : 'N/A'}</p>
                                    </>
                                )}
                            </div>
                        )
                    ))}
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onClose={closeModal}>
                <div className="toolConfig">
                    <InputField
                        id="problem"
                        label="Problem"
                        value={formData.problem}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                        onMouseEnter={() => handleInputFocus('problemLabel')}
                        onMouseLeave={() => handleInputBlur('problemLabel')}
                    />

                    <InputField
                        id="description"
                        label="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        onMouseEnter={() => handleInputFocus('descriptionLabel')}
                        onMouseLeave={() => handleInputBlur('descriptionLabel')}
                    />

                    <div className="authField">
                        <select className="selectHome" id="priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} required>
                            <option value="">Priority</option>
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>
                    </div>

                    <div className="authField">
                        <select className="selectHome" id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} required>
                            <option value="">Status</option>
                            <option value="FINISH">FINISH</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="PENDING">PENDING</option>
                        </select>
                    </div>

                    <div className="btnSave">
                        <button onClick={handleSave}>Salvar</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modalConfirmIsOpen} onClose={closeModalConfirm}>
                <div className="singleRequest">
                    <p>
                        <span>ID:</span> {singleRequest.id}
                    </p>

                    <p>
                        <span>Problem:</span> {singleRequest.problem}
                    </p>

                    <p style={{ cursor: "pointer" }} onClick={focusDescription}>
                        <span>Description:</span> {isExpanded ? <div className="focusDesc">{singleRequest.description}</div> : <>[EXTEND]</>}
                    </p>

                    <p>
                        <span>Priority:</span> {singleRequest.priority}
                    </p>

                    <p>
                        <span>Status:</span> {singleRequest.status}
                    </p>

                    <p>
                        <span>Date request:</span> {singleRequest.creationRequest}
                    </p>

                    <p>
                        <span>ID:</span> {singleRequest.user ? singleRequest.user.idUsers : 'N/A'}

                    </p>

                    <p>
                        <span>Username:</span> {singleRequest.user ? singleRequest.user.username : 'N/A'}
                    </p>

                    <p>
                        <span>First Name:</span> {singleRequest.user ? singleRequest.user.firstName : 'N/A'}
                    </p>

                    <p>
                        <span>Last Name:</span> {singleRequest.user ? singleRequest.user.lastName : 'N/A'}
                    </p>

                    <p>
                        <span>Email:</span> {singleRequest.user ? singleRequest.user.email : 'N/A'}
                    </p>

                </div>
                <div className="btnSave">
                    <button onClick={() => openModalUpdate(singleRequest.id)}>Update!</button>
                </div>
            </Modal>

            <Modal isOpen={modalUpdateIsOpen} onClose={closeModalUpdate}>
                <div className="singleRequest">
                    <p>
                        <span>ID:</span> {singleRequest.id}
                    </p>
                </div>

                <InputField
                    id="problem"
                    label="Updated Problem"
                    value={editedRequest.problem}
                    onChange={(e) => setEditedRequest((prev) => ({ ...prev, problem: e.target.value }))}
                    onMouseEnter={() => handleInputFocus('updatedProblemLabel')}
                    onMouseLeave={() => handleInputBlur('updatedProblemLabel')}
                />

                <InputField
                    id="description"
                    label="description"
                    value={editedRequest.description}
                    onChange={(e) => setEditedRequest((prev) => ({ ...prev, description: e.target.value }))}
                    onMouseEnter={() => handleInputFocus('updateDescriptionLabel')}
                    onMouseLeave={() => handleInputBlur('updateDescriptionLabel')}
                />

                <InputField
                    id="priority"
                    value={editedRequest.priority}
                    onChange={(e) => setEditedRequest((prev) => ({ ...prev, priority: e.target.value }))}
                    type="select"
                    options={[
                        { label: 'Priority', value: '' },
                        { label: 'HIGH', value: 'HIGH' },
                        { label: 'MEDIUM', value: 'MEDIUM' },
                        { label: 'LOW', value: 'LOW' },
                    ]}
                    required
                />

                <InputField
                    id="status"
                    value={editedRequest.status}
                    onChange={(e) => setEditedRequest((prev) => ({ ...prev, status: e.target.value }))}
                    type="select"
                    options={[
                        { label: 'Status', value: '' },
                        { label: 'FINISH', value: 'FINISH' },
                        { label: 'PROCESSING', value: 'PROCESSING' },
                    ]}
                    required
                />
                <div className="btnSave">
                    <button className="deleteBtn" onClick={openModalDelete}>Delete!</button>
                    <button onClick={() => updateRequest(editedRequest, singleRequest.id)}>Update!</button>
                </div>
            </Modal>

            <Modal isOpen={modalDeleteIsOpen} onClose={closeModalDelete}>

                <div className="singleRequest">
                    <p>
                        <span>Deseja deletar a request com o ID:</span> {singleRequest.id}
                    </p>
                </div>


                <div className="btnSave">
                    <button className="deleteBtn" onClick={() => deleteRequest(editedRequest)}>Delete!</button>
                </div>
            </Modal>

        </section>
    );
}

export default HomeSecurity;
