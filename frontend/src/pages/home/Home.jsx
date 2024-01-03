// Imports of other components and libraries

import React, { useState, useEffect } from "react";
import wave from './assets/wave.svg';
import mais from './assets/iconMais.png';
import lupa from './assets/lupa.png';
import { Link } from "react-router-dom";
import Modal from '../components/Modal';
import InputField from "./components/InputField";
import moment from "moment";
import "moment/locale/pt-br";

const Home = () => {
    // State to store the user's token
    const token = localStorage.getItem('token');

    // States to manage requests and loading
    const [toolBoxes, setToolBoxes] = useState([]);
    const [loading, setLoading] = useState(false);

    // State to store form data
    const [formData, setFormData] = useState({
        id: "",
        problem: "",
        description: "",
        priority: "",
        status: "PENDING",
        creationRequest: "",
    });

    // States related to modals
    const [isExpanded, setExpanded] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState(false);
    const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

    // State for search term
    const [searchTerm, setSearchTerm] = useState("");

    // States related to a single request
    const [requestsLoaded, setRequestsLoaded] = useState(false);
    const [singleRequest, setSingleRequest] = useState({});
    const [editedRequest, setEditedRequest] = useState({
        id: "",
        problem: "",
        description: "",
    });

    const focusDescription = () => {
        setExpanded(!isExpanded);
    };

    // Side effects to load requests and update status
    useEffect(() => {
        if (!requestsLoaded) {
            fetchRequests();
        }
    }, [requestsLoaded]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchRequests();
        }, 5000); // Consulta a cada 5 segundos (ajuste conforme necessário)

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado

    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getStatusClass();
        }, 5000); // Consulta a cada 5 segundos (ajuste conforme necessário)

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado

    }, []);

    // Function to calculate time difference
    const calculateTimeDifference = (launchDate) => {
        const currentDate = moment();
        const launchMoment = moment(launchDate);
        const duration = moment.duration(currentDate.diff(launchMoment));

        // Exibindo a diferença em dias, horas, minutos, etc.
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();

        return `${days} days, ${hours} hour, ${minutes} minutes ago`;
    };

    // Function to fetch requests from the server
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/request/user", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const responseData = await response.json();

                if (Array.isArray(responseData)) {
                    // Atualiza as solicitações e atribui a cor a cada uma
                    setToolBoxes(responseData.map(request => ({
                        ...request,
                        colorClass: getStatusClass(request.status),
                    })));
                    setRequestsLoaded(true);
                } else {
                    console.error("A resposta não contém uma matriz válida:", responseData);
                }
            } else {
                console.log("Ocorreu um erro inesperado ao buscar as solicitações: " + response.status);
            }
        } catch (error) {
            console.log("Erro ao buscar as solicitações:", error);
            // alert("Erro ao buscar as solicitações. Por favor, tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    // Functions related to modals
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

    // Function to add a new request
    const handleAddBox = () => {
        setToolBoxes([...toolBoxes, formData]);
        setFormData({
            id: "",
            problem: "",
            description: "",
            priority: "",
            status: "PENDING",
            creationRequest: "",
        });
        closeModal();
    };

    // Functions for modal input animation
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

    // Function to save a new request
    const handleSave = () => {
        console.log(formData.status)
        setFormData({
            ...formData,
            problem: document.getElementById("problem").value,
            description: document.getElementById("description").value,
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
            // alert("Erro ao buscar as solicitações. Por favor, tente novamente mais tarde.");
        }
    };

    // Function to update a request
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
            // alert("Erro ao buscar as solicitações. Por favor, tente novamente mais tarde.");
        }
    };

    // Function to delete a request
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

    // Function to fetch a request by ID
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
                    setSingleRequest(responseData);
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
            // alert("Erro ao buscar as solicitações. Por favor, tente novamente mais tarde.");
        }
    };

    // Function to filter requests based on the search term
    const filteredToolBoxes = Array.isArray(toolBoxes)
        ? toolBoxes.filter((box) =>
            box.problem.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    // Function to get the status class based on the request status
    const getStatusClass = (status) => {
        let colorClass = "status-red"; // Assume vermelho como padrão

        // Verifica o status da solicitação
        if (status === "PROCESSING") {
            colorClass = "status-yellow";
        } else if (status === "FINISH") {
            colorClass = "status-green";
        }

        return colorClass;
    };

    return (
        <section className="homeSection">
            <div className="wave">
                <img src={wave} alt="" />
            </div>

            <div className="alignCont">
                <div className="subNav">
                    <div className="lupaSearch">
                        <div className="lupa"><img src={lupa} alt="Search" /></div>
                        <input
                            type="search"
                            placeholder="Search.."
                            onChange={handleSearch}
                            value={searchTerm}
                            title="Search"
                        />
                        <div className="addBtn">
                            <button onClick={openModal} title="Add">Add</button>
                        </div>
                    </div>
                </div>
                <div className="boxTools">
                    <div className="tool" style={{ display: "grid", placeItems: "center" }} onClick={openModal}>
                        <h2>Create new Request</h2>
                        <img src={mais} alt="Add" width={40} />
                    </div>
                    {filteredToolBoxes.map((box, index) => (
                        <div key={index} className="tool" onClick={() => openModalConfirm(box.id)}>
                            {loading ? (
                                <div className="loading-overlay">Carregando...</div>
                            ) : (
                                <>
                                    <div className="txtAlignTool">
                                        <div className="toolTitle">
                                            <h2>{box.problem}</h2>
                                            <p> {box.id}</p>
                                            <p>{calculateTimeDifference(box.creationRequest)}</p>
                                        </div>
                                        <div className="dateStatusTool">
                                            <p className={`status ${getStatusClass(box.status)}`}>
                                                &#x25CF;
                                                <span>{box.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
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
                        <span>Date request:</span> {singleRequest.creationRequest}
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
                    label="UpdatedProblem"
                    value={editedRequest.problem}
                    onChange={(e) => setEditedRequest((prev) => ({ ...prev, problem: e.target.value }))}
                    onMouseEnter={() => handleInputFocus('problemLabel')}
                    onMouseLeave={() => handleInputBlur('problemLabel')}
                />

                <InputField
                    id="description"
                    label="Updatedescription"
                    value={editedRequest.description}
                    onChange={(e) => setEditedRequest((prev) => ({ ...prev, description: e.target.value }))}
                    onMouseEnter={() => handleInputFocus('descriptionLabel')}
                    onMouseLeave={() => handleInputBlur('descriptionLabel')}
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

export default Home;
