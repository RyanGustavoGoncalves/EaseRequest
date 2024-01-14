// Imports of other components and libraries

import { useState, useEffect } from "react";
import wave from '../assets/wave.svg';
import user from '../assets/user.png';
import filtro from '../assets/filtro.png';
import mais from '../assets/iconMais.png';
import lupa from '../assets/lupa.png';
import Modal from '../../components/Modal';
import InputField from '../components/inputField/InputField'
import { getStatusClass } from "../components/utils/getStatusClass/getStatusClass";
import { fetchRequestById } from "../components/utils/fetchRequestById/fetchRequestById";
import { calculateTimeDifference } from "../components/utils/calculateTimeDifference/CalculateTimeDifference";
import { deleteRequest } from "../components/utils/deleteRequest/DeleteRequest";
import { updateRequest } from "../components/utils/updateRequest/UpdateRequest";
import { CreateNewRequest } from "../components/utils/createNewRequest/CreateNewRequest";
import { handleInputBlur, handleInputFocus } from "../components/utils/handleInput/HandleInput";
import { closeModal, closeModalConfirm, closeModalDelete, closeModalFilter, closeModalUpdate, openModal, openModalConfirm, openModalDelete, openModalFilter, openModalUpdate } from "../components/utils/ModalFunctions/ModalFunctions";
import { fetchRequestsPage } from "../components/utils/fetchRequestsPagination/FetchRequestPage";
import { FinishRequestAndSendEmail } from "../components/utils/finishRequest/FinishRequestAndSendEmail";

