import { Link } from "react-router-dom"
export const Aside = () => (
    <aside className="aside-settings-content">
        <ul className="aside-ul-settings-content">
            <li>
                <Link className="active">
                    Profile
                </Link>
            </li>
            <li>
                <Link className="noActive">
                    Request Configurations
                </Link>
            </li>
        </ul>
    </aside>
)