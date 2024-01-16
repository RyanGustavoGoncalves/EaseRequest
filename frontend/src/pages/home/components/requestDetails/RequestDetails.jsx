// RequestDetails.jsx

import React from 'react';
import UserPreview from '../userPreview/UserPreview';

const RequestDetails =
    ({
        singleRequest,
        isExpanded,
        focusDescription,
        openModalUpdate,
        handleSomeAction,
        setEditedRequest,
        setModalUpdateIsOpen,
        editedRequest,
        role
    }) => {
        return (
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

                {role === "ADMIN" && (
                    <>
                        <div>
                            <span>Priority:</span> {singleRequest.priority}
                        </div>

                        <div>
                            <span>Status:</span> {singleRequest.status}
                        </div>

                        <div>
                            <span>Date request:</span> {singleRequest.creationRequest}
                        </div>

                        <UserPreview
                            user={singleRequest.user}
                        />

                    </>
                )}
                <div className="btnSave">
                    <button onClick={() => openModalUpdate(singleRequest.id, handleSomeAction, setEditedRequest, singleRequest, editedRequest, setModalUpdateIsOpen)}>Update!</button>
                </div>
            </div>
        );
    };

export default RequestDetails;