import { useState, useEffect } from "react";
import { FetchUser } from "../../../home/components/utils/getInfoUser/FetchUser";
import { closeModalUserUpdate, openModalUserUpdate } from "../../../home/components/utils/ModalFunctions/ModalFunctions";
import { handleInputBlur, handleInputFocus } from "../../../home/components/utils/handleInput/HandleInput";
import InputField from "../../../home/components/inputField/InputField";
import Modal from '../../../components/Modal';
import { updateUser } from '../../../home/components/utils/updateUser/UpdateUser'

import user from '../../assets/perfil.png';
import edit from '../../assets/edit.png'

export const ProfileSettings = () => {

    const token = localStorage.getItem('token');
    const [showUpdateScreen, setShowUpdateScreen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        birth: "",
    });
    const [editUser, setEditUser] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        birth: "",
    });
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        FetchUser(token, setUserData);
    }, [token]);

    const handleUpdateUserAction = async () => {
        await updateUser(editUser, token, setUserData)
        closeModalUserUpdate(setModalIsOpen);
    }

    const tokenMail = async (email, e) => {
        if (e) {
            e.preventDefault();
        }
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/update-password/generate-token", {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(email),
            });

            if (response.ok) { // Verifica se o status é 2xx (sucesso)
                alert("Token enviado!");
            } else {
                console.log("Ocorreu um erro ao gerar o token:", response.status);
                const errorMessage = await response.text(); // Obtém o corpo da resposta em caso de erro
                alert(`Erro ao gerar o token: ${errorMessage}`);
            }
        } catch (error) {
            console.log("Erro ao gerar o token:", error);
            alert("Erro ao gerar o token. Por favor, tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className='article-settings-content'>
            <h1>Profile</h1>
            <div className="user-info-image-content">
                <div className="information-user-content">
                    <div>
                        <span>Username</span>
                        <p>{userData.username}</p>
                    </div>
                    <div>
                        <span>First name</span>
                        <p>{userData.firstName}</p>
                    </div>
                    <div>
                        <span>Last name</span>
                        <p>{userData.lastName}</p>
                    </div>
                    <div>
                        <span>Email</span>
                        <p>{userData.email}</p>
                    </div>
                    <div>
                        <span>Birth</span>
                        <p>{userData.birth}</p>
                    </div>
                    <div>
                        <span>Creation Account</span>
                        <p>{userData.creationAccount}</p>
                    </div>
                    <div className="addBtn">
                        <button onClick={() => openModalUserUpdate(setModalIsOpen, setEditUser, userData)}>Update!</button>
                    </div>
                </div>
                <div className="userImage">
                    <h2>Profile picture</h2>
                    <div className="image">
                        <img src={user} alt="user" />
                        <div className="editIcon">
                            <img src={edit} alt="edit" />
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onClose={() => {
                closeModalUserUpdate(setModalIsOpen),
                    setShowUpdateScreen(false)
            }}>
                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                )}
                {showUpdateScreen ? (
                <div className="password-update-modal">
                    <h5>Update Password</h5>
                    <p>Enter the email where you want<br /> to receive the token</p>

                    <InputField
                        id="email"
                        label="Email"
                        value={editUser.email}
                        onChange={(e) => setEditUser((prev) => ({ ...prev, email: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('emailLabel')}
                        onMouseLeave={() => handleInputBlur('emailLabel')}
                    />

                    <div className="btnSave">
                        <button onClick={() => tokenMail({ email: editUser.email })}>Send!</button>
                    </div>
                </div>
                ) : (
                <>

                    <InputField
                        id="username"
                        label="Username"
                        value={editUser.username}
                        onChange={(e) => setEditUser((prev) => ({ ...prev, username: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('usernameLabel')}
                        onMouseLeave={() => handleInputBlur('usernameLabel')}
                    />
                    <InputField
                        id="firstName"
                        label="First name"
                        value={editUser.firstName}
                        onChange={(e) => setEditUser((prev) => ({ ...prev, firstName: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('firstNameLabel')}
                        onMouseLeave={() => handleInputBlur('firstNameLabel')}
                    />
                    <InputField
                        id="lastName"
                        label="Last name"
                        value={editUser.lastName}
                        onChange={(e) => setEditUser((prev) => ({ ...prev, lastName: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('lastNameLabel')}
                        onMouseLeave={() => handleInputBlur('lastNameLabel')}
                    />
                    <InputField
                        id="email"
                        label="Email"
                        value={editUser.email}
                        onChange={(e) => setEditUser((prev) => ({ ...prev, email: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('emailLabel')}
                        onMouseLeave={() => handleInputBlur('emailLabel')}
                    />
                    <InputField
                        id="birth"
                        label="Birth"
                        value={editUser.birth}
                        onChange={(e) => setEditUser((prev) => ({ ...prev, birth: e.target.value }))}
                        onMouseEnter={() => handleInputFocus('birthLabel')}
                        onMouseLeave={() => handleInputBlur('birthLabel')}
                    />
                    <div className="btnAlign">
                        <div className="btnSave">
                            <button onClick={() => handleUpdateUserAction(editUser, token)}>Update!</button>
                        </div>
                        <div className="btnSave">
                            <button onClick={() => setShowUpdateScreen(true)}>More!</button>
                        </div>
                    </div>
                </>
                )}
            </Modal>
        </article>
    )
}