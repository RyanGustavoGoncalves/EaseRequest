import React, { useState } from "react";
import wave from './assets/wave(1).svg';
import './components/style.css';
import '../auth/components/style.css';
import mais from './assets/mais(1).png';
import lupa from './assets/lupa.png';
import { Link } from "react-router-dom";
import Modal from '../components/Modal';

const Home = () => {
    const [toolBoxes, setToolBoxes] = useState([]);
    const [formData, setFormData] = useState({
        nameTool: "",
        secondarytitle: "",
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const openModal = () => {
        document.body.style.overflow = "hidden";
        setModalIsOpen(true);
    };

    const closeModal = () => {
        document.body.style.overflow = "auto";
        setModalIsOpen(false);
    };

    const handleAddBox = () => {
        setToolBoxes([...toolBoxes, formData]);
        setFormData({
            nameTool: "",
            secondarytitle: "",
        });
        closeModal();
    };

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

    const handleSave = () => {
        setFormData({
            ...formData,
            nameTool: document.getElementById("nameTool").value,
            secondarytitle: document.getElementById("secondarytitleTool").value,
        });
        handleAddBox();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredToolBoxes = toolBoxes.filter((box) =>
        box.nameTool.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="homeSection">
            <div className="wave">
                <img src={wave} alt="" />
            </div>

            <div className="subNav">
                <div className="searchRequest">
                    <div className="lupaSearch">
                        <img src={lupa} alt="Search" />
                        <input
                            type="text"
                            placeholder="Search.."
                            onChange={handleSearch}
                            value={searchTerm}
                            title="Search"
                        />
                        <div className="addBtn">
                            <button onClick={openModal} title="Add">Add</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="homeDescript">
                <div className="boxTools">
                    <div className="tool" onClick={openModal}>
                        <h2>Create new Request</h2>
                        <img src={mais} alt="Add" width={40}/>
                    </div>
                    <Link to={"/"}>
                        {filteredToolBoxes.map((box, index) => (
                            <div key={index} className="tool">
                                <h2>{box.nameTool}</h2>
                                <p>{box.secondarytitle}</p>
                            </div>
                        ))}
                    </Link>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onClose={closeModal}>
                <div className="toolConfig">
                    <div className="authField">
                        <label id="nameToolLabel" className={formData.nameTool ? 'active' : ''} htmlFor="nameTool">
                            Título
                        </label>
                        <input
                            id="nameTool"
                            type="text"
                            value={formData.nameTool}
                            onChange={(e) => setFormData({ ...formData, nameTool: e.target.value })}
                            onMouseEnter={() => handleInputFocus('nameToolLabel')}
                            onMouseLeave={() => handleInputBlur('nameToolLabel')}
                        />
                    </div>
                    <div className="authField">
                        <label id="secondarytitleToolLabel" className={formData.secondarytitle ? 'active' : ''} htmlFor="secondarytitleTool">
                            Subtítulo
                        </label>
                        <input
                            id="secondarytitleTool"
                            type="text"
                            value={formData.secondarytitle}
                            onChange={(e) => setFormData({ ...formData, secondarytitle: e.target.value })}
                            onMouseEnter={() => handleInputFocus('secondarytitleToolLabel')}
                            onMouseLeave={() => handleInputBlur('secondarytitleToolLabel')}
                        />
                    </div>
                    <div className="btnSave"><button onClick={handleSave}>Salvar</button></div>
                </div>
            </Modal>
        </section>
    );
}

export default Home;
