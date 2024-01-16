import { useState } from "react";
import filtro from '../../../assets/filtro.png';
import lupa from '../../../assets/lupa.png';
import { closeModalFilter } from "../../../components/utils/ModalFunctions/ModalFunctions";
import Modal from "../../../../components/Modal";

export const SubNav = ({ toolBoxes, openModalFilter }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [modalFilterIsOpen, setModalFilterIsOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState('');

    // Function to handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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

    return (
        <>
            <div className="subNav">
                <h1 style={{ padding: "1rem", color: "white" }}>ADMIN</h1>

                <div className="lupaSearch">
                    <div className="lupa">
                        <img src={lupa} alt="Search" />
                    </div>
                    <input type="search" placeholder="Search.." onChange={handleSearch} value={searchTerm} title="Search" />
                    <div className="filter" onClick={() => openModalFilter(setModalFilterIsOpen)}>
                        <img src={filtro} alt="filter" width={30} />
                    </div>
                </div>
            </div>

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
        </>

    );
};
