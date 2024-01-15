import { useState } from 'react';
import { GenerateExcelFile } from '../../../home/components/utils/generateExcelFile/GenerateExcelFile';
import { ButtonGenerate } from './components/buttonGenerate/buttonGenerate';

export const RequestSettings = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const [fileUrl, setFileUrl] = useState('');
    const [isDownloadButtonDisabled, setDownloadButtonDisabled] = useState(true);
    const [isDownloadAllButtonDisabled, setDownloadAllButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleGenerateClick = async (allUsers = false) => {
        setLoading(true);
        try {
            allUsers ? setDownloadButtonDisabled(true) : setDownloadAllButtonDisabled(true);
            await GenerateExcelFile({ allUsers, token, setFileUrl });
            allUsers ? setDownloadAllButtonDisabled(false) : setDownloadButtonDisabled(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadClick = (value) => {
        if (fileUrl) {

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = 'requests.xlsx'; // Nome do arquivo desejado
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Desativa o botão após o download ser concluído
            value ? setDownloadButtonDisabled(true) : setDownloadAllButtonDisabled(true);
        }
    };

    return (
        <article className='article-settings-content'>
            <h1>Request Configurations</h1>

            <div className="excel-file-generator">
                <h3>Generate excel file</h3>
                <span>When you click on the button, an excel file will be generated with all your requests!</span>

                <ButtonGenerate
                    loading={loading}
                    handleGenerateClick={() => handleGenerateClick(false)}
                    buttonText="Generate!"
                />

                <div className={isDownloadButtonDisabled ? 'desactiveBtn' : 'downloadBtn'}>
                    <button onClick={() => handleDownloadClick(false)} disabled={isDownloadButtonDisabled}>
                        Download Excel
                    </button>
                </div>
            </div>
            {
                role === "ADMIN" && (
                    <>
                        <hr />

                        <div className="excel-file-generator">
                            <h3>Generate excel file from all users</h3>
                            <span>When you click on the button, an excel file will be generated with the requests from all users!</span>

                            <ButtonGenerate
                                loading={loading}
                                handleGenerateClick={() => handleGenerateClick(true)}
                                buttonText="Generate!"
                            />
                            <div className={isDownloadAllButtonDisabled ? 'desactiveBtn' : 'downloadBtn'}>
                                <button onClick={() => handleDownloadClick(true)} disabled={isDownloadAllButtonDisabled}>
                                    Download Excel
                                </button>
                            </div>

                        </div>
                    </>
                )
            }
        </article>
    );
};
