// RequestForm.jsx

import React from 'react';
import InputField from '../inputField/InputField';
import { handleInputBlur, handleInputFocus } from '../utils/handleInput/HandleInput';

const RequestForm = ({ formData, setFormData, handleSave, role }) => {
    return (
        <div className="toolConfig">
            <InputField
                id="problem"
                label="Problem"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                onMouseEnter={() => handleInputFocus('problemLabel')}
                onMouseLeave={() => handleInputBlur('problemLabel')}
            />

            <div>
                <div className="authField">
                    <label>Description</label>
                </div>
                <textarea
                    className="textarea-field"
                    title="Description"
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    cols="30"
                    rows="10"
                />
            </div>
            {role === "ADMIN" && (
                <>
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
                </>
            )}

            <div className="btnSave">
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default RequestForm;
