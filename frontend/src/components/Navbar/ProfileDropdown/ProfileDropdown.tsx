import User from "../../../assets/Icons/User.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import  './ProfileDropdown.css'
import useLogout from "../../../hooks/useLogout.ts";
import {useSelector} from "react-redux";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter.ts";

const ProfileDropdown = () => {
    const { logout, loading, error, data } = useLogout()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    useOutsideAlerter(dropdownRef, () => {setIsDropdownOpen(false)});
    const { t } = useTranslation();

    const account = useSelector((state) => state.accounts.user)
    const navigate = useNavigate()

    useEffect(() => {
        if (!account) {
            navigate('/login')
        }
    }, [account, navigate]);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout()
    };

    return (
        <div
            className="profile-dropdown"
            ref={dropdownRef}
            title="User Menu"
        >
            <img
                src={User}
                alt="User"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            {isDropdownOpen && (
                <div
                    className="dropdown-menu"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleLogout}
                        className="dropdown-item"
                    >
                        {t("navbar.logout", "Logout")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
