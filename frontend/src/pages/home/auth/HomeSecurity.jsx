import React, { useState, useEffect } from "react";
import wave from '../assets/wave.svg';
import filtro from '../assets/filtro.png';
import mais from '../assets/iconMais.png';
import lupa from '../assets/lupa.png';
import { Link } from "react-router-dom";
import Modal from '../../components/Modal';
import InputField from "../components/InputField";
import moment from "moment";
import "moment/locale/pt-br";

const HomeSecurity = () => {
    // Retrieve token from local storage
    const token = localStorage.getItem('token');

    // State variables
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

    // Function to toggle the expansion of the description field
    const focusDescription = () => {
        setExpanded(!isExpanded);
    };

    // Fetch requests when the component mounts and requests are not loaded
    useEffect(() => {
        if (!requestsLoaded) {
            fetchRequests();
        }
    }, [requestsLoaded]);

    // Fetch requests periodically (every 5 seconds)
    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log(token);
            fetchRequests();
        }, 5000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);

    }, []);

    // Fetch requests from the server
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
                    // Map the requests and include user data
                    const updatedToolBoxes = responseData.content.map(box => {
                        return {
                            ...box,
                            user: box.user,
                        };
                    });

                    setToolBoxes(updatedToolBoxes);
                    setRequestsLoaded(true);
                } else {
                    console.error("Response does not contain a valid array:", responseData);
                }
            }
        } catch (error) {
            console.log("Error fetching requests:", error);
            // alert("Error fetching requests. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Modal Functions
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

    const openModalFilter = () => {
        document.body.style.overflow = "hidden";
        setModalFilterIsOpen(true);
    };

    const closeModalFilter = () => {
        document.body.style.overflow = "auto";
        setModalFilterIsOpen(false);
    };

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
        closeModal();
    };

    // Function for input focus and blur animation in the modal
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

    // Function to save the form data and create a new request
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

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Function to create a new request
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
                alert("Successful registration!");
            } else if (response.status === 400) {
                const errorData = await response.json();
                const errorArray = [];

                for (const fieldName in errorData) {
                    const errorMessage = errorData[fieldName];
                    errorArray.push({ fieldName, errorMessage });
                }

            } else {
                console.log("An unexpected error occurred: " + response.status);
            }
        } catch (error) {
            console.log("Error sending the request:", error);
            // alert("Error fetching requests. Please try again later.");
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
                // Successful update
                console.log('Request updated successfully!');

                setSingleRequest({ ...editedRequest });
                closeModalUpdate(); // Close the modal after update
            } else {
                // Handle response errors
                console.error('Error updating request:', response.status);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error making update request:', error);
            // alert("Error fetching requests. Please try again later.");
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

                console.log('Request deleted successfully!');
                closeModalUpdate();
            } else {

                console.error('Error deleting the request:', response.status);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error making delete request:', error);
            // alert("Error fetching requests. Please try again later.");
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

                // Log the response for analysis
                console.log("API response:", responseData);

                if (responseData && typeof responseData === 'object') {

                    // Extract user data and add it to the single request
                    const user = responseData.user;
                    const updatedSingleRequest = {
                        ...responseData,
                        user: user,
                    };

                    setSingleRequest(updatedSingleRequest);
                } else {
                    console.error("Response does not contain a valid object:", responseData);
                }
            } else if (response.status === 404) {
                console.log("Request not found");
                // Handle the case where the request was not found
            } else {
                console.log("An unexpected error occurred: " + response.status);
            }
        } catch (error) {
            console.log("Error fetching the request:", error);
        }
    };

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

    // Calculate the time difference from the launch date
    const calculateTimeDifference = (launchDate) => {
        const currentDate = moment();
        const launchMoment = moment(launchDate);
        const duration = moment.duration(currentDate.diff(launchMoment));

        // Display the difference in days, hours, minutes, etc.
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();

        return `${days} days, ${hours} hour, ${minutes} minutes ago`;
    };

    // Get the CSS class for the status
    const getStatusClass = (status) => {
        let colorClass = "status-red"; // Assume red as default

        // Check the status of the request
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
                        <div className="filter" onClick={openModalFilter}>
                            <img src={filtro} alt="filter" width={30} />
                        </div>
                    </div>
                </div>
                <div className="homeDescript">
                    <div className="boxTools">
                        <div className="tool" style={{ display: "grid", placeItems: "center" }} onClick={openModal}>
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
                                            <div className="txtAlignTool">
                                                <div className="toolTittle">
                                                    <h2>{box.problem}</h2>
                                                    <p> {box.id}</p>
                                                    <p>{calculateTimeDifference(box.creationRequest)}</p>
                                                </div>
                                                <div className="dateStatusTool">
                                                    <p className={box.status}>
                                                        <p>{box.priority}</p>
                                                        <p>User ID: {box.user ? box.user.idUsers : 'N/A'}</p>
                                                        <p className={`status ${getStatusClass(box.status)}`}>
                                                            &#x25CF;
                                                            <span>{box.status}</span>
                                                        </p>
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
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
                        <span>Request ID:</span> {singleRequest.id}
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
                        <span>User ID:</span> {singleRequest.user ? singleRequest.user.idUsers : 'N/A'}

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

            <Modal isOpen={modalFilterIsOpen} onClose={closeModalFilter}>
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
