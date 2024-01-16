//UpdateRequest.jsx

import InputField from "../inputField/InputField";
import { openModalDelete } from "../utils/ModalFunctions/ModalFunctions";
import { handleInputBlur, handleInputFocus } from "../utils/handleInput/HandleInput";

const UpdateRequest =
    ({
        editedRequest,
        singleRequest,
        setEditedRequest,
        handleSomeAction,
        handleUpdateAction,
        setModalDeleteIsOpen,
        setFinishRequest,
        role
    }) => (
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
            {role === "ADMIN" && (
                <>

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
                </>
            )}
            <div className="btnSave">
                <button className="deleteBtn" onClick={() => openModalDelete(singleRequest.id, handleSomeAction, setModalDeleteIsOpen)}>Delete!</button>
                <button onClick={() => handleUpdateAction(editedRequest, singleRequest.id)}>Update!</button>
            </div>
            {role === "ADMIN" && (
                <>
                    <div className="btnFinish"><button onClick={() => setFinishRequest(true)}>Finish!</button></div>
                </>
            )}
        </>
    )

export default UpdateRequest;