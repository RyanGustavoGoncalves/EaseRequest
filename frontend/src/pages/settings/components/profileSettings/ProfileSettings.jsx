import { useState, useEffect } from "react";
import { FetchUser } from "../../../home/components/utils/getInfoUser/FetchUser";

import user from '../../assets/perfil.png';
import edit from '../../assets/edit.png'

export const ProfileSettings = () => {

    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState({});

    useEffect(() => {
        FetchUser(token, setUserData);
    }, [token]);

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
                        <button>Update!</button>
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
        </article>
    )
}