const HomeSecurity = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // State variables
    const [toolBoxes, setToolBoxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingFinish, setLoadingFinish] = useState(false);
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
    const [finishRequest, setFinishRequest] = useState(false);
    const [showId, setShowId] = useState(true);
    const [isExpanded, setExpanded] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalConfirmIsOpen, setModalConfirmIsOpen] = useState(false);
    const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
    const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
    const [modalFilterIsOpen, setModalFilterIsOpen] = useState(false);
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
    const [filterCriteria, setFilterCriteria] = useState('');
    const [selectedStatus, setSelectedStatus] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);

    // Function to toggle the expansion of the description field
    const focusDescription = () => {
        setExpanded(!isExpanded);
    };

    // Fetch requests when the component mounts and requests are not loaded
    useEffect(() => {
        if (!requestsLoaded) {
            fetchData();
        }
    }, [requestsLoaded]);

    // Fetch requests periodically (every 5 seconds)
    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log(token);
            fetchData(currentPage);
        }, 5000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);

    }, [currentPage, token]);

    // Function to add a new request
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
        closeModal(modalIsOpen);
    };

    // Function to save the form data and create a new request
    const handleSave = () => {
        setFormData({
            ...formData,
            problem: document.getElementById("problem").value,
            description: document.getElementById("description").value,
            priority: document.getElementById("priority").value,
            status: document.getElementById("status").value
        });
        createNewRequest();
        handleAddBox();
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => {
            // Chama a função fetchRequests imediatamente após a mudança da página
            const nextPage = prevPage + 1;
            fetchRequestsPage(nextPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded);
            return nextPage;
        });
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => {
            // Chama a função fetchRequests imediatamente após a mudança da página
            const previousPage = prevPage - 1;
            fetchRequestsPage(previousPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded);
            return previousPage;
        });
    };

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetchData = async () => {
        await fetchRequestsPage(currentPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded)
    }

    const createNewRequest = async () => {
        await CreateNewRequest(formData, token);
        setModalIsOpen(false);
    }

    const handleUpdateAction = async () => {
        await updateRequest(token, editedRequest, setSingleRequest);
        setModalUpdateIsOpen(false);
        setModalConfirmIsOpen(false);
    }

    const handleDeleteAction = async () => {
        await deleteRequest(token, editedRequest);
        setModalConfirmIsOpen(false);
        setModalUpdateIsOpen(false);
        setModalDeleteIsOpen(false);
    };

    const handleSomeAction = async (id) => {
        await fetchRequestById(id, token, setSingleRequest);
    };

    const handleFinishAction = async (editedRequest) => {
        setLoadingFinish(true);
        await FinishRequestAndSendEmail(token, editedRequest.user.email, editedRequest.problem, editedRequest.user.username, editedRequest.id);
        editedRequest.status = "FINISH";
        setEditedRequest(editedRequest)
        await updateRequest(token, editedRequest, setSingleRequest)
        setModalUpdateIsOpen(false);
        setModalConfirmIsOpen(false);
        setFinishRequest(false);
        setLoadingFinish(false);
    }

    // Move the declaration to the appropriate location
    const filteredAndSortedToolBoxes = Array.isArray(toolBoxes)
        ? toolBoxes
            .filter(
                (box) =>
                    box.problem.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!filterCriteria || box.priority === filterCriteria) &&
                    (selectedStatus.length === 0 || selectedStatus.includes(box.status))
            )
            .sort((a, b) => {
                // Sort based on priority (HIGH, MEDIUM, LOW)
                const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
        : [];

    // Function to handle status change
    const handleStatusChange = (status) => {
        if (selectedStatus.includes(status)) {
            setSelectedStatus((prevStatus) =>
                prevStatus.filter((selected) => selected !== status)
            );
        } else {
            setSelectedStatus((prevStatus) => [...prevStatus, status]);
        }
    };

    // Count the occurrences of each priority
    const priorityCounts = filteredAndSortedToolBoxes.reduce((counts, box) => {
        // Increment the count for the current priority
        counts[box.priority] = (counts[box.priority] || 0) + 1;
        return counts;
    }, {});

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowId((prevShowId) => !prevShowId);
        }, 4000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return (
        <section className="homeSection">
            <div className="wave">
                <img src={wave} alt="" />
            </div>
            <div className="alignCont">
                <div className="subNav">
                    <h1 style={{ padding: "1rem", color: "white" }}>ADMIN</h1>

                    <div className="lupaSearch">
                        <div className="lupa"><img src={lupa} alt="Search" /></div>
                        <input
                            type="search"
                            placeholder="Search.."
                            onChange={handleSearch}
                            value={searchTerm}
                            title="Search"
                        />
                        <div className="filter" onClick={() => openModalFilter(setModalFilterIsOpen)}>
                            <img src={filtro} alt="filter" width={30} />
                        </div>
                    </div>
                </div>
                <div className="boxTools">
                    <div className="tool" style={{ display: "grid", placeItems: "center" }} onClick={() => openModal(setModalIsOpen)}>
                        <h2>Create new Request</h2>
                        <img src={mais} alt="Add" width={40} />
                    </div>
                    {filteredAndSortedToolBoxes.map((box, index) => (
                        // Verifica se o item atende aos critérios de filtro antes de renderizá-lo
                        (filterCriteria === '' || box.priority === filterCriteria) && (
                            <div key={index} className="tool" onClick={() => openModalConfirm(box.id, handleSomeAction, setModalConfirmIsOpen)}>
                                {loading ? (
                                    <div className="align-loading">
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="txtAlignTool">
                                            <div className="toolTitle">
                                                <h2>{box.problem}</h2>
                                                <p> {box.id}</p>
                                                <p>{calculateTimeDifference(box.creationRequest)}</p>
                                            </div>
                                            <div className="dateStatusTool">
                                                <p className={box.status}></p>
                                                <div className="user-info">
                                                    <p>
                                                        {showId ? 'ID' : 'Username'}: {box.user ? (showId ? box.user.idUsers : box.user.username) : 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="box-status-priority-image-content">
                                                    <div className={`status ${getStatusClass(box.status)}`}>
                                                        &#x25CF;
                                                        <span>{box.status}</span>
                                                        <p>{box.priority}</p>
                                                    </div>
                                                    <img src={box.user ? `data:image/png;base64,${box.user.profileImage}` : user} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    ))}
                </div>
                <div className="page">
                    <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Back
                    </button>
                    <span>Página {currentPage + 1}</span>
                    <button onClick={handleNextPage}>
                        Next
                    </button>
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

            <Modal isOpen={modalConfirmIsOpen} onClose={() => closeModalConfirm(setModalConfirmIsOpen)}>
                <div className="singleRequest">
                    <div>
                        <span>Request ID:</span> {singleRequest.id}
                    </div>

                    <div>
                        <span>Problem:</span> {singleRequest.problem}
                    </div>

                    <div style={{ cursor: "pointer" }} onClick={focusDescription}>
                        <span>Description:</span> {isExpanded ? <div className="focusDesc">{singleRequest.description}</div> : <>[EXTEND]</>}
                    </div>

                    <div>
                        <span>Priority:</span> {singleRequest.priority}
                    </div>

                    <div>
                        <span>Status:</span> {singleRequest.status}
                    </div>

                    <div>
                        <span>Date request:</span> {singleRequest.creationRequest}
                    </div>

                    <div className="userPreview">
                        <div className="userImageModal">
                            <img src={singleRequest.user ? `data:image/png;base64,${singleRequest.user.profileImage}` : user} />
                        </div>
                        <div>
                            <span>User ID:</span> {singleRequest.user ? singleRequest.user.idUsers : 'N/A'}
                        </div>
                        <div>
                            <span>Username:</span> {singleRequest.user ? singleRequest.user.username : 'N/A'}
                        </div>
                        <div>
                            <span>Name:</span> {singleRequest.user ? singleRequest.user.firstName : 'N/A'} {singleRequest.user ? singleRequest.user.lastName : 'N/A'}
                        </div>
                        <div>
                            <span>Email:</span> {singleRequest.user ? singleRequest.user.email : 'N/A'}
                        </div>
                    </div>

                </div>
                <div className="btnSave">
                    <button onClick={() => openModalUpdate(singleRequest.id, handleSomeAction, setEditedRequest, singleRequest, editedRequest, setModalUpdateIsOpen)}>Update!</button>
                </div>
            </Modal>

            <Modal isOpen={modalUpdateIsOpen} onClose={() => { closeModalUpdate(setModalUpdateIsOpen), setFinishRequest(false) }}>
                {loadingFinish && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                )}

                {!finishRequest ? (
                    <>
                        <div className="singleRequest">
                            <span>ID:</span> {singleRequest.id}
                        </div>

                        <InputField
                            id="problem"
                            label="Updated Problem"
                            value={editedRequest.problem}
                            onChange={(e) => setEditedRequest((prev) => ({ ...prev, problem: e.target.value }))}
                            onMouseEnter={() => handleInputFocus('problemLabel')}
                            onMouseLeave={() => handleInputBlur('problemLabel')}
                        />

                        <InputField
                            id="description"
                            label="description"
                            value={editedRequest.description}
                            onChange={(e) => setEditedRequest((prev) => ({ ...prev, description: e.target.value }))}
                            onMouseEnter={() => handleInputFocus('descriptionLabel')}
                            onMouseLeave={() => handleInputBlur('descriptionLabel')}
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
                            <button className="deleteBtn" onClick={() => openModalDelete(singleRequest.id, handleSomeAction, setModalDeleteIsOpen)}>Delete!</button>
                            <button onClick={() => handleUpdateAction(editedRequest, singleRequest.id)}>Update!</button>
                        </div>
                        <div className="btnFinish"><button onClick={() => setFinishRequest(true)}>Finish!</button></div>
                    </>
                ) : (
                    <>
                        <div className="userPreview">

                            <div className="password-update-modal">
                                <h5>Deseja finalizar a request com o ID:</h5>
                                <p>{singleRequest.id}</p>
                            </div>

                            <div className="userImageModal">
                                <img src={singleRequest.user ? `data:image/png;base64,${singleRequest.user.profileImage}` : user} />
                            </div>
                            <div>
                                <span>User ID:</span> {singleRequest.user ? singleRequest.user.idUsers : 'N/A'}
                            </div>
                            <div>
                                <span>Username:</span> {singleRequest.user ? singleRequest.user.username : 'N/A'}
                            </div>
                            <div>
                                <span>Name:</span> {singleRequest.user ? singleRequest.user.firstName : 'N/A'} {singleRequest.user ? singleRequest.user.lastName : 'N/A'}
                            </div>
                            <div>
                                <span>Email:</span> {singleRequest.user ? singleRequest.user.email : 'N/A'}
                            </div>
                            <div className="btnSave">
                                <button onClick={() => handleFinishAction(editedRequest)}>Finish!</button>
                            </div>
                        </div>


                    </>
                )}
            </Modal>

            <Modal isOpen={modalDeleteIsOpen} onClose={() => closeModalDelete(setModalDeleteIsOpen)}>

                <div className="singleRequest">
                    <span>Deseja deletar a request com o ID:</span> {singleRequest.id}
                </div>


                <div className="btnSave">
                    <button className="deleteBtn" onClick={() => handleDeleteAction(editedRequest)}>Delete!</button>
                </div>
            </Modal>

            <Modal isOpen={modalFilterIsOpen} onClose={() => closeModalFilter(setModalFilterIsOpen)}>
                <div className="filterPriorityConfig">
                    <label className="selectFilterPriority" htmlFor="filterPriority">Filter by Priority:</label>
                    <select
                        className="selectFilterPriority"
                        id="filterPriority"
                        value={filterCriteria}
                        onChange={(e) => setFilterCriteria(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="HIGH">HIGH ({priorityCounts.HIGH || 0})</option>
                        <option value="MEDIUM">MEDIUM ({priorityCounts.MEDIUM || 0})</option>
                        <option value="LOW">LOW ({priorityCounts.LOW || 0})</option>
                    </select>
                </div>
                <div className="filterStatusConfig">
                    <label>Status Filter:</label>
                    <div className="statusFilter">
                        {['FINISH', 'PROCESSING', 'PENDING'].map((status) => (
                            <label key={status}>
                                <input
                                    type="checkbox"
                                    value={status}
                                    checked={selectedStatus.includes(status)}
                                    onChange={() => handleStatusChange(status)}
                                />
                                {status}
                            </label>
                        ))}
                    </div>
                </div>
            </Modal>

        </section>
    );
}

export default HomeSecurity;
