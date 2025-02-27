import User from "../../../assets/Icons/User.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import  './ProfileDropdown.css'

const ProfileDropdown = () => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsDropdownOpen(false);
        navigate("/login");
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

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
                    <a
                        href="#"
                        onClick={handleLogout}
                        className="dropdown-item"
                    >
                        {t("navbar.logout", "Logout")}
                    </a>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
