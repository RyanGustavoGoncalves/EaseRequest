import { Link } from "react-router-dom";

export const Aside = ({ select, setSelect }) => {
    const changeSelectNumber = (value) => {
        setSelect(value);
    };

    return (
        <aside className="aside-settings-content">
            <ul className="aside-ul-settings-content">
                <li>
                    <Link onClick={() => changeSelectNumber(0)} className={select === 0 ? "active" : "noActive"}>
                        Profile
                    </Link>
                </li>
                <li>
                    <Link onClick={() => changeSelectNumber(1)} className={select === 1 ? "active" : "noActive"}>
                        Request Configurations
                    </Link>
                </li>
            </ul>
        </aside>
    );
};
