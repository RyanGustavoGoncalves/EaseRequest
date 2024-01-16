import user from '../../assets/user.png';
import { openModalConfirm } from '../utils/ModalFunctions/ModalFunctions';
import { calculateTimeDifference } from '../utils/calculateTimeDifference/CalculateTimeDifference';
import { getStatusClass } from '../utils/getStatusClass/getStatusClass';

export const ToolBox = ({ box, loading, showId, handleSomeAction, setModalConfirmIsOpen, role }) => {
    return (
        <div className="tool" onClick={() => openModalConfirm(box.id, handleSomeAction, setModalConfirmIsOpen)}>
            {loading ? (
                <div className="align-loading">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {role === "ADMIN" ? (
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
                </>
            )}
        </div>
    );
};
