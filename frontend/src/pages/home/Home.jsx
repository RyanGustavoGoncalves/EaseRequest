// Imports of other components and libraries

import { useState, useEffect } from "react";
import wave from './assets/wave.svg';
import mais from './assets/iconMais.png';
import Modal from '../components/Modal';
import { getStatusClass } from "./components/utils/getStatusClass/getStatusClass";
import { fetchRequestById } from "./components/utils/fetchRequestById/fetchRequestById";
import { deleteRequest } from "./components/utils/deleteRequest/DeleteRequest";
import { updateRequest } from "./components/utils/updateRequest/UpdateRequest";
import { CreateNewRequest } from "./components/utils/createNewRequest/CreateNewRequest";
import { closeModal, closeModalConfirm, closeModalDelete, closeModalFilter, closeModalUpdate, openModal, openModalConfirm, openModalDelete, openModalFilter, openModalUpdate } from "./components/utils/ModalFunctions/ModalFunctions";
import { fetchRequestsPage } from "./components/utils/fetchRequestsPagination/FetchRequestPage";
import { FinishRequestAndSendEmail } from "./components/utils/finishRequest/FinishRequestAndSendEmail";
import FilterBar from "./components/subNav/FilterBar";
import { ToolBox } from "./components/toolBox/ToolBox";
import { Pagination } from "./components/pagination/Pagination";
import RequestForm from "./components/requestForm/RequestForm";
import RequestDetails from "./components/requestDetails/RequestDetails";
import UpdateRequest from "./components/updateRequest/UpdateRequest";
import FinishRequest from "./components/finishRequest/FinishRequest";
import DeleteRequestConfirmation from "./components/deleteRequestConfirmation/deleteRequestConfirmation";
import FilterPriority from "./components/filterByPriority/FilterPriority";
import FilterStatus from "./components/filterStatus/FilterStatus";
import { fetchRequests } from "./components/utils/fetchRequests/FetchRequest";

