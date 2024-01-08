// Imports of other components and libraries";
import { useState, useEffect } from "react";
import wave from './assets/wave.svg';
import mais from './assets/iconMais.png';
import lupa from './assets/lupa.png';
import Modal from '../components/Modal';
import InputField from './components/inputField/InputField';
import { getStatusClass } from "./components/utils/getStatusClass/getStatusClass";
import { fetchRequestById } from "./components/utils/fetchRequestById/fetchRequestById";
import { calculateTimeDifference } from "./components/utils/calculateTimeDifference/CalculateTimeDifference";
import { deleteRequest } from "./components/utils/deleteRequest/DeleteRequest";
import { updateRequest } from "./components/utils/updateRequest/UpdateRequest";
import { CreateNewRequest } from "./components/utils/createNewRequest/CreateNewRequest";
import { handleInputBlur, handleInputFocus } from "./components/utils/handleInput/HandleInput";
import { closeModal, closeModalConfirm, closeModalDelete, closeModalUpdate, openModal, openModalConfirm, openModalDelete, openModalUpdate } from "./components/utils/ModalFunctions/ModalFunctions";
import { fetchRequests } from "./components/utils/fetchRequests/FetchRequest";

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
            fetch();
        }
    }, [requestsLoaded]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch();
        }, 5000); // Consulta a cada 5 segundos (ajuste conforme necessário)

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado

    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getStatusClass();
        }, 5000); // Consulta a cada 5 segundos (ajuste conforme necessário)

        return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado

    }, []);

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
        closeModal(modalIsOpen);
    };

    // Function to save a new request
    const handleSave = () => {
        console.log(formData.status)
        setFormData({
            ...formData,
            problem: document.getElementById("problem").value,
            description: document.getElementById("description").value,
        });
        createNewRequest();
        handleAddBox();
    };


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetch = async () => {
        await fetchRequests(setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded)
    }

    const createNewRequest = async () => {
        await CreateNewRequest(formData, token);
        closeModal(setModalIsOpen);
    }

    const handleUpdateAction = async () => {
        await updateRequest(token, editedRequest, setSingleRequest);
        closeModalUpdate(setModalUpdateIsOpen);
    }

    const handleDeleteAction = async () => {
        await deleteRequest(token, editedRequest);
        closeModalConfirm(setModalConfirmIsOpen);
        closeModalUpdate(setModalUpdateIsOpen);
        closeModalDelete(setModalDeleteIsOpen);
    };

    const handleSomeAction = async (id) => {
        await fetchRequestById(id, token, setSingleRequest);

    };

    // Function to filter requests based on the search term
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
                            <button onClick={() => openModal(setModalIsOpen)} title="Add">Add</button>
                        </div>
                    </div>
                </div>
                <div className="boxTools">
                    <div className="tool" style={{ display: "grid", placeItems: "center" }} onClick={() => openModal(setModalIsOpen)}>
                        <h2>Create new Request</h2>
                        <img src={mais} alt="Add" width={40} />
                    </div>
                    {filteredToolBoxes.map((box, index) => (
                        <div key={index} className="tool" onClick={() => openModalConfirm(box.id, handleSomeAction, setModalConfirmIsOpen)}>
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

            <Modal isOpen={modalIsOpen} onClose={() => closeModal(setModalIsOpen)}>
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

            <Modal isOpen={modalConfirmIsOpen} onClose={() => closeModalConfirm(setModalConfirmIsOpen)}>
                <div className="singleRequest">
                    <div>
                        <span>ID:</span> {singleRequest.id}
                    </div>

                    <div>
                        <span>Problem:</span> {singleRequest.problem}
                    </div>

                    <div style={{ cursor: "pointer" }} onClick={focusDescription}>
                        <span>Description:</span> {isExpanded ? <div className="focusDesc">{singleRequest.description}</div> : <>[EXTEND]</>}
                    </div>

                    <div>
                        <span>Date request:</span> {singleRequest.creationRequest}
                    </div>
                </div>
                <div className="btnSave">
                    <button onClick={() => openModalUpdate(singleRequest.id, handleSomeAction, setEditedRequest, singleRequest, editedRequest, setModalUpdateIsOpen)}>Update!</button>
                </div>
            </Modal>

            <Modal isOpen={modalUpdateIsOpen} onClose={() => closeModalUpdate(setModalUpdateIsOpen)}>
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
                    <button className="deleteBtn" onClick={() => openModalDelete(singleRequest.id, handleSomeAction, setModalDeleteIsOpen)}>Delete!</button>
                    <button onClick={() => handleUpdateAction(editedRequest, singleRequest.id)}>Update!</button>
                </div>
            </Modal>

            <Modal isOpen={modalDeleteIsOpen} onClose={() => closeModalDelete(setModalDeleteIsOpen)}>

                <div className="singleRequest">
                    <span>Deseja deletar a request com o ID:</span> {singleRequest.id}
                </div>


                <div className="btnSave">
                    <button className="deleteBtn" onClick={() => handleDeleteAction(editedRequest)}>Delete!</button>
                </div>
            </Modal>

        </section>
    );
}

export default Home;
