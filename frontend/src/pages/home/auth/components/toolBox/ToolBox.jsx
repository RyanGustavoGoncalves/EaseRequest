import mais from '../../../assets/iconMais.png';
import user from '../../../assets/user.png';
import { openModal, openModalConfirm } from '../../../components/utils/ModalFunctions/ModalFunctions';
import { calculateTimeDifference } from '../../../components/utils/calculateTimeDifference/CalculateTimeDifference';
import { getStatusClass } from '../../../components/utils/getStatusClass/getStatusClass';

export const ToolBox = ({ setModalIsOpen, filteredAndSortedToolBoxes, filterCriteria, loading, handleSomeAction, setModalConfirmIsOpen, showId }) => {
    (

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
    )
}