const HomeSecurity = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

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
            status: "PENDING",
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
            role === "ADMIN"
                ?
                fetchRequestsPage(nextPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded)
                :
                fetchRequests(nextPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded);
            return nextPage;
        });
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => {
            // Chama a função fetchRequests imediatamente após a mudança da página
            const previousPage = prevPage - 1;
            role === "ADMIN"
                ?
                fetchRequestsPage(previousPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded)
                :
                fetchRequests(previousPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded);

            return previousPage;
        });
    };

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetchData = async () => {
        role === "ADMIN"
            ?
            await fetchRequestsPage(currentPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded)
            :
            await fetchRequests(currentPage, setLoading, token, setToolBoxes, getStatusClass, setRequestsLoaded);
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
            {role === "ADMIN" ? (
                <>
                    <div className="wave">
                        <img src={wave} alt="" />
                    </div>
                    <div className="alignCont">
                        <FilterBar handleSearch={handleSearch} searchTerm={searchTerm} setModalFilterIsOpen={setModalFilterIsOpen} role={role} />
                        <div className="boxTools">
                            <div className="tool" style={{ display: "grid", placeItems: "center" }} onClick={() => openModal(setModalIsOpen)}>
                                <h2>Create new Request</h2>
                                <img src={mais} alt="Add" width={40} />
                            </div>
                            {filteredAndSortedToolBoxes.map((box, index) => (
                                // Verifica se o item atende aos critérios de filtro antes de renderizá-lo
                                (filterCriteria === '' || box.priority === filterCriteria) && (
                                    <ToolBox
                                        key={index}
                                        box={box}
                                        loading={loading}
                                        showId={showId}
                                        handleSomeAction={handleSomeAction}
                                        setModalConfirmIsOpen={setModalConfirmIsOpen}
                                        role={role}
                                    />
                                )
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                            role={role}
                        />
                    </div>

                    <Modal isOpen={modalIsOpen} onClose={() => closeModal(setModalIsOpen)}>
                        <RequestForm
                            formData={formData}
                            setFormData={setFormData}
                            handleSave={handleSave}
                            role={role}
                        />
                    </Modal>

                    <Modal isOpen={modalConfirmIsOpen} onClose={() => closeModalConfirm(setModalConfirmIsOpen)}>
                        <RequestDetails
                            singleRequest={singleRequest}
                            isExpanded={isExpanded}
                            focusDescription={focusDescription}
                            openModalUpdate={openModalUpdate}
                            handleSomeAction={handleSomeAction}
                            setEditedRequest={setEditedRequest}
                            setModalUpdateIsOpen={setModalUpdateIsOpen}
                            editedRequest={editedRequest}
                            role={role}
                        />

                    </Modal>

                    <Modal isOpen={modalUpdateIsOpen} onClose={() => { closeModalUpdate(setModalUpdateIsOpen), setFinishRequest(false) }}>
                        {loadingFinish && (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        )}

                        {!finishRequest ? (

                            <UpdateRequest
                                editedRequest={editedRequest}
                                singleRequest={singleRequest}
                                setEditedRequest={setEditedRequest}
                                handleSomeAction={handleSomeAction}
                                handleUpdateAction={handleUpdateAction}
                                setModalDeleteIsOpen={setModalDeleteIsOpen}
                                setFinishRequest={setFinishRequest}
                                role={role}
                            />


                        ) : (

                            <FinishRequest
                                singleRequest={singleRequest}
                                handleFinishAction={handleFinishAction}
                                editedRequest={editedRequest}
                            />

                        )}
                    </Modal>

                    <Modal isOpen={modalDeleteIsOpen} onClose={() => closeModalDelete(setModalDeleteIsOpen)}>

                        <DeleteRequestConfirmation
                            singleRequest={singleRequest}
                            handleDeleteAction={handleDeleteAction}
                            editedRequest={editedRequest}
                            role={role}
                        />

                    </Modal>

                    <Modal isOpen={modalFilterIsOpen} onClose={() => closeModalFilter(setModalFilterIsOpen)}>
                        <FilterPriority filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria} priorityCounts={priorityCounts} />
                        <FilterStatus selectedStatus={selectedStatus} handleStatusChange={handleStatusChange} />
                    </Modal>
                </>
            ) : (
                <>
                    <div className="wave">
                        <img src={wave} alt="" />
                    </div>

                    <div className="alignCont">
                        <FilterBar handleSearch={handleSearch} searchTerm={searchTerm} setModalFilterIsOpen={setModalFilterIsOpen} role={role} />
                        <div className="boxTools">
                            <div className="tool" style={{ display: "grid", placeItems: "center" }} onClick={() => openModal(setModalIsOpen)}>
                                <h2>Create new Request</h2>
                                <img src={mais} alt="Add" width={40} />
                            </div>
                            {filteredAndSortedToolBoxes.map((box, index) => (
                                // Verifica se o item atende aos critérios de filtro antes de renderizá-lo
                                (filterCriteria === '' || box.priority === filterCriteria) && (
                                    <ToolBox
                                        key={index}
                                        box={box}
                                        loading={loading}
                                        showId={showId}
                                        handleSomeAction={handleSomeAction}
                                        setModalConfirmIsOpen={setModalConfirmIsOpen}
                                        role={role}
                                    />
                                )
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            handlePreviousPage={handlePreviousPage}
                            handleNextPage={handleNextPage}
                            role={role}
                        />
                    </div>

                    <Modal isOpen={modalIsOpen} onClose={() => closeModal(setModalIsOpen)}>
                        <RequestForm
                            formData={formData}
                            setFormData={setFormData}
                            handleSave={handleSave}
                            role={role}
                        />
                    </Modal>

                    <Modal isOpen={modalConfirmIsOpen} onClose={() => closeModalConfirm(setModalConfirmIsOpen)}>
                        <RequestDetails
                            singleRequest={singleRequest}
                            isExpanded={isExpanded}
                            focusDescription={focusDescription}
                            openModalUpdate={openModalUpdate}
                            handleSomeAction={handleSomeAction}
                            setEditedRequest={setEditedRequest}
                            setModalUpdateIsOpen={setModalUpdateIsOpen}
                            editedRequest={editedRequest}
                            role={role}
                        />
                    </Modal>

                    <Modal isOpen={modalUpdateIsOpen} onClose={() => closeModalUpdate(setModalUpdateIsOpen)}>
                        {loadingFinish && (
                            <div className="loading-container">
                                <div className="spinner"></div>
                            </div>
                        )}

                        <UpdateRequest
                            editedRequest={editedRequest}
                            singleRequest={singleRequest}
                            setEditedRequest={setEditedRequest}
                            handleSomeAction={handleSomeAction}
                            handleUpdateAction={handleUpdateAction}
                            setModalDeleteIsOpen={setModalDeleteIsOpen}
                            setFinishRequest={setFinishRequest}
                            role={role}
                        />

                    </Modal>

                    <Modal isOpen={modalDeleteIsOpen} onClose={() => closeModalDelete(setModalDeleteIsOpen)}>

                        <DeleteRequestConfirmation
                            singleRequest={singleRequest}
                            handleDeleteAction={handleDeleteAction}
                            editedRequest={editedRequest}
                            role={role}
                        />
                    </Modal>
                </>
            )}
        </section>
    );
}

export default HomeSecurity;