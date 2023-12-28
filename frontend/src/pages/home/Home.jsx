import React, { useState, useEffect } from "react";
import wave from './assets/wave(1).svg';
import './components/style.css';
import '../auth/components/style.css';
import mais from './assets/mais(1).png';
import lupa from './assets/lupa.png';
import { Link } from "react-router-dom";
import Modal from '../components/Modal';
import InputField from "./components/InputField";

const Home = () => {
    const token = localStorage.getItem('token');
    console.log(token)
    const [toolBoxes, setToolBoxes] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        problem: "",
        priority: "",
        status: "",
        creationRequest: ""
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState(false);
    const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [requestsLoaded, setRequestsLoaded] = useState(false);
    const [singleRequest, setSingleRequest] = useState({});
    const [editedRequest, setEditedRequest] = useState({
        id: "",
        problem: "",
        priority: "",
        status: "",
    });



    useEffect(() => {
        if (!requestsLoaded) {
            fetchRequests();
        }
    }, [requestsLoaded]);

    const fetchRequests = async () => {
        try {
            const response = await fetch("http://localhost:8080/request/user", {
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

                // Certifica-se de que 'content' é uma matriz antes de definir 'toolBoxes'
                if (Array.isArray(responseData)) {
                    setToolBoxes(responseData);
                    setRequestsLoaded(true);
                } else {
                    console.error("A resposta não contém uma matriz válida:", responseData);
                }
            } else {
                console.log("Ocorreu um erro inesperado ao buscar as solicitações: " + response.status);
            }
        } catch (error) {
            console.log("Erro ao buscar as solicitações:", error);
        }
    };


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

    const handleAddBox = () => {
        setToolBoxes([...toolBoxes, formData]);
        setFormData({
            id: "",
            problem: "",
            priority: "",
            status: "",
            creationRequest: ""
        });
        closeModal();
    };

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
            priority: document.getElementById("priority").value,
            status: document.getElementById("status").value
        });
        newRequest();
        handleAddBox();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const newRequest = async () => {
        const data = {
            problem: formData.problem,
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
        }
    };


    // Movendo a declaração para o local apropriado
    const filteredToolBoxes = Array.isArray(toolBoxes)
        ? toolBoxes.filter((box) =>
            box.problem.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <section className="homeSection">
            <div className="wave">
                <img src={wave} alt="" />
            </div>

            <div className="subNav">
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
                    </div>
                </div>
            </div>

            <div className="homeDescript">
                <div className="boxTools">
                    <div className="tool" onClick={openModal}>
                        <h2>Create new Request</h2>
                        <img src={mais} alt="Add" width={40} />
                    </div>
                    {filteredToolBoxes.map((box, index) => (
                        <div key={index} className="tool" onClick={() => openModalConfirm(box.id)}>
                            <p>ID: {box.id}</p>
                            <h2>{box.problem}</h2>
                            <p>{box.priority}</p>
                            <p>{box.status}</p>
                            <p>{box.creationRequest}</p>
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
                            <option value="OK">OK</option>
                            <option value="N/OK">N/OK</option>
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
                </div>
                <InputField
                    id="problem"
                    label="Problem"
                    value={singleRequest.problem}
                    onChange={(e) => setSingleRequest((prev) => ({ ...prev, problem: e.target.value }))}
                    onMouseEnter={() => handleInputFocus('problemLabel')}
                    onMouseLeave={() => handleInputBlur('problemLabel')}
                />
                <InputField
                    id="priority"
                    label="Priority"
                    value={singleRequest.priority}
                    onChange={(e) => setSingleRequest((prev) => ({ ...prev, priority: e.target.value }))}
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
                    label="Status"
                    value={singleRequest.status}
                    onChange={(e) => setSingleRequest((prev) => ({ ...prev, status: e.target.value }))}
                    type="select"
                    options={[
                        { label: 'Status', value: '' },
                        { label: 'OK', value: 'OK' },
                        { label: 'N/OK', value: 'N/OK' },
                    ]}
                    required
                />
                <div className="btnSave">
                    <button onClick={() => openModalUpdate(singleRequest.id)}>Update!</button>
                </div>
            </Modal>

            <Modal isOpen={modalUpdateIsOpen} onClose={closeModalUpdate}>
                <div className="singleRequest">
                    <p>
                        <span>ID:</span> {singleRequest.id}
                    </p>

                    <InputField
                        id="problem"
                        label="Updated Problem"
                        value={editedRequest.problem}
                        onChange={(e) => setEditedRequest((prev) => ({ ...prev, problem: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('updatedProblemLabel')}
                        onMouseLeave={() => handleInputBlur('updatedProblemLabel')}
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
                            { label: 'OK', value: 'OK' },
                            { label: 'N/OK', value: 'N/OK' },
                        ]}
                        required
                    />


                    {/* Adicione botões para confirmar a atualização */}
                    <div className="btnSave">
                        <button onClick={() => updateRequest(editedRequest, singleRequest.id)}>Update!</button>
                    </div>
                </div>
            </Modal>

        </section>
    );
}

export default Home;
