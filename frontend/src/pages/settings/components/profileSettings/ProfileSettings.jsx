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
            <Modal isOpen={modalIsOpen} onClose={() => closeModalUserUpdate(setModalIsOpen)}>
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

                <div className="btnSave">
                    <button onClick={() => handleUpdateUserAction(editUser, token)}>Update!</button>
                </div>
            </Modal>
        </article>
    )
}