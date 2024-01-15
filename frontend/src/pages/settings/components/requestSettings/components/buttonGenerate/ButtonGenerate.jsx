import React from 'react';

const ButtonGenerate = ({ loading, handleGenerateClick, buttonText }) => (
    <div className="downloadBtn">
        <button onClick={() => handleGenerateClick()} disabled={loading}>
            {loading ? (
                <div className="align-loading">
                    <div className="spinner-btn"></div>
                </div>
            ) : (
                <>{buttonText}</>
            )}
        </button>
    </div>
);

export default ButtonGenerate